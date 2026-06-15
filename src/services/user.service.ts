import type { UserProfile, UpdateProfilePayload, PointsEntry } from "@/types/user";

export async function getUserProfile(): Promise<UserProfile> {
  // TODO: return apiClient.get<UserProfile>("/api/me")
  const { useUserStore } = await import("@/stores/user.store");
  return useUserStore.getState().profile;
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  // TODO: return apiClient.patch<UserProfile>("/api/me", payload)
  const { useUserStore } = await import("@/stores/user.store");
  useUserStore.getState().updateProfile(payload);
  return useUserStore.getState().profile;
}

export async function getPointsHistory(): Promise<PointsEntry[]> {
  // TODO: return apiClient.get<PointsEntry[]>("/api/me/points/history")
  const { useUserStore } = await import("@/stores/user.store");
  return useUserStore.getState().profile.pointsHistory;
}
