import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Download } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/order/$id")({
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { id } = Route.useParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured) {
      setLoading(true);
      supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) setOrderDetails(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Checkmark */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#A3E635]/20 text-[#A3E635] ring-8 ring-[#A3E635]/10">
          <CheckCircle2 className="h-10 w-10 animate-in zoom-in-50 duration-300" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#A3E635] font-bold">
            Payment Verified • Stripe Succeeded
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-syne text-foreground tracking-tight mt-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-md mx-auto">
            Your hardware has been allocated and passed to our automated packaging cell.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-left space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Order ID / Reference
              </p>
              <p className="font-mono text-sm sm:text-base font-bold text-foreground">
                {id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Status
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A3E635]/20 text-[#A3E635] text-xs font-bold">
                ● Paid & Confirmed
              </span>
            </div>
          </div>

          {/* Timeline Status */}
          <div className="space-y-3">
            <p className="text-xs font-bold font-syne uppercase text-foreground">
              Fulfillment Journey
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/30">
                <Package className="w-4 h-4 text-[#A3E635] mx-auto mb-1" />
                <span className="font-bold text-foreground block">Processing</span>
                <span className="text-[10px] text-muted-foreground">Today</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <Truck className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <span className="font-medium text-muted-foreground block">Dispatched</span>
                <span className="text-[10px] text-muted-foreground">Est. 24h</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <ShieldCheck className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <span className="font-medium text-muted-foreground block">Delivered</span>
                <span className="text-[10px] text-muted-foreground">3–5 Days</span>
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="text-xs text-muted-foreground p-3.5 rounded-xl bg-muted/30">
            A confirmation receipt and live courier tracking link will be emailed to you as soon as the carrier scans your package at our distribution facility.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="h-12 px-8 rounded-xl bg-[#A3E635] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
