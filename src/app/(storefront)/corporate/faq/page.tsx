"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "ราคา B2B คิดยังไง? มีส่วนลดตามปริมาณไหม?",
    a: "ราคาเริ่มต้นหลักร้อยบาทต่อชิ้น และมี 5 ระดับราคาตามจำนวนสั่งซื้อ ยิ่งสั่งมาก ราคาต่อชิ้นยิ่งลดลง\n\nระดับราคา: 1–9 / 10–49 / 50–99 / 100–199 / 200+ 🏆\n\nราคาแตกต่างตามขนาดและรุ่นสินค้า ขอใบเสนอราคาได้ 2 ช่องทาง: กรอกฟอร์มบนเว็บไซต์ (ทีมงานตอบกลับภายใน 24 ชั่วโมง) หรือทักหา @safescreenofficial ทุกวัน 9:00–22:00",
  },
  {
    q: "ออกใบกำกับภาษีได้ไหม? ใช้เบิกค่าใช้จ่ายบริษัทได้เลยไหม?",
    a: "ออกได้ทุกรายการ ทั้งใบกำกับภาษีแบบเต็มรูปแบบพร้อม VAT 7% เบิกค่าใช้จ่ายบริษัทได้เลย\n\nแจ้ง ชื่อบริษัท + เลขผู้เสียภาษี พร้อมที่อยู่สำนักงานในใบสั่งซื้อ ทีมงานจัดเตรียมให้ครบก่อนจัดส่ง",
  },
  {
    q: "MOQ ขั้นต่ำคือเท่าไหร่ถึงจะได้ราคา B2B?",
    a: "ไม่มีขั้นต่ำ เริ่มสั่งได้ตั้งแต่ 1 ชิ้น ราคา B2B จะดีขึ้นเรื่อยๆ ตามปริมาณ ยิ่งสั่งมากยิ่งคุ้ม\n\nสั่งปนหลายขนาดในออเดอร์เดียวได้เลย ราคา tier คิดจากจำนวนรวมทั้งออเดอร์",
  },
  {
    q: "องค์กรใช้ Laptop หลายแบรนด์หลายขนาด สั่งปนกันได้ไหม?",
    a: "ได้เลยครับ สั่งปน Dell, HP, Lenovo, ASUS, MacBook ต่างขนาดในออเดอร์เดียวได้ ราคา tier คำนวณจากจำนวนชิ้นรวมทั้งหมด ไม่แยกคิดแต่ละรุ่น\n\nส่งรายการรุ่นและขนาดมาให้ทีมงาน จะช่วยเลือกขนาดที่ถูกต้องสำหรับทุกเครื่องก่อนออกใบเสนอราคา",
  },
  {
    q: "มีฟิล์มกันมองสำหรับจอ Monitor (Desktop) ด้วยไหม?",
    a: "มีครับ รองรับจอ Monitor ขนาด 18\"–32\" มีให้เลือก 2 แบบ:\n\n🔹 แบบเสียบ + แถบกาวใส สอดขอบบนจอแล้วใช้แถบกาวใสยึดด้านล่าง ติดแน่น ถอดออกได้สะอาด\n\n🔹 แบบแม่เหล็ก ติดแถบแม่เหล็กที่ขอบจอแล้วดูดฟิล์มได้เลย ถอดติดได้บ่อย\n\n⚠️ ไม่รองรับจอโค้ง (Curved Monitor) ใช้ได้เฉพาะจอแบน (Flat Panel) เท่านั้น เหมาะสำหรับ Teller ธนาคาร, เจ้าหน้าที่โรงพยาบาล, Call Center และพนักงาน Front Desk",
  },
  {
    q: "ต้องผ่าน IT หรือฝ่ายจัดซื้อ มีเอกสารอะไรให้บ้าง?",
    a: "จัดเตรียมให้ครบ ได้แก่ ใบเสนอราคา, ใบกำกับภาษี VAT, ใบส่งสินค้า และหากต้องการเอกสารเพิ่มเติม เช่น หนังสือรับรองบริษัทหรือ Product Specification Sheet ทักแจ้งทีมงานได้เลย",
  },
  {
    q: "ต้องการคนติดตั้งให้ไหม? หรือติดเองได้?",
    a: "ติดตั้งเองได้ง่ายมาก ไม่ต้องใช้ทีมช่าง รุ่น MacBook วางลงได้เลยทันที รุ่น Laptop ติดแถบแม่เหล็กครั้งเดียวแล้วดูดฟิล์มได้เลย รุ่น Monitor สอดเข้าขอบบนจอ พนักงานทั่วไปทำเองได้ใน 2–3 นาที\n\n✅ ไม่มีบริการรับติดตั้ง แต่มีคู่มือและวิดีโอแนบมาพร้อมกับสินค้า",
  },
  {
    q: "ออเดอร์ B2B ใช้เวลาจัดส่งนานแค่ไหน?",
    a: "ระยะเวลาจัดส่งขึ้นอยู่กับจำนวน ทีมงานจะแจ้งกำหนดจัดส่งที่แน่นอนในใบเสนอราคา สามารถนัดวันจัดส่งล่วงหน้าได้ตามความสะดวก\n\nต้องการด่วน? ทักหา @safescreenofficial เพื่อเช็คสต็อกและกำหนดจัดส่งที่เร็วที่สุดได้เลย",
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
            <p
              key={i}
              className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-2 last:mb-0 whitespace-pre-line"
            >
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CorporateFaqPage() {
  return (
    <main className="bg-white min-h-screen pb-24">
      {/* Header */}
      <section className="border-b border-[var(--km-border)] px-4 py-10 text-center">
        <p className="text-xs text-[var(--km-text-muted)] tracking-widest uppercase mb-3">
          Part 2 of 2 · B2B FAQ
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-2">
          คำถามที่พบบ่อย องค์กร
        </h1>
        <p className="text-sm text-[var(--km-text-secondary)]">
          สำหรับฝ่ายจัดซื้อ HR และ IT
        </p>

        {/* Focus bar */}
        <div className="inline-flex flex-wrap justify-center gap-2 mt-4 text-xs text-[var(--km-text-secondary)]">
          <span className="bg-[var(--km-surface)] rounded-full px-3 py-1">💼 B2B · Corporate & Enterprise</span>
          <span className="bg-[var(--km-surface)] rounded-full px-3 py-1">ราคาพิเศษตามปริมาณ</span>
          <span className="bg-[var(--km-surface)] rounded-full px-3 py-1">ออกใบกำกับภาษีได้</span>
        </div>
      </section>

      {/* FAQ list */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {FAQS.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 mt-10 pt-8 border-t border-[var(--km-border)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--km-text-secondary)]">
            สอบถามและขอใบเสนอราคา @safescreenofficial ทุกวัน 9:00–22:00
          </p>
          <a
            href="/corporate"
            className="shrink-0 inline-block bg-[#2D2D2D] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-80 transition-opacity"
          >
            📋 ขอใบเสนอราคา
          </a>
        </div>
      </div>

      {/* Link to B2C FAQ */}
      <div className="max-w-2xl mx-auto px-4 mt-6 text-center">
        <p className="text-xs text-[var(--km-text-muted)]">
          ลูกค้าทั่วไป →{" "}
          <Link href="/faq" className="underline text-[var(--km-text-secondary)]">
            ดู FAQ ทั่วไป
          </Link>
        </p>
      </div>
    </main>
  );
}
