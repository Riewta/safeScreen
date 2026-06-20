"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, removeFromWishlist } from "@/services/wishlist.service";
import { wishlistKeys } from "@/hooks/queries/use-wishlist";

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => addToWishlist(productId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}
