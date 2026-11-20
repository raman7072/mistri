import { Truck, ShieldCheck, RotateCcw, Zap } from "lucide-react";

const VALUES = [
  {
    icon: Truck,
    title: "Express & Free Shipping",
    description:
      "Complimentary standard shipping on all orders over $50. Priority next-day delivery available worldwide.",
  },
  {
    icon: ShieldCheck,
    title: "100% Genuine Silicon",
    description:
      "Direct authorization from official manufacturers like Arduino, Raspberry Pi, Rigol, and Hakko. Zero gray-market clones.",
  },
  {
    icon: RotateCcw,
    title: "30-Day Hassle-Free Returns",
    description:
      "Test your components in peace. Full refund or instant replacement if anything doesn't meet your expectations.",
  },
  {
    icon: Zap,
    title: "Maker-Grade Support",
    description:
      "Schematics, pinouts, and code samples provided for every kit. Our electrical engineers are on chat 24/7.",
  },
];

export function ValueProps() {
  return (
    <section className="border-y border-border bg-muted/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-syne tracking-tight text-foreground">
            Built for Makers. Backed by Standards.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Why hardware engineers, roboticists, and tech hobbyists trust Mistri for every build.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col p-6 rounded-2xl border border-border/60 bg-card hover:border-[#A3E635]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#A3E635]/10 text-[#A3E635] mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold font-syne text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
