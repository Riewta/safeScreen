"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, BadgeCheck, Sparkles } from "lucide-react";
import { useLang } from "@/contexts/lang";
import { useEffect, useRef, type ReactNode } from "react";
import { FaInstagram, FaLine, FaTiktok } from "react-icons/fa6";

const BLOG_POSTS = [
  {
    slug: "magnetic-privacy-screen-explained",
    title: "ฟิล์มกันเสือกแม่เหล็กคืออะไร? ทำไมถึงดีกว่าฟิล์มทั่วไป",
    excerpt: "ฟิล์มกันเสือกระบบแม่เหล็ก Easy Snap ติดง่าย ถอดง่าย ไม่ทิ้งคราบกาว เหมาะสำหรับผู้ที่ต้องการความเป็นส่วนตัวในที่สาธารณะ",
    category: "Guide",
    categoryClass: "bg-blue-50 text-blue-700",
    image: "/products/privacy-macbook/privacy-macbook-air-13-3.jpg",
  },
  {
    slug: "blue-light-protection-work-from-home",
    title: "ป้องกันแสงสีฟ้า: ทำไม WFH ถึงต้องใช้ฟิล์ม Anti-Blue",
    excerpt: "การทำงานหน้าจอนาน 8+ ชั่วโมงต่อวัน ส่งผลต่อสายตาอย่างไร และฟิล์มกรองแสงสีฟ้าช่วยได้แค่ไหน",
    category: "Health",
    categoryClass: "bg-green-50 text-green-700",
    image: "/products/anti-blue-macbook/anti-blue-macbook-air-13-3.jpg",
  },
  {
    slug: "choose-right-film-macbook",
    title: "เลือกฟิล์มให้ถูกรุ่น: คู่มือฉบับสมบูรณ์สำหรับ MacBook ทุกรุ่น",
    excerpt: 'MacBook มีหลายขนาดและรุ่น ตั้งแต่ Air 13.3" ถึง Pro 16.2" M5 คู่มือนี้ช่วยให้คุณเลือกฟิล์มได้ถูกต้อง',
    category: "Guide",
    categoryClass: "bg-blue-50 text-blue-700",
    image: "/products/privacy-macbook/privacy-macbook-air-13-6.jpg",
  },
];

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
    href: "https://line.me/R/ti/p/@safescreenofficial",
    color: "#06C755",
    Icon: FaLine,
  },
  {
    name: "Instagram",
    handle: "@safescreen.official",
    href: "https://www.instagram.com/safescreen.official",
    color: "#E1306C",
    Icon: FaInstagram,
  },
  {
    name: "TikTok",
    handle: "@safescreen.official",
    href: "https://www.tiktok.com/@safescreen.official",
    color: "#010101",
    Icon: FaTiktok,
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
    { Icon: ShieldCheck, color: "#F5A600", title: t.why1Title, body: t.why1Body },
    { Icon: BadgeCheck,  color: "#16A34A", title: t.why2Title, body: t.why2Body },
    { Icon: Sparkles,    color: "#2563EB", title: t.why3Title, body: t.why3Body },
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
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${c.color}18` }}>
                    <c.Icon size={22} style={{ color: c.color }} />
                  </div>
                  <h3 className="text-sm font-bold tracking-wider text-[var(--km-text)] mb-3">{c.title}</h3>
                  <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <Reveal>
          <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-3 text-center">KNOWLEDGE BASE</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-2 text-center">บทความที่น่าสนใจ</h2>
          <p className="text-center text-[var(--km-text-secondary)] mb-10">ความรู้เกี่ยวกับฟิล์มกันมอง การดูแลสายตา และเทคโนโลยีหน้าจอ</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {BLOG_POSTS.map((post, i) => (
            <Reveal key={post.slug} delay={i * 80}>
              <Link href={`/blog/${post.slug}`} className="h-full group block bg-white rounded-2xl border border-[var(--km-border)] overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-[var(--km-surface)] overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-4">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${post.categoryClass}`}>{post.category}</span>
                  <h3 className="text-[14px] font-bold text-[var(--km-text)] mt-2 mb-1 leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-[12px] text-[var(--km-text-muted)] line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={100}>
          <div className="text-center mt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[14px] font-medium px-6 py-3 rounded-full border-2 transition-all" style={{ borderColor: "#F5A600", color: "#F5A600" }}>
              ดูบทความทั้งหมด <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
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
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm bg-[var(--km-surface)]">
                  <c.Icon size={28} style={{ color: c.color }} />
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
