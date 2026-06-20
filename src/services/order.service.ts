// TODO: remove mock, reads from NEXT_PUBLIC_API_URL
import { apiClient } from "@/lib/api-client";
import type { Order, Review, SubmitReviewPayload, SubmitReturnPayload } from "@/types/order";
import type { Cart } from "@/types/api.types";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_API_URL;

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

// ── Service object (swap mock → real by setting NEXT_PUBLIC_API_URL) ──────────

export const orderService = {
  /**
   * List all orders for the authenticated user.
   *
   * API: GET /api/orders
   * Headers: Authorization: Bearer <token>
   * Response: Order[]
   */
  async getOrders(_token: string): Promise<Order[]> {
    // API: GET /api/orders
    // Request: (token in Authorization header)
    // Response: Order[]
    if (USE_MOCK) {
      const { useOrdersStore } = await import("@/stores/orders.store");
      return useOrdersStore.getState().orders;
    }
    return apiClient.get<Order[]>("/api/orders");
  },

  /**
   * Fetch a single order by ID.
   *
   * API: GET /api/orders/:id
   * Headers: Authorization: Bearer <token>
   * Response: Order
   */
  async getOrderById(_token: string, id: string): Promise<Order> {
    // API: GET /api/orders/:id
    // Request: (token in Authorization header, id in path)
    // Response: Order
    if (USE_MOCK) {
      const { useOrdersStore } = await import("@/stores/orders.store");
      const order = useOrdersStore.getState().getOrder(id);
      if (!order) throw new Error(`Order ${id} not found`);
      return order;
    }
    return apiClient.get<Order>(`/api/orders/${id}`);
  },

  /**
   * Cancel an order.
   *
   * API: POST /api/orders/:id/cancel
   * Headers: Authorization: Bearer <token>
   * Response: { success: boolean }
   */
  async cancelOrder(_token: string, id: string): Promise<{ success: boolean }> {
    // API: POST /api/orders/:id/cancel
    // Request: (token in Authorization header, id in path)
    // Response: { success: boolean }
    if (USE_MOCK) {
      const { useOrdersStore } = await import("@/stores/orders.store");
      useOrdersStore.getState().updateStatus(id, "cancelled");
      return { success: true };
    }
    return apiClient.post<{ success: boolean }>(`/api/orders/${id}/cancel`);
  },

  /**
   * Place a new order from the current cart.
   *
   * API: POST /api/orders
   * Headers: Authorization: Bearer <token>
   * Request:  Cart
   * Response: Order
   */
  async createOrder(_token: string, cart: Cart): Promise<Order> {
    // API: POST /api/orders
    // Request: Cart
    // Response: Order
    if (USE_MOCK) {
      const { useOrdersStore } = await import("@/stores/orders.store");
      const now = new Date().toISOString();
      const mockOrder: Order = {
        id:            `ORD-MOCK-${Date.now()}`,
        createdAt:     now,
        status:        "pending_payment",
        items:         cart.items.map((item) => ({
          productId:     item.productId,
          name:          item.name,
          brand:         item.brand,
          image:         item.image,
          price:         item.price,
          originalPrice: item.originalPrice,
          variant:       item.variant,
          quantity:      item.quantity,
        })),
        subtotal:      cart.subtotal,
        shippingFee:   0,
        discount:      cart.discount ?? 0,
        total:         cart.total ?? cart.subtotal,
        recipientName: "ธนิดา โอวาท",
        phone:         "089-123-4567",
        address:       "88/12 ถ.พระราม 9 ซ.9 ห้วยขวาง กรุงเทพฯ 10310",
      };
      useOrdersStore.getState().addOrder(mockOrder);
      return mockOrder;
    }
    return apiClient.post<Order>("/api/orders", cart);
  },
};
