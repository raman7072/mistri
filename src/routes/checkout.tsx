import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  CreditCard,
  Lock,
  Truck,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const freeShipping = subtotal >= 50;
  const shippingFee = shippingMethod === "express" ? 14.99 : freeShipping ? 0 : 5.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const grandTotal = Number((subtotal + shippingFee + tax).toFixed(2));

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold font-syne mb-2">Your Bag is Empty</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Add items before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded-xl bg-[#A3E635] text-black font-semibold text-sm"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.address || !formData.firstName) {
      toast.error("Please fill in all required shipping fields");
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      clearCart();
      setIsProcessing(false);
      toast.success("Payment authorized successfully!");
      navigate({ to: "/order/$id", params: { id: orderId } });
    }, 1500);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Shipping & Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-foreground tracking-tight">
              Express Checkout
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Encrypted 256-bit Stripe connection. Test payments active.
            </p>
          </div>

          <form onSubmit={handleCompleteOrder} className="space-y-6">
            {/* Contact */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-base font-bold font-syne text-foreground">
                1. Contact Information
              </h2>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@maker.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-base font-bold font-syne text-foreground">
                2. Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="123 Silicon Boulevard, Suite 400"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <h2 className="text-base font-bold font-syne text-foreground">
                3. Delivery Speed
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShippingMethod("standard")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    shippingMethod === "standard"
                      ? "border-[#A3E635] bg-[#A3E635]/10 ring-1 ring-[#A3E635]"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">Standard Delivery</span>
                    <span className="text-xs font-bold text-[#A3E635]">
                      {freeShipping ? "FREE" : "$5.99"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">5–7 business days</p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod("express")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    shippingMethod === "express"
                      ? "border-[#A3E635] bg-[#A3E635]/10 ring-1 ring-[#A3E635]"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">Priority Express Air</span>
                    <span className="text-xs font-bold text-foreground">$14.99</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">1–2 business days</p>
                </button>
              </div>
            </div>

            {/* Payment Method (Stripe Test) */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold font-syne text-foreground">
                  4. Payment Details
                </h2>
                <span className="inline-flex items-center gap-1 text-xs text-[#A3E635]">
                  <Lock className="w-3.5 h-3.5" />
                  Stripe Test Mode
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Card Number (Auto-filled with Test Card)</span>
                  <div className="flex items-center gap-1 font-mono text-foreground font-semibold">
                    <CreditCard className="w-4 h-4 text-[#A3E635]" />
                    •••• 4242
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Expires: </span>
                    <span className="font-mono text-foreground font-semibold">12/28</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CVC: </span>
                    <span className="font-mono text-foreground font-semibold">•••</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-14 rounded-2xl bg-[#A3E635] text-black font-extrabold text-base flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-lg shadow-[#A3E635]/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? (
                "Authorizing Payment..."
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ${grandTotal.toFixed(2)} with Stripe
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-6">
            <h2 className="text-lg font-bold font-syne text-foreground">
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            {/* Items list */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 border-b border-border pb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover border border-border bg-muted shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </h3>
                    {item.variantTitle && (
                      <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground">
                  {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (8%)</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-4 border-t border-border">
                <span>Total Amount</span>
                <span className="text-xl font-extrabold font-syne text-[#A3E635]">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-[#A3E635] shrink-0" />
              <span>Payments are processed securely via Stripe. Your card data never touches our server.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
