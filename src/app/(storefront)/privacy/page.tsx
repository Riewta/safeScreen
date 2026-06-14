export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-[var(--km-border)] px-4 py-12 text-center">
        <p className="text-[11px] font-medium text-[var(--km-text-muted)] tracking-[0.18em] uppercase mb-4">
          Legal Document
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--km-text)] mb-3">
          นโยบายความเป็นส่วนตัว
        </h1>
        <p className="text-sm text-[var(--km-text-secondary)] mb-5">
          Privacy Policy · บริษัท รวยเสมอ จำกัด (SafeScreen Tech)
        </p>
        <div className="inline-flex items-center gap-3 text-[12px] text-[var(--km-text-muted)]">
          <span>มีผลบังคับใช้ตั้งแต่ 1 มกราคม 2568</span>
          <span className="w-1 h-1 rounded-full bg-[var(--km-border-strong)]" />
          <span>ปรับปรุงล่าสุด มิถุนายน 2568</span>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-10">
        {/* Intro */}
        <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">
          บริษัท รวยเสมอ จำกัด ผู้ดำเนินธุรกิจภายใต้ชื่อ "Safescreen" ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่านตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) นโยบายนี้อธิบายว่าเราเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่านอย่างไร
        </p>

        {/* 1. Controller */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">1. ผู้ควบคุมข้อมูลส่วนบุคคล</h2>
          <div className="bg-[var(--km-surface)] rounded-xl p-5 text-sm text-[var(--km-text-secondary)] space-y-1 leading-relaxed">
            <p className="font-semibold text-[var(--km-text)]">บริษัท รวยเสมอ จำกัด</p>
            <p>38 หมู่ 4 ซอยกระทุ่มล้ม 27 ถนนพุทธมณฑลสาย 4</p>
            <p>ตำบลกระทุ่มล้ม อำเภอสามพราน จังหวัดนครปฐม 73220</p>
            <p>เลขประจำตัวผู้เสียภาษี: 0735566005547</p>
            <p>เว็บไซต์: safescreentech.com</p>
            <p>อีเมล: Safescreen.tech@gmail.com</p>
            <p>Line OA: @safescreenofficial</p>
          </div>
        </section>

        {/* 2. Data collected */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">2. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</h2>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-4">
            เราเก็บรวบรวมข้อมูลส่วนบุคคลดังต่อไปนี้เพื่อการให้บริการ:
          </p>

          <div className="space-y-4">
            {[
              {
                title: "2.1 ลูกค้าทั่วไป",
                items: [
                  "ข้อมูลสำหรับจัดส่ง: ชื่อ-นามสกุล ที่อยู่จัดส่ง และเบอร์โทรศัพท์",
                  "ประวัติการสั่งซื้อ: รายการสินค้า จำนวน มูลค่า วันที่สั่งซื้อ และสถานะออเดอร์",
                  "ข้อมูลการชำระเงิน: หลักฐานการโอนเงิน (สลิป) หรือข้อมูลการจัดส่งแบบเก็บเงินปลายทาง (COD) โดยเราไม่จัดเก็บข้อมูลบัตรเครดิตหรือข้อมูลบัญชีธนาคารโดยตรง",
                  "ข้อมูลการสื่อสาร: ข้อความที่ท่านส่งมาผ่าน Line OA หรือช่องทางติดต่ออื่นๆ",
                ],
              },
              {
                title: "2.2 ลูกค้าองค์กร",
                items: [
                  "ข้อมูลบริษัท: ชื่อบริษัท/องค์กร ที่อยู่สำนักงาน เลขประจำตัวผู้เสียภาษี",
                  "ข้อมูลผู้ติดต่อ: ชื่อ-นามสกุล ตำแหน่ง เบอร์โทรศัพท์ และอีเมลของผู้ประสานงาน",
                  "ข้อมูลการสั่งซื้อองค์กร: รายการสินค้า ปริมาณ ราคา และข้อมูลใบสั่งซื้อ",
                ],
              },
              {
                title: "2.3 ข้อมูลที่รวบรวมโดยอัตโนมัติ",
                items: [
                  "ข้อมูลการใช้งานเว็บไซต์ เช่น IP address, ประเภทเบราว์เซอร์, หน้าที่เยี่ยมชม และระยะเวลาในการใช้งาน ผ่านการใช้งาน Cookies",
                ],
              },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-[var(--km-text)] mb-2">{group.title}</h3>
                <ul className="space-y-1.5">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[var(--km-text-secondary)] leading-relaxed">
                      <span className="shrink-0 text-[var(--km-text-muted)] mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Purpose & Legal basis */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">3. วัตถุประสงค์และฐานทางกฎหมายในการประมวลผล</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--km-surface)]">
                  <th className="text-left px-4 py-3 text-[var(--km-text)] font-semibold border border-[var(--km-border)] w-1/2">วัตถุประสงค์</th>
                  <th className="text-left px-4 py-3 text-[var(--km-text)] font-semibold border border-[var(--km-border)]">ฐานทางกฎหมาย (PDPA)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["จัดการออเดอร์และจัดส่งสินค้า", "ความจำเป็นเพื่อการปฏิบัติตามสัญญา (มาตรา 24(3))"],
                  ["ออกใบกำกับภาษีและเอกสารทางการเงิน", "การปฏิบัติตามกฎหมาย (มาตรา 24(6))"],
                  ["ติดต่อลูกค้าเรื่องออเดอร์ การจัดส่ง และบริการหลังการขาย", "ความจำเป็นเพื่อการปฏิบัติตามสัญญา (มาตรา 24(3))"],
                  ["ปรับปรุงสินค้าและบริการ", "ประโยชน์อันชอบธรรม (มาตรา 24(5))"],
                  ["ส่งข้อมูลการตลาด โปรโมชัน และข่าวสาร", "ความยินยอม (มาตรา 24(1)) — ท่านสามารถถอนความยินยอมได้ทุกเมื่อ"],
                  ["ป้องกันการทุจริตและรักษาความปลอดภัย", "ประโยชน์อันชอบธรรม (มาตรา 24(5))"],
                ].map(([purpose, basis], i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-[var(--km-surface)]" : ""}>
                    <td className="px-4 py-3 text-[var(--km-text-secondary)] border border-[var(--km-border)]">{purpose}</td>
                    <td className="px-4 py-3 text-[var(--km-text-secondary)] border border-[var(--km-border)]">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Third parties */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">4. การเปิดเผยข้อมูลส่วนบุคคลให้บุคคลที่สาม</h2>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-3">
            เราอาจเปิดเผยข้อมูลส่วนบุคคลของท่านให้แก่:
          </p>
          <ul className="space-y-2">
            {[
              "บริษัทขนส่ง: เช่น ไปรษณีย์ไทย, Flash Express, Kerry เฉพาะข้อมูลที่จำเป็นสำหรับการจัดส่ง (ชื่อ ที่อยู่ เบอร์โทร)",
              "Shopee (Shopee Thailand): ในกรณีที่ท่านสั่งซื้อผ่านแพลตฟอร์ม Shopee ซึ่งมีนโยบายความเป็นส่วนตัวของตนเอง",
              "ผู้ให้บริการระบบชำระเงิน: ธนาคารหรือผู้ให้บริการ PromptPay สำหรับการยืนยันการโอนเงิน",
              "หน่วยงานรัฐ: กรมสรรพากร หรือหน่วยงานที่มีอำนาจตามกฎหมาย เมื่อมีความจำเป็นหรือถูกร้องขอตามกฎหมาย",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--km-text-secondary)] leading-relaxed">
                <span className="shrink-0 text-[var(--km-text-muted)] mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mt-3">
            เราจะไม่ขาย จัดสรร หรือถ่ายโอนข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอกเพื่อวัตถุประสงค์ทางการค้าโดยไม่ได้รับความยินยอมจากท่าน
          </p>
        </section>

        {/* 5. Retention */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">5. ระยะเวลาการเก็บรักษาข้อมูล</h2>
          <ul className="space-y-2">
            {[
              "ข้อมูลออเดอร์และการชำระเงิน: เก็บรักษา 5 ปี นับจากวันที่ทำรายการ ตามข้อกำหนดทางบัญชีและภาษี",
              "ข้อมูลการสื่อสาร (Line/Email): เก็บรักษา 1 ปี นับจากการติดต่อครั้งสุดท้าย",
              "ข้อมูลลูกค้าองค์กร: เก็บรักษาตลอดระยะเวลาของความสัมพันธ์ทางธุรกิจ และอีก 5 ปีหลังจากนั้น",
              "ข้อมูลการใช้งานเว็บไซต์: เก็บรักษาไม่เกิน 1 ปี",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--km-text-secondary)] leading-relaxed">
                <span className="shrink-0 text-[var(--km-text-muted)] mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. Rights */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">6. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-4">
            ท่านมีสิทธิดังต่อไปนี้ตาม PDPA:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--km-surface)]">
                  <th className="text-left px-4 py-3 text-[var(--km-text)] font-semibold border border-[var(--km-border)]">สิทธิ</th>
                  <th className="text-left px-4 py-3 text-[var(--km-text)] font-semibold border border-[var(--km-border)]">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["สิทธิในการเข้าถึง", "ขอดูและรับสำเนาข้อมูลส่วนบุคคลที่เราเก็บรักษาเกี่ยวกับท่าน"],
                  ["สิทธิในการแก้ไข", "ขอให้แก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์"],
                  ["สิทธิในการลบ", "ขอให้ลบข้อมูลส่วนบุคคล เมื่อไม่มีเหตุผลทางกฎหมายในการเก็บรักษาต่อไป"],
                  ["สิทธิในการระงับการใช้", "ขอให้ระงับการประมวลผลข้อมูลชั่วคราวในบางกรณี"],
                  ["สิทธิในการโอนย้าย", "ขอรับข้อมูลในรูปแบบที่อ่านได้ด้วยเครื่อง เพื่อโอนให้ผู้ควบคุมรายอื่น"],
                  ["สิทธิในการคัดค้าน", "คัดค้านการประมวลผลข้อมูลเพื่อวัตถุประสงค์การตลาดได้ทุกเมื่อ"],
                  ["สิทธิถอนความยินยอม", "ถอนความยินยอมที่เคยให้ไว้ได้ทุกเมื่อ โดยไม่กระทบสิทธิที่เกิดขึ้นก่อนการถอน"],
                ].map(([right, detail], i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-[var(--km-surface)]" : ""}>
                    <td className="px-4 py-3 text-[var(--km-text)] font-medium border border-[var(--km-border)] whitespace-nowrap">{right}</td>
                    <td className="px-4 py-3 text-[var(--km-text-secondary)] border border-[var(--km-border)]">{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mt-3">
            หากต้องการใช้สิทธิใดๆ โปรดติดต่อเราตามข้อมูลในส่วนที่ 11 เราจะดำเนินการภายใน 30 วัน นับจากวันที่ได้รับคำร้อง
          </p>
        </section>

        {/* 7. Cookies */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">7. คุกกี้และเทคโนโลยีการติดตาม</h2>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-3">
            เว็บไซต์ Safescreen ใช้คุกกี้เพื่อการทำงานของเว็บไซต์และการวิเคราะห์ผู้ใช้งาน:
          </p>
          <ul className="space-y-2">
            {[
              "คุกกี้ที่จำเป็น (Essential Cookies): จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์ เช่น ตะกร้าสินค้า ไม่สามารถปิดได้",
              "คุกกี้วิเคราะห์ (Analytics Cookies): ใช้วิเคราะห์พฤติกรรมผู้ใช้เพื่อปรับปรุงเว็บไซต์ เช่น Google Analytics ท่านสามารถปฏิเสธได้",
              "คุกกี้การตลาด (Marketing Cookies): ใช้เพื่อแสดงโฆษณาที่ตรงกับความสนใจ เช่น Facebook Pixel ท่านสามารถปฏิเสธได้",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--km-text-secondary)] leading-relaxed">
                <span className="shrink-0 text-[var(--km-text-muted)] mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mt-3">
            ท่านสามารถจัดการคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์ของท่าน
          </p>
        </section>

        {/* 8. Security */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">8. ความปลอดภัยของข้อมูล</h2>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-3">
            เราดำเนินมาตรการรักษาความปลอดภัยที่เหมาะสม ได้แก่:
          </p>
          <ul className="space-y-2">
            {[
              "การเข้ารหัสข้อมูลผ่านโปรโตคอล SSL/HTTPS สำหรับการรับส่งข้อมูลบนเว็บไซต์",
              "การจำกัดสิทธิ์การเข้าถึงข้อมูลเฉพาะพนักงานที่มีความจำเป็น",
              "การตรวจสอบและประเมินความปลอดภัยของระบบเป็นประจำ",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--km-text-secondary)] leading-relaxed">
                <span className="shrink-0 text-[var(--km-text-muted)] mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mt-3">
            อย่างไรก็ตาม ไม่มีระบบใดที่ปลอดภัย 100% หากท่านพบเหตุการณ์ที่น่าสงสัยเกี่ยวกับข้อมูลส่วนบุคคลของท่าน กรุณาแจ้งเราทันที
          </p>
        </section>

        {/* 9. Third-party links */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">9. การเชื่อมโยงไปยังเว็บไซต์บุคคลที่สาม</h2>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">
            เว็บไซต์ของเราอาจมีลิงก์ไปยังเว็บไซต์ภายนอก เช่น Shopee, Facebook, Line ซึ่งมีนโยบายความเป็นส่วนตัวของตนเอง เราไม่มีส่วนรับผิดชอบต่อเนื้อหาหรือการปฏิบัติด้านความเป็นส่วนตัวของเว็บไซต์เหล่านั้น แนะนำให้ท่านอ่านนโยบายของแต่ละเว็บไซต์ด้วยตนเอง
          </p>
        </section>

        {/* 10. Policy changes */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">10. การเปลี่ยนแปลงนโยบายนี้</h2>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">
            เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว เมื่อมีการเปลี่ยนแปลงที่มีนัยสำคัญ เราจะแจ้งให้ท่านทราบผ่านทางเว็บไซต์หรือช่องทางที่ท่านให้ไว้ วันที่บังคับใช้ล่าสุดจะระบุไว้ด้านบนของนโยบายนี้
          </p>
        </section>

        {/* 11. Contact */}
        <section>
          <h2 className="text-[15px] font-semibold text-[var(--km-text)] mb-3 pb-2 border-b border-[var(--km-border)]">11. ติดต่อเรา</h2>
          <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-4">
            หากท่านมีคำถาม ข้อร้องเรียน หรือต้องการใช้สิทธิตาม PDPA กรุณาติดต่อ:
          </p>
          <div className="bg-[var(--km-surface)] rounded-xl p-5 text-sm text-[var(--km-text-secondary)] space-y-1 leading-relaxed">
            <p className="font-semibold text-[var(--km-text)]">บริษัท รวยเสมอ จำกัด (Safescreen)</p>
            <p>ที่อยู่: 38 หมู่ 4 ซอยกระทุ่มล้ม 27 ถนนพุทธมณฑลสาย 4 ตำบลกระทุ่มล้ม อำเภอสามพราน จังหวัดนครปฐม 73220</p>
            <p>อีเมล: Safescreen.tech@gmail.com</p>
            <p>Line OA: @safescreenofficial</p>
            <p>เว็บไซต์: safescreentech.com</p>
            <p>เวลาทำการ: ทุกวัน 9:00 – 22:00 น.</p>
          </div>
          <p className="mt-4 text-sm text-[var(--km-text-secondary)] leading-relaxed">
            ในกรณีที่ท่านเชื่อว่าสิทธิของท่านถูกละเมิด ท่านมีสิทธิยื่นเรื่องร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) ตามช่องทางที่กำหนดโดยพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
          </p>
        </section>
      </div>
    </main>
  );
}
