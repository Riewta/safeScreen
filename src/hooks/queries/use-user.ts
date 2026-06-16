"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getPointsHistory } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";

export const userKeys = {
  all:           ["user"] as const,
  profile:       ()       => ["user", "profile"]        as const,
  pointsHistory: ()       => ["user", "points-history"] as const,
};

export function useUserProfile() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn:  getUserProfile,
    enabled:  isLoggedIn,
  });
}

export function usePointsHistory() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: userKeys.pointsHistory(),
    queryFn:  getPointsHistory,
    enabled:  isLoggedIn,
  });
}
