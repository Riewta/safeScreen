"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartClient } from "@/components/cart/CartClient";

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));

    const handleExit = () => {
      setMounted(false);
      setTimeout(() => router.back(), 300);
    };

    window.addEventListener("cart:exit", handleExit);
    return () => window.removeEventListener("cart:exit", handleExit);
  }, [router]);

  return (
    <div
      className="transition-transform duration-300 ease-out"
      style={{ transform: mounted ? "translateX(0)" : "translateX(100%)" }}
    >
      <CartClient />
    </div>
  );
}
