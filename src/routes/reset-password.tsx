import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  // Check if URL has access token from recovery email
  const hasAccessToken = typeof window !== "undefined" && window.location.hash.includes("access_token");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
      }

      setIsRequested(true);
      toast.success("Password recovery link sent! Check your email.");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;
      }

      toast.success("Password updated successfully! You can now sign in.");
      navigate({ to: "/auth" });
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm space-y-6">
        <div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-foreground tracking-tight">
            {hasAccessToken ? "Set New Password" : "Reset Password"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {hasAccessToken
              ? "Enter your new secure password below to complete recovery."
              : "Enter your registered email address and we will dispatch a secure password reset link."}
          </p>
        </div>

        {isRequested ? (
          <div className="p-6 rounded-2xl bg-muted/40 border border-border text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#A3E635] mx-auto" />
            <h3 className="font-syne font-bold text-foreground text-sm">
              Recovery Link Dispatched
            </h3>
            <p className="text-xs text-muted-foreground">
              Please check your inbox at <strong className="text-foreground">{email}</strong> and click the link to reset your password.
            </p>
          </div>
        ) : hasAccessToken ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              {loading ? "Updating..." : "Update Password"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#A3E635] text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-md shadow-[#A3E635]/20 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
