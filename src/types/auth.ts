export interface LoginWithOtpPayload {
  identifier: string; // email or phone
  otp: string;
}

export interface RequestOtpPayload {
  identifier: string;
}

export interface RequestOtpResponse {
  sent: boolean;
  maskedDestination?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SocialLoginPayload {
  provider: "google" | "facebook" | "line";
  token: string;
}
