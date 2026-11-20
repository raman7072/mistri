import { Link } from "@tanstack/react-router";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import { validatePromoCode } from "@/lib/stripe";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const freeShippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );
  const freeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShippingUnlocked ? 0 : SHIPPING_COST;
  const total = Math.max(0, subtotal - discount) + shipping;

  const handlePromoApply = () => {
    if (!promoCode.trim()) return;
    const result = validatePromoCode(promoCode, subtotal);
    if (result.valid) {
      setPromoApplied(true);
      setDiscount(result.discount);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 flex flex-col bg-background border-l border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <h2 className="font-syne font-semibold text-foreground text-lg">
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#A3E635] text-black text-[11px] font-bold">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="relative">
                  <ShoppingCart className="w-20 h-20 text-muted/50" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">
                    0
                  </span>
                </div>
                <div>
                  <p className="font-syne font-semibold text-foreground text-lg">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add some awesome products to get started!
                  </p>
                </div>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#A3E635] text-black text-sm font-semibold hover:bg-[#A3E635]/90 transition-colors"
                >
                  Browse Shop
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="px-5 py-3 border-b border-border shrink-0 bg-muted/30">
                  {freeShippingUnlocked ? (
                    <p className="text-sm font-medium text-center text-[#A3E635]">
                      🎉 Free shipping unlocked!
                    </p>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground mb-2 text-center">
                        Add{" "}
                        <span className="font-semibold text-foreground">
                          ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}
                        </span>{" "}
                        more for free shipping
                      </p>
                      <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-[#A3E635] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${freeShippingProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground leading-tight truncate">
                                {item.title}
                              </p>
                              {item.variantTitle && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.variantTitle}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors shrink-0"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Qty controls */}
                            <div className="flex items-center gap-1 border border-border rounded-md">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-sm font-medium text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <p className="text-sm font-semibold text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-5 py-4 space-y-4 shrink-0">
                  {/* Promo code */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code"
                        className={cn(
                          "w-full pl-9 pr-3 py-2 rounded-md border text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none transition-colors",
                          promoApplied
                            ? "border-[#A3E635] bg-[#A3E635]/5"
                            : "border-border focus:border-[#A3E635]"
                        )}
                        disabled={promoApplied}
                      />
                    </div>
                    <button
                      onClick={handlePromoApply}
                      disabled={promoApplied || !promoCode.trim()}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                        promoApplied
                          ? "bg-[#A3E635]/20 text-[#A3E635] cursor-default"
                          : "bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      {promoApplied ? "Applied ✓" : "Apply"}
                    </button>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="text-foreground font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[#A3E635] font-semibold text-xs">
                        <span>Discount ({promoCode.toUpperCase()})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span
                        className={cn(
                          "font-medium",
                          freeShippingUnlocked
                            ? "text-[#A3E635]"
                            : "text-foreground"
                        )}
                      >
                        {freeShippingUnlocked
                          ? "Free"
                          : `$${SHIPPING_COST.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-semibold text-foreground text-base">
                      <span>Estimated Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#A3E635] text-black font-semibold text-sm hover:bg-[#A3E635]/90 active:scale-[0.98] transition-all"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="flex items-center justify-center w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
