import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useWishlistProducts, useWishlistStore } from "@/hooks/useWishlist";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export function WishlistTab() {
  const products = useWishlistProducts();
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const addItem = useCartStore((s) => s.addItem);

  if (products.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
        <h3 className="font-syne font-bold text-base text-foreground mb-1">
          Your Wishlist is Empty
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          Heart items across the store to save modules and kits for upcoming builds.
        </p>
        <Link
          to="/shop"
          className="px-5 py-2.5 rounded-xl bg-[#A3E635] text-black font-semibold text-xs"
        >
          Browse Components
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      title: product.title,
      price: product.price / 100,
      quantity: 1,
      image: product.product_images?.[0]?.url,
      slug: product.slug,
    });
    toast.success(`Moved ${product.title} to your bag!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold font-syne text-foreground">
          Saved Hardware ({products.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-4 space-y-3"
          >
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted relative">
              <img
                src={
                  product.product_images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
                }
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-md text-red-500 hover:scale-110 transition-all"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {product.brand}
              </span>
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="block text-sm font-semibold font-syne text-foreground truncate hover:text-[#A3E635] transition-colors"
              >
                {product.title}
              </Link>
              <p className="text-sm font-bold text-foreground mt-1">
                {formatPrice(product.price)}
              </p>
            </div>

            <button
              onClick={() => handleAddToCart(product)}
              className="w-full h-10 rounded-xl bg-[#A3E635] text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Bag
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
