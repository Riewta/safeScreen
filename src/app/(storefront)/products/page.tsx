import type { Metadata } from "next";
import { PLPClient } from "@/components/product/PLPClient";
import { getVisibleProducts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด | SafeScreen Tech",
  description: "ฟิล์มกันมองแม่เหล็ก NanoSnap และ Privacy สำหรับ MacBook, iPad และ Universal — ถอดติดได้ทันที ไม่ทิ้งคราบ",
};

interface Props {
  searchParams: Promise<{ category?: string; brand?: string; sort?: string; q?: string; filmType?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  return <PLPClient products={getVisibleProducts()} initialParams={params} />;
}
