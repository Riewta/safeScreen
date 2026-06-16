import { apiClient } from "@/lib/api-client";
import type { UserProfile, UpdateProfilePayload, PointsEntry } from "@/types/user";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getUserProfile(): Promise<UserProfile> {
  if (!USE_MOCK) {
    return apiClient.get<UserProfile>("/api/me");
  }
  const { useUserStore } = await import("@/stores/user.store");
  return useUserStore.getState().profile;
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  if (!USE_MOCK) {
    return apiClient.patch<UserProfile>("/api/me", payload);
  }
  const { useUserStore } = await import("@/stores/user.store");
  useUserStore.getState().updateProfile(payload);
  return useUserStore.getState().profile;
}

export async function getPointsHistory(): Promise<PointsEntry[]> {
  if (!USE_MOCK) {
    return apiClient.get<PointsEntry[]>("/api/me/points/history");
  }
  const { useUserStore } = await import("@/stores/user.store");
  return useUserStore.getState().profile.pointsHistory;
}
