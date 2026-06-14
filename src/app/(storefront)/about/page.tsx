"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/lang";
import { useEffect, useRef, type ReactNode } from "react";

/* ── Scroll reveal wrapper ───────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}ms`;
          el.classList.add("reveal-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`reveal-hidden h-full ${className}`}>
      {children}
    </div>
  );
}

/* ── Contact channels ─────────────────────────────────── */
const CONTACTS = [
  {
    name: "LINE",
    handle: "@safescreenofficial",
    href: "https://line.me/ti/p/~@safescreenofficial",
    bg: "#06C755",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2.333C7.557 2.333 2.333 6.735 2.333 12.133c0 4.598 3.71 8.467 8.74 9.523.34.074.804.225.921.517.105.267.069.685.034.954l-.15.883c-.046.267-.21 1.045.916.57 1.126-.476 6.074-3.577 8.289-6.126C22.69 16.68 25.667 14.614 25.667 12.133 25.667 6.735 20.443 2.333 14 2.333z" fill="white"/>
        <path d="M11.083 10.208H9.917A.417.417 0 009.5 10.625v4.083c0 .23.187.417.417.417h1.166c.23 0 .417-.187.417-.417v-4.083a.417.417 0 00-.417-.417zM18.5 10.208h-1.167a.417.417 0 00-.416.417v2.427l-1.87-2.682a.42.42 0 00-.034-.043l-.002-.002a.415.415 0 00-.03-.029l-.008-.006a.416.416 0 00-.03-.022l-.01-.006a.417.417 0 00-.032-.016l-.01-.004a.42.42 0 00-.033-.012l-.012-.003a.422.422 0 00-.034-.007l-.013-.001a.428.428 0 00-.035-.002h-1.167a.417.417 0 00-.416.417v4.083c0 .23.186.417.416.417H15c.23 0 .417-.187.417-.417v-2.427l1.87 2.682c.013.018.028.035.044.05l.006.005c.01.008.02.016.031.023l.012.007.028.014.016.006.029.009.017.004a.422.422 0 00.03.004h.007a.43.43 0 00.076 0H18.5c.23 0 .416-.187.416-.417v-4.083a.417.417 0 00-.416-.417zM8.75 14.125H6.917v-3.5a.417.417 0 00-.834 0v4.083c0 .23.187.417.417.417H8.75c.23 0 .417-.187.417-.417a.417.417 0 00-.417-.583zM21.083 11.625a.417.417 0 00-.416-.417h-2.584a.417.417 0 000 .834h1.75v.875h-1.75a.417.417 0 000 .833h1.75v.875h-1.75a.417.417 0 000 .833h2.584c.23 0 .416-.186.416-.416v-4.417z" fill="#06C755"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    handle: "@safescreen.tech",
    href: "https://instagram.com/safescreen.tech",
    bg: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="6" fill="white"/>
        <rect x="9" y="9" width="10" height="10" rx="5" stroke="url(#igGrad)" strokeWidth="2" fill="none"/>
        <circle cx="19.5" cy="8.5" r="1.5" fill="url(#igGrad2)"/>
        <defs>
          <linearGradient id="igGrad" x1="9" y1="9" x2="19" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F58529"/><stop offset="0.5" stopColor="#DD2A7B"/><stop offset="1" stopColor="#515BD4"/>
          </linearGradient>
          <linearGradient id="igGrad2" x1="18" y1="7" x2="21" y2="10" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F58529"/><stop offset="1" stopColor="#DD2A7B"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "TikTok",
    handle: "@safescreen.tech",
    href: "https://tiktok.com/@safescreen.tech",
    bg: "#010101",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M19.5 5.5a4.5 4.5 0 01-4.5-4.5h-3v17.5a2.5 2.5 0 11-2.5-2.5c.23 0 .45.03.66.09V12.5a6.5 6.5 0 100 6.5V5.5h-1a7.5 7.5 0 007.5 7.5V9.87A7.96 7.96 0 0019.5 10V5.5z" fill="white"/>
      </svg>
    ),
  },
];

/* ── FAQ Card ─────────────────────────────────────────────── */
function FaqCard({ q, a }: { q: string; a: string }) {
  return (
    <div className="h-full bg-white rounded-2xl p-5 border border-[var(--km-border)] flex flex-col gap-2 transition-shadow hover:shadow-md">
      <h3 className="text-[15px] font-semibold text-[var(--km-text)] leading-snug">{q}</h3>
      <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed whitespace-pre-line">{a}</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AboutPage() {
  const { about: t } = useLang();


  const faqs = [
    { q: t.faq1Q, a: t.faq1A, detail: t.faq1Detail },
    { q: t.faq2Q, a: t.faq2A, detail: t.faq2Detail },
    { q: t.faq3Q, a: t.faq3A, detail: t.faq3Detail },
    { q: t.faq4Q, a: t.faq4A, detail: t.faq4Detail },
    { q: t.faq5Q, a: t.faq5A, detail: t.faq5Detail },
    { q: t.faq6Q, a: t.faq6A, detail: t.faq6Detail },
  ];

  const whyCards = [
    { icon: t.why1Icon, title: t.why1Title, body: t.why1Body },
    { icon: t.why2Icon, title: t.why2Title, body: t.why2Body },
    { icon: t.why3Icon, title: t.why3Title, body: t.why3Body },
  ];

  const stats = [
    { num: t.stat1Num, label: t.stat1Label },
    { num: t.stat2Num, label: t.stat2Label },
    { num: t.stat3Num, label: t.stat3Label },
    { num: t.stat4Num, label: t.stat4Label },
  ];

  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="bg-[#2D2D2D] text-white py-20 px-4 text-center">
        <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-4">{t.heroTag}</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{t.heroTitle}</h1>
        <p className="text-[var(--km-text-muted)] text-base md:text-lg max-w-xl mx-auto">{t.heroSubtitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{s.num}</div>
              <div className="text-xs text-[var(--km-text-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Origin Story */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <Reveal>
          <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-3">{t.originTag}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-2">{t.originTitle}</h2>
          <p className="text-xs text-[var(--km-text-muted)] mb-8">{t.originDate}</p>
          <div className="space-y-4 text-[var(--km-text-secondary)] leading-relaxed">
            <p>{t.originP1}</p>
            <p>{t.originP2}</p>
          </div>
          <blockquote className="border-l-4 border-[var(--km-text)] pl-5 my-8 text-[var(--km-text)] text-lg leading-relaxed">
            {t.originQuote}
          </blockquote>
          <p className="text-[var(--km-text-secondary)] leading-relaxed">{t.originP3}</p>
        </Reveal>
      </section>

      {/* Why Safescreen */}
      <section className="bg-[var(--km-surface)] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-3 text-center">{t.whyTag}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-10 text-center">{t.whyTitle}</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {whyCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div className="bg-white rounded-xl p-6 shadow-[var(--km-shadow-card)] h-full">
                  <div className="text-3xl mb-4">{c.icon}</div>
                  <h3 className="text-sm font-bold tracking-wider text-[var(--km-text)] mb-3">{c.title}</h3>
                  <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <Reveal>
          <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-3 text-center">{t.contactTag}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-3 text-center">{t.contactTitle}</h2>
          <p className="text-center text-[var(--km-text-secondary)] mb-10">{t.contactHours}</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONTACTS.map((c, i) => (
            <Reveal key={c.name} delay={i * 80}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-[var(--km-border)] hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: c.bg }}>
                  {c.icon}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-[var(--km-text)]">{c.name}</p>
                  <p className="text-[13px] text-[var(--km-text-muted)] mt-0.5">{c.handle}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--km-surface)] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-3 text-center">{t.faqTag}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-2 text-center">{t.faqTitle}</h2>
            <p className="text-center text-[var(--km-text-secondary)] mb-10">{t.faqSubtitle}</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <FaqCard q={item.q} a={item.a} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={100}>
            <div className="text-center mt-8">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-[14px] font-medium px-6 py-3 rounded-full border-2 transition-all"
                style={{ borderColor: "#F5A600", color: "#F5A600" }}
              >
                {t.faqViewAll} <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2D2D2D] text-white py-20 px-4 text-center">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t.ctaTitle}</h2>
          <p className="text-[var(--km-text-muted)] mb-8">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products"
              className="inline-block bg-white text-[#2D2D2D] font-semibold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors">
              {t.ctaShop}
            </Link>
            <a href="https://line.me/ti/p/~@safescreenofficial" target="_blank" rel="noopener noreferrer"
              className="inline-block border border-white text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-white/10 transition-colors">
              {t.ctaLine}
            </a>
          </div>
        </Reveal>
      </section>

    </main>
  );
}
