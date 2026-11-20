import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star, Eye, Archive, Trash2, Edit3, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SAMPLE_PRODUCTS } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductTable() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState("");

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_featured: !p.is_featured } : p))
    );
    toast.success("Updated featured status.");
  };

  const toggleArchive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "archived" : "active" }
          : p
      )
    );
    toast.success("Product status toggled.");
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold font-syne text-foreground">
          Inventory Catalog ({filtered.length} SKUs)
        </h2>
        <input
          type="text"
          placeholder="Filter by title, brand, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 h-10 px-3.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => {
                const stockCount = product.product_variants?.[0]?.stock ?? 25;
                const image = product.product_images?.[0]?.url;

                return (
                  <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={image}
                          alt={product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-border bg-muted shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-foreground truncate font-syne">
                            {product.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {product.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-3 px-4 text-muted-foreground font-medium">
                      {product.brand}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-foreground">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          stockCount < 10 ? "text-amber-500 font-bold" : "text-foreground"
                        }`}
                      >
                        {stockCount} units
                      </span>
                    </td>

                    {/* Featured toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          product.is_featured
                            ? "bg-[#A3E635]/20 border-[#A3E635] text-[#A3E635]"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                        title="Toggle Homepage Feature"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          product.status === "active"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to="/product/$slug"
                          params={{ slug: product.slug }}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="View in Store"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => toggleArchive(product.id)}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Archive / Unarchive"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
