import { Link } from "@tanstack/react-router";
import {
  Twitter,
  Github,
  Instagram,
  Youtube,
  ArrowRight,
  Send,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const SHOP_LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "Robotics Kits", href: "/shop?category=robotics-kits" },
  { label: "Smart Home", href: "/shop?category=smart-home" },
  { label: "Components", href: "/shop?category=components" },
  { label: "Gadgets", href: "/shop?category=gadgets" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
];

const SUPPORT_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "Track Order", href: "/track-order" },
];

const SOCIAL_LINKS = [
  { label: "Twitter / X", href: "https://twitter.com", icon: Twitter },
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
];

function MagneticSocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:text-[#A3E635] hover:border-[#A3E635]/50 transition-all duration-200"
      style={{ willChange: "transform", transition: "transform 0.15s ease, color 0.2s, border-color 0.2s" }}
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: trimmed });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed! 🎉");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.success("🎉 Thanks for subscribing!");
        setEmail("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-lg"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm outline-none focus:border-[#A3E635]/60 focus:bg-white/15 transition-all"
        required
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#A3E635] text-black text-sm font-semibold hover:bg-[#A3E635]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all whitespace-nowrap"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Subscribe
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#09090B] text-white">
      {/* Newsletter row */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-sm">
              <h3 className="font-syne font-bold text-2xl text-white mb-1">
                Stay in the loop
              </h3>
              <p className="text-sm text-white/50">
                New drops, exclusive deals, and maker tips — straight to your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main 4-column grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-5">
            <Link
              to="/"
              className="inline-flex items-center gap-0.5 font-syne font-bold text-2xl text-white"
            >
              Mistri
              <span className="w-2 h-2 rounded-full bg-[#A3E635] mb-3 ml-0.5 inline-block" />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              The Future Runs on Silicon
            </p>
            <p className="text-xs text-white/35 leading-relaxed max-w-xs">
              Your one-stop destination for robotics kits, smart home gadgets,
              electronic components, and cutting-edge maker hardware.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map((s) => (
                <MagneticSocialIcon key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-syne font-semibold text-sm text-white uppercase tracking-widest mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-[#A3E635] transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-syne font-semibold text-sm text-white uppercase tracking-widest mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-[#A3E635] transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="font-syne font-semibold text-sm text-white uppercase tracking-widest mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/50 hover:text-[#A3E635] transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact card */}
            <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5 space-y-1">
              <p className="text-xs font-semibold text-white/70">
                Need help fast?
              </p>
              <a
                href="mailto:support@mistri.in"
                className="text-sm text-[#A3E635] hover:text-[#A3E635]/80 transition-colors"
              >
                support@mistri.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35 order-2 sm:order-1">
            © {new Date().getFullYear()} Mistri. All rights reserved. 🇮🇳 Made
            with ♥ in India
          </p>
          <nav className="flex items-center gap-4 order-1 sm:order-2">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Refund Policy", href: "/refunds" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-xs text-white/35 hover:text-white/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
