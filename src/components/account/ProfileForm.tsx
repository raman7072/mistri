import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { User, Mail, Shield, KeyRound, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  const [name, setName] = useState(
    user?.user_metadata?.full_name || "Dr. Elena Vance"
  );
  const [email] = useState(user?.email || "elena@mit-robotics.org");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Profile preferences saved!");
    setTimeout(() => setIsSaved(false), 2500);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold font-syne text-foreground">
        Profile & Maker Identity
      </h2>

      {/* Avatar Header */}
      <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card">
        <div className="w-16 h-16 rounded-2xl bg-[#A3E635] text-black flex items-center justify-center font-extrabold font-syne text-xl shrink-0">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-syne font-bold text-foreground text-base">{name}</h3>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-[#A3E635]/20 text-[#A3E635] font-mono text-[10px] font-bold uppercase">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
          <span className="inline-block text-[11px] text-muted-foreground/80 mt-1">
            Verified Hardware Builder • Member since 2024
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Email Address (Primary Account)
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              disabled
              value={email}
              className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-border bg-muted/40 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Link
            to="/reset-password"
            className="inline-flex items-center gap-1.5 text-xs text-[#A3E635] hover:underline"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Change Password
          </Link>

          <button
            type="submit"
            className="h-11 px-6 rounded-xl bg-[#A3E635] text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#A3E635]/90 transition-all shadow-sm"
          >
            {isSaved ? (
              <>
                Saved <Check className="w-3.5 h-3.5" />
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
