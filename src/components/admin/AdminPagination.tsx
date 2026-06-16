"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page:       number;
  totalPages: number;
  totalItems: number;
  pageSize:   number;
  onChange:   (p: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const left  = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  const pages: (number | "…")[] = [1];
  if (left > 2)          pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function AdminPagination({ page, totalPages, totalItems, pageSize, onChange }: Props) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, totalItems);
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-xs text-[var(--km-text-muted)]">
        แสดง {from}–{to} จาก {totalItems} รายการ
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--km-border)] text-[var(--km-text-muted)] hover:bg-[var(--km-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-[var(--km-text-muted)] select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                p === page
                  ? "bg-[var(--km-text)] text-white"
                  : "border border-[var(--km-border)] text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)]"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--km-border)] text-[var(--km-text-muted)] hover:bg-[var(--km-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
