import { apiClient } from "@/lib/api-client";
import type { Notification } from "@/types/notification";

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getNotifications(): Promise<Notification[]> {
  if (!USE_MOCK) {
    return apiClient.get<Notification[]>("/api/notifications");
  }
  const { useNotificationsStore } = await import("@/stores/notifications.store");
  return useNotificationsStore.getState().notifications;
}

export async function markNotificationRead(id: string): Promise<void> {
  if (!USE_MOCK) {
    return apiClient.patch<void>(`/api/notifications/${id}/read`);
  }
  const { useNotificationsStore } = await import("@/stores/notifications.store");
  useNotificationsStore.getState().markRead(id);
}

export async function markAllNotificationsRead(): Promise<void> {
  if (!USE_MOCK) {
    return apiClient.post<void>("/api/notifications/read-all");
  }
  const { useNotificationsStore } = await import("@/stores/notifications.store");
  const store = useNotificationsStore.getState();
  store.notifications.forEach((n) => { if (!n.read) store.markRead(n.id); });
}

export async function deleteNotification(id: string): Promise<void> {
  if (!USE_MOCK) {
    return apiClient.delete<void>(`/api/notifications/${id}`);
  }
  const { useNotificationsStore } = await import("@/stores/notifications.store");
  useNotificationsStore.getState().deleteNotification(id);
}
