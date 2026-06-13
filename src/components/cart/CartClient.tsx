"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Tag, X, Check, ChevronRight, TicketPercent, Trash2, Lock, Gift, ChevronLeft, ShoppingBag } from "lucide-react";
import { useCartStore, useCartSubtotal, smartClampGifts } from "@/stores/cart.store";
import { PromoCampaignSheet } from "@/components/product/PromoCampaignSheet";
import { PROMO_CAMPAIGNS } from "@/lib/campaigns";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useLang } from "@/contexts/lang";
import { PRODUCTS } from "@/lib/mock-data";

const SHIPPING_FEE      = 60;
const FREE_SHIPPING_THR = 590;
const FREE_GIFT_THRESHOLD = 500;
const FREE_GIFT_ELIGIBLE_IDS = ["1", "4", "2"];

/* ─── Bundle Upsell ─── */

interface BundleSuggestion {
  id: string;
  name: string;
  price: number;
  triggerCategories: string[];
}

const BUNDLE_SUGGESTIONS: BundleSuggestion[] = [
  { id: "2",  name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)', price: 1390, triggerCategories: ["magnetic-privacy"] },
  { id: "11", name: 'NanoSnap Privacy Screen — Universal 15.6" (16:9)',        price: 1090, triggerCategories: ["anti-blue"] },
  { id: "8",  name: 'NanoSnap Privacy Screen — Universal 14" (16:9)',          price: 1090, triggerCategories: ["nano"] },
];

const DEFAULT_BUNDLE: BundleSuggestion = {
  id: "2",
  name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
  price: 1390,
  triggerCategories: [],
};

function BundleUpsell({ cartItems }: { cartItems: { productId: string; name: string }[] }) {
  const { pages: t } = useLang();
  const [dismissed, setDismissed] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  // Derive category from product name since CartItem has no category field
  const detectCategory = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("privacy")) return "magnetic-privacy";
    if (lower.includes("anti-blue") || lower.includes("anti blue")) return "anti-blue";
    if (lower.includes("nano")) return "nano";
    return "";
  };

  const suggestion = useMemo<BundleSuggestion>(() => {
    for (const s of BUNDLE_SUGGESTIONS) {
      const matches = cartItems.some((ci) => {
        const cat = detectCategory(ci.name);
        return s.triggerCategories.includes(cat);
      });
      if (matches) return s;
    }
    return DEFAULT_BUNDLE;
  }, [cartItems]);

  // Don't show if the suggested product is already in the cart
  const alreadyInCart = cartItems.some((ci) => ci.productId === suggestion.id);

  if (dismissed || alreadyInCart) return null;

  const discountedPrice = Math.round(suggestion.price * 0.85);
  const savings = suggestion.price - discountedPrice;

  const handleAdd = () => {
    const productData = PRODUCTS.find((p) => p.id === suggestion.id);
    addItem({
      productId: suggestion.id,
      name: suggestion.name,
      brand: "SafeScreen",
      price: discountedPrice,
      originalPrice: suggestion.price,
      image: productData?.image ?? "/products/nano-macbook/nano-macbook-air-13-6.jpg",
      variant: "",
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setDismissed(true), 1200);
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl mx-0 md:mx-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-amber-100 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-amber-800">🎯 {t.cartBundle}</span>
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 flex items-center justify-center rounded-full text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors"
          aria-label="ปิด"
        >
          <X size={14} />
        </button>
      </div>
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-amber-200 flex-shrink-0 relative">
          <Image
            src={PRODUCTS.find((p) => p.id === suggestion.id)?.image ?? "/products/nano-macbook/nano-macbook-air-13-6.jpg"}
            alt={suggestion.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2">{suggestion.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[13px] font-semibold text-green-600">฿{discountedPrice.toLocaleString()}</span>
            <span className="text-xs text-gray-400 line-through">฿{suggestion.price.toLocaleString()}</span>
            <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">ประหยัด 15%</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-0.5">{t.cartBundleSave} ฿{savings.toLocaleString()} {t.cartBundleWhen}</p>
        </div>
      </div>
      <div className="px-4 pb-3 flex gap-2">
        <button
          onClick={handleAdd}
          disabled={added}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[13px] font-semibold transition-all active:scale-[0.97]"
          style={{
            background: added ? "#16a34a" : "#92400e",
            color: "white",
            opacity: added ? 0.9 : 1,
          }}
        >
          {added ? (
            <>
              <Check size={14} />
              เพิ่มแล้ว!
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              {t.cartAddBundle}
            </>
          )}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="px-4 py-2 rounded-full text-[13px] text-amber-700 border border-amber-300 hover:bg-amber-100 transition-colors"
        >
          {t.cartSkip}
        </button>
      </div>
    </div>
  );
}

/* ─── Coupon Sheet ─── */

function CouponSheet({ open, onClose, onApply }: {
  open: boolean; onClose: () => void; onApply: (code: string) => boolean;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    } else { setVisible(false); setInput(""); setError(""); }
  }, [open]);

  const handleApply = () => {
    if (!input.trim()) return;
    const ok = onApply(input.trim());
    if (ok) onClose();
    else    setError("รหัสส่วนลดไม่ถูกต้องหรือหมดอายุ");
  };

  if (!open) return null;

  const content = (
    <>
      <div
        className="fixed inset-0 z-[900] bg-black/50 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />
      {/* Mobile: bottom sheet */}
      <div
        className="md:hidden fixed inset-x-0 bottom-0 z-[910] bg-white rounded-t-2xl flex flex-col transition-transform duration-300"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
          <h2 className="text-base font-medium text-[var(--km-text)]">โค้ดส่วนลด</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)]">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pt-2 pb-3">
          <div className={`flex items-stretch border rounded-lg overflow-hidden transition-colors ${error ? "border-[var(--km-error)]" : "border-[var(--km-border)]"}`}>
            <input autoFocus value={input}
              onChange={(e) => { setInput(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="ใส่รหัสส่วนลดที่นี่"
              className="flex-1 px-4 py-3 text-sm bg-transparent outline-none tracking-widest"
            />
          </div>
          <div className="h-5 mt-2">{error && <p className="text-xs text-[var(--km-error)] px-1">{error}</p>}</div>
        </div>
        <div className="px-5 pt-2" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
          <button onClick={handleApply} disabled={!input.trim()}
            className="w-full py-3.5 rounded-full text-white text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: "var(--km-text)" }}>ยืนยัน</button>
        </div>
      </div>
      {/* Desktop: centered modal */}
      <div
        className="hidden md:flex fixed inset-0 z-[910] items-center justify-center transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-[var(--km-text)]">โค้ดส่วนลด</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)]">
              <X size={18} />
            </button>
          </div>
          <div>
            <div className={`flex items-stretch border rounded-lg overflow-hidden transition-colors ${error ? "border-[var(--km-error)]" : "border-[var(--km-border)]"}`}>
              <input autoFocus value={input}
                onChange={(e) => { setInput(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="ใส่รหัสส่วนลดที่นี่"
                className="flex-1 px-4 py-3 text-sm bg-transparent outline-none tracking-widest"
              />
            </div>
            <div className="h-5 mt-2">{error && <p className="text-xs text-[var(--km-error)] px-1">{error}</p>}</div>
          </div>
          <button onClick={handleApply} disabled={!input.trim()}
            className="w-full py-3.5 rounded-full text-white text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: "var(--km-text)" }}>ยืนยัน</button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}



/* ─── Checkbox ─── */
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all"
      style={{
        borderColor: checked ? "var(--km-text)" : "var(--km-border)",
        background:  checked ? "var(--km-text)" : "transparent",
      }}
    >
      {checked && <Check size={11} color="white" strokeWidth={2} />}
    </button>
  );
}

/* ─── Cart Bottom Bar (portal — escapes CSS transform context) ─── */
function CartBottomBar({
  coupon, discountAmt, allSelected, someSelected, selectedCount,
  total, fullPrice, hasAnyDiscount,
  onRemoveCoupon, onSelectAll, onCheckout, onOpenCoupon, hidden, drawerMode, giftNudge,
}: {
  coupon: string | null; discountAmt: number; allSelected: boolean;
  someSelected: boolean; selectedCount: number;
  total: number; fullPrice: number; hasAnyDiscount: boolean;
  onRemoveCoupon: () => void; onSelectAll: () => void;
  onCheckout: () => void; onOpenCoupon: () => void; hidden?: boolean; drawerMode?: boolean;
  giftNudge?: React.ReactNode;
}) {
  const { pages: t } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || hidden) return null;

  const bar = (
    <>
    {!drawerMode && giftNudge && (
      <div className="fixed left-0 right-0 z-[809] px-4 pb-2 animate-[slideUp_0.35s_cubic-bezier(0.32,0.72,0,1)_both]"
        style={{ bottom: "calc(140px + env(safe-area-inset-bottom))" }}
      >
        {giftNudge}
      </div>
    )}
    {drawerMode && giftNudge && (
      <div className="px-4 pb-2 animate-[slideUp_0.35s_cubic-bezier(0.32,0.72,0,1)_both]">
        {giftNudge}
      </div>
    )}
    <div
      className={drawerMode
        ? "bg-white border-t border-[var(--km-border)] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
        : "fixed left-0 right-0 bottom-0 bg-white border-t border-[var(--km-border)] z-[810] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"}
      style={drawerMode ? undefined : { paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className={drawerMode ? "" : "max-w-4xl mx-auto"}>
        {/* Coupon Row — tap to open sheet */}
        <div className="px-4 py-2.5 border-b border-[var(--km-border)]">
          {coupon ? (
            <div className="flex items-center justify-between gap-3">
              <button onClick={onOpenCoupon} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                <TicketPercent size={14} className="text-[var(--km-text-muted)] shrink-0" />
                <span className="text-xs font-medium text-[var(--km-text)]">
                  ใช้โค้ดแล้ว 1 โค้ด <span className="text-[var(--km-success)]">· ประหยัด ฿{discountAmt.toLocaleString()}</span>
                </span>
              </button>
              <button onClick={onRemoveCoupon} className="p-1 rounded-full transition-colors text-[var(--km-text-muted)] hover:text-[var(--km-error)] shrink-0">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenCoupon}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-left"
            >
              <TicketPercent size={16} className="text-[var(--km-text-muted)] shrink-0" />
              <span className="flex-1 text-[13px] text-[var(--km-text-muted)]">{t.cartCoupon}</span>
              <ChevronRight size={14} className="text-[var(--km-text-muted)] shrink-0" />
            </button>
          )}
        </div>

        {/* AI Checker reminder */}
        <div className="px-4 pb-2">
          <a
            href="/ai-checker"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--km-surface)] border border-[var(--km-border)] hover:border-[var(--km-border-strong)] transition-colors"
          >
            <span className="text-sm">🤖</span>
            <span className="text-xs text-[var(--km-text-secondary)] flex-1">{t.cartAiCheck}</span>
            <span className="text-xs font-medium text-[var(--km-text)] whitespace-nowrap">{t.cartAiCheckCta} →</span>
          </a>
        </div>

        {/* Checkout row */}
        <div className="flex items-center gap-4 px-4 py-3.5">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Checkbox checked={allSelected} onChange={onSelectAll} />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {someSelected ? (
              <>
                <span className="text-xs text-[var(--km-text-secondary)] font-normal uppercase tracking-wider leading-none mb-1">{t.cartTotal}</span>
                <div className="flex items-baseline gap-2 leading-none">
                  <span className="text-base font-semibold text-[var(--km-text)]">฿{total.toLocaleString()}</span>
                  {hasAnyDiscount && (
                    <span className="text-xs text-[var(--km-text-muted)] line-through font-normal">฿{fullPrice.toLocaleString()}</span>
                  )}
                </div>
              </>
            ) : (
              <span className="text-sm text-[var(--km-text-muted)] font-medium">ยังไม่ได้เลือกสินค้า</span>
            )}
          </div>
          <button
            onClick={onCheckout}
            disabled={!someSelected}
            className="px-8 md:px-12 py-3.5 rounded-full text-sm font-medium transition-all active:scale-[0.98] shadow-lg shadow-black/5"
            style={{
              background: someSelected ? "var(--km-text)" : "var(--km-border)",
              color:      someSelected ? "white" : "var(--km-text-muted)",
            }}
          >
            {t.cartCheckout} ({selectedCount})
          </button>
        </div>
      </div>
    </div>

    </>
  );

  return drawerMode ? bar : createPortal(bar, document.body);
}

/* ─── Main Cart Client ─── */
export function CartClient({ drawerMode = false, onClose }: { drawerMode?: boolean; onClose?: () => void } = {}) {
  const { pages: t } = useLang();
  const router = useRouter();

  const {
    items, selectedIds, removeItem, updateQty,
    toggleSelect, selectAll, selectNone,
    coupon, couponDiscount, applyCoupon, removeCoupon,
  } = useCartStore();

  const subtotal = useCartSubtotal();
  const setHeaderLocked = useUIStore((s) => s.setHeaderLocked);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (drawerMode) return;
    setHeaderLocked(true);
    return () => setHeaderLocked(false);
  }, [setHeaderLocked, drawerMode]);

  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [giftSheetCampaignId, setGiftSheetCampaignId] = useState<string | null>(null);
  const giftSheetCampaign = PROMO_CAMPAIGNS.find(c => c.id === giftSheetCampaignId) ?? null;
  const giftSheetProduct = giftSheetCampaign
    ? items.find(i => giftSheetCampaign.eligibleProductIds.includes(i.productId))
    : null;
  const [confirmRemoveCoupon, setConfirmRemoveCoupon] = useState(false);
  const [confirmReduceItem, setConfirmReduceItem] = useState<{ id: string; newQty: number } | null>(null);

  const handleQtyChange = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setConfirmRemoveId(id);
      return;
    }
    updateQty(id, newQty);
  };

  const itemsWithAllGifts = useMemo(() => {
    const flat: any[] = [];
    items.forEach((item) => {
      // 1. Add the main product
      flat.push({ ...item, isGift: false });
      
      // 2. Flatten its freeGifts as main-level gift rows right after it
      if (item.freeGifts && item.freeGifts.length > 0) {
        // Filter out "g2" (Mini Serum Sample) so old cached state in localStorage is ignored
        const filteredGifts = item.freeGifts.filter((g: any) => g.productId !== "g2");
        
        filteredGifts.forEach((gift: any) => {
          const minQty = gift.minQty ?? 1;
          const locked = item.quantity < minQty;
          
          if (!locked) {
            const qty = gift.isThreshold ? gift.quantity : (item.quantity * (gift.maxPerUnit || 1));
            flat.push({
              id: `gift-${item.id}-${gift.productId}`,
              productId: gift.productId,
              name: gift.name,
              brand: (gift.brand || "SafeScreen").toUpperCase(),
              price: 0,
              originalPrice: gift.originalPrice,
              image: gift.image,
              variant: "", // empty
              quantity: qty,
              isGift: true,
              isBogoGift: true,
              parentItemName: item.name,
              parentSelected: selectedIds.includes(item.id),
              locked: false,
              minQty,
              parentQty: item.quantity,
            });
          }
        });
      }
    });
    
    return flat;
  }, [items, subtotal]);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THR;
  const shippingFee    = isFreeShipping ? 0 : SHIPPING_FEE;
  const discountAmt    = coupon ? Math.round(subtotal * couponDiscount / 100) : 0;
  const total          = subtotal + shippingFee - discountAmt;

  // ราคาเต็มก่อนโปรโมชั่นใดๆ (ใช้ originalPrice ถ้ามี)
  const selectedItems  = items.filter((i) => selectedIds.includes(i.id));
  const fullPrice      = selectedItems.reduce((sum, i) => sum + (i.originalPrice ?? i.price) * i.quantity, 0);
  const hasAnyDiscount = fullPrice > subtotal || discountAmt > 0;

  const allSelected  = items.length > 0 && selectedIds.length === items.length;
  const someSelected = selectedIds.length > 0;
  const selectedCount = selectedIds.length;

  const handleSelectAll = () => allSelected ? selectNone() : selectAll();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <Tag size={40} className="text-[var(--km-text-muted)]" strokeWidth={1} />
        <div>
          <h2 className="text-base font-medium text-[var(--km-text)] mb-1">ตะกร้าว่างเปล่า</h2>
          <p className="text-sm text-[var(--km-text-muted)]">เลือกสินค้าที่ชอบและเพิ่มลงตะกร้า</p>
        </div>
        <Link href="/products" className="px-6 py-2.5 rounded-full border border-[var(--km-border-strong)] text-sm font-medium text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors">
          เริ่มช้อปปิ้ง
        </Link>
      </div>
    );
  }

  const wrapperClass = drawerMode
    ? "flex flex-col h-full overflow-hidden"
    : "";

  return (
    <div className={wrapperClass}>
      {/* Drawer header — outside scroll so it stays fixed */}
      {drawerMode && (
        <div className="hidden md:flex items-center justify-between px-5 py-4 border-b border-[var(--km-border)] bg-white flex-shrink-0">
          <h1 className="text-[15px] font-medium text-[var(--km-text)]">{t.cartTitle}</h1>
          <button
            onClick={() => onClose?.()}
            className="p-1.5 rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text)]"
            aria-label="ปิด"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
      )}
      <div className={drawerMode ? "flex-1 overflow-y-auto bg-[var(--km-surface)]" : "min-h-screen bg-[var(--km-surface)]"}>

        {/* Page header (non-drawer) */}
        {!drawerMode && (
          <div className="hidden md:flex items-center gap-3 max-w-4xl mx-auto px-6 pt-12 pb-0">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("cart:exit"))}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text)]"
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-2xl font-semibold text-[var(--km-text)]">{t.cartTitle}</h1>
          </div>
        )}

        {/* Content Grid */}
        <div className={drawerMode ? "px-0 pt-0 pb-40" : "max-w-4xl mx-auto px-0 md:px-6 pt-0 md:pt-6 pb-10 md:pb-32"}>
          <div className="flex flex-col gap-8 items-center">
            
            {/* Left Column: Item List */}
            <div className="flex-1 flex flex-col gap-4 w-full pb-[160px] md:pb-0">
              {/* Flat list of cart items */}
              <div className={`bg-white divide-y divide-[var(--km-border)] ${!drawerMode ? "md:border md:border-[var(--km-border)] md:rounded-2xl overflow-hidden md:shadow-sm" : ""}`}>
                {itemsWithAllGifts.map((item) => {
                  const isGift = item.isGift;
                  const isGwpItem = item.id === "gift-threshold-500";
                  
                  // Selection & lock state
                  const selected = isGift ? true : selectedIds.includes(item.id);
                  const locked = isGift ? (isGwpItem ? subtotal < 500 : item.locked) : false;
                  
                  const parentSelected = item.parentSelected ?? true;

                  return (
                    <div
                      key={item.id}
                      style={isGift ? {
                        maxHeight: parentSelected ? "200px" : "0px",
                        opacity: parentSelected ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.3s ease, opacity 0.25s ease",
                      } : undefined}
                      className={`flex flex-col ${isGift && locked ? "opacity-60" : ""}`}
                    >
                      <div className={`flex gap-3 py-4 ${isGift ? "pl-10 pr-4" : "px-4"}`}>
                        <div className="flex items-start pt-1">
                          {isGift ? (
                            locked ? (
                              <div className="w-5 h-5 rounded-full border border-dashed border-gray-400 bg-transparent flex items-center justify-center flex-shrink-0">
                                <Lock size={10} className="text-gray-400" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 flex-shrink-0" />
                            )
                          ) : (
                            <Checkbox checked={selected} onChange={() => toggleSelect(item.id)} />
                          )}
                        </div>

                        {/* Image */}
                        <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                          <div className={`relative w-20 h-20 rounded-md overflow-hidden bg-white border border-[var(--km-border)] ${locked ? "filter grayscale opacity-75" : ""}`}>
                            <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <div>
                            <div className={`text-[14px] font-semibold uppercase tracking-normal mb-1 ${locked ? "text-[var(--km-warning)]" : "text-[#000000]"}`}>
                              {item.brand}
                            </div>
                            <Link href={`/products/${item.productId}`}>
                              <p className="text-[14px] font-normal text-[var(--km-text-secondary)] leading-snug line-clamp-2 hover:text-[var(--km-text)] transition-colors">
                                {item.name}
                              </p>
                            </Link>
                            {isGift ? (
                              <p className="text-xs text-white bg-[var(--km-text)] rounded-full px-2 py-0.5 w-fit mt-1">
                                {item.giftLabel || t.cartGift}
                              </p>
                            ) : item.variant ? (
                              <p className="text-xs text-[var(--km-text-muted)] mt-0.5 border border-[var(--km-border)] rounded-full px-2 py-0.5 w-fit mt-1">{item.variant}</p>
                            ) : null}
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-auto">
                            <div className="flex-1 flex flex-col gap-1.5">
                              <div className="flex items-baseline gap-1.5">
                                {isGift ? (
                                  <span className="text-[14px] font-medium text-[var(--km-success)]">{t.cartFree}</span>
                                ) :couponDiscount > 0 && selected ? (
                                  <>
                                    <span className="text-[14px] font-normal" style={{ color: "var(--km-success)" }}>฿{Math.round(item.price * (1 - couponDiscount / 100)).toLocaleString()}</span>
                                    <span className="text-xs text-[var(--km-text-muted)] line-through">฿{item.price.toLocaleString()}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-[14px] font-normal text-[var(--km-text-secondary)]">฿{item.price.toLocaleString()}</span>
                                    {item.originalPrice && (
                                      <span className="text-xs text-[var(--km-text-muted)] line-through">฿{item.originalPrice.toLocaleString()}</span>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Lock progress warning */}
                              {locked && (
                                <div className="mt-1 w-full">
                                  {isGwpItem ? (
                                    <>
                                      <div className="flex items-center justify-between text-xs mb-1 pr-4">
                                        <span className="font-medium text-[var(--km-warning)]">
                                          ช้อปเพิ่มอีก <strong className="text-[var(--km-text)]">฿{(500 - subtotal).toLocaleString()}</strong>
                                        </span>
                                        <span className="text-[10px] font-semibold text-[var(--km-warning)]">
                                          {Math.round((subtotal / 500) * 100)}%
                                        </span>
                                      </div>
                                      <div className="h-1.5 rounded-full bg-[var(--km-border)] overflow-hidden w-full max-w-[200px]">
                                        <div 
                                          className="h-full rounded-full bg-[#319795] transition-all duration-700 ease-out" 
                                          style={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }} 
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <span className="text-xs font-semibold text-[var(--km-warning)] mt-1 block">
                                      ซื้ออีก {item.minQty - item.parentQty} ชิ้น ปลดล็อค
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isGift ? (
                                !locked ? (
                                  item.quantity > 0 && (
                                    <span className="text-sm font-normal text-[var(--km-text-muted)] pr-2 select-none">
                                      x{item.quantity}
                                    </span>
                                  )
                                ) : (
                                  <span className="text-[var(--km-warning)] text-xs font-medium px-2.5 py-1 border border-[var(--km-warning)]/40 rounded-full bg-[var(--km-warning)]/5">
                                    ยังไม่ปลดล็อค
                                  </span>
                                )
                              ) : (
                                <>
                                  <button
                                    onClick={() => setConfirmRemoveId(item.id)}
                                    className="w-7 h-7 flex items-center justify-center text-[var(--km-text-muted)] hover:text-[var(--km-error)] transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      className="w-7 h-7 border border-[var(--km-border)] rounded-l-lg flex items-center justify-center hover:border-[var(--km-border-strong)] transition-colors disabled:opacity-30">
                                      <Minus size={10} />
                                    </button>
                                    <div className="w-9 h-7 border-y border-[var(--km-border)] flex items-center justify-center text-xs font-normal">
                                      {item.quantity}
                                    </div>
                                    <button onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                                      className="w-7 h-7 border border-[var(--km-border)] rounded-r-lg flex items-center justify-center hover:border-[var(--km-border-strong)] transition-colors">
                                      <Plus size={10} />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ─── Bundle Upsell ─── */}
              <BundleUpsell
                cartItems={items.map((i) => ({ productId: i.productId, name: i.name }))}
              />

            </div>

          </div>
        </div>
      </div>

      {/* ─── Sticky Bottom Bar — portal to escape transform context ─── */}
      <CartBottomBar
        hidden={!!giftSheetCampaignId}
        drawerMode={drawerMode}
        coupon={coupon}
        discountAmt={discountAmt}
        allSelected={allSelected}
        someSelected={someSelected}
        selectedCount={selectedCount}
        total={total}
        fullPrice={fullPrice}
        hasAnyDiscount={hasAnyDiscount}
        onRemoveCoupon={() => setConfirmRemoveCoupon(true)}
        onSelectAll={handleSelectAll}
        onOpenCoupon={() => {
          if (coupon) setConfirmRemoveCoupon(true);
          else setCouponOpen(true);
        }}
        onCheckout={() => {
          if (!someSelected) return;
          if (!isLoggedIn) { router.push("/login?redirect=/checkout"); onClose?.(); return; }
          onClose?.();
          router.push("/checkout");
        }}
      />

      <CouponSheet
        open={couponOpen}
        onClose={() => setCouponOpen(false)}
        onApply={applyCoupon}
      />

      {/* ─── Gift Campaign Sheet (from cart nudge) ─── */}
      {giftSheetCampaign && giftSheetProduct && (
        <PromoCampaignSheet
          campaign={giftSheetCampaign}
          onClose={() => setGiftSheetCampaignId(null)}
          product={{
            id: giftSheetProduct.productId,
            name: giftSheetProduct.name,
            brand: giftSheetProduct.brand,
            price: giftSheetProduct.price,
            image: giftSheetProduct.image,
          }}
          currentProductQty={giftSheetProduct.quantity}
          currentProductVariant={giftSheetProduct.variant}
          initialTab="gifts"
        />
      )}

      {/* ─── Remove Coupon Confirm ─── */}
      <ConfirmDialog
        open={confirmRemoveCoupon}
        title="ลบโค้ดส่วนลด?"
        description="โค้ดที่ใช้อยู่จะถูกนำออก และส่วนลดจะหายไป"
        confirmLabel="ลบออก"
        cancelLabel="ยกเลิก"
        onConfirm={() => { removeCoupon(); setConfirmRemoveCoupon(false); setCouponOpen(true); }}
        onCancel={() => setConfirmRemoveCoupon(false)}
      />

      {/* ─── Remove Item Confirm ─── */}
      <ConfirmDialog
        open={confirmRemoveId !== null}
        title="ลบสินค้าออกจากตะกร้า?"
        description="สินค้านี้จะถูกนำออกจากตะกร้าของคุณ"
        confirmLabel="ลบออก"
        cancelLabel="ยกเลิก"
        danger
        onConfirm={() => { if (confirmRemoveId) removeItem(confirmRemoveId); setConfirmRemoveId(null); }}
        onCancel={() => setConfirmRemoveId(null)}
      />

      {/* ─── Reduce Item Qty with Gift Clamp Confirm ─── */}
      <ConfirmDialog
        open={confirmReduceItem !== null}
        title="ลดจำนวนสินค้า?"
        description={(() => {
          const item    = items.find((i) => i.id === confirmReduceItem?.id);
          const newQty  = confirmReduceItem?.newQty ?? 0;
          if (!item?.freeGifts) return "ต้องการลดจำนวนสินค้าหรือไม่";
          const clamped = smartClampGifts(item.freeGifts, newQty);
          const removed  = item.freeGifts.filter((g) => g.quantity > 0 && clamped.find((c) => c.productId === g.productId)!.quantity === 0);
          const reduced  = item.freeGifts.filter((g) => {
            const c = clamped.find((c) => c.productId === g.productId)!;
            return c.quantity < g.quantity && c.quantity > 0;
          });
          const parts: string[] = [];
          if (removed.length)  parts.push(`"${removed.map((g) => g.name).join(', ')}" จะถูกนำออกจากตะกร้า`);
          if (reduced.length)  parts.push(`"${reduced.map((g) => g.name).join(', ')}" จะถูกลดจำนวนตาม`);
          return parts.length ? `ของแถม ${parts.join(' และ ')}` : "ต้องการลดจำนวนสินค้าหรือไม่";
        })()}
        confirmLabel="ยืนยัน"
        cancelLabel="ยกเลิก"
        onConfirm={() => {
          if (confirmReduceItem) updateQty(confirmReduceItem.id, confirmReduceItem.newQty);
          setConfirmReduceItem(null);
        }}
        onCancel={() => setConfirmReduceItem(null)}
      />

    </div>
  );
}
