"use client";

import { useLang } from "@/contexts/lang";

export function StoreServices() {
  const { pages: t } = useLang();

  const SERVICES = [
    { icon: "/icons/laptop_regular.svg",       title: t.storeSvc1Title, desc: t.storeSvc1Desc },
    { icon: "/icons/check_circle_regular.svg", title: t.storeSvc2Title, desc: t.storeSvc2Desc },
    { icon: "/icons/refresh_4_regular.svg",    title: t.storeSvc3Title, desc: t.storeSvc3Desc },
  ];

  return (
    <section className="pt-4 pb-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </section>
  );
}
