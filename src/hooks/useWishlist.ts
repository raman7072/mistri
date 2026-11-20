import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";
import { SAMPLE_PRODUCTS } from "@/lib/mockData";

interface WishlistStore {
  productIds: string[];
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: ["prod-1", "prod-3", "prod-8"], // initial starter wishlisted items

      toggleWishlist: (productId: string) => {
        const current = get().productIds;
        const exists = current.includes(productId);
        if (exists) {
          set({ productIds: current.filter((id) => id !== productId) });
          return false;
        } else {
          set({ productIds: [...current, productId] });
          return true;
        }
      },

      isInWishlist: (productId: string) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: "mistri_wishlist",
    }
  )
);

export function useWishlistProducts(): Product[] {
  const productIds = useWishlistStore((s) => s.productIds);
  return SAMPLE_PRODUCTS.filter((p) => productIds.includes(p.id));
}
