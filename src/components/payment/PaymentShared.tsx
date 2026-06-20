"use client";

import { useState } from "react";
import { Building2, ChevronRight, Search, Check } from "lucide-react";
import { FormField, inputCls } from "@/components/ui/FormField";
import QRCode from "react-qr-code";
import generatePayload from "promptpay-qr";

export interface SavedCard {
  id: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
  name: string;
}

export interface SavedBank {
  id: string;
  bankId: string;
  accountNo: string;
  name: string;
}

export type CardBrand = "visa" | "mastercard" | "jcb" | "unionpay" | "amex" | null;

export const THAI_BANKS = [
  { id: "kbank",  name: "ธนาคารกสิกรไทย",                   abbr: "KBANK",  color: "#138F2D" },
  { id: "scb",    name: "ธนาคารไทยพาณิชย์",                  abbr: "SCB",    color: "#4E2E8B" },
  { id: "bbl",    name: "ธนาคารกรุงเทพ",                     abbr: "BBL",    color: "#1E4598" },
  { id: "ktb",    name: "ธนาคารกรุงไทย",                     abbr: "KTB",    color: "#1BA5E1" },
  { id: "bay",    name: "ธนาคารกรุงศรีอยุธยา",               abbr: "BAY",    color: "#FEC43B" },
  { id: "ttb",    name: "ธนาคารทหารไทยธนชาต",               abbr: "TTB",    color: "#0066B3" },
  { id: "gsb",    name: "ธนาคารออมสิน",                      abbr: "GSB",    color: "#EB198D" },
  { id: "baac",   name: "ธ.ก.ส.",                             abbr: "BAAC",   color: "#4B9B1F" },
  { id: "ghb",    name: "ธนาคารอาคารสงเคราะห์",              abbr: "GHB",    color: "#F47920" },
  { id: "uob",    name: "ธนาคาร UOB",                        abbr: "UOB",    color: "#0F4EA1" },
  { id: "cimb",   name: "ธนาคาร CIMB Thai",                  abbr: "CIMB",   color: "#C8161D" },
  { id: "lhb",    name: "ธนาคารแลนด์ แอนด์ เฮ้าส์",         abbr: "LHB",    color: "#6D28D9" },
  { id: "ibank",  name: "ธนาคารอิสลามแห่งประเทศไทย",        abbr: "IBANK",  color: "#4D6B2B" },
];

export function detectBrand(num: string): CardBrand {
  const n = num.replace(/\s/g, "");
  if (!n) return null;
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7]\d{2})/.test(n)) return "mastercard";
  if (/^35(2[89]|[3-8])/.test(n)) return "jcb";
  if (/^62/.test(n)) return "unionpay";
  if (/^3[47]/.test(n)) return "amex";
  return null;
}

export const BRAND_LABEL: Record<string, string> = {
  visa: "Visa", mastercard: "Mastercard", jcb: "JCB", unionpay: "UnionPay", amex: "American Express",
};

export function BankChip({ bankId, size = "md" }: { bankId: string; size?: "sm" | "md" }) {
  const bank = THAI_BANKS.find((b) => b.id === bankId);
  if (!bank) return <div className="w-10 h-7 rounded bg-[var(--km-border)]" />;
  const sz = size === "sm" ? "w-8 h-8 text-[10px]" : "w-10 h-10 text-xs";
  return (
    <div
      className={`${sz} rounded-lg flex items-center justify-center font-medium text-white flex-shrink-0 overflow-hidden bg-transparent`}
    >
      <img
        src={`https://cdn.jsdelivr.net/npm/thai-banks-logo@latest/icons/${bank.abbr}.png`}
        alt={bank.abbr}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = "none";
          if (target.parentElement) {
            target.parentElement.style.background = bank.color;
            target.parentElement.innerText = bank.abbr;
          }
        }}
      />
    </div>
  );
}

export function VisaLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="750" height="471" rx="40" fill="white"/>
      <path d="M278.198 334.228L311.806 140.535H363.555L329.947 334.228H278.198Z" fill="#1A1F71"/>
      <path d="M524.307 144.752C514.111 140.873 497.888 136.609 477.752 136.609C426.566 136.609 390.965 163.422 390.699 202.129C390.155 231.101 416.878 247.058 437.26 256.587C458.175 266.381 464.952 272.706 464.686 281.564C464.42 295.081 448.992 301.14 434.628 301.14C414.759 301.14 404.03 298.058 387.274 291.201L380.496 288.119L373.186 330.878C385.25 336.14 407.5 340.67 430.547 340.937C484.795 340.937 519.6 314.59 520.411 273.373C520.944 250.404 506.58 233.119 476.407 218.804C457.6 209.542 446.073 203.217 446.339 193.691C446.339 185.099 455.805 176.107 476.674 176.107C494.148 175.841 506.846 179.72 516.51 183.866L521.492 186.149L528.535 144.752H524.307Z" fill="#1A1F71"/>
      <path d="M639.806 140.535H599.951C587.622 140.535 578.411 143.883 573.162 156.468L497.888 334.228H552.136C552.136 334.228 561.879 308.947 564.105 303.156C570.35 303.156 622.931 303.156 630.729 303.156C632.156 310.28 636.917 334.228 636.917 334.228H685L639.806 140.535ZM578.145 264.97C582.639 253.453 601.111 203.75 601.111 203.75C600.845 204.283 605.606 192.3 608.098 184.91L611.923 201.733C611.923 201.733 623.197 253.986 625.689 264.97H578.145Z" fill="#1A1F71"/>
      <path d="M230.199 140.535L179.545 271.09L174.25 244.51C165.039 214.471 137.516 181.9 106.544 165.544L153.022 334.228H207.536L285.512 140.535H230.199Z" fill="#1A1F71"/>
      <path d="M135.557 140.535H50.299L49.5 144.752C115.687 161.308 160.083 198.486 178.189 244.51L159.817 156.734C156.791 144.416 148.112 141.069 135.557 140.535Z" fill="#F9A533"/>
    </svg>
  );
}

export function MastercardLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 152 108" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="152" height="108" rx="8" fill="white"/>
      <circle cx="58" cy="54" r="30" fill="#EB001B"/>
      <circle cx="94" cy="54" r="30" fill="#F79E1B"/>
      <path d="M76 27.0652C83.3753 32.5448 88 41.2354 88 54C88 66.7646 83.3753 75.4552 76 80.9348C68.6247 75.4552 64 66.7646 64 54C64 41.2354 68.6247 32.5448 76 27.0652Z" fill="#FF5F00"/>
    </svg>
  );
}

export function JCBLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 152 108" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="152" height="108" rx="8" fill="white"/>
      <rect x="8" y="12" width="35" height="84" rx="8" fill="#003087"/>
      <rect x="58" y="12" width="36" height="84" rx="8" fill="#CC0000"/>
      <rect x="109" y="12" width="35" height="84" rx="8" fill="#007B40"/>
      <text x="25.5" y="60" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">J</text>
      <text x="76" y="60" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">C</text>
      <text x="126.5" y="60" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">B</text>
    </svg>
  );
}

export function PromptPayLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/payment/thai_qr_icon.png"
      alt="Thai QR Payment"
      className={`object-contain rounded-lg ${className}`}
    />
  );
}

export function CardBrandLogo({ brand, className = "" }: { brand: CardBrand | string | null; className?: string }) {
  switch (brand) {
    case "visa":       return <VisaLogo className={className} />;
    case "mastercard": return <MastercardLogo className={className} />;
    case "jcb":        return <JCBLogo className={className} />;
    default:
      return (
        <svg viewBox="0 0 152 108" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="152" height="108" rx="8" fill="#f3f4f6"/>
          <rect x="12" y="30" width="128" height="20" rx="4" fill="#d1d5db"/>
          <rect x="12" y="62" width="60" height="12" rx="3" fill="#e5e7eb"/>
          <rect x="80" y="62" width="60" height="12" rx="3" fill="#e5e7eb"/>
        </svg>
      );
  }
}

export function PromptPayQR({ amount, className = "" }: { amount?: number; className?: string }) {
  const PROMPTPAY_ID = "0000000000";
  const payload = generatePayload(PROMPTPAY_ID, amount ? { amount } : {});
  return (
    <div className={`bg-white p-4 rounded-2xl inline-flex flex-col items-center gap-3 ${className}`}>
      <PromptPayLogo className="w-28 h-auto" />
      <QRCode value={payload} size={180} level="M" />
      {amount != null && (
        <p className="text-[15px] font-medium text-[var(--km-text)]">฿{amount.toLocaleString()}</p>
      )}
      <p className="text-[12px] text-[var(--km-text-muted)] text-center max-w-[180px]">สแกนด้วยแอปธนาคารหรือ Mobile Banking ของคุณ</p>
    </div>
  );
}


export function BankPicker({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [q, setQ] = useState("");
  const filtered = THAI_BANKS.filter((b) =>
    b.name.includes(q) || b.abbr.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="flex flex-col min-h-screen">
      {/* Search */}
      <div className="px-4 pt-4 pb-3 border-b border-[var(--km-border)]">
        <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-[var(--km-surface)] border border-[var(--km-border)]">
          <Search size={14} className="text-[var(--km-text-muted)] flex-shrink-0" />
          <input
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[var(--km-text-muted)]"
            placeholder="ค้นหาธนาคาร"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div>
          {filtered.map((bank) => (
            <div key={bank.id}>
              <button
                onClick={() => onSelect(bank.id)}
                className="w-full flex items-center gap-3 px-4 py-4 active:bg-[var(--km-surface)] transition-colors text-left"
              >
                <BankChip bankId={bank.id} />
                <span className="flex-1 text-[15px] font-normal text-[var(--km-text)]">{bank.name}</span>
                {selected === bank.id && <Check size={16} strokeWidth={2.5} className="text-[var(--km-text)] flex-shrink-0" />}
              </button>
              <div className="h-px bg-[var(--km-border)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AddBankForm({
  onSave,
  onPickBank,
  bankId,
  isDefault,
  onToggleDefault,
  disableDefaultToggle,
  children,
}: {
  onSave: (bank: Omit<SavedBank, "id">) => void;
  onPickBank: () => void;
  bankId: string;
  isDefault: boolean;
  onToggleDefault: () => void;
  disableDefaultToggle?: boolean;
  children?: React.ReactNode;
}) {
  const [name,  setName]  = useState("");
  const [accNo, setAccNo] = useState("");
  const bank = THAI_BANKS.find((b) => b.id === bankId);

  const formatAccNo = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 4) return `${d.slice(0,3)}-${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}-${d.slice(3,4)}-${d.slice(4)}`;
    return `${d.slice(0,3)}-${d.slice(3,4)}-${d.slice(4,9)}-${d.slice(9)}`;
  };

  const canSave = !!bankId && name.trim() && accNo.replace(/\D/g, "").length === 10;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[var(--km-text-secondary)]">ธนาคาร *</label>
        <button
          onClick={onPickBank}
          className="w-full px-4 py-3 text-[15px] bg-white border border-[var(--km-border)] rounded-2xl flex items-center gap-3 transition-all text-left focus:border-[var(--km-text)] outline-none"
        >
          {bankId ? (
            <>
              <BankChip bankId={bankId} size="sm" />
              <span className="flex-1 text-[var(--km-text)]">{bank?.name}</span>
            </>
          ) : (
            <>
              <div className="w-8 h-6 rounded border border-dashed border-[var(--km-border)] flex items-center justify-center flex-shrink-0">
                <Building2 size={13} className="text-[var(--km-text-muted)]" />
              </div>
              <span className="flex-1 text-[var(--km-text-muted)]">เลือกธนาคาร</span>
            </>
          )}
          <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--km-text-muted)]" />
        </button>
      </div>

      <FormField label="ชื่อ-นามสกุล (ตามหน้าบัญชี) *">
        <input
          className={inputCls("")}
          placeholder="ระบุชื่อ-นามสกุล"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>
      
      <FormField label="เลขที่บัญชี *">
        <input
          className={inputCls("")}
          placeholder="ระบุเลขที่บัญชี 10 หลัก"
          value={accNo}
          inputMode="numeric"
          onChange={(e) => setAccNo(formatAccNo(e.target.value))}
        />
      </FormField>

      <div className="mt-2" />

      {/* Default toggle inline */}
      <button
        type="button"
        disabled={disableDefaultToggle}
        onClick={onToggleDefault}
        className="flex items-center justify-between w-full py-1 disabled:opacity-50"
      >
        <span className="text-[15px] text-[var(--km-text)]">ตั้งเป็นบัญชีเริ่มต้น</span>
        <div
          className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
          style={{ background: isDefault ? "var(--km-text)" : "var(--km-border-strong)" }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
            style={{ left: isDefault ? "calc(100% - 22px)" : "2px" }}
          />
        </div>
      </button>

      {children}

      {/* Save button inline */}
      <div className="pt-2">
        <button
          onClick={() => { if (canSave) onSave({ bankId, name, accountNo: accNo }); }}
          disabled={!canSave}
          className="w-full py-3.5 rounded-full text-[15px] font-medium transition-all active:scale-[0.98]"
          style={{ background: canSave ? "var(--km-text)" : "var(--km-border)", color: canSave ? "white" : "var(--km-text-muted)" }}
        >
          บันทึกบัญชี
        </button>
      </div>
    </div>
  );
}

export function AddCardForm({
  onSave,
  isDefault,
  onToggleDefault,
  disableDefaultToggle,
  children,
}: {
  onSave: (card: Omit<SavedCard, "id">) => void;
  isDefault: boolean;
  onToggleDefault: () => void;
  disableDefaultToggle?: boolean;
  children?: React.ReactNode;
}) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv,    setCvv]    = useState("");
  const [name,   setName]   = useState("");

  const brand = detectBrand(number);
  const digits = number.replace(/\s/g, "");
  const maxLen = brand === "amex" ? 15 : 16;

  const formatNumber = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, maxLen);
    if (brand === "amex") return d.replace(/^(\d{4})(\d{6})(\d{0,5})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
    return d.replace(/(.{4})/g, "$1 ").trim();
  };
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const canSave = digits.length >= maxLen && expiry.length === 5 && cvv.length >= 3 && name.trim();

  return (
    <div className="flex flex-col gap-4">
      <FormField label="หมายเลขบัตร *">
        <div className="relative">
          <input
            className={inputCls("") + " pr-16"}
            placeholder="ระบุหมายเลขบัตร 15-16 หลัก"
            value={number}
            inputMode="numeric"
            onChange={(e) => setNumber(formatNumber(e.target.value))}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-7 flex items-center justify-center">
            {brand
              ? <CardBrandLogo brand={brand} className="w-10 h-7" />
              : <div className="w-10 h-7 rounded border border-dashed border-[var(--km-border)]" />}
          </div>
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="วันหมดอายุ *">
          <input
            className={inputCls("")}
            placeholder="ระบุวันหมดอายุ (MM/YY)"
            value={expiry}
            inputMode="numeric"
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
          />
        </FormField>
        <FormField label="CVV *">
          <input
            className={inputCls("")}
            placeholder="ระบุรหัส CVV 3-4 หลัก"
            value={cvv}
            inputMode="numeric"
            type="password"
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, brand === "amex" ? 4 : 3))}
          />
        </FormField>
      </div>

      <FormField label="ชื่อเจ้าของบัตร *">
        <input
          className={inputCls("")}
          placeholder="ระบุชื่อภาษาอังกฤษบนบัตร"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
        />
      </FormField>

      <div className="mt-2" />

      {/* Default toggle inline */}
      <button
        type="button"
        disabled={disableDefaultToggle}
        onClick={onToggleDefault}
        className="flex items-center justify-between w-full py-1 disabled:opacity-50"
      >
        <span className="text-[15px] text-[var(--km-text)]">ตั้งเป็นบัตรเริ่มต้น</span>
        <div
          className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
          style={{ background: isDefault ? "var(--km-text)" : "var(--km-border-strong)" }}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
            style={{ left: isDefault ? "calc(100% - 22px)" : "2px" }}
          />
        </div>
      </button>

      {children}

      {/* Save button inline */}
      <div className="pt-2">
        <button
          onClick={() => { if (canSave) onSave({ brand, last4: digits.slice(-4), expiry, name }); }}
          disabled={!canSave}
          className="w-full py-3.5 rounded-full text-[15px] font-medium transition-all active:scale-[0.98]"
          style={{ background: canSave ? "var(--km-text)" : "var(--km-border)", color: canSave ? "white" : "var(--km-text-muted)" }}
        >
          บันทึกบัตร
        </button>
      </div>
    </div>
  );
}
