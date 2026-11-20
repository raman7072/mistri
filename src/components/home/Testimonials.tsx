import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Dr. Elena Vance",
    role: "Robotics Research Fellow, MIT",
    avatar: "EV",
    rating: 5,
    text: "The 6-DOF Robotic Arm Kit arrived impeccably packaged with clean documentation. Calibrating inverse kinematics in ROS2 was seamless. Mistri is officially our lab's go-to supplier.",
  },
  {
    name: "Karan Patel",
    role: "IoT Solutions Architect",
    avatar: "KP",
    rating: 5,
    text: "Ordered the Zigbee Hub Pro and 4 smart dimmer packs. Everything integrated with Home Assistant without touching the cloud. The tactile quality of the hardware is unmatched.",
  },
  {
    name: "Marcus Lindqvist",
    role: "FPV Drone Racer & Builder",
    avatar: "ML",
    rating: 5,
    text: "Best solder joints and genuine components I've bought online. The Hakko station heats up in literally 8 seconds. Super fast express shipping to Sweden too!",
  },
  {
    name: "Sarah Chen",
    role: "Hardware Hacker & Maker",
    avatar: "SC",
    rating: 5,
    text: "The Raspberry Pi 5 Robotics bundle saved me weeks of sourcing parts individually. Camera latency is ultra-low and the heatsink case keeps it under 50°C under full compute load.",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  const next = () =>
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[current];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold font-syne tracking-tight text-foreground">
          What Our Community Says
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mt-2">
          From student dorms to high-precision aerospace labs.
        </p>
      </div>

      <div className="relative rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-sm">
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-6">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Quote text */}
        <blockquote className="text-lg sm:text-2xl font-medium text-foreground leading-relaxed font-syne mb-8">
          "{t.text}"
        </blockquote>

        {/* Author info */}
        <div className="flex items-center justify-between border-t border-border pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#A3E635] text-black font-bold font-syne text-sm">
              {t.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold font-syne text-foreground text-sm sm:text-base">
                {t.name}
                <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t.role}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors text-foreground"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-[#A3E635]" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
