import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotFoundPage } from "./404";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
        richColors
      />
    </>
  );
}
