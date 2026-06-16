import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./user.store";
import { useOrdersStore } from "./orders.store";
import { useWishlistStore } from "./wishlist.store";

interface AuthStore {
  isLoggedIn:   boolean;
  email:        string;
  name:         string;
  accessToken:  string | null;
  refreshToken: string | null;
  login:        (email: string, name?: string) => void;
  logout:       () => void;
  setTokens:    (tokens: { accessToken: string; refreshToken: string }) => void;
}

export const MOCK_LOGGED_IN_PROFILE = {
  name:   "ธนิดา โอวาท",
  email:  "thanida@example.com",
  phone:  "0891234567",
  avatar: null,
  points: 3480,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn:   false,
      email:        "",
      name:         "",
      accessToken:  null,
      refreshToken: null,

      setTokens: ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken });
      },

      login: (email, name) => {
        set({ isLoggedIn: true, email, name: name ?? email.split("@")[0] });
        useUserStore.getState().updateProfile({
          ...MOCK_LOGGED_IN_PROFILE,
          email,
          name: name ?? MOCK_LOGGED_IN_PROFILE.name,
        });
        useOrdersStore.getState().seedIfEmpty();
        const pendingId = useWishlistStore.getState().consumePending();
        if (pendingId) useWishlistStore.getState().toggle(pendingId);
      },

      logout: () => {
        set({ isLoggedIn: false, email: "", name: "", accessToken: null, refreshToken: null });
        useUserStore.getState().updateProfile({
          name:   "",
          email:  "",
          phone:  "",
          avatar: null,
          points: 0,
        });
        useOrdersStore.getState().clearOrders();
      },
    }),
    { name: "karmart-auth" }
  )
);
