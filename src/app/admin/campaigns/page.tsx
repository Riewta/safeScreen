"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, X, Check, AlertTriangle, ToggleLeft, ToggleRight, Tag, Megaphone } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { AdminPagination } from "@/components/admin/AdminPagination";

const PAGE_SIZE = 10;

// ── Types ─────────────────────────────────────────────────────────────────────

type CampaignType   = "campaign" | "promotion";
type DiscountType   = "none" | "percentage" | "fixed" | "buy1get1" | "free-gift";
type CampaignStatus = "active" | "inactive" | "scheduled" | "ended";

interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  hero: string;
  type: CampaignType;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  createdAt: string;
}

// ── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "safescreen-campaigns";

const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: "0", slug: "11-11",
    title: "SafeScreen 11.11 ลดสูงสุด 50%",
    description: "โปรโมชั่น 11.11 สุดยิ่งใหญ่! NanoSnap ทุกรุ่นลดสูงสุด 50% พร้อมฟรี! แฟ้ม SafeScreen ทุก ORDER มีจำนวนจำกัด",
    hero: "/banner_promotions/11-11-sale.png",
    type: "campaign", discountType: "percentage", discountValue: 50,
    startDate: "2026-11-11", endDate: "2026-11-11", status: "scheduled", createdAt: "2026-06-14",
  },
  {
    id: "1", slug: "flash-sale",
    title: "Flash Sale",
    description: "ดีลสุดคุ้มที่อัปเดตทุกวัน สินค้า NanoSnap คัดสรรกว่า 200 รายการ ลดสูงสุด 70% มีจำนวนจำกัด หมดแล้วหมดเลย",
    hero: "/products/allpics/16-9.png",
    type: "promotion", discountType: "percentage", discountValue: 70,
    startDate: "2026-06-01", endDate: "2026-06-30", status: "active", createdAt: "2026-05-20",
  },
  {
    id: "2", slug: "buy-1-get-1",
    title: "ซื้อ 1 แถม 1 (Buy 1 Get 1 Free)",
    description: "โปรโมชั่นแรงที่สุดแห่งปี! สินค้าความงาม 1 แถม 1 เลือกของแถมชิ้นเดียวกันหรือชิ้นพิเศษได้ทันที",
    hero: "/banner_promotions/1free1.png",
    type: "promotion", discountType: "buy1get1", discountValue: 0,
    startDate: "2026-06-01", endDate: "2026-06-30", status: "active", createdAt: "2026-05-20",
  },
  {
    id: "3", slug: "free-gift",
    title: "ช้อปครบ 500 บาท รับของแถมฟรี",
    description: "คุ้มค่ายิ่งขึ้นกับโปรโมชั่นช้อปครบ 500 บาท รับของแถมสุดพรีเมียม!",
    hero: "/banner_promotions/buy500freeitem.png",
    type: "promotion", discountType: "free-gift", discountValue: 500,
    startDate: "2026-06-01", endDate: "2026-06-30", status: "active", createdAt: "2026-05-20",
  },
  {
    id: "4", slug: "mid-year-sale",
    title: "SafeScreen Mid Year Sale ลดสูงสุด 40%",
    description: "โปรโมชั่นฉลองกลางปีสุดคุ้ม! ฟิล์มกันมองแม่เหล็ก MacBook, iPad และ Universal ลดสูงสุดถึง 40%",
    hero: "/banner_promotions/ChatGPT Image 20 พ.ค. 2569 15_36_47.png",
    type: "campaign", discountType: "percentage", discountValue: 40,
    startDate: "2026-06-01", endDate: "2026-06-30", status: "active", createdAt: "2026-05-20",
  },
  {
    id: "5", slug: "ipad-bundle",
    title: "iPad Bundle Deal ซื้อ Paper Like + Privacy ราคาพิเศษ",
    description: "รวม 2 ฟิล์มในชุดเดียว Paper Like สำหรับการวาด + Privacy สำหรับปกป้องความเป็นส่วนตัว",
    hero: "/banner_promotions/image copy 2.png",
    type: "campaign", discountType: "percentage", discountValue: 20,
    startDate: "2026-06-01", endDate: "2026-07-31", status: "active", createdAt: "2026-05-20",
  },
  {
    id: "6", slug: "brand-day-safescreen",
    title: "SafeScreen Brand Day ลดพิเศษสูงสุด 40%",
    description: "ฟิล์มกันมองแม่เหล็ก NanoSnap ทุกรุ่น ลดพิเศษ 40% ทั้ง MacBook, iPad และ Universal",
    hero: "/banner_promotions/image copy 3.png",
    type: "campaign", discountType: "percentage", discountValue: 40,
    startDate: "2026-07-01", endDate: "2026-07-01", status: "scheduled", createdAt: "2026-05-20",
  },
  {
    id: "7", slug: "work-from-home",
    title: "Work From Home Bundle ปกป้องความเป็นส่วนตัวในทุกที่",
    description: "ชุดฟิล์ม Privacy สำหรับคนทำงาน MacBook + Universal Screen ครบครัน",
    hero: "/banner_promotions/image copy 4.png",
    type: "campaign", discountType: "none", discountValue: 0,
    startDate: "2026-06-01", endDate: "2026-08-31", status: "active", createdAt: "2026-05-20",
  },
];

function loadCampaigns(): Campaign[] {
  if (typeof window === "undefined") return SEED_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_CAMPAIGNS;
    return JSON.parse(raw) as Campaign[];
  } catch {
    return SEED_CAMPAIGNS;
  }
}

function saveCampaigns(campaigns: Campaign[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPE_OPTIONS: { value: CampaignType; label: string }[] = [
  { value: "campaign",  label: "แคมเปญ (Campaign)" },
  { value: "promotion", label: "โปรโมชัน (Promotion)" },
];

const DISCOUNT_OPTIONS: { value: DiscountType; label: string; hasValue: boolean; unit: string }[] = [
  { value: "none",       label: "ไม่มีส่วนลด",              hasValue: false, unit: "" },
  { value: "percentage", label: "ลด % (Percentage)",         hasValue: true,  unit: "%" },
  { value: "fixed",      label: "ลดราคา (Fixed ฿)",          hasValue: true,  unit: "฿" },
  { value: "buy1get1",   label: "ซื้อ 1 แถม 1 (Buy1Get1)",  hasValue: false, unit: "" },
  { value: "free-gift",  label: "ของแถม (Free Gift)",        hasValue: true,  unit: "฿ ขั้นต่ำ" },
];

const STATUS_OPTIONS: { value: CampaignStatus; label: string; color: string }[] = [
  { value: "active",    label: "Active",    color: "bg-green-100 text-green-700" },
  { value: "inactive",  label: "Inactive",  color: "bg-[var(--km-surface)] text-[var(--km-text-muted)]" },
  { value: "scheduled", label: "Scheduled", color: "bg-blue-100 text-blue-700" },
  { value: "ended",     label: "Ended",     color: "bg-red-100 text-red-500" },
];

const EMPTY_FORM: Omit<Campaign, "id" | "createdAt"> = {
  slug: "",
  title: "",
  description: "",
  hero: "/products/allpics/16-9.png",
  type: "campaign",
  discountType: "none",
  discountValue: 0,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  status: "inactive",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CampaignStatus }) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[1];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${opt.color}`}>
      {opt.label}
    </span>
  );
}

function TypeBadge({ type }: { type: CampaignType }) {
  return type === "campaign" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
      <Megaphone size={10} /> แคมเปญ
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
      <Tag size={10} /> โปรโมชัน
    </span>
  );
}

function DiscountLabel({ type, value }: { type: DiscountType; value: number }) {
  if (type === "none")       return <span className="text-[var(--km-text-muted)]">—</span>;
  if (type === "buy1get1")   return <span className="text-orange-600 font-medium">1+1</span>;
  if (type === "free-gift")  return <span className="text-green-600 font-medium">ครบ ฿{value.toLocaleString()}</span>;
  if (type === "percentage") return <span className="text-red-600 font-medium">-{value}%</span>;
  if (type === "fixed")      return <span className="text-red-600 font-medium">-฿{value.toLocaleString()}</span>;
  return null;
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface ModalProps {
  form:    Omit<Campaign, "id" | "createdAt">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Campaign, "id" | "createdAt">>>;
  onSave:  () => void;
  onClose: () => void;
  isEdit:  boolean;
  error:   string;
}

function CampaignModal({ form, setForm, onSave, onClose, isEdit, error }: ModalProps) {
  const discountOpt = DISCOUNT_OPTIONS.find((d) => d.value === form.discountType);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--km-border)]">
          <h2 className="text-base font-semibold text-[var(--km-text)]">
            {isEdit ? "แก้ไขแคมเปญ / โปรโมชัน" : "เพิ่มแคมเปญ / โปรโมชัน"}
          </h2>
          <button onClick={onClose} className="text-[var(--km-text-muted)] hover:text-[var(--km-text-secondary)] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-[var(--km-text-muted)] mb-1.5">ประเภท</label>
            <div className="flex gap-2">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${form.type === t.value ? "border-[#F5A600] bg-[#F5A600] text-black font-semibold" : "border-[var(--km-border)] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)]"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--km-text-muted)] mb-1.5">Slug (URL path)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                placeholder="flash-sale"
                className="w-full h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)]"
              />
              <p className="text-[11px] text-[var(--km-text-muted)] mt-1">/campaign/{form.slug || "..."}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--km-text-muted)] mb-1.5">สถานะ</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CampaignStatus }))}
                className="w-full h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)] bg-white"
              >
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--km-text-muted)] mb-1.5">ชื่อแคมเปญ</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Flash Sale ลดสูงสุด 70%"
              className="w-full h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--km-text-muted)] mb-1.5">คำอธิบาย</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="รายละเอียดของแคมเปญหรือโปรโมชัน..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)] resize-none"
            />
          </div>
          <ImageUploadField value={form.hero} onChange={(v) => setForm((f) => ({ ...f, hero: v }))} label="Hero Image" />
          <div>
            <label className="block text-xs font-medium text-[var(--km-text-muted)] mb-1.5">ประเภทส่วนลด</label>
            <div className="flex gap-3 items-start">
              <select
                value={form.discountType}
                onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as DiscountType, discountValue: 0 }))}
                className="flex-1 h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)] bg-white"
              >
                {DISCOUNT_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              {discountOpt?.hasValue && (
                <div className="flex items-center gap-1">
                  <input
                    type="number" min={0}
                    value={form.discountValue || ""}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))}
                    placeholder="0"
                    className="w-24 h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)] text-right"
                  />
                  <span className="text-sm text-[var(--km-text-muted)] whitespace-nowrap">{discountOpt.unit}</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--km-text-muted)] mb-1.5">วันเริ่มต้น</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="w-full h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--km-text-muted)] mb-1.5">วันสิ้นสุด</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="w-full h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)]" />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-600">
              <AlertTriangle size={16} className="shrink-0" /> {error}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--km-border)]">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors">
            ยกเลิก
          </button>
          <button onClick={onSave} className="px-5 py-2 rounded-lg bg-[#F5A600] text-black text-sm font-semibold hover:opacity-90 transition-colors flex items-center gap-2">
            <Check size={15} />
            {isEdit ? "บันทึกการแก้ไข" : "เพิ่มแคมเปญ"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns]       = useState<Campaign[]>([]);
  const [loaded, setLoaded]             = useState(false);
  const [search, setSearch]             = useState("");
  const [filterType, setFilterType]     = useState<"all" | CampaignType>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | CampaignStatus>("all");
  const [page, setPage]                 = useState(1);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editId, setEditId]             = useState<string | null>(null);
  const [form, setForm]                 = useState<Omit<Campaign, "id" | "createdAt">>(EMPTY_FORM);
  const [formError, setFormError]       = useState("");
  const [deleteId, setDeleteId]         = useState<string | null>(null);

  useEffect(() => { setCampaigns(loadCampaigns()); setLoaded(true); }, []);
  useEffect(() => { if (loaded) saveCampaigns(campaigns); }, [campaigns, loaded]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, filterType, filterStatus]);

  const filtered = useMemo(() =>
    campaigns.filter((c) => {
      const q = search.toLowerCase();
      return (
        (!q || c.title.toLowerCase().includes(q) || c.slug.includes(q)) &&
        (filterType   === "all" || c.type   === filterType) &&
        (filterStatus === "all" || c.status === filterStatus)
      );
    }),
    [campaigns, search, filterType, filterStatus]
  );

  const stats = useMemo(() => ({
    total:     campaigns.length,
    active:    campaigns.filter((c) => c.status === "active").length,
    campaign:  campaigns.filter((c) => c.type   === "campaign").length,
    promotion: campaigns.filter((c) => c.type   === "promotion").length,
  }), [campaigns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAdd() {
    setEditId(null); setForm(EMPTY_FORM); setFormError(""); setModalOpen(true);
  }

  function openEdit(c: Campaign) {
    setEditId(c.id);
    setForm({ slug: c.slug, title: c.title, description: c.description, hero: c.hero, type: c.type, discountType: c.discountType, discountValue: c.discountValue, startDate: c.startDate, endDate: c.endDate, status: c.status });
    setFormError(""); setModalOpen(true);
  }

  function validateForm(): string {
    if (!form.slug.trim())  return "กรุณากรอก Slug";
    if (!form.title.trim()) return "กรุณากรอกชื่อแคมเปญ";
    if (!form.hero.trim())  return "กรุณากรอก Hero Image Path";
    if (form.startDate > form.endDate) return "วันเริ่มต้นต้องน้อยกว่าหรือเท่ากับวันสิ้นสุด";
    const conflict = campaigns.find((c) => c.slug === form.slug.trim() && c.id !== editId);
    if (conflict) return `Slug "${form.slug}" ซ้ำกับแคมเปญอื่น`;
    return "";
  }

  function handleSave() {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    if (editId) {
      setCampaigns((prev) => prev.map((c) => c.id === editId ? { ...c, ...form } : c));
    } else {
      setCampaigns((prev) => [{ id: Date.now().toString(), createdAt: new Date().toISOString().split("T")[0], ...form }, ...prev]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
  }

  function toggleStatus(id: string) {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
  }

  if (!loaded) return <div className="p-8 text-center text-[var(--km-text-muted)] text-sm">กำลังโหลด...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--km-text)]">Campaigns & Promotions</h1>
          <p className="text-sm text-[var(--km-text-muted)] mt-0.5">จัดการแคมเปญและโปรโมชันทั้งหมด</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#F5A600] text-black rounded-lg text-sm font-semibold hover:opacity-90 transition-colors">
          <Plus size={16} /> เพิ่มแคมเปญ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "ทั้งหมด",  value: stats.total,     color: "text-[var(--km-text)]" },
          { label: "Active",   value: stats.active,    color: "text-green-600" },
          { label: "แคมเปญ",   value: stats.campaign,  color: "text-purple-600" },
          { label: "โปรโมชัน", value: stats.promotion, color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--km-border)] p-4">
            <p className="text-xs text-[var(--km-text-muted)] mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหรือ slug..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)] hover:text-[var(--km-text-secondary)]">
              <X size={14} />
            </button>
          )}
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as typeof filterType)} className="h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)] bg-white">
          <option value="all">ทุกประเภท</option>
          <option value="campaign">แคมเปญ</option>
          <option value="promotion">โปรโมชัน</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className="h-9 px-3 rounded-lg border border-[var(--km-border)] text-sm focus:outline-none focus:border-[var(--km-border-strong)] bg-white">
          <option value="all">ทุกสถานะ</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <span className="text-sm text-[var(--km-text-muted)] ml-auto">{filtered.length} รายการ</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--km-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--km-border)] bg-[var(--km-surface)]">
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--km-text-muted)] w-[200px]">ชื่อแคมเปญ</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--km-text-muted)] w-[90px]">ประเภท</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--km-text-muted)] w-[90px]">ส่วนลด</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--km-text-muted)] w-[110px]">วันที่</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--km-text-muted)] w-[80px]">สถานะ</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-[var(--km-text-muted)] w-[80px]">Toggle</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-[var(--km-text-muted)] w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[var(--km-text-muted)] text-sm">ไม่พบแคมเปญ</td>
              </tr>
            )}
            {pageItems.map((c) => (
              <tr key={c.id} className="border-b border-[var(--km-border)] hover:bg-[var(--km-surface)] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--km-text)] truncate max-w-[180px]" title={c.title}>{c.title}</p>
                  <p className="text-xs text-[var(--km-text-muted)] font-mono mt-0.5">{c.slug}</p>
                </td>
                <td className="px-4 py-3"><TypeBadge type={c.type} /></td>
                <td className="px-4 py-3"><DiscountLabel type={c.discountType} value={c.discountValue} /></td>
                <td className="px-4 py-3">
                  <p className="text-xs text-[var(--km-text-secondary)]">{c.startDate}</p>
                  <p className="text-xs text-[var(--km-text-muted)]">→ {c.endDate}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(c.id)} title={c.status === "active" ? "คลิกเพื่อ Deactivate" : "คลิกเพื่อ Activate"} className="text-[var(--km-text-muted)] hover:text-[var(--km-text-secondary)] transition-colors">
                    {c.status === "active" ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded text-[var(--km-text-muted)] hover:text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded text-[var(--km-text-muted)] hover:text-red-600 hover:bg-red-50 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />

      {/* Modal */}
      {modalOpen && <CampaignModal form={form} setForm={setForm} onSave={handleSave} onClose={() => setModalOpen(false)} isEdit={!!editId} error={formError} />}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-[var(--km-text)]">ลบแคมเปญนี้?</p>
                <p className="text-sm text-[var(--km-text-muted)] mt-0.5">{campaigns.find((c) => c.id === deleteId)?.title}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-lg border border-[var(--km-border)] text-sm text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors">
                ยกเลิก
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
                ลบเลย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
