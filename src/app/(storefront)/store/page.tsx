"use client";

import { MapPin, Clock, Phone } from "lucide-react";
import { useLang } from "@/contexts/lang";

export default function StorePage() {
  const { pages: t } = useLang();

  const STORES = [
    { name: "Smoosh", address: "Smoosh สามย่าน, กรุงเทพฯ", hours: "10:00 – 21:00", phone: "096-228-6998", zone: "Partner Store", mapsHref: "https://maps.app.goo.gl/dNWBbuyBDFWRo4Zq5" },
  ];

  const SERVICES = [
    { icon: "/icons/laptop_regular.svg",       title: t.storeSvc1Title, desc: t.storeSvc1Desc },
    { icon: "/icons/check_circle_regular.svg", title: t.storeSvc2Title, desc: t.storeSvc2Desc },
    { icon: "/icons/refresh_4_regular.svg",    title: t.storeSvc3Title, desc: t.storeSvc3Desc },
  ];

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page header */}
        <h1 className="text-3xl font-bold text-[var(--km-text)] mb-2">
          {t.storeTitle}
        </h1>
        <p className="text-[var(--km-text-secondary)] mb-10">
          {t.storeSubtitle}
        </p>

        {/* Store cards */}
        <div className="space-y-4">
          {STORES.map((store) => (
            <div
              key={store.name}
              className="bg-white border border-[var(--km-border)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="text-xs font-semibold text-[var(--km-text-muted)] uppercase tracking-wider mb-1">
                  {store.zone}
                </div>
                <h3 className="text-lg font-semibold text-[var(--km-text)] mb-3">
                  {store.name}
                </h3>
                <div className="flex items-start gap-2 text-sm text-[var(--km-text-secondary)] mb-1.5">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[var(--km-brand)]" />
                  {store.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--km-text-secondary)] mb-1.5">
                  <Clock size={14} className="flex-shrink-0 text-[var(--km-text-muted)]" />
                  {store.hours} {t.storeHours}
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--km-text-secondary)]">
                  <Phone size={14} className="flex-shrink-0 text-[var(--km-text-muted)]" />
                  {store.phone}
                </div>
              </div>
              <a
                href={store.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--km-surface)] border border-[var(--km-border)] rounded-full text-sm font-medium text-[var(--km-text)] hover:bg-[var(--km-border)] transition-colors whitespace-nowrap"
              >
                <MapPin size={14} />
                {t.storeViewMap}
              </a>
            </div>
          ))}
        </div>

        {/* Smoosh Map */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-medium text-[var(--km-text)]">{t.storeFindUs}</h2>
              <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5">{t.storeMapSubtitle}</p>
            </div>
            <a
              href="https://maps.app.goo.gl/dNWBbuyBDFWRo4Zq5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium px-4 py-2 rounded-full border border-[var(--km-border)] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)] hover:text-[var(--km-text)] transition-all flex-shrink-0"
            >
              {t.storeNavigate}
            </a>
          </div>
          <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--km-border)]" style={{ height: 220 }}>
            <iframe
              src={`https://maps.google.com/maps?q=13.7352042,100.526381&z=17&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Smoosh location"
            />
            {/* Yellow pin overlay */}
            <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -100%)" }}>
              <div style={{
                position: "absolute", width: 44, height: 44, borderRadius: "50%",
                top: "50%", left: "50%", transform: "translate(-50%, -30%)",
                background: "rgba(245,166,0,0.2)",
                boxShadow: "0 0 0 6px rgba(245,166,0,0.1), 0 0 24px 8px rgba(245,166,0,0.3)",
                animation: "mapPinPulse 2s ease-in-out infinite",
              }} />
              <svg width="36" height="48" viewBox="0 0 36 48" fill="none" style={{ filter: "drop-shadow(0 4px 12px rgba(245,166,0,0.7))" }}>
                <path d="M18 0C8.059 0 0 8.059 0 18c0 12.657 18 30 18 30S36 30.657 36 18C36 8.059 27.941 0 18 0z" fill="#F5A600" />
                <circle cx="18" cy="17" r="7" fill="white" opacity="0.95" />
              </svg>
            </div>
          </div>
          <style>{`
            @keyframes mapPinPulse {
              0%, 100% { transform: translate(-50%, -30%) scale(1); opacity: 0.9; }
              50%       { transform: translate(-50%, -30%) scale(1.5); opacity: 0.3; }
            }
          `}</style>
        </div>

        {/* Services available in-store */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-[var(--km-surface)] rounded-2xl p-5 text-center border border-[var(--km-border)]"
            >
              <div className="flex justify-center mb-3">
                <img src={service.icon} alt="" aria-hidden="true" className="w-10 h-10" />
              </div>
              <div className="font-semibold text-[var(--km-text)] mb-1">{service.title}</div>
              <div className="text-sm text-[var(--km-text-secondary)]">{service.desc}</div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 p-6 bg-[var(--km-surface)] rounded-2xl text-center border border-[var(--km-border)]">
          <p className="text-[var(--km-text-secondary)] text-sm mb-1">{t.storeContactQ}</p>
          <p className="text-[var(--km-text)] font-medium">{t.storeContactA}</p>
        </div>
      </div>
    </div>
  );
}
