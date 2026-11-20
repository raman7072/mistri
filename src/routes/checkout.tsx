import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { createCheckoutSession } from "@/lib/stripe";
import { AddressForm } from "@/components/checkout/AddressForm";
import { ShippingMethodSelector } from "@/components/checkout/ShippingMethodSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import type { ShippingAddress } from "@/types/order";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address fields
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  // Pre-fill email and name from auth session if available
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.user_metadata?.full_name) {
      setAddress((prev) => ({
        ...prev,
        fullName: user.user_metadata.full_name,
      }));
    }
  }, [user]);

  const isFreeShipping = subtotal >= 50;
  const shippingFee = shippingMethod === "express" ? 14.99 : isFreeShipping ? 0 : 5.99;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * 0.08).toFixed(2));
  const grandTotal = taxableAmount + shippingFee + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold font-syne mb-2 text-foreground">
          Your Bag is Empty
        </h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
          Please add hardware components to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 rounded-xl bg-[#A3E635] text-black font-semibold text-sm hover:bg-[#A3E635]/90 transition-colors shadow-md"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !address.fullName || !address.line1 || !address.city || !address.postalCode) {
      toast.error("Please fill in all mandatory delivery fields.");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createCheckoutSession({
        cartItems: items,
        shippingAddress: address,
        shippingMethod,
        promoCode,
        customerEmail: email,
      });

      if (result.url) {
        // Redirect to live Stripe Hosted Checkout session
        clearCart();
        window.location.href = result.url;
      } else {
        // Simulated Stripe flow for development mode
        clearCart();
        toast.success("Stripe authorization confirmed! ⚡", {
          description: `Order ${result.orderId} placed in test mode.`,
        });
        navigate({ to: "/order/$id", params: { id: result.orderId } });
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Checkout session error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Multi-step checkout form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-syne text-foreground tracking-tight">
              Hardware Checkout
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Complete your order with encrypted Stripe processing.
            </p>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-base font-bold font-syne text-foreground">
                1. Delivery Destination & Contact
              </h2>
              <AddressForm
                address={address}
                email={email}
                onChange={(fields) => {
                  if (fields.email !== undefined) setEmail(fields.email);
                  setAddress((prev) => ({ ...prev, ...fields }));
                }}
              />
            </div>

            {/* Step 2: Shipping Speed */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <h2 className="text-base font-bold font-syne text-foreground">
                2. Shipping Method
              </h2>
              <ShippingMethodSelector
                selected={shippingMethod}
                onSelect={setShippingMethod}
                isFreeShipping={isFreeShipping}
              />
            </div>

            {/* Step 3: Payment Gateway Info */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold font-syne text-foreground">
                  3. Payment Authorization
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A3E635]/15 text-[#A3E635] text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  Stripe Test Mode Active
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Authorized Cardholder</span>
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
                    <span className="text-muted-foreground">Security: </span>
                    <span className="font-mono text-foreground font-semibold">3D-Secure 2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-14 rounded-2xl bg-[#A3E635] text-black font-extrabold text-base flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-lg shadow-[#A3E635]/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? (
                "Authorizing with Stripe..."
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Authorize ${grandTotal.toFixed(2)} with Stripe
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingFee={shippingFee}
            tax={tax}
            promoCode={promoCode}
            discount={discount}
            onApplyPromo={(code, disc) => {
              setPromoCode(code);
              setDiscount(disc);
            }}
          />
        </div>
      </div>
    </div>
  );
}
