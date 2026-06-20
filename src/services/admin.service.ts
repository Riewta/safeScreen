// TODO: remove mock, reads from NEXT_PUBLIC_API_URL
import { apiClient } from "@/lib/api-client";
import type { AdminLoginRequest, AdminLoginResponse, AdminUser } from "@/types/api.types";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_API_URL;

// Mock admin credentials — swap these out when real API is ready
const MOCK_ADMIN_EMAIL    = "admin@safescreentech.com";
const MOCK_ADMIN_PASSWORD = "admin1234";

const MOCK_ADMIN_USER: AdminUser = {
  id:   "mock-admin-1",
  email: MOCK_ADMIN_EMAIL,
  name: "Admin",
  role: "admin",
};

export const adminService = {
  /**
   * Authenticate as an admin user.
   *
   * API: POST /api/admin/auth/login
   * Request:  AdminLoginRequest  { email, password }
   * Response: AdminLoginResponse { token, admin }
   */
  async login(req: AdminLoginRequest): Promise<AdminLoginResponse> {
    // API: POST /api/admin/auth/login
    // Request: AdminLoginRequest
    // Response: AdminLoginResponse
    if (USE_MOCK) {
      if (
        req.email.toLowerCase() === MOCK_ADMIN_EMAIL &&
        req.password === MOCK_ADMIN_PASSWORD
      ) {
        return {
          token: "mock-admin-token",
          admin: MOCK_ADMIN_USER,
        };
      }
      throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
    return apiClient.post<AdminLoginResponse>("/api/admin/auth/login", req);
  },

  /**
   * Fetch the current admin's profile.
   *
   * API: GET /api/admin/profile
   * Headers: Authorization: Bearer <token>
   * Response: AdminUser
   */
  async getProfile(_token: string): Promise<AdminUser> {
    // API: GET /api/admin/profile
    // Request: (token in Authorization header)
    // Response: AdminUser
    if (USE_MOCK) {
      return MOCK_ADMIN_USER;
    }
    return apiClient.get<AdminUser>("/api/admin/profile");
  },
};
