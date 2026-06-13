"use client";
import { useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";

export function HeaderSpacer() {
  const height = useUIStore((s) => s.headerHeight);

  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = `${height}px`;
  }, [height]);

  return <div style={{ height }} aria-hidden="true" />;
}
