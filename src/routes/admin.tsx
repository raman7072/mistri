import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  PlusCircle,
  Shield,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { SalesDashboard } from "@/components/admin/SalesDashboard";
import { ProductTable } from "@/components/admin/ProductTable";
import { ListingWizard } from "@/components/admin/ListingWizard";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  useSEO({
    title: "Storefront Administration | Mistri",
    description: "Mistri operations portal: real-time sales metrics, inventory management, and multi-step product listing wizard.",
  });
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "add">("dashboard");

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#A3E635]">
              Operations Control
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#A3E635]/15 text-[#A3E635] text-[10px] font-bold font-mono">
              Role: Admin
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-syne text-foreground tracking-tight mt-1">
            Storefront Administration
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A3E635] text-black text-xs font-semibold hover:bg-[#A3E635]/90 transition-all shadow-sm"
          >
            Live Storefront
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-muted rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 py-2 text-xs font-bold font-syne rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "dashboard"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Overview
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 py-2 text-xs font-bold font-syne rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "inventory"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Boxes className="w-3.5 h-3.5" /> Inventory
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 py-2 text-xs font-bold font-syne rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "add"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "dashboard" && <SalesDashboard />}
        {activeTab === "inventory" && <ProductTable />}
        {activeTab === "add" && (
          <ListingWizard onSuccess={() => setActiveTab("inventory")} />
        )}
      </div>
    </div>
  );
}
