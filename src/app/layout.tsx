import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai, Montserrat } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
  preload: true,
});

// Montserrat for English/Latin characters only
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "SafeScreen Tech — Magnetic Privacy Screen Films",
    template: "%s | SafeScreen Tech",
  },
  description: "ฟิล์มกันมองแม่เหล็กสำหรับ MacBook, Laptop และ iPad — ถอดติดได้ทันที",
  keywords: ["privacy screen", "ฟิล์มกันมอง", "safescreen", "macbook", "laptop"],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${montserrat.variable} ${notoSansThai.className}`}>
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
