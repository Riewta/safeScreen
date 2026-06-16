"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrders, getOrderById } from "@/services/order.service";

export const orderKeys = {
  all:    ["orders"] as const,
  list:   ()         => ["orders", "list"]      as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn:  getOrders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn:  () => getOrderById(id),
    enabled:  !!id,
  });
}
