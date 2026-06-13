"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaLine, FaTiktok } from "react-icons/fa6";

const SOCIALS = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/safescreen.official?igsh=MXU1MGI3YnR6dzI1Zg==", color: "#E1306C" },
  { icon: FaLine,      label: "LINE",      href: "https://line.me/R/ti/p/@safescreenofficial",                              color: "#06C755" },
  { icon: FaTiktok,    label: "TikTok",    href: "https://www.tiktok.com/@safescreen.official?_r=1&_t=ZS-97Al9cf5GYm",      color: "#010101" },
];

export function SocialLinks() {
  return (
    <div className="flex gap-2.5">
      {SOCIALS.map((s) => (
        <SocialButton key={s.label} {...s} />
      ))}
    </div>
  );
}

function SocialButton({
  icon: Icon,
  label,
  href,
  color,
}: (typeof SOCIALS)[number]) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-9 h-9 flex items-center justify-center transition-all duration-200"
      style={{ color: hovered ? color : "var(--km-text-muted)" }}
    >
      <Icon size={16} />
    </Link>
  );
}
