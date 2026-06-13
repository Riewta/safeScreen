"use client";

import { useState } from "react";
import { CheckCircle, Building2, Users, FileText, Truck } from "lucide-react";
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

const PRICING_TIERS = [
  { range: "5–19 ชิ้น", discount: "ราคาปกติ", badge: "", highlight: false },
  { range: "20–49 ชิ้น", discount: "ลด 5%", badge: "Popular", highlight: false },
  { range: "50–99 ชิ้น", discount: "ลด 10%", badge: "Best Value", highlight: true },
  { range: "100+ ชิ้น", discount: "Custom Quote", badge: "Enterprise", highlight: false },
];


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
  const [form, setForm] = useState<LeadForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});

  const BENEFITS = [
    { icon: Building2, title: t.corpBulkTitle,     desc: t.corpBulkDesc },
    { icon: Users,     title: t.corpManagerTitle,  desc: t.corpManagerDesc },
    { icon: FileText,  title: t.corpInvoiceTitle,  desc: t.corpInvoiceDesc },
    { icon: Truck,     title: t.corpDeliveryTitle, desc: t.corpDeliveryDesc },
  ];

  function validate(): boolean {
    const newErrors: Partial<Record<keyof LeadForm, string>> = {};
    if (!form.companyName.trim()) newErrors.companyName = "กรุณากรอกชื่อบริษัท";
    if (!form.contactName.trim()) newErrors.contactName = "กรุณากรอกชื่อผู้ติดต่อ";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "กรุณากรอกอีเมลที่ถูกต้อง";
    if (!form.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!form.deviceType) newErrors.deviceType = "กรุณาเลือกประเภทอุปกรณ์";
    if (!form.quantity.trim() || isNaN(Number(form.quantity)) || Number(form.quantity) < 5)
      newErrors.quantity = "จำนวนขั้นต่ำ 5 ชิ้น";
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
      <div className="bg-[var(--km-surface-dark)] text-[var(--km-text-inverse)]">
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <Building2 size={14} />
            <span>B2B / Corporate</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.corpTitle}</h1>
          <p className="text-xl text-white/70 max-w-xl mx-auto">
            {t.corpSubtitle}
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="border-b border-[var(--km-border)]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[var(--km-text)] text-center mb-8">
            {t.corpWhyTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 bg-[var(--km-surface)] rounded-2xl p-5 border border-[var(--km-border)]"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--km-brand-light)] flex items-center justify-center flex-shrink-0">
                  <b.icon size={20} className="text-[var(--km-brand)]" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--km-text)] mb-1">{b.title}</div>
                  <div className="text-sm text-[var(--km-text-secondary)]">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="border-b border-[var(--km-border)]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[var(--km-text)] text-center mb-8">
            Volume Pricing
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--km-surface)] border-y border-[var(--km-border)]">
                  <th className="text-left px-5 py-3.5 font-semibold text-[var(--km-text)]">
                    จำนวนสั่งซื้อ
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[var(--km-text)]">
                    ส่วนลด
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[var(--km-text)]">
                    หมายเหตุ
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_TIERS.map((tier) => (
                  <tr
                    key={tier.range}
                    className={`border-b border-[var(--km-border)] ${
                      tier.highlight ? "bg-[var(--km-brand-light)]" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-[var(--km-text)]">
                      {tier.range}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-semibold ${
                          tier.highlight
                            ? "text-[var(--km-brand)]"
                            : "text-[var(--km-text)]"
                        }`}
                      >
                        {tier.discount}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {tier.badge && (
                        <span className="inline-block text-xs font-semibold bg-[var(--km-brand)] text-white px-2.5 py-1 rounded-full">
                          {tier.badge}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--km-text-muted)] mt-4 text-center">
            *ราคาขึ้นอยู่กับรุ่นสินค้าและปริมาณ ทีมงานจะยืนยันราคาสุดท้ายหลังรับใบเสนอราคา
          </p>
        </div>
      </div>

      {/* Quotation form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div>
          <h2 className="text-2xl font-bold text-[var(--km-text)] mb-2">{t.corpFormTitle}</h2>
          <p className="text-[var(--km-text-secondary)] mb-8">{t.corpFormSubtitle}</p>

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
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder={t.corpFormQtyPH} min={5} className={fieldClass("quantity")} />
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
