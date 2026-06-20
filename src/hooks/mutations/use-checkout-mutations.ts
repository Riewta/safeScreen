"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { placeOrder } from "@/services/checkout.service";
import { orderKeys } from "@/hooks/queries/use-orders";
import type { PlaceOrderPayload } from "@/types/checkout";

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) => placeOrder(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
