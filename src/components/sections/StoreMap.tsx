"use client";

import { useLang } from "@/contexts/lang";

/* พิกัด: Smoosh สามย่าน */
const LAT = 13.7352042;
const LNG = 100.526381;
const ZOOM = 17;

export function StoreMap() {
  const { home: t } = useLang();

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-medium text-[var(--km-text)]">{t.storeMapTitle}</h2>
            <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5">
              {t.storeMapAddress}
            </p>
          </div>
          <a
            href="https://maps.app.goo.gl/dNWBbuyBDFWRo4Zq5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium px-4 py-2 rounded-full border border-[var(--km-border)] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)] hover:text-[var(--km-text)] transition-all flex-shrink-0"
          >
            {t.storeMapNavigate}
          </a>
        </div>

        {/* Map container */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--km-border)]" style={{ height: 220 }}>

          {/* Google Maps — centered on coordinates, no default pin */}
          <iframe
            src={`https://maps.google.com/maps?q=${LAT},${LNG}&z=${ZOOM}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SafeScreen Tech location"
          />

          {/* Yellow glowing pin — centered on map = centered on store location */}
          <div
            className="absolute pointer-events-none"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -100%)" }}
          >
            {/* Pulse ring */}
            <div
              style={{
                position: "absolute",
                width: 44,
                height: 44,
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -30%)",
                background: "rgba(245,166,0,0.2)",
                boxShadow: "0 0 0 6px rgba(245,166,0,0.1), 0 0 24px 8px rgba(245,166,0,0.3)",
                animation: "mapPinPulse 2s ease-in-out infinite",
              }}
            />

            {/* Pin SVG */}
            <svg
              width="36"
              height="48"
              viewBox="0 0 36 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "drop-shadow(0 4px 12px rgba(245,166,0,0.7)) drop-shadow(0 0 6px rgba(245,166,0,0.5))" }}
            >
              <path
                d="M18 0C8.059 0 0 8.059 0 18c0 12.657 18 30 18 30S36 30.657 36 18C36 8.059 27.941 0 18 0z"
                fill="#F5A600"
              />
              <circle cx="18" cy="17" r="7" fill="white" opacity="0.95" />
            </svg>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes mapPinPulse {
          0%, 100% { transform: translate(-50%, -30%) scale(1);    opacity: 0.9; }
          50%       { transform: translate(-50%, -30%) scale(1.5);  opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
