"use client";

import { useProfile } from "@/stores/user.store";
import { useSearchParams } from "next/navigation";
import { Gift, Ticket, Truck, BadgePercent, ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useState, useRef, useEffect } from "react";
import { PillTabs } from "@/components/ui/PillTabs";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

// ── Tier System ────────────────────────────────────────────────────────────────
const TIERS = [
  { key: "standard", label: "Standard", minPoints: 0,     maxPoints: 999,   color: "#A3A3A3", bg: "#F5F5F5",   benefits: ["สะสม 1 แต้ม / ฿10"] },
  { key: "silver",   label: "Silver",   minPoints: 1000,  maxPoints: 4999,  color: "#6B7280", bg: "#F3F4F6",   benefits: ["สะสม 1.5 แต้ม / ฿10", "ส่วนลดวันเกิด 5%"] },
  { key: "gold",     label: "Gold",     minPoints: 5000,  maxPoints: 14999, color: "#B45309", bg: "#FFFBEB",   benefits: ["สะสม 2 แต้ม / ฿10", "ส่วนลดวันเกิด 10%", "จัดส่งฟรีเดือนละ 2 ครั้ง"] },
  { key: "platinum", label: "Platinum", minPoints: 15000, maxPoints: Infinity, color: "#1C1917", bg: "#F5F5F4", benefits: ["สะสม 3 แต้ม / ฿10", "ส่วนลดวันเกิด 15%", "จัดส่งฟรีไม่จำกัด", "Early Access ทุกดีล"] },
];

function getTier(points: number) {
  return TIERS.slice().reverse().find((t) => points >= t.minPoints) ?? TIERS[0];
}

function TierCard({ points }: { points: number }) {
  const tier     = getTier(points);
  const tierIdx  = TIERS.findIndex((t) => t.key === tier.key);
  const nextTier = TIERS[tierIdx + 1];
  const progress = nextTier
    ? Math.min(100, ((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100)
    : 100;

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden border border-[var(--km-border)]" style={{ background: tier.bg }}>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: tier.color }}>
              {tier.label} Member
            </span>
            <p className="text-[13px] text-[var(--km-text-secondary)] mt-0.5">
              {nextTier
                ? `อีก ${(nextTier.minPoints - points).toLocaleString()} แต้ม → ${nextTier.label}`
                : "คุณอยู่ในระดับสูงสุดแล้ว 🎉"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0" style={{ borderColor: tier.color, background: "white" }}>
            <span className="text-[11px] font-bold" style={{ color: tier.color }}>
              {tier.label.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {nextTier && (
          <div className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-white overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: tier.color }}
              />
            </div>
            <div className="flex justify-between text-[10px]" style={{ color: tier.color }}>
              <span>{tier.minPoints.toLocaleString()}</span>
              <span>{nextTier.minPoints.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="border-t border-[var(--km-border)] px-4 py-3 flex flex-wrap gap-x-4 gap-y-1">
        {tier.benefits.map((b) => (
          <span key={b} className="text-[12px] text-[var(--km-text-secondary)] flex items-center gap-1">
            <span className="w-1 h-1 rounded-full inline-block flex-shrink-0" style={{ background: tier.color }} />
            {b}
          </span>
        ))}
      </div>

      {/* Tier ladder chips */}
      <div className="border-t border-[var(--km-border)] px-4 py-2.5 flex gap-2">
        {TIERS.map((t, i) => (
          <div
            key={t.key}
            className="flex-1 text-center py-1 rounded-full text-[10px] font-semibold border transition-colors"
            style={t.key === tier.key
              ? { background: tier.color, color: "#fff", borderColor: tier.color }
              : { background: "transparent", color: "#A3A3A3", borderColor: "#E5E5E5" }
            }
          >
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_HISTORY = Array.from({ length: 100 }).map((_, i) => ({
  id: `mock-${i}`,
  desc: i % 3 === 0 ? "ซื้อสินค้า ORD-20260512-369" : i % 3 === 1 ? "แลกคะแนนเพื่อรับส่วนลด" : "โบนัสวันเกิด",
  date: new Date(Date.now() - i * 3600000).toISOString(),
  pts: i % 3 === 0 ? 5780 : i % 3 === 1 ? -200 : 500,
}));

const REWARDS = [
  { id: "r1", name: "ส่วนลด ฿50",         points: 200,  icon: BadgePercent },
  { id: "r2", name: "ส่วนลด ฿150",        points: 500,  icon: Ticket },
  { id: "r3", name: "จัดส่งฟรี 1 ครั้ง",  points: 300,  icon: Truck },
  { id: "r4", name: "ของแถมพรีเมี่ยม",    points: 1000, icon: Gift },
];

export default function PointsPage() {
  const isLoggedIn = useRequireAuth();
  const profile    = useProfile();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "history" ? "history" : "redeem";
  const [activeTab, setActiveTab] = useState<"redeem" | "history">(initialTab);

  // History pagination logic (using MOCK_HISTORY for demonstration)
  const history = profile.pointsHistory?.length ? profile.pointsHistory : MOCK_HISTORY;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleHistory = history.slice(0, page * PAGE_SIZE);
  const hasMoreHistory = visibleHistory.length < history.length;

  useEffect(() => {
    if (activeTab !== "history") return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreHistory && !loading) {
          setLoading(true);
          setTimeout(() => {
            setPage((p) => p + 1);
            setLoading(false);
          }, 600); 
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMoreHistory, loading, activeTab]);

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen pb-24 -mx-4 md:-mx-0 mt-0">
      {/* Unified Summary Section */}
      <div className="pt-2 pb-4 flex flex-col items-center text-center">

        <p className="text-[14px] font-normal text-[var(--km-text-secondary)] mb-0.5">คะแนนสะสมทั้งหมด (แต้ม)</p>
        
        <div className="flex items-baseline justify-center">
          <span className="text-[56px] font-semibold text-[var(--km-text)] tracking-tighter">
            {(profile?.points ?? 0).toLocaleString()}
          </span>
        </div>
        
        <p className="text-[14px] font-normal text-amber-600 mt-0.5">
          หมดอายุ 31/12/69
        </p>
      </div>

      {/* Tier Card */}
      <TierCard points={profile?.points ?? 0} />

      {/* Main Content Area */}
      <div className="px-4 md:px-6">
        {/* Tab Switcher (Standard PillTabs) */}
        <div className="flex justify-start">
          <PillTabs
            tabs={[
              { key: "redeem", label: "แลกของรางวัล" },
              { key: "history", label: "ประวัติคะแนน" },
            ]}
            active={activeTab}
            onChange={(k) => setActiveTab(k as typeof activeTab)}
          />
        </div>

        {/* Content Section */}
        <div className="mt-8">
          {activeTab === "redeem" ? (
            <div className="space-y-4">
              {REWARDS.map((r) => {
                const canRedeem = (profile?.points ?? 0) >= r.points;
                const Icon = r.icon;
                return (
                  <div key={r.id} className="relative group flex items-stretch bg-white border border-[var(--km-border)] rounded-2xl overflow-hidden hover:border-[var(--km-text)] transition-all">
                    {/* Left: Icon Stub */}
                    <div className="p-5 flex items-center justify-center bg-[var(--km-surface)] group-hover:bg-white transition-colors">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-[var(--km-border)]">
                        <Icon size={22} strokeWidth={1.5} className="text-[var(--km-text)]" />
                      </div>
                    </div>

                    {/* Coupon Divider (Clean Dashed Line) */}
                    <div className="relative flex flex-col justify-center items-center py-0">
                      <div className="h-full border-l border-dashed border-[var(--km-border)]" />
                    </div>

                    {/* Right: Info & Action */}
                    <div className="flex-1 flex items-center justify-between gap-4 p-5">
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[var(--km-text)] truncate tracking-tight">{r.name}</p>
                        <p className="text-[13px] text-[var(--km-text-muted)] mt-1 font-medium">{(r.points ?? 0).toLocaleString()} คะแนน</p>
                      </div>
                      
                      <Button
                        disabled={!canRedeem}
                        className={`font-medium transition-all active:scale-[0.95] whitespace-nowrap ${
                          canRedeem ? "bg-[var(--km-text)] text-white" : "bg-[var(--km-border)] text-[var(--km-text-muted)]"
                        }`}
                      >
                        แลกคะแนน
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col pb-20">
              {visibleHistory.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between py-5 border-b border-[var(--km-border)] last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[var(--km-surface)] flex items-center justify-center border border-[var(--km-border)]">
                      {(item?.pts ?? 0) > 0 ? (
                        <ArrowDownLeft size={20} strokeWidth={1.5} className="text-emerald-600" />
                      ) : (
                        <ArrowUpRight size={20} strokeWidth={1.5} className="text-[var(--km-text-secondary)]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[var(--km-text)] line-clamp-1">{item.desc}</p>
                      <p className="text-[13px] text-[var(--km-text-muted)] mt-1">
                        {new Date(item.date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <p className={`text-[15px] font-medium ${(item?.pts ?? 0) > 0 ? "text-emerald-600" : "text-[var(--km-text)]"}`}>
                    {(item?.pts ?? 0) > 0 ? "+" : ""}{(item?.pts ?? 0).toLocaleString()}
                  </p>
                </div>
              ))}

              {/* Infinite scroll sentinel & Loading Spinner */}
              <div ref={sentinelRef} className="flex justify-center py-12 min-h-[120px]">
                {loading ? (
                  <div className="w-7 h-7 rounded-full border-2 border-[var(--km-border-strong)] border-t-[var(--km-text)] animate-spin" />
                ) : !hasMoreHistory && history.length > 0 ? (
                  <p className="text-xs text-[var(--km-text-muted)] opacity-40 font-normal">
                    แสดงรายการทั้งหมดแล้ว
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
