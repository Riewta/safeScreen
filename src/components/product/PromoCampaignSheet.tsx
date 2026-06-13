"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Gift, Check, Plus, Minus, ShoppingCart, ChevronRight } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { type ProductCardProps } from "@/components/product/ProductCard";
import { type PromoCampaign, type PromoProduct } from "@/lib/campaigns";


interface PromoCampaignSheetProps {
  campaign: PromoCampaign | null;
  onClose: () => void;
  product: ProductCardProps;
  currentProductQty: number;
  currentProductVariant: string;
  initialTab?: "products" | "gifts";
}

export function PromoCampaignSheet({
  campaign,
  onClose,
  product,
  currentProductQty,
  currentProductVariant,
  initialTab = "products",
}: PromoCampaignSheetProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setForceHeaderVisible = useUIStore((s) => s.setForceHeaderVisible);

  const isOpen = campaign !== null;
  const lastCampaignRef = React.useRef<typeof campaign>(campaign);
  if (campaign) lastCampaignRef.current = campaign;
  const activeCampaignData = lastCampaignRef.current;

  const [mounted, setMounted] = useState(false);
  const [animOpen, setAnimOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "gifts">("products");
  const [promoVariants, setPromoVariants] = useState<Record<string, string>>({});

  // Mount first, then trigger animation on next frame
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimOpen(true)));
    } else {
      setAnimOpen(false);
      const t = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Reset content when campaign changes
  useEffect(() => {
    if (isOpen && campaign) {
      const defaultVariants: Record<string, string> = {};
      campaign.products.forEach((p) => {
        defaultVariants[p.id] = p.variants[0].label;
      });
      setPromoVariants(defaultVariants);
      setQuantities(campaign.type === "bogo" ? {} : { [product.id]: currentProductQty });
      setActiveTab(initialTab);
      setSelectedGiftIds([]);
    }
  }, [isOpen, campaign?.id, product.id, currentProductQty]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => { onClose(); };

  const setQty = (id: string, val: number) => {
    const promoItem = campaign?.products.find(p => p.id === id);
    const cap = promoItem?.maxPerCustomer ?? Infinity;
    setQuantities((p) => ({ ...p, [id]: Math.min(Math.max(0, val), cap) }));
  };

  const getVariantDetails = (item: PromoProduct) => {
    const label = promoVariants[item.id] ?? item.variants[0].label;
    const v = item.variants.find((v) => v.label === label) ?? item.variants[0];
    return { price: v.price, originalPrice: v.originalPrice, label: v.label };
  };

  const mainPrice = product.price;
  const mainImage = product.image;
  const mainOriginalPrice = product.originalPrice;

  const total = useMemo(() => {
    if (!campaign) return 0;
    const mainCost = (quantities[product.id] ?? 0) * mainPrice;
    const promoCost = campaign.products.reduce((acc, item) => {
      return acc + (quantities[item.id] ?? 0) * getVariantDetails(item).price;
    }, 0);
    return mainCost + promoCost;
  }, [quantities, product.id, mainPrice, promoVariants, campaign]);

  // free-gift specific
  const threshold = campaign?.threshold ?? 500;
  const isUnlocked = campaign?.type === "free-gift" ? total >= threshold : total > 0;
  const maxGifts = 1;
  const addGift = (id: string) => setSelectedGiftIds([id]);
  const removeGift = (id: string) => setSelectedGiftIds((prev) => prev.filter((x) => x !== id));

  const handleConfirm = () => {
    if (total === 0 || !campaign) return;
    const mainQty = quantities[product.id] ?? 0;
    const giftOptions = campaign.giftOptions ?? [];
    const freeGifts = isUnlocked && selectedGiftIds.length > 0
      ? selectedGiftIds.map((id) => {
          const g = giftOptions.find((x) => x.id === id);
          if (!g) return null;
          return { productId: g.id, name: g.name, image: g.image, brand: g.brand, originalPrice: g.originalPrice ?? 0, quantity: 1, maxPerUnit: 1, minQty: 1 };
        }).filter(Boolean) as { productId: string; name: string; image: string; brand: string; originalPrice: number; quantity: number; maxPerUnit: number; minQty: number }[]
      : undefined;

    if (mainQty > 0) {
      addItem({ productId: product.id, name: product.name, brand: product.brand, image: mainImage, price: mainPrice, originalPrice: mainOriginalPrice, variant: currentProductVariant, quantity: mainQty, freeGifts });
    }
    campaign.products.forEach((item) => {
      const q = quantities[item.id] ?? 0;
      if (q > 0) {
        const d = getVariantDetails(item);
        if (isBogo) {
          const bogoQ = campaign.bogoQty ?? 1;
          const bogoF = campaign.bogoFreeQty ?? 1;
          const freeQty = Math.floor(q / bogoQ) * bogoF;
          const bogoFreeGifts = freeQty > 0 ? [{
            productId: item.id, name: item.name, image: item.image, brand: item.brand,
            originalPrice: d.price, quantity: freeQty, maxPerUnit: bogoF, minQty: bogoQ, isThreshold: false,
          }] : undefined;
          addItem({ productId: item.id, name: item.name, brand: item.brand, image: item.image, price: d.price, originalPrice: d.originalPrice, variant: d.label, quantity: q, freeGifts: bogoFreeGifts });
        } else {
          addItem({ productId: item.id, name: item.name, brand: item.brand, image: item.image, price: d.price, originalPrice: d.originalPrice, variant: d.label, quantity: q });
        }
      }
    });
    setForceHeaderVisible(true);
    handleClose();
  };

  if (!mounted) return null;

  const isBogo = activeCampaignData?.type === "bogo";
  const giftOptions = activeCampaignData?.giftOptions ?? [];

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[850] bg-black/40 transition-opacity duration-500 ${animOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={handleClose}
      />

      {/* Sheet (mobile) / Modal (desktop) */}
      <div
        className={[
          "fixed z-[900] bg-white overflow-clip transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col max-h-[85dvh]",
          "bottom-0 left-0 right-0 rounded-t-2xl",
          "md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:rounded-2xl md:w-[560px] md:max-w-[90vw] md:shadow-xl md:-translate-x-1/2 md:-translate-y-1/2",
          animOpen ? "translate-y-0 md:scale-100 md:opacity-100" : "translate-y-full md:scale-95 md:opacity-0",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-base font-medium text-[var(--km-text)]">{activeCampaignData?.title}</h2>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-4 flex flex-col min-h-0 overflow-hidden bg-white">

          {/* ── BOGO layout: just products, no gift tab ── */}
          {isBogo ? (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="overflow-y-auto flex-1 flex flex-col gap-4 pb-4" style={{ overscrollBehavior: "contain" }}>
                {(activeCampaignData?.products ?? []).map((item) => {
                  const q = quantities[item.id] ?? 0;
                  const d = getVariantDetails(item);
                  const bogoQ = activeCampaignData?.bogoQty ?? 1;
                  const bogoF = activeCampaignData?.bogoFreeQty ?? 1;
                  const freeQty = Math.floor(q / bogoQ) * bogoF;
                  return (
                    <React.Fragment key={item.id}>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0 border border-[var(--km-border)]">
                          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--km-text-secondary)] uppercase tracking-wider">{item.brand}</p>
                          <p className="text-sm font-normal text-[var(--km-text)] leading-snug line-clamp-1">{item.name}</p>
                          <div className="text-[13px] font-normal text-[var(--km-text-muted)] border border-[var(--km-border)] rounded-full px-2.5 py-0.5 w-fit mt-1.5 bg-white">
                            {d.label}
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-1.5">
                            <span className="text-sm font-normal text-[var(--km-text)]">฿{d.price.toLocaleString()}</span>
                            {d.originalPrice && <span className="text-xs font-normal text-[var(--km-text-muted)] line-through">฿{d.originalPrice.toLocaleString()}</span>}
                          </div>
                          {item.maxPerCustomer && (
                            <p className={`text-[11px] mt-1 ${q >= item.maxPerCustomer ? "text-[var(--km-warning)]" : "text-[var(--km-text-muted)]"}`}>
                              {q >= item.maxPerCustomer ? `ซื้อได้สูงสุด ${item.maxPerCustomer} ชิ้น/คน` : `จำกัด ${item.maxPerCustomer} ชิ้น/คน`}
                            </p>
                          )}
                        </div>
                        <div className="w-24 flex justify-end flex-shrink-0">
                          {q === 0 ? (
                            <button onClick={() => setQty(item.id, 1)} className="w-8 h-8 rounded-full border border-[var(--km-border-strong)] flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-all active:scale-90">
                              <Plus size={14} />
                            </button>
                          ) : (
                            <div className="flex items-center border border-[var(--km-border-strong)] rounded-full h-8 w-24 overflow-hidden bg-white">
                              <button onClick={() => setQty(item.id, q - 1)} className="w-8 h-full flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors"><Minus size={11} /></button>
                              <span className="flex-1 text-center text-[13px] font-normal text-[var(--km-text)]">{q}</span>
                              <button
                                onClick={() => setQty(item.id, q + 1)}
                                disabled={!!(item.maxPerCustomer && q >= item.maxPerCustomer)}
                                className="w-8 h-full flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              ><Plus size={11} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                      {freeQty > 0 && (
                        <div className="flex items-center gap-3 bg-[#fff2f5] rounded-xl px-3 py-2.5 border border-[#ffe2e8] animate-slide-up">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-[#ffe2e8]">
                            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-normal text-[var(--km-text)] leading-snug line-clamp-1">{item.name}</p>
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span className="text-sm font-medium text-[var(--km-success)]">ฟรี</span>
                            </div>
                            <div className="text-[13px] font-normal text-white bg-[var(--km-text)] rounded-full px-2.5 py-0.5 w-fit mt-1.5">ของแถม</div>
                          </div>
                          <div className="text-[#e05275] font-normal text-sm shrink-0 tabular-nums">x{freeQty}</div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── FREE-GIFT layout: products tab + gifts tab ── */
            <>
              {/* Pill tabs */}
              <div className="flex items-center gap-2 mb-4 shrink-0">
                {(["products", "gifts"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-[13px] transition-all duration-200 border active:scale-95 cursor-pointer ${
                      activeTab === tab
                        ? "bg-[var(--km-text)] text-white border-transparent font-normal shadow-sm"
                        : "bg-white text-[var(--km-text-secondary)] border-[var(--km-border)] hover:bg-[var(--km-surface)] font-normal"
                    }`}
                  >
                    {tab === "products" ? "สินค้าที่ร่วมรายการ" : "ของแถมฟรี"}
                  </button>
                ))}
              </div>

              {/* Products panel */}
              {activeTab === "products" && (
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden animate-fade-in">
                  <div className="overflow-y-auto flex-1 pr-1 flex flex-col gap-4 pb-4" style={{ overscrollBehavior: "contain" }}>
                    {/* Main product */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0 border border-[var(--km-border)]">
                        <Image src={mainImage} alt={product.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--km-text-secondary)] uppercase tracking-wider">{product.brand}</p>
                        <p className="text-sm font-normal text-[var(--km-text)] leading-snug line-clamp-1">{product.name}</p>
                        <div className="text-[13px] font-normal text-[var(--km-text-muted)] border border-[var(--km-border)] rounded-full px-2.5 py-0.5 w-fit mt-1.5 bg-white">{currentProductVariant}</div>
                        <div className="flex items-baseline gap-1.5 mt-1.5">
                          <span className="text-sm font-normal text-[var(--km-text)]">฿{mainPrice.toLocaleString()}</span>
                          {mainOriginalPrice && <span className="text-xs font-normal text-[var(--km-text-muted)] line-through">฿{mainOriginalPrice.toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="w-24 flex justify-end flex-shrink-0">
                        {(quantities[product.id] ?? 0) === 0 ? (
                          <button onClick={() => setQty(product.id, 1)} className="w-8 h-8 rounded-full border border-[var(--km-border-strong)] flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-all active:scale-90"><Plus size={14} /></button>
                        ) : (
                          <div className="flex items-center border border-[var(--km-border-strong)] rounded-full h-8 w-24 overflow-hidden bg-white">
                            <button onClick={() => setQty(product.id, (quantities[product.id] ?? 0) - 1)} className="w-8 h-full flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors"><Minus size={11} /></button>
                            <span className="flex-1 text-center text-[13px] font-normal text-[var(--km-text)]">{quantities[product.id]}</span>
                            <button onClick={() => setQty(product.id, (quantities[product.id] ?? 0) + 1)} className="w-8 h-full flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors"><Plus size={11} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-slate-100" />
                    {/* Promo products */}
                    {(activeCampaignData?.products ?? []).map((item) => {
                      const q = quantities[item.id] ?? 0;
                      const d = getVariantDetails(item);
                      return (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0 border border-[var(--km-border)]">
                            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--km-text-secondary)] uppercase tracking-wider">{item.brand}</p>
                            <p className="text-sm font-normal text-[var(--km-text)] leading-snug line-clamp-1">{item.name}</p>
                            <div className="text-[13px] font-normal text-[var(--km-text-muted)] border border-[var(--km-border)] rounded-full px-2.5 py-0.5 w-fit mt-1.5 bg-white">{d.label}</div>
                            <div className="flex items-baseline gap-1.5 mt-1.5">
                              <span className="text-sm font-normal text-[var(--km-text)]">฿{d.price.toLocaleString()}</span>
                              {d.originalPrice && <span className="text-xs font-normal text-[var(--km-text-muted)] line-through">฿{d.originalPrice.toLocaleString()}</span>}
                            </div>
                          </div>
                          <div className="w-24 flex justify-end flex-shrink-0">
                            {q === 0 ? (
                              <button onClick={() => setQty(item.id, 1)} className="w-8 h-8 rounded-full border border-[var(--km-border-strong)] flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-all active:scale-90"><Plus size={14} /></button>
                            ) : (
                              <div className="flex items-center border border-[var(--km-border-strong)] rounded-full h-8 w-24 overflow-hidden bg-white">
                                <button onClick={() => setQty(item.id, q - 1)} className="w-8 h-full flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors"><Minus size={11} /></button>
                                <span className="flex-1 text-center text-[13px] font-normal text-[var(--km-text)]">{q}</span>
                                <button onClick={() => setQty(item.id, q + 1)} className="w-8 h-full flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors"><Plus size={11} /></button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Nudge to gifts tab */}
                  {isUnlocked && selectedGiftIds.length < maxGifts && (
                    <div onClick={() => setActiveTab("gifts")} className="mt-3 p-3 bg-[#fff2f5] border border-[#ffe2e8] rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#ffe2e8]/40 transition-colors animate-slide-up shrink-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#ffe2e8] flex items-center justify-center text-[#e05275]"><Gift size={15} className="animate-bounce" /></div>
                        <div>
                          <p className="text-[13px] font-medium text-[var(--km-text)] leading-tight">คุณได้รับสิทธิ์ของแถมฟรี 1 ชิ้น!</p>
                          <p className="text-[11px] font-normal text-[#e05275] mt-0.5">กดตรงนี้เพื่อเลือกของแถมสุดพิเศษของคุณ</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[#e05275] animate-translate-x" />
                    </div>
                  )}
                </div>
              )}

              {/* Gifts panel */}
              {activeTab === "gifts" && (
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden animate-fade-in">
                  <div className="overflow-y-auto flex-1 flex flex-col gap-3 pb-4" style={{ overscrollBehavior: "contain" }}>
                    {giftOptions.map((g) => {
                      const selected = selectedGiftIds.includes(g.id);
                      const isAtLimit = selectedGiftIds.length >= maxGifts;
                      return (
                        <div
                          key={g.id}
                          onClick={() => { if (!isUnlocked) return; selected ? removeGift(g.id) : addGift(g.id); }}
                          className={`flex items-center gap-3 py-2 rounded-lg px-2 -mx-2 transition-all ${
                            !isUnlocked ? "opacity-50 cursor-not-allowed select-none"
                            : isAtLimit && !selected ? "opacity-50 cursor-not-allowed select-none"
                            : "hover:bg-[var(--km-surface)]/50 cursor-pointer"
                          }`}
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0 border border-[var(--km-border)]">
                            <Image src={g.image} alt={g.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--km-text-secondary)] uppercase tracking-wider">{g.brand}</p>
                            <p className="text-sm font-normal text-[var(--km-text)] leading-snug line-clamp-1">{g.name}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[13px] font-normal text-white bg-[var(--km-text)] rounded-full px-2.5 py-0.5 w-fit">ของแถม</span>
                            </div>
                            <div className="flex items-baseline gap-1.5 mt-1.5">
                              <span className="text-sm font-medium text-[var(--km-success)]">ฟรี</span>
                            </div>
                          </div>
                          <div className="w-8 flex justify-end flex-shrink-0">
                            {selected ? (
                              <div className="w-8 h-8 rounded-full bg-[var(--km-text)] flex items-center justify-center">
                                <Check size={14} className="text-white" />
                              </div>
                            ) : (
                              <button
                                disabled={!isUnlocked || (isAtLimit && !selected)}
                                className="w-8 h-8 rounded-full border border-[var(--km-border-strong)] flex items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA — inside sheet, pinned to bottom */}
        <div
          className="shrink-0 bg-white border-t border-[var(--km-border)] px-5 pt-3"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          {!isBogo && (
            <div className="flex items-center justify-between text-[13px] font-normal mb-3">
              <span className={isUnlocked ? "text-emerald-600" : "text-slate-600"}>
                {total === 0 ? "เลือกสินค้าเพื่อรับของแถมฟรี"
                  : !isUnlocked ? `ซื้ออีก ฿${(threshold - total).toLocaleString()} เพื่อรับของแถมฟรี!`
                  : "ยินดีด้วย! คุณได้รับของแถมฟรี 1 ชิ้นแล้ว"}
              </span>
              <span className="text-[var(--km-text-muted)]">
                <span className={isUnlocked ? "text-emerald-600" : "text-[var(--km-text)]"}>฿{total.toLocaleString()}</span>
                {" "} / ฿{threshold.toLocaleString()}
              </span>
            </div>
          )}
          <button
            onClick={handleConfirm}
            disabled={total === 0}
            className="w-full py-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 border shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none mb-1"
            style={{
              background: total === 0 ? "var(--km-surface)" : "var(--km-text)",
              borderColor: total === 0 ? "var(--km-border)" : "var(--km-text)",
              color: total === 0 ? "var(--km-text-muted)" : "white",
            }}
          >
            <ShoppingCart size={15} />
            เพิ่มสินค้าทั้งหมดลงตะกร้า
          </button>
        </div>

      </div>
    </>,
    document.body
  );
}