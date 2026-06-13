"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

export interface FreeGift {
  productId: string;
  name: string;
  image: string;
  originalPrice: number;
  quantity: number;
}

export interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  href?: string;
  rank?: number;
  badge?: "hot";
  category?: string;
  rating?: number;
  reviewCount?: number;
  freeGifts?: FreeGift[];
  customBrandColor?: string;
  unavailableRegions?: string[];
}

const BADGE_CONFIG = {
  hot: { label: "ยอดฮิต", bg: "#FFD000", text: "#000" },
};

export function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  href,
  rank,
  badge,
  customBrandColor,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  return (
    <Link
      href={href ?? `/products/${id}`}
      className="relative group flex flex-col h-full gap-2 p-3 bg-white rounded-[24px] border border-[var(--km-border)] hover:border-[var(--km-border-strong)] transition-all cursor-pointer"
    >
      {/* Badge / Rank - Absolute to the whole card to avoid clipping and allow corner positioning */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
        {rank !== undefined ? (
          <div
            className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[13px] font-normal"
            style={{ background: customBrandColor || "#171717" }}
          >
            {rank}
          </div>
        ) : (badge && BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG]) ? (
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
            style={{
              background: BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG].bg,
              color: BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG].text,
            }}
          >
            {BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG].label}
          </span>
        ) : null}
      </div>

      {/* ── Image Wrapper ── */}
      <div className="relative">
        <div className="relative aspect-square bg-white overflow-hidden rounded-[16px] flex items-center justify-center" style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}>
          {!imageError ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[var(--km-text-muted)] p-4 text-center">
              <ImageIcon size={32} strokeWidth={1} className="mb-2 opacity-50" />
              <span className="text-xs uppercase tracking-widest">{brand}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 justify-between gap-1 px-0.5 mt-1">
        <div className="flex flex-col gap-1">
          {/* Brand */}
          <p className="text-[13px] font-semibold uppercase text-[var(--km-text)] truncate tracking-wider">
            {brand}
          </p>

          {/* Name */}
          <p className="text-[13px] md:text-[14px] font-normal text-[var(--km-text-secondary)] leading-snug line-clamp-2 min-h-[2.5rem]">
            {name}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {/* Price */}
          <div className="flex flex-col gap-0.5 mt-0.5">
            {originalPrice ? (
              <div className="flex items-center gap-1.5 text-[12px] text-[var(--km-text-muted)] min-h-[18px]">
                <span className="line-through">฿{originalPrice.toLocaleString()}</span>
                {discount && discount > 0 && <span>-{discount}%</span>}
              </div>
            ) : (
              <div className="text-[12px] min-h-[18px]" aria-hidden="true" />
            )}
            <span className="text-[16px] font-medium text-[var(--km-text)]">
              ฿{price.toLocaleString()}
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
}
