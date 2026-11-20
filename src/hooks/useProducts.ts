import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Product, Category, ProductFilters } from "@/types/product";
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from "@/lib/mockData";

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return SAMPLE_PRODUCTS.filter((p) => p.is_featured);
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*), product_variants(*), categories(*)")
          .eq("is_featured", true)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(8);

        if (error || !data || data.length === 0) {
          return SAMPLE_PRODUCTS.filter((p) => p.is_featured);
        }
        return data as Product[];
      } catch {
        return SAMPLE_PRODUCTS.filter((p) => p.is_featured);
      }
    },
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return SAMPLE_CATEGORIES;
      }

      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (error || !data || data.length === 0) {
          return SAMPLE_CATEGORIES;
        }
        return data as Category[];
      } catch {
        return SAMPLE_CATEGORIES;
      }
    },
  });
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return filterMockProducts(filters);
      }

      try {
        let query = supabase
          .from("products")
          .select("*, product_images(*), product_variants(*), categories(*)")
          .eq("status", "active");

        if (filters.search) {
          query = query.ilike("title", `%${filters.search}%`);
        }
        if (filters.category) {
          query = query.eq("categories.slug", filters.category);
        }
        if (filters.minPrice !== undefined) {
          query = query.gte("price", filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query = query.lte("price", filters.maxPrice);
        }
        if (filters.brand) {
          query = query.eq("brand", filters.brand);
        }

        const [sortField, sortDir] = (filters.sort || "created_at:desc").split(":");
        query = query.order(sortField as string, { ascending: sortDir === "asc" });

        const { data, error } = await query.limit(48);
        if (error || !data || data.length === 0) {
          return filterMockProducts(filters);
        }
        return data as Product[];
      } catch {
        return filterMockProducts(filters);
      }
    },
  });
}

export function useProduct(slug: string) {
  return useQuery<Product | null>({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return SAMPLE_PRODUCTS.find((p) => p.slug === slug) || null;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*), product_variants(*), categories(*)")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          return SAMPLE_PRODUCTS.find((p) => p.slug === slug) || null;
        }
        return data as Product;
      } catch {
        return SAMPLE_PRODUCTS.find((p) => p.slug === slug) || null;
      }
    },
  });
}

function filterMockProducts(filters: ProductFilters): Product[] {
  let list = [...SAMPLE_PRODUCTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.category) {
    const cat = SAMPLE_CATEGORIES.find((c) => c.slug === filters.category);
    if (cat) {
      list = list.filter((p) => p.category_id === cat.id);
    }
  }

  if (filters.minPrice !== undefined) {
    list = list.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.brand) {
    list = list.filter((p) => p.brand === filters.brand);
  }

  if (filters.sort) {
    const [field, dir] = filters.sort.split(":");
    list.sort((a, b) => {
      let valA = (a as unknown as Record<string, number>)[field] || 0;
      let valB = (b as unknown as Record<string, number>)[field] || 0;
      return dir === "asc" ? valA - valB : valB - valA;
    });
  }

  return list;
}
