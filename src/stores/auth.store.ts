import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./user.store";
import { useOrdersStore } from "./orders.store";

interface AuthStore {
  isLoggedIn: boolean;
  email:      string;
  name:       string;
  login:      (email: string, name?: string) => void;
  logout:     () => void;
}

// Mock profile ที่จะ populate เมื่อ login
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
      isLoggedIn: false,
      email:      "",
      name:       "",

      login: (email, name) => {
        set({ isLoggedIn: true, email, name: name ?? email.split("@")[0] });
        // Populate user profile with mock data on login
        useUserStore.getState().updateProfile({
          ...MOCK_LOGGED_IN_PROFILE,
          email,
          name: name ?? MOCK_LOGGED_IN_PROFILE.name,
        });
        // Seed mock orders if empty
        useOrdersStore.getState().seedIfEmpty();
      },

      logout: () => {
        set({ isLoggedIn: false, email: "", name: "" });
        // Reset profile to guest state
        useUserStore.getState().updateProfile({
          name:   "",
          email:  "",
          phone:  "",
          avatar: null,
          points: 0,
        });
        // Clear orders
        useOrdersStore.getState().clearOrders();
      },
    }),
    { name: "karmart-auth" }
  )
);
