import { HeroBanner } from "@/components/layout/HeroBanner";
import { TrustBar } from "@/components/sections/TrustBar";
import { FlashDeal } from "@/components/sections/FlashDeal";
import { TopHit } from "@/components/sections/TopHit";
import { PromoScroll } from "@/components/sections/PromoScroll";
import { StoreMap } from "@/components/sections/StoreMap";
import { StoreServices } from "@/components/sections/StoreServices";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ReviewsStrip } from "@/components/layout/ReviewsStrip";

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
        <StoreMap />
      </ScrollReveal>
      <ScrollReveal>
        <StoreServices />
      </ScrollReveal>
      <ScrollReveal>
        <ReviewsStrip />
      </ScrollReveal>
    </div>
  );
}
