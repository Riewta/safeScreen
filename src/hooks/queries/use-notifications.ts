"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notification.service";
import { useAuthStore } from "@/stores/auth.store";

export const notificationKeys = {
  all:  ["notifications"] as const,
  list: () => ["notifications", "list"] as const,
};

export function useNotifications() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn:  getNotifications,
    enabled:  isLoggedIn,
  });
}
