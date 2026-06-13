"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ShoppingBag, UserPlus } from "lucide-react";
import Lottie from "lottie-react";
import successAnim from "@/../public/Success.json";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";

export function OrderConfirmationClient() {
  const router = useRouter();
  const params  = useSearchParams();
  const orderId = params.get("id")   ?? "KM00000000";
  const total   = params.get("total") ?? "0";
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const setHeaderTitleOverride = useUIStore((s) => s.setHeaderTitleOverride);
  const setHeaderCenterTitle   = useUIStore((s) => s.setHeaderCenterTitle);
  const setHeaderBackOverride  = useUIStore((s) => s.setHeaderBackOverride);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setHeaderTitleOverride("สั่งซื้อสำเร็จ");
    setHeaderCenterTitle(true);
    setHeaderBackOverride(() => router.replace("/account/orders"));
    
    requestAnimationFrame(() => setVisible(true));
    
    return () => {
      setHeaderTitleOverride(null);
      setHeaderCenterTitle(false);
      setHeaderBackOverride(null);
    };
  }, [setHeaderTitleOverride, setHeaderCenterTitle, setHeaderBackOverride, router]);

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-12">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">

        <div
          className="transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >

          {/* Hero */}
          <div className="flex flex-col items-center text-center px-6 pt-10 pb-10">
            <div className="w-32 h-32 mb-2">
              <Lottie animationData={successAnim} loop={false} />
            </div>
            <h1 className="text-xl font-semibold text-[var(--km-text)] mb-1">ชำระเงินสำเร็จ ฿{Number(total).toLocaleString()}</h1>
            <p className="text-sm text-[var(--km-text-secondary)]">เราจะรีบจัดเตรียมสินค้าให้คุณโดยเร็วที่สุด</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mt-4">
            {isLoggedIn ? (
              <button
                onClick={() => router.replace(`/account/orders/${orderId}`)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium hover:opacity-90 transition-all"
              >
                ดูรายละเอียดคำสั่งซื้อนี้
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => router.replace("/register")}
                className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium hover:opacity-90 transition-all"
              >
                <UserPlus size={15} />
                สมัครสมาชิกเพื่อสะสมคะแนน
                <ChevronRight size={14} />
              </button>
            )}
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 py-3.5 rounded-full border border-[var(--km-border)] text-[var(--km-text-secondary)] text-sm font-medium hover:border-[var(--km-text)] hover:text-[var(--km-text)] transition-all"
            >
              <ShoppingBag size={15} />
              ช้อปปิ้งต่อ
            </Link>
          </div>



        </div>
      </div>
    </div>
  );
}

