"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Star, Minus, Plus, ChevronRight, Check, Gift, X, ShoppingCart, Truck, ChevronLeft, Share2, MapPin, ChevronDown } from "lucide-react";
import { ProductCard, type ProductCardProps } from "@/components/product/ProductCard";
import { FLASH_DEAL_PRODUCTS, MOCK_REVIEWS } from "@/lib/mock-data";
import { useCartStore, useCartSubtotal } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { useOrdersStore } from "@/stores/orders.store";
import { useAuthStore } from "@/stores/auth.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { LoginModal } from "@/components/auth/LoginModal";
import { ToastStack, type ToastData } from "@/components/ui/Toast";
import { useSelectedAddress, useCheckoutStore } from "@/stores/checkout.store";
import { useLocaleStore } from "@/stores/locale.store";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { BottomAnnouncement } from "@/components/layout/BottomAnnouncement";
import { PromoCampaignSheet } from "@/components/product/PromoCampaignSheet";
import { PROMO_CAMPAIGNS, getCampaignsForProduct } from "@/lib/campaigns";

/* ─── Flash Deal countdown ─── */
function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function RollingDigit({ value }: { value: string }) {
  return (
    <div className="relative h-6 w-[1ch] overflow-hidden flex flex-col items-center">
      <div 
        className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col"
        style={{ transform: `translateY(-${parseInt(value) * 10}%)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-6 flex items-center justify-center">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

function CountChip({ label }: { label: string }) {
  const digits = label.split("");
  return (
    <div className="bg-white border border-[#e8e8ed] text-[var(--km-text)] text-xs font-medium h-6 px-1 flex items-center justify-center rounded-[4px] tracking-tight overflow-hidden">
      {digits.map((d, i) => (
        <RollingDigit key={i} value={d} />
      ))}
    </div>
  );
}

function Colon() {
  return <span className="text-[var(--km-text)] font-medium text-[11px] opacity-30 px-0.5">:</span>;
}

function FlashCountdown({ endsAt }: { endsAt: string }) {
  const { days, hours, minutes, seconds } = useCountdown(useMemo(() => new Date(endsAt), [endsAt]));
  const pad = (n: number) => String(n).padStart(2, "0");
  
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] font-normal text-[var(--km-text-secondary)] mr-0.5">จบใน</span>
      {days > 0 && <><CountChip label={pad(days)} /><Colon /></>}
      <CountChip label={pad(hours)} />
      <Colon />
      <CountChip label={pad(minutes)} />
      <Colon />
      <CountChip label={pad(seconds)} />
    </div>
  );
}

/* ─── Mock extras ─── */
const MOCK_IMAGES = [
  "/product/image copy 2.png",
  "/product/image copy 3.png",
  "/product/image copy 4.png",
  "/product/image copy 5.png",
];

const MOCK_VARIANTS = [
  { label: "30 ml",  image: "/product/image copy 3.png",  stock: 12, price: 129, originalPrice: 189 },
  { label: "50 ml",  image: "/product/image copy 7.png",  stock: 5,  price: 249, originalPrice: 349 },
  { label: "100 ml", image: "/product/image copy 11.png", stock: 28, price: 399, originalPrice: 499 },
];




const PROMO_THRESHOLD = 500;
const MOCK_GIFTS: { id: string; name: string; image: string; brand: string; originalPrice: number; minQty: number }[] = [];

const SECTIONS = [
  { id: "detail", label: "รายละเอียด" },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

interface Props {
  product: ProductCardProps;
  related: ProductCardProps[];
}

type AccordionItem = {
  title: string;
  content: string | { label: string; description?: string }[];
};

const MOCK_DETAIL_SECTIONS: AccordionItem[] = [
  {
    title: "รายละเอียดสินค้า",
    content: "ผลิตภัณฑ์มอยส์เจอร์ไรเซอร์สูตรเข้มข้นที่ถูกคิดค้นมาเพื่อมอบความชุ่มชื้นยาวนานสูงสุดถึง 100 ชั่วโมง โดยใช้เทคโนโลยีล้ำสมัยที่ช่วยให้ผิวสามารถกักเก็บน้ำได้เองตามธรรมชาติอย่างมีประสิทธิภาพ เนื้อสัมผัสแบบเจลครีมบางเบาซึมซาบเข้าสู่ผิวได้อย่างรวดเร็วโดยไม่ทิ้งความเหนียวเหนอะหนะ เหมาะสำหรับการใช้งานในทุกสภาพอากาศไม่ว่าจะเป็นอากาศร้อนชื้นหรือในห้องแอร์ที่ทำให้ผิวขาดน้ำ ช่วยให้ผิวดูอิ่มน้ำ สดใส และมีสุขภาพดีอย่างต่อเนื่องตลอดทั้งวันและคืน",
  },
  {
    title: "ส่วนผสมหลัก",
    content: "ส่วนผสมอันทรงประสิทธิภาพที่คัดสรรมาเป็นพิเศษประกอบด้วยกรดไฮยาลูโรนิคเข้มข้นที่ช่วยดึงดูดโมเลกุลน้ำจากอากาศเข้าสู่ผิว ผสานพลังกับสารสกัดจากว่านหางจระเข้ที่ผ่านกระบวนการหมักแบบเฉพาะตัวเพื่อเพิ่มประสิทธิภาพในการปลอบประโลมผิวที่อ่อนล้า นอกจากนี้ยังมีส่วนผสมของคาเฟอีนคอมเพล็กซ์ที่ช่วยกระตุ้นการไหลเวียนและปลุกผิวให้ตื่นตัวดูมีชีวิตชีวา ลดอาการบวมและรอยหมองคล้ำบนใบหน้าเพื่อให้ผิวดูเปล่งปลั่งกระจ่างใสจากภายในสู่ภายนอก",
  },
  {
    title: "ส่วนผสมทั้งหมด",
    content: "น้ำบริสุทธิ์ กลีเซอรีน สารสกัดจากใบว่านหางจระเข้ โซเดียมไฮยาลูโรเนต คาเฟอีน สารสกัดจากชาเขียว วิตามินอี ไนอะซินาไมด์ แพนทีนอล สารสกัดจากแตงกวา สารสกัดจากดอกคาโมมายล์ สารช่วยกักเก็บความชุ่มชื้นธรรมชาติ แซนแทนกัม ฟีโนซีเอทานอล เอทิลเฮกซิลกลีเซอรีน สารปรับสภาพผิวที่อ่อนโยนและปลอดภัยต่อผิวแพ้ง่าย ปราศจากพาราเบน แอลกอฮอล์ และน้ำหอมสังเคราะห์ที่อาจก่อให้เกิดการระคายเคือง",
  },
  {
    title: "วิธีใช้",
    content: "เพื่อผลลัพธ์ที่ดีที่สุดควรใช้เป็นขั้นตอนสุดท้ายของการดูแลผิวในช่วงเช้าและก่อนนอน โดยตักเนื้อผลิตภัณฑ์ในปริมาณที่พอเหมาะแล้วค่อยๆ แต้มลงบนใบหน้าและลำคอที่ทำความสะอาดเรียบร้อยแล้ว จากนั้นใช้นิ้วมือนวดวนเป็นวงกลมเบาๆ เพื่อให้เนื้อเจลซึมซาบลงสู่ชั้นผิวได้อย่างล้ำลึก สามารถใช้เติมความชุ่มชื้นระหว่างวันได้ตามต้องการ หรือจะใช้พอกหน้าเป็นมาส์กก่อนนอนในวันที่รู้สึกว่าผิวแห้งกร้านเป็นพิเศษก็ได้เช่นกัน",
  },
  {
    title: "ข้อควรระวัง",
    content: "หลีกเลี่ยงการสัมผัสกับดวงตาโดยตรงหากผลิตภัณฑ์เข้าตาให้ล้างออกด้วยน้ำสะอาดทันที ในกรณีที่มีอาการแพ้ ผื่นแดง หรือการระคายเคืองอย่างรุนแรงควรหยุดใช้ผลิตภัณฑ์และปรึกษาแพทย์ผู้เชี่ยวชาญด้านผิวหนังทันที ควรเก็บผลิตภัณฑ์ไว้ในที่แห้งและเย็น หลีกเลี่ยงการวางไว้ในที่ที่แสงแดดส่องถึงโดยตรงหรือที่มีอุณหภูมิสูงเกินไปเพื่อรักษาคุณภาพและประสิทธิภาพของส่วนผสมสำคัญให้คงอยู่ได้ยาวนานที่สุด",
  },
];

/* ─── Accordion ─── */
function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggle = (i: number) => {
    setOpenIndexes(prev => 
      prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]
    );
  };

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = openIndexes.includes(i);
        return (
          <div key={item.title}>
            <button
              onClick={() => toggle(i)}
              className="flex items-center justify-between w-full py-4 text-left"
            >
              <span className="text-sm font-medium text-[var(--km-text)]">{item.title}</span>
              <ChevronRight
                size={15}
                className="text-[var(--km-text-muted)] shrink-0 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              />
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ 
                maxHeight: isOpen ? "500px" : "0px", 
                opacity: isOpen ? 1 : 0,
                marginBottom: isOpen ? "16px" : "0px"
              }}
            >
              <div>
                {typeof item.content === "string" ? (
                  <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">{item.content}</p>
                ) : (
                  <ul className="space-y-1.5">
                    {item.content.map((c) => (
                      <li key={c.label} className="flex gap-2 text-sm text-[var(--km-text-secondary)]">
                        <span className="text-[var(--km-text-muted)] shrink-0">·</span>
                        <span>
                          <strong className="text-[var(--km-text)] font-medium">{c.label}</strong>
                          {c.description && ` — ${c.description}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Gallery Section ─── */
const GALLERY_PREVIEW = 2;

function GallerySection({ images }: { images: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const extraRef = useRef<HTMLDivElement>(null);
  const [extraHeight, setExtraHeight] = useState(0);
  const hasMore = images.length > GALLERY_PREVIEW;
  const previewImages = images.slice(0, GALLERY_PREVIEW);
  const extraImages = images.slice(GALLERY_PREVIEW);

  useEffect(() => {
    if (extraRef.current) setExtraHeight(extraRef.current.scrollHeight);
  }, [images]);

  return (
    <section>
      {/* Mobile */}
      <div className="md:hidden flex flex-col -mx-4">
        <div className="relative">
          {/* Preview images — always visible */}
          {previewImages.map((src, i) => (
            <div key={i} className="relative w-full overflow-hidden bg-[var(--km-surface)]" style={{ aspectRatio: "4/3" }}>
              <Image src={src} alt={`gallery-${i}`} fill sizes="100vw" className="object-cover" />
            </div>
          ))}

          {/* Extra images — animate in/out */}
          {hasMore && (
            <div
              ref={extraRef}
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{ maxHeight: expanded ? extraHeight : 0 }}
            >
              {extraImages.map((src, i) => (
                <div key={i} className="relative w-full overflow-hidden bg-[var(--km-surface)]" style={{ aspectRatio: "4/3" }}>
                  <Image src={src} alt={`gallery-extra-${i}`} fill sizes="100vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Fade overlay */}
          {hasMore && (
            <div
              className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none transition-opacity duration-300"
              style={{ opacity: expanded ? 0 : 1 }}
            />
          )}
        </div>

        {hasMore && (
          <div className={`flex justify-center transition-all duration-300 ${expanded ? "py-4" : "-mt-6 pb-4 relative z-10"}`}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[var(--km-border)] text-sm font-medium text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-colors"
            >
              {expanded ? "ย่อกลับ" : "ดูเพิ่มเติม"}
              <ChevronRight size={13} className={`transition-transform duration-300 ${expanded ? "-rotate-90" : "rotate-90"}`} />
            </button>
          </div>
        )}
      </div>

      {/* Desktop — แสดงทั้งหมด */}
      <div className="hidden md:flex flex-col gap-0 py-8 max-w-4xl mx-auto">
        {images.map((src, i) => (
          <div key={i} className="relative w-full rounded-lg overflow-hidden bg-[var(--km-surface)] mb-2" style={{ aspectRatio: "4/3" }}>
            <Image src={src} alt={`gallery-${i}`} fill sizes="(max-width: 1280px) 100vw, 896px" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

const MOCK_SHIPPING = [
  { carrier: "Kerry Express", deliveryDate: "13 พ.ค. – 15 พ.ค.", type: "Standard Delivery", fee: 0,  originalFee: 60  },
  { carrier: "Flash Express", deliveryDate: "14 พ.ค. – 16 พ.ค.", type: "Standard Delivery", fee: 20, originalFee: 50  },
  { carrier: "J&T Express",   deliveryDate: "15 พ.ค. – 17 พ.ค.", type: "Standard Delivery", fee: 15, originalFee: 40  },
  { carrier: "Best Express",  deliveryDate: "16 พ.ค. – 19 พ.ค.", type: "Economy Delivery",  fee: 35, originalFee: null },
];

/* ─── Shipping Bottom Sheet ─── */
function ShippingSheet({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (carrier: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<"shipping" | "address" | "addressForm">("shipping");
  const { addresses, selectedAddressId, selectAddress, addAddress } = useCheckoutStore();
  const [addrForm, setAddrForm] = useState({ label: "บ้าน", firstName: "", lastName: "", phone: "", address: "", district: "", subDistrict: "", province: "กรุงเทพมหานคร", postalCode: "" });
  const [addrErrors, setAddrErrors] = useState<Partial<Record<keyof typeof addrForm, string>>>({});
  const slidingRef = useRef<HTMLDivElement>(null);
  const saveAddr = () => {
    if (!validateAddr()) return;
    const newId = addAddress({ ...addrForm, isDefault: false });
    selectAddress(newId);
    changeView("shipping");
  };

  const changeView = (v: typeof view) => { setView(v); };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setView("shipping");
      setTimeout(() => setVisible(true), 20);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };
  
  const validateAddr = () => {
    const e: typeof addrErrors = {};
    if (!addrForm.firstName.trim()) e.firstName = "กรุณากรอกชื่อ";
    if (!addrForm.lastName.trim())  e.lastName  = "กรุณากรอกนามสกุล";
    const cleanPhone = addrForm.phone.replace(/\s/g, "");
    if (!/^\+?[1-9]\d{6,14}$/.test(cleanPhone) && !/^0\d{9}$/.test(cleanPhone)) e.phone = "เบอร์โทรไม่ถูกต้อง";
    if (!addrForm.address.trim())   e.address   = "กรุณากรอกที่อยู่";
    if (!addrForm.district.trim())  e.district  = "กรุณากรอกแขวง/ตำบล";
    if (!/^\d{5}$/.test(addrForm.postalCode))   e.postalCode = "รหัสไปรษณีย์ 5 หลัก";
    setAddrErrors(e);
    return Object.keys(e).length === 0;
  };

  if (!mounted) return null;

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 z-[950] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`} onClick={handleClose} />
      <div
        className={`fixed bottom-0 inset-x-0 z-[960] bg-white rounded-t-3xl overflow-clip transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${visible ? "translate-y-0" : "translate-y-full"}`}
        style={{ height: "auto", maxHeight: "90vh" }}
      >
        {/* Sliding viewport */}
        <div ref={slidingRef} className="flex items-start transition-transform duration-300 ease-in-out"
          style={{ transform: view === "shipping" ? "translateX(0)" : view === "address" ? "translateX(-100%)" : "translateX(-200%)" }}
        >
          {/* ── VIEW: shipping ── */}
          <div className={`w-full shrink-0 flex flex-col ${view === "shipping" ? "h-auto" : "h-0 overflow-hidden"}`}>
            <div className="flex items-center justify-between px-5 py-4 shrink-0">
              <h2 className="text-base font-medium text-[var(--km-text)]">ข้อมูลการจัดส่ง</h2>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-[var(--km-text-muted)]"><X size={18} /></button>
            </div>
            {/* <div className="shrink-0 px-4 pb-3"><AddressBox /></div> */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 120px)", overscrollBehavior: "contain" }}>
              <div className="divide-y divide-[var(--km-border)]">
                {MOCK_SHIPPING.map((s) => {
                  return (
                    <button key={s.carrier} onClick={() => { onSelect(s.carrier); handleClose(); }}
                      className="flex items-center gap-3 px-5 py-4 w-full text-left transition-colors active:bg-[var(--km-surface)]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-[var(--km-text)]">{s.deliveryDate}</p>
                        <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{s.type} · {s.carrier}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {s.fee === 0 ? (
                          <div className="flex items-baseline gap-1.5 justify-end">
                            {s.originalFee && <span className="text-xs text-[var(--km-text-muted)] line-through">฿{s.originalFee}</span>}
                            <span className="text-[14px] font-medium text-[var(--km-success)]">ฟรี</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1.5 justify-end">
                            {s.originalFee && <span className="text-xs text-[var(--km-text-muted)] line-through">฿{s.originalFee}</span>}
                            <span className="text-[14px] font-medium text-[var(--km-text)]">฿{s.fee}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div style={{ height: "max(16px, env(safe-area-inset-bottom))" }} />
            </div>
          </div>

          {/* ── VIEW: address list ── */}
          <div className={`w-full shrink-0 flex flex-col ${view === "address" ? "h-auto" : "h-0 overflow-hidden"}`}>
            <div className="flex items-center gap-2 px-4 py-4 shrink-0 border-b border-[var(--km-border)]">
              <button onClick={() => changeView("shipping")} className="w-8 h-8 flex items-center justify-center text-[var(--km-text-muted)]"><ChevronLeft size={20} /></button>
              <h2 className="text-base font-medium text-[var(--km-text)]">เลือกที่อยู่จัดส่ง</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 120px)", overscrollBehavior: "contain" }}>
              {addresses.map((addr) => {
                const isSel = addr.id === (selectedAddressId ?? addresses[0]?.id);
                return (
                  <div key={addr.id}>
                    <button onClick={() => { selectAddress(addr.id); changeView("shipping"); }}
                      className="w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-[var(--km-surface)] transition-colors"
                    >
                      <MapPin size={15} className="shrink-0 mt-0.5 text-[var(--km-text-muted)]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-[15px] font-medium text-[var(--km-text)]">{addr.firstName} {addr.lastName}</span>
                          <span className="text-[13px] text-[var(--km-text-muted)]">{addr.phone}</span>
                          {addr.label && <span className="text-[13px] font-medium border border-[var(--km-border)] text-[var(--km-text-secondary)] px-2 py-0.5 rounded-full">{addr.label}</span>}
                          {addr.isDefault && <span className="text-[13px] font-medium text-[var(--km-success)]">ค่าเริ่มต้น</span>}
                        </div>
                        <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed">{addr.address}, {addr.district}, {addr.province} {addr.postalCode}</p>
                      </div>
                      <div className="w-5 flex items-center justify-center shrink-0 mt-0.5">
                        {isSel && <Check size={15} strokeWidth={2.5} style={{ color: "var(--km-success)" }} />}
                      </div>
                    </button>
                    <div className="h-px bg-[var(--km-border)] mx-4" />
                  </div>
                );
              })}
              <button onClick={() => { setAddrForm({ label: "บ้าน", firstName: "", lastName: "", phone: "", address: "", district: "", subDistrict: "", province: "กรุงเทพมหานคร", postalCode: "" }); setAddrErrors({}); changeView("addressForm"); }}
                className="w-full px-4 py-4 flex items-center gap-3 text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
              >
                <Plus size={16} /><span className="text-sm font-medium">เพิ่มที่อยู่ใหม่</span>
              </button>
              <div style={{ height: "max(16px, env(safe-area-inset-bottom))" }} />
            </div>
          </div>

          {/* ── VIEW: address form ── */}
          <div className={`w-full shrink-0 flex flex-col ${view === "addressForm" ? "h-auto" : "h-0 overflow-hidden"}`}>
            <div className="flex items-center gap-2 px-4 py-4 shrink-0 border-b border-[var(--km-border)]">
              <button onClick={() => changeView("address")} className="w-8 h-8 flex items-center justify-center text-[var(--km-text-muted)]"><ChevronLeft size={20} /></button>
              <h2 className="text-base font-medium text-[var(--km-text)]">เพิ่มที่อยู่ใหม่</h2>
            </div>
            <div className="overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ maxHeight: "calc(90dvh - 120px)", overscrollBehavior: "contain" }}>
              <div className="flex gap-2">
                {["บ้าน","ที่ทำงาน","อื่นๆ"].map((l) => (
                  <button key={l} onClick={() => setAddrForm((f) => ({ ...f, label: l }))}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                    style={{ borderColor: addrForm.label === l ? "var(--km-text)" : "var(--km-border)", background: addrForm.label === l ? "var(--km-surface)" : "transparent", color: addrForm.label === l ? "var(--km-text)" : "var(--km-text-secondary)" }}
                  >{l}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">ชื่อ *</label>
                  <input value={addrForm.firstName} onChange={(e) => setAddrForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="ระบุชื่อจริง" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
                  {addrErrors.firstName && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">นามสกุล *</label>
                  <input value={addrForm.lastName} onChange={(e) => setAddrForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="ระบุนามสกุล" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
                  {addrErrors.lastName && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1.5 block">เบอร์โทรศัพท์ *</label>
                <PhoneInput value={addrForm.phone} onChange={(val) => setAddrForm((f) => ({ ...f, phone: val }))} error={!!addrErrors.phone} />
                {addrErrors.phone && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.phone}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">ที่อยู่ *</label>
                <input value={addrForm.address} onChange={(e) => setAddrForm((f) => ({ ...f, address: e.target.value }))} placeholder="ระบุบ้านเลขที่, หมู่, ซอย, ถนน" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
                {addrErrors.address && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">แขวง/ตำบล *</label>
                  <input value={addrForm.district} onChange={(e) => setAddrForm((f) => ({ ...f, district: e.target.value }))} placeholder="ระบุตำบล/แขวง" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
                  {addrErrors.district && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.district}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">จังหวัด *</label>
                  <select value={addrForm.province} onChange={(e) => setAddrForm((f) => ({ ...f, province: e.target.value }))} className="w-full h-12 pl-4 pr-10 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none bg-white appearance-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23A3A3A3' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
                    {["กรุงเทพมหานคร","เชียงใหม่","ชลบุรี","ภูเก็ต","ขอนแก่น","นนทบุรี","ปทุมธานี","สมุทรปราการ","นครราชสีมา","เชียงราย","สมุทรสาคร","นครปฐม","ระยอง","ประจวบคีรีขันธ์","อื่นๆ"].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">รหัสไปรษณีย์ *</label>
                <input value={addrForm.postalCode} onChange={(e) => setAddrForm((f) => ({ ...f, postalCode: e.target.value.replace(/\D/g,"").slice(0,5) }))} placeholder="ระบุรหัสไปรษณีย์ 5 หลัก" inputMode="numeric" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
                {addrErrors.postalCode && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.postalCode}</p>}
              </div>
              <div style={{ height: "60px" }} />
            </div>
            <div className="shrink-0 px-4 pt-3 pb-5 border-t border-[var(--km-border)]" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
              <button onClick={saveAddr} className="w-full py-3.5 rounded-full text-white text-sm font-medium" style={{ background: "var(--km-text)" }}>บันทึกที่อยู่</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ─── Sticky Section Tab Nav ─── */
/* ─── Add to Cart / Buy Bottom Sheet ─── */
type SheetMode = "cart" | "buy" | null;

function ProductSheet({
  product,
  mode,
  onClose,
  defaultVariant,
  activeShipping,
  onSelectShipping,
  onOpenPromo,
}: {
  product: ProductCardProps;
  mode: SheetMode;
  onClose: () => void;
  defaultVariant: string;
  activeShipping: typeof MOCK_SHIPPING[number];
  onSelectShipping: (carrier: string) => void;
  onOpenPromo?: (selectedQty: number, selectedVariant: string) => void;
}) {
  const router    = useRouter();
  const addItem        = useCartStore((s) => s.addItem);
  const setBuyNowItem  = useCartStore((s) => s.setBuyNowItem);
  const setForceHeaderVisible = useUIStore((s) => s.setForceHeaderVisible);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const address = useSelectedAddress();
  const cartSubtotal = useCartSubtotal();
  const region = useLocaleStore((s) => s.region);
  const isRegionUnavailable = !!(product.unavailableRegions?.includes(region.code));

  const [variant, setVariant]     = useState(defaultVariant);
  const [qty, setQty]             = useState(1);
  const activeVariant = MOCK_VARIANTS.find((v) => v.label === variant) ?? MOCK_VARIANTS[0];
  const [, setGiftQty] = useState<Record<string, number>>({});

  /* Trim giftQty when product qty decreases, and clear locked gifts */
  const handleSetQty = (next: number) => {
    setQty(next);
    setGiftQty((prev) => {
      // First, zero out any gifts that are now locked due to lower qty
      const cleared = { ...prev };
      for (const g of MOCK_GIFTS) {
        if (next < g.minQty) cleared[g.id] = 0;
      }
      // Then trim total if it exceeds new qty
      const total = Object.values(cleared).reduce((a, b) => a + b, 0);
      if (total <= next) return cleared;
      let excess = total - next;
      for (const id of [...Object.keys(cleared)].reverse()) {
        const cut = Math.min(cleared[id], excess);
        cleared[id] -= cut;
        excess -= cut;
        if (excess === 0) break;
      }
      return cleared;
    });
  };
  const [done, setDone]           = useState(false);
  const [visible, setVisible]     = useState(false);
  const [sheetView, setSheetView] = useState<"main" | "shipping" | "address" | "addressForm">("main");

  const goTo = (v: typeof sheetView) => setSheetView(v);

  // address form state
  const { addresses, selectedAddressId, selectAddress, addAddress } = useCheckoutStore();
  const [addrForm, setAddrForm] = useState({ label: "บ้าน", firstName: "", lastName: "", phone: "", address: "", district: "", subDistrict: "", province: "กรุงเทพมหานคร", postalCode: "" });
  const [addrErrors, setAddrErrors] = useState<Partial<Record<keyof typeof addrForm, string>>>({});

  const validateAddr = () => {
    const e: typeof addrErrors = {};
    if (!addrForm.firstName.trim()) e.firstName = "กรุณากรอกชื่อ";
    if (!addrForm.lastName.trim())  e.lastName  = "กรุณากรอกนามสกุล";
    const cleanPhone = addrForm.phone.replace(/\s/g, "");
    if (!/^\+?[1-9]\d{6,14}$/.test(cleanPhone) && !/^0\d{9}$/.test(cleanPhone)) e.phone = "เบอร์โทรไม่ถูกต้อง";
    if (!addrForm.address.trim())   e.address   = "กรุณากรอกที่อยู่";
    if (!addrForm.district.trim())  e.district  = "กรุณากรอกแขวง/ตำบล";
    if (!/^\d{5}$/.test(addrForm.postalCode))   e.postalCode = "รหัสไปรษณีย์ 5 หลัก";
    setAddrErrors(e);
    return Object.keys(e).length === 0;
  };
  const saveAddr = () => {
    if (!validateAddr()) return;
    const newId = addAddress({ ...addrForm, isDefault: false });
    selectAddress(newId);
    goTo("shipping");
  };

  const [mounted, setMounted] = useState(false);

  /* Animate in */
  useEffect(() => {
    if (mode) {
      setMounted(true);
      setDone(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [mode]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleConfirm = () => {
    // Inject automatic gift quantities based on threshold validation
    const freeGifts = MOCK_GIFTS.map((g) => {
      const locked = qty < g.minQty;
      const giftQtyAmount = locked ? 0 : qty;
      return {
        productId: g.id,
        name: g.name,
        image: g.image,
        originalPrice: g.originalPrice,
        brand: g.brand,
        quantity: giftQtyAmount,
        maxPerUnit: 1,
        minQty: g.minQty,
      };
    });

    const itemPayload = {
      productId:     product.id,
      name:          product.name,
      brand:         product.brand,
      image:         activeVariant.image,
      price:         variantPrice,
      originalPrice: variantOriginal,
      variant,
      quantity:      qty,
      freeGifts:     freeGifts.length > 0 ? freeGifts : undefined,
    };

    if (mode === "buy") {
      setBuyNowItem(itemPayload);
      handleClose();
      if (!isLoggedIn) { router.push("/login?redirect=/checkout"); return; }
      router.push("/checkout");
    } else {
      addItem(itemPayload);
      setForceHeaderVisible(true);
      handleClose();
    }
  };

  if (!mounted) return null;

  const isBuy  = mode === "buy";
  const variantPrice = activeVariant.price;
  const variantOriginal = activeVariant.originalPrice;
  const discount = variantOriginal
    ? Math.round((1 - variantPrice / variantOriginal) * 100)
    : null;

  return (
    <>
      {/* Backdrop — above bottom bar (z-800) */}
      <div
        className="fixed inset-0 z-[850] bg-black/40 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Sheet (mobile) / Modal (desktop) — above backdrop */}
      <div
        className={[
          "fixed z-[900] bg-white overflow-clip transition-all duration-300 ease-out",
          "bottom-0 left-0 right-0 rounded-t-2xl",
          "md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:rounded-2xl md:w-[480px] md:max-w-[90vw] md:shadow-xl md:-translate-x-1/2 md:-translate-y-1/2",
          visible ? "translate-y-0 md:scale-100 md:opacity-100" : "translate-y-full md:scale-95 md:opacity-0",
        ].join(" ")}
      >
        {/* Sliding viewport */}
        <div
          className="flex items-start transition-transform duration-300 ease-in-out"
          style={{ transform: sheetView === "main" ? "translateX(0)" : sheetView === "shipping" ? "translateX(-100%)" : sheetView === "address" ? "translateX(-200%)" : "translateX(-300%)" }}
        >

        {/* ── VIEW: main ── */}
        <div className={`w-full shrink-0 flex flex-col max-h-[80dvh] md:max-h-[85dvh] ${sheetView === "main" ? "h-auto" : "h-0 overflow-hidden"}`}>
        {/* Close */}
        <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors z-10">
          <X size={18} />
        </button>

        <div className="px-5 pt-4 pb-2 overflow-y-auto flex-1" style={{ overscrollBehavior: "contain" }}>

          {/* Product summary */}
          <div className="flex gap-3 mb-5">
            <div className="relative w-[120px] h-[120px] rounded-md overflow-hidden flex-shrink-0 bg-[var(--km-surface)]">
              <Image src={activeVariant.image} alt={product.name} fill sizes="120px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
              <p className="text-[14px] font-semibold tracking-widest uppercase text-[var(--km-text-secondary)]">{product.brand}</p>
              <p className="text-sm font-normal text-[var(--km-text)] leading-snug line-clamp-2">{product.name}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-medium text-[var(--km-text)]">฿{(variantPrice * qty).toLocaleString()}</span>
                {variantOriginal && (
                  <>
                    <span className="text-xs text-[var(--km-text-muted)] line-through">฿{(variantOriginal * qty).toLocaleString()}</span>
                    <span className="text-xs font-medium text-[var(--km-text-secondary)]">-{discount}%</span>
                  </>
                )}
              </div>
              <p className="text-[13px] font-normal text-[var(--km-text-secondary)]">เหลืออีก {activeVariant.stock}</p>
            </div>
          </div>


          {/* Variant */}
          <div className="mb-5">
            <p className="text-sm font-medium text-[var(--km-text)] mb-2.5 uppercase tracking-wider">ตัวเลือก</p>
            <div className="flex gap-2 flex-wrap">
              {MOCK_VARIANTS.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setVariant(v.label)}
                  className="px-4 h-10 rounded-full border text-xs font-medium transition-all"
                  style={{
                    borderColor: variant === v.label ? "var(--km-text)" : "var(--km-border)",
                    color:       variant === v.label ? "var(--km-text)" : "var(--km-text-secondary)",
                    background:  variant === v.label ? "var(--km-surface)" : "transparent",
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[var(--km-text)] uppercase tracking-wider">จำนวน</p>
            <div className="flex items-center w-36 border border-[var(--km-border)] rounded-full overflow-hidden h-10">
              <button
                onClick={() => handleSetQty(Math.max(1, qty - 1))}
                className="w-10 h-full flex-shrink-0 flex items-center justify-center hover:bg-[var(--km-surface)] transition-colors"
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 h-full border-x border-[var(--km-border)] flex items-center justify-center text-sm font-normal text-[var(--km-text)]">
                {qty}
              </div>
              <button
                onClick={() => handleSetQty(qty + 1)}
                className="w-10 h-full flex-shrink-0 flex items-center justify-center hover:bg-[var(--km-surface)] transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Gift selection - hidden per user request */}
          {/* 
          {(() => {
            return (
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-3 border-b border-[var(--km-border)] pb-2">
                  <p className="text-sm font-medium text-[var(--km-text)] uppercase tracking-wider">ของแถมได้รับฟรี</p>
                </div>
                <div className="flex flex-col gap-2">
                  {MOCK_GIFTS.map((g) => {
                    const locked = qty < g.minQty;
                    // Auto-gift scales with current product qty
                    const giftQtyAmount = locked ? 0 : qty;
                    return (
                      <div
                        key={g.id}
                        className="flex items-center gap-3 w-full transition-all py-2"
                      >
                        <Link href={`/products/${g.id}`} className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--km-surface)] transition-all ${locked ? "opacity-40 grayscale" : ""}`}>
                          <Image src={g.image} alt={g.name} fill sizes="56px" className="object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${g.id}`}>
                            <p className={`text-xs font-semibold uppercase tracking-normal mb-0.5 ${locked ? "text-[var(--km-text-muted)]" : "text-[#000000]"}`}>{g.brand.toUpperCase()}</p>
                            <p className={`text-sm font-normal leading-snug line-clamp-1 ${locked ? "text-[var(--km-text-muted)]" : "text-[var(--km-text)]"}`}>{g.name}</p>
                          </Link>
                          {!locked && (
                            <p className="text-xs text-white bg-[var(--km-text)] rounded-full px-2 py-0.5 w-fit mt-1 select-none">
                              ของแถม
                            </p>
                          )}
                          {locked ? (
                            <p className="text-xs mt-1 font-medium" style={{ color: "var(--km-success)" }}>ซื้ออีก {g.minQty - qty} ชิ้น ปลดล็อคของแถม</p>
                          ) : (
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span className="text-[14px] font-medium text-[var(--km-success)]">ฟรี</span>
                            </div>
                          )}
                        </div>
                        
                        {!locked && giftQtyAmount > 0 && (
                          <span className="text-sm font-normal text-[var(--km-text-muted)] pr-2 select-none">
                            x{giftQtyAmount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          */}

        </div>

        {/* CTA */}
        <div className="px-5 pt-3 pb-5 bg-white" style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}>
          {product.price !== 0 && onOpenPromo && (() => {
            const projectedTotal = isBuy ? (qty * variantPrice) : (cartSubtotal + (qty * variantPrice));
            const isUnlocked = projectedTotal >= PROMO_THRESHOLD;
            const diff = PROMO_THRESHOLD - projectedTotal;

            let promoTitle = "";
            let promoSubtitle = "";

            if (!isUnlocked) {
              promoTitle = `ช้อปอีก ฿${diff.toLocaleString()} เพื่อรับของแถมฟรี!`;
              promoSubtitle = "ซื้อครบ ฿500 รับของแถมฟรี 1 ชิ้น";
            } else {
              promoTitle = "ยินดีด้วย! คุณได้รับของแถมฟรี 1 ชิ้นแล้ว";
              promoSubtitle = "กดที่นี่เพื่อเข้าไปเลือกของแถมฟรีของคุณ";
            }

            return (
              <div
                onClick={() => onOpenPromo(qty, variant)}
                className="mb-3 p-3 bg-[#fff2f5] border border-[#ffe2e8] rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#ffe2e8]/40 transition-all duration-200 animate-slide-up shrink-0 select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#ffe2e8] flex items-center justify-center text-[#e05275] shrink-0">
                    <Gift size={15} className="animate-bounce" />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-[var(--km-text)] leading-tight">{promoTitle}</p>
                    <p className="text-[11px] font-normal text-[#e05275] mt-0.5">{promoSubtitle}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#e05275] shrink-0 animate-translate-x" />
              </div>
            );
          })()}

          {isRegionUnavailable ? (
            <button
              disabled
              className="w-full py-4 rounded-full text-sm font-medium border border-[var(--km-border)] bg-[var(--km-surface)] text-[var(--km-text-muted)] cursor-not-allowed"
            >
              สินค้ายังไม่เปิดขายในประเทศนี้
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2"
              style={{ background: done ? "#16A34A" : "var(--km-text)", color: "white" }}
            >
              {done
                ? <><Check size={16} /> {isBuy ? "กำลังไปชำระเงิน..." : "เพิ่มลงตะกร้าแล้ว"}</>
                : <>{isBuy ? "ซื้อเลย" : <><ShoppingCart size={16} /> ใส่ตะกร้า</>}</>
              }
            </button>
          )}
        </div>
        </div>

        {/* ── VIEW: shipping ── */}
        <div className={`w-full shrink-0 flex flex-col max-h-[80dvh] md:max-h-[85dvh] ${sheetView === "shipping" ? "h-auto" : "h-0 overflow-hidden"}`}>
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-4 shrink-0">
            <button onClick={() => goTo("main")} className="w-8 h-8 flex items-center justify-center text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-base font-medium text-[var(--km-text)]">ข้อมูลการจัดส่ง</h2>
          </div>

          {/* Address box */}
          <div className="shrink-0 px-4 pb-3">
            <button
              onClick={() => goTo("address")}
              className="w-full flex items-start gap-3 px-4 py-3 text-left rounded-2xl border border-[var(--km-border)] bg-white hover:bg-[var(--km-surface)] transition-colors"
            >
              <MapPin size={14} className="shrink-0 mt-0.5 text-[var(--km-text-muted)]" />
              <div className="flex-1 min-w-0">
                {address ? (
                  <>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-medium text-[var(--km-text)]">{address.firstName} {address.lastName}</span>
                      <span className="text-xs text-[var(--km-text-muted)]">{address.phone}</span>
                      {address.label && <span className="text-xs font-medium border border-[var(--km-border)] text-[var(--km-text-secondary)] px-1.5 py-0.5 rounded">{address.label}</span>}
                      {address.isDefault && <span className="text-xs font-medium text-[var(--km-success)]">ค่าเริ่มต้น</span>}
                    </div>
                    <p className="text-xs text-[var(--km-text-secondary)] leading-relaxed truncate">
                      {address.address}, {address.district}, {address.province}
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus size={13} className="text-[var(--km-text-muted)]" />
                    <span className="text-xs text-[var(--km-text-secondary)]">เพิ่มที่อยู่จัดส่ง</span>
                  </div>
                )}
              </div>
              <ChevronRight size={13} className="shrink-0 mt-0.5 text-[var(--km-text-muted)]" />
            </button>
          </div>

          {/* Shipping options */}
          <div className="overflow-y-auto flex-1" style={{ overscrollBehavior: "contain" }}>
            <div className="divide-y divide-[var(--km-border)]">
              {MOCK_SHIPPING.map((s) => {
                const isSelected = activeShipping.carrier === s.carrier;
                return (
                  <button key={s.carrier}
                    onClick={() => { onSelectShipping(s.carrier); goTo("main"); }}
                    className="flex items-center gap-3 px-5 py-4 w-full text-left hover:bg-[var(--km-surface)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[var(--km-text)]">{s.deliveryDate}</p>
                      <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{s.type} · {s.carrier}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        {s.fee === 0 ? (
                          <div className="flex items-baseline gap-1.5 justify-end">
                            {s.originalFee && <span className="text-xs text-[var(--km-text-muted)] line-through">฿{s.originalFee}</span>}
                            <span className="text-[14px] font-medium text-[var(--km-success)]">ฟรี</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1.5 justify-end">
                            {s.originalFee && <span className="text-xs text-[var(--km-text-muted)] line-through">฿{s.originalFee}</span>}
                            <span className="text-[14px] font-medium text-[var(--km-text)]">฿{s.fee}</span>
                          </div>
                        )}
                      </div>
                      <div className="w-5 flex items-center justify-center">
                        {isSelected && <Check size={16} strokeWidth={2.5} style={{ color: "var(--km-success)" }} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ height: "max(16px, env(safe-area-inset-bottom))" }} />
          </div>
        </div>

        {/* ── VIEW: address list ── */}
        <div className={`w-full shrink-0 flex flex-col max-h-[80dvh] md:max-h-[85dvh] ${sheetView === "address" ? "h-auto" : "h-0 overflow-hidden"}`}>
          <div className="flex items-center gap-2 px-4 py-4 shrink-0 border-b border-[var(--km-border)]">
            <button onClick={() => goTo("shipping")} className="w-8 h-8 flex items-center justify-center text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-base font-medium text-[var(--km-text)]">เลือกที่อยู่จัดส่ง</h2>
          </div>
          <div className="overflow-y-auto flex-1" style={{ overscrollBehavior: "contain" }}>
            {addresses.map((addr) => {
              const isSel = addr.id === (selectedAddressId ?? addresses[0]?.id);
              return (
                <div key={addr.id}>
                  <button onClick={() => { selectAddress(addr.id); goTo("shipping"); }}
                    className="w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-[var(--km-surface)] transition-colors"
                  >
                    <MapPin size={15} className="shrink-0 mt-0.5 text-[var(--km-text-muted)]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[15px] font-medium text-[var(--km-text)]">{addr.firstName} {addr.lastName}</span>
                        <span className="text-[13px] text-[var(--km-text-muted)]">{addr.phone}</span>
                        {addr.label && <span className="text-[13px] font-medium border border-[var(--km-border)] text-[var(--km-text-secondary)] px-2 py-0.5 rounded-full">{addr.label}</span>}
                        {addr.isDefault && <span className="text-[13px] font-medium text-[var(--km-success)]">ค่าเริ่มต้น</span>}
                      </div>
                      <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed">{addr.address}, {addr.district}, {addr.province} {addr.postalCode}</p>
                    </div>
                    <div className="w-5 flex items-center justify-center shrink-0 mt-0.5">
                      {isSel && <Check size={15} strokeWidth={2.5} style={{ color: "var(--km-success)" }} />}
                    </div>
                  </button>
                  <div className="h-px bg-[var(--km-border)] mx-4" />
                </div>
              );
            })}
            <button onClick={() => { setAddrForm({ label: "บ้าน", firstName: "", lastName: "", phone: "", address: "", district: "", subDistrict: "", province: "กรุงเทพมหานคร", postalCode: "" }); setAddrErrors({}); goTo("addressForm"); }}
              className="w-full px-4 py-4 flex items-center gap-3 text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">เพิ่มที่อยู่ใหม่</span>
            </button>
            <div style={{ height: "max(16px, env(safe-area-inset-bottom))" }} />
          </div>
        </div>

        {/* ── VIEW: address form ── */}
        <div className={`w-full shrink-0 flex flex-col max-h-[80dvh] md:max-h-[85dvh] ${sheetView === "addressForm" ? "h-auto" : "h-0 overflow-hidden"}`}>
          <div className="flex items-center gap-2 px-4 py-4 shrink-0 border-b border-[var(--km-border)]">
            <button onClick={() => goTo("address")} className="w-8 h-8 flex items-center justify-center text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-base font-medium text-[var(--km-text)]">เพิ่มที่อยู่ใหม่</h2>
          </div>
          <div className="overflow-y-auto flex-1 px-4 py-4 flex flex-col gap-3" style={{ overscrollBehavior: "contain" }}>
            {/* Label tabs */}
            <div className="flex gap-2">
              {["บ้าน","ที่ทำงาน","อื่นๆ"].map((l) => (
                <button key={l} onClick={() => setAddrForm((f) => ({ ...f, label: l }))}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={{ borderColor: addrForm.label === l ? "var(--km-text)" : "var(--km-border)", background: addrForm.label === l ? "var(--km-surface)" : "transparent", color: addrForm.label === l ? "var(--km-text)" : "var(--km-text-secondary)" }}
                >{l}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">ชื่อ *</label>
                <input value={addrForm.firstName} onChange={(e) => setAddrForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="ระบุชื่อจริง" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
                {addrErrors.firstName && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.firstName}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">นามสกุล *</label>
                <input value={addrForm.lastName} onChange={(e) => setAddrForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="ระบุนามสกุล" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
                {addrErrors.lastName && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1.5 block">เบอร์โทรศัพท์ *</label>
              <PhoneInput value={addrForm.phone} onChange={(val) => setAddrForm((f) => ({ ...f, phone: val }))} error={!!addrErrors.phone} />
              {addrErrors.phone && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.phone}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">ที่อยู่ *</label>
              <input value={addrForm.address} onChange={(e) => setAddrForm((f) => ({ ...f, address: e.target.value }))} placeholder="ระบุบ้านเลขที่, หมู่, ซอย, ถนน" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
              {addrErrors.address && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">แขวง/ตำบล *</label>
                <input value={addrForm.district} onChange={(e) => setAddrForm((f) => ({ ...f, district: e.target.value }))} placeholder="ระบุตำบล/แขวง" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
                {addrErrors.district && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.district}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">จังหวัด *</label>
                <select value={addrForm.province} onChange={(e) => setAddrForm((f) => ({ ...f, province: e.target.value }))} className="w-full h-12 pl-4 pr-10 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none bg-white appearance-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23A3A3A3' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}>
                  {["กรุงเทพมหานคร","เชียงใหม่","ชลบุรี","ภูเก็ต","ขอนแก่น","นนทบุรี","ปทุมธานี","สมุทรปราการ","นครราชสีมา","เชียงราย","สมุทรสาคร","นครปฐม","ระยอง","ประจวบคีรีขันธ์","อื่นๆ"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--km-text-secondary)] mb-1 block">รหัสไปรษณีย์ *</label>
              <input value={addrForm.postalCode} onChange={(e) => setAddrForm((f) => ({ ...f, postalCode: e.target.value.replace(/\D/g,"").slice(0,5) }))} placeholder="ระบุรหัสไปรษณีย์ 5 หลัก" inputMode="numeric" className="w-full h-12 px-4 text-[13px] rounded-2xl border border-[var(--km-border)] outline-none" />
              {addrErrors.postalCode && <p className="text-xs text-[var(--km-error)] mt-1">{addrErrors.postalCode}</p>}
            </div>
            <div style={{ height: "60px" }} />
          </div>
          {/* Save CTA */}
          <div className="shrink-0 px-4 pt-3 pb-5 border-t border-[var(--km-border)]" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
            <button onClick={saveAddr} className="w-full py-3.5 rounded-full text-white text-sm font-medium" style={{ background: "var(--km-text)" }}>
              บันทึกที่อยู่
            </button>
          </div>
        </div>

        </div>{/* end sliding viewport */}
      </div>
    </>
  );
}

/* ─── Mobile Image Carousel ─── */
function MobileImageCarousel({
  images, activeImg, setActiveImg, onExpand,
}: {
  images: string[];
  activeImg: number;
  setActiveImg: (i: number) => void;
  onExpand: (i: number) => void;
}) {
  const [displayIndex, setDisplayIndex] = useState(images.length > 1 ? activeImg + 1 : 0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging  = useRef(false);

  // Prepare slides with clones for infinite loop: [Last, 1, 2, 3, First]
  const slides = images.length > 1 ? [images[images.length - 1], ...images, images[0]] : images;

  // Sync display index when external activeImg changes (e.g. from desktop thumbnails)
  useEffect(() => {
    if (images.length <= 1) {
      if (displayIndex !== 0) setDisplayIndex(0);
      return;
    }
    // Only sync if we're not in the middle of a loop jump
    if (displayIndex !== activeImg + 1 && (displayIndex > 0 && displayIndex < slides.length - 1)) {
      setDisplayIndex(activeImg + 1);
    }
  }, [activeImg, images.length, slides.length, displayIndex]);

  const handleTransitionEnd = () => {
    if (images.length <= 1) return;
    
    // Seamless jump at boundaries
    if (displayIndex === 0) {
      setIsTransitionEnabled(false);
      setDisplayIndex(images.length);
    } else if (displayIndex === slides.length - 1) {
      setIsTransitionEnabled(false);
      setDisplayIndex(1);
    }
  };

  // Restore transition after a silent jump
  useEffect(() => {
    if (!isTransitionEnabled) {
      const raf = requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitionEnabled]);

  const goTo = (targetDisplayIndex: number) => {
    if (images.length <= 1) return;
    setIsTransitionEnabled(true);
    setDisplayIndex(targetDisplayIndex);

    // Update logical activeImg for parent
    let logicalIndex = targetDisplayIndex - 1;
    if (logicalIndex < 0) logicalIndex = images.length - 1;
    if (logicalIndex >= images.length) logicalIndex = 0;
    setActiveImg(logicalIndex);
  };

  const dragStart = (x: number) => { 
    touchStartX.current = x; 
    touchDeltaX.current = 0; 
    isDragging.current = true; 
  };
  
  const dragMove = (x: number) => { 
    if (!isDragging.current) return; 
    touchDeltaX.current = x - touchStartX.current; 
  };

  const dragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (Math.abs(touchDeltaX.current) > 40) {
      goTo(touchDeltaX.current < 0 ? displayIndex + 1 : displayIndex - 1);
    }
  };

  const GAP  = 12;
  const SIDE = 24;

  return (
    <div className="md:hidden flex flex-col items-center">
      {/* 1. Image Container */}
      <div className="relative -mx-4 overflow-hidden select-none w-[100vw]">
        <div
          className="flex"
          style={{
            gap: GAP,
            paddingLeft: SIDE,
            transform: `translateX(calc(-${displayIndex} * (100vw - ${SIDE * 2}px + ${GAP}px)))`,
            transition: isTransitionEnabled ? "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)" : "none",
            willChange: "transform",
          }}
          onTouchStart={(e) => dragStart(e.touches[0].clientX)}
          onTouchMove={(e) => dragMove(e.touches[0].clientX)}
          onTouchEnd={dragEnd}
          onTransitionEnd={handleTransitionEnd}
          onMouseDown={(e) => dragStart(e.clientX)}
          onMouseMove={(e) => dragMove(e.clientX)}
          onMouseUp={dragEnd}
          onMouseLeave={dragEnd}
          draggable={false}
        >
          {slides.map((src, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 aspect-square rounded-xl overflow-hidden bg-[var(--km-surface)]"
              style={{ width: `calc(100vw - ${SIDE * 2}px)` }}
            >
                <div 
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => {
                    // Map back to original index for lightbox
                    let originalIdx = i - 1;
                    if (originalIdx < 0) originalIdx = images.length - 1;
                    if (originalIdx >= images.length) originalIdx = 0;
                    onExpand(originalIdx);
                  }}
                >
                  <Image src={src} alt="" fill sizes="90vw" className="object-cover" priority={images.length > 1 ? i === 1 : i === 0} />
                  
                  {/* Badge - Now explicitly inside a relative wrapper within the slide */}

                </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Dynamic Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-5 pb-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`transition-all duration-300 rounded-full ${
              i === activeImg 
                ? "w-7 h-1 bg-[var(--km-text)]" 
                : "w-1 h-1 bg-[var(--km-text)] opacity-20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main PDP Client ─── */
/* ─── Lightbox Carousel (Infinite) ─── */
function LightboxCarousel({ 
  images, 
  lightboxImg, 
  setLightboxImg, 
  productName,
  isClosing
}: { 
  images: string[]; 
  lightboxImg: number; 
  setLightboxImg: (i: number) => void; 
  productName: string;
  isClosing?: boolean;
}) {
  const slides = images.length > 1 ? [images[images.length - 1], ...images, images[0]] : images;
  const [displayIdx, setDisplayIdx] = useState(lightboxImg + 1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    if (images.length <= 1) return;
    if (displayIdx !== lightboxImg + 1 && (displayIdx > 0 && displayIdx < slides.length - 1)) {
      setDisplayIdx(lightboxImg + 1);
    }
  }, [lightboxImg, images.length, slides.length]);

  const handleTransitionEnd = () => {
    if (images.length <= 1) return;
    if (displayIdx === 0) {
      setIsTransitioning(false);
      setDisplayIdx(images.length);
      setLightboxImg(images.length - 1);
    } else if (displayIdx === slides.length - 1) {
      setIsTransitioning(false);
      setDisplayIdx(1);
      setLightboxImg(0);
    }
  };

  const move = (dir: 1 | -1) => {
    setIsTransitioning(true);
    const next = displayIdx + dir;
    setDisplayIdx(next);
    
    let actual = next - 1;
    if (actual < 0) actual = images.length - 1;
    if (actual >= images.length) actual = 0;
    setLightboxImg(actual);
  };

  return (
    <div
      className={`flex-1 relative overflow-hidden ${isClosing ? 'animate-lightbox-zoom-out' : 'animate-lightbox-zoom'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="flex h-full"
        onTransitionEnd={handleTransitionEnd}
        style={{ 
          width: `${slides.length * 100}%`,
          transform: `translateX(-${(displayIdx / slides.length) * 100}%)`,
          transition: isTransitioning ? "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)" : "none"
        }}
      >
        {slides.map((src, i) => (
          <div 
            key={i} 
            className="relative h-full flex-shrink-0 p-4 md:p-12" 
            style={{ width: `${100 / slides.length}%` }}
          >
            <Image
              src={src}
              alt={productName}
              fill
              sizes="100vw"
              className="object-contain"
              priority={i === displayIdx}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => move(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/90 backdrop-blur-md transition-all border border-white/20 shadow-md group active:scale-95"
          >
            <ChevronLeft size={24} className="text-[var(--km-text)] transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={() => move(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/90 backdrop-blur-md transition-all border border-white/20 shadow-md group active:scale-95"
          >
            <ChevronRight size={24} className="text-[var(--km-text)] transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}
    </div>
  );
}

export function PDPClient({ product, related }: Props) {
  const isGift = product.price === 0;
  const getProductReviews = useOrdersStore((s) => s.getProductReviews);
  const userReviews = getProductReviews(product.id);

  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => { setMounted(true); }, []);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [activeImg, setActiveImg]         = useState(0);


  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlisted = useWishlistStore((s) => s.has(product.id));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toasts, setToasts]               = useState<ToastData[]>([]);

  const addToast = (data: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...data, id }]);
  };
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const [lightbox, setLightbox]           = useState(false);
  const [isClosing, setIsClosing]         = useState(false);
  const [lightboxImg, setLightboxImg]     = useState(0);

  const handleCloseLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setLightbox(false);
      setIsClosing(false);
    }, 300);
  };
  const [, setActiveSection] = useState<SectionId>("detail");
  const [sheetMode, setSheetMode]         = useState<SheetMode>(null);
  const [activePromoCampaignId, setActivePromoCampaignId] = useState<string | null>(null);
  useEffect(() => {
    const promoParam = searchParams.get("promo");
    if (promoParam && PROMO_CAMPAIGNS.find(c => c.id === promoParam)) {
      setActivePromoCampaignId(promoParam);
    }
  }, [searchParams]);
  const [promoInitialQty, setPromoInitialQty] = useState(1);
  const pdpRegion = useLocaleStore((s) => s.region);
  const isPdpRegionUnavailable = !!(product.unavailableRegions?.includes(pdpRegion.code));

  const [shippingOpen, setShippingOpen]   = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(MOCK_SHIPPING[0].carrier);
  const activeShipping = MOCK_SHIPPING.find((s) => s.carrier === selectedShipping) ?? MOCK_SHIPPING[0];
  const [selectedVariant, setSelectedVariant] = useState(MOCK_VARIANTS[1].label);
  const pdpVariant = MOCK_VARIANTS.find((v) => v.label === selectedVariant) ?? MOCK_VARIANTS[1];
  const images = isGift
    ? [product.image]
    : [
        ...MOCK_IMAGES.filter((i) => !MOCK_VARIANTS.some((v) => v.image === i)),
        ...MOCK_VARIANTS.map((v) => v.image),
      ].slice(0, 6);

  const [visibleRelatedCount, setVisibleRelatedCount] = useState(10);

  const [recentlyViewed, setRecentlyViewed] = useState<ProductCardProps[]>([]);
  const viewedScrollRef = useRef<HTMLDivElement>(null);

  const scrollViewed = (direction: "left" | "right") => {
    if (viewedScrollRef.current) {
      const scrollAmount = 300;
      const scrollTo = direction === "left" 
        ? viewedScrollRef.current.scrollLeft - scrollAmount 
        : viewedScrollRef.current.scrollLeft + scrollAmount;
      
      viewedScrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !product || !product.id) return;
    try {
      const key = "recently-viewed-products";
      const raw = localStorage.getItem(key);
      let list: ProductCardProps[] = raw ? JSON.parse(raw) : [];

      list = list.filter((p) => p && p.id);

      const updatedList = list.filter((p) => p.id !== product.id);
      updatedList.unshift(product);
      const trimmedList = updatedList.slice(0, 10);

      localStorage.setItem(key, JSON.stringify(trimmedList));

      const toDisplay = trimmedList.filter((p) => p.id !== product.id);
      setRecentlyViewed(toDisplay);
    } catch (err) {
      console.error("Failed to update recently viewed history", err);
    }
  }, [product]);
  
  // Restore scroll/state from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`related_count_${product.id}`);
    if (saved) {
      setVisibleRelatedCount(parseInt(saved, 10));
    }
  }, [product.id]);

  // Persist state when it changes
  useEffect(() => {
    if (visibleRelatedCount > 10) {
      sessionStorage.setItem(`related_count_${product.id}`, visibleRelatedCount.toString());
    }
  }, [visibleRelatedCount, product.id]);
  const handleSelectVariant = (label: string) => {
    setSelectedVariant(label);
    const v = MOCK_VARIANTS.find((v) => v.label === label) ?? MOCK_VARIANTS[0];
    const idx = images.indexOf(v.image);
    setActiveImg(idx >= 0 ? idx : 0);
  };

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    detail: null,
    review: null,
  });

  const flashDeal = FLASH_DEAL_PRODUCTS.find((f) => f.id === product.id) ?? null;

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = originalStyle; };
    }
  }, [lightbox]);

  // Centralized scroll lock for all bottom sheets
  const isAnySheetOpen = sheetMode !== null || activePromoCampaignId !== null || shippingOpen;
  useEffect(() => {
    if (isAnySheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAnySheetOpen]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const setSectionRef = useCallback((id: SectionId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white pb-6 md:pb-0">

      {/* ── Breadcrumb (desktop) ── */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="text-xs text-[var(--km-text-muted)] flex items-center gap-1.5">
            <Link href="/" className="hover:text-[var(--km-text)] transition-colors">หน้าแรก</Link>
            <ChevronRight size={10} />
            <Link href="/products" className="hover:text-[var(--km-text)] transition-colors">สินค้าทั้งหมด</Link>
            <ChevronRight size={10} />
            <span className="text-[var(--km-text)] line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-0 md:py-10">
        <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-12 lg:gap-16">

          {/* ── Left: Images ── */}
          <div className="flex flex-col gap-3">

            {/* Mobile carousel (peek) */}
            <MobileImageCarousel
              images={images}
              activeImg={activeImg}
              setActiveImg={setActiveImg}
              onExpand={(i) => { setLightboxImg(i); setLightbox(true); }}
            />

            {/* Desktop carousel */}
            <div className="hidden md:flex flex-col items-center gap-4">
              <div 
                className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[var(--km-surface)] group cursor-zoom-in"
                onClick={() => { setLightboxImg(activeImg); setLightbox(true); }}
              >
                {/* Sliding strip */}
                <div
                  className="flex h-full"
                  style={{
                    width: `${images.length * 100}%`,
                    transform: `translateX(calc(-${activeImg} * (100% / ${images.length})))`,
                    transition: "transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
                    willChange: "transform",
                  }}
                >
                  {images.map((src, i) => (
                    <div key={i} className="relative h-full flex-shrink-0" style={{ width: `${100 / images.length}%` }}>
                      <Image src={src} alt="" fill sizes="50vw" className="object-cover" priority={i === 0} />
                    </div>
                  ))}
                </div>



                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg - 1 + images.length) % images.length); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <ChevronLeft size={16} className="text-[var(--km-text)]" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg + 1) % images.length); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <ChevronRight size={16} className="text-[var(--km-text)]" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === activeImg
                        ? "w-7 h-1 bg-[var(--km-text)]"
                        : "w-1 h-1 bg-[var(--km-text)] opacity-20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col gap-4 min-w-0 overflow-hidden">

            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <Link
                  href={`/brands/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-1 w-fit group"
                >
                  <span className="text-[16px] font-medium tracking-wide uppercase text-[var(--km-text)] group-hover:text-[var(--km-text-secondary)] transition-colors leading-tight">
                    {product.brand}
                  </span>
                  <ChevronRight size={16} className="text-[var(--km-text-muted)] group-hover:text-[var(--km-text-secondary)] transition-colors" />
                </Link>
                <h1 className="text-[14px] font-normal text-[var(--km-text-secondary)] leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Share & Wishlist Container */}
              <div className="flex items-center gap-1 -mr-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: `${product.brand} - ${product.name}`,
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      addToast({ message: "คัดลอกลิงก์เรียบร้อยแล้ว" });
                    }
                  }}
                  className="p-2 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
                  aria-label="Share product"
                >
                  <Share2 size={18} strokeWidth={1.5} />
                </button>


                <button
                  onClick={() => {
                    if (!isLoggedIn) { setShowLoginModal(true); return; }
                    toggleWishlist(product.id);
                    if (!wishlisted) addToast({ message: "เพิ่มในรายการถูกใจแล้ว", action: { label: "ดูรายการ", href: "/account/wishlist" } });
                  }}
                  className="hidden md:flex p-2 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={22}
                    strokeWidth={1.5}
                    style={{ 
                      color: wishlisted ? "#E57373" : "inherit", 
                      fill: wishlisted ? "#E57373" : "none" 
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Flash Deal - Mobile Only (Between Name and Price) */}
            {flashDeal && (() => {
              const remaining = flashDeal.total - flashDeal.sold;
              const pct = Math.min(Math.round((flashDeal.sold / flashDeal.total) * 100), 100);
              return (
                <div className="flex flex-col gap-1.5 md:hidden" style={{ width: "calc(100vw - 2rem)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[var(--km-text-muted)]">เหลืออีก {remaining}</span>
                    <FlashCountdown endsAt={flashDeal.endsAt} />
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--km-surface)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--km-text)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[18px] font-medium text-[var(--km-text)]">
                  {isGift ? <span className="text-[var(--km-success)]">ฟรี</span> : `฿${pdpVariant.price.toLocaleString()}`}
                </span>
                {!isGift && pdpVariant.originalPrice && (
                  <>
                    <span className="text-[13px] text-[var(--km-text-muted)] line-through">
                      ฿{pdpVariant.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-[var(--km-text-secondary)]">
                      -{Math.round((1 - pdpVariant.price / pdpVariant.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              {!isGift && <span className="text-xs text-[var(--km-text-muted)]">เหลืออีก {pdpVariant.stock}</span>}
            </div>

            {/* Flash Deal - Desktop Only (Below Price) */}
            {flashDeal && (() => {
              const remaining = flashDeal.total - flashDeal.sold;
              const pct = Math.min(Math.round((flashDeal.sold / flashDeal.total) * 100), 100);
              return (
                <div className="hidden md:flex flex-col gap-1.5 mt-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[var(--km-text-muted)]">เหลืออีก {remaining}</span>
                    <FlashCountdown endsAt={flashDeal.endsAt} />
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--km-surface)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--km-text)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })()}

            {/* Variant selector */}
            {!isGift && (
              <div>
                <div className="flex gap-2 flex-wrap">
                  {MOCK_VARIANTS.map((v) => (
                    <button
                      key={v.label}
                      onClick={() => handleSelectVariant(v.label)}
                      className="px-4 py-2 rounded-full border text-xs font-medium transition-all"
                      style={{
                        borderColor: selectedVariant === v.label ? "var(--km-text)" : "var(--km-border)",
                        color:       selectedVariant === v.label ? "var(--km-text)" : "var(--km-text-secondary)",
                        background:  selectedVariant === v.label ? "var(--km-surface)" : "transparent",
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Promo banners — one per applicable campaign */}
            {!isGift && (() => {
              const campaigns = getCampaignsForProduct(product.id);
              if (campaigns.length === 0) return null;
              return (
                <div className="flex flex-col gap-4 py-1">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="w-full flex flex-col gap-2">
                      {/* Header row */}
                      <button
                        onClick={() => setActivePromoCampaignId(campaign.id)}
                        className="flex items-center gap-2.5 w-full text-left hover:opacity-70 transition-opacity"
                      >
                        <Gift size={14} className="text-[var(--km-text-muted)] shrink-0" strokeWidth={2} />
                        <div className="flex-1 min-w-0">
                          <span className="text-[13px] font-medium text-[var(--km-text)] block">{campaign.title}</span>
                        </div>
                        <ChevronRight size={14} className="text-[var(--km-text-muted)] shrink-0" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Desktop CTA */}
            <div className="hidden md:flex gap-3">
              {isGift || isPdpRegionUnavailable ? (
                <button
                  disabled
                  className="w-full py-3.5 rounded-full bg-[var(--km-surface)] text-[var(--km-text-muted)] text-sm font-medium border border-[var(--km-border)] cursor-not-allowed"
                >
                  {isPdpRegionUnavailable ? "สินค้ายังไม่เปิดขายในประเทศนี้" : "ไม่เปิดจำหน่าย"}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setSheetMode("cart")}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full border border-[var(--km-border-strong)] text-[var(--km-text)] text-sm font-medium hover:bg-[var(--km-surface)] transition-colors duration-200"
                  >
                    <ShoppingCart size={16} />
                    ใส่ตะกร้า
                  </button>
                  <button
                    onClick={() => setSheetMode("buy")}
                    className="flex-1 py-3.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium hover:bg-[var(--km-brand-hover)] transition-colors duration-200"
                  >
                    ซื้อเลย
                  </button>
                </>
              )}
            </div>


            {/* Shipping info */}
            <div className="flex flex-col">
              <button
                onClick={() => setShippingOpen(true)}
                className="flex items-center gap-2.5 py-3 w-full text-left hover:opacity-70 transition-opacity"
              >
                <Truck size={14} className="text-[var(--km-text-muted)] shrink-0" />
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[var(--km-text)]">{activeShipping.deliveryDate}</p>
                    <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{activeShipping.type} · {activeShipping.carrier}</p>
                  </div>
                  {activeShipping.fee === 0
                    ? <p className="text-[13px] font-medium text-[var(--km-success)]">ฟรี</p>
                    : <p className="text-[13px] font-medium text-[var(--km-text)]">฿{activeShipping.fee}</p>
                  }
                </div>
                <ChevronRight size={14} className="text-[var(--km-text-muted)] shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Inline Sections ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <section id="detail" ref={setSectionRef("detail")} className="pt-4 pb-4">
          <div className="hidden md:block max-w-4xl mx-auto">
            <Accordion items={MOCK_DETAIL_SECTIONS} />
          </div>
          <div className="md:hidden">
            <Accordion items={MOCK_DETAIL_SECTIONS} />
          </div>
        </section>

        {/* ── Gallery Section ── */}
        <GallerySection images={[
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
          "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
        ]} />


        {/* ── สินค้าที่เคยดู (Recently Viewed) ── */}
        {recentlyViewed.length > 0 && (
          <section className="py-4">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-medium text-[var(--km-text)]">Recently View</h2>
            </div>
            <div className="relative group/scroll-viewed">
              {/* Navigation Arrows (Sides) */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 md:px-6 pointer-events-none z-20">
                <button 
                  onClick={() => scrollViewed("left")}
                  className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-auto w-12 h-12 bg-white rounded-full shadow-xl border border-[var(--km-border)] items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-text)] hover:text-white transition-all opacity-0 group-hover/scroll-viewed:opacity-100 group-hover/scroll-viewed:translate-x-0"
                  aria-label="Previous products"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  onClick={() => scrollViewed("right")}
                  className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 translate-x-1/2 pointer-events-auto w-12 h-12 bg-white rounded-full shadow-xl border border-[var(--km-border)] items-center justify-center text-[var(--km-text)] hover:bg-[var(--km-text)] hover:text-white transition-all opacity-0 group-hover/scroll-viewed:opacity-100 group-hover/scroll-viewed:translate-x-0"
                  aria-label="Next products"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div 
                ref={viewedScrollRef}
                className="overflow-x-auto scrollbar-none scroll-smooth -mx-4 md:-mx-6"
              >
                <div className="flex gap-4 md:gap-5 w-max pb-4 px-4 md:px-6">
                  {recentlyViewed.map((p) => (
                    <div key={p.id} className="w-[160px] md:w-[220px] flex-shrink-0 flex flex-col">
                      <ProductCard {...p} rank={undefined} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── AI Model Checker Touchpoint ── */}
        <section className="py-4">
          <a
            href="/ai-checker"
            className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-[var(--km-border)] bg-[var(--km-surface)] hover:border-[var(--km-border-strong)] hover:bg-white transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--km-surface-dark)] flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🤖</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--km-text)] leading-snug">ไม่แน่ใจว่าฟิล์มนี้ใช้ได้กับรุ่นคุณไหม?</p>
              <p className="text-xs text-[var(--km-text-muted)] mt-0.5">ใช้ AI Checker เช็ครุ่นและขนาดหน้าจอ — ฟรี ไม่ต้องสมัคร</p>
            </div>
            <span className="text-xs font-medium text-[var(--km-text-secondary)] group-hover:text-[var(--km-text)] transition-colors whitespace-nowrap">เช็คเลย →</span>
          </a>
        </section>

        {related.length > 0 && (
          <section className="py-4">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-medium text-[var(--km-text)]">สินค้าที่เกี่ยวข้อง</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
              {related.slice(0, visibleRelatedCount).map((p) => (
                <div key={p.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col">
                  <ProductCard {...p} rank={undefined} />
                </div>
              ))}
            </div>
            
            {visibleRelatedCount < related.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleRelatedCount((prev) => prev + 10)}
                  className="flex items-center gap-2.5 px-8 py-3 rounded-full border border-[var(--km-border-strong)] text-sm font-medium text-[var(--km-text)] hover:bg-[var(--km-surface)] transition-all active:scale-95"
                >
                  ดูเพิ่มเติม
                  <ChevronDown size={15} />
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white z-[800] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <BottomAnnouncement />
        <div className="flex items-center gap-2 px-4 py-3">
          {isGift || isPdpRegionUnavailable ? (
            <button
              disabled
              className="w-full h-11 rounded-full bg-[var(--km-surface)] text-[var(--km-text-muted)] text-sm font-medium border border-[var(--km-border)] cursor-not-allowed"
            >
              {isPdpRegionUnavailable ? "สินค้ายังไม่เปิดขายในประเทศนี้" : "ไม่เปิดจำหน่าย"}
            </button>
          ) : (
            <>
              {/* Wishlist */}
              {showLoginModal && (
                <LoginModal onClose={() => setShowLoginModal(false)} reason="wishlist" redirectTo={`/products/${product.id}`} />
              )}
              <button
                onClick={() => {
                  if (!isLoggedIn) { setShowLoginModal(true); return; }
                  toggleWishlist(product.id);
                  if (!wishlisted) addToast({ message: "เพิ่มในรายการถูกใจแล้ว", action: { label: "ดูรายการ", href: "/account/wishlist" } });
                }}
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center transition-colors"
              >
                <Heart
                  size={22}
                  strokeWidth={1.5}
                  style={{ color: wishlisted ? "#E57373" : "var(--km-text)", fill: wishlisted ? "#E57373" : "none" }}
                />
              </button>

              {/* Cart icon button */}
              <button
                onClick={() => setSheetMode("cart")}
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center transition-colors"
              >
                <ShoppingCart size={22} strokeWidth={1.5} className="text-[var(--km-text)]" />
              </button>

              {/* Buy now — full width */}
              <button
                onClick={() => setSheetMode("buy")}
                className="flex-1 h-11 rounded-full bg-[var(--km-text)] text-white text-sm font-medium hover:bg-[var(--km-brand-hover)] transition-colors duration-200 active:scale-[0.98]"
              >
                ซื้อเลย
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Product Sheet (Cart / Buy) ── */}
      <ProductSheet
        product={product}
        mode={sheetMode}
        onClose={() => setSheetMode(null)}
        defaultVariant={selectedVariant}
        activeShipping={activeShipping}
        onSelectShipping={setSelectedShipping}
        onOpenPromo={(qty, variantLabel) => {
          setPromoInitialQty(qty);
          if (variantLabel) setSelectedVariant(variantLabel);
          setSheetMode(null);
          const campaigns = getCampaignsForProduct(String(product.id));
          if (campaigns.length > 0) setActivePromoCampaignId(campaigns[0].id);
        }}
      />

      {/* ── Promo Campaign Bottom Sheet ── */}
      <PromoCampaignSheet
        campaign={PROMO_CAMPAIGNS.find(c => c.id === activePromoCampaignId) ?? null}
        onClose={() => setActivePromoCampaignId(null)}
        product={product}
        currentProductQty={promoInitialQty}
        currentProductVariant={selectedVariant}
      />

      {/* ── Shipping Sheet ── */}
      <ShippingSheet open={shippingOpen} onClose={() => setShippingOpen(false)} onSelect={setSelectedShipping} />

      {/* ── Toast ── */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {/* ── Lightbox (Revamped Glassmorphism) ── */}
      {lightbox && (
        <div
          className={`fixed inset-0 z-[950] bg-white/20 backdrop-blur-[40px] flex flex-col ${isClosing ? 'animate-lightbox-fade-out' : 'animate-lightbox-fade'}`}
          onClick={handleCloseLightbox}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleCloseLightbox(); }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/80 transition-all border border-white/20 shadow-sm"
            >
              <X size={20} className="text-[var(--km-text)]" />
            </button>
            <span className="text-[var(--km-text-secondary)] font-medium text-sm tracking-tight">{lightboxImg + 1} / {images.length}</span>
            <div className="w-10" />
          </div>

          {/* Main Image View (Infinite Sliding Carousel) */}
          <LightboxCarousel 
            images={images} 
            lightboxImg={lightboxImg} 
            setLightboxImg={setLightboxImg} 
            productName={product.name}
            isClosing={isClosing}
          />

          {/* Thumbnails Footer */}
          <div 
            className="flex justify-center gap-2 px-4 py-6 overflow-x-auto no-scrollbar" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxImg(i)}
                  className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300"
                  style={{ 
                    opacity: lightboxImg === i ? 1 : 0.4, 
                    transform: lightboxImg === i ? "scale(1.1)" : "scale(1)",
                    border: lightboxImg === i ? "1.5px solid var(--km-text)" : "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl md:text-2xl font-medium text-[var(--km-text)]">{children}</h2>;
}
