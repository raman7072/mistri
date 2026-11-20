export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  position: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  sku: string | null;
  price: number; // cents
  stock: number;
  options: Record<string, string>;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number; // cents
  compare_at_price: number | null;
  category_id: string | null;
  brand: string | null;
  is_featured: boolean;
  status: "draft" | "active" | "archived";
  tags: string[] | null;
  weight_grams: number | null;
  created_at: string;
  updated_at: string;
  // joined
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
  categories?: Category | null;
  avg_rating?: number;
  review_count?: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  minRating?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
}
