"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SocialLinks } from "./SocialLinks";
import { useLang } from "@/contexts/lang";

const CHECKOUT_PATHS = ["/cart", "/checkout", "/payment", "/order-confirmation", "/coupon", "/login"];

export function Footer() {
  const pathname = usePathname();
  const { footer: t } = useLang();

  if (CHECKOUT_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
    [t.products]: [
      { label: "MacBook Films",   href: "/products?category=magnetic-privacy" },
      { label: "Universal Films", href: "/products?category=magnetic-privacy&type=universal" },
      { label: "Anti-Blue Films", href: "/products?category=anti-blue" },
      { label: "Nano Films",      href: "/products?category=nano" },
      { label: "Monitor Films",   href: "/products?category=monitor" },
    ],
    [t.services]: [
      { label: "Express Delivery", href: "/express" },
      { label: t.links.storeFront,    href: "/store" },
      { label: t.links.corporate,     href: "/corporate" },
      { label: "AI Model Checker",    href: "/ai-checker" },
      { label: "Blog",                href: "/blog" },
    ],
  };

  return (
    <footer className="bg-white mt-auto border-t border-[var(--km-border)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex flex-col-reverse md:grid md:grid-cols-[2fr_1fr_1fr] gap-4 md:gap-16">
          <div className="mt-4 md:mt-0">
            <Image src="/logo.png" alt="SafeScreen" width={120} height={32} className="h-7 w-auto mb-2" />
            <p className="text-sm text-[var(--km-text-secondary)] leading-relaxed mb-4 whitespace-pre-line">{t.tagline}</p>
            <SocialLinks />
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <FooterSection key={title} title={title} links={links} />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--km-border)]/20 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[13px] text-[var(--km-text-muted)]">
          <div className="flex items-center gap-4">
            <p>© 2026 SafeScreen Tech Co., Ltd.</p>
            <a href="https://www.dbd.go.th" target="_blank" rel="noopener noreferrer">
              <Image src="/dbd-logo.png" alt="DBD – Department of Business Development" width={56} height={56} className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </a>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link href="/privacy" className="hover:text-[var(--km-text)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--km-text)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[var(--km-border)]/40 md:border-none">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-2 md:py-0 md:mb-4 flex items-center justify-between md:cursor-default group">
        <p className="text-sm font-medium text-[var(--km-text)] transition-colors">{title}</p>
        <ChevronDown size={16} className={`text-[var(--km-text-muted)] transition-transform duration-300 md:hidden ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <ul className={`flex flex-col gap-2 pb-2 md:pb-0 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"}`}>
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link href={href} className="text-sm text-[var(--km-text-secondary)] hover:text-[var(--km-text)] transition-colors inline-block py-0.5">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
