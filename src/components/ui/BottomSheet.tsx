"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  headerAction,
  children,
  footer,
  maxHeight = "85vh",
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock (robust mobile position: fixed method)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY || window.pageYOffset;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
      document.body.setAttribute("data-scroll-y", scrollY.toString());
    } else {
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("unset");
      
      if (savedScrollY) {
        const scrollY = parseInt(savedScrollY, 10);
        window.scrollTo(0, scrollY);
        document.body.removeAttribute("data-scroll-y");
      }
    }
    return () => {
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      document.documentElement.style.removeProperty("overflow");
      
      if (savedScrollY) {
        const scrollY = parseInt(savedScrollY, 10);
        window.scrollTo(0, scrollY);
        document.body.removeAttribute("data-scroll-y");
      }
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile: Bottom Sheet */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-[32px] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight }}
      >
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <h2 className="text-base font-medium text-[var(--km-text)]">{title}</h2>
          <div className="flex items-center gap-3">
            {headerAction}
            <button onClick={onClose} className="p-1 -mr-1 text-[var(--km-text-secondary)] hover:text-[var(--km-text)]">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="px-4 pt-3 bg-white flex-shrink-0" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            {footer}
          </div>
        )}
      </div>

      {/* Desktop: Center Modal */}
      <div
        className={`hidden md:flex fixed inset-0 z-[1001] items-center justify-center transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-[24px] shadow-2xl flex flex-col w-full max-w-lg overflow-hidden transition-all duration-300 ${
            isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          style={{ maxHeight: "80vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
            <h2 className="text-base font-medium text-[var(--km-text)]">{title}</h2>
            <div className="flex items-center gap-3">
              {headerAction}
              <button onClick={onClose} className="p-1 -mr-1 text-[var(--km-text-secondary)] hover:text-[var(--km-text)]">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>
          {footer && (
            <div className="px-4 pt-2 pb-4 bg-white flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
