import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  ids: string[];
  pendingId: string | null;   // รอ add หลัง login
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
  setPending: (id: string) => void;
  consumePending: () => string | null;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      pendingId: null,

      toggle: (productId) =>
        set((s) => ({
          ids: s.ids.includes(productId)
            ? s.ids.filter((id) => id !== productId)
            : [...s.ids, productId],
        })),

      has: (productId) => get().ids.includes(productId),

      clear: () => set({ ids: [] }),

      setPending: (id) => set({ pendingId: id }),

      consumePending: () => {
        const id = get().pendingId;
        set({ pendingId: null });
        return id;
      },
    }),
    { name: "karmart-wishlist" }
  )
);
