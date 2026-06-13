"use client";

import Link from "next/link";
import { Zap, Clock, MapPin, ShoppingBag, CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/lang";

export default function ExpressPage() {
  const { pages: t } = useLang();

  const steps = [
    { step: "1", icon: ShoppingBag, title: t.expressStep1, desc: t.expressStep1Desc },
    { step: "2", icon: MapPin,      title: t.expressStep2, desc: t.expressStep2Desc },
    { step: "3", icon: CheckCircle, title: t.expressStep3, desc: t.expressStep3Desc },
    { step: "4", icon: Clock,       title: t.expressStep4, desc: t.expressStep4Desc },
  ];

  return (
    <div className="min-h-screen bg-[var(--km-surface-dark)] text-[var(--km-text-inverse)]">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6">
          <Zap size={14} className="text-yellow-400" />
          <span>{t.expressAvail}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Express Delivery</h1>
        <p className="text-xl text-white/70 mb-8 whitespace-pre-line">
          {t.expressSubtitle}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-colors text-lg"
        >
          <ShoppingBag size={20} />
          Shop Express Now
        </Link>
      </div>

      {/* How it works */}
      <div className="bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-10">{t.expressHowTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={22} className="text-white" />
                </div>
                <div className="text-xs text-white/40 mb-1">Step {item.step}</div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-white/60">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coverage areas */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">{t.expressCoverage}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "สุขุมวิท",
            "สีลม-สาทร",
            "อโศก",
            "พระราม 9",
            "ลาดพร้าว",
            "รัชดา",
            "ดอนเมือง",
            "พระราม 2",
          ].map((area) => (
            <div
              key={area}
              className="bg-white/10 rounded-xl px-4 py-3 text-center text-sm"
            >
              <MapPin size={14} className="inline mr-1 text-yellow-400" />
              {area}
            </div>
          ))}
        </div>
        <p className="text-center text-white/50 text-sm mt-6">
          *{t.expressCoverageDesc}
        </p>
      </div>

      {/* Pricing highlights */}
      <div className="bg-white/5 border-t border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-8">อัตราค่าจัดส่ง Express</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "ระยะใกล้ (≤5 กม.)",
                price: "49 ฿",
                detail: "จัดส่งภายใน 60 นาที",
              },
              {
                label: "ระยะกลาง (5–15 กม.)",
                price: "79 ฿",
                detail: "จัดส่งภายใน 90 นาที",
              },
              {
                label: "ระยะไกล (15–25 กม.)",
                price: "99 ฿",
                detail: "จัดส่งภายใน 120 นาที",
              },
            ].map((tier) => (
              <div
                key={tier.label}
                className="bg-white/10 rounded-2xl p-6 text-center border border-white/10"
              >
                <div className="text-sm text-white/60 mb-2">{tier.label}</div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">{tier.price}</div>
                <div className="text-xs text-white/50">{tier.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">สินค้าพร้อมส่ง Express</h2>
        <p className="text-white/60 mb-8">ฟิล์มกันเสือกทุกรุ่น พร้อมส่งด่วน ไม่ต้องรอนาน</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold px-8 py-4 rounded-full hover:bg-yellow-300 transition-colors"
        >
          <Zap size={18} />
          ดูสินค้า Express
        </Link>
      </div>
    </div>
  );
}
