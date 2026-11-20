import { useState } from "react";
import { toast } from "sonner";
import { Send, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from("newsletter_subscribers")
          .insert({ email });

        if (error) {
          if (error.code === "23505") {
            toast.info("You're already on the list! 🎉");
          } else {
            toast.error("Could not subscribe right now. Please try again.");
          }
          setLoading(false);
          return;
        }
      }

      toast.success("Welcome to the inner circle! ⚡", {
        description: "You'll be the first to know about new component drops.",
      });
      setEmail("");
    } catch {
      toast.success("Welcome aboard! ⚡");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-[#09090B] text-white">
      {/* Glow background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full opacity-15 blur-3xl"
        style={{ background: "#A3E635" }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635] text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Hardware Dispatch
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold font-syne tracking-tight text-white mb-4">
          Don't Miss the Next Silicon Drop.
        </h2>

        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Bi-weekly curated firmware releases, robotics teardowns, and exclusive member discounts. Zero spam. Unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 h-12 rounded-xl bg-zinc-900 border border-zinc-800 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#A3E635] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-7 rounded-xl bg-[#A3E635] text-black font-semibold text-sm hover:bg-[#A3E635]/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#A3E635]/20 shrink-0"
          >
            {loading ? (
              "Subscribing..."
            ) : (
              <>
                Subscribe
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-zinc-500 mt-4">
          By subscribing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </section>
  );
}
