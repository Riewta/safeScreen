"use client";

import { MapPin, Clock, Phone } from "lucide-react";
import { useLang } from "@/contexts/lang";

export default function StorePage() {
  const { pages: t } = useLang();

  const STORES = [
    { name: "SafeScreen MBK Center",    address: t.storeAddr1, hours: "10:00 – 21:00", phone: "02-xxx-xxxx", zone: t.storeZone1 },
    { name: "SafeScreen Pantip Plaza",  address: t.storeAddr2, hours: "10:00 – 21:00", phone: "02-xxx-xxxx", zone: t.storeZone2 },
    { name: "SafeScreen IT Square",     address: t.storeAddr3, hours: "10:00 – 20:00", phone: "02-xxx-xxxx", zone: t.storeZone3 },
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
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
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
