import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight, User, Sparkles, KeyRound } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export function AuthForm() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup" | "magic">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const setSession = useAuthStore((s) => s.setSession);

  // Email + Password Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === "signup" && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (tab === "signup" && password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Mock authentication for instant preview
        const mockUser = {
          id: "mock-maker-" + Date.now().toString(36),
          email,
          app_metadata: {},
          user_metadata: { full_name: fullName || "Maker Engineer" },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        };
        setSession({
          user: mockUser,
          access_token: "mock-token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "mock-refresh",
        });

        toast.success(
          tab === "signup"
            ? "Account created successfully! Welcome to Mistri."
            : "Signed in successfully! Welcome back."
        );
        navigate({ to: "/" });
        return;
      }

      if (tab === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;

        // Auto-create profile fallback
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
          });
        }

        setSession(data.session);
        toast.success("Account created! Check your email or continue browsing.");
        navigate({ to: "/" });
      } else if (tab === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        setSession(data.session);
        toast.success("Welcome back!");
        navigate({ to: "/" });
      } else if (tab === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast.success("Magic sign-in link dispatched to your inbox! 📬");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  // OAuth Sign In
  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);

    if (!isSupabaseConfigured) {
      setSession({
        user: {
          id: `mock-${provider}-user`,
          email: `maker@${provider}.com`,
          app_metadata: {},
          user_metadata: { full_name: `${provider.toUpperCase()} Developer` },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        },
        access_token: "mock-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mock-refresh",
      });
      toast.success(`Signed in with ${provider}!`);
      setOauthLoading(null);
      navigate({ to: "/" });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      toast.error((err as Error).message || `Failed to sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm space-y-6">
      {/* Tabs */}
      <div className="flex p-1 bg-muted rounded-xl">
        <button
          type="button"
          onClick={() => setTab("signin")}
          className={`flex-1 py-2 text-xs font-bold font-syne rounded-lg transition-all ${
            tab === "signin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          className={`flex-1 py-2 text-xs font-bold font-syne rounded-lg transition-all ${
            tab === "signup"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => setTab("magic")}
          className={`flex-1 py-2 text-xs font-bold font-syne rounded-lg transition-all ${
            tab === "magic"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Magic Link
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-foreground tracking-tight">
          {tab === "signin" && "Welcome Back, Maker"}
          {tab === "signup" && "Join the Mistri Collective"}
          {tab === "magic" && "Passwordless Sign-In"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
          {tab === "signin" && "Enter your credentials to manage orders, wishlists, and project quotes."}
          {tab === "signup" && "Create an account for one-click checkout, live order tracking, and lab discounts."}
          {tab === "magic" && "We'll send a secure one-time login link straight to your email."}
        </p>
      </div>

      {/* OAuth Buttons */}
      {tab !== "magic" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            disabled={oauthLoading !== null}
            className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("github")}
            disabled={oauthLoading !== null}
            className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>
      )}

      {tab !== "magic" && (
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            or continue with email
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "signup" && (
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
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

        {tab !== "magic" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-muted-foreground">
                Password
              </label>
              {tab === "signin" && (
                <Link
                  to="/reset-password"
                  className="text-xs text-[#A3E635] hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>

            {tab === "signup" && <PasswordStrengthMeter password={password} />}
          </div>
        )}

        {tab === "signup" && (
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#A3E635] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            "Authenticating..."
          ) : tab === "signup" ? (
            <>
              Create Account <ArrowRight className="w-4 h-4" />
            </>
          ) : tab === "magic" ? (
            <>
              Send Magic Link <Sparkles className="w-4 h-4" />
            </>
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
