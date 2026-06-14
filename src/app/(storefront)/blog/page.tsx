import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

export const metadata = {
  title: "Blog — SafeScreen Tech",
  description: "ความรู้เกี่ยวกับฟิล์มกันเสือก การดูแลหน้าจอ และเทคโนโลยีที่เกี่ยวข้อง",
};

const ARTICLES = [
  {
    slug: "magnetic-privacy-screen-explained",
    title: "ฟิล์มกันเสือกแม่เหล็กคืออะไร? ทำไมถึงดีกว่าฟิล์มทั่วไป",
    excerpt:
      "ฟิล์มกันเสือกระบบแม่เหล็ก Easy Snap ติดง่าย ถอดง่าย ไม่ทิ้งคราบกาว เหมาะสำหรับผู้ที่ต้องการความเป็นส่วนตัวในที่สาธารณะ",
    date: "10 มิ.ย. 2026",
    readTime: "5 นาที",
    category: "Guide",
  },
  {
    slug: "blue-light-protection-work-from-home",
    title: "ป้องกันแสงสีฟ้า: ทำไม WFH ถึงต้องใช้ฟิล์ม Anti-Blue",
    excerpt:
      "การทำงานหน้าจอนาน 8+ ชั่วโมงต่อวัน ส่งผลต่อสายตาอย่างไร และฟิล์มกรองแสงสีฟ้าช่วยได้แค่ไหน",
    date: "5 มิ.ย. 2026",
    readTime: "7 นาที",
    category: "Health",
  },
  {
    slug: "choose-right-film-macbook",
    title: "เลือกฟิล์มให้ถูกรุ่น: คู่มือฉบับสมบูรณ์สำหรับ MacBook ทุกรุ่น",
    excerpt:
      'MacBook มีหลายขนาดและรุ่น ตั้งแต่ Air 13.3" ถึง Pro 16.2" M5 คู่มือนี้ช่วยให้คุณเลือกฟิล์มได้ถูกต้อง',
    date: "1 มิ.ย. 2026",
    readTime: "10 นาที",
    category: "Guide",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Guide: "bg-blue-50 text-blue-700",
  Health: "bg-green-50 text-green-700",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[var(--km-text)] mb-2">Blog</h1>
        <p className="text-[var(--km-text-secondary)] mb-10">
          ความรู้เกี่ยวกับฟิล์มกันเสือก การดูแลหน้าจอ และเทคโนโลยีที่เกี่ยวข้อง
        </p>

        <div className="space-y-6">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block bg-white border border-[var(--km-border)] rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Placeholder image block */}
                <div className="md:w-52 h-48 md:h-auto bg-[var(--km-surface)] flex-shrink-0 flex items-center justify-center">
                  <span className="text-4xl opacity-30">📸</span>
                </div>

                <div className="p-6 flex-1">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        CATEGORY_COLORS[article.category] ?? "bg-[var(--km-surface)] text-[var(--km-text-secondary)]"
                      }`}
                    >
                      {article.category}
                    </span>
                    <span className="text-xs text-[var(--km-text-muted)] flex items-center gap-1">
                      <Calendar size={12} />
                      {article.date}
                    </span>
                    <span className="text-xs text-[var(--km-text-muted)] flex items-center gap-1">
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-[var(--km-text)] mb-2 group-hover:text-[var(--km-brand)] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-[var(--km-text-secondary)] text-sm leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="mt-4 text-sm font-medium text-[var(--km-brand)] group-hover:underline">
                    อ่านต่อ →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="mt-12 p-8 bg-[var(--km-surface)] rounded-2xl text-center border border-[var(--km-border)]">
          <h3 className="text-lg font-semibold text-[var(--km-text)] mb-2">
            รับบทความใหม่ก่อนใคร
          </h3>
          <p className="text-sm text-[var(--km-text-secondary)] mb-4">
            สมัครรับ Newsletter ทิปส์ดูแลหน้าจอและโปรโมชันพิเศษ
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-full border border-[var(--km-border)] text-sm outline-none focus:border-[var(--km-brand)] bg-white text-[var(--km-text)]"
            />
            <button className="px-5 py-2.5 bg-[var(--km-brand)] text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
              สมัคร
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
