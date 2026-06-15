import type { Order, Review, SubmitReviewPayload, SubmitReturnPayload } from "@/types/order";

// Mock — delegates to Zustand store until backend is wired up.
// When backend is ready: replace each function body with apiClient calls.

export async function getOrders(): Promise<Order[]> {
  // TODO: return apiClient.get<Order[]>("/api/orders")
  const { useOrdersStore } = await import("@/stores/orders.store");
  return useOrdersStore.getState().orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  // TODO: return apiClient.get<Order>(`/api/orders/${id}`)
  const { useOrdersStore } = await import("@/stores/orders.store");
  return useOrdersStore.getState().getOrder(id) ?? null;
}

export async function submitReview(payload: SubmitReviewPayload): Promise<Review> {
  // TODO: return apiClient.post<Review>("/api/reviews", payload)
  const { useOrdersStore } = await import("@/stores/orders.store");
  const store = useOrdersStore.getState();
  store.addReview(payload);
  const saved = store.getReview(payload.orderId, payload.productId);
  if (!saved) throw new Error("Review save failed");
  return saved;
}

export async function submitReturn(payload: SubmitReturnPayload): Promise<void> {
  // TODO: return apiClient.post<void>("/api/returns", payload)
  const { useOrdersStore } = await import("@/stores/orders.store");
  useOrdersStore.getState().submitReturn(payload.orderId, payload.productIds);
}

export async function cancelOrder(orderId: string): Promise<void> {
  // TODO: return apiClient.post<void>(`/api/orders/${orderId}/cancel`)
  const { useOrdersStore } = await import("@/stores/orders.store");
  useOrdersStore.getState().updateStatus(orderId, "cancelled");
}
