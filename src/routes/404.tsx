import { createFileRoute, Link } from "@tanstack/react-router";
import { Cpu, ArrowLeft, Home, Search } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/404")({
  component: NotFoundPage,
});

export function NotFoundPage() {
  useSEO({
    title: "404 — Circuit Not Found",
    description: "The requested schematic or hardware page cannot be found on this bus.",
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-md w-full space-y-6">
        {/* Glowing Circuit Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-[#A3E635]/10 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
          <Cpu className="w-12 h-12" />
          <div className="absolute inset-0 rounded-3xl bg-[#A3E635]/10 blur-xl -z-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#A3E635] font-bold">
            Error 404 • Open Circuit
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-syne text-foreground tracking-tight">
            Signal Lost in Space
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            The bus address you requested returned NULL. The hardware unit might have been relocated or phased out.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#A3E635] text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto h-11 px-6 rounded-xl border border-border hover:bg-muted text-foreground font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
