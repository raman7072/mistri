import { Link } from "@tanstack/react-router";
import {
  House,
  Store,
  Info,
  Wrench,
  Mail,
  X,
  LogOut,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "/", icon: House },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "About", href: "/about", icon: Info },
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Contact", href: "/contact", icon: Mail },
];

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const avatarInitials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : null;

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] flex flex-col bg-background border-r border-border shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-0.5 font-syne font-bold text-xl tracking-tight text-foreground"
              >
                Mistri
                <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] mb-3 ml-0.5 inline-block" />
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        to={link.href}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium text-sm"
                        activeProps={{
                          className:
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-foreground bg-[#A3E635]/10 font-medium text-sm border border-[#A3E635]/20",
                        }}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Divider */}
              <div className="my-4 border-t border-border" />

              {/* Quick links */}
              <div className="px-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Quick Links
                </p>
                <ul className="space-y-2">
                  {["Track Order", "Returns & Refunds", "FAQ"].map((item) => (
                    <li key={item}>
                      <Link
                        to="/contact"
                        onClick={onClose}
                        className="text-sm text-muted-foreground hover:text-[#A3E635] transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Bottom auth section */}
            <div className="border-t border-border px-4 py-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#A3E635] text-black text-sm font-bold shrink-0">
                      {avatarInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        My Account
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4" />
                    View Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth"
                    onClick={onClose}
                    className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#A3E635] text-black hover:bg-[#A3E635]/90 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    onClick={onClose}
                    className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-muted transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
