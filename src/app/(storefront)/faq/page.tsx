"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "[MacBook] ฟิล์มแม่เหล็กติดอย่างไร? ติดแน่นไหม?",
    a: "ยึดด้วยแม่เหล็กด้านบน + Nano-adhesive ด้านล่าง วางลงได้เลยทันที ไม่หลุดเองระหว่างใช้งาน ถอดออกด้วยมือได้ง่ายเมื่อต้องการ",
  },
  {
    q: "[Laptop] ฟิล์มแม่เหล็กสำหรับ Laptop ติดตั้งอย่างไร?",
    a: "มี 2 ขั้นตอนก่อนใช้งานครั้งแรก\n\n1. ติดแถบแม่เหล็กที่ขอบด้านบนของตัวจอ — ติดทิ้งไว้ได้เลย ไม่ต้องถอดออกทุกวัน\n2. นำตัวฟิล์มมาดูดติดกับแถบแม่เหล็กได้เลย — ถอดติดได้ทุกครั้งที่ต้องการ",
  },
  {
    q: "[Laptop] ติดแม่เหล็กบน Laptop ของบริษัทได้ไหม? กลัวเสียหาย",
    a: "ได้เลยครับ — ใช้แม่เหล็กแบบนุ่ม ไม่ส่งผลต่อระบบภายใน Laptop ไม่ว่าจะเป็น SSD หรือชิ้นส่วนอิเล็กทรอนิกส์ใดๆ\n\n✅ ไม่เสียหาย · ไม่ทิ้งคราบกาว — ถอดออกแล้วไม่มีร่องรอยใดๆ คืน Laptop ให้บริษัทได้สะอาด",
  },
  {
    q: "[ทุกรุ่น] ใช้กับ MacBook / Laptop / iPad รุ่นของฉันได้ไหม?",
    a: "รองรับกว่า 200+ รุ่น ทั้ง MacBook Air/Pro 13\"–16\", Laptop Windows ทุกแบรนด์ และ iPad Air/Pro ทุกรุ่น\n\nไม่แน่ใจขนาด? ใช้ AI Search บนเว็บ หรือ Line @safescreen ให้ทีมงานช่วยฟรี",
  },
  {
    q: "ภาพมืดลงไหมหลังติดฟิล์ม?",
    a: "ความสว่างลดลงประมาณ 25–30% เพิ่ม brightness ขึ้น 1–2 ขีดก็ใช้งานได้ปกติ อยากดูหนัง? ถอดฟิล์มออกได้ทันที",
  },
  {
    q: "ฟิล์มกันมองตั้งแต่มุมเท่าไหร่?",
    a: "กันมองตั้งแต่ 30 องศา — คนที่นั่งเยื้องออกไปจะเห็นแค่จอดำ เหมาะสำหรับ Open Office, คาเฟ่, BTS, เครื่องบิน",
  },
  {
    q: "[MacBook] แถบกาวด้านล่างหายเหนียว ทำยังไง?",
    a: "ล้างด้วยน้ำสะอาด รอให้แห้งสนิท — ความเหนียวกลับมาเหมือนเดิม ไม่ต้องซื้อใหม่ ไม่ต้องใช้สบู่หรือน้ำยา",
  },
  {
    q: "[!] สั่งผิดขนาด เปลี่ยนได้ไหม?",
    a: "เปลี่ยนได้ภายใน 7 วันนับจากวันรับสินค้า\n\nไม่แน่ใจขนาดก่อนสั่ง? เช็คได้เลยผ่าน AI Search บนเว็บ ตลอด 24 ชั่วโมง หรือทักหา @safescreenofficial ให้ทีมงานช่วย ทุกวัน 9:00–22:00",
  },
  {
    q: "[vs] รุ่น Magnetic กับ Nano ต่างกันอย่างไร? ควรเลือกรุ่นไหน?",
    a: "ทั้งสองรุ่นกันมองได้เท่ากัน ต่างกันที่พฤติกรรมการใช้งาน — ทั้ง MacBook และ Laptop มีให้เลือกทั้งสองรุ่น\n\n🧲 Magnetic: ถอดติดได้บ่อย ง่ายและเร็ว เหมาะคนที่ถอดบ่อย\n📌 Nano: ไม่แนะนำถอดบ่อย แต่ยังถอดได้ เหมาะคนอยากติดถาวรแต่กลัวติดยาก\n\nทั้งสองรุ่น: กาวหายเหนียว → ล้างน้ำ รอแห้ง → เหนียวเหมือนเดิม",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--km-border)] last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-medium text-[var(--km-text)]">{q}</span>
        <span className="shrink-0 text-[var(--km-text-muted)] text-lg leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="pb-4 pr-6">
          {a.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-2 last:mb-0 whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="bg-white min-h-screen pb-24">
      {/* Header */}
      <section className="border-b border-[var(--km-border)] px-4 py-10 text-center">
        <p className="text-xs text-[var(--km-text-muted)] tracking-widest uppercase mb-3">
          Part 1 of 2 · B2C FAQ
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-2">
          คำถามที่พบบ่อย
        </h1>
        <p className="text-sm text-[var(--km-text-secondary)]">
          MacBook / Laptop / iPad · รุ่น Magnetic และ Nano
        </p>

        {/* Focus bar */}
        <div className="inline-flex flex-wrap justify-center gap-2 mt-4 text-xs text-[var(--km-text-secondary)]">
          <span className="bg-[var(--km-surface)] rounded-full px-3 py-1">🧲 Magnetic Privacy Screen</span>
          <span className="bg-[var(--km-surface)] rounded-full px-3 py-1">ครอบคลุมทั้ง MacBook และ Laptop</span>
        </div>
      </section>

      {/* FAQ list */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {FAQS.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 mt-10 pt-8 border-t border-[var(--km-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--km-text-secondary)]">
          มีคำถาม? Line: @safescreenofficial ตอบรวดเร็ว
        </p>
        <a
          href="https://line.me/ti/p/~@safescreenofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-block bg-[#06C755] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          💬 Line: @safescreenofficial
        </a>
      </div>

      {/* Link to B2B FAQ */}
      <div className="max-w-2xl mx-auto px-4 mt-6 text-center">
        <p className="text-xs text-[var(--km-text-muted)]">
          องค์กรและฝ่ายจัดซื้อ →{" "}
          <Link href="/corporate/faq" className="underline text-[var(--km-text-secondary)]">
            ดู FAQ สำหรับองค์กร
          </Link>
        </p>
      </div>
    </main>
  );
}
