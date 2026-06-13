"use client";

import Link from "next/link";
import { Shield, Zap, Building2, Cpu } from "lucide-react";
import { useLang } from "@/contexts/lang";

export function HomeFeatures() {
  const { home: t } = useLang();

  const FEATURES = [
    { icon: Shield,    title: t.magneticTitle,  desc: t.magneticDesc  },
    { icon: Zap,       title: t.expressTitle,   desc: t.expressDesc,   href: "/express"    },
    { icon: Building2, title: t.corporateTitle, desc: t.corporateDesc, href: "/corporate"  },
    { icon: Cpu,       title: t.aiTitle,        desc: t.aiDesc,        href: "/ai-checker" },
  ];

  return (
    <section className="bg-[var(--km-surface-dark)] text-[var(--km-text-inverse)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map((f) => {
            const Inner = (
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors h-full">
                <f.icon size={20} strokeWidth={1.5} className="text-white/60" />
                <p className="text-sm font-semibold leading-snug">{f.title}</p>
                <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            );
            return f.href ? (
              <Link key={f.title} href={f.href}>{Inner}</Link>
            ) : (
              <div key={f.title}>{Inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
