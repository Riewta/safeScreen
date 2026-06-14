"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { useLang } from "@/contexts/lang";

const FAQS_TH = [
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

const FAQS_EN = [
  {
    q: "[MacBook] How does the magnetic film attach? Is it secure?",
    a: "It secures with magnets at the top + Nano-adhesive at the bottom. Just place it down — it won't fall off during use. Remove it easily by hand whenever needed.",
  },
  {
    q: "[Laptop] How do I install the magnetic film on a Laptop?",
    a: "Two steps before first use:\n\n1. Attach the magnetic strip to the top edge of your screen — leave it on permanently, no need to remove it daily.\n2. Snap the film onto the magnetic strip — detach and reattach whenever you want.",
  },
  {
    q: "[Laptop] Can I attach the magnet to my company Laptop? Will it cause damage?",
    a: "Absolutely fine — it uses soft magnets that do not affect internal components including SSD or any electronics.\n\n✅ No damage · No adhesive residue — remove it and return your Laptop spotlessly clean.",
  },
  {
    q: "[All models] Does it fit my MacBook / Laptop / iPad?",
    a: "Compatible with 200+ models including MacBook Air/Pro 13\"–16\", all Windows laptop brands, and iPad Air/Pro.\n\nNot sure about your size? Use AI Search on the website or Line @safescreen for free assistance.",
  },
  {
    q: "Does the screen get darker after applying the film?",
    a: "Brightness decreases by about 25–30%. Simply increase brightness by 1–2 notches and it works normally. Want to watch a movie? Remove the film instantly.",
  },
  {
    q: "From what angle does the privacy filter work?",
    a: "Privacy protection starts at 30 degrees — anyone sitting beside you will only see a dark screen. Perfect for open offices, cafés, BTS, and flights.",
  },
  {
    q: "[MacBook] The bottom adhesive strip lost its stickiness. What do I do?",
    a: "Rinse with clean water and let it dry completely — stickiness comes back like new. No need to buy a replacement. No soap or cleaning products needed.",
  },
  {
    q: "[!] I ordered the wrong size. Can I exchange it?",
    a: "Yes, exchanges are accepted within 7 days of receiving the item.\n\nNot sure about the size before ordering? Check anytime via AI Search on the website (24/7) or message @safescreenofficial — available daily 9:00–22:00.",
  },
  {
    q: "[vs] What's the difference between Magnetic and Nano? Which should I choose?",
    a: "Both provide the same level of privacy protection — the difference is how you use them. Both MacBook and Laptop versions are available in each type.\n\n🧲 Magnetic: Easy and fast attach/detach, great for frequent removal.\n📌 Nano: Not recommended for frequent removal, ideal for those wanting a more permanent fit.\n\nBoth types: if adhesive loses stickiness → rinse with water, let dry → sticky again.",
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
        <CaretDown
          size={16}
          className="text-[var(--km-text-muted)] shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
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

export function FAQ() {
  const { _lang } = useLang();
  const faqs = _lang === "EN" ? FAQS_EN : FAQS_TH;
  const title = _lang === "EN" ? "Frequently Asked Questions" : "คำถามที่พบบ่อย";

  return (
    <section className="pt-4 pb-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-[18px] font-medium text-[var(--km-text)] mb-4">{title}</h2>
        <div>
          {faqs.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
