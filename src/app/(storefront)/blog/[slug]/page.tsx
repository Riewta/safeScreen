import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import translations from "@/lib/i18n";

// ── Article data ──────────────────────────────────────────────────────────────

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: React.ReactNode;
}

const ARTICLES: Article[] = [
  {
    slug: "magnetic-privacy-screen-explained",
    title: "ฟิล์มกันเสือกแม่เหล็กคืออะไร? ทำไมถึงดีกว่าฟิล์มทั่วไป",
    excerpt:
      "ฟิล์มกันเสือกระบบแม่เหล็ก Easy Snap ติดง่าย ถอดง่าย ไม่ทิ้งคราบกาว เหมาะสำหรับผู้ที่ต้องการความเป็นส่วนตัวในที่สาธารณะ",
    date: "10 มิ.ย. 2026",
    readTime: "5 นาที",
    category: "Guide",
    content: (
      <>
        <p>
          ในยุคที่การทำงานนอกสถานที่กลายเป็นเรื่องปกติ ไม่ว่าจะเป็นที่คาเฟ่ สนามบิน
          หรือโคเวิร์กกิ้งสเปซ ความเป็นส่วนตัวของหน้าจอคอมพิวเตอร์กลายเป็นสิ่งสำคัญที่หลายคนมองข้าม
          การที่คนข้างๆ สามารถแอบมองหน้าจอของเรา ไม่ว่าจะเป็นอีเมลงาน เอกสารลับ
          หรือข้อมูลส่วนตัว นั้นเป็นความเสี่ยงที่ควรป้องกัน
        </p>
        <p>
          <strong>ฟิล์มกันเสือก (Privacy Screen Filter)</strong> คือฟิล์มที่ใช้เทคโนโลยี
          Micro-Louver ซึ่งเป็นตะแกรงขนาดเล็กระดับไมโคร ทำให้แสงจากหน้าจอส่องออกมาในมุมแคบเพียง
          30 องศาซ้าย-ขวา ผู้ที่นั่งตรงหน้าจอเห็นได้ชัดเจนตามปกติ แต่ผู้ที่นั่งข้างๆ
          จะเห็นแค่หน้าจอดำ
        </p>
        <h3>ทำไมระบบแม่เหล็กถึงดีกว่า?</h3>
        <p>
          ฟิล์มกันเสือกรุ่นเก่าใช้ซิลิโคนหรือกาวในการยึดติดกับหน้าจอ ซึ่งมีปัญหาหลายอย่าง
          ได้แก่ ทิ้งคราบกาว ยากในการถอดออก และเมื่อถอดบ่อยๆ กาวจะเสื่อมสภาพ
        </p>
        <p>
          <strong>ระบบแม่เหล็ก Easy Snap</strong> ของ SafeScreen แก้ปัญหาเหล่านี้ทั้งหมด
          โดยใช้แถบแม่เหล็กที่ขอบฟิล์มยึดเข้ากับเฟรมของ MacBook ได้พอดี
          โดยไม่ต้องใช้กาวหรืออุปกรณ์เสริมใดๆ การติดและถอดทำได้ภายใน 3 วินาที
        </p>
        <h3>ข้อดีของฟิล์มกันเสือกแม่เหล็ก SafeScreen</h3>
        <ul>
          <li>
            <strong>ติดถอดง่าย:</strong> ใช้เวลาไม่ถึง 5 วินาที เหมาะสำหรับคนที่ต้องเดินทางบ่อย
          </li>
          <li>
            <strong>ไม่ทิ้งคราบ:</strong> ไม่มีกาว ไม่มีซิลิโคน หน้าจอสะอาดทุกครั้งที่ถอดออก
          </li>
          <li>
            <strong>ความชัดสูง:</strong> เทคโนโลยี Nano-coating ทำให้ภาพยังคงความคมชัดเมื่อมองตรง
          </li>
          <li>
            <strong>ป้องกันรอย:</strong> ชั้นฟิล์มยังช่วยป้องกันรอยขีดข่วนบนหน้าจอได้ระดับหนึ่ง
          </li>
        </ul>
        <p>
          หากคุณทำงานในที่สาธารณะเป็นประจำและต้องการความเป็นส่วนตัว
          ฟิล์มกันเสือกแม่เหล็กคือการลงทุนที่คุ้มค่า ราคาเริ่มต้นเพียง 890 บาท
          เมื่อเทียบกับความเสี่ยงที่ข้อมูลสำคัญจะรั่วไหล ถือว่าคุ้มมากกว่าหลายเท่า
        </p>
      </>
    ),
  },
  {
    slug: "blue-light-protection-work-from-home",
    title: "ป้องกันแสงสีฟ้า: ทำไม WFH ถึงต้องใช้ฟิล์ม Anti-Blue",
    excerpt:
      "การทำงานหน้าจอนาน 8+ ชั่วโมงต่อวัน ส่งผลต่อสายตาอย่างไร และฟิล์มกรองแสงสีฟ้าช่วยได้แค่ไหน",
    date: "5 มิ.ย. 2026",
    readTime: "7 นาที",
    category: "Health",
    content: (
      <>
        <p>
          นับตั้งแต่การทำงานจากบ้าน (Work From Home) กลายเป็นบรรทัดฐานใหม่
          คนทำงานจำนวนมากต้องจ้องหน้าจอคอมพิวเตอร์นานขึ้นอย่างเห็นได้ชัด
          จากการสำรวจในปี 2025 พบว่าพนักงานออฟฟิศชาวไทยมีเวลาหน้าจอเฉลี่ย 9.4 ชั่วโมงต่อวัน
          ซึ่งเพิ่มขึ้นกว่า 40% จากช่วงก่อนที่ WFH จะแพร่หลาย
        </p>
        <h3>แสงสีฟ้าคืออะไร ทำไมถึงอันตราย?</h3>
        <p>
          แสงสีฟ้า (Blue Light) คือแสงในช่วงความยาวคลื่น 380–500 นาโนเมตร
          ซึ่งมีพลังงานสูงกว่าแสงสีอื่นในสเปกตรัมที่มองเห็นได้
          จอ LCD และ OLED ปล่อยแสงสีฟ้าออกมาในปริมาณมาก โดยเฉพาะจอที่ตั้งค่า brightness สูง
        </p>
        <p>
          ผลกระทบของแสงสีฟ้าต่อร่างกายที่นักวิทยาศาสตร์ศึกษาพบ ได้แก่:
        </p>
        <ul>
          <li>
            <strong>Digital Eye Strain:</strong> ตาล้า แสบตา ปวดศีรษะ มองภาพพร่ามัวหลังใช้งาน
          </li>
          <li>
            <strong>รบกวนวงจรการนอน:</strong> แสงสีฟ้ายับยั้งการหลั่งเมลาโทนิน
            ทำให้นอนหลับยากหากใช้หน้าจอก่อนนอน
          </li>
          <li>
            <strong>ผลในระยะยาว:</strong> งานวิจัยบางชิ้นเชื่อมโยงการรับแสงสีฟ้ามากเกินไปกับ
            Macular Degeneration แม้ยังต้องการการศึกษาเพิ่มเติม
          </li>
        </ul>
        <h3>ฟิล์ม Anti-Blue ของ SafeScreen ทำงานอย่างไร?</h3>
        <p>
          SafeScreen Anti-Blue ใช้สารเคลือบพิเศษที่ดูดซับและกรองแสงในช่วงความยาวคลื่น 380–450
          นาโนเมตร รุ่น Standard กรองได้ 30% และรุ่น Max กรองได้ 50%
          โดยไม่ทำให้สีของหน้าจอเพี้ยนออกเป็นสีเหลืองเกินไป
        </p>
        <h3>เหมาะกับใครบ้าง?</h3>
        <p>
          ฟิล์ม Anti-Blue เหมาะอย่างยิ่งสำหรับกลุ่มคนดังต่อไปนี้:
        </p>
        <ul>
          <li>Developer / Designer ที่ทำงานหน้าจอ 8+ ชั่วโมงต่อวัน</li>
          <li>นักเรียน / นักศึกษาที่ต้องอ่านหนังสือออนไลน์นานๆ</li>
          <li>ผู้ที่มีอาการตาแห้ง ตาล้า หรือปวดศีรษะบ่อย</li>
          <li>ใครก็ตามที่ใช้หน้าจอก่อนนอน</li>
        </ul>
        <p>
          ควบคู่กับการใช้ฟิล์ม Anti-Blue ผู้เชี่ยวชาญแนะนำให้ใช้กฎ 20-20-20 คือ
          ทุก 20 นาที ให้มองออกไปไกล 20 ฟุต (6 เมตร) เป็นเวลา 20 วินาที
          เพื่อให้กล้ามเนื้อตาได้พักและลดอาการล้าตา
        </p>
      </>
    ),
  },
  {
    slug: "choose-right-film-macbook",
    title: "เลือกฟิล์มให้ถูกรุ่น: คู่มือฉบับสมบูรณ์สำหรับ MacBook ทุกรุ่น",
    excerpt:
      'MacBook มีหลายขนาดและรุ่น ตั้งแต่ Air 13.3" ถึง Pro 16.2" M5 คู่มือนี้ช่วยให้คุณเลือกฟิล์มได้ถูกต้อง',
    date: "1 มิ.ย. 2026",
    readTime: "10 นาที",
    category: "Guide",
    content: (
      <>
        <p>
          หนึ่งในข้อผิดพลาดที่พบบ่อยที่สุดในการซื้อฟิล์มกันเสือกคือ
          การเลือกขนาดผิด MacBook มีหลายรุ่นที่ใช้ขนาดหน้าจอเดียวกันบนกระดาษ
          แต่จริงๆ แล้วมีขนาดเบซ์ลและ aspect ratio ที่ต่างกัน
          บทความนี้จะช่วยให้คุณเลือกได้ถูกต้องตั้งแต่ครั้งแรก
        </p>
        <h3>MacBook Air — รุ่นที่ได้รับความนิยมสูงสุด</h3>
        <p>MacBook Air มีสามขนาดหน้าจอหลักที่ต้องรู้:</p>
        <ul>
          <li>
            <strong>13.3 นิ้ว (M1 / Retina Intel):</strong> รุ่นนี้มีขอบจอหนากว่า และไม่มี Notch
            เป็นรุ่นที่วางขายต่อเนื่องยาวนานที่สุด ฟิล์มขนาด 13.3" Widescreen รองรับได้ดี
          </li>
          <li>
            <strong>13.6 นิ้ว (M2 / M3 / M4 / M5):</strong> รีดีไซน์ใหม่ทั้งหมด ขอบจอบาง มี Notch
            สัดส่วนหน้าจอเปลี่ยนเป็น 16:10 ต้องใช้ฟิล์มที่ผลิตสำหรับรุ่นนี้โดยเฉพาะ
          </li>
          <li>
            <strong>15.3 นิ้ว (M2 / M3 / M4 / M5):</strong> รุ่นใหม่ล่าสุด จอใหญ่สำหรับคนที่ต้องการพื้นที่ทำงาน
            สัดส่วน 16:10 เหมือน 13.6 นิ้ว
          </li>
        </ul>
        <h3>MacBook Pro — สำหรับมืออาชีพ</h3>
        <p>MacBook Pro มีหลายขนาดและรุ่น ซึ่งแต่ละรุ่นมีสัดส่วนหน้าจอที่ต่างกัน:</p>
        <ul>
          <li>
            <strong>13.3 นิ้ว (2019–M2):</strong> ขนาดใกล้เคียง MacBook Air 13.3 แต่บอดี้หนากว่าเล็กน้อย
            ฟิล์มรุ่นเดียวกันใช้ได้
          </li>
          <li>
            <strong>14.2 นิ้ว (M2/M3/M4/M5):</strong> ขนาดนี้เป็น ProMotion 120Hz และมี Notch
            ต้องการฟิล์มที่ตัดมาเพื่อรุ่นนี้โดยเฉพาะ
          </li>
          <li>
            <strong>15.3 นิ้ว (2019):</strong> เป็น Intel รุ่นสุดท้าย ขอบจอหนา สัดส่วน 16:10
            ฟิล์มรุ่นนี้หาได้ยากขึ้นเรื่อยๆ
          </li>
          <li>
            <strong>16.2 นิ้ว (M1–M5):</strong> จอใหญ่ที่สุดในไลน์อัป MacBook
            ฟิล์มขนาดนี้มีราคาสูงกว่ารุ่นอื่นเนื่องจากพื้นที่มากกว่า
          </li>
        </ul>
        <h3>วิธีตรวจสอบขนาดหน้าจอที่แน่ใจ 100%</h3>
        <p>
          วิธีที่แน่นอนที่สุดคือเปิด Apple Logo → About This Mac → หา &ldquo;Retina Display&rdquo; หรือ
          &ldquo;Liquid Retina XDR&rdquo; แล้วดูขนาดที่ระบุ หรือดูจากหมายเลขรุ่น (Model Identifier)
          ที่ด้านล่างของเครื่อง
        </p>
        <p>
          หากยังไม่แน่ใจ แนะนำให้ใช้
          <strong> AI Compatibility Checker</strong> ของ SafeScreen ที่จะช่วยแนะนำสินค้าที่ถูกต้อง
          100% โดยไม่ต้องจำขนาดเอง
        </p>
      </>
    ),
  },
];

// ── Metadata generation ───────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} — SafeScreen Tech Blog`,
    description: article.excerpt,
  };
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Guide: "bg-blue-50 text-blue-700",
  Health: "bg-green-50 text-green-700",
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();
  const t = translations.TH.pages;

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          {t.blogBackToList}
        </Link>

        {/* Category & meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
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

        {/* Title */}
        <h1 className="text-3xl font-bold text-[var(--km-text)] leading-snug mb-4">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-[var(--km-text-secondary)] leading-relaxed mb-8 border-l-4 border-[var(--km-brand)] pl-4">
          {article.excerpt}
        </p>

        {/* Cover image placeholder */}
        <div className="w-full h-56 md:h-72 bg-[var(--km-surface)] rounded-2xl flex items-center justify-center mb-10 border border-[var(--km-border)]">
          <span className="text-5xl opacity-20">📸</span>
        </div>

        {/* Article body */}
        <div className="prose-custom text-[var(--km-text)] space-y-4 leading-relaxed text-[15px]">
          {article.content}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-[var(--km-surface)] rounded-2xl border border-[var(--km-border)] text-center">
          <h3 className="font-semibold text-[var(--km-text)] mb-2">{t.blogCtaTitle}</h3>
          <p className="text-sm text-[var(--km-text-secondary)] mb-4">
            {t.blogCtaSubtitle}
          </p>
          <Link
            href="/ai-checker"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--km-brand)] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            {t.blogCtaBtn}
          </Link>
        </div>

        {/* Back */}
        <div className="mt-8 pt-6 border-t border-[var(--km-border)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors"
          >
            <ArrowLeft size={15} />
            {t.blogBackOther}
          </Link>
        </div>
      </div>

      {/* Inline prose styles — scoped to this page */}
      <style>{`
        .prose-custom h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--km-text);
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }
        .prose-custom ul {
          list-style: disc;
          padding-left: 1.5rem;
          space-y: 0.5rem;
        }
        .prose-custom li {
          margin-bottom: 0.375rem;
        }
        .prose-custom strong {
          font-weight: 600;
          color: var(--km-text);
        }
        .prose-custom p {
          color: var(--km-text-secondary);
        }
      `}</style>
    </div>
  );
}
