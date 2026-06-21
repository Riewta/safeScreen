import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./user.store";
import { useOrdersStore } from "./orders.store";
import { useWishlistStore } from "./wishlist.store";
import { authService } from "@/services/auth.service";

interface AuthStore {
  isLoggedIn:   boolean;
  email:        string;
  name:         string;
  /** Auth token returned by authService.login() — null when logged out */
  token:        string | null;
  accessToken:  string | null;
  refreshToken: string | null;
  login:        (email: string, name?: string) => Promise<void>;
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
      token:        null,
      accessToken:  null,
      refreshToken: null,

      setTokens: ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken });
      },

      login: async (email, name) => {
        // Delegates to authService — swap mock → real by setting NEXT_PUBLIC_API_URL
        const result = await authService.login({ email });
        const resolvedName = name ?? result.user.name ?? email.split("@")[0];

        set({
          isLoggedIn:   true,
          email,
          name:         resolvedName,
          token:        result.token,
          accessToken:  result.token,
          refreshToken: result.refreshToken ?? null,
        });

        useUserStore.getState().updateProfile({
          ...MOCK_LOGGED_IN_PROFILE,
          email,
          name: resolvedName,
        });
        useOrdersStore.getState().seedIfEmpty();
        const pendingId = useWishlistStore.getState().consumePending();
        if (pendingId) useWishlistStore.getState().toggle(pendingId);
      },

      logout: () => {
        set({
          isLoggedIn:   false,
          email:        "",
          name:         "",
          token:        null,
          accessToken:  null,
          refreshToken: null,
        });
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
    { name: "safescreen-auth" }
  )
);
