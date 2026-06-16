import { apiClient } from "@/lib/api-client";
import type { CouponValidatePayload, CouponValidateResponse } from "@/types/cart";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL;

const MOCK_COUPONS: Record<string, number> = {
  "KARMART10":    10,
  "BEAUTY20":     20,
  "NEWMEMBER":    15,
  "NEWKARMART50": 50,
};

export async function validateCoupon(payload: CouponValidatePayload): Promise<CouponValidateResponse> {
  if (!USE_MOCK) {
    return apiClient.post<CouponValidateResponse>("/api/coupons/validate", payload);
  }
  const pct = MOCK_COUPONS[payload.code.toUpperCase()];
  if (!pct) {
    return { valid: false, message: "Coupon not found or expired" };
  }
  return {
    valid:           true,
    discountPercent: pct,
    discountAmount:  Math.round(payload.subtotal * pct / 100),
  };
}
