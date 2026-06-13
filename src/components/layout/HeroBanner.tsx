"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

export interface BannerSlide {
  id: string;
  image?: string;
  video?: string;
  alt: string;
  href?: string;
}

export const SLIDES: BannerSlide[] = [
  { id: "1", image: "/hero/banner1.png", alt: "SafeScreen Banner 1", href: "/products" },
  { id: "2", image: "/hero/banner2.jpg", alt: "SafeScreen Banner 2", href: "/products" },
  { id: "3", image: "/hero/banner3.jpg", alt: "SafeScreen Banner 3", href: "/products" },
  { id: "4", image: "/hero/banner4.jpg", alt: "SafeScreen Banner 4", href: "/products" },
  { id: "5", image: "/hero/banner5.jpg", alt: "SafeScreen Banner 5", href: "/products" },
];

// [last_clone, ...real_slides, first_clone]
const AUTOPLAY_MS = 5000;

export function HeroBanner({ 
  imagesOnly, 
  squareMobile, 
  forceRatio,
  customSlides
}: { 
  imagesOnly?: boolean; 
  squareMobile?: boolean; 
  forceRatio?: string;
  customSlides?: BannerSlide[];
} = {}) {
  const slides = customSlides || (imagesOnly ? SLIDES.filter((s) => !s.video) : SLIDES);
  const cloned = [slides[slides.length - 1], ...slides, slides[0]];
  const realCount = slides.length;
  // start at index 1 = first real slide
  const [index, setIndex] = useState(1);
  const [animated, setAnimated] = useState(true);
  const isDragging = useRef(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // real slide index for dots (0-based)
  const dotIndex = ((index - 1) % realCount + realCount) % realCount;

  const goTo = useCallback((i: number, withAnim = true) => {
    setAnimated(withAnim);
    setIndex(i);
  }, []);

  // After transition ends — jump to real slide silently, then re-enable animation
  const onTransitionEnd = useCallback(() => {
    let target: number | null = null;
    if (index === cloned.length - 1) target = 1;
    else if (index === 0) target = realCount;

    if (target !== null) {
      setAnimated(false);
      setIndex(target);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimated(true);
        });
      });
    }
  }, [index, cloned.length, realCount]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        // If we're already at the end clone or beyond, don't increment
        // Let onTransitionEnd or the safety useEffect handle the jump
        if (i >= slides.length + 1) return i;
        return i + 1;
      });
    }, AUTOPLAY_MS);
  }, [slides.length]);

  // Safety jump: if for some reason onTransitionEnd doesn't fire
  useEffect(() => {
    if (index >= slides.length + 2 || index < 0) {
      setAnimated(false);
      const target = index < 0 ? slides.length : 1;
      setIndex(target);
      // Re-enable animation after a short delay
      const timeout = setTimeout(() => setAnimated(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [index, slides.length]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  /* ── Touch / Mouse drag ── */
  const dragStart = (x: number) => {
    touchStartX.current = x;
    touchDeltaX.current = 0;
    isDragging.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const dragMove = (x: number) => {
    if (!isDragging.current) return;
    touchDeltaX.current = x - touchStartX.current;
  };

  const dragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (Math.abs(touchDeltaX.current) > 40) {
      goTo(touchDeltaX.current < 0 ? index + 1 : index - 1);
    }
    startTimer();
  };

  return (
    <div className="select-none overflow-hidden" suppressHydrationWarning>
    <div className="pb-[42%] md:pb-[22%]" style={{ position: "relative", overflow: "hidden" }}>
      {/* Slides track */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          transform: `translateX(${-index * 100}%)`,
          transition: animated ? "transform 0.7s cubic-bezier(0.32, 0.72, 0, 1)" : "none",
          willChange: "transform",
        }}
        onTransitionEnd={onTransitionEnd}
        onTouchStart={(e) => dragStart(e.touches[0].clientX)}
        onTouchMove={(e) => dragMove(e.touches[0].clientX)}
        onTouchEnd={dragEnd}
        onMouseDown={(e) => dragStart(e.clientX)}
        onMouseMove={(e) => dragMove(e.clientX)}
        onMouseUp={dragEnd}
        onMouseLeave={dragEnd}
        draggable={false}
      >
        {cloned.map((slide, i) => (
          <Link
            key={`${slide.id}-${i}`}
            href={slide.href ?? "/"}
            style={{ position: "relative", flexShrink: 0, width: "100%", height: "100%", display: "block", background: "#000" }}
            tabIndex={i === index ? 0 : -1}
            draggable={false}
            onClick={(e) => { if (Math.abs(touchDeltaX.current) > 5) e.preventDefault(); }}
          >
            {slide.video ? (
              <video
                src={slide.video}
                autoPlay loop muted playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
              />
            ) : slide.image ? (
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={i === 1}
                sizes="100vw"
                className="object-contain object-center pointer-events-none"
                draggable={false}
              />
            ) : null}
          </Link>
        ))}
      </div>

      {/* Progress Bar Pagination */}
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, zIndex: 10 }}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={(e) => { e.preventDefault(); goTo(i + 1); startTimer(); }}
            style={{
              height: 3,
              borderRadius: 9999,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              width: i === dotIndex ? 64 : 16,
              background: "rgba(255,255,255,0.3)",
              transition: "width 0.5s cubic-bezier(0.32,0.72,0,1)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, bottom: 0, left: 0,
                background: "#fff",
                width: i === dotIndex ? "100%" : "0%",
                transitionProperty: "width",
                transitionDuration: i === dotIndex ? "5000ms" : "0ms",
                transitionTimingFunction: "linear",
              }}
            />
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
