"use client";

import { useLang } from "@/contexts/lang";

const REVIEWS: { name: string; rating: number; text: string; date: string; variant?: string }[] = [
  {
    name: "k*****w", rating: 5, date: "21 ธ.ค. 2025", variant: "Air M2 & M3 & M4",
    text: "แปะเสร็จแล้ว เป๊ะมาก แปะง่ายมาก ชอบค่ะ คุณภาพสินค้าดีมากกกก ส่งเร็วมากกกก คุ้มค่ากับราคาอยู่นะ ปังมากกกก 💕✨",
  },
  {
    name: "j*****d", rating: 5, date: "27 พ.ค. 2025", variant: "Laptop 14\" (16:10)",
    text: "สินค้าจัดส่งถูกต้อง รวดเร็ว มีห่อบับเบิลกันกระแทกมาดี มีแถมแฟ้มเก็บให้ด้วย แผ่นกรองขนาดเข้ารูปพอดีกับ HP ProBook 440",
  },
  {
    name: "pipat5959", rating: 5, date: "17 ธ.ค. 2024", variant: "Pro M3 & M4 & M5",
    text: "สินค้าดี ขนาดพอดีกับหน้าจอ MacBook Pro 14\" M4 ติดตั้งง่าย ป้องกันการมองเห็นจากด้านข้าง การจัดส่งรวดเร็ว สินค้าอยู่ในสภาพดี เรียบร้อย ไม่เสียหาย",
  },
  {
    name: "p*****s", rating: 5, date: "5 มี.ค. 2025",
    text: "ติดง่าย ใช้งานง่าย แกะออกสะดวก กันมุมด้านข้างได้สนิท จนมีคนถามว่าทำไมไม่เปิดแสง กันแสงสะท้อนได้ดีค่ะ",
  },
  {
    name: "p*****p", rating: 5, date: "27 มี.ค. 2024", variant: "Laptop 14\" (16:9)",
    text: "จัดส่งรวดเร็วมาก สั่งวันเดียวถึงเลย คุณภาพดี ติดตั้งง่ายแค่ติดแผ่นแม่เหล็กก็นำฟิล์มมาติดได้เลย แนะนำแบบด้านเลยไม่มีแสงสะท้อน",
  },
  {
    name: "m*****a", rating: 5, date: "13 พ.ย. 2023", variant: "Laptop 14\" (16:10)",
    text: "ได้รับสินค้าเรียบร้อยค่ะ แพ็คมาอย่างดี ส่งรวดเร็ว มองจากด้านข้างมิดสนิทดีมาก ทางร้านให้คำปรึกษาดีมาก ตอบเร็วมาก แนะนำมากๆค่ะ",
  },
  {
    name: "chon_chan", rating: 5, date: "21 พ.ค. 2026", variant: "Pro ฟิล์มแบบด้าน",
    text: "ป้องกันการมองเห็นในแนวเอียงมาได้จริง ติดตั้งง่ายมาก มีซองใส่ฟิล์มมาให้ จะใช้แบบติดฟิล์มหรือไม่ติดก็ได้ เพราะอยากเห็นจอเต็มประสิทธิภาพ",
  },
  {
    name: "m****a", rating: 5, date: "11 เม.ย. 2024", variant: "Laptop 14\" (16:10)",
    text: "อุดหนุนหลายครั้งแล้ว เพื่อนๆซื้อตามกันเป็นแถว ส่งรวดเร็ว แพ็คมาอย่างดี ใช้ดีมากๆค่ะ แนะนำมากๆค่ะ",
  },
  {
    name: "n*****4", rating: 5, date: "10 พ.ค. 2025", variant: "Air M2 & M3 & M4 & M5",
    text: "ฟิล์มกันการมองเห็นดีมาก แม่เหล็กแนบไปกับจอเลย แถมซองใส่ฟิล์มมาให้ด้วย บริการดีมากๆ ตอบลูกค้าไวมาก บริการดีเยี่ยม เริ่สสสส",
  },
  {
    name: "l*****m", rating: 5, date: "30 ม.ค. 2024",
    text: "ซื้อเป็นรอบที่สองค่ะ ของสามีด้วย เค้าเห็นเราใช้ดีเลยอยากได้บ้าง จัดส่งรวดเร็วมาก มีแฟ้มแถมให้ ฟิล์มคุณภาพดี แนะนำค่ะ",
  },
  {
    name: "s*****k", rating: 5, date: "14 ก.พ. 2025", variant: "Pro M3 & M4 & M5",
    text: "ใช้งานในออฟฟิศ Open Space ดีมากเลยค่ะ เพื่อนข้างๆ มองไม่เห็นหน้าจอเราเลย ความเป็นส่วนตัวได้ผล 100% แนะนำสำหรับคนทำงาน",
  },
  {
    name: "t*****n", rating: 5, date: "3 มิ.ย. 2025", variant: "Laptop 15.6\" (16:9)",
    text: "แผ่นแม่เหล็กแนบสนิทมาก ไม่มีขอบยกเลย ใส่กระเป๋า Laptop ได้พอดี packaging มาสวยมาก ให้แฟ้มใส่ฟิล์มมาด้วย ประทับใจมากครับ",
  },
  {
    name: "a*****y", rating: 5, date: "19 ส.ค. 2024", variant: "Air M2 & M3 & M4",
    text: "นั่งทำงาน Work from Café บ่อยมาก ฟิล์มนี้ช่วยได้มากเลยค่ะ กังวลเรื่องคนมองข้อมูลลดลงไปเยอะ ติดตั้งง่าย ถอดเก็บได้สะดวก",
  },
  {
    name: "w*****t", rating: 5, date: "7 ก.ย. 2024", variant: "Laptop 14\" (16:10)",
    text: "สั่งให้พ่อใช้ตอนไปธนาคาร เขาชอบมากเลยครับ บอกว่าใช้ง่าย แค่แปะก็เสร็จ แม่เหล็กแน่นดี ไม่หลุดเวลาพกพา แนะนำเลยครับ",
  },
  {
    name: "r*****o", rating: 5, date: "22 ต.ค. 2024", variant: "Pro ฟิล์มแบบด้าน",
    text: "ซื้อมาใช้กับ MacBook Pro ตอนนั่งเครื่องบิน ดีมากเลยครับ คนข้างๆ มองไม่เห็นเลย คุ้มค่ามาก บริการตอบไวมาก ขอบคุณครับ",
  },
  {
    name: "c*****i", rating: 5, date: "11 พ.ย. 2024", variant: "Air M2 & M3 & M4 & M5",
    text: "แม่เหล็กแน่นมาก ติดแล้วไม่หลุดเลยแม้แต่ครั้งเดียว สีจอยังสวยอยู่ ความสว่างลดนิดหน่อยแต่โอเคมาก คุ้มมากๆ ค่ะ",
  },
  {
    name: "b*****e", rating: 5, date: "5 ม.ค. 2025", variant: "Laptop 13.3\"",
    text: "ของมาเร็วมาก สั่งวันนี้ได้วันถัดไปเลย แพ็คกิ้งดีมาก กันกระแทกครบ ฟิล์มไม่มีรอยเลย ติดง่ายมาก ความเป็นส่วนตัวดีมากครับ",
  },
  {
    name: "v*****u", rating: 5, date: "28 ก.พ. 2025", variant: "Pro M3 & M4 & M5",
    text: "ใช้ในห้องประชุมบ่อย กันการมองเห็นได้ดีมากเลยค่ะ ไม่ต้องกังวลเรื่องข้อมูล confidential หลุด แนะนำให้เพื่อนในออฟฟิศซื้อตามกันหมดเลย",
  },
  {
    name: "o*****g", rating: 5, date: "16 มี.ค. 2025", variant: "Laptop 14\" (16:9)",
    text: "ฟิล์มคุณภาพดีมาก บางและใสกว่าที่คิด ติดแล้วแทบไม่รู้สึกว่ามีอะไรอยู่บนจอ กันมุมมองได้จริง ส่งเร็ว แนะนำเลยครับ",
  },
];

const ROW1 = REVIEWS.slice(0, 10);
const ROW2 = REVIEWS.slice(10);

/* สุ่มสีพื้นหลัง avatar จาก palette เหลือง/เทา */
const AVATAR_COLORS = ["#F5A600", "#FFD166", "#E5E5E5", "#D4D4D4", "#FFBA35"];
function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}
function avatarInitial(name: string) {
  return name[0].toUpperCase();
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  const bg = avatarColor(review.name);
  const isLight = bg === "#E5E5E5" || bg === "#D4D4D4";

  return (
    <div className="shrink-0 w-[300px] mx-3 bg-white border border-[#E5E5E5] hover:border-[#F5A600] rounded-2xl px-5 pt-5 pb-4 flex flex-col gap-3 shadow-sm transition-colors duration-200">
      {/* Review text */}
      <p className="text-[13.5px] text-[#404040] leading-relaxed line-clamp-4 flex-1">
        {review.text}
      </p>

      {/* Divider */}
      <div className="border-t border-[#F0F0F0]" />

      {/* Footer: avatar + name/date + rating */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar circle */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
            style={{ background: bg, color: isLight ? "#525252" : "#fff" }}
          >
            {avatarInitial(review.name)}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#0A0A0A] leading-tight">{review.name}</div>
            <div className="text-[11px] text-[#A3A3A3] leading-tight mt-0.5">
              {review.variant ?? review.date}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-sm font-semibold text-[#0A0A0A]">5.0</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625L4.5 7.07 2 4.635l3.455-.505L7 1z"
              fill="#F5A600" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ reviews, duration, reverse = false }: {
  reviews: typeof REVIEWS;
  duration: number;
  reverse?: boolean;
}) {
  const doubled = [...reviews, ...reviews];
  return (
    <div className="overflow-hidden">
      <div
        className="flex w-max"
        style={{ animation: `marquee ${duration}s linear infinite ${reverse ? "reverse" : ""}` }}
      >
        {doubled.map((rv, i) => <ReviewCard key={i} review={rv} />)}
      </div>
    </div>
  );
}

const RATING_BARS = [
  { star: 5, pct: 91 },
  { star: 4, pct: 6 },
  { star: 3, pct: 2 },
  { star: 2, pct: 0.5 },
  { star: 1, pct: 0.5 },
];

function ShopeeRatingSummary() {
  const { pages: t } = useLang();
  return (
    <div className="max-w-2xl mx-auto mx-4 mb-10 px-4">
      <div className="bg-white border border-[#E5E5E5] rounded-2xl px-6 py-5 flex items-center gap-6 shadow-sm">
        {/* Left: score */}
        <div className="flex flex-col items-center shrink-0 min-w-[90px]">
          <span className="text-5xl font-black text-[#0A0A0A] leading-none">4.9</span>
          <div className="flex gap-0.5 mt-2">
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625L4.5 7.07 2 4.635l3.455-.505L7 1z"
                  fill="#F5A600" />
              </svg>
            ))}
          </div>
          <span className="text-[12px] text-[#A3A3A3] mt-1.5">{t.reviewsCount}</span>
          <a
            href="https://shopee.co.th/safescreenofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold text-white"
            style={{ background: "#EE4D2D" }}
          >
            {t.reviewsShopeeBtn}
          </a>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-[#F0F0F0] shrink-0" />

        {/* Right: bars */}
        <div className="flex-1 flex flex-col gap-2">
          {RATING_BARS.map(({ star, pct }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-[12px] text-[#A3A3A3] w-5 text-right shrink-0">{star}</span>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625L4.5 7.07 2 4.635l3.455-.505L7 1z"
                  fill="#A3A3A3" />
              </svg>
              <div className="flex-1 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#F5A600]" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[11px] text-[#A3A3A3] w-8 text-right shrink-0">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewsStrip() {
  const { pages: t } = useLang();
  return (
    <div className="bg-[#F7F7F7] py-10 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-8 px-4">
        <p className="text-xs tracking-[0.25em] text-[#A3A3A3] uppercase mb-3">{t.reviewsTag}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-2">
          {t.reviewsTitle}
        </h2>
        <p className="text-sm text-[#A3A3A3]">{t.reviewsSubtitle}</p>
      </div>

      <ShopeeRatingSummary />

      <div className="mb-4">
        <MarqueeRow reviews={ROW1} duration={80} />
      </div>
      <MarqueeRow reviews={ROW2} duration={90} reverse />
    </div>
  );
}
