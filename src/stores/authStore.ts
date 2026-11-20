import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthStore {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  setSession: (session: Session | null) => void;
  checkAdmin: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  isAdmin: false,

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  checkAdmin: async (userId) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data } = await supabase.rpc("has_role", {
        uid: userId,
        r: "admin",
      });
      set({ isAdmin: Boolean(data) });
    } catch {
      set({ isAdmin: false });
    }
  },

  signOut: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    set({ session: null, user: null, isAdmin: false });
  },
}));

// Initialize auth listener
export function initAuth() {
  if (!isSupabaseConfigured) {
    useAuthStore.setState({ isLoading: false });
    return;
  }

  supabase.auth.getSession().then(({ data: { session } }) => {
    useAuthStore.getState().setSession(session);
    if (session?.user) {
      useAuthStore.getState().checkAdmin(session.user.id);
    }
    useAuthStore.setState({ isLoading: false });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session);
    if (session?.user) {
      useAuthStore.getState().checkAdmin(session.user.id);
    } else {
      useAuthStore.setState({ isAdmin: false });
    }
  });
}
