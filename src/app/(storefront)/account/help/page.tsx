"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ: { section: string; items: FaqItem[] }[] = [
  {
    section: "คำสั่งซื้อและการชำระเงิน",
    items: [
      { q: "ฉันสามารถยกเลิกคำสั่งซื้อได้หรือไม่?",         a: "คุณสามารถยกเลิกได้ภายใน 1 ชั่วโมงหลังสั่งซื้อ หากพ้นระยะเวลานี้ กรุณาติดต่อทีมดูแลลูกค้า" },
      { q: "ชำระเงินแล้ว แต่ไม่ได้รับการยืนยัน",             a: "การยืนยันผ่านอีเมลอาจใช้เวลา 5–15 นาที กรุณาตรวจสอบโฟลเดอร์สแปม หากเกิน 30 นาทีกรุณาติดต่อเรา" },
      { q: "สามารถเปลี่ยนที่อยู่จัดส่งหลังสั่งซื้อได้ไหม?",  a: "ได้ หากสินค้ายังไม่ถูกจัดส่ง กรุณาติดต่อทีมดูแลลูกค้าทันที" },
    ],
  },
  {
    section: "การจัดส่ง",
    items: [
      { q: "ใช้เวลาจัดส่งนานเท่าไหร่?",          a: "กรุงเทพฯ และปริมณฑล 1–2 วันทำการ ต่างจังหวัด 2–4 วันทำการ" },
      { q: "ฟรีค่าส่งเมื่อซื้อขั้นต่ำเท่าไหร่?",   a: "ฟรีค่าจัดส่งเมื่อซื้อครบ ฿599 ขึ้นไป" },
      { q: "ติดตามพัสดุได้อย่างไร?",              a: "เข้าเมนู คำสั่งซื้อ แล้วเลือกออเดอร์ที่ต้องการ จะเห็นสถานะการจัดส่งแบบเรียลไทม์" },
    ],
  },
  {
    section: "สินค้าและการคืน",
    items: [
      { q: "สินค้าของแท้ทุกชิ้นหรือไม่?",    a: "ใช่ สินค้าทุกชิ้นนำเข้าโดยตรงจาก SafeScreen Tech และแบรนด์ในเครือ มีใบรับรองความแท้ทุกชิ้น" },
      { q: "คืนสินค้าได้ภายในกี่วัน?",       a: "ภายใน 7 วันหลังได้รับสินค้า โดยสินค้าต้องอยู่ในสภาพเดิม ยังไม่ได้เปิดใช้ พร้อมบรรจุภัณฑ์ครบ" },
      { q: "ของแถมสามารถคืนได้หรือไม่?",    a: "ของแถมที่ได้รับมาพร้อมคำสั่งซื้อไม่สามารถคืนแยกได้ หากต้องการคืนสินค้าหลัก ของแถมต้องส่งคืนด้วย" },
    ],
  },
  {
    section: "บัญชีและคะแนนสะสม",
    items: [
      { q: "คะแนนสะสมหมดอายุไหม?",      a: "คะแนนสะสมมีอายุ 2 ปีนับจากวันที่ได้รับ และจะต่ออายุอัตโนมัติเมื่อมีการซื้อสินค้า" },
      { q: "ลืมรหัสผ่านต้องทำอย่างไร?",   a: "กดปุ่ม ลืมรหัสผ่าน ในหน้าเข้าสู่ระบบ จากนั้นระบบจะส่ง OTP ไปยังอีเมลหรือโทรศัพท์ที่ลงทะเบียน" },
    ],
  },
];

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--km-border)] last:border-b-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full px-4 py-4 text-left active:bg-[var(--km-surface)] transition-colors"
      >
        <span className="text-sm text-[var(--km-text)] pr-3 leading-snug">{item.q}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className="text-[var(--km-text-muted)] flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "300px" : "0px" }}
      >
        <p className="px-4 pb-4 text-xs text-[var(--km-text-muted)] leading-relaxed">
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="bg-[var(--km-surface)] min-h-screen pb-24">

      {/* FAQ */}
      <div className="pt-4 flex flex-col gap-4">
        {FAQ.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[13px] font-medium text-[var(--km-text-secondary)] pb-2">{section}</p>
            <div className="bg-white rounded-lg border border-[var(--km-border)] overflow-hidden">
              {items.map((item) => (
                <FaqRow key={item.q} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Policy links */}
      <p className="text-[13px] font-medium text-[var(--km-text-secondary)] pt-5 pb-2">เอกสารและนโยบาย</p>
      <div className="bg-white rounded-lg border border-[var(--km-border)] overflow-hidden">
        {[
          { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
          { label: "เงื่อนไขการใช้งาน",     href: "/terms"   },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between px-4 py-4 border-b border-[var(--km-border)] last:border-b-0 active:bg-[var(--km-surface)] transition-colors"
          >
            <span className="text-sm text-[var(--km-text)]">{label}</span>
            <ChevronRight size={14} strokeWidth={1.75} className="text-[var(--km-text-muted)]" />
          </Link>
        ))}
      </div>

    </div>
  );
}
