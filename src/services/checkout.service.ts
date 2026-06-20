import { apiClient } from "@/lib/api-client";
import type { ShippingOption, PlaceOrderPayload, PlaceOrderResponse } from "@/types/checkout";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getShippingOptions(): Promise<ShippingOption[]> {
  if (!USE_MOCK) {
    return apiClient.get<ShippingOption[]>("/api/shipping/options");
  }
  const { SHIPPING_OPTIONS } = await import("@/stores/checkout.store");
  return SHIPPING_OPTIONS.map((o) => ({ ...o }));
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResponse> {
  if (!USE_MOCK) {
    return apiClient.post<PlaceOrderResponse>("/api/orders", payload);
  }
  const orderId = `KM${Date.now()}`;
  return { orderId, total: 0 };
}
