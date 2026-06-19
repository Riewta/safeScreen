import { create } from "zustand";
import { persist } from "zustand/middleware";

// Mock admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@safescreentech.com",
  password: "admin1234",
};

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      adminEmail: null,

      login: (email, password) => {
        if (
          email.toLowerCase() === ADMIN_CREDENTIALS.email &&
          password === ADMIN_CREDENTIALS.password
        ) {
          set({ isAdminLoggedIn: true, adminEmail: email });
          return { success: true };
        }
        return { success: false, error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
      },

      logout: () => set({ isAdminLoggedIn: false, adminEmail: null }),
    }),
    { name: "karmart-admin-auth" }
  )
);
