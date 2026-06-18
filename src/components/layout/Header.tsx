"use client";
import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, ChevronDown, ChevronLeft, X, User, ArrowRight, Bell, Clock, Menu } from "lucide-react";
import { Droplets, Sparkles, Eye, Smile, Wind, Sun, Waves, FlaskConical, ShieldCheck, Scissors, Heart, Gem, Gift, Leaf, Wand2, Baby } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { useProfile } from "@/stores/user.store";
import { CountrySelectorButton, RegionSelectorButton } from "@/components/layout/CountrySelector";
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import { CATEGORIES, BRANDS, PRODUCTS } from "@/lib/mock-data";
import Image from "next/image";
import { useLang } from "@/contexts/lang";
import { type Translations } from "@/lib/i18n";

const useCartCount = () => useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

/* ── Route config ──────────────────────────────────────────────
   left:   "hamburger" | "back" | "logo"
   title:  string | null  (null = show KARMARTS logo)
   right:  "full" | "cart-only" | "none"
   announcement: show top bar?
─────────────────────────────────────────────────────────────── */
type HeaderConfig = {
  left:         "hamburger" | "back" | "logo";
  title:        string | null;
  right:        "full" | "cart-only" | "none";
  announcement: boolean;
};

type RouteConfigEntry = { pattern: RegExp | string; config: HeaderConfig };
function buildRouteConfigs(t: Translations["header"]): RouteConfigEntry[] {
  return [
    // ── Checkout flow ──
    { pattern: "/cart",                   config: { left: "back",      title: t.cart,               right: "none",      announcement: false } },
    { pattern: "/checkout/address",       config: { left: "back",      title: t.checkoutAddress,    right: "none",      announcement: false } },
    { pattern: "/checkout/tax-invoice",   config: { left: "back",      title: t.taxInvoiceRequest,  right: "none",      announcement: false } },
    { pattern: "/checkout",              config: { left: "back",      title: t.checkout,            right: "none",      announcement: false } },
    { pattern: "/payment",               config: { left: "back",      title: t.payment,             right: "none",      announcement: false } },
    { pattern: "/order-confirmation",    config: { left: "back",      title: t.orderSuccess,        right: "none",      announcement: false } },
    // ── Account sub-pages (must be before /account catch-all) ──
    { pattern: "/account/preferences",   config: { left: "back",      title: t.regionLanguage,      right: "none",      announcement: false } },
    { pattern: "/account/profile",       config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: /^\/account\/orders\/[^/]+\/return$/, config: { left: "back", title: t.returnItem,   right: "none",      announcement: true  } },
    { pattern: /^\/account\/orders\/[^/]+\/review\//, config: { left: "back", title: t.reviewProduct, right: "none",    announcement: false } },
    { pattern: "/account/orders/",       config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: "/account/orders",        config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: "/account/points",        config: { left: "back",      title: t.points,              right: "none",      announcement: true  } },
    { pattern: "/account/reviews",       config: { left: "back",      title: t.reviews,             right: "none",      announcement: false } },
    { pattern: "/account/addresses",     config: { left: "back",      title: t.addresses,           right: "none",      announcement: true  } },
    { pattern: "/account/wishlist",      config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: "/account/payments",      config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: "/account/notifications", config: { left: "back",      title: t.notifications,       right: "cart-only", announcement: true  } },
    { pattern: "/account/tax-invoice",   config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: "/account/privacy",       config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: "/account/help",          config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: /^\/campaign\/[^/]+$/,    config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: "/campaign",             config: { left: "hamburger", title: null,                   right: "full",      announcement: true  } },
    { pattern: "/privacy",              config: { left: "back",      title: t.privacyPolicy,        right: "none",      announcement: false } },
    { pattern: "/terms",                config: { left: "back",      title: t.terms,                right: "none",      announcement: false } },
    { pattern: "/coupon",               config: { left: "back",      title: t.coupon,               right: "none",      announcement: false } },
    { pattern: "/login",                config: { left: "back",      title: null,                   right: "none",      announcement: false } },
    // ── Account root (tab page) ──
    { pattern: "/account",              config: { left: "hamburger", title: null,                   right: "full",      announcement: true  } },
    // ── PDP ──
    { pattern: /^\/products\/[^/]+\/reviews$/, config: { left: "logo", title: null,                 right: "full",      announcement: true  } },
    { pattern: /^\/products\/[^/]+\/$/,  config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    { pattern: /^\/products\/[^/]+$/,    config: { left: "logo",      title: null,                  right: "full",      announcement: true  } },
    // ── SafeScreen pages ──
    { pattern: "/express",    config: { left: "logo", title: null, right: "full", announcement: true } },
    { pattern: "/store",      config: { left: "logo", title: null, right: "full", announcement: true } },
    { pattern: "/corporate",  config: { left: "logo", title: null, right: "full", announcement: true } },
    { pattern: "/ai-checker", config: { left: "logo", title: null, right: "full", announcement: true } },
    { pattern: "/blog",       config: { left: "logo", title: null, right: "full", announcement: true } },
    { pattern: "/admin",      config: { left: "back", title: "Admin",            right: "none", announcement: false } },
  ];
}

const DEFAULT_CONFIG: HeaderConfig = {
  left: "hamburger", title: null, right: "full", announcement: true,
};

function getConfig(pathname: string, configs: RouteConfigEntry[]): HeaderConfig {
  for (const { pattern, config } of configs) {
    if (typeof pattern === "string") {
      if (pathname === pattern || pathname.startsWith(pattern + "/")) return config;
    } else {
      if (pattern.test(pathname)) return config;
    }
  }
  return DEFAULT_CONFIG;
}

function MobileSearchButton() {
  const searchOpen = useUIStore((s) => s.searchOpen);
  const openSearch = useUIStore((s) => s.openSearch);
  const closeSearch = useUIStore((s) => s.closeSearch);

  return (
    <button
      onClick={searchOpen ? closeSearch : openSearch}
      className="md:hidden p-2 text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors"
      aria-label={searchOpen ? "ปิดค้นหา" : "ค้นหา"}
    >
      <Search size={22} strokeWidth={1.75} />
    </button>
  );
}

// Announcements moved inside Header component to support i18n

export function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const cartCount = useCartCount();
  const activeCartCount = cartCount;
  const cartHref = "/cart";
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const openSearch = useUIStore((s) => s.openSearch);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const openMobileNav = useUIStore((s) => s.openMobileNav);
  const closeMobileNav = useUIStore((s) => s.closeMobileNav);
  const setHeaderHidden = useUIStore((s) => s.setHeaderHidden);
  const setHeaderHeight = useUIStore((s) => s.setHeaderHeight);
  const { isLoggedIn } = useAuthStore();
  const profile = useProfile();
  const name = profile.name;
  const headerLocked          = useUIStore((s) => s.headerLocked);
  const headerTitleOverride   = useUIStore((s) => s.headerTitleOverride);
  const headerBackOverride     = useUIStore((s) => s.headerBackOverride);
  const headerRightOverride    = useUIStore((s) => s.headerRightOverride);
  const headerCenterTitle      = useUIStore((s) => s.headerCenterTitle);
  const headerHideBack         = useUIStore((s) => s.headerHideBack);
  const { header: tHeader } = useLang();
  const ANNOUNCEMENTS = tHeader.announcements;
  const routeConfigs = useMemo(() => buildRouteConfigs(tHeader), [tHeader]);

  const [mounted, setMounted] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    setMounted(true);
    const closed = sessionStorage.getItem("announcement-closed");
    if (!closed) {
      setShowAnnouncement(true);
    }
  }, []);

  useEffect(() => {
    if (!showAnnouncement) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [showAnnouncement]);

  useEffect(() => {
    if (activeIndex === ANNOUNCEMENTS.length) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(0);
      }, 500);
      return () => clearTimeout(resetTimer);
    }
  }, [activeIndex]);

  const { left, title: routeTitle, right, announcement } = getConfig(pathname, routeConfigs);
  const title = headerTitleOverride ?? routeTitle;

  const headerRef = useRef<HTMLElement>(null);
  const [, setHidden] = useState(false);

  // Measure and report header height
  useLayoutEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [showAnnouncement, announcement, pathname, setHeaderHeight]);



  useEffect(() => {
    if (headerLocked) {
      setHidden(false);
      setHeaderHidden(false);
    }
  }, [headerLocked, setHeaderHidden]);

  // Header always visible — no hide-on-scroll

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[200] bg-white/80 backdrop-blur-xl border-b border-[var(--km-border)] shadow-sm"
      suppressHydrationWarning
    >

      {/* Announcement bar */}
      {(announcement || showAnnouncement) && (
        <div className={`
          ${showAnnouncement ? (announcement ? "block" : "hidden") : "hidden"}
          relative bg-[var(--km-surface-dark)]/90 text-[var(--km-text-inverse)] text-xs text-center py-2 tracking-wide backdrop-blur-md overflow-hidden h-9 flex items-center justify-center
        `}>
          <div className="h-5 overflow-hidden relative flex-1 flex justify-center items-center">
            <div 
              className={`flex flex-col absolute inset-x-0 ${isTransitioning ? "transition-transform duration-500 ease-in-out" : "transition-none"}`}
              style={{ transform: `translateY(-${activeIndex * 20}px)` }}
            >
              {[...ANNOUNCEMENTS, ANNOUNCEMENTS[0]].map((text, i) => (
                <div key={i} className="h-5 flex items-center justify-center text-center font-normal">
                  {text}
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => {
              setShowAnnouncement(false);
              sessionStorage.setItem("announcement-closed", "true");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--km-text-inverse)]/70 hover:text-[var(--km-text-inverse)] transition-colors"
            aria-label="ปิดการแจ้งเตือน"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center gap-2">

        {/* Left action (Mobile only) */}
        <div className="flex md:hidden items-center">
          {left === "back" && !headerHideBack && (
            <button
              onClick={() => {
                if (headerBackOverride) {
                  headerBackOverride();
                } else if (pathname === "/cart") {
                  window.dispatchEvent(new CustomEvent("cart:exit"));
                } else {
                  router.back();
                }
              }}
              className="p-2 -ml-2 text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors flex-shrink-0"
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft size={22} strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Logo & Nav (Desktop: Always Full | Mobile: Adaptive) */}
        <div className="flex-1 flex items-center h-full">
          {/* Logo */}
          <Link href="/" className={`${title ? "hidden md:flex" : "flex"} md:static md:translate-x-0 md:mr-6 items-center flex-shrink-0`}>
            <Image src="/logo.svg" alt="SafeScreen" width={220} height={28} className="h-6 md:h-5 w-auto" priority unoptimized suppressHydrationWarning />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 flex-1 h-full">
            <ShopDropdown />
            <NavItem label="Express" href="/express" />
            <NavItem label="Store" href="/store" />
            <NavItem label="B2B" href="/corporate" />
            <NavItem label="AI Checker" href="/ai-checker" />
            <NavItem label="About Us" href="/about" />
          </nav>

          {/* Mobile Center Title */}
          {title && (
            <div className={`md:hidden flex items-center pointer-events-none ${headerCenterTitle ? "absolute left-1/2 -translate-x-1/2" : ""}`}>
              <h1 className="text-base font-medium text-[var(--km-text)] truncate">
                {title}
              </h1>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto flex-shrink-0">
          <div className="hidden xl:flex items-center h-full mr-2">
            <CountrySelectorButton />
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Account Icon */}
            <Link
              href={mounted && isLoggedIn ? "/account" : "/login"}
              className="hidden md:flex items-center gap-1.5 p-2 text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors"
              aria-label="บัญชีของฉัน"
            >
              <User size={22} strokeWidth={1.75} />
              <span className="text-[13px] font-medium tracking-wide">
                {mounted && isLoggedIn ? name.split(" ")[0] : tHeader.login}
              </span>
            </Link>

            {/* Desktop: search button + drawer */}
            <div className="hidden md:block">
              <button
                onClick={openSearch}
                className="p-2 text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors"
                aria-label="ค้นหา"
              >
                <Search size={22} strokeWidth={1.75} />
              </button>
            </div>
            {/* Mobile: just the button, SearchOverlay handles the rest */}
            {right === "full" && (
              <MobileSearchButton />
            )}

            {/* Notification Bell */}
            {right !== "none" && (
              <NotificationBell isLoggedIn={isLoggedIn} />
            )}

            {/* Mobile right override (e.g. checkout exit button) */}
            {right === "none" && headerRightOverride && (
              <div className="md:hidden">{headerRightOverride}</div>
            )}

            {right !== "none" && (
              <>
                {/* Mobile: hamburger → opens nav drawer */}
                <button
                  onClick={() => mobileNavOpen ? closeMobileNav() : openMobileNav()}
                  className="relative p-2 text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors flex md:hidden"
                  aria-label="เมนู"
                >
                  <Menu size={22} strokeWidth={1.75} />
                </button>

                {/* Desktop: cart → opens cart drawer (ต้อง login ก่อน) */}
                <button
                  onClick={() => isLoggedIn ? openCartDrawer() : router.push("/login?redirect=/cart")}
                  className="relative p-2 text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors hidden md:flex items-center justify-center"
                  aria-label="ตะกร้าสินค้า"
                >
                  <ShoppingBag size={22} strokeWidth={1.75} />
                  {isLoggedIn && activeCartCount > 0 && (
                    <span key={activeCartCount} className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#FFAC00] text-white text-[11px] font-medium flex items-center justify-center leading-none px-1 shadow-sm animate-badge-pop">
                      {activeCartCount > 99 ? "99+" : activeCartCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NotificationBell({ isLoggedIn }: { isLoggedIn: boolean }) {
  const openNotifDrawer = useUIStore((s) => s.openNotifDrawer);
  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <button
      onClick={() => openNotifDrawer()}
      className="relative p-2 text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors"
      aria-label="การแจ้งเตือน"
    >
      <Bell size={22} strokeWidth={1.75} />
      {isLoggedIn && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#FFAC00] text-white text-[11px] font-medium flex items-center justify-center leading-none px-1 shadow-sm animate-badge-pop">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}

function DesktopBrandLogo({ logo, name }: { logo?: string; name: string }) {
  const [error, setError] = useState(false);
  if (!logo || error) return <div className="w-full h-full flex items-center justify-center"><span className="text-base font-bold text-[var(--km-text-muted)]/30">{name[0]}</span></div>;
  return <Image src={logo} alt={name} width={120} height={120} className="w-full h-full object-cover" unoptimized onError={() => setError(true)} />;
}


const SEARCH_ICON_MAP: Record<string, React.ElementType> = {
  Droplets, Sparkles, Eye, Smile, Wind, Sun, Waves, FlaskConical,
  ShieldCheck, Scissors, Heart, Gem, Gift, Leaf, Wand2, Baby,
};


function ShopDropdown() {
  const { shopDropdown: t, nav } = useLang();
  const items = [
    { label: t.all,      href: "/products" },
    { label: t.privacy,  href: "/products?type=privacy" },
    { label: t.nano,     href: "/products?type=nano" },
    { label: t.antiBlue, href: "/products?type=anti-blue" },
    { label: t.paper,    href: "/products?type=paper" },
  ];
  return <NavDropdown label={nav.shop} href="/products" items={items} />;
}

function NavDropdown({ label, href, items }: {
  label: string;
  href: string;
  items: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(pathname === href || (href !== "/" && pathname.startsWith(href)));
  }, [pathname, href]);

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className={`flex items-center gap-1 text-[13px] font-medium transition-colors whitespace-nowrap tracking-wide h-full px-3 ${isActive ? "text-[var(--km-text)]" : "text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"}`}
      >
        {label}
        <ChevronDown size={12} strokeWidth={2} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </Link>

      {open && (
        <div className="absolute top-full left-0 bg-white border border-[var(--km-border)] rounded-xl shadow-lg overflow-hidden py-1.5 z-[300]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-2.5 hover:bg-[var(--km-surface)] transition-colors whitespace-nowrap text-[13px] font-medium text-[var(--km-text)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItem({ label, href = "#", showArrow = false }: { label: string; href?: string; showArrow?: boolean }) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(pathname === href || (href !== "/" && pathname.startsWith(href)));
  }, [pathname, href]);

  return (
    <Link
      href={href}
      className={`flex items-center gap-1 text-[13px] font-medium transition-colors whitespace-nowrap tracking-wide h-full px-1 ${isActive ? "text-[var(--km-text)]" : "text-[var(--km-text-secondary)] hover:text-[var(--km-text)]"}`}
    >
      {label}
      {showArrow && <ChevronDown size={14} strokeWidth={2} />}
    </Link>
  );
}
