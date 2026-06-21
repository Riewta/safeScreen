import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType = "order" | "promo" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  image?: string;
  href?: string;
  orderId?: string;
}

interface NotificationsStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void;
  markRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: "n1",
          type: "order",
          title: "พัสดุของคุณกำลังถูกจัดส่ง",
          body: "คำสั่งซื้อ #ORD-20240420-002 — NanoSnap Privacy Screen MacBook Air 13.6\" กำลังเดินทาง จะถึงมือคุณพรุ่งนี้",
          time: new Date().toISOString(),
          read: false,
          image: "/products/privacy-macbook/privacy-macbook-air-13-6.jpg",
          href: "/account/orders/ORD-20240420-002",
          orderId: "ORD-20240420-002"
        },
        {
          id: "n3",
          type: "order",
          title: "จัดส่งสินค้าสำเร็จแล้ว",
          body: "ออเดอร์ #ORD-20240415-001 — NanoSnap Privacy Screen MacBook Pro 14\" ถึงมือคุณแล้ว อย่าลืมให้คะแนนเพื่อรับ 10 แต้ม!",
          time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          image: "/products/privacy-macbook/privacy-macbook-pro-14.jpg",
          href: "/account/orders/ORD-20240415-001",
          orderId: "ORD-20240415-001"
        },
        {
          id: "n2",
          type: "promo",
          title: "Flash Sale ฟิล์มกันเสือก ลด 30%",
          body: "NanoSnap Privacy Screen ทุกรุ่น ลดพิเศษ 30% วันนี้เท่านั้น ใช้โค้ด SAFESCREEN10 เพิ่มอีก 10%!",
          time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: false,
          href: "/products"
        },
      ],

      addNotification: (n) => set((state) => ({
        notifications: [
          {
            ...n,
            id: `noti-${Date.now()}`,
            time: new Date().toISOString(),
            read: false,
          },
          ...state.notifications,
        ],
      })),

      markRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
      })),

      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "safescreen-notifications",
    }
  )
);
