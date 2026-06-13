"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type ToastData = {
  id: string;
  message: string;
  action?: { label: string; href: string };
};

type Props = {
  toast: ToastData;
  onDismiss: (id: string) => void;
};

function ToastItem({ toast, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 bg-[var(--km-text)] text-white px-5 py-3 rounded-full shadow-xl text-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <span className="flex-1 leading-snug">{toast.message}</span>
      {toast.action && (
        <a
          href={toast.action.href}
          className="text-white/70 hover:text-white underline underline-offset-2 whitespace-nowrap text-xs transition-colors"
        >
          {toast.action.label}
        </a>
      )}
      <button onClick={() => { setVisible(false); setTimeout(() => onDismiss(toast.id), 300); }}>
        <X size={14} className="text-white/60 hover:text-white transition-colors" />
      </button>
    </div>
  );
}

type StackProps = { toasts: ToastData[]; onDismiss: (id: string) => void };

export function ToastStack({ toasts, onDismiss }: StackProps) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[600] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
