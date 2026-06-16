"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, Package, ChevronDown, ChevronUp, X } from "lucide-react";
import { useOrdersStore, type Order, type OrderStatus } from "@/stores/orders.store";
import { AdminPagination } from "@/components/admin/AdminPagination";

const PAGE_SIZE = 10;

/* ─── Status config ────────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending_payment: { label: "รอชำระ",           bg: "#FEF3C7", text: "#92400E" },
  processing:      { label: "กำลังจัดส่ง",       bg: "#DBEAFE", text: "#1E40AF" },
  shipped:         { label: "อยู่ระหว่างจัดส่ง", bg: "#E0E7FF", text: "#3730A3" },
  delivered:       { label: "ส่งแล้ว",           bg: "#D1FAE5", text: "#065F46" },
  cancelled:       { label: "ยกเลิก",            bg: "#FEE2E2", text: "#991B1B" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
}

/* ─── Row detail panel ─────────────────────────────────────────────────────── */
function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="border-t border-[var(--km-border)] bg-[var(--km-surface)] px-6 py-5">
      <div className="flex items-start justify-between mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm flex-1">
          <div>
            <p className="text-[var(--km-text-muted)] text-[11px] uppercase tracking-wide mb-0.5">ผู้รับ</p>
            <p className="font-medium text-[var(--km-text)]">{order.recipientName}</p>
            <p className="text-[var(--km-text-muted)]">{order.phone}</p>
          </div>
          <div>
            <p className="text-[var(--km-text-muted)] text-[11px] uppercase tracking-wide mb-0.5">ที่อยู่</p>
            <p className="text-[var(--km-text-secondary)] leading-snug">{order.address}</p>
          </div>
          <div>
            <p className="text-[var(--km-text-muted)] text-[11px] uppercase tracking-wide mb-0.5">การชำระ</p>
            <p className="text-[var(--km-text-secondary)]">{order.paymentMethod ?? "—"}</p>
            {order.paidAt && <p className="text-[var(--km-text-muted)] text-[11px] mt-0.5">{formatDate(order.paidAt)}</p>}
          </div>
          <div>
            <p className="text-[var(--km-text-muted)] text-[11px] uppercase tracking-wide mb-0.5">Tracking</p>
            <p className="font-mono text-[var(--km-text-secondary)]">{order.trackingNumber ?? "—"}</p>
            {order.shippingProvider && <p className="text-[var(--km-text-muted)] text-[11px] mt-0.5">{order.shippingProvider}</p>}
          </div>
        </div>
        <button onClick={onClose} className="ml-4 p-1 rounded hover:bg-[var(--km-surface)] transition-colors">
          <X size={16} className="text-[var(--km-text-muted)]" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2.5 border border-[var(--km-border)]">
            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[var(--km-surface)] shrink-0">
              <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[var(--km-text)] truncate">{item.name}</p>
              <p className="text-[11px] text-[var(--km-text-muted)]">{item.variant} · x{item.quantity}</p>
            </div>
            <div className="text-right shrink-0">
              {item.isFree ? (
                <span className="text-[12px] font-medium text-green-600">ฟรี</span>
              ) : (
                <p className="text-[13px] font-medium text-[var(--km-text)]">฿{(item.price * item.quantity).toLocaleString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <div className="text-sm space-y-1 min-w-[200px]">
          <div className="flex justify-between text-[var(--km-text-muted)]">
            <span>ราคาสินค้า</span><span>฿{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[var(--km-text-muted)]">
            <span>ค่าจัดส่ง</span><span>{order.shippingFee === 0 ? "ฟรี" : `฿${order.shippingFee}`}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>ส่วนลด</span><span>-฿{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-[var(--km-text)] border-t border-[var(--km-border)] pt-1 mt-1">
            <span>รวมทั้งหมด</span><span>฿{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────────────────── */
export default function AdminOrdersPage() {
  const { orders, seedIfEmpty } = useOrdersStore();
  const [query, setQuery]           = useState("");
  const [statusFilter, setStatus]   = useState<OrderStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted]       = useState(false);
  const [page, setPage]             = useState(1);

  useEffect(() => {
    seedIfEmpty();
    setMounted(true);
  }, [seedIfEmpty]);

  // Reset page when filter changes
  useEffect(() => { setPage(1); setExpandedId(null); }, [query, statusFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders ?? [])
      .filter((o) => statusFilter === "all" || o.status === statusFilter)
      .filter((o) =>
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.recipientName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => {
    const all = orders ?? [];
    return {
      all:             all.length,
      pending_payment: all.filter(o => o.status === "pending_payment").length,
      processing:      all.filter(o => o.status === "processing").length,
      shipped:         all.filter(o => o.status === "shipped").length,
      delivered:       all.filter(o => o.status === "delivered").length,
      cancelled:       all.filter(o => o.status === "cancelled").length,
    };
  }, [orders]);

  if (!mounted) {
    return (
      <div className="p-6 animate-pulse space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-[var(--km-surface)] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {[
          { key: "all" as const, label: "ทั้งหมด", count: counts.all, bg: "#F9FAFB", text: "#374151" },
          ...ALL_STATUSES.map(s => ({ key: s, label: STATUS_CONFIG[s].label, count: counts[s], bg: STATUS_CONFIG[s].bg, text: STATUS_CONFIG[s].text })),
        ].map(({ key, label, count, bg, text }) => (
          <button
            key={key}
            onClick={() => setStatus(key)}
            className={`rounded-xl px-3 py-3 text-left transition-all border-2 ${statusFilter === key ? "border-[var(--km-text)] shadow-sm" : "border-transparent"}`}
            style={{ background: bg }}
          >
            <p className="text-[22px] font-bold" style={{ color: text }}>{count}</p>
            <p className="text-[11px] mt-0.5" style={{ color: text, opacity: 0.75 }}>{label}</p>
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--km-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาเลขออเดอร์, ชื่อลูกค้า, เบอร์โทร, Tracking..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-[var(--km-border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--km-text)] focus:border-transparent transition-all"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--km-border-strong)] hover:text-[var(--km-text-muted)]">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-[var(--km-text-muted)] mb-3">{filtered.length} รายการ</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[var(--km-border)] overflow-hidden shadow-sm">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-3 bg-[var(--km-surface)] border-b border-[var(--km-border)] text-[11px] font-medium text-[var(--km-text-muted)] uppercase tracking-wide">
          <span>เลขออเดอร์</span>
          <span>ลูกค้า</span>
          <span>สถานะ</span>
          <span>ยอดรวม</span>
          <span>วันที่</span>
          <span />
        </div>

        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--km-text-muted)]">
            <Package size={32} strokeWidth={1.5} />
            <p className="text-sm">ไม่พบออเดอร์ที่ตรงกัน</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--km-border)]">
            {pageItems.map((order) => {
              const isOpen = expandedId === order.id;
              return (
                <div key={order.id}>
                  <div
                    className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-3.5 items-center hover:bg-[var(--km-surface)] transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isOpen ? null : order.id)}
                  >
                    <div>
                      <p className="font-mono text-[13px] font-medium text-[var(--km-text)]">{order.id}</p>
                      <p className="text-[11px] text-[var(--km-text-muted)] mt-0.5">
                        {order.items.length} ชิ้น
                        {order.trackingNumber && <span className="ml-2">· {order.trackingNumber}</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-[13px] text-[var(--km-text)]">{order.recipientName}</p>
                      <p className="text-[11px] text-[var(--km-text-muted)]">{order.phone}</p>
                    </div>
                    <StatusBadge status={order.status} />
                    <p className="text-[13px] font-medium text-[var(--km-text)]">฿{order.total.toLocaleString()}</p>
                    <p className="text-[12px] text-[var(--km-text-muted)]">{formatDate(order.createdAt)}</p>
                    <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--km-surface)] transition-colors ml-auto">
                      {isOpen
                        ? <ChevronUp size={14} className="text-[var(--km-text-muted)]" />
                        : <ChevronDown size={14} className="text-[var(--km-text-muted)]" />}
                    </button>
                  </div>
                  {isOpen && <OrderDetail order={order} onClose={() => setExpandedId(null)} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onChange={(p) => { setPage(p); setExpandedId(null); }}
      />
    </div>
  );
}
