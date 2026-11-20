import { DollarSign, ShoppingBag, Cpu, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function SalesDashboard() {
  const metrics = [
    {
      label: "Total Gross Revenue",
      value: "$48,920.00",
      change: "+24.8% this month",
      icon: DollarSign,
      color: "text-[#A3E635]",
    },
    {
      label: "Fulfillments & Orders",
      value: "312",
      change: "+18 new today",
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      label: "Active Hardware SKUs",
      value: "24",
      change: "Across 4 categories",
      icon: Cpu,
      color: "text-purple-400",
    },
    {
      label: "Low Stock Watchlist",
      value: "2 SKUs",
      change: "Below 10 units",
      icon: AlertTriangle,
      color: "text-amber-400",
    },
  ];

  // Simulated 7-day revenue trend data
  const days = [
    { day: "Mon", revenue: 5400, height: "60%" },
    { day: "Tue", revenue: 6800, height: "75%" },
    { day: "Wed", revenue: 8200, height: "90%" },
    { day: "Thu", revenue: 4900, height: "55%" },
    { day: "Fri", revenue: 9400, height: "100%" },
    { day: "Sat", revenue: 7600, height: "82%" },
    { day: "Sun", revenue: 6620, height: "72%" },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border bg-card space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {m.label}
                </span>
                <div className={`p-2 rounded-xl bg-muted/40 ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black font-syne text-foreground tracking-tight">
                  {m.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>{m.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Activity & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Bar Graph */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-syne font-bold text-base text-foreground">
                Weekly Revenue Velocity
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Stripe sales volume for the last 7 rolling days
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#A3E635] bg-[#A3E635]/15 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +19.4%
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-border/50 pb-2">
            {days.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex justify-center items-end h-32">
                  <div
                    className="w-full max-w-[36px] bg-[#A3E635] rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                    style={{ height: d.height }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Operations Feed */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-border bg-card space-y-4">
          <h3 className="font-syne font-bold text-base text-foreground">
            Fulfillment Queue
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <div className="flex justify-between font-semibold text-foreground">
                <span>6-DOF Robotic Arm Kit</span>
                <span className="text-[#A3E635]">$249.99</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Order MST-L4P8Z9 • Express Priority Air
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <div className="flex justify-between font-semibold text-foreground">
                <span>Arduino Mega 2560 Pro Kit</span>
                <span className="text-[#A3E635]">$89.99</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Order MST-A2109X • Standard Delivery
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <div className="flex justify-between font-semibold text-foreground">
                <span>Rigol 100MHz Oscilloscope</span>
                <span className="text-[#A3E635]">$299.99</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Order MST-R88902 • Awaiting Dispatch Scan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
