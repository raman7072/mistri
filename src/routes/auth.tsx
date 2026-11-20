import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight, Github } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const setSession = useAuthStore((s) => s.setSession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Mock authentication for preview
        setSession({
          user: {
            id: "mock-user-1",
            email,
            app_metadata: {},
            user_metadata: { full_name: fullName || "Maker Engineer" },
            aud: "authenticated",
            created_at: new Date().toISOString(),
          },
          access_token: "mock-token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "mock-refresh",
        });
        toast.success(isSignUp ? "Account created successfully!" : "Signed in successfully!");
        navigate({ to: "/" });
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setSession(data.session);
        toast.success("Account created! Welcome to Mistri.");
        navigate({ to: "/" });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSession(data.session);
        toast.success("Signed in successfully!");
        navigate({ to: "/" });
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-foreground tracking-tight">
            {isSignUp ? "Create Maker Account" : "Sign In to Mistri"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
            {isSignUp
              ? "Join thousands of robotics builders and access your orders."
              : "Welcome back! Enter your credentials to access your dashboard."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@maker.com"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#A3E635] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <span className="font-bold text-[#A3E635] underline underline-offset-4">
                  Sign In
                </span>
              </>
            ) : (
              <>
                Don't have an account yet?{" "}
                <span className="font-bold text-[#A3E635] underline underline-offset-4">
                  Sign Up Free
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
