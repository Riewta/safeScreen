"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap, Clock, MapPin, ShoppingBag, CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/lang";

/* ── Animated streak config ──────────────────────────────────── */
const STREAKS = [
  // { top%, width, height, delay, duration, opacity, angle }
  { top: 8,   w: 260, h: 1,  delay: 0,    dur: 1.4, op: 0.55, angle: 0   },
  { top: 22,  w: 420, h: 2,  delay: 0.3,  dur: 1.0, op: 0.35, angle: -3  },
  { top: 36,  w: 180, h: 1,  delay: 0.7,  dur: 1.8, op: 0.45, angle: 0   },
  { top: 48,  w: 520, h: 3,  delay: 0.1,  dur: 0.9, op: 0.25, angle: -6  },
  { top: 58,  w: 300, h: 1,  delay: 1.1,  dur: 1.3, op: 0.50, angle: 0   },
  { top: 70,  w: 200, h: 2,  delay: 0.5,  dur: 1.6, op: 0.40, angle: 2   },
  { top: 80,  w: 380, h: 1,  delay: 0.9,  dur: 1.1, op: 0.30, angle: -4  },
  { top: 90,  w: 150, h: 1,  delay: 0.2,  dur: 2.0, op: 0.45, angle: 0   },
  // thick glow streaks
  { top: 28,  w: 320, h: 16, delay: 0.4,  dur: 1.2, op: 0.07, angle: -3  },
  { top: 62,  w: 240, h: 24, delay: 0.8,  dur: 1.5, op: 0.08, angle: 2   },
];

export default function ExpressPage() {
  const { pages: t } = useLang();

  const steps = [
    { step: "1", icon: ShoppingBag, title: t.expressStep1, desc: t.expressStep1Desc },
    { step: "2", icon: MapPin,      title: t.expressStep2, desc: t.expressStep2Desc },
    { step: "3", icon: CheckCircle, title: t.expressStep3, desc: t.expressStep3Desc },
    { step: "4", icon: Clock,       title: t.expressStep4, desc: t.expressStep4Desc },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">

      {/* ── Animated background layer ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>

        {/* Soft yellow glow orbs */}
        <div style={{
          position: "absolute", left: "15%", top: "30%",
          width: 500, height: 300,
          background: "radial-gradient(ellipse, rgba(245,166,0,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "glowPulse 4s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", right: "5%", bottom: "20%",
          width: 350, height: 250,
          background: "radial-gradient(ellipse, rgba(245,166,0,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "glowPulse 5s ease-in-out infinite 1.5s",
        }} />

        {/* Speed streaks */}
        {STREAKS.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${s.top}%`,
              left: "-100%",
              width: s.w,
              height: s.h,
              borderRadius: 99,
              background: `linear-gradient(90deg, transparent 0%, #F5A600 40%, #FFD97A 60%, transparent 100%)`,
              opacity: s.op,
              transform: `rotate(${s.angle}deg)`,
              filter: s.h > 4 ? `blur(${s.h / 2}px)` : "none",
              animation: `streak ${s.dur}s linear infinite ${s.delay}s`,
            }}
          />
        ))}

        {/* Subtle grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,166,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <style>{`
        @keyframes streak {
          0%   { transform: translateX(0) rotate(var(--angle, 0deg));   opacity: 0; }
          5%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(calc(100vw + 200px)) rotate(var(--angle, 0deg)); opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.15); }
        }
      `}</style>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="relative z-10">

        {/* Hero + Steps */}
        <div className="max-w-5xl mx-auto px-8 md:px-16 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Left: Hero */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-6 border"
                style={{ background: "rgba(245,166,0,0.12)", borderColor: "rgba(245,166,0,0.3)", color: "#F5A600" }}>
                <Zap size={14} />
                <span>{t.expressAvail}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">
                Express
              </h1>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ color: "#F5A600" }}>
                Delivery
              </h1>
              <p className="text-lg text-white/60 mb-6 whitespace-pre-line leading-relaxed">
                {t.expressSubtitle}
              </p>
              {/* Shipping origin */}
              <div className="flex items-center gap-3 mb-10 p-3 rounded-xl border"
                style={{ background: "rgba(245,166,0,0.07)", borderColor: "rgba(245,166,0,0.2)" }}>
                <MapPin size={16} style={{ color: "#F5A600", flexShrink: 0 }} />
                <div>
                  <div className="text-xs text-white/40 mb-0.5">{t.expressShipFrom}</div>
                  <div className="text-sm font-semibold text-white">SafeScreen Hub · กรุงเทพฯ (สุขุมวิท)</div>
                </div>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-black transition-all hover:scale-105"
                style={{ background: "#F5A600", boxShadow: "0 0 24px rgba(245,166,0,0.5)" }}
              >
                <ShoppingBag size={20} />
                {t.expressShopNow}
              </Link>
            </div>

            {/* Right: Steps */}
            <div className="flex flex-col gap-6 md:pl-6">
              {steps.map((item, idx) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border"
                    style={{ background: "rgba(245,166,0,0.1)", borderColor: "rgba(245,166,0,0.25)" }}>
                    <item.icon size={18} style={{ color: "#F5A600" }} />
                  </div>
                  {/* connector line */}
                  <div className="flex-1">
                    <div className="text-xs mb-0.5" style={{ color: "rgba(245,166,0,0.5)" }}>
                      Step {item.step}
                    </div>
                    <div className="font-semibold text-white leading-tight">{item.title}</div>
                    <div className="text-sm text-white/50">{item.desc}</div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="absolute" style={{ display: "none" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="border-t border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="max-w-4xl mx-auto px-4 py-14">
            <h2 className="text-2xl font-bold text-center mb-10">{t.expressPricingTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "ระยะใกล้ (≤5 กม.)",      price: "49 ฿", detail: "จัดส่งภายใน 60 นาที" },
                { label: "ระยะกลาง (5–15 กม.)",     price: "79 ฿", detail: "จัดส่งภายใน 90 นาที" },
                { label: "ระยะไกล (15–25 กม.)",     price: "99 ฿", detail: "จัดส่งภายใน 120 นาที" },
              ].map((tier) => (
                <div key={tier.label} className="rounded-2xl p-6 text-center border"
                  style={{ background: "rgba(245,166,0,0.05)", borderColor: "rgba(245,166,0,0.15)" }}>
                  <div className="text-sm text-white/50 mb-3">{tier.label}</div>
                  <div className="text-3xl font-bold mb-1" style={{ color: "#F5A600" }}>{tier.price}</div>
                  <div className="text-xs text-white/40">{tier.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smoosh Banner */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/banners/Banner_4_PNG.png"
              alt="Now at Smoosh สามย่าน – SafeScreen Express"
              width={1080}
              height={1080}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-3">{t.expressCtaTitle}</h2>
          <p className="text-white/50 mb-8">{t.expressCtaSubtitle}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-black transition-all hover:scale-105"
            style={{ background: "#F5A600", boxShadow: "0 0 32px rgba(245,166,0,0.4)" }}
          >
            <Zap size={18} />
            {t.expressCtaBtn}
          </Link>
        </div>

      </div>
    </div>
  );
}
