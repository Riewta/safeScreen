"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const KEY = "safescreen-scroll";

function save(path: string) {
  try {
    const map = JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Record<string, number>;
    map[path] = window.scrollY;
    sessionStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
}

function restore(path: string): number | null {
  try {
    const map = JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Record<string, number>;
    return map[path] ?? null;
  } catch { return null; }
}

export function ScrollToTop() {
  const pathname  = usePathname();
  const isBackRef = useRef(false);

  /* ── ตรวจจับปุ่ม Back ────────────────────────────────── */
  useEffect(() => {
    const onPop = () => { isBackRef.current = true; };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* ── Save scroll ทุก scroll event (debounced 150ms) ──── */
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(tid);
      tid = setTimeout(() => save(pathname), 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(tid);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  /* ── Pathname เปลี่ยน → restore หรือ scroll to top ───── */
  useEffect(() => {
    if (isBackRef.current) {
      isBackRef.current = false;
      const y = restore(pathname);
      if (y !== null) {
        // double rAF เพื่อรอ layout render เสร็จก่อน
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            window.scrollTo({ top: y, behavior: "instant" })
          )
        );
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
