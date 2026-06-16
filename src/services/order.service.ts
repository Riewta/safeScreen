import { apiClient } from "@/lib/api-client";
import type { Order, Review, SubmitReviewPayload, SubmitReturnPayload } from "@/types/order";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getOrders(): Promise<Order[]> {
  if (!USE_MOCK) {
    return apiClient.get<Order[]>("/api/orders");
  }
  const { useOrdersStore } = await import("@/stores/orders.store");
  return useOrdersStore.getState().orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!USE_MOCK) {
    return apiClient.get<Order>(`/api/orders/${id}`);
  }
  const { useOrdersStore } = await import("@/stores/orders.store");
  return useOrdersStore.getState().getOrder(id) ?? null;
}

export async function submitReview(payload: SubmitReviewPayload): Promise<Review> {
  if (!USE_MOCK) {
    return apiClient.post<Review>("/api/reviews", payload);
  }
  const { useOrdersStore } = await import("@/stores/orders.store");
  const store = useOrdersStore.getState();
  store.addReview(payload);
  const saved = store.getReview(payload.orderId, payload.productId);
  if (!saved) throw new Error("Review save failed");
  return saved;
}

export async function submitReturn(payload: SubmitReturnPayload): Promise<void> {
  if (!USE_MOCK) {
    return apiClient.post<void>("/api/returns", payload);
  }
  const { useOrdersStore } = await import("@/stores/orders.store");
  useOrdersStore.getState().submitReturn(payload.orderId, payload.productIds);
}

export async function cancelOrder(orderId: string): Promise<void> {
  if (!USE_MOCK) {
    return apiClient.post<void>(`/api/orders/${orderId}/cancel`);
  }
  const { useOrdersStore } = await import("@/stores/orders.store");
  useOrdersStore.getState().updateStatus(orderId, "cancelled");
}
