import { HeroBanner } from "@/components/layout/HeroBanner";
import { TrustBar } from "@/components/sections/TrustBar";
import { FlashDeal } from "@/components/sections/FlashDeal";
import { TopHit } from "@/components/sections/TopHit";
import { PromoScroll } from "@/components/sections/PromoScroll";
import { StoreServices } from "@/components/sections/StoreServices";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroBanner squareMobile />
      <ScrollReveal>
        <TrustBar />
      </ScrollReveal>
      <ScrollReveal>
        <FlashDeal />
      </ScrollReveal>
      <ScrollReveal>
        <TopHit />
      </ScrollReveal>
      <ScrollReveal>
        <PromoScroll />
      </ScrollReveal>
      <ScrollReveal>
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <video
              src="/Wide_LTR_1.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full rounded-2xl block"
            />
          </div>
        </section>
      </ScrollReveal>
      <ScrollReveal>
        <StoreServices />
      </ScrollReveal>
    </div>
  );
}
