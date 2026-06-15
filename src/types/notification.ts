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
