"use client";

import { useState } from "react";
import { CheckCircle, Building2, Users, Monitor, Landmark, Hospital, Coffee, Phone, type LucideIcon } from "lucide-react";
import { useLang } from "@/contexts/lang";

type DeviceType = "MacBook" | "Universal" | "Both";
type FilmType = "Privacy" | "Anti-Blue" | "Nano" | "Mixed";

interface LeadForm {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  deviceType: DeviceType | "";
  quantity: string;
  filmType: FilmType | "";
  notes: string;
}


const INITIAL_FORM: LeadForm = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  deviceType: "",
  quantity: "",
  filmType: "",
  notes: "",
};

export default function CorporatePage() {
  const { pages: t } = useLang();

  const PRICING_TIERS = [
    { range: t.corpTier1Range, discount: t.corpTier1Discount, badge: "",              highlight: false },
    { range: t.corpTier2Range, discount: t.corpTier2Discount, badge: t.corpTier2Badge, highlight: false },
    { range: t.corpTier3Range, discount: t.corpTier3Discount, badge: t.corpTier3Badge, highlight: true  },
    { range: t.corpTier4Range, discount: t.corpTier4Discount, badge: t.corpTier4Badge, highlight: false },
  ];

  const USE_CASES: { icon: LucideIcon; badge: string; badgeColor: string; title: string; desc: string; scenario: string }[] = [
    { icon: Monitor,  badge: t.corpUC1Badge, badgeColor: "bg-blue-50 text-blue-600 border-blue-100",    title: t.corpUC1Title, desc: t.corpUC1Desc, scenario: t.corpUC1Scenario },
    { icon: Landmark, badge: t.corpUC2Badge, badgeColor: "bg-red-50 text-red-500 border-red-100",       title: t.corpUC2Title, desc: t.corpUC2Desc, scenario: t.corpUC2Scenario },
    { icon: Hospital, badge: t.corpUC3Badge, badgeColor: "bg-red-50 text-red-500 border-red-100",       title: t.corpUC3Title, desc: t.corpUC3Desc, scenario: t.corpUC3Scenario },
    { icon: Coffee,   badge: t.corpUC4Badge, badgeColor: "bg-yellow-50 text-yellow-600 border-yellow-100", title: t.corpUC4Title, desc: t.corpUC4Desc, scenario: t.corpUC4Scenario },
    { icon: Building2,badge: t.corpUC5Badge, badgeColor: "bg-blue-50 text-blue-600 border-blue-100",    title: t.corpUC5Title, desc: t.corpUC5Desc, scenario: t.corpUC5Scenario },
    { icon: Users,    badge: t.corpUC6Badge, badgeColor: "bg-green-50 text-green-600 border-green-100", title: t.corpUC6Title, desc: t.corpUC6Desc, scenario: t.corpUC6Scenario },
  ];

  const [form, setForm] = useState<LeadForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof LeadForm, string>> = {};
    if (!form.companyName.trim()) newErrors.companyName = "กรุณากรอกชื่อบริษัท";
    if (!form.contactName.trim()) newErrors.contactName = "กรุณากรอกชื่อผู้ติดต่อ";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "กรุณากรอกอีเมลที่ถูกต้อง";
    if (!form.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!form.deviceType) newErrors.deviceType = "กรุณาเลือกประเภทอุปกรณ์";
    if (!form.quantity.trim() || isNaN(Number(form.quantity)) || Number(form.quantity) < 1)
      newErrors.quantity = "กรุณากรอกจำนวน";
    if (!form.filmType) newErrors.filmType = "กรุณาเลือกประเภทฟิล์ม";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const existing = JSON.parse(localStorage.getItem("safescreen-leads") || "[]") as LeadForm[];
      const lead = { ...form, submittedAt: new Date().toISOString() };
      localStorage.setItem("safescreen-leads", JSON.stringify([...existing, lead]));
    } catch {
      // localStorage may be unavailable — continue anyway
    }
    setSubmitted(true);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LeadForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--km-bg)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--km-text)] mb-3">{t.corpFormSuccess}</h2>
          <p className="text-[var(--km-text-secondary)] mb-2">{t.corpFormSuccessDesc}</p>
          <p className="text-[var(--km-text-secondary)] text-sm mb-8">
            {t.corpFormSuccessEmail} <span className="font-medium text-[var(--km-text)]">{form.email}</span>
          </p>
          <button
            onClick={() => { setForm(INITIAL_FORM); setSubmitted(false); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--km-brand)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            {t.corpFormResubmit}
          </button>
        </div>
      </div>
    );
  }

  const fieldClass = (name: keyof LeadForm) =>
    `w-full px-4 py-3 rounded-xl border text-[var(--km-text)] bg-white text-sm outline-none transition-colors focus:border-[var(--km-brand)] ${
      errors[name]
        ? "border-[var(--km-error)]"
        : "border-[var(--km-border)] hover:border-[var(--km-border-strong)]"
    }`;

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      {/* Hero */}
      <div className="relative bg-[var(--km-surface-dark)] text-[var(--km-text-inverse)] overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(245,166,0,0.08) 0%, transparent 65%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 border"
            style={{ background: "rgba(245,166,0,0.12)", borderColor: "rgba(245,166,0,0.35)", color: "#F5A600" }}>
            <Building2 size={12} />
            <span>{t.corpHeroTag}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">{t.corpTitle}</h1>
          <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10">
            {t.corpSubtitle}
          </p>
          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">{t.corpStat1Val}</div>
              <div className="text-xs text-white/45 mt-1">{t.corpStat1Sub}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">{t.corpStat2Val}</div>
              <div className="text-xs text-white/45 mt-1">{t.corpStat2Sub}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">{t.corpStat3Val}</div>
              <div className="text-xs text-white/45 mt-1">{t.corpStat3Sub}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="border-b border-[var(--km-border)]">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[var(--km-text)] text-center mb-8">{t.corpUseCaseTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="flex flex-col bg-white rounded-2xl p-5 border border-[var(--km-border)] gap-3">
                {/* Icon + Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--km-surface)] flex items-center justify-center flex-shrink-0">
                    <uc.icon size={20} className="text-[var(--km-text-secondary)]" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[var(--km-border)] bg-transparent text-[var(--km-text-secondary)]">
                    {uc.badge}
                  </span>
                </div>
                {/* Title + Desc */}
                <div>
                  <div className="font-bold text-[var(--km-text)] mb-1.5 leading-snug">{uc.title}</div>
                  <div className="text-sm text-[var(--km-text-secondary)] leading-relaxed">{uc.desc}</div>
                </div>
                {/* Scenario quote */}
                <div className="mt-auto pt-2 rounded-xl bg-[var(--km-surface)] px-3.5 py-2.5">
                  <p className="text-[12.5px] text-[var(--km-text-secondary)] italic leading-snug">{uc.scenario}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="border-b border-[var(--km-border)]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.25em] text-[var(--km-text-muted)] uppercase mb-2">{t.corpPricingTag}</p>
            <h2 className="text-2xl font-bold text-[var(--km-text)]">{t.corpPricingTitle}</h2>
          </div>
          <div className="space-y-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.range}
                className={`relative flex items-center justify-between px-6 py-5 rounded-2xl border transition-colors ${
                  tier.highlight
                    ? "bg-[#0A0A0A] border-[#0A0A0A]"
                    : "bg-white border-[var(--km-border)]"
                }`}
              >
                {/* Left: quantity */}
                <div className="flex items-center gap-4 min-w-[120px]">
                  <span className={`text-base font-semibold ${tier.highlight ? "text-white" : "text-[var(--km-text)]"}`}>
                    {tier.range}
                  </span>
                </div>
                {/* Center: discount */}
                <div className="flex-1 text-center">
                  <span className={`text-xl font-bold ${tier.highlight ? "text-[#F5A600]" : "text-[var(--km-text)]"}`}>
                    {tier.discount}
                  </span>
                </div>
                {/* Right: badge */}
                <div className="min-w-[100px] flex justify-end">
                  {tier.badge && (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      tier.highlight
                        ? "border-white/20 text-white/70 bg-white/10"
                        : "border-[var(--km-border)] text-[var(--km-text-muted)]"
                    }`}>
                      {tier.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--km-text-muted)] mt-5 text-center">
            {t.corpPricingNote}
          </p>
        </div>
      </div>

      {/* Quotation form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="border border-[var(--km-border)] rounded-2xl p-6 md:p-10">
          <h2 className="text-2xl font-bold text-[var(--km-text)] mb-2">{t.corpFormTitle}</h2>
          <p className="text-[var(--km-text-secondary)] mb-5">{t.corpFormSubtitle}</p>
          <a href="tel:0962286998" className="inline-flex items-center gap-2.5 mb-8 px-4 py-2.5 rounded-xl border border-[var(--km-border)] bg-[var(--km-surface)] hover:border-[var(--km-border-strong)] transition-colors">
            <Phone size={15} className="text-[#F5A600]" />
            <span className="text-sm font-medium text-[var(--km-text)]">096-228-6998</span>
            <span className="text-xs text-[var(--km-text-muted)]">{t.corpPhoneCTA}</span>
          </a>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--km-text)] mb-1.5">
                  {t.corpFormCompany} <span className="text-[var(--km-error)]">*</span>
                </label>
                <input type="text" name="companyName" value={form.companyName} onChange={handleChange} placeholder={t.corpFormCompanyPH} className={fieldClass("companyName")} />
                {errors.companyName && <p className="text-xs text-[var(--km-error)] mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--km-text)] mb-1.5">
                  {t.corpFormContact} <span className="text-[var(--km-error)]">*</span>
                </label>
                <input type="text" name="contactName" value={form.contactName} onChange={handleChange} placeholder={t.corpFormContactPH} className={fieldClass("contactName")} />
                {errors.contactName && <p className="text-xs text-[var(--km-error)] mt-1">{errors.contactName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--km-text)] mb-1.5">
                  {t.corpFormEmail} <span className="text-[var(--km-error)]">*</span>
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="somchai@company.com" className={fieldClass("email")} />
                {errors.email && <p className="text-xs text-[var(--km-error)] mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--km-text)] mb-1.5">
                  {t.corpFormPhone} <span className="text-[var(--km-error)]">*</span>
                </label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="081-xxx-xxxx" className={fieldClass("phone")} />
                {errors.phone && <p className="text-xs text-[var(--km-error)] mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--km-text)] mb-1.5">
                  {t.corpFormDevice} <span className="text-[var(--km-error)]">*</span>
                </label>
                <select name="deviceType" value={form.deviceType} onChange={handleChange} className={fieldClass("deviceType")}>
                  <option value="">{t.corpFormDevicePH}</option>
                  <option value="MacBook">MacBook (13" / 14" / 16")</option>
                  <option value="Universal">Universal Laptop</option>
                  <option value="Both">Mixed</option>
                </select>
                {errors.deviceType && <p className="text-xs text-[var(--km-error)] mt-1">{errors.deviceType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--km-text)] mb-1.5">
                  {t.corpFormQty} <span className="text-[var(--km-error)]">*</span>
                </label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="เช่น 10" min={1} className={fieldClass("quantity")} />
                {errors.quantity && <p className="text-xs text-[var(--km-error)] mt-1">{errors.quantity}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--km-text)] mb-1.5">
                {t.corpFormFilm} <span className="text-[var(--km-error)]">*</span>
              </label>
              <select name="filmType" value={form.filmType} onChange={handleChange} className={fieldClass("filmType")}>
                <option value="">{t.corpFormFilmPH}</option>
                <option value="Privacy">Privacy — Anti-Peep</option>
                <option value="Anti-Blue">Anti-Blue Light</option>
                <option value="Nano">Nano — Anti-Scratch</option>
                <option value="Mixed">Mixed</option>
              </select>
              {errors.filmType && <p className="text-xs text-[var(--km-error)] mt-1">{errors.filmType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--km-text)] mb-1.5">{t.corpFormNotes}</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder={t.corpFormNotesPH} className={`${fieldClass("notes")} resize-none`} />
            </div>

            <button type="submit" className="w-full py-4 bg-[var(--km-brand)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-base">
              {t.corpFormSubmit}
            </button>
            <p className="text-xs text-[var(--km-text-muted)] text-center">{t.corpFormPrivacy}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
