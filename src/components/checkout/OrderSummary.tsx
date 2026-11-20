import { useState } from "react";
import { Tag, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "@/types/cart";
import { validatePromoCode } from "@/lib/stripe";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  promoCode: string;
  discount: number;
  onApplyPromo: (code: string, discount: number) => void;
}

export function OrderSummary({
  items,
  subtotal,
  shippingFee,
  tax,
  promoCode,
  discount,
  onApplyPromo,
}: OrderSummaryProps) {
  const [code, setCode] = useState(promoCode);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const result = validatePromoCode(code, subtotal);
    if (result.valid) {
      toast.success(result.message);
      onApplyPromo(code.toUpperCase().trim(), result.discount);
    } else {
      toast.error(result.message);
    }
  };

  const grandTotal = Math.max(0, subtotal - discount) + shippingFee + tax;

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
      <h2 className="text-lg font-bold font-syne text-foreground">
        Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} units)
      </h2>

      {/* Items list */}
      <div className="space-y-4 max-h-72 overflow-y-auto pr-1 border-b border-border pb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img
              src={item.image}
              alt={item.title}
              className="w-14 h-14 rounded-xl object-cover border border-border bg-muted shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-foreground truncate">
                {item.title}
              </h3>
              {item.variantTitle && (
                <p className="text-[11px] text-muted-foreground">{item.variantTitle}</p>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
            </div>
            <div className="text-xs font-bold text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Try MAKER10 or SILICON20"
            className="w-full h-10 pl-8 pr-3 rounded-lg border border-border bg-background text-xs uppercase font-mono text-foreground placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors shrink-0"
        >
          Apply
        </button>
      </form>

      {discount > 0 && (
        <div className="flex items-center justify-between text-xs text-[#A3E635] font-semibold bg-[#A3E635]/10 px-3 py-2 rounded-lg">
          <span>Promo Code ({promoCode})</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}

      {/* Price Calculations */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[#A3E635]">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span>Shipping Fee</span>
          <span className="text-foreground">
            {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Estimated Sales Tax (8%)</span>
          <span className="text-foreground">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm font-bold text-foreground pt-4 border-t border-border">
          <span>Total Authorized Amount</span>
          <span className="text-xl font-extrabold font-syne text-[#A3E635]">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Security Guarantee */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 text-[11px] text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-[#A3E635] shrink-0" />
        <span>End-to-end encrypted 256-bit TLS connection powered by Stripe.</span>
      </div>
    </div>
  );
}
