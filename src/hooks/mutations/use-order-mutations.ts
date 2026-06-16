"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder, submitReturn, submitReview } from "@/services/order.service";
import { orderKeys } from "@/hooks/queries/use-orders";
import type { SubmitReviewPayload, SubmitReturnPayload } from "@/types";

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useSubmitReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitReturnPayload) => submitReturn(payload),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
    },
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) => submitReview(payload),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
    },
  });
}
