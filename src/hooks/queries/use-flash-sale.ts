"use client";

import { useQuery } from "@tanstack/react-query";
import { getFlashSaleSession } from "@/services/campaign.service";

export const flashSaleKeys = {
  session: () => ["flash-sale", "session"] as const,
};

export function useFlashSaleSession() {
  return useQuery({
    queryKey: flashSaleKeys.session(),
    queryFn:  getFlashSaleSession,
    staleTime: 1000 * 60,
  });
}
