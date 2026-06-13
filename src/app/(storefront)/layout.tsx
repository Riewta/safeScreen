import { cookies } from "next/headers";
import { Header } from "@/components/layout/Header";
import { HeaderSpacer } from "@/components/layout/HeaderSpacer";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { LiveChat } from "@/components/layout/LiveChat";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { CheckoutSlideWrapper } from "@/components/layout/CheckoutSlideWrapper";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NotifDrawer } from "@/components/layout/NotifDrawer";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { BrandAccentStrip } from "@/components/layout/BrandAccentStrip";
import { LangProvider } from "@/contexts/lang";
import type { LangCode } from "@/lib/i18n";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("safescreen-lang")?.value;
  const initialLang: LangCode = langCookie === "EN" ? "EN" : "TH";

  return (
    <LangProvider initialLang={initialLang}>
      <SplashScreen />
      <ScrollToTop />
      <Header />
      <HeaderSpacer />
      <main className="flex-1 bg-[var(--km-surface)] overflow-x-hidden">
        <CheckoutSlideWrapper>{children}</CheckoutSlideWrapper>
      </main>
      <BrandAccentStrip />
      <Footer />
      <BottomNav />
      <LiveChat />
      <SearchOverlay />
      <CookieBanner />
      <CartDrawer />
      <NotifDrawer />
    </LangProvider>
  );
}
