import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "ที่อยู่จัดส่ง | SafeScreen Tech",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
