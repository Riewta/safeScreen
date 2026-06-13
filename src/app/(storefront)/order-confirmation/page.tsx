import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmationClient } from "@/components/order/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "สั่งซื้อสำเร็จ | SafeScreen Tech",
};

export default function OrderConfirmationPage() {
  return (
    <Suspense>
      <OrderConfirmationClient />
    </Suspense>
  );
}
