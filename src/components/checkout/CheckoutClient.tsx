"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  CreditCard, Smartphone, Banknote, TicketPercent, ChevronRight, MapPin, Plus, X, Check, FileText, Truck, ChevronLeft, Loader2, Gift, MessageSquare, Building2, HelpCircle,
} from "lucide-react";
import { useCartStore, useSelectedItems, useCartSubtotal } from "@/stores/cart.store";
import {
  useCheckoutStore, useSelectedAddress,
  SHIPPING_OPTIONS, type ShippingId,
} from "@/stores/checkout.store";
import { useTaxInvoiceStore } from "@/stores/taxInvoice.store";
import { useAuthStore } from "@/stores/auth.store";
import { useOrdersStore, type Order } from "@/stores/orders.store";
import { useNotificationsStore } from "@/stores/notifications.store";
import { useUserStore } from "@/stores/user.store";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useUIStore } from "@/stores/ui.store";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { BankChip, THAI_BANKS, CardBrandLogo, PromptPayLogo } from "@/components/payment/PaymentShared";

const FREE_SHIP     = 50000;
const COD_FEE       = 0;
const GIFT_WRAP_FEE = 50;
const GIFT_CARD_FEE = 30;

const PAYMENT_OPTS = [
  { id: "bank"      as const, label: "บัญชีธนาคาร",          sub: "โอนเงินผ่านบัญชีธนาคาร",       icon: Building2   },
  { id: "card"      as const, label: "บัตรเครดิต / เดบิต", sub: "Visa, Mastercard, JCB",       icon: CreditCard  },
  { id: "promptpay" as const, label: "พร้อมเพย์",            sub: "สแกน QR ผ่าน Mobile Banking", icon: Smartphone  },
  { id: "cod"       as const, label: "เก็บเงินปลายทาง",      sub: "ชำระเงินสดเมื่อรับสินค้า",      icon: Banknote    },
] as const;


/* ─── Gift Card Sheet ─── */
function NoteSheet({ open, draft, title, placeholder, onClose, onConfirm }: {
  open: boolean; draft: string; title: string; placeholder: string; onClose: () => void; onConfirm: (msg: string) => void;
}) {
  const [text, setText] = useState(draft);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setText(draft);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      const scrollY = window.scrollY || window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
      document.body.setAttribute("data-scroll-y", scrollY.toString());
    } else {
      setVisible(false);
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      document.documentElement.style.removeProperty("overflow");
      if (savedScrollY) {
        const scrollY = parseInt(savedScrollY, 10);
        window.scrollTo(0, scrollY);
        document.body.removeAttribute("data-scroll-y");
      }
    }
    return () => {
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      document.documentElement.style.removeProperty("overflow");
      if (savedScrollY) {
        const scrollY = parseInt(savedScrollY, 10);
        window.scrollTo(0, scrollY);
        document.body.removeAttribute("data-scroll-y");
      }
    };
  }, [open, draft]);

  if (!open) return null;

  const noteContent = (
    <>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h2 className="text-base font-medium text-[var(--km-text)]">{title}</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)]"><X size={18} /></button>
      </div>
      <div className="px-5 pb-3">
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full border border-[var(--km-border)] rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors"
        />
        <p className="text-xs text-[var(--km-text-muted)] mt-1 text-right">{text.length} / 200 ตัวอักษร</p>
      </div>
      <div className="px-5 pt-2 pb-5">
        <button
          onClick={() => { onConfirm(text.trim()); onClose(); }}
          className="w-full py-3.5 rounded-full text-white text-sm font-medium"
          style={{ background: "var(--km-text)" }}
        >
          ยืนยัน
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-[950] bg-black/50 transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }} onClick={onClose} />
      {/* Mobile: bottom sheet */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-[960] bg-white rounded-t-2xl flex flex-col transition-transform duration-300" style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}>
        {noteContent}
      </div>
      {/* Desktop: centered modal */}
      <div className="hidden md:flex fixed inset-0 z-[960] items-center justify-center transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
          {noteContent}
        </div>
      </div>
    </>
  );
}

/* ─── Shipping selector sheet ─── */
function ShippingSheet({
  current, onSelect, onClose, open, isFreeShip
}: {
  current: ShippingId;
  onSelect: (id: ShippingId) => void; onClose: () => void;
  open: boolean;
  isFreeShip: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      const scrollY = window.scrollY || window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
      document.body.setAttribute("data-scroll-y", scrollY.toString());
    } else {
      setVisible(false);
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      document.documentElement.style.removeProperty("overflow");
      if (savedScrollY) {
        const scrollY = parseInt(savedScrollY, 10);
        window.scrollTo(0, scrollY);
        document.body.removeAttribute("data-scroll-y");
      }
    }
    return () => {
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      document.documentElement.style.removeProperty("overflow");
      if (savedScrollY) {
        const scrollY = parseInt(savedScrollY, 10);
        window.scrollTo(0, scrollY);
        document.body.removeAttribute("data-scroll-y");
      }
    };
  }, [open]);

  if (!open && !visible) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  const shippingList = (
    <div className="flex flex-col">
      {SHIPPING_OPTIONS.map((opt, i) => {
        const active = current === opt.id;
        return (
          <div key={opt.id}>
            {i > 0 && <div className="h-px bg-[var(--km-border)] mx-4" />}
            <button
              onClick={() => { onSelect(opt.id); handleClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--km-surface)] transition-colors"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ border: active ? "none" : "1.5px solid var(--km-border)" }}
              >
                {active && <Check size={14} strokeWidth={2.5} color="var(--km-success)" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--km-text)]">{opt.name}</p>
                <p className="text-xs text-[var(--km-text-muted)]">ได้รับภายใน {opt.eta}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {(isFreeShip ? opt.fee > 0 : opt.promoFee < opt.fee) && (
                  <span className="text-xs text-[var(--km-text-muted)] line-through">฿{opt.fee}</span>
                )}
                <span className="text-sm font-normal" style={{ color: (isFreeShip || opt.promoFee < opt.fee) ? "var(--km-success)" : "var(--km-text)" }}>
                  {(isFreeShip || opt.promoFee === 0) ? "ฟรี" : `฿${opt.promoFee}`}
                </span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 z-[900] bg-black/40 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />
      {/* Mobile: bottom sheet */}
      <div
        className="md:hidden fixed inset-x-0 bottom-0 z-[910] bg-white rounded-t-2xl overflow-hidden transition-transform duration-[280ms] ease-out"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-[var(--km-border-strong)]" />
        </div>
        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <p className="text-base font-medium text-[var(--km-text)]">เลือกการจัดส่ง</p>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors">
            <X size={18} />
          </button>
        </div>
        <div style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>{shippingList}</div>
      </div>
      {/* Desktop: centered modal */}
      <div
        className="hidden md:flex fixed inset-0 z-[910] items-center justify-center transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--km-border)]">
            <p className="text-base font-medium text-[var(--km-text)]">เลือกการจัดส่ง</p>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)] transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="pb-2">{shippingList}</div>
        </div>
      </div>
    </>
  );
}

/* ─── Main ─── */
export function CheckoutClient() {
  const router = useRouter();
  const setHeaderRightOverride = useUIStore((s) => s.setHeaderRightOverride);
  const [confirmExit, setConfirmExit] = useState(false);
  const cartSelectedItems = useSelectedItems();
  const cartSubtotal      = useCartSubtotal();
  const buyNowItem        = useCartStore((s) => s.buyNowItem);
  const clearBuyNow       = useCartStore((s) => s.clearBuyNow);
  const subtotal          = buyNowItem ? buyNowItem.price * buyNowItem.quantity : cartSubtotal;
  const selectedItemsBase = buyNowItem ? [buyNowItem] : cartSelectedItems;
  const selectedItems = selectedItemsBase;
  const coupon       = useCartStore((s) => s.coupon);
  const couponPct    = useCartStore((s) => s.couponDiscount);
  const applyCoupon  = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const clearCart    = useCartStore((s) => s.clearCart);
  
  // Sheet states
  const [couponSheetOpen, setCouponSheetOpen] = useState(false);
  const [couponSheetClosing, setCouponSheetClosing] = useState(false);
  const [couponConfirmChange, setCouponConfirmChange] = useState(false);

  // Direct input states
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setTimeout(() => {
      const ok = applyCoupon(couponInput.trim());
      if (ok) {
        setCouponInput("");
        setCouponError("");
        setCouponSheetOpen(false); // Close sheet if open (mobile)
      } else {
        setCouponError("ไม่พบรหัสส่วนลดนี้");
      }
      setIsApplying(false);
    }, 400);
  };

  const closeCouponSheet = () => {
    setCouponSheetClosing(true);
    setTimeout(() => { setCouponSheetOpen(false); setCouponSheetClosing(false); setCouponError(""); }, 280);
  };

  useEffect(() => {
    if (couponSheetOpen) {
      const scrollY = window.scrollY || window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
      document.body.setAttribute("data-scroll-y", scrollY.toString());
    } else {
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      document.documentElement.style.removeProperty("overflow");
      if (savedScrollY) {
        const scrollY = parseInt(savedScrollY, 10);
        window.scrollTo(0, scrollY);
        document.body.removeAttribute("data-scroll-y");
      }
    }
    return () => {
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      document.documentElement.style.removeProperty("overflow");
      if (savedScrollY) {
        const scrollY = parseInt(savedScrollY, 10);
        window.scrollTo(0, scrollY);
        document.body.removeAttribute("data-scroll-y");
      }
    };
  }, [couponSheetOpen]);

  const [countdown, setCountdown]   = useState(60);
  const [otp, setOtp]               = useState(["", "", "", "", "", ""]);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const { shippingId, paymentMethod, guestContact, setShippingId, reset } = useCheckoutStore();
  const address = useSelectedAddress();
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const addPoints = useUserStore((s) => s.addPoints);
  const profile = useUserStore((s) => s.profile);
  const savedBanks = useCheckoutStore((s) => s.savedBanks);
  const savedCards = useCheckoutStore((s) => s.savedCards);
  const addresses  = useCheckoutStore((s) => s.addresses);
  const selectAddress = useCheckoutStore((s) => s.selectAddress);
  const taxProfiles = useTaxInvoiceStore((s) => s.profiles);
  const selectedTaxId = useTaxInvoiceStore((s) => s.selectedId);
  const selectTaxProfile = useTaxInvoiceStore((s) => s.selectProfile);

  // Desktop modals
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [tempAddressId, setTempAddressId] = useState<string | null>(null);
  const [tempTaxId, setTempTaxId] = useState<string | null>(null);
  const [tempPayment, setTempPayment] = useState<string>(paymentMethod || "promptpay");

  // Auto-reopen modal after navigating away to add-new
  useEffect(() => {
    const reopen = sessionStorage.getItem("checkoutReopen");
    if (reopen) {
      sessionStorage.removeItem("checkoutReopen");
      if (reopen === "address") { setTempAddressId(null); setAddressModalOpen(true); }
      else if (reopen === "tax") { setTempTaxId(null); setTaxModalOpen(true); }
      else if (reopen === "payment") { setTempPayment(paymentMethod || "promptpay"); setPaymentModalOpen(true); }
    }
  }, []);

  const [giftWrapEnabled, setGiftWrapEnabled] = useState(false);
  const [giftWrapInfoOpen, setGiftWrapInfoOpen] = useState(false);
  const [giftCardInfoOpen, setGiftCardInfoOpen] = useState(false);
  const [giftCardEnabled, setGiftCardEnabled] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [sellerNote, setSellerNote] = useState("");
  const [shippingSheetOpen, setShippingSheetOpen] = useState(false);
  const [giftCardSheetOpen, setGiftCardSheetOpen] = useState(false);
  const [sellerNoteSheetOpen, setSellerNoteSheetOpen] = useState(false);

  const giftWrapTotal  = giftWrapEnabled ? GIFT_WRAP_FEE : 0;
  const giftCardTotal  = (giftCardEnabled && giftMessage.trim()) ? GIFT_CARD_FEE : 0;
  
  const shpOpt     = SHIPPING_OPTIONS.find((o) => o.id === shippingId)!;
  const isFreeShip = subtotal >= FREE_SHIP;
  const shippingTotal = isFreeShip ? 0 : shpOpt.promoFee;
  const shippingOriginal = shpOpt.fee;
  const shippingDiscount = shippingOriginal - shippingTotal;

  const originalSubtotal = selectedItems.reduce((n, i) => n + (i.originalPrice ?? i.price) * i.quantity, 0);
  const productDiscount  = originalSubtotal - subtotal;
  const storeDiscount    = 30; // mock
  const newCustomerDiscount = 50; // mock
  const discountAmt      = coupon ? Math.round(subtotal * couponPct / 100) : 0;
  const totalDiscount    = productDiscount + storeDiscount + newCustomerDiscount + discountAmt;
  const codFee           = paymentMethod === "cod" ? COD_FEE : 0;
  const total            = originalSubtotal + shippingOriginal + giftWrapTotal + giftCardTotal + codFee - totalDiscount - shippingDiscount;
  const earnedPoints     = Math.floor(total / 25);
  const taxData      = taxProfiles.find((p) => p.id === selectedTaxId) ?? null;
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [isVerifying, setIsVerifying] = useState(false);
  const [otpMethod, setOtpMethod]     = useState<"sms" | "email">("sms");
  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    if (!isLoggedIn) { router.replace("/login?redirect=/checkout"); }
  }, [isLoggedIn, router]);

  useEffect(() => {
    setHeaderRightOverride(
      <button
        onClick={() => setConfirmExit(true)}
        className="p-2 text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
      >
        <X size={20} />
      </button>
    );
    return () => setHeaderRightOverride(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // cleared in processOrder instead
   
  }, []);

  useEffect(() => {
    let timer: any;
    if (isVerifying && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isVerifying, countdown]);

  const handleOrder = async () => {
    if (!address) { setError("กรุณาเลือกที่อยู่จัดส่ง"); return; }
    if (!isLoggedIn) {
      if (!guestContact.email || !guestContact.phone) { setError("กรุณากรอกข้อมูลการติดต่อ"); return; }
      setIsVerifying(true);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
      return;
    }
    await processOrder();
  };

  const processOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    
    const orderId = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g, "")}-${Math.floor(Math.random() * 900 + 100)}`;
    
    // Create new order object
    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "shipped", // Start with 'shipped' as per user request
      items: selectedItems.map(item => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        image: item.image,
        price: item.price,
        variant: item.variant,
        quantity: item.quantity,
      })),
      subtotal,
      shippingFee: shippingTotal,
      discount: discountAmt,
      total,
      paymentMethod: PAYMENT_OPTS.find(o => o.id === paymentMethod)?.label ||
                     (savedBanks.find(b => b.id === paymentMethod) ? `บัญชีธนาคาร (${savedBanks.find(b => b.id === paymentMethod)?.accountNo.slice(-4)})` :
                     savedCards.find(c => c.id === paymentMethod) ? `บัตรเครดิต (${savedCards.find(c => c.id === paymentMethod)?.last4})` :
                     paymentMethod),
      recipientName: address ? `${address.firstName} ${address.lastName}` : profile.name,
      phone: address ? address.phone : profile.phone,
      address: address ? `${address.address}, ${address.district}, ${address.province} ${address.postalCode}` : "",
      // Add realistic mock shipping data
      shippingProvider: shpOpt.name,
      trackingNumber: `FE${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Save to stores
    addOrder(newOrder);
    
    // Trigger notification for new order
    useNotificationsStore.getState().addNotification({
      type: "order",
      title: "ยืนยันการสั่งซื้อสำเร็จ",
      body: `เราได้รับคำสั่งซื้อ #${orderId} ของคุณแล้ว และจะรีบดำเนินการจัดส่งให้เร็วที่สุด!`,
      image: newOrder.items[0]?.image,
      href: `/account/orders/${orderId}`,
      orderId: orderId
    });

    addPoints(earnedPoints, `ซื้อสินค้า ${orderId}`);

    if (buyNowItem) { clearBuyNow(); } else { clearCart(); }
    reset();
    router.push(`/order-confirmation?id=${orderId}&total=${total}&method=${paymentMethod}`);
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(""); // Clear error when typing

    if (value && index < 5) otpRefs[index + 1].current?.focus();
    
    if (newOtp.every((d) => d)) {
      if (newOtp.join("") === "123456") {
        setTimeout(() => processOrder(), 500);
      } else {
        setError("รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง");
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs[index - 1].current?.focus();
  };

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-4">
        <p className="text-lg font-medium text-[var(--km-text)]">ไม่มีสินค้าที่เลือก</p>
        <Link href="/cart" className="px-6 py-3 rounded-full bg-[var(--km-text)] text-white text-sm font-medium">กลับตะกร้า</Link>
      </div>
    );
  }

  /* ─── Shared Components for Mobile vs Desktop ─── */
  const AddressSection = () => (
    <div className="flex flex-col gap-3">
      <p className="hidden md:block text-xs font-medium text-[var(--km-text-secondary)] uppercase tracking-wider">ที่อยู่จัดส่ง</p>
      {/* Mobile: navigate */}
      <Link href="/checkout/address" className="flex items-start gap-3 p-4 border-b border-[var(--km-border)] md:hidden">
        <MapPin size={18} className="text-[var(--km-text-muted)] flex-shrink-0 mt-0.5" />
        {address ? (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--km-text)]">{address.firstName} {address.lastName}</p>
            <p className="text-xs text-[var(--km-text-muted)] mt-1 leading-relaxed">{address.phone}<br/>{address.address}, {address.district}, {address.province} {address.postalCode}</p>
          </div>
        ) : (
          <span className="flex-1 text-sm text-[var(--km-text-secondary)]">เพิ่มที่อยู่จัดส่ง</span>
        )}
        <ChevronRight size={16} className="text-[var(--km-text-muted)] flex-shrink-0 mt-0.5" />
      </Link>
      {/* Desktop: open modal */}
      <button onClick={() => { setTempAddressId(null); setAddressModalOpen(true); }} className="hidden md:flex items-start gap-3 p-4 border border-[var(--km-border)] rounded-xl hover:border-[var(--km-text)] transition-all text-left">
        <MapPin size={18} className="text-[var(--km-text-muted)] flex-shrink-0 mt-0.5" />
        {address ? (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--km-text)]">{address.firstName} {address.lastName}</p>
            <p className="text-xs text-[var(--km-text-muted)] mt-1 leading-relaxed">{address.phone}<br/>{address.address}, {address.district}, {address.province} {address.postalCode}</p>
          </div>
        ) : (
          <span className="flex-1 text-sm text-[var(--km-text-secondary)]">เพิ่มที่อยู่จัดส่ง</span>
        )}
        <ChevronRight size={16} className="text-[var(--km-text-muted)] flex-shrink-0 mt-0.5" />
      </button>
    </div>
  );

  const CouponSection = () => (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs font-medium text-[var(--km-text-secondary)] uppercase tracking-wider hidden md:block">โค้ดส่วนลด</p>
      
      <div className="md:hidden">
        {coupon ? (
          <div className="flex items-center gap-3 px-4 py-3.5 bg-white transition-colors w-full text-left border-b border-[var(--km-border)]">
            <TicketPercent size={15} className="flex-shrink-0 text-[var(--km-text-muted)]" />
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm font-normal text-[var(--km-text)]">ใช้โค้ดแล้ว 1 โค้ด</span>
              <span className="text-xs text-[var(--km-success)]">· ส่วนลด ฿{discountAmt.toLocaleString()}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); removeCoupon(); }} className="p-0.5 rounded-full hover:bg-[var(--km-surface)] transition-colors">
              <X size={14} className="text-[var(--km-text-muted)]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCouponSheetOpen(true)}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--km-surface)] transition-colors w-full text-left"
          >
            <TicketPercent size={15} className="flex-shrink-0 text-[var(--km-text-muted)]" />
            <span className="flex-1 text-sm font-normal text-[var(--km-text-secondary)]">ใส่โค้ดส่วนลด</span>
            <ChevronRight size={14} className="text-[var(--km-text-muted)]" />
          </button>
        )}
      </div>

      <div className="hidden md:block">
        {coupon ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[var(--km-border)] rounded-full">
            <TicketPercent size={16} className="flex-shrink-0 text-[var(--km-text-muted)]" />
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm font-normal text-[var(--km-text)]">ใช้โค้ดแล้ว 1 โค้ด</span>
              <span className="text-xs text-[var(--km-success)]">· ส่วนลด ฿{discountAmt.toLocaleString()}</span>
            </div>
            <button onClick={removeCoupon} className="p-1 hover:bg-[var(--km-surface)] rounded-full transition-colors">
              <X size={14} className="text-[var(--km-text-muted)]" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <input
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                placeholder="กรอกโค้ดส่วนลด"
                className={`flex-1 pl-4 pr-16 py-3 border rounded-full outline-none text-sm transition-all ${couponError ? "border-[var(--km-error)]" : "border-[var(--km-border)] focus:border-[var(--km-text)]"}`}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim() || isApplying}
                className="absolute right-1.5 px-3 py-1.5 bg-[var(--km-text)] text-white text-xs font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center min-w-[45px]"
              >
                {isApplying ? <Loader2 size={13} className="animate-spin" /> : "ใช้"}
              </button>
            </div>
            {couponError && <p className="text-xs text-[var(--km-error)] pl-1">{couponError}</p>}
          </div>
        )}
      </div>
    </div>
  );

  const TaxSection = () => (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] font-medium text-[var(--km-text-secondary)] uppercase tracking-wider hidden md:block">ใบกำกับภาษี</p>
      {/* Mobile */}
      <button onClick={() => router.push("/checkout/tax-invoice")} className="md:hidden flex items-start gap-3 p-4 text-left">
        <FileText size={18} className="text-[var(--km-text-muted)] flex-shrink-0 mt-0.5" />
        {taxData ? (
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium text-[var(--km-text)]">{taxData.type === "individual" ? `${taxData.firstName} ${taxData.lastName}` : taxData.companyName}</p>
            <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5 truncate">{taxData.taxId}</p>
          </div>
        ) : (
          <span className="flex-1 text-[15px] text-[var(--km-text-secondary)]">ขอใบกำกับภาษีเต็มรูปแบบ</span>
        )}
        <ChevronRight size={16} className="text-[var(--km-text-muted)] flex-shrink-0 mt-0.5" />
      </button>
      {/* Desktop: modal */}
      <button onClick={() => { setTempTaxId(null); setTaxModalOpen(true); }} className="hidden md:flex items-start gap-3 p-4 border border-[var(--km-border)] rounded-xl hover:border-[var(--km-text)] transition-all text-left">
        <FileText size={18} className="text-[var(--km-text-muted)] flex-shrink-0 mt-0.5" />
        {taxData ? (
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium text-[var(--km-text)]">{taxData.type === "individual" ? `${taxData.firstName} ${taxData.lastName}` : taxData.companyName}</p>
            <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5 truncate">{taxData.taxId}</p>
          </div>
        ) : (
          <span className="flex-1 text-[15px] text-[var(--km-text-secondary)]">ขอใบกำกับภาษีเต็มรูปแบบ</span>
        )}
        <ChevronRight size={16} className="text-[var(--km-text-muted)] flex-shrink-0 mt-0.5" />
      </button>
    </div>
  );

  const PaymentSection = () => {
    let paymentLabel = "เลือกช่องทางการชำระเงิน";
    let paymentRight = "";
    let PaymentIcon = () => <CreditCard size={16} className="text-[var(--km-text-muted)] flex-shrink-0" />;
    
    const bank = savedBanks.find(b => b.id === paymentMethod);
    const card = savedCards.find(c => c.id === paymentMethod);
    const opt = PAYMENT_OPTS.find(o => o.id === paymentMethod);

    if (bank) {
      paymentLabel = THAI_BANKS.find(tb => tb.id === bank.bankId)?.name || "บัญชีธนาคาร";
      paymentRight = `*${bank.accountNo.slice(-4)}`;
      PaymentIcon = () => (
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <BankChip bankId={bank.bankId} size="sm" />
        </div>
      );
    } else if (card) {
      paymentLabel = `บัตรเครดิต ${card.brand ? card.brand.toUpperCase() : ""}`;
      paymentRight = `*${card.last4}`;
      PaymentIcon = () => <CardBrandLogo brand={card.brand} className="w-9 h-6 flex-shrink-0" />;
    } else if (opt) {
      paymentLabel = opt.label;
      PaymentIcon = () => opt.id === "promptpay"
        ? <PromptPayLogo className="w-9 h-6 flex-shrink-0" />
        : <Banknote size={16} className="text-[var(--km-text-secondary)] flex-shrink-0" />;
    }

    const paymentRow = (onClick: () => void, extraClass = "") => (
      <button onClick={onClick} className={`flex items-center gap-3 p-4 text-left ${extraClass}`}>
        <div className="w-6 flex justify-center"><PaymentIcon /></div>
        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <span className="text-sm font-normal text-[var(--km-text)] truncate">{paymentLabel}</span>
          {paymentRight && <span className="text-[13px] font-normal text-[var(--km-text)] flex-shrink-0">{paymentRight}</span>}
        </div>
        <ChevronRight size={15} className="text-[var(--km-text-muted)] flex-shrink-0" />
      </button>
    );

    return (
      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] uppercase tracking-wider hidden md:block">ช่องทางการชำระเงิน</p>
        {/* Mobile */}
        {paymentRow(() => router.push("/checkout/payment"), "md:hidden")}
        {/* Desktop: modal */}
        {paymentRow(() => { setTempPayment(paymentMethod || "promptpay"); setPaymentModalOpen(true); }, "hidden md:flex border border-[var(--km-border)] rounded-xl hover:border-[var(--km-text)] transition-all")}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--km-surface)] pb-10 md:pb-32">
        <div className="max-w-7xl mx-auto px-0 md:px-6 pt-0 md:pt-12">

          {/* Desktop page header */}
          <div className="hidden md:flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] transition-colors text-[var(--km-text)]"
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-base font-medium text-[var(--km-text)]">ยืนยันคำสั่งซื้อ</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* ─── LEFT SIDE ─── */}
            <div className="flex-1 flex flex-col w-full">
              {/* Mobile Address (Top) */}
              <div className="md:hidden bg-white border-b border-[var(--km-border)]">
                <AddressSection />
              </div>

              {/* Product List */}
              <div className="md:bg-white md:border border-[var(--km-border)] md:rounded-2xl overflow-hidden md:shadow-sm mt-4 md:mt-0 bg-white divide-y divide-[var(--km-border)]">
                {selectedItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-4 px-5 py-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="text-[14px] font-semibold text-[#000000] uppercase tracking-normal mb-1">
                          {item.brand}
                        </div>
                        <p className="text-[14px] font-normal text-[var(--km-text-secondary)] leading-snug line-clamp-2">{item.name}</p>
                        <p className="text-xs text-[var(--km-text-muted)] mt-0.5 border border-[var(--km-border)] rounded-full px-2 py-0.5 w-fit">{item.variant}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                          {coupon ? (
                            <>
                              <span className="text-xs text-[#000000] line-through opacity-40">฿{item.price.toLocaleString()}</span>
                              <span className="text-[14px] font-normal" style={{ color: "var(--km-success)" }}>฿{Math.round(item.price * (1 - couponPct / 100)).toLocaleString()}</span>
                            </>
                          ) : (
                            <>
                              {item.originalPrice && (
                                <span className="text-xs text-[#000000] line-through opacity-40">฿{item.originalPrice.toLocaleString()}</span>
                              )}
                              <span className="text-[14px] font-normal text-[#000000]">฿{item.price.toLocaleString()}</span>
                            </>
                          )}
                        </div>
                        <span className="text-xs text-[var(--km-text-muted)]">x{item.quantity}</span>
                      </div>
                    </div>

                    {/* Free gifts — selected only */}
                    {item.freeGifts?.filter((g: any) => g.quantity > 0).map((gift: any) => (
                      <div key={gift.productId} className="flex gap-4 pl-14 pr-5 pb-4">
                        <Link href={`/products/${gift.productId}`} className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
                          <Image src={gift.image} alt={gift.name} fill sizes="80px" className="object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <Link href={`/products/${gift.productId}`}>
                            <p className="text-[14px] font-normal text-[var(--km-text-secondary)] leading-snug line-clamp-2 hover:text-[var(--km-text)] transition-colors">{gift.name}</p>
                          </Link>
                          <span className="text-xs text-white bg-[var(--km-text)] rounded-full px-2 py-0.5 w-fit">ของแถม</span>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="flex items-baseline gap-1">
                            <span className="text-[14px] font-medium text-[var(--km-success)]">ฟรี</span>
                          </div>
                          <span className="text-xs text-[var(--km-text-muted)]">x{gift.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Global Shipping & Gift Options */}
              <div className="md:bg-white md:border border-[var(--km-border)] md:rounded-2xl overflow-hidden md:shadow-sm md:mt-4 bg-white mt-3">
                  <button
                    onClick={() => setShippingSheetOpen(true)}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--km-surface)] transition-colors"
                  >
                    <Truck size={16} className="text-[var(--km-text-muted)] flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-[var(--km-text)]">{shpOpt.name}
                        <span className="ml-2 text-xs font-normal text-[var(--km-text-muted)] tracking-normal uppercase">ได้รับภายใน {shpOpt.eta}</span>
                      </p>
                    </div>
                    <span className="text-sm font-normal text-[#000000]">
                      {shippingTotal === 0 ? "ฟรี" : `฿${shippingTotal}`}
                    </span>
                    <ChevronRight size={15} className="text-[var(--km-text-muted)]" />
                  </button>

                  <div className="w-full flex items-center gap-3 px-5 py-4 border-t border-[var(--km-border)]">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button
                        onClick={() => setGiftWrapEnabled(!giftWrapEnabled)}
                        className="flex items-center gap-3 text-left hover:opacity-70 transition-opacity flex-1 min-w-0"
                      >
                        <Gift size={16} className="text-[var(--km-text-muted)] flex-shrink-0" />
                        <span className="flex items-center gap-1 min-w-0">
                          <span className="text-sm font-normal text-[var(--km-text)] truncate">ห่อของขวัญ</span>
                          <span
                            onClick={(e) => { e.stopPropagation(); setGiftWrapInfoOpen(true); }}
                            className="text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors flex-shrink-0"
                          >
                            <HelpCircle size={14} />
                          </span>
                        </span>
                      </button>
                    </div>
                    <span
                      className="text-sm mr-2 transition-colors flex-shrink-0"
                      style={{ color: giftWrapEnabled ? "var(--km-text)" : "var(--km-text-muted)" }}
                    >
                      +฿{GIFT_WRAP_FEE}
                    </span>
                    <button
                      onClick={() => setGiftWrapEnabled(!giftWrapEnabled)}
                      className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        borderColor: giftWrapEnabled ? "var(--km-text)" : "var(--km-border)",
                        background: giftWrapEnabled ? "var(--km-text)" : "transparent"
                      }}
                    >
                      {giftWrapEnabled && <Check size={11} color="white" strokeWidth={2} />}
                    </button>
                  </div>

                  <div className="w-full flex items-center gap-3 px-5 py-4 border-t border-[var(--km-border)]">
                    <button onClick={() => setGiftCardSheetOpen(true)} className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-70 transition-opacity">
                      <MessageSquare size={16} className="text-[var(--km-text-muted)] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="flex items-center gap-1 min-w-0">
                          <span className="text-sm font-normal text-[var(--km-text)] truncate">การ์ดข้อความ</span>
                          <span
                            onClick={(e) => { e.stopPropagation(); setGiftCardInfoOpen(true); }}
                            className="text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors flex-shrink-0"
                          >
                            <HelpCircle size={14} />
                          </span>
                        </span>
                        {giftMessage && (
                          <p className="text-xs text-[var(--km-text-muted)] truncate mt-0.5">{giftMessage}</p>
                        )}
                      </div>
                    </button>
                    <span className="text-sm mr-2 transition-colors flex-shrink-0" style={{ color: giftCardEnabled ? "var(--km-text)" : "var(--km-text-muted)" }}>+฿{GIFT_CARD_FEE}</span>
                    <button
                      onClick={() => giftCardEnabled ? setGiftCardEnabled(false) : setGiftCardSheetOpen(true)}
                      className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ borderColor: giftCardEnabled ? "var(--km-text)" : "var(--km-border)", background: giftCardEnabled ? "var(--km-text)" : "transparent" }}
                    >
                      {giftCardEnabled && <Check size={11} color="white" strokeWidth={2} />}
                    </button>
                  </div>

                  {/* Seller Note Row */}
                  <div className="w-full flex items-center gap-3 px-5 py-4 border-t border-[var(--km-border)]">
                    <button onClick={() => setSellerNoteSheetOpen(true)} className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-70 transition-opacity">
                      <FileText size={16} className="text-[var(--km-text-muted)] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-normal text-[var(--km-text)]">หมายเหตุถึงผู้ขาย</span>
                        {sellerNote && (
                          <p className="text-xs text-[var(--km-text-muted)] truncate mt-0.5">{sellerNote}</p>
                        )}
                      </div>
                    </button>
                    <ChevronRight size={15} className="text-[var(--km-text-muted)] flex-shrink-0" />
                  </div>
                </div>

              {/* Mobile Coupon, Tax, Payment, Price Summary — one block */}
              {/* Mobile Coupon & Tax */}
              <div className="md:hidden bg-white divide-y divide-[var(--km-border)] mt-3">
                <CouponSection />
                <TaxSection />
              </div>

              {/* Mobile Payment */}
              <div className="md:hidden bg-white mt-3">
                <PaymentSection />
              </div>

              {/* Mobile Price Summary */}
              <div className="md:hidden bg-white mt-3 mb-10">
                <div className="px-4 py-4 flex flex-col gap-3">
                  <SumRow label={`ยอดรวมสินค้า (${selectedItems.length} รายการ)`} value={`฿${originalSubtotal.toLocaleString()}`} />
                  <SumRow label="ค่าจัดส่ง" value={(shippingOriginal as number) === 0 ? "ฟรี" : `฿${shippingOriginal.toLocaleString()}`} />
                  {giftWrapTotal > 0 && <SumRow label="ห่อของขวัญ" value={`฿${giftWrapTotal}`} />}
                  {giftCardTotal > 0 && <SumRow label="การ์ดข้อความ" value={`฿${giftCardTotal}`} />}
                  {paymentMethod === "cod" && COD_FEE > 0 && <SumRow label="ค่าบริการ COD" value={`฿${COD_FEE}`} />}
                  {totalDiscount > 0 && <SumRow label="ส่วนลด" value={`-฿${totalDiscount.toLocaleString()}`} highlight />}
                  {shippingDiscount > 0 && <SumRow label="ส่วนลดค่าจัดส่ง" value={`-฿${shippingDiscount.toLocaleString()}`} highlight />}
                  <SumRow label="คะแนนสะสมที่ได้รับ" value={`+${earnedPoints.toLocaleString()} Point`} />
                </div>
              </div>
            </div>

            {/* ─── RIGHT SIDE (Desktop Action Box) ─── */}
            <aside className="w-full md:w-[420px] md:sticky md:top-24">
              <div className="md:bg-white md:border border-[var(--km-border)] md:rounded-2xl md:p-6 md:shadow-sm flex flex-col gap-6">
                
                {/* Desktop Action Items */}
                <div className="hidden md:flex flex-col gap-6">
                  <AddressSection />
                  <CouponSection />
                  <TaxSection />
                  <PaymentSection />
                  <div className="h-px bg-[var(--km-border)]" />
                </div>

                {/* Price Details (Desktop only — mobile is rendered in left column) */}
                <div className="hidden md:flex flex-col gap-3">
                  <SumRow label={`ยอดรวมสินค้า (${selectedItems.length} รายการ)`} value={`฿${originalSubtotal.toLocaleString()}`} />
                  <SumRow label="ค่าจัดส่ง" value={(shippingOriginal as number) === 0 ? "ฟรี" : `฿${shippingOriginal.toLocaleString()}`} />
                  {giftWrapTotal > 0 && <SumRow label="ห่อของขวัญ" value={`฿${giftWrapTotal}`} />}
                  {giftCardTotal > 0 && <SumRow label="การ์ดข้อความ" value={`฿${giftCardTotal}`} />}
                  {paymentMethod === "cod" && COD_FEE > 0 && <SumRow label="ค่าบริการ COD" value={`฿${COD_FEE}`} />}
                  {totalDiscount > 0 && <SumRow label="ส่วนลด" value={`-฿${totalDiscount.toLocaleString()}`} highlight />}
                  {shippingDiscount > 0 && <SumRow label="ส่วนลดค่าจัดส่ง" value={`-฿${shippingDiscount.toLocaleString()}`} highlight />}
                  <SumRow label="คะแนนสะสมที่ได้รับ" value={`+${earnedPoints.toLocaleString()} Point`} />
                </div>

                <div className="hidden md:block h-px bg-[var(--km-border)]" />

                <div className="hidden md:flex justify-between items-end">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[var(--km-text-secondary)]">ยอดรวมทั้งสิ้น</span>
                    <span className="text-xs text-[var(--km-text-muted)]">รวมภาษีมูลค่าเพิ่มแล้ว</span>
                  </div>
                  <span className="text-lg font-semibold text-[var(--km-text)]">฿{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={processing}
                  className="hidden md:flex w-full py-3.5 rounded-full text-sm font-medium transition-all active:scale-[0.98] items-center justify-center gap-2"
                  style={{ background: processing ? "var(--km-text-muted)" : "var(--km-text)", color: "white" }}
                >
                  {processing ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> กำลังสั่งซื้อ...</>
                  ) : "ยืนยันการสั่งซื้อ"}
                </button>

              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* ─── Mobile Sticky Bottom Bar ─── */}
      <div
        className="md:hidden fixed left-0 right-0 bg-white border-t border-[var(--km-border)] z-[810]"
        style={{ bottom: 0, paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center gap-4 px-4 py-3.5 max-w-2xl mx-auto">
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs text-[var(--km-text-muted)]">ยอดชำระทั้งหมด</span>
            <span className="text-lg font-medium text-[var(--km-text)]">฿{total.toLocaleString()}</span>
          </div>
          <button
            onClick={handleOrder}
            disabled={processing}
            className="px-6 py-3.5 rounded-full text-white text-sm font-medium transition-all disabled:opacity-70 flex items-center gap-2"
            style={{ background: processing ? "var(--km-text-muted)" : "var(--km-text)" }}
          >
            {processing ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> กำลังประมวลผล...</>
            ) : "สั่งซื้อเลย"}
          </button>
        </div>
      </div>

      {/* ─── Mobile Coupon Mini Sheet ─── */}
      {couponSheetOpen && (
        <>
          <div
            className="fixed inset-0 z-[1000] bg-black/40 transition-opacity duration-300"
            style={{ opacity: couponSheetClosing ? 0 : 1 }}
            onClick={closeCouponSheet}
          />
          <div
            className="fixed inset-x-0 bottom-0 z-[1010] bg-white rounded-t-2xl px-5 pt-5 pb-[max(24px,env(safe-area-inset-bottom))]"
            style={{ animation: `${couponSheetClosing ? "slideDownSheet" : "slideUpSheet"} 0.28s cubic-bezier(0.32,0.72,0,1) both` }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-[var(--km-text)]">ใส่โค้ดส่วนลด</p>
              <button onClick={closeCouponSheet} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] transition-colors">
                <X size={16} className="text-[var(--km-text-muted)]" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  autoFocus
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="กรอกโค้ดส่วนลดที่นี่"
                  className={`w-full px-4 py-3.5 text-sm border rounded-full outline-none transition-colors uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--km-text-muted)] ${couponError ? "border-[var(--km-error)]" : "border-[var(--km-border)]"}`}
                />
              </div>
              {couponError && <p className="text-xs text-[var(--km-error)] mt-1">{couponError}</p>}
              <button
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim() || isApplying}
                className="w-full mt-3 py-3.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center min-h-[48px]"
              >
                {isApplying ? <Loader2 size={18} className="animate-spin" /> : "ใช้โค้ดส่วนลด"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Confirm Change Coupon ─── */}
      {couponConfirmChange && (
        <>
          <div className="fixed inset-0 z-[1000] bg-black/40" onClick={() => setCouponConfirmChange(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[1010] bg-white rounded-2xl p-6 shadow-xl">
            <p className="text-sm font-medium text-[var(--km-text)] mb-1">เปลี่ยนโค้ดส่วนลด?</p>
            <p className="text-xs text-[var(--km-text-muted)] mb-5">โค้ดปัจจุบันจะถูกลบออก และคุณสามารถใส่โค้ดใหม่ได้ทันที</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCouponConfirmChange(false)}
                className="flex-1 py-2.5 rounded-full border border-[var(--km-border)] text-sm text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => { removeCoupon(); setCouponConfirmChange(false); setCouponSheetOpen(true); }}
                className="flex-1 py-2.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                เปลี่ยนโค้ด
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Shipping Sheet ─── */}
      <ShippingSheet
        current={shippingId}
        onSelect={setShippingId}
        onClose={() => setShippingSheetOpen(false)}
        open={shippingSheetOpen}
        isFreeShip={isFreeShip}
      />

      <NoteSheet
        open={giftCardSheetOpen}
        title="ข้อความในการ์ด"
        placeholder="เขียนข้อความถึงผู้รับ..."
        draft={giftMessage}
        onClose={() => setGiftCardSheetOpen(false)}
        onConfirm={(msg) => { setGiftMessage(msg); setGiftCardEnabled(msg.trim().length > 0); }}
      />

      <NoteSheet
        open={sellerNoteSheetOpen}
        title="หมายเหตุถึงผู้ขาย"
        placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)..."
        draft={sellerNote}
        onClose={() => setSellerNoteSheetOpen(false)}
        onConfirm={(msg) => setSellerNote(msg)}
      />

      <ConfirmDialog
        open={confirmExit}
        title="ออกจากการสั่งซื้อ?"
        description="ข้อมูลที่กรอกไว้จะยังคงอยู่ แต่คุณจะถูกพาออกจากหน้านี้"
        confirmLabel="ออกไป"
        cancelLabel="อยู่ต่อ"
        onConfirm={() => { setConfirmExit(false); router.push("/"); }}
        onCancel={() => setConfirmExit(false)}
      />

      {/* ─── OTP Verification Overlay (Consistent with LoginClient) ─── */}
      {isVerifying && (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[var(--km-border)] px-4 h-14 flex items-center justify-between">
            <button onClick={() => setIsVerifying(false)} className="p-1 -ml-1">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-base font-semibold">ยืนยันรหัส OTP</h1>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col">
            <p className="text-sm text-[var(--km-text-secondary)] mb-8">
              ส่งรหัสไปยัง{otpMethod === "sms" ? "เบอร์โทรศัพท์" : "อีเมล"}{" "}
              {otpMethod === "sms" 
                ? `${guestContact.phone.slice(0,3)}-xxx-${guestContact.phone.slice(-4)}`
                : guestContact.email}
              <span className="text-[var(--km-text-muted)] ml-1">(OTP: 123456)</span>
            </p>

            <div className="flex gap-2 w-full mb-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="flex-1 min-w-0 h-14 text-center text-xl font-medium border rounded-lg outline-none transition-colors"
                  style={{ borderColor: error ? "var(--km-error)" : digit ? "var(--km-text)" : "var(--km-border)" }}
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-[var(--km-error)] mb-3 text-left w-full">
                {error}
              </p>
            )}

            <div className="text-center text-sm mt-4">
              <p className="text-[var(--km-text-muted)]">
                ไม่ได้รับรหัส? ส่งรหัสใหม่{" "}
                {countdown > 0 ? (
                  <span className="font-medium text-[var(--km-text)]">{countdown} วินาที</span>
                ) : (
                  <button
                    onClick={() => { setOtp(["", "", "", "", "", ""]); setCountdown(60); setTimeout(() => otpRefs[0].current?.focus(), 50); }}
                    className="font-medium text-[var(--km-text)] underline"
                  >
                    ส่งอีกครั้ง
                  </button>
                )}
              </p>
            </div>

            <button 
              onClick={() => {
                setOtpMethod(otpMethod === "sms" ? "email" : "sms");
                setOtp(["", "", "", "", "", ""]);
                setTimeout(() => otpRefs[0].current?.focus(), 50);
              }}
              className="mt-10 text-sm text-[var(--km-text-secondary)] underline decoration-dotted underline-offset-4 text-center"
            >
              เปลี่ยนไปส่ง OTP เข้า{otpMethod === "sms" ? "อีเมล" : "เบอร์โทรศัพท์"}แทน
            </button>
          </div>

          <div className="p-4 border-t border-[var(--km-border)]">
            <button 
              onClick={() => {
                if (otp.join("") === "123456") {
                  processOrder();
                } else {
                  setError("รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง");
                }
              }}
              disabled={otp.some(d => !d) || processing}
              className="w-full py-3.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium disabled:opacity-40 transition-opacity"
            >
              {processing ? "กำลังประมวลผล..." : "ยืนยัน"}
            </button>
          </div>
        </div>
      )}
      {/* Gift Wrap Information Sheet */}
      <BottomSheet
        isOpen={giftWrapInfoOpen}
        onClose={() => setGiftWrapInfoOpen(false)}
        title="รายละเอียดบริการห่อของขวัญ"
      >
        <div className="flex flex-col px-5 pt-2 pb-8 gap-5 text-sm text-[var(--km-text-secondary)] leading-relaxed">

          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-[var(--km-text-secondary)]">เพิ่มความพิเศษและสร้างความประทับใจให้คนพิเศษด้วยบริการห่อของขวัญคุณภาพเยี่ยมจาก SafeScreen Tech:</p>

            <ul className="list-disc pl-5 flex flex-col gap-2 text-[13px] text-[var(--km-text-secondary)]">
              <li>ห่ออย่างประณีตด้วยกระดาษห่อของขวัญลวดลายดีไซน์พิเศษจากคอลเลกชันของเรา</li>
              <li>ตกแต่งเรียบร้อยสวยงาม เหมาะกับของขวัญสำหรับส่งมอบในทุกโอกาสพิเศษ</li>
              <li>ขนาดกล่องของขวัญจะจัดสรรตามความเหมาะสมของขนาดและจำนวนสินค้าในออเดอร์โดยอัตโนมัติ</li>
            </ul>

          </div>
        </div>
      </BottomSheet>

      {/* Gift Card Information Sheet */}
      <BottomSheet
        isOpen={giftCardInfoOpen}
        onClose={() => setGiftCardInfoOpen(false)}
        title="รายละเอียดการ์ดข้อความ"
      >
        <div className="flex flex-col px-5 pt-2 pb-8 gap-5 text-sm text-[var(--km-text-secondary)] leading-relaxed">
          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-[var(--km-text-secondary)]">เพิ่มความประทับใจด้วยการ์ดข้อความสุดพิเศษสำหรับคนที่คุณห่วงใย:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-[13px] text-[var(--km-text-secondary)]">
              <li>การ์ดข้อความพิมพ์ด้วยตัวอักษรสวยงาม พร้อมจัดส่งพร้อมสินค้า</li>
              <li>รองรับข้อความภาษาไทยและภาษาอังกฤษ</li>
              <li>เหมาะสำหรับทุกโอกาสพิเศษ ไม่ว่าจะเป็นวันเกิด วันครบรอบ หรือเทศกาลสำคัญ</li>
            </ul>
          </div>
        </div>
      </BottomSheet>

      {/* ─── Desktop: Address Modal ─── */}
      {typeof document !== "undefined" && addressModalOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[900] bg-black/40" onClick={() => setAddressModalOpen(false)} />
          <div className="fixed inset-0 z-[910] hidden md:flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--km-border)]">
                <h2 className="text-base font-medium text-[var(--km-text)]">ที่อยู่จัดส่ง</h2>
                <button onClick={() => setAddressModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)]"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[var(--km-border)]">
                {addresses.map(addr => {
                  const isSelected = (tempAddressId ?? addresses.find(a => a.isDefault)?.id ?? addresses[0]?.id) === addr.id;
                  return (
                    <button key={addr.id} onClick={() => setTempAddressId(addr.id)}
                      className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-[var(--km-surface)] transition-colors">
                      <div className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                        style={{ borderColor: isSelected ? "var(--km-success)" : "var(--km-border)", background: isSelected ? "var(--km-success)" : "transparent" }}>
                        {isSelected && <Check size={11} color="white" strokeWidth={2.5} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--km-text)]">{addr.firstName} {addr.lastName}</p>
                        <p className="text-xs text-[var(--km-text-muted)] mt-0.5 leading-relaxed">{addr.phone}<br/>{addr.address}, {addr.province} {addr.postalCode}</p>
                      </div>
                    </button>
                  );
                })}
                <button onClick={() => { sessionStorage.setItem("checkoutReopen", "address"); router.push("/checkout/address?add=true"); setAddressModalOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors">
                  <Plus size={16} />
                  <span className="text-sm font-medium">เพิ่มที่อยู่ใหม่</span>
                </button>
              </div>
              <div className="px-5 py-4 border-t border-[var(--km-border)]">
                <button onClick={() => { if (tempAddressId) selectAddress(tempAddressId); setAddressModalOpen(false); }}
                  disabled={!tempAddressId && addresses.length === 0}
                  className="w-full py-3 rounded-full text-white text-sm font-medium transition-all disabled:opacity-40"
                  style={{ background: "var(--km-text)" }}>ยืนยัน</button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ─── Desktop: Tax Modal ─── */}
      {typeof document !== "undefined" && taxModalOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[900] bg-black/40" onClick={() => setTaxModalOpen(false)} />
          <div className="fixed inset-0 z-[910] hidden md:flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--km-border)]">
                <h2 className="text-base font-medium text-[var(--km-text)]">ใบกำกับภาษี</h2>
                <button onClick={() => setTaxModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)]"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[var(--km-border)]">
                {taxProfiles.map(p => {
                  const isSelected = (tempTaxId ?? selectedTaxId) === p.id;
                  return (
                    <button key={p.id} onClick={() => setTempTaxId(p.id)}
                      className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-[var(--km-surface)] transition-colors">
                      <div className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                        style={{ borderColor: isSelected ? "var(--km-success)" : "var(--km-border)", background: isSelected ? "var(--km-success)" : "transparent" }}>
                        {isSelected && <Check size={11} color="white" strokeWidth={2.5} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--km-text)]">{p.type === "individual" ? `${p.firstName} ${p.lastName}` : p.companyName}</p>
                        <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{p.taxId}</p>
                      </div>
                    </button>
                  );
                })}
                <button onClick={() => { sessionStorage.setItem("checkoutReopen", "tax"); router.push("/checkout/tax-invoice?add=true"); setTaxModalOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors">
                  <Plus size={16} />
                  <span className="text-sm font-medium">เพิ่มข้อมูลใบกำกับภาษีใหม่</span>
                </button>
              </div>
              <div className="px-5 py-4 border-t border-[var(--km-border)]">
                <button onClick={() => { if (tempTaxId) selectTaxProfile(tempTaxId); setTaxModalOpen(false); }}
                  disabled={!tempTaxId && taxProfiles.length === 0}
                  className="w-full py-3 rounded-full text-white text-sm font-medium transition-all disabled:opacity-40"
                  style={{ background: "var(--km-text)" }}>ยืนยัน</button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ─── Desktop: Payment Modal ─── */}
      {typeof document !== "undefined" && paymentModalOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[900] bg-black/40" onClick={() => setPaymentModalOpen(false)} />
          <div className="fixed inset-0 z-[910] hidden md:flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--km-border)]">
                <h2 className="text-base font-medium text-[var(--km-text)]">ช่องทางการชำระเงิน</h2>
                <button onClick={() => setPaymentModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--km-surface)] text-[var(--km-text-muted)]"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[var(--km-border)]">
                {/* Saved banks */}
                {savedBanks.map(bank => {
                  const active = tempPayment === bank.id;
                  return (
                    <button key={bank.id} onClick={() => setTempPayment(bank.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--km-surface)] transition-colors text-left">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"><BankChip bankId={bank.bankId} size="sm" /></div>
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-3 pr-2">
                        <span className="text-[15px] font-normal text-[var(--km-text)] truncate">{THAI_BANKS.find(b => b.id === bank.bankId)?.name || "บัญชีธนาคาร"}</span>
                        <span className="text-[14px] font-normal text-[var(--km-text)] flex-shrink-0">*{bank.accountNo.slice(-4)}</span>
                      </div>
                      {active && <Check size={18} strokeWidth={2.5} className="text-[var(--km-text)] flex-shrink-0" />}
                    </button>
                  );
                })}
                {savedBanks.length < 3 && (
                  <button onClick={() => { sessionStorage.setItem("checkoutReopen", "payment"); router.push("/checkout/payment/add-bank"); setPaymentModalOpen(false); }}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--km-surface)] transition-colors text-left">
                    <div className="w-8 h-8 rounded-lg bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0"><Plus size={16} className="text-[var(--km-text-secondary)]" /></div>
                    <span className="text-[15px] font-normal text-[var(--km-text)]">เพิ่มบัญชีธนาคาร</span>
                    <ChevronRight size={18} className="text-[var(--km-text-muted)] ml-auto" />
                  </button>
                )}
                {/* Saved cards */}
                {savedCards.map(card => {
                  const active = tempPayment === card.id;
                  return (
                    <button key={card.id} onClick={() => setTempPayment(card.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--km-surface)] transition-colors text-left">
                      <div className="w-10 h-7 flex items-center justify-center flex-shrink-0"><CardBrandLogo brand={card.brand} className="w-10 h-7 rounded object-contain" /></div>
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-3 pr-2">
                        <span className="text-[15px] font-normal text-[var(--km-text)] truncate">บัตรเครดิต {card.brand?.toUpperCase()}</span>
                        <span className="text-[14px] font-normal text-[var(--km-text)] flex-shrink-0">*{card.last4}</span>
                      </div>
                      {active && <Check size={18} strokeWidth={2.5} className="text-[var(--km-text)] flex-shrink-0" />}
                    </button>
                  );
                })}
                {savedCards.length < 3 && (
                  <button onClick={() => { sessionStorage.setItem("checkoutReopen", "payment"); router.push("/checkout/payment/add-card"); setPaymentModalOpen(false); }}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--km-surface)] transition-colors text-left">
                    <div className="w-8 h-8 rounded-lg bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0"><Plus size={16} className="text-[var(--km-text-secondary)]" /></div>
                    <span className="text-[15px] font-normal text-[var(--km-text)]">เพิ่มบัตรเครดิต / เดบิต</span>
                    <ChevronRight size={18} className="text-[var(--km-text-muted)] ml-auto" />
                  </button>
                )}
                {/* Promptpay & COD */}
                {[{ id: "promptpay", label: "พร้อมเพย์" }, { id: "cod", label: "เก็บเงินปลายทาง" }].map(({ id, label }) => {
                  const active = tempPayment === id;
                  return (
                    <button key={id} onClick={() => setTempPayment(id)}
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--km-surface)] transition-colors text-left">
                      <div className="w-10 h-7 flex items-center justify-center flex-shrink-0">
                        {id === "promptpay" ? <PromptPayLogo className="w-10 h-7 rounded" /> : <Banknote size={20} className="text-[var(--km-text-secondary)]" />}
                      </div>
                      <span className="flex-1 text-[15px] font-normal text-[var(--km-text)]">{label}</span>
                      {active && <Check size={18} strokeWidth={2.5} className="text-[var(--km-text)] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="px-5 py-4 border-t border-[var(--km-border)]">
                <button onClick={() => { setPaymentMethod(tempPayment as any); setPaymentModalOpen(false); }}
                  className="w-full py-3 rounded-full text-white text-sm font-medium transition-all"
                  style={{ background: "var(--km-text)" }}>ยืนยัน</button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

    </>
  );
}


function SumRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--km-text-secondary)]">{label}</span>
      <span style={{ color: highlight ? "var(--km-success)" : "var(--km-text)", fontWeight: highlight ? 500 : 400 }}>{value}</span>
    </div>
  );
}
