// TODO: remove mock, reads from NEXT_PUBLIC_API_URL
import { apiClient } from "@/lib/api-client";
import type {
  RequestOtpPayload,
  RequestOtpResponse,
  LoginWithOtpPayload,
  AuthTokens,
  SocialLoginPayload,
} from "@/types/auth";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  OtpSendRequest,
  OtpSendResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  User,
} from "@/types/api.types";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_API_URL;

const MOCK_OTP = "1234";

const MOCK_USER: User = {
  id:     "mock-user-1",
  name:   "ธนิดา โอวาท",
  email:  "thanida@example.com",
  phone:  "0891234567",
  avatar: null,
  tier:   "Gold",
  points: 3480,
};

// ── Legacy function exports (kept for backward compatibility) ─────────────────

export async function requestOtp(payload: RequestOtpPayload): Promise<RequestOtpResponse> {
  if (!USE_MOCK) {
    return apiClient.post<RequestOtpResponse>("/api/auth/otp/request", payload);
  }
  const dest = payload.identifier.includes("@")
    ? payload.identifier.replace(/(.{2}).+(@.+)/, "$1***$2")
    : payload.identifier.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
  return { sent: true, maskedDestination: dest };
}

export async function loginWithOtp(payload: LoginWithOtpPayload): Promise<AuthTokens> {
  if (!USE_MOCK) {
    return apiClient.post<AuthTokens>("/api/auth/otp/verify", payload);
  }
  if (payload.otp !== MOCK_OTP) throw new Error("Invalid OTP");
  return {
    accessToken:  "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiresIn:    3600,
  };
}

export async function loginWithSocial(payload: SocialLoginPayload): Promise<AuthTokens> {
  if (!USE_MOCK) {
    return apiClient.post<AuthTokens>("/api/auth/social", payload);
  }
  return {
    accessToken:  `mock-${payload.provider}-access-token`,
    refreshToken: `mock-${payload.provider}-refresh-token`,
    expiresIn:    3600,
  };
}

export async function logout(): Promise<void> {
  if (!USE_MOCK) {
    return apiClient.post<void>("/api/auth/logout");
  }
}

// ── Service object (swap mock → real by setting NEXT_PUBLIC_API_URL) ──────────

export const authService = {
  /**
   * Login with email/phone + password.
   *
   * API: POST /api/auth/login
   * Request:  LoginRequest  { email?, phone?, password? }
   * Response: LoginResponse { token, refreshToken?, user }
   */
  async login(req: LoginRequest): Promise<LoginResponse> {
    // API: POST /api/auth/login
    // Request: LoginRequest
    // Response: LoginResponse
    if (USE_MOCK) {
      if (req.password === "wrong") {
        throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
      const identifier = req.email ?? req.phone ?? "";
      return {
        token:        "mock-access-token",
        refreshToken: "mock-refresh-token",
        user: {
          ...MOCK_USER,
          email: identifier.includes("@") ? identifier : MOCK_USER.email,
          phone: identifier.includes("@") ? MOCK_USER.phone : identifier,
        },
      };
    }
    return apiClient.post<LoginResponse>("/api/auth/login", req);
  },

  /**
   * Register a new account.
   *
   * API: POST /api/auth/register
   * Request:  RegisterRequest  { email?, phone?, name, password? }
   * Response: RegisterResponse { success, message? }
   */
  async register(req: RegisterRequest): Promise<RegisterResponse> {
    // API: POST /api/auth/register
    // Request: RegisterRequest
    // Response: RegisterResponse
    if (USE_MOCK) {
      return { success: true };
    }
    return apiClient.post<RegisterResponse>("/api/auth/register", req);
  },

  /**
   * Send a one-time password to email or phone.
   *
   * API: POST /api/auth/otp/request
   * Request:  OtpSendRequest  { identifier }
   * Response: OtpSendResponse { success, maskedDestination? }
   */
  async sendOtp(req: OtpSendRequest): Promise<OtpSendResponse> {
    // API: POST /api/auth/otp/request
    // Request: OtpSendRequest
    // Response: OtpSendResponse
    if (USE_MOCK) {
      const dest = req.identifier;
      const masked = dest.includes("@")
        ? dest.replace(/(.{2}).+(@.+)/, "$1***$2")
        : dest.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
      return { success: true, maskedDestination: masked };
    }
    return apiClient.post<OtpSendResponse>("/api/auth/otp/request", req);
  },

  /**
   * Verify OTP and receive auth tokens on success.
   * Mock OTP is "1234".
   *
   * API: POST /api/auth/otp/verify
   * Request:  OtpVerifyRequest  { identifier, otp }
   * Response: OtpVerifyResponse { token, refreshToken?, user }
   */
  async verifyOtp(req: OtpVerifyRequest): Promise<OtpVerifyResponse> {
    // API: POST /api/auth/otp/verify
    // Request: OtpVerifyRequest
    // Response: OtpVerifyResponse
    if (USE_MOCK) {
      if (req.otp !== MOCK_OTP) {
        throw new Error("รหัส OTP ไม่ถูกต้อง");
      }
      const identifier = req.identifier;
      return {
        token:        "mock-access-token",
        refreshToken: "mock-refresh-token",
        user: {
          ...MOCK_USER,
          email: identifier.includes("@") ? identifier : MOCK_USER.email,
          phone: identifier.includes("@") ? MOCK_USER.phone : identifier,
        },
      };
    }
    return apiClient.post<OtpVerifyResponse>("/api/auth/otp/verify", req);
  },

  /**
   * Authenticate via Google OAuth token.
   *
   * API: POST /api/auth/google
   * Request:  { token: string }
   * Response: LoginResponse { token, refreshToken?, user }
   */
  async loginWithGoogle(token: string): Promise<LoginResponse> {
    // API: POST /api/auth/google
    // Request: { token: string }
    // Response: LoginResponse
    if (USE_MOCK) {
      return {
        token:        "mock-access-token-google",
        refreshToken: "mock-refresh-token-google",
        user: {
          ...MOCK_USER,
          id:    "mock-google-user-1",
          name:  "Google User",
          email: "google.user@gmail.com",
        },
      };
    }
    return apiClient.post<LoginResponse>("/api/auth/google", { token });
  },

  /**
   * Fetch the current user's profile using their auth token.
   *
   * API: GET /api/user/profile
   * Headers: Authorization: Bearer <token>
   * Response: User
   */
  async getProfile(_token: string): Promise<User> {
    // API: GET /api/user/profile
    // Request: (token in Authorization header)
    // Response: User
    if (USE_MOCK) {
      return MOCK_USER;
    }
    return apiClient.get<User>("/api/user/profile");
  },
};
