import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingCart,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/shop/ProductCard";
import { ReviewsList } from "@/components/product/ReviewsList";
import { ReviewForm } from "@/components/product/ReviewForm";

export const Route = createFileRoute("/product/$slug")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(slug);
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "shipping" | "reviews">("specs");

  // Fetch related products in the same category
  const { data: relatedProducts } = useProducts({
    category: product?.categories?.slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold font-syne mb-2">Product Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">
          The requested hardware unit doesn't exist or has been phased out.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded-xl bg-[#A3E635] text-black font-semibold text-sm"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const variants = product.product_variants || [];
  const selectedVariant = variants[selectedVariantIndex];
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock ?? 30;
  const mainImage =
    product.product_images?.[0]?.url ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80";

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant?.id || "default"}`,
      productId: product.id,
      variantId: selectedVariant?.id,
      variantTitle: selectedVariant?.title,
      title: product.title,
      price: currentPrice / 100,
      quantity,
      image: mainImage,
      slug: product.slug,
    });
    toast.success(`Added ${quantity}x ${product.title} to bag!`, {
      description: formatPrice(currentPrice * quantity),
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate({ to: "/checkout" });
  };

  const filteredRelated = relatedProducts
    ?.filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden border border-border bg-card relative">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {product.is_featured && (
              <Badge className="absolute top-4 left-4" variant="default">
                Featured Innovation
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Info and Purchase Controls */}
        <div className="flex flex-col">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
              {product.brand || "Mistri Pro Lab"}
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-foreground">
                {product.avg_rating || 4.9}
              </span>
              <span className="text-muted-foreground">
                ({product.review_count || 48} reviews)
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold font-syne text-foreground tracking-tight mb-4">
            {product.title}
          </h1>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-foreground font-syne">
              {formatPrice(currentPrice)}
            </span>
            {product.compare_at_price && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
            <Badge variant="accent" className="ml-2">
              In Stock ({currentStock} available)
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Variants (if available) */}
          {variants.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs uppercase font-bold tracking-wider text-foreground mb-3">
                Configuration / Tier
              </label>
              <div className="grid grid-cols-2 gap-3">
                {variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedVariantIndex === i
                        ? "border-[#A3E635] bg-[#A3E635]/10 text-foreground ring-1 ring-[#A3E635]"
                        : "border-border bg-card text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    <div className="text-sm font-semibold text-foreground">
                      {v.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatPrice(v.price)} • {v.stock} in stock
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Quantity Counter */}
            <div className="flex items-center border border-border rounded-xl h-12 bg-card px-2 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground font-bold"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-bold text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground font-bold"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-xl bg-card border border-border hover:bg-muted text-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Bag
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="flex-1 h-12 rounded-xl bg-[#A3E635] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20 active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              Buy Now
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 py-6 border-y border-border text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-[#A3E635]" />
              <span className="text-xs font-semibold text-foreground">Free Shipping</span>
              <span className="text-[10px] text-muted-foreground">Orders over $50</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-[#A3E635]" />
              <span className="text-xs font-semibold text-foreground">2-Year Warranty</span>
              <span className="text-[10px] text-muted-foreground">Full hardware replacement</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw className="w-5 h-5 text-[#A3E635]" />
              <span className="text-xs font-semibold text-foreground">30-Day Returns</span>
              <span className="text-[10px] text-muted-foreground">Zero restocking fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specs / Shipping / Reviews */}
      <div className="mb-20">
        <div className="flex border-b border-border gap-8 mb-8">
          {(["specs", "shipping", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold font-syne uppercase tracking-wider transition-colors relative ${
                activeTab === tab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "specs" && "Technical Specifications"}
              {tab === "shipping" && "Shipping & Delivery"}
              {tab === "reviews" && `Reviews (${product.review_count || 48})`}
              {activeTab === tab && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#A3E635]" />
              )}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Manufacturer</span>
                <span className="font-semibold text-foreground">{product.brand || "Mistri"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Item Weight</span>
                <span className="font-semibold text-foreground">
                  {product.weight_grams ? `${product.weight_grams}g` : "650g"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Operating Voltage</span>
                <span className="font-semibold text-foreground">3.3V – 5.0V Logic / 12V Motor</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Firmware Compatibility</span>
                <span className="font-semibold text-foreground">Arduino C++, MicroPython, CircuitPython</span>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                All orders are dispatched from our automated robotics fulfillment center within 24 hours of payment confirmation.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Standard Shipping (5–7 business days): Free on orders over $50, else $5.99.</li>
                <li>Express Air Priority (1–2 business days): $14.99 worldwide.</li>
                <li>Each order includes a live GPS tracking link and tamper-evident packaging.</li>
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              <ReviewsList
                productId={product.id}
                avgRating={product.avg_rating}
                totalReviews={product.review_count}
              />
              <div className="pt-6 border-t border-border">
                <ReviewForm productId={product.id} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {filteredRelated && filteredRelated.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold font-syne text-foreground mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRelated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
