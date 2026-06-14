"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, CaretDown, User, SignOut } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { useProfile } from "@/stores/user.store";
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
  const logout       = useAuthStore((s) => s.logout);
  const profile      = useProfile();
  const cartCount    = useCartCount();
  const drawerOpen   = useUIStore((s) => s.mobileNavOpen);
  const closeDrawer  = useUIStore((s) => s.closeMobileNav);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => { closeMenu(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { closeDrawer(); setShopOpen(false); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const { nav, shopDropdown: sd } = useLang();

  const hideFAB = pathname === "/cart"
    || pathname.startsWith("/checkout")
    || pathname === "/payment"
    || pathname === "/order-confirmation";

  if (hideFAB) return null;

  const SHOP_ITEMS = [
    { label: sd.all,      href: "/products" },
    { label: sd.paper,    href: "/products?type=paper" },
    { label: sd.privacy,  href: "/products?type=privacy" },
    { label: sd.antiBlue, href: "/products?type=anti-blue" },
    { label: sd.nano,     href: "/products?type=nano" },
  ];

  const NAV_ITEMS: { label: string; href: string; dropdown?: boolean }[] = [
    { label: nav.shop,        href: "/products", dropdown: true },
    { label: "Express",       href: "/express" },
    { label: "Store",         href: "/store" },
    { label: "Corporate",     href: "/corporate" },
    { label: "AI Checker",    href: "/ai-checker" },
    { label: "About Us",      href: "/about" },
  ];

  return (
    <>
      {categoryOpen && <CategoryMenuOverlay onClose={closeMenu} />}

      {/* Full-screen overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[900] transition-all duration-300 flex flex-col ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "#ffffff" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 8 }}>
          <Link href="/" onClick={closeDrawer}>
            <Image src="/logo.png" alt="SafeScreen" width={110} height={28} className="h-7 w-auto" priority />
          </Link>
          <button onClick={closeDrawer} className="w-12 h-12 flex items-center justify-center" aria-label="ปิดเมนู">
            <X size={20} weight="bold" className="text-[var(--km-text)]" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="px-5 mt-6 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item, i) => (
            <div key={item.href}>
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => setShopOpen((v) => !v)}
                    className="w-full flex items-center justify-between py-4"
                  >
                    <span className="text-[0.9375rem] font-medium text-[var(--km-text)]">{item.label}</span>
                    <CaretDown
                      size={16}
                      weight="bold"
                      className={`text-[var(--km-text-muted)] transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {shopOpen && (
                    <div className="mb-2 ml-3 flex flex-col gap-0">
                      {SHOP_ITEMS.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={closeDrawer}
                          className="py-3 text-[0.875rem] text-[var(--km-text-secondary)] border-b border-[var(--km-text)]/5 last:border-0"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href === "/cart" && !isLoggedIn ? "/login?redirect=/cart" : item.href}
                  onClick={closeDrawer}
                  className="flex items-center justify-between py-4"
                >
                  <span className="text-[0.9375rem] font-medium text-[var(--km-text)]">
                    {item.label}
                  </span>
                  {item.href === "/cart" && isLoggedIn && cartCount > 0 && (
                    <span className="min-w-[22px] h-[22px] rounded-full bg-[#FFAC00] text-white text-[11px] font-semibold flex items-center justify-center px-1">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              )}
              {i < NAV_ITEMS.length - 1 && <div className="h-px bg-[var(--km-text)]/10" />}
            </div>
          ))}
        </nav>

        {/* Bottom bar */}
        {isLoggedIn ? (
          <div className="px-5" style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>
            <div className="h-px bg-[var(--km-text)]/10 mb-1" />
            <div className="flex items-center justify-between py-3">
              <Link
                href="/account"
                onClick={closeDrawer}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <User size={22} weight="regular" className="shrink-0 text-[var(--km-text)]" />
                <span className="text-[0.9375rem] font-medium text-[var(--km-text)] truncate">
                  {profile.name}
                </span>
              </Link>
              <button
                onClick={() => { closeDrawer(); logout(); }}
                className="ml-4 shrink-0 p-2 text-[var(--km-text-muted)]"
                aria-label="ออกจากระบบ"
              >
                <SignOut size={22} weight="regular" />
              </button>
            </div>
          </div>
        ) : (
          <div className="px-5 flex flex-col gap-3" style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>
            <button
              onClick={() => { closeDrawer(); router.push("/login"); }}
              className="w-full h-13 rounded-2xl text-[15px] font-semibold text-white active:opacity-80"
              style={{ background: BRAND_YELLOW, height: 52 }}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => { closeDrawer(); router.push("/login?mode=register"); }}
              className="w-full h-13 rounded-2xl text-[15px] font-medium border-2 active:opacity-80"
              style={{ borderColor: BRAND_YELLOW, color: BRAND_YELLOW, background: "transparent", height: 52 }}
            >
              สมัครสมาชิก
            </button>
          </div>
        )}
      </div>
    </>
  );
}
