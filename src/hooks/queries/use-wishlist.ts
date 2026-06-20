"use client";

import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "@/services/wishlist.service";
import { useAuthStore } from "@/stores/auth.store";

export const wishlistKeys = {
  all:  ["wishlist"] as const,
  list: () => ["wishlist", "list"] as const,
};

export function useWishlist() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn:  getWishlist,
    enabled:  isLoggedIn,
  });
}
