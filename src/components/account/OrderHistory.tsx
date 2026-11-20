import { Link } from "@tanstack/react-router";
import { Package, Truck, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function OrderHistory() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Loading orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
        <h3 className="font-syne font-bold text-base text-foreground mb-1">
          No orders placed yet
        </h3>
        <p className="text-xs text-muted-foreground mb-6">
          When you purchase hardware kits or tools, your live tracking and receipts will appear here.
        </p>
        <Link
          to="/shop"
          className="px-5 py-2.5 rounded-xl bg-[#A3E635] text-black font-semibold text-xs"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-500 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" /> In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold font-syne text-foreground">
          Recent Orders ({orders.length})
        </h2>
        <span className="text-xs text-muted-foreground">Updated in real-time</span>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Shipping</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-foreground">
                    {order.id}
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-4 px-4 text-muted-foreground text-xs">
                    {order.shipping_method || "Standard"}
                  </td>
                  <td className="py-4 px-4 font-bold text-foreground">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to="/order/$id"
                      params={{ id: order.id }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors"
                    >
                      Receipt <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
