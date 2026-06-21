import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminService } from "@/services/admin.service";

interface AdminAuthState {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  /** Auth token returned by adminService.login() — null when logged out */
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      adminEmail: null,
      token: null,

      login: async (email, password) => {
        // Delegates to adminService — swap mock → real by setting NEXT_PUBLIC_API_URL
        try {
          const result = await adminService.login({ email, password });
          set({ isAdminLoggedIn: true, adminEmail: email, token: result.token });
          return { success: true };
        } catch (err) {
          const message = err instanceof Error ? err.message : "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
          return { success: false, error: message };
        }
      },

      logout: () => set({ isAdminLoggedIn: false, adminEmail: null, token: null }),
    }),
    { name: "safescreen-admin-auth" }
  )
);
