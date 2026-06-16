import { apiClient } from "@/lib/api-client";
import type { FlashDealProduct } from "@/types/product";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL;

export interface FlashSaleSession {
  startsAt: string;
  endsAt:   string;
  isActive: boolean;
}

export async function getFlashSaleProducts(): Promise<FlashDealProduct[]> {
  if (!USE_MOCK) {
    return apiClient.get<FlashDealProduct[]>("/api/campaigns/flash-sale");
  }
  const { FLASH_DEAL_PRODUCTS } = await import("@/lib/mock-data");
  return FLASH_DEAL_PRODUCTS as FlashDealProduct[];
}

export async function getFlashSaleSession(): Promise<FlashSaleSession> {
  if (!USE_MOCK) {
    return apiClient.get<FlashSaleSession>("/api/campaigns/flash-sale/session");
  }
  const now = Date.now();
  return {
    startsAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    endsAt:   new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  };
}
