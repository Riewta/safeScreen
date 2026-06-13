"use client";

import { useState } from "react";
import Image from "next/image";

interface BrandLogoProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSize?: "sm" | "md" | "lg";
}

export function BrandLogo({ 
  src, 
  alt, 
  className = "h-5 w-auto object-contain", 
  width = 70, 
  height = 20 
}: BrandLogoProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <span className="text-xs font-bold text-[var(--km-text)] tracking-tight uppercase whitespace-nowrap">
        {alt}
      </span>
    );
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className} 
      onError={() => setError(true)}
      unoptimized
    />
  );
}
