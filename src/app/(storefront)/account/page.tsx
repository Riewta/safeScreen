"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard, Package, Truck, Star, RotateCcw, User, ChevronRight, ChevronLeft, Pencil,
  Heart, MapPin, Wallet, Gift, Shield, LogOut, FileText, Globe,
  Coins
} from "lucide-react";
import { useProfile } from "@/stores/user.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useOrdersStore, type OrderStatus } from "@/stores/orders.store";
import { PRODUCTS } from "@/lib/mock-data";
import Image from "next/image";
import { useAuthStore } from "@/stores/auth.store";
import { LogoutConfirmModal } from "@/components/account/LogoutConfirmModal";
import { useLocaleStore } from "@/stores/locale.store";
import { REGIONS, LANGUAGES } from "@/components/layout/RegionSelectorModal";


const ORDER_STATUS_SHORTCUTS: { label: string; icon: React.ElementType; status: OrderStatus }[] = [
  { label: "ที่ต้องชำระ",   icon: CreditCard,    status: "pending_payment" },
  { label: "ที่ต้องจัดส่ง", icon: Package,        status: "processing"      },
  { label: "ที่ต้องได้รับ",  icon: Truck,          status: "shipped"         },
  { label: "ให้คะแนน",     icon: Star,           status: "delivered"       },
];

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  value?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function AccountPage() {
  const router      = useRouter();
  const profile     = useProfile();
  const wishlistIds = useWishlistStore((s) => s.ids);
  const allOrders   = useOrdersStore((s) => s.orders);
  const allReviews  = useOrdersStore((s) => s.reviews);
  const isLoggedIn  = useAuthStore((s) => s.isLoggedIn);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const wishlistScrollRef = useRef<HTMLDivElement>(null);
  const [wishlistCanScrollLeft, setWishlistCanScrollLeft] = useState(false);
  const [wishlistCanScrollRight, setWishlistCanScrollRight] = useState(true);

  const updateWishlistScroll = () => {
    const el = wishlistScrollRef.current;
    if (!el) return;
    setWishlistCanScrollLeft(el.scrollLeft > 0);
    setWishlistCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollWishlist = (dir: "left" | "right") => {
    const el = wishlistScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const { country } = useLocaleStore();

  const [activeRegion, setActiveRegion] = React.useState("TH");
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveRegion(localStorage.getItem("karmart_selected_region") || country.code || "TH");
    }
  }, [country.code]);

  const activeRegionName = REGIONS.find((r) => r.code === activeRegion)?.name.split(" (")[0] || "ประเทศไทย";
  const activeLangLabel = LANGUAGES.find((l) => l.code === country.code)?.label.split(" (")[0] || "ภาษาไทย";
  const activeCurrencyLabel = country.currency || "THB";

  const MOBILE_MENU: MenuSection[] = [
    {
      title: "จัดการบัญชี",
      items: [
        { label: "SafeScreen Points",     icon: Gift,          href: "/account/points"        },
        { label: "รายการที่ถูกใจ",       icon: Heart,         href: "/account/wishlist"  },
        { label: "ที่อยู่จัดส่ง",        icon: MapPin,        href: "/account/addresses" },
        { label: "วิธีชำระเงิน",         icon: Wallet,        href: "/account/payments"  },
        { label: "ใบกำกับภาษีเต็มรูปแบบ", icon: FileText,      href: "/account/tax-invoice" },
        { label: "การคืนสินค้า",        icon: RotateCcw,     href: "/account/orders?status=returning" },
      ],
    },
    {
      title: "เมนูเพิ่มเติม",
      items: [
        { label: "ความเป็นส่วนตัว",      icon: Shield,        href: "/account/privacy"       },
        { 
          label: "ประเทศ / ภูมิภาค",               
          icon: Globe,         
          value: activeRegionName,
          href: "/account/preferences?type=region", 
        },
        { 
          label: "ภาษา",
          icon: Globe,         
          value: activeLangLabel,
          href: "/account/preferences?type=lang", 
        },
        { 
          label: "สกุลเงินที่ใช้",               
          icon: Coins,         
          value: activeCurrencyLabel,
          href: "/account/preferences?type=currency", 
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ── Profile card ── */}
      {isLoggedIn ? (
        <div className="bg-white px-6 py-6 border border-[var(--km-border)] rounded-[24px]">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[var(--km-surface)] border border-[var(--km-border)] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-medium text-[var(--km-text-secondary)]">{profile.name.slice(0, 1)}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-[var(--km-text)] truncate">{profile.name}</p>
              <Link href="/account/points" className="flex items-center gap-1 mt-0.5 group">
                <span className="text-sm font-normal text-[var(--km-text-secondary)] group-hover:text-[var(--km-text)] transition-colors">
                  {profile.points.toLocaleString()} แต้ม
                </span>
                <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--km-text-muted)] group-hover:text-[var(--km-text)] transition-colors" />
              </Link>
            </div>

            <Link href="/account/profile" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--km-border)] text-sm font-medium text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-all">
              <Pencil size={14} /> แก้ไขโปรไฟล์
            </Link>
            <Link href="/account/profile" className="md:hidden p-1.5 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors self-center">
              <Pencil size={15} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white px-5 pt-6 pb-6 border border-[var(--km-border)] rounded-[24px]">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-[var(--km-surface)] border border-[var(--km-border)] flex items-center justify-center flex-shrink-0">
              <User size={24} strokeWidth={1.25} className="text-[var(--km-text-muted)]" />
            </div>
            <div>
              <p className="font-medium text-[var(--km-text)]">สวัสดี!</p>
              <p className="text-xs text-[var(--km-text-muted)] mt-0.5">เข้าสู่ระบบเพื่อประสบการณ์ที่ดียิ่งขึ้น</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/login?redirect=/account")}
            className="w-full py-3 rounded-full bg-[var(--km-text)] text-white text-sm font-medium"
          >
            เข้าสู่ระบบ / สมัครสมาชิก
          </button>
        </div>
      )}


      {/* ── Order status shortcuts ── */}
      <div className="mx-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[14px] font-medium text-[var(--km-text)]">สถานะคำสั่งซื้อ</p>
          <Link href="/account/orders" className="flex items-center gap-1 text-sm text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors">
            ดูทั้งหมด <ChevronRight size={14} strokeWidth={2} />
          </Link>
        </div>
        <div className="bg-white rounded-[24px] border border-[var(--km-border)] overflow-hidden grid grid-cols-4">
          {ORDER_STATUS_SHORTCUTS.map(({ label, icon: Icon, status }) => {
            const countBrandGroups = (orders: typeof allOrders) =>
              orders.reduce((n, o) => n + new Set(o.items.map((i) => i.brand)).size, 0);
            const count = status === "delivered"
              ? countBrandGroups(allOrders.filter((o) =>
                  o.status === "delivered" &&
                  !o.items.some((i) => i.returnStatus) &&
                  o.items.some((i) => !allReviews.find((r) => r.orderId === o.id && r.productId === i.productId))
                ))
              : status === "cancelled"
                ? countBrandGroups(allOrders.filter((o) => o.items.some((i) => i.returnStatus)))
                : countBrandGroups(allOrders.filter((o) => o.status === status));
            const href = status === "delivered" ? "/account/reviews" : status === "cancelled" ? "/account/orders?status=returning" : `/account/orders?status=${status}`;
            return (
              <Link
                key={status}
                href={href}
                className="flex flex-col items-center justify-center gap-3 py-6 active:bg-[var(--km-surface)] hover:bg-[var(--km-surface)]/50 transition-all relative group"
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={1.5} className="text-[var(--km-text-secondary)] group-hover:text-[var(--km-text)] transition-colors" />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] rounded-full bg-[#FB48C4] text-white text-xs font-normal flex items-center justify-center px-1.5 leading-none">
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[var(--km-text-secondary)] text-center leading-tight group-hover:text-[var(--km-text)] transition-colors">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Wishlist row (desktop only) ── */}
      {isLoggedIn && (
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[14px] font-medium text-[var(--km-text)]">รายการที่ถูกใจ</p>
            <Link href="/account/wishlist" className="flex items-center gap-1 text-sm text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors">
              ดูทั้งหมด <ChevronRight size={14} strokeWidth={2} />
            </Link>
          </div>
          {wishlistIds.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-[var(--km-border)] flex flex-col items-center justify-center py-12 gap-2">
              <Heart size={28} strokeWidth={1} className="text-[var(--km-text-muted)]" />
              <p className="text-sm text-[var(--km-text-muted)]">ยังไม่มีรายการที่ถูกใจ</p>
            </div>
          ) : (
            <div className="relative overflow-hidden group/wishlist">
              {wishlistCanScrollLeft && (
                <button
                  onClick={() => scrollWishlist("left")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-[var(--km-border)] shadow-md flex items-center justify-center opacity-0 group-hover/wishlist:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>
              )}
              {wishlistCanScrollRight && (
                <button
                  onClick={() => scrollWishlist("right")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-[var(--km-border)] shadow-md flex items-center justify-center opacity-0 group-hover/wishlist:opacity-100 transition-opacity"
                >
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              )}
              <div
                ref={wishlistScrollRef}
                onScroll={updateWishlistScroll}
                className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
              >
              {wishlistIds.map((id) => {
                const p = PRODUCTS.find((x) => x.id === id);
                if (!p) return null;
                const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
                return (
                  <Link
                    key={id}
                    href={`/products/${id}`}
                    className="flex-shrink-0 w-[160px] bg-white rounded-[20px] border border-[var(--km-border)] hover:border-[var(--km-border-strong)] transition-all flex flex-col p-3 group"
                  >
                    <div className="aspect-square relative w-full bg-[var(--km-surface)] rounded-[14px] overflow-hidden mb-3">
                      <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="160px" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--km-text)] truncate">{p.brand}</p>
                    <p className="text-[12px] text-[var(--km-text-secondary)] line-clamp-2 leading-snug mt-0.5 min-h-[2rem]">{p.name}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[14px] font-medium text-[var(--km-text)]">฿{p.price.toLocaleString()}</span>
                      {discount && discount > 0 && (
                        <span className="text-[11px] text-[var(--km-text-muted)] line-through">฿{p.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile menu (hidden on desktop) ── */}
      <div className="md:hidden flex flex-col gap-4">
        {MOBILE_MENU.map((section, idx) => {
          const isLast = idx === MOBILE_MENU.length - 1;
          return (
            <div key={section.title}>
              <p className="px-1 mb-2 text-[14px] font-medium text-[var(--km-text)]">
                {section.title}
              </p>
              <div className="bg-white rounded-[24px] border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
                {section.items.map((item) => {
                  const content = (
                    <>
                      <item.icon size={18} strokeWidth={1.5} className="text-[var(--km-text-muted)]" />
                      <div className="flex-1 flex items-center gap-2 overflow-hidden">
                        <span className="text-[var(--km-text)]">{item.label}</span>
                        {item.value && (
                          <span className="text-[13px] text-[var(--km-text-muted)] font-normal flex items-center gap-1.5 truncate">
                            {item.value.startsWith("http") ? (
                              <img src={item.value} alt="" className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm border border-black/5" />
                            ) : (
                              item.value
                            )}
                          </span>
                        )}
                      </div>
                      <ChevronRight size={16} strokeWidth={1.5} className="text-[var(--km-text-muted)] flex-shrink-0" />
                    </>
                  );

                  if (item.href) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-4 text-sm text-[var(--km-text-secondary)] active:bg-[var(--km-surface)] transition-colors"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-4 py-4 text-sm text-[var(--km-text-secondary)] active:bg-[var(--km-surface)] transition-colors"
                    >
                      {content}
                    </button>
                  );
                })}
                {isLast && isLoggedIn && (
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-4 text-sm text-[var(--km-error)] active:bg-[var(--km-surface)] transition-colors"
                  >
                    <LogOut size={17} strokeWidth={1.5} />
                    <span>ออกจากระบบ</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-6" />

      <LogoutConfirmModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </div>
  );
}
