import { createFileRoute, Link } from "@tanstack/react-router";
import { Cpu, ShieldCheck, HeartHandshake, Zap, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  useSEO({
    title: "About Mistri — The Silicon & Hardware Revolution",
    description: "Learn about Mistri's mission to democratize verified robotics kits, IoT modules, and open-source electronics for makers.",
  });
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
      {/* Hero / Manifesto */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#A3E635]">
          Our Manifesto
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-syne text-foreground tracking-tight mt-3">
          Democratizing the Hardware Revolution.
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mt-6 leading-relaxed">
          Mistri was founded on a simple truth: software ate the world, but silicon builds the future. We eliminate the frustration of fake chips, broken modules, and missing documentation.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-syne text-foreground">
            Zero Compromise Quality
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every IC and kit in our inventory undergoes electrical pinout checks and firmware flash tests before shipping.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-syne text-foreground">
            Direct Line Sourcing
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We partner directly with leading semiconductor fabricators and robotics labs across the globe.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#A3E635]/10 text-[#A3E635] flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-syne text-foreground">
            Maker Community First
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Open-source schematics, GitHub repositories, and full wiring diagrams provided for every project kit we sell.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
        <h2 className="text-2xl font-bold font-syne text-foreground mb-8 text-center">
          The Mistri Journey
        </h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border">
          <div className="relative pl-10">
            <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#A3E635] ring-4 ring-background" />
            <span className="text-xs font-bold text-[#A3E635] uppercase font-mono">2024</span>
            <h3 className="text-base font-bold text-foreground font-syne mt-0.5">
              The Genesis
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Started in a garage workshop to supply verified robotic actuators and development boards to local university teams.
            </p>
          </div>

          <div className="relative pl-10">
            <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#A3E635] ring-4 ring-background" />
            <span className="text-xs font-bold text-[#A3E635] uppercase font-mono">2025</span>
            <h3 className="text-base font-bold text-foreground font-syne mt-0.5">
              Robotics Expansion
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Launched full 6-DOF robotic arms, AI rover kits, and high-frequency RF oscilloscopes to over 50 countries.
            </p>
          </div>

          <div className="relative pl-10">
            <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#A3E635] ring-4 ring-background" />
            <span className="text-xs font-bold text-[#A3E635] uppercase font-mono">2026</span>
            <h3 className="text-base font-bold text-foreground font-syne mt-0.5">
              Automated Global Dispatch
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Operating automated testing labs with same-day express fulfillment across North America, Europe, and Asia.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#A3E635] text-black font-semibold text-sm hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20"
        >
          Explore the Catalog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
