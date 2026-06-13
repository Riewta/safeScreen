import { HeroBanner } from "@/components/layout/HeroBanner";
import { TrustBar } from "@/components/sections/TrustBar";
import { FlashDeal } from "@/components/sections/FlashDeal";
import { CategoryIcons } from "@/components/sections/CategoryIcons";
import { TopHit } from "@/components/sections/TopHit";
import { PromoScroll } from "@/components/sections/PromoScroll";
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroBanner squareMobile />
      <TrustBar />
      <FlashDeal />
      <CategoryIcons />
      <TopHit />
      <PromoScroll />
    </div>
  );
}
