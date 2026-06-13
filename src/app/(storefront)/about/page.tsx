export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#2D2D2D] text-white py-20 px-4 text-center">
        <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-4">
          Our Story
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Protect Your Privacy,<br />Anywhere, Anytime.
        </h1>
        <p className="text-[var(--km-text-muted)] text-base md:text-lg max-w-xl mx-auto">
          เราเชื่อว่าความเป็นส่วนตัวคือสิทธิ์พื้นฐาน — ไม่ควรแลกกับอะไรทั้งนั้น
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
          {[
            { num: "3", label: "ปีในตลาด" },
            { num: "20,000+", label: "Orders Nationwide" },
            { num: "4.9★", label: "Customer Rating" },
            { num: "500+", label: "Corporate Clients" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{s.num}</div>
              <div className="text-xs text-[var(--km-text-muted)] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Origin Story */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-3">
          Origin Story
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-2">
          เริ่มจากความรู้สึกไม่ปลอดภัยที่คาเฟ่
        </h2>
        <p className="text-xs text-[var(--km-text-muted)] mb-8">ก่อตั้งปี 2022 · Bangkok, Thailand</p>

        <div className="space-y-4 text-[var(--km-text-secondary)] leading-relaxed">
          <p>
            Safescreen เกิดขึ้นจากปัญหาที่หลายคนเจอแต่ไม่มีใครแก้ได้จริงๆ — การนั่งทำงานในคาเฟ่หรือ
            Co-working Space แล้วรู้สึกว่าหน้าจอของตัวเองไม่ปลอดภัย มีคนนั่งข้างๆ
            จ้องอยู่ตลอดเวลาโดยไม่รู้ตัว
          </p>
          <p>
            ฟิล์มกันมองที่มีในตลาดแก้ปัญหานี้ได้ แต่สร้างปัญหาใหม่ขึ้นมา — ติดแล้วติดเลย
            ใช้ดูหนังหรือทำงานกราฟิกไม่ได้อย่างที่ควร คนต้องเลือกระหว่างความเป็นส่วนตัวกับคุณภาพหน้าจอ
          </p>
        </div>

        <blockquote className="border-l-4 border-[var(--km-text)] pl-5 my-8 text-[var(--km-text)] text-lg leading-relaxed">
          เราเชื่อว่าไม่ควรต้องเลือก — ความเป็นส่วนตัวคือสิทธิ์พื้นฐาน
          และคุณภาพหน้าจอที่ดีก็เป็นสิ่งที่ทุกคนสมควรได้รับ
        </blockquote>

        <p className="text-[var(--km-text-secondary)] leading-relaxed">
          Safescreen จึงออกแบบฟิล์มกันมองแบบถอดได้ เพื่อให้ทุกคนเลือกได้ว่าต้องการความเป็นส่วนตัวเมื่อไหร่
          โดยไม่ต้องยอมแพ้อะไรทั้งนั้น
        </p>
      </section>

      {/* Why Safescreen */}
      <section className="bg-[var(--km-surface)] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-3 text-center">
            Why Safescreen
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-10 text-center">
            อะไรทำให้เราต่างจากคนอื่น
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "DUAL PROTECTION TECHNOLOGY",
                body: "ฟิล์มเดียวกันมองข้างได้ตั้งแต่ 30 องศา และกรองแสงสีฟ้าพร้อมกัน — ไม่ต้องเลือกระหว่างความเป็นส่วนตัวกับการดูแลสายตา",
              },
              {
                icon: "🛡️",
                title: "ZERO-RISK PURCHASE GUARANTEE",
                body: "ทีมงานช่วยเลือกขนาดให้ฟรีก่อนสั่ง และถ้าไม่ตรงก็เปลี่ยนได้ — เพราะเราอยากให้ลูกค้าได้ของที่ใช่จริงๆ ไม่ใช่แค่ขายได้",
              },
              {
                icon: "✦",
                title: "CHOICE BY DESIGN",
                body: "ออกแบบมาเพื่อให้คุณเลือกได้ว่าต้องการความเป็นส่วนตัวเมื่อไหร่ — ไม่ใช่ติดแล้วติดเลย คุณเป็นคนควบคุม ไม่ใช่ฟิล์ม",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl p-6 shadow-[var(--km-shadow-card)]">
                <div className="text-3xl mb-4">{c.icon}</div>
                <h3 className="text-sm font-bold tracking-wider text-[var(--km-text)] mb-3">
                  {c.title}
                </h3>
                <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-xs tracking-[0.2em] text-[var(--km-text-muted)] uppercase mb-3 text-center">
          Our Vision
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--km-text)] mb-3 text-center">
          เราจะเป็นผู้นำด้าน Privacy Tech
        </h2>
        <p className="text-center text-[var(--km-text-secondary)] max-w-xl mx-auto mb-10">
          สำหรับ Office Worker และองค์กรทั่วโลก — เริ่มจากประเทศไทย ขยายสู่ตลาดต่างประเทศ
          เพราะความเป็นส่วนตัวเป็นเรื่องสากล
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "🖥️",
              title: "Every Desk. Every Device.",
              body: "ฟิล์มกันมองสำหรับทุกหน้าจอในทุกองค์กร ไม่ว่าจะเป็น MacBook, Laptop หรือ Monitor",
            },
            {
              icon: "🌏",
              title: "Beyond Thailand",
              body: "นำ Safescreen สู่ตลาดต่างประเทศที่ privacy เป็นเรื่องปกติในการทำงาน",
            },
            {
              icon: "🔒",
              title: "Privacy as a Standard",
              body: "ทำให้การปกป้องหน้าจอเป็นเรื่อง default ของทุกที่ทำงาน ไม่ใช่ optional",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="border border-[var(--km-border)] rounded-xl p-6 flex gap-4 items-start"
            >
              <span className="text-2xl shrink-0">{v.icon}</span>
              <div>
                <h3 className="font-semibold text-[var(--km-text)] mb-1">{v.title}</h3>
                <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2D2D2D] text-white py-16 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          พร้อมปกป้องความเป็นส่วนตัวของคุณแล้วหรือยัง?
        </h2>
        <p className="text-[var(--km-text-muted)] mb-8">
          เลือกฟิล์มที่เหมาะกับคุณ หรือสอบถามทีมงานได้เลย
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/products"
            className="inline-block bg-white text-[#2D2D2D] font-semibold px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors"
          >
            🛒 ดูสินค้าทั้งหมด →
          </a>
          <a
            href="https://line.me/ti/p/~@safescreenofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-white text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-white/10 transition-colors"
          >
            💬 Line: @safescreenofficial
          </a>
        </div>
      </section>
    </main>
  );
}
