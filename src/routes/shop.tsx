import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, Search, X } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductCard } from "@/components/shop/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SORT_OPTIONS } from "@/lib/constants";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("created_at:desc");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(100000); // in cents ($1000)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data: categories } = useCategories();
  const { data: products, isLoading } = useProducts({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchQuery || undefined,
    sort: selectedSort,
    brand: selectedBrand === "all" ? undefined : selectedBrand,
    maxPrice: maxPriceFilter,
  });

  // Extract unique brands
  const brands = useMemo(() => {
    if (!products) return [];
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedBrand("all");
    setMaxPriceFilter(100000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-syne text-foreground tracking-tight">
          Hardware Catalog
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-2">
          Explore all 24 curated robotics kits, smart home systems, precision components, and maker gadgets.
        </p>
      </div>

      {/* Search and Mobile Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parts, chips, kits..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden flex items-center gap-2 h-11 px-4 rounded-xl border border-border bg-card text-foreground text-sm font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden md:inline">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="h-11 px-3.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside
          className={`lg:block ${
            mobileFilterOpen
              ? "block fixed inset-0 z-50 bg-background p-6 overflow-y-auto"
              : "hidden"
          }`}
        >
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border lg:hidden">
              <h2 className="text-lg font-bold font-syne text-foreground">Filters</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Category Filter */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-syne font-bold text-sm text-foreground mb-3 uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-[#A3E635] text-black font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  All Categories
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? "bg-[#A3E635] text-black font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-syne font-bold text-sm text-foreground uppercase tracking-wider">
                  Max Price
                </h3>
                <span className="text-sm font-semibold text-foreground">
                  ${(maxPriceFilter / 100).toFixed(0)}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-[#A3E635]"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>$10</span>
                <span>$1,000</span>
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-syne font-bold text-sm text-foreground mb-3 uppercase tracking-wider">
                  Brand
                </h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedBrand("all")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedBrand === "all"
                        ? "bg-[#A3E635] text-black font-semibold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedBrand === b
                          ? "bg-[#A3E635] text-black font-semibold"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Filters button */}
            <button
              onClick={resetFilters}
              className="w-full h-10 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{products?.length || 0}</strong> products
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-dashed border-border bg-card/50">
              <Filter className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="font-syne font-bold text-lg text-foreground mb-1">
                No matching hardware found
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Try loosening your filters or clearing search terms to see available components.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#A3E635] text-black font-semibold text-xs hover:bg-[#A3E635]/90 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
