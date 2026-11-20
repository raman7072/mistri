import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useSEO } from "@/hooks/useSEO";
import { OrderHistory } from "@/components/account/OrderHistory";
import { WishlistTab } from "@/components/account/WishlistTab";
import { AddressBook } from "@/components/account/AddressBook";
import { ProfileForm } from "@/components/account/ProfileForm";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  useSEO({
    title: "Maker Account & Orders | Mistri",
    description: "Manage your order history, track shipments, view your saved wishlist, and update delivery addresses.",
  });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "addresses" | "profile">("orders");
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-border gap-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#A3E635]">
            Account Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-syne text-foreground tracking-tight mt-1">
            Maker Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#A3E635]" />
            Admin Portal
          </Link>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3">
          <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeTab === "orders"
                  ? "bg-[#A3E635] text-black shadow-sm font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              Order History
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeTab === "wishlist"
                  ? "bg-[#A3E635] text-black shadow-sm font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Heart className="w-4 h-4 shrink-0" />
              Saved Wishlist
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeTab === "addresses"
                  ? "bg-[#A3E635] text-black shadow-sm font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              Addresses
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeTab === "profile"
                  ? "bg-[#A3E635] text-black shadow-sm font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              Profile Details
            </button>
          </nav>
        </aside>

        {/* Content Tab Panel */}
        <main className="lg:col-span-9">
          {activeTab === "orders" && <OrderHistory />}
          {activeTab === "wishlist" && <WishlistTab />}
          {activeTab === "addresses" && <AddressBook />}
          {activeTab === "profile" && <ProfileForm />}
        </main>
      </div>
    </div>
  );
}
