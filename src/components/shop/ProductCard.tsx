import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const mainImage =
    product.product_images?.[0]?.url ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80";

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      title: product.title,
      price: product.price / 100, // store in dollars
      quantity: 1,
      image: mainImage,
      slug: product.slug,
    });

    toast.success(`Added ${product.title} to bag!`, {
      description: formatPrice(product.price),
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist!", {
      icon: isWishlisted ? "🤍" : "❤️",
    });
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className || ""}`}
    >
      {/* Image Container */}
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative aspect-square w-full overflow-hidden bg-muted"
      >
        <img
          src={mainImage}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <Badge variant="default" className="shadow-sm">
              -{discountPercent}%
            </Badge>
          )}
          {product.is_featured && (
            <Badge variant="secondary" className="backdrop-blur-md bg-background/80 text-xs">
              Featured
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-foreground transition-all hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
          />
        </button>

        {/* Quick View Button overlay */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-background/90 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md border border-border opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:bottom-4 hover:bg-[#A3E635] hover:text-black"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </button>
        )}
      </Link>

      {/* Info Container */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand and rating */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="font-medium tracking-wide uppercase">
            {product.brand || "Mistri Lab"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">
              {product.avg_rating || 4.8}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="mb-2 line-clamp-2 font-syne text-sm font-semibold text-foreground transition-colors hover:text-[#A3E635]"
        >
          {product.title}
        </Link>

        {/* Price and Add button */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to bag`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A3E635] text-black transition-all hover:bg-[#A3E635]/90 hover:scale-105 active:scale-95 shadow-sm"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
