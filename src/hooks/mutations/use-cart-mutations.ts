"use client";

import { useMutation } from "@tanstack/react-query";
import { validateCoupon } from "@/services/cart.service";
import type { CouponValidatePayload } from "@/types";

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (payload: CouponValidatePayload) => validateCoupon(payload),
  });
}
