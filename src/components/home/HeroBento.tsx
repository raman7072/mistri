"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const chips = [
  { label: "24+ Products", emoji: "🔥" },
  { label: "Free Ship over $50", emoji: "🚀" },
  { label: "5★ Reviews", emoji: "⭐" },
];

export function HeroBento() {
  return (
    <section
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(163,230,53,0.08) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Subtle glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(ellipse, #A3E635 0%, transparent 70%)" }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Chips row */}
        <motion.div
          variants={fadeUp}
          className="mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-foreground/80"
            >
              {chip.label} {chip.emoji}
            </span>
          ))}
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="font-syne text-5xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
        >
          The Future
          <br />
          Runs on Silicon.
          <br />
          <span className="relative inline-block text-[#A3E635]">
            Shop Mistri.
            <span
              aria-hidden
              className="absolute -bottom-2 left-0 h-[4px] w-full rounded-full bg-[#A3E635]/40"
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="font-geist mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Premium electronics, robotics kits &amp; smart home gear —{" "}
          <span className="text-foreground">curated for makers.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="min-w-[180px] rounded-full bg-[#A3E635] font-semibold text-black shadow-lg shadow-[#A3E635]/30 transition-all hover:bg-[#b6ef4a] hover:shadow-[#A3E635]/50 active:scale-95"
          >
            <Link to="/shop">Explore Shop</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[180px] rounded-full border-foreground/20 bg-transparent font-semibold transition-all hover:border-[#A3E635] hover:text-[#A3E635] active:scale-95"
          >
            <Link to="/shop">Browse Catalog</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />
    </section>
  );
}
