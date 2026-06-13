"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ChevronRight, X, ImageIcon, CreditCard, ChevronDown, Plus } from "lucide-react";
import { useOrdersStore } from "@/stores/orders.store";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";

/* ─── Reasons by status ─── */
const REASONS_DELIVERED = [
  { id: "not_received",  label: "ได้รับสินค้าไม่ครบ / ยังไม่ได้รับพัสดุ",  desc: "ตรวจสอบพัสดุแล้วพบว่าสินค้าขาดหายหรือยังไม่ได้รับสินค้าเลย" },
  { id: "damaged",       label: "ได้รับสินค้าเสียหาย / สภาพไม่ดี",          desc: "บรรจุภัณฑ์แตกหัก สินค้าชำรุด หรือสภาพไม่เป็นที่น่าพอใจ" },
  { id: "wrong_item",    label: "ผู้ขายส่งสินค้าผิด",                        desc: "สินค้าที่ได้รับไม่ตรงกับที่สั่ง เช่น ผิดรุ่น ผิดสี ผิดขนาด" },
  { id: "edit_order",    label: "ต้องการแก้ไขข้อมูลคำสั่งซื้อ",             desc: "ต้องการเปลี่ยนที่อยู่จัดส่ง หรือแก้ไขรายการสินค้า" },
  { id: "late",          label: "จัดส่งช้าเกินไป",                           desc: "สินค้าถึงมือช้ากว่ากำหนดจนไม่สะดวกใช้งานหรือพลาดโอกาสแล้ว" },
  { id: "other",         label: "อื่นๆ",                                     desc: "ปัญหาอื่นที่ไม่อยู่ในรายการด้านบน โปรดระบุในช่องหมายเหตุ" },
];

const REASONS_SHIPPED = [
  { id: "edit_address",  label: "ต้องการแก้ไขที่อยู่จัดส่ง",               desc: "ระบุที่อยู่ผิด หรือต้องการเปลี่ยนสถานที่จัดส่งก่อนพัสดุถึงมือ" },
  { id: "cancel",        label: "ต้องการยกเลิกคำสั่งซื้อ",                  desc: "เปลี่ยนใจไม่ต้องการสินค้าแล้ว หรือสั่งซื้อซ้ำโดยไม่ตั้งใจ" },
  { id: "not_received",  label: "ยังไม่ได้รับพัสดุ / ค้างในระบบ",          desc: "พัสดุค้างในระบบขนส่งนานผิดปกติและไม่มีการอัปเดตสถานะ" },
  { id: "other",         label: "อื่นๆ",                                     desc: "ปัญหาอื่นที่ไม่อยู่ในรายการด้านบน โปรดระบุในช่องหมายเหตุ" },
];

const THAI_BANKS: Record<string, { name: string; color: string; abbr: string }> = {
  kbank:  { name: "ธนาคารกสิกรไทย",            color: "#138F2D", abbr: "KBANK" },
  scb:    { name: "ธนาคารไทยพาณิชย์",           color: "#4E2E8B", abbr: "SCB"   },
  bbl:    { name: "ธนาคารกรุงเทพ",              color: "#1E4598", abbr: "BBL"   },
  ktb:    { name: "ธนาคารกรุงไทย",              color: "#1BA5E1", abbr: "KTB"   },
  bay:    { name: "ธนาคารกรุงศรีอยุธยา",        color: "#FEC43B", abbr: "BAY"   },
  ttb:    { name: "ธนาคารทหารไทยธนชาต",        color: "#0066B3", abbr: "TTB"   },
  gsb:    { name: "ธนาคารออมสิน",               color: "#EB198D", abbr: "GSB"   },
  baac:   { name: "ธ.ก.ส.",                      color: "#4B9B1F", abbr: "BAAC"  },
  ghb:    { name: "ธนาคารอาคารสงเคราะห์",       color: "#F47920", abbr: "GHB"   },
  uob:    { name: "ธนาคาร UOB",                 color: "#0F4EA1", abbr: "UOB"   },
  cimb:   { name: "ธนาคาร CIMB Thai",           color: "#C8161D", abbr: "CIMB"  },
  lhb:    { name: "ธนาคารแลนด์ แอนด์ เฮ้าส์",  color: "#6D28D9", abbr: "LHB"   },
  ibank:  { name: "ธนาคารอิสลามแห่งประเทศไทย", color: "#4D6B2B", abbr: "IBANK" },
};

function BankChip({ bankId }: { bankId: string }) {
  const bank = THAI_BANKS[bankId];
  if (!bank) return <div className="w-10 h-7 rounded bg-[var(--km-border)]" />;
  return (
    <div
      className="w-10 h-7 rounded flex items-center justify-center font-medium text-xs text-white flex-shrink-0"
      style={{ background: bank.color }}
    >
      {bank.abbr}
    </div>
  );
}

type RefundMethod =
  | { id: string; type: "card"; brand: string; last4: string; name: string }
  | { id: string; type: "bank"; bankId: string; accountNo: string; name: string };

const MOCK_REFUND_METHODS: RefundMethod[] = [
  { id: "c1", type: "card", brand: "visa",  last4: "4242", name: "THANID O." },
  { id: "c2", type: "card", brand: "mc",    last4: "5353", name: "THANID O." },
  { id: "b1", type: "bank", bankId: "kbank", accountNo: "xxx-x-xx123-x", name: "ธนิด อ." },
];

function RefundMethodLabel({ m }: { m: RefundMethod }) {
  const last4 = m.type === "card" ? m.last4 : m.accountNo.slice(-4);
  const chip  = m.type === "card"
    ? <div className="w-10 h-7 rounded border border-[var(--km-border)] bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0"><CreditCard size={14} strokeWidth={1.5} className="text-[var(--km-text-secondary)]" /></div>
    : <BankChip bankId={m.bankId} />;
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {chip}
      <span className="text-[13px] text-[var(--km-text)] truncate">{m.name} (••••{last4})</span>
    </div>
  );
}

type MediaFile = { id: string; url: string };

export default function ReturnPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const getOrder              = useOrdersStore((s) => s.getOrder);
  const submitReturn          = useOrdersStore((s) => s.submitReturn);
  const order                 = getOrder(id);
  const authEmail             = useAuthStore((s) => s.email);
  const setHeaderBackOverride = useUIStore((s) => s.setHeaderBackOverride);
  const setHeaderTitle        = useUIStore((s) => s.setHeaderTitleOverride);

  const [step, setStep]               = useState<1 | 2 | 3>(1);
  const [maxStepReached, setMaxStepReached] = useState<1 | 2 | 3>(1);
  const [reason, setReason]           = useState<typeof REASONS_DELIVERED[0] | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [note, setNote]               = useState("");
  const [media, setMedia]             = useState<MediaFile[]>([]);
  const [refundMethod, setRefundMethod] = useState("");
  const [email, setEmail]             = useState(authEmail || "thanid@example.com");
  const [emailDraft, setEmailDraft]   = useState(email);
  const [showEmailSheet, setShowEmailSheet] = useState(false);
  const [phone, setPhone]             = useState(order?.phone || "");
  const [phoneDraft, setPhoneDraft]   = useState(phone);
  const [showPhoneSheet, setShowPhoneSheet] = useState(false);
  const [subView, setSubView]         = useState<"refund-method" | null>(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const returnableItems = order?.items.filter((i) => !i.isFree) ?? [];

  useEffect(() => {
    window.scrollTo(0, 0);
    setMaxStepReached((prev) => Math.max(prev, step) as 1 | 2 | 3);
    setHeaderTitle(subView === "refund-method" ? "เลือกช่องทางรับเงินคืน" : null);
    setHeaderBackOverride(() => {
      if (subView === "refund-method") { setSubView(null); return; }
      if (step === 1) router.back();
      else if (step === 2) setStep(1);
      else setStep(returnableItems.length <= 1 ? 1 : 2);
    });
    return () => { setHeaderBackOverride(null); setHeaderTitle(null); };
  }, [step, subView, submitted]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!order || (order.status !== "delivered" && order.status !== "shipped")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-[var(--km-text-muted)]">ไม่พบคำสั่งซื้อ</p>
      </div>
    );
  }

  const reasons = order.status === "shipped" ? REASONS_SHIPPED : REASONS_DELIVERED;

  const toggleItem = (pid: string) =>
    setSelectedItems((prev) => prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]);

  const handleStep1Next = () => {
    if (!reason) return;
    if (returnableItems.length <= 1) {
      setSelectedItems(returnableItems.map((i) => i.productId));
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleStep2Next = () => {
    if (selectedItems.length === 0) return;
    setStep(3);
  };

  const handleSubmit = () => {
    submitReturn(id, selectedItems);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).slice(0, 5 - media.length).forEach((file) => {
      setMedia((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, url: URL.createObjectURL(file) }]);
    });
    e.target.value = "";
  };

  /* ══════════════════════════════════════════
     SUB-VIEW — เลือกช่องทางรับเงินคืน
  ══════════════════════════════════════════ */
  if (subView === "refund-method") {
    const banks = MOCK_REFUND_METHODS.filter((m) => m.type === "bank");
    const cards = MOCK_REFUND_METHODS.filter((m) => m.type === "card");
    return (
      <div className="bg-[var(--km-surface)] min-h-screen pb-24 px-4">

        {/* บัญชีธนาคาร */}
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-3 pt-5 px-1">บัญชีธนาคาร</p>
        <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          {banks.map((m) => (
            <button
              key={m.id}
              onClick={() => { setRefundMethod(m.id); setSubView(null); }}
              className="w-full px-4 py-4 flex items-center gap-3 active:bg-[var(--km-surface)] transition-colors"
            >
              {m.type === "bank" && <BankChip bankId={m.bankId} />}
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[13px] font-normal text-[var(--km-text)] truncate">{m.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[13px] text-[var(--km-text-secondary)] tabular-nums">
                    {m.type === "bank" ? `•••• ${m.accountNo.slice(-4)}` : ""}
                  </span>
                  {refundMethod === m.id
                    ? <Check size={15} strokeWidth={2} className="text-[var(--km-success)]" />
                    : <div className="w-4 h-4" />
                  }
                </div>
              </div>
            </button>
          ))}
          <button
            className="w-full flex items-center gap-3 px-4 py-4 text-[var(--km-text-secondary)] active:bg-[var(--km-surface)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-dashed border-[var(--km-border)] flex items-center justify-center flex-shrink-0">
              <Plus size={14} />
            </div>
            <span className="text-[13px] font-medium">เพิ่มบัญชีธนาคาร</span>
          </button>
        </div>

        {/* บัตรเครดิต / เดบิต */}
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-3 pt-5 px-1">บัตรเครดิต / เดบิต</p>
        <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          {cards.map((m) => (
            <button
              key={m.id}
              onClick={() => { setRefundMethod(m.id); setSubView(null); }}
              className="w-full px-4 py-4 flex items-center gap-3 active:bg-[var(--km-surface)] transition-colors"
            >
              <div className="w-10 h-7 rounded border border-[var(--km-border)] bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0">
                <CreditCard size={14} strokeWidth={1.5} className="text-[var(--km-text-secondary)]" />
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[13px] font-normal text-[var(--km-text)] truncate">{m.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[13px] text-[var(--km-text-secondary)] tabular-nums">
                    {m.type === "card" ? `•••• ${m.last4}` : ""}
                  </span>
                  {refundMethod === m.id
                    ? <Check size={15} strokeWidth={2} className="text-[var(--km-success)]" />
                    : <div className="w-4 h-4" />
                  }
                </div>
              </div>
            </button>
          ))}
          <button
            className="w-full flex items-center gap-3 px-4 py-4 text-[var(--km-text-secondary)] active:bg-[var(--km-surface)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-dashed border-[var(--km-border)] flex items-center justify-center flex-shrink-0">
              <Plus size={14} />
            </div>
            <span className="text-[13px] font-medium">เพิ่มบัตรใหม่</span>
          </button>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--km-success) 12%, transparent)" }}>
          <Check size={32} strokeWidth={2} style={{ color: "var(--km-success)" }} />
        </div>
        <div>
          <p className="text-lg font-medium text-[var(--km-text)]">ส่งคำขอคืนสินค้าแล้ว</p>
          <p className="text-sm text-[var(--km-text-muted)] mt-1">ทีมงานจะติดต่อกลับภายใน 1–3 วันทำการ</p>
        </div>
        <button
          onClick={() => router.push(`/account/orders/${id}`)}
          className="mt-2 px-6 py-2.5 rounded-full bg-[var(--km-text)] text-white text-sm font-medium"
        >
          กลับสู่คำสั่งซื้อ
        </button>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     STEP 1 — เลือกเหตุผล
  ══════════════════════════════════════════ */
  if (step === 1) return (
    <>
      <div className="pb-32 pt-4">
<p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-3">โปรดเลือกเหตุผลในการขอคืนเงิน</p>
        <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          {reasons.map((r) => (
            <button
              key={r.id}
              onClick={() => setReason(r)}
              className="flex items-start gap-3 w-full px-4 py-4 text-left transition-colors active:bg-[var(--km-surface)]"
            >
              <div className="flex-1 min-w-0 mt-0.5">
                <p className="text-[13px] font-medium" style={{ color: reason?.id === r.id ? "var(--km-text)" : "var(--km-text-secondary)" }}>
                  {r.label}
                </p>
                <p className="text-xs text-[var(--km-text-muted)] mt-0.5 leading-relaxed">{r.desc}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={{
                  borderColor: reason?.id === r.id ? "var(--km-text)" : "var(--km-border-strong)",
                  background:  reason?.id === r.id ? "var(--km-text)" : "transparent",
                }}
              >
                {reason?.id === r.id && <Check size={11} color="white" strokeWidth={2.5} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[var(--km-border)] px-4 pt-3 z-[810]"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <button
          onClick={handleStep1Next}
          disabled={!reason}
          className="w-full h-12 rounded-xl text-sm font-medium transition-all"
          style={{ background: reason ? "var(--km-text)" : "var(--km-border)", color: reason ? "white" : "var(--km-text-muted)" }}
        >
          {maxStepReached >= 3 ? "บันทึก" : "ถัดไป"}
        </button>
      </div>
    </>
  );

  /* ══════════════════════════════════════════
     STEP 2 — เลือกสินค้า
  ══════════════════════════════════════════ */
  if (step === 2) return (
    <>
      <div className="pb-32 pt-4">
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-3">เลือกสินค้าที่ต้องการขอคืน</p>
        <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          {returnableItems.map((item) => {
            const sel = selectedItems.includes(item.productId);
            return (
              <button
                key={item.productId}
                onClick={() => toggleItem(item.productId)}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-left transition-colors active:bg-[var(--km-surface)]"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--km-text)] line-clamp-2 leading-snug">{item.name}</p>
                  <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{item.variant} · x{item.quantity}</p>
                </div>
                <div
                  className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ borderColor: sel ? "var(--km-text)" : "var(--km-border-strong)", background: sel ? "var(--km-text)" : "transparent" }}
                >
                  {sel && <Check size={11} color="white" strokeWidth={2.5} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[var(--km-border)] px-4 pt-3 z-[810]"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <button
          onClick={handleStep2Next}
          disabled={selectedItems.length === 0}
          className="w-full h-12 rounded-xl text-sm font-medium transition-all"
          style={{ background: selectedItems.length > 0 ? "var(--km-text)" : "var(--km-border)", color: selectedItems.length > 0 ? "white" : "var(--km-text-muted)" }}
        >
          {maxStepReached >= 3 ? "บันทึก" : "ถัดไป"} {selectedItems.length > 0 && `(${selectedItems.length})`}
        </button>
      </div>
    </>
  );

  /* ══════════════════════════════════════════
     STEP 3 — สรุปคำขอ
  ══════════════════════════════════════════ */
  const chosenItems  = returnableItems.filter((i) => selectedItems.includes(i.productId));
  const displayItems = showAllItems ? chosenItems : chosenItems.slice(0, 4);
  const refund       = MOCK_REFUND_METHODS.find((m) => m.id === refundMethod) ?? null;
  const refundTotal  = chosenItems.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="pb-32 pt-4 flex flex-col gap-5">

      {/* สินค้าที่ขอคืน */}
      <div className="">
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-3 px-1">สินค้าที่ขอคืน</p>
        <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">
          {displayItems.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 px-4 py-3.5">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--km-surface)] flex-shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[var(--km-text)] line-clamp-1">{item.name}</p>
                <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{item.variant} · x{item.quantity}</p>
              </div>
              <div className="flex-shrink-0 flex items-baseline gap-1.5">
                <span className="text-[13px] text-[var(--km-text)]">฿{(item.price * item.quantity).toLocaleString()}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-xs text-[var(--km-text-muted)] line-through">฿{(item.originalPrice * item.quantity).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
          {chosenItems.length > 4 && !showAllItems && (
            <button
              onClick={() => setShowAllItems(true)}
              className="w-full py-3 text-xs text-[var(--km-text-muted)] flex items-center justify-center gap-1 active:bg-[var(--km-surface)]"
            >
              ดูสินค้าทั้งหมด {chosenItems.length} รายการ <ChevronDown size={13} />
            </button>
          )}
          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 text-[13px] font-medium text-[var(--km-text-secondary)] border-t border-[var(--km-border)] flex items-center justify-center gap-2 active:bg-[var(--km-surface)] transition-colors"
          >
            <span>แก้ไขรายการสินค้า</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* เหตุผล */}
      <div className="">
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-3 px-1">เหตุผล</p>
        <button
          onClick={() => setStep(1)}
          className="w-full bg-white rounded-xl border border-[var(--km-border)] px-4 py-3.5 flex items-center gap-3 text-left active:bg-[var(--km-surface)] transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--km-text)]">{reason!.label}</p>
            <p className="text-xs text-[var(--km-text-muted)] mt-0.5">{reason!.desc}</p>
          </div>
          <ChevronRight size={14} className="text-[var(--km-text-muted)] flex-shrink-0" />
        </button>
      </div>

      {/* หมายเหตุ + รูปภาพ */}
      <div className="">
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-3 px-1">รายละเอียดปัญหา</p>
        <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="อธิบายปัญหาเพิ่มเติม..."
            rows={4}
            className="w-full text-sm text-[var(--km-text)] px-4 py-4 resize-none focus:outline-none placeholder:text-[var(--km-text-muted)]"
          />
          <div className="border-t border-[var(--km-border)] px-4 py-3">
            <p className="text-xs font-medium text-[var(--km-text-secondary)] mb-2">แนบรูปภาพ ({media.length}/5)</p>
            <div className="flex gap-2 flex-wrap">
              {media.map((m) => (
                <div key={m.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--km-border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setMedia((prev) => prev.filter((x) => x.id !== m.id))}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center"
                  >
                    <X size={9} strokeWidth={2.5} className="text-white" />
                  </button>
                </div>
              ))}
              {media.length < 5 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-16 h-16 rounded-lg border border-dashed border-[var(--km-border-strong)] flex flex-col items-center justify-center gap-0.5"
                >
                  <ImageIcon size={16} strokeWidth={1.5} className="text-[var(--km-text-muted)]" />
                  <span className="text-xs text-[var(--km-text-muted)]">เพิ่มรูป</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          </div>
          {/* Tips */}
          <div className="border-t border-[var(--km-border)] px-4 py-3 bg-[var(--km-surface)]">
            <p className="text-xs font-medium text-[var(--km-text-secondary)] mb-1.5">แนะนำรูปที่ควรแนบ</p>
            {[
              "ภาพสินค้าที่ได้รับ ให้เห็นสภาพชัดเจน",
              "ภาพใบปะหน้าพัสดุที่มีชื่อและที่อยู่ครบ",
              "ภาพที่แสดงว่าสินค้าแตกต่างจากที่สั่ง",
              "ภาพหน้าจอยืนยันคำสั่งซื้อ (ถ้ามี)",
            ].map((tip) => (
              <p key={tip} className="text-xs text-[var(--km-text-muted)] leading-relaxed">· {tip}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ข้อมูลการคืนเงิน */}
      <div className="mt-3">
        <p className="text-[13px] font-medium text-[var(--km-text-secondary)] mb-2 px-1">ข้อมูลการคืนเงิน</p>
        <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden divide-y divide-[var(--km-border)]">

          {/* ช่องทางรับเงินคืน */}
          <button
            onClick={() => setSubView("refund-method")}
            className="flex items-center justify-between w-full px-4 py-3.5 active:bg-[var(--km-surface)] transition-colors"
          >
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs text-[var(--km-text-muted)]">ช่องทางรับเงินคืน</p>
              {refund ? (
                <div className="mt-0.5"><RefundMethodLabel m={refund} /></div>
              ) : (
                <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5">กรุณาเลือกช่องทางรับเงินคืน</p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              {refund && <p className="text-[13px] font-medium text-[var(--km-text)]">฿{refundTotal.toLocaleString()}</p>}
              <ChevronRight size={14} className="text-[var(--km-text-muted)]" />
            </div>
          </button>

          {/* อีเมลติดต่อ */}
          <button
            onClick={() => { setEmailDraft(email); setShowEmailSheet(true); }}
            className="flex items-center justify-between w-full px-4 py-3.5 active:bg-[var(--km-surface)] transition-colors"
          >
            <div className="text-left">
              <p className="text-xs text-[var(--km-text-muted)]">อีเมลสำหรับติดต่อ</p>
              <p className="text-[13px] text-[var(--km-text)] mt-0.5">{email}</p>
            </div>
            <ChevronRight size={14} className="text-[var(--km-text-muted)] flex-shrink-0" />
          </button>

          {/* เบอร์ติดต่อ */}
          <button
            onClick={() => { setPhoneDraft(phone); setShowPhoneSheet(true); }}
            className="flex items-center justify-between w-full px-4 py-3.5 active:bg-[var(--km-surface)] transition-colors"
          >
            <div className="text-left">
              <p className="text-xs text-[var(--km-text-muted)]">เบอร์โทรศัพท์สำหรับติดต่อ</p>
              <p className="text-[13px] text-[var(--km-text)] mt-0.5">{phone}</p>
            </div>
            <ChevronRight size={14} className="text-[var(--km-text-muted)] flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[var(--km-border)] px-4 pt-3 z-[810]"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <button
          onClick={handleSubmit}
          disabled={!refund}
          className="w-full h-12 rounded-xl text-sm font-medium transition-all"
          style={{ background: refund ? "var(--km-text)" : "var(--km-border)", color: refund ? "white" : "var(--km-text-muted)" }}
        >
          ส่งคำขอคืนเงิน
        </button>
      </div>

      {/* Email bottom sheet */}
      <div 
        className={`fixed inset-0 z-[900] flex flex-col justify-end transition-opacity duration-300 ${showEmailSheet ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setShowEmailSheet(false)} />
        <div 
          className={`relative bg-white rounded-t-2xl px-4 pt-5 pb-8 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showEmailSheet ? "translate-y-0" : "translate-y-full"}`}
          style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}
        >
          <div className="w-12 h-1.5 bg-[var(--km-border)] rounded-full mx-auto mb-4 opacity-50" />
          <p className="text-base font-medium text-[var(--km-text)] mb-1">แก้ไขอีเมลติดต่อ</p>
          <p className="text-xs text-[var(--km-text-muted)] mb-4">การเปลี่ยนนี้มีผลเฉพาะคำขอนี้เท่านั้น</p>
          <input
            value={emailDraft}
            onChange={(e) => setEmailDraft(e.target.value)}
            type="email"
            className="w-full border border-[var(--km-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--km-text)] focus:outline-none focus:border-[var(--km-text)] bg-[var(--km-surface)]"
            placeholder="อีเมลของคุณ"
          />
          <button
            onClick={() => { setEmail(emailDraft); setShowEmailSheet(false); }}
            className="w-full mt-4 h-12 rounded-xl bg-[var(--km-text)] text-white text-sm font-medium active:opacity-80 transition-opacity"
          >
            บันทึก
          </button>
        </div>
      </div>

      {/* Phone bottom sheet */}
      <div 
        className={`fixed inset-0 z-[900] flex flex-col justify-end transition-opacity duration-300 ${showPhoneSheet ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setShowPhoneSheet(false)} />
        <div 
          className={`relative bg-white rounded-t-2xl px-4 pt-5 pb-8 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showPhoneSheet ? "translate-y-0" : "translate-y-full"}`}
          style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}
        >
          <div className="w-12 h-1.5 bg-[var(--km-border)] rounded-full mx-auto mb-4 opacity-50" />
          <p className="text-base font-medium text-[var(--km-text)] mb-1">แก้ไขเบอร์โทรศัพท์ติดต่อ</p>
          <p className="text-xs text-[var(--km-text-muted)] mb-4">การเปลี่ยนนี้มีผลเฉพาะคำขอนี้เท่านั้น</p>
          <input
            value={phoneDraft}
            onChange={(e) => setPhoneDraft(e.target.value)}
            type="tel"
            className="w-full border border-[var(--km-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--km-text)] focus:outline-none focus:border-[var(--km-text)] bg-[var(--km-surface)]"
            placeholder="เบอร์โทรศัพท์ของคุณ"
          />
          <button
            onClick={() => { setPhone(phoneDraft); setShowPhoneSheet(false); }}
            className="w-full mt-4 h-12 rounded-xl bg-[var(--km-text)] text-white text-sm font-medium active:opacity-80 transition-opacity"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
