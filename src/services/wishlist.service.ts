import { apiClient } from "@/lib/api-client";
import type { Product } from "@/types/product";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getWishlist(): Promise<Product[]> {
  if (!USE_MOCK) {
    return apiClient.get<Product[]>("/api/wishlist");
  }
  const [{ useWishlistStore }, { PRODUCTS }] = await Promise.all([
    import("@/stores/wishlist.store"),
    import("@/lib/mock-data"),
  ]);
  const ids = useWishlistStore.getState().ids;
  return PRODUCTS.filter((p) => ids.includes(p.id));
}

export async function addToWishlist(productId: string): Promise<void> {
  if (!USE_MOCK) {
    return apiClient.post<void>("/api/wishlist", { productId });
  }
  const { useWishlistStore } = await import("@/stores/wishlist.store");
  const store = useWishlistStore.getState();
  if (!store.has(productId)) store.toggle(productId);
}

export async function removeFromWishlist(productId: string): Promise<void> {
  if (!USE_MOCK) {
    return apiClient.delete<void>(`/api/wishlist/${productId}`);
  }
  const { useWishlistStore } = await import("@/stores/wishlist.store");
  const store = useWishlistStore.getState();
  if (store.has(productId)) store.toggle(productId);
}
