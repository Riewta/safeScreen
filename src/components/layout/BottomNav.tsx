"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, SquaresFour, ShoppingCart, User } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { CategoryMenuOverlay } from "./CategoryMenuOverlay";
import { BottomAnnouncement } from "./BottomAnnouncement";
import { useLang } from "@/contexts/lang";

export function BottomNav() {
  const pathname     = usePathname();
  const categoryOpen = useUIStore((s) => s.categoryMenuOpen);
  const closeMenu    = useUIStore((s) => s.closeCategoryMenu);
  const searchOpen   = useUIStore((s) => s.searchOpen);
  const isLoggedIn   = useAuthStore((s) => s.isLoggedIn);
  useEffect(() => { closeMenu(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const { nav } = useLang();

  const hideFAB = pathname === "/cart"
    || pathname.startsWith("/checkout")
    || pathname === "/payment"
    || pathname === "/order-confirmation";

  // Pages with their own sticky bottom bar — FAB needs extra clearance (~72px)
  const hasStickyBottomBar = /^\/products\/[^/]+$/.test(pathname);

  const hideNav = hideFAB
    || hasStickyBottomBar
    || pathname === "/coupon"
    || pathname === "/login"
    || pathname === "/account/preferences"
    || /^\/account\/orders\/.+/.test(pathname);

  if (hideFAB) return null;

  const NAV_ITEMS = [
    { label: nav.home, href: "/",         icon: House        },
    { label: nav.shop, href: "/products", icon: SquaresFour  },
    { label: nav.cart, href: "/cart",     icon: ShoppingCart },
    { label: nav.me,   href: "/account",  icon: User         },
  ];

  return (
    <>
      {categoryOpen && <CategoryMenuOverlay onClose={closeMenu} />}



      {!hideNav && (
        <div
          className={`md:hidden fixed bottom-0 inset-x-0 transition-transform duration-300 ease-in-out ${searchOpen ? "translate-y-full" : "translate-y-0"}`}
          style={{ zIndex: "var(--z-bottomnav)" }}
        >
          {/* Mobile Announcement Bar on the top border of BottomNav */}
          <BottomAnnouncement />

          <nav
            className="bg-white/80 backdrop-blur-xl border-t border-[var(--km-border)] rounded-t-[24px] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="grid grid-cols-4 h-[72px]">
              {NAV_ITEMS.map((item) => {
                const EXCLUDED = ["/account/notifications"];
                const isActive = !EXCLUDED.includes(pathname) && (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/")));
                const Icon     = item.icon;
                const color    = isActive ? "var(--km-brand)" : "var(--km-text-muted)";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center justify-center gap-1 transition-colors relative"
                  >
                    {item.href === "/account" && !isLoggedIn && (
                      <div className="absolute top-2 right-[calc(50%-14px)] w-1.5 h-1.5 rounded-full bg-[var(--km-error)]" />
                    )}
                    <Icon size={24} weight={isActive ? "fill" : "regular"} style={{ color }} />
                    <span className="text-xs font-normal leading-none" style={{ color }}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
