import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthStore } from "@/stores/authStore";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);

  useSEO({
    title: "Maker Authentication & Sign-in | Mistri",
    description: "Sign in or register for your Mistri hardware account to track packages, save component wishlists, and manage orders.",
  });

  useEffect(() => {
    if (session) {
      navigate({ to: "/" });
    }
  }, [session, navigate]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <AuthForm />
    </div>
  );
}
