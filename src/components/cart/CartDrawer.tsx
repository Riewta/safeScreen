"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";
import { CartClient } from "./CartClient";

export function CartDrawer() {
  const open = useUIStore((s) => s.cartDrawerOpen);
  const close = useUIStore((s) => s.closeCartDrawer);

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`hidden md:block fixed inset-0 z-[870] bg-black/30 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer panel */}
      <div
        className={`hidden md:flex fixed top-0 right-0 bottom-0 z-[880] w-[390px] flex-col bg-[var(--km-surface)] shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <CartClient drawerMode onClose={close} />
      </div>
    </>
  );
}
