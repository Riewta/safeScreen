import type {
  RequestOtpPayload,
  RequestOtpResponse,
  LoginWithOtpPayload,
  AuthTokens,
  SocialLoginPayload,
} from "@/types/auth";

const MOCK_OTP = "1234";

export async function requestOtp(payload: RequestOtpPayload): Promise<RequestOtpResponse> {
  // TODO: return apiClient.post<RequestOtpResponse>("/api/auth/otp/request", payload)
  const dest = payload.identifier.includes("@")
    ? payload.identifier.replace(/(.{2}).+(@.+)/, "$1***$2")
    : payload.identifier.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
  return { sent: true, maskedDestination: dest };
}

export async function loginWithOtp(payload: LoginWithOtpPayload): Promise<AuthTokens> {
  // TODO: return apiClient.post<AuthTokens>("/api/auth/otp/verify", payload)
  if (payload.otp !== MOCK_OTP) {
    throw new Error("Invalid OTP");
  }
  return {
    accessToken:  "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiresIn:    3600,
  };
}

export async function loginWithSocial(payload: SocialLoginPayload): Promise<AuthTokens> {
  // TODO: return apiClient.post<AuthTokens>("/api/auth/social", payload)
  return {
    accessToken:  `mock-${payload.provider}-access-token`,
    refreshToken: `mock-${payload.provider}-refresh-token`,
    expiresIn:    3600,
  };
}

export async function logout(): Promise<void> {
  // TODO: return apiClient.post<void>("/api/auth/logout")
}
