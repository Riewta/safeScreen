"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList, Heart, MapPin, Wallet, Gift,
  Shield, LogOut, FileText, RotateCcw
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { LogoutConfirmModal } from "@/components/account/LogoutConfirmModal";


const MENU_SECTIONS = [
  {
    title: "จัดการบัญชี",
    items: [
      { label: "SafeScreen Points",          icon: Gift,          href: "/account/points"                   },
      { label: "คำสั่งซื้อทั้งหมด",        icon: ClipboardList, href: "/account/orders"                   },
      { label: "รายการที่ถูกใจ",            icon: Heart,         href: "/account/wishlist"                 },
      { label: "ที่อยู่จัดส่ง",             icon: MapPin,        href: "/account/addresses"                },
      { label: "วิธีชำระเงิน",              icon: Wallet,        href: "/account/payments"                 },
      { label: "ใบกำกับภาษีเต็มรูปแบบ",    icon: FileText,      href: "/account/tax-invoice"              },
      { label: "การคืนสินค้า",              icon: RotateCcw,     href: "/account/orders?status=returning"  },
    ],
  },
  {
    title: "เมนูเพิ่มเติม",
    items: [
      { label: "ความเป็นส่วนตัว",           icon: Shield,        href: "/account/privacy"                  },
    ],
  },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const isPreferences = pathname === "/account/preferences";
  const isNotifications = pathname === "/account/notifications";
  const isAddresses = pathname === "/account/addresses";
  const whiteOnMobile = isNotifications || isAddresses;

  if (isPreferences) {
    return (
      <div className="bg-white min-h-screen w-full">
        {children}
      </div>
    );
  }

  return (
    <div className={`${whiteOnMobile ? "bg-white md:bg-[var(--km-surface)]" : "bg-[var(--km-surface)]"} min-h-screen`}>
      <div className={`max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-24`}>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Column: Sidebar Menu (Desktop Only) */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="bg-white border border-[var(--km-border)] rounded-2xl overflow-hidden divide-y divide-[var(--km-border)] shadow-sm">
              {MENU_SECTIONS.map((section) => (
                <div key={section.title} className="py-2">
                  <p className="px-4 py-2 text-xs font-semibold text-[var(--km-text-muted)] uppercase tracking-wider">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const isActive = pathname === item.href && pathname !== "/account";
                    const requiresAuth = ["/account/profile", "/account/orders", "/account/wishlist", "/account/points", "/account/points?tab=history", "/account/addresses", "/account/payments"].includes(item.href);
                    const href = (!isLoggedIn && requiresAuth) ? `/login?redirect=${encodeURIComponent(item.href)}` : item.href;
                    
                    return (
                      <Link
                        key={item.href}
                        href={href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-all group ${
                          isActive 
                            ? "text-[var(--km-text)] bg-[var(--km-surface)] font-medium" 
                            : "text-[var(--km-text-secondary)] hover:text-[var(--km-text)] hover:bg-[var(--km-surface)]"
                        }`}
                      >
                        <item.icon 
                          size={17} 
                          strokeWidth={isActive ? 2 : 1.5} 
                          className={`transition-colors ${isActive ? "text-[var(--km-text)]" : "text-[var(--km-text-muted)] group-hover:text-[var(--km-text)]"}`} 
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
              
              {isLoggedIn && (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-4 text-sm text-[var(--km-error)] hover:bg-[var(--km-error)]/5 transition-all group"
                >
                  <LogOut size={17} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">ออกจากระบบ</span>
                </button>
              )}
            </div>
          </aside>

          {/* Right Column: Content */}
          <div className="flex-1 min-w-0 w-full">
            {children}
          </div>
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>

  );
}
