import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Truck, ArrowRight, Download } from "lucide-react";

export const Route = createFileRoute("/order/$id")({
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { id } = Route.useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Checkmark */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#A3E635]/20 text-[#A3E635] ring-8 ring-[#A3E635]/10 animate-in zoom-in duration-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#A3E635] font-bold">
            Order Confirmed • Stripe Succeeded
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-syne text-foreground tracking-tight mt-2">
            Thank you for your order!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-md mx-auto">
            Your hardware has been reserved. Our warehouse team is preparing your package for dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-left space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Order Reference
              </p>
              <p className="font-mono text-sm sm:text-base font-bold text-foreground">
                {id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Payment Status
              </p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A3E635]/20 text-[#A3E635] text-xs font-bold">
                ● Paid (Stripe)
              </span>
            </div>
          </div>

          {/* Timeline Status */}
          <div className="space-y-3">
            <p className="text-xs font-bold font-syne uppercase text-foreground">
              Fulfillment Timeline
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/30">
                <Package className="w-4 h-4 text-[#A3E635] mx-auto mb-1" />
                <span className="font-bold text-foreground block">Processing</span>
                <span className="text-[10px] text-muted-foreground">Today</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <Truck className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <span className="font-medium text-muted-foreground block">Shipped</span>
                <span className="text-[10px] text-muted-foreground">Est. 24h</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <span className="font-medium text-muted-foreground block">Delivered</span>
                <span className="text-[10px] text-muted-foreground">3–5 Days</span>
              </div>
            </div>
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
