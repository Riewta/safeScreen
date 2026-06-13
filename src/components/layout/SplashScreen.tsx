"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [hiding,  setHiding]  = useState(false);

  useEffect(() => {
    // Show only once per session
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ss_splash_shown")) return;

    sessionStorage.setItem("ss_splash_shown", "1");
    setVisible(true);

    const hideTimer = setTimeout(() => setHiding(true), 1400);
    const removeTimer = setTimeout(() => setVisible(false), 1900);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500"
      style={{ opacity: hiding ? 0 : 1 }}
    >
      {/* Logo mark */}
      <div
        className="flex flex-col items-center gap-3"
        style={{
          animation: "splashPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        {/* Shield icon */}
        <div className="w-16 h-16 rounded-2xl bg-[var(--km-text)] flex items-center justify-center shadow-lg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-[22px] font-bold tracking-tight text-[var(--km-text)] leading-none">
            SafeScreen
          </p>
          <p className="text-[11px] text-[var(--km-text-muted)] tracking-widest uppercase mt-1 font-medium">
            Tech
          </p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--km-border-strong)]"
            style={{
              animation: `splashDot 1s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splashPop {
          from { opacity: 0; transform: scale(0.8) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splashDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
