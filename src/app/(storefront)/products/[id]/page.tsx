import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/mock-data";
import { PDPClient } from "@/components/product/PDPClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return { title: "ไม่พบสินค้า" };
  return {
    title: `${product.name} | SafeScreen Tech`,
    description: `${product.brand} ฿${product.price.toLocaleString()}`,
  };
}

export default async function PDPPage({ params }: Props) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  // Smart recommendation engine: score other products based on category and brand similarity
  const otherProducts = PRODUCTS.filter((p) => p.id !== id && p.price > 0);
  const related = [...otherProducts]
    .map((p) => {
      let score = 0;
      if (p.category && p.category === product.category) score += 10;
      if (p.brand && p.brand === product.brand) score += 5;
      return { product: p, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Stable fallback sorting
      return a.product.id.localeCompare(b.product.id);
    })
    .map((item) => item.product);

  return <PDPClient product={product} related={related} />;
}
