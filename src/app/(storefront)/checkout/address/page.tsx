import type { Metadata } from "next";
import { AddressClient } from "@/components/checkout/AddressClient";

export const metadata: Metadata = {
  title: "ที่อยู่จัดส่ง | SafeScreen Tech",
};

export default function AddressPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="md:max-w-2xl md:mx-auto">
        <AddressClient />
      </div>
    </div>
  );
}
