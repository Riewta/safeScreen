"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { CategoryMenuOverlay } from "./CategoryMenuOverlay";
import { useLang } from "@/contexts/lang";
import Image from "next/image";

const BRAND_YELLOW = "#F5A600";

const useCartCount = () => useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

export function BottomNav() {
  const pathname     = usePathname();
  const router       = useRouter();
  const categoryOpen = useUIStore((s) => s.categoryMenuOpen);
  const closeMenu    = useUIStore((s) => s.closeCategoryMenu);
  const isLoggedIn   = useAuthStore((s) => s.isLoggedIn);
  const cartCount    = useCartCount();
  const drawerOpen   = useUIStore((s) => s.mobileNavOpen);
  const closeDrawer  = useUIStore((s) => s.closeMobileNav);

  useEffect(() => { closeMenu(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { closeDrawer(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const { nav } = useLang();

  const hideFAB = pathname === "/cart"
    || pathname.startsWith("/checkout")
    || pathname === "/payment"
    || pathname === "/order-confirmation";

  if (hideFAB) return null;

  // เมนูหลัก — ไม่มี Me เมื่อ guest
  const NAV_ITEMS = [
    { label: nav.home, href: "/" },
    { label: nav.shop, href: "/products", badge: cartCount },
    { label: nav.cart, href: "/cart",     badge: cartCount },
    ...(isLoggedIn ? [{ label: nav.me, href: "/account" }] : []),
  ];

  return (
    <>
      {categoryOpen && <CategoryMenuOverlay onClose={closeMenu} />}

      {/* Full-screen overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[900] transition-all duration-300 flex flex-col ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "#EAF0F8" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2" style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}>
          <Link href="/" onClick={closeDrawer}>
            <Image src="/logo.png" alt="SafeScreen" width={110} height={28} className="h-7 w-auto" priority />
          </Link>
          <button
            onClick={closeDrawer}
            className="w-12 h-12 flex items-center justify-center"
            aria-label="ปิดเมนู"
          >
            <X size={20} weight="bold" className="text-[var(--km-text)]" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="px-5 mt-8 flex-1">
          {NAV_ITEMS.map((item, i) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={closeDrawer}
                className="flex items-center justify-between py-6 group"
              >
                <span className="text-[0.9375rem] font-medium text-[var(--km-text)] leading-none group-active:opacity-60 transition-opacity">
                  {item.label}
                </span>
                {"badge" in item && item.badge && item.badge > 0 ? (
                  <span className="min-w-[24px] h-6 rounded-full bg-[#FFAC00] text-white text-[12px] font-semibold flex items-center justify-center px-1.5">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </Link>
              {i < NAV_ITEMS.length - 1 && (
                <div className="h-px bg-[var(--km-text)]/10" />
              )}
            </div>
          ))}
        </nav>

        {/* Auth CTA buttons — แสดงเฉพาะตอน guest */}
        {!isLoggedIn && (
          <div className="px-5 pb-8 flex flex-col gap-3" style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>
            <button
              onClick={() => { closeDrawer(); router.push("/login"); }}
              className="w-full h-14 rounded-2xl text-[15px] font-semibold text-white transition-opacity active:opacity-80"
              style={{ background: BRAND_YELLOW }}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => { closeDrawer(); router.push("/login?mode=register"); }}
              className="w-full h-14 rounded-2xl text-[15px] font-medium border-2 transition-opacity active:opacity-80"
              style={{ borderColor: BRAND_YELLOW, color: BRAND_YELLOW, background: "transparent" }}
            >
              สมัครสมาชิก
            </button>
          </div>
        )}
      </div>
    </>
  );
}
