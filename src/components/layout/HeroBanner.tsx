"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const SLIDES = [
  { type: "image" as const, src: "/banner_promotions/21-9.png", href: "/products" },
  { type: "video" as const, src: "/banner_video.mp4" },
];

const AUTO_PLAY_INTERVAL = 6000;

export function HeroBanner({ squareMobile }: { squareMobile?: boolean } = {}) {
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (index: number) => {
    setActive(index);
  };

  // Auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_PLAY_INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active]);

  // Play/pause video when active
  useEffect(() => {
    if (!videoRef.current) return;
    if (SLIDES[active].type === "video") {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [active]);

  return (
    <div
      className="relative w-full overflow-hidden bg-black h-[220px] md:h-[420px]"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
        >
          {slide.type === "image" ? (
            <Link href={slide.href!} className="absolute inset-0 block">
              <Image
                src={slide.src}
                alt="SafeScreen Banner"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </Link>
          ) : (
            <video
              ref={videoRef}
              src={slide.src}
              muted
              loop
              playsInline
              autoPlay
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </div>
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 20 : 6,
              height: 6,
              background: i === active ? "white" : "rgba(255,255,255,0.5)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
