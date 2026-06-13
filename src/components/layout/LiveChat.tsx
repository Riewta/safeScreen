"use client";

import { MessageCircle, ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";

export function LiveChat() {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const announcementVisible = useUIStore((s) => s.bottomAnnouncementVisible);

  // Track scroll position to show/hide Scroll to Top button
  useEffect(() => {
    const handleScroll = () => {
      // Whitelist pages where Scroll to Top is needed
      const isHomepage = pathname === "/";
      const isProductList = pathname.startsWith("/products");
      const isBrandDetail = pathname.startsWith("/brands");
      const isCampaignOrCollection = pathname.startsWith("/campaign") || pathname.startsWith("/collection");
      
      const isAccountOrders = pathname.startsWith("/account/orders");
      const isScrollNeededPage = isHomepage || isProductList || isBrandDetail || isCampaignOrCollection || isAccountOrders;
      
      setShowScrollTop(window.scrollY > 300 && isScrollNeededPage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hide in checkout flow, cart, and order confirmation
  const hideChat = 
    pathname.startsWith("/checkout") || 
    pathname === "/cart" || 
    pathname === "/order-confirmation" ||
    pathname === "/payment" ||
    pathname.startsWith("/login");

  if (hideChat) return null;

  // Pages with their own sticky bottom bar (Product PDP) — need extra clearance
  const isPDP = /^\/products\/[^/]+$/.test(pathname);

  const bottomClass = isPDP
    ? "bottom-[calc(104px+env(safe-area-inset-bottom))] md:bottom-8"
    : announcementVisible
      ? "bottom-[calc(124px+env(safe-area-inset-bottom))] md:bottom-8"
      : "bottom-[calc(88px+env(safe-area-inset-bottom))] md:bottom-8";

  return (
    <div 
      className={`fixed right-4 z-[var(--z-fab)] flex flex-col items-end gap-3 transition-all duration-300 pointer-events-none ${bottomClass}`}
    >
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`flex items-center justify-center w-12 h-12 bg-white/60 backdrop-blur-lg saturate-150 border border-white/40 text-[var(--km-text)] rounded-full shadow-lg transition-all duration-300 hover:bg-white/80 active:scale-90 pointer-events-auto ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        aria-label="Scroll to Top"
      >
        <ArrowUp size={24} strokeWidth={2} />
      </button>

      {/* Live Chat Button */}
      <button
        className="flex items-center justify-center w-14 h-14 bg-[var(--km-text)] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto"
        aria-label="Live Chat"
      >
        <MessageCircle size={28} strokeWidth={1.5} />
      </button>
    </div>
  );
}
