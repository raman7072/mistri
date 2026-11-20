"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useCategories } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FALLBACK_CATEGORIES = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    description: "Chips, boards, sensors and more",
  },
  {
    id: "2",
    name: "Robotics",
    slug: "robotics",
    image_url:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    description: "Build your first robot today",
  },
  {
    id: "3",
    name: "Smart Home",
    slug: "smart-home",
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    description: "Automate your living space",
  },
  {
    id: "4",
    name: "Dev Kits",
    slug: "dev-kits",
    image_url:
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80",
    description: "Arduino, Raspberry Pi & more",
  },
];

export function CategoryBento() {
  const { data: categories, isLoading } = useCategories();
  const displayCategories =
    categories && categories.length > 0
      ? categories.slice(0, 4)
      : FALLBACK_CATEGORIES;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* Section heading */}
      <div className="mb-12">
        <h2 className="font-syne text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Shop by{" "}
          <span className="relative inline-block">
            Category
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[#A3E635]"
            />
          </span>
        </h2>
        <p className="font-geist mt-3 text-muted-foreground">
          Explore our curated collections built for makers and tinkerers.
        </p>
      </div>

      {/* Bento grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
          <Skeleton className="col-span-2 row-span-2 h-80 rounded-2xl md:h-auto" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2 md:h-[520px]">
          {displayCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className={
                i === 0
                  ? "col-span-2 row-span-2"
                  : "col-span-1 row-span-1"
              }
            >
              <Link
                to="/shop"
                search={{ category: cat.slug }}
                className="group relative flex h-full min-h-[160px] w-full cursor-pointer items-end overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:border-[#A3E635] hover:shadow-lg hover:shadow-[#A3E635]/10"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{
                    backgroundImage: `url(${(cat as any).image_url || ""})`,
                    backgroundColor: "#1a1a1a",
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Content */}
                <div className="relative z-10 p-5">
                  <p className="font-geist mb-1 text-xs font-medium text-white/60 uppercase tracking-widest">
                    {(cat as any).description || "Shop now"}
                  </p>
                  <h3
                    className={`font-syne font-bold text-white ${
                      i === 0 ? "text-3xl sm:text-4xl" : "text-xl"
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#A3E635] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Browse →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
