"use client";

import { useLang } from "@/contexts/lang";

const CONTENT = {
  TH: {
    title: "เงื่อนไขการใช้งาน",
    updated: "อัปเดตล่าสุด: 11 พฤษภาคม 2568",
    intro:
      "โปรดอ่านเงื่อนไขการใช้งานนี้อย่างละเอียดก่อนใช้งานแพลตฟอร์ม SafeScreen Tech การใช้งานเว็บไซต์หรือการสั่งซื้อสินค้าถือว่าคุณยอมรับเงื่อนไขทั้งหมดนี้",
    sections: [
      {
        title: "1. การยอมรับเงื่อนไข",
        body: "การเข้าถึงหรือใช้งานเว็บไซต์ safescreen.co.th ถือว่าคุณยอมรับเงื่อนไขการใช้งานฉบับนี้และนโยบายความเป็นส่วนตัวที่เกี่ยวข้องทั้งหมด หากคุณไม่ยอมรับ กรุณาหยุดใช้งานแพลตฟอร์ม",
      },
      {
        title: "2. บัญชีผู้ใช้",
        body: "คุณต้องให้ข้อมูลที่ถูกต้องและเป็นปัจจุบันในการสมัครสมาชิก คุณรับผิดชอบในการรักษาความลับของรหัสผ่านและกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ หากสงสัยว่าบัญชีถูกเข้าถึงโดยไม่ได้รับอนุญาต กรุณาติดต่อเราทันที",
      },
      {
        title: "3. การสั่งซื้อและชำระเงิน",
        body: "การสั่งซื้อจะสมบูรณ์เมื่อได้รับการยืนยันการชำระเงิน ราคาสินค้าแสดงเป็นบาทไทย (THB) รวม VAT 7% เราขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อที่มีข้อผิดพลาดด้านราคาหรือสต็อกสินค้าหมด และจะคืนเงินเต็มจำนวนผ่านช่องทางเดิม",
      },
      {
        title: "4. การจัดส่ง",
        body: "เราจัดส่งทั่วประเทศไทยผ่าน Kerry Express, Flash Express, และ Thailand Post EMS บริการ Express Delivery ใน 2 ชั่วโมงครอบคลุมเฉพาะกรุงเทพฯ และปริมณฑล ระยะเวลาจัดส่งมาตรฐานคือ 1–3 วันทำการ การล่าช้าอันเนื่องมาจากเหตุสุดวิสัยไม่อยู่ในความรับผิดชอบของเรา",
      },
      {
        title: "5. การคืนสินค้าและขอคืนเงิน",
        body: "คุณสามารถขอคืนสินค้าได้ภายใน 7 วันนับจากวันที่ได้รับสินค้า โดยสินค้าต้องอยู่ในสภาพสมบูรณ์และไม่ผ่านการใช้งาน ฟิล์มที่ติดตั้งแล้วหรือแกะซีลแล้วไม่สามารถคืนได้ กรุณาติดต่อเราก่อนส่งสินค้าคืนเพื่อรับ RMA เงินคืนอยู่ภายใต้นโยบายคืนเงินที่ระบุไว้แยกต่างหาก",
      },
      {
        title: "6. สินค้าและการรับประกัน",
        body: "สินค้าทุกชิ้นเป็นของแท้จาก SafeScreen Tech เราไม่รับผิดชอบต่อความเสียหายอันเกิดจากการติดตั้งผิดวิธี การใช้งานที่ไม่ถูกต้อง หรืออุบัติเหตุหลังจัดส่ง สินค้าที่ผิดพลาดหรือชำรุดจากโรงงาน กรุณาแจ้งภายใน 48 ชั่วโมงหลังได้รับสินค้า",
      },
      {
        title: "7. ทรัพย์สินทางปัญญา",
        body: "เนื้อหา ภาพ โลโก้ การออกแบบ และเครื่องหมายการค้าทั้งหมดบนแพลตฟอร์มเป็นทรัพย์สินของ SafeScreen Tech Co., Ltd. ห้ามคัดลอก ดัดแปลง หรือนำไปใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร",
      },
      {
        title: "8. ข้อจำกัดความรับผิด",
        body: "SafeScreen Tech จะไม่รับผิดชอบต่อความเสียหายทางอ้อม อุบัติเหตุ หรือผลสืบเนื่อง ที่เกิดจากการใช้หรือไม่สามารถใช้บริการได้ ความรับผิดสูงสุดจำกัดที่มูลค่าของคำสั่งซื้อที่เกี่ยวข้อง",
      },
      {
        title: "9. การเปลี่ยนแปลงเงื่อนไข",
        body: "เราขอสงวนสิทธิ์ในการแก้ไขเงื่อนไขการใช้งานได้ทุกเมื่อ การเปลี่ยนแปลงสำคัญจะแจ้งล่วงหน้าอย่างน้อย 7 วัน การใช้งานต่อหลังวันที่มีผลบังคับใช้ถือว่าคุณยอมรับเงื่อนไขใหม่",
      },
      {
        title: "10. กฎหมายที่ใช้บังคับ",
        body: "เงื่อนไขนี้อยู่ภายใต้กฎหมายแห่งราชอาณาจักรไทย ข้อพิพาทที่เกิดขึ้นจะอยู่ในเขตอำนาจของศาลไทย",
      },
    ],
  },
  EN: {
    title: "Terms of Service",
    updated: "Last updated: 11 May 2026",
    intro:
      "Please read these Terms of Service carefully before using the SafeScreen Tech platform. By accessing our website or placing an order, you agree to be bound by these terms.",
    sections: [
      {
        title: "1. Acceptance of Terms",
        body: "By accessing or using safescreen.co.th, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use of the platform.",
      },
      {
        title: "2. User Accounts",
        body: "You must provide accurate and up-to-date information when registering. You are responsible for maintaining the confidentiality of your password and for all activity under your account. Contact us immediately if you suspect unauthorized access.",
      },
      {
        title: "3. Orders & Payment",
        body: "Orders are complete upon payment confirmation. Prices are displayed in Thai Baht (THB) inclusive of 7% VAT. We reserve the right to cancel orders affected by pricing errors or stock unavailability and will issue a full refund to the original payment method.",
      },
      {
        title: "4. Shipping",
        body: "We ship nationwide via Kerry Express, Flash Express, and Thailand Post EMS. Express 2-hour delivery covers Bangkok and surrounding areas only. Standard delivery is 1–3 business days. Delays due to force majeure are outside our liability.",
      },
      {
        title: "5. Returns & Refunds",
        body: "Returns are accepted within 7 days of delivery for unused, undamaged products in original packaging. Applied or unsealed films cannot be returned. Contact us before shipping any item back to receive a Return Authorization (RMA). Refunds are governed by our Refund Policy.",
      },
      {
        title: "6. Products & Warranty",
        body: "All products are genuine SafeScreen Tech merchandise. We are not liable for damage caused by improper installation, misuse, or accidents after delivery. Defective or incorrect items must be reported within 48 hours of receipt.",
      },
      {
        title: "7. Intellectual Property",
        body: "All content, images, logos, designs, and trademarks on this platform are owned by SafeScreen Tech Co., Ltd. Reproduction, modification, or commercial use without written permission is prohibited.",
      },
      {
        title: "8. Limitation of Liability",
        body: "SafeScreen Tech is not liable for indirect, incidental, or consequential damages arising from the use or inability to use our services. Maximum liability is limited to the value of the relevant order.",
      },
      {
        title: "9. Changes to Terms",
        body: "We may modify these terms at any time. Significant changes will be communicated at least 7 days in advance. Continued use after the effective date constitutes acceptance of the updated terms.",
      },
      {
        title: "10. Governing Law",
        body: "These terms are governed by the laws of the Kingdom of Thailand. Any disputes shall be subject to the jurisdiction of Thai courts.",
      },
    ],
  },
};

export default function TermsPage() {
  const { _lang } = useLang();
  const lang: "TH" | "EN" = _lang === "EN" ? "EN" : "TH";
  const c = CONTENT[lang];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
      <p className="text-[11px] font-medium text-[var(--km-text-muted)] uppercase tracking-widest mb-2">
        {lang === "TH" ? "นโยบาย" : "Legal"}
      </p>
      <h1 className="text-xl font-semibold text-[var(--km-text)] mb-1">{c.title}</h1>
      <p className="text-[12px] text-[var(--km-text-muted)] mb-6">{c.updated}</p>

      <div className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed bg-[var(--km-surface)] border border-[var(--km-border)] rounded-xl px-4 py-4 mb-8">
        {c.intro}
      </div>

      <div className="flex flex-col gap-6">
        {c.sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-sm font-semibold text-[var(--km-text)] mb-1.5">{s.title}</h2>
            <p className="text-[13px] text-[var(--km-text-secondary)] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-[var(--km-border)] text-[12px] text-[var(--km-text-muted)] text-center">
        {lang === "TH"
          ? "เงื่อนไขนี้อยู่ภายใต้กฎหมายไทย © 2026 SafeScreen Tech Co., Ltd."
          : "These terms are governed by the laws of the Kingdom of Thailand. © 2026 SafeScreen Tech Co., Ltd."}
      </div>
    </div>
  );
}
