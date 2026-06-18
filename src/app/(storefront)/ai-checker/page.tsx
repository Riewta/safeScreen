"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  ChevronRight,
  ShoppingBag,
  RotateCcw,
  ShoppingCart,
  Clock,
} from "lucide-react";
import { useLang } from "@/contexts/lang";
import { PRODUCTS } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart.store";

// ── Types ─────────────────────────────────────────────────────────────────────

type DeviceBrand = "MacBook Air" | "MacBook Pro" | "Universal Laptop" | "iPad" | "Surface";
type FilmType = "Privacy" | "Paperlike" | "AntiBlue";

interface FilmOption {
  type: FilmType;
  label: string;
  desc: string;
  comingSoon?: boolean;
}

// ── Device → sizes ────────────────────────────────────────────────────────────

const SIZE_OPTIONS: Record<DeviceBrand, string[]> = {
  "MacBook Air": [
    '13.3" (M1 / Retina)',
    '13.6" (M2 / M3 / M4 / M5)',
    '15.3" (M2 / M3 / M4 / M5)',
  ],
  "MacBook Pro": [
    '13.3" (2019 / 2020 / 2022)',
    '14.2" (M2 / M3 / M4 / M5)',
    '15.3" (2019)',
    '16.2" (M1 / M2 / M3 / M4 / M5)',
  ],
  "Universal Laptop": [
    '12.5" (16:9)',
    '13.3" (16:9)',
    '13.3" (16:10)',
    '14" (16:9)',
    '14" (16:10)',
    '15.6" (16:9)',
    '16" (16:10)',
    '17.3" (16:9)',
  ],
  iPad: [
    'iPad Air (Gen 4/5, 10.9")',
    'iPad Air 11" (M2/M3)',
    'iPad Pro 11" (All Gen)',
    'iPad Pro 12.9" (All Gen)',
    'iPad Pro 13" (M4/M5)',
  ],
  Surface: [
    'Surface Go 10.5"',
    'Surface Pro 12.3"',
    'Surface Pro 13"',
    'Surface Laptop 13.5"',
    'Surface Laptop 13.8"',
    'Surface Laptop 14.4"',
    'Surface Laptop 15"',
  ],
};

// ── Device → film type options ────────────────────────────────────────────────
// desc values are replaced with i18n keys at render time — see filmOptions below

// ── Compatibility table: (device, size, film) → product ID ───────────────────
//    null  = not available / no product
//    string = product ID from PRODUCTS

type SizeFilmMap = Partial<Record<FilmType, string | null>>;
const COMPAT: Partial<Record<DeviceBrand, Record<string, SizeFilmMap>>> = {
  "MacBook Air": {
    '13.3" (M1 / Retina)':        { Privacy: "1" },
    '13.6" (M2 / M3 / M4 / M5)': { Privacy: "2" },
    '15.3" (M2 / M3 / M4 / M5)': { Privacy: "3" },
  },
  "MacBook Pro": {
    '13.3" (2019 / 2020 / 2022)':       { Privacy: "4" },
    '14.2" (M2 / M3 / M4 / M5)':        { Privacy: "5" },
    '15.3" (2019)':                       { Privacy: null },
    '16.2" (M1 / M2 / M3 / M4 / M5)':  { Privacy: "6" },
  },
  "Universal Laptop": {
    '12.5" (16:9)':  { Privacy: null },
    '13.3" (16:9)':  { Privacy: "7" },
    '13.3" (16:10)': { Privacy: "7" },
    '14" (16:9)':    { Privacy: "8" },
    '14" (16:10)':   { Privacy: "9" },
    '15.6" (16:9)':  { Privacy: "11" },
    '16" (16:10)':   { Privacy: "12" },
    '17.3" (16:9)':  { Privacy: "14" },
  },
  iPad: {
    'iPad Air (Gen 4/5, 10.9")': { Privacy: "ipad-pv-air45",    Paperlike: "ipad-pl-air45" },
    'iPad Air 11" (M2/M3)':      { Privacy: "ipad-pv-air-m2m3", Paperlike: "ipad-pl-air-m2m3" },
    'iPad Pro 11" (All Gen)':    { Privacy: "ipad-pv-pro11",    Paperlike: "ipad-pl-pro11" },
    'iPad Pro 12.9" (All Gen)':  { Privacy: "ipad-pv-pro129",   Paperlike: "ipad-pl-pro129" },
    'iPad Pro 13" (M4/M5)':      { Privacy: "ipad-pv-pro-m4m5", Paperlike: "ipad-pl-pro-m4m5" },
  },
  Surface: {
    // No products yet — all sizes fall through to null
  },
};

// ── StepDot ───────────────────────────────────────────────────────────────────

function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
        done
          ? "bg-[var(--km-success)] text-white"
          : active
          ? "bg-[var(--km-brand)] text-white scale-110"
          : "bg-[var(--km-border)] text-[var(--km-text-muted)]"
      }`}
    >
      {done ? <CheckCircle size={16} /> : n}
    </div>
  );
}

// ── ProductResultCard ─────────────────────────────────────────────────────────

function ProductResultCard({ productId }: { productId: string }) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const { pages: t } = useLang();

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand ?? "SafeScreen",
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      variant: "ชิ้นเดียว",
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white border border-[var(--km-border)] rounded-2xl overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Product image */}
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-[var(--km-surface)] flex-shrink-0 relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--km-text)] leading-snug line-clamp-3">
            {product.name}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-[var(--km-text)]">
              ฿{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-[var(--km-text-muted)] line-through">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-semibold" style={{ color: "var(--km-error)" }}>
                  -{discount}%
                </span>
              </>
            )}
          </div>
          {product.rating && (
            <p className="text-xs text-[var(--km-text-muted)] mt-1">
              ⭐ {product.rating} · {product.reviewCount?.toLocaleString()} รีวิว
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            added
              ? "text-white"
              : "text-white hover:opacity-90"
          }`}
          style={{
            backgroundColor: added ? "var(--km-success)" : "var(--km-brand)",
          }}
        >
          <ShoppingCart size={16} />
          {added ? t.aiAdded : t.aiAddToCart}
        </button>
        <Link
          href="/products"
          className="flex items-center justify-center px-4 py-2.5 border border-[var(--km-border)] rounded-xl text-sm text-[var(--km-text-secondary)] hover:bg-[var(--km-surface)] transition-colors whitespace-nowrap"
        >
          {t.aiViewMore}
        </Link>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AiCheckerPage() {
  const { pages: t } = useLang();
  const [device, setDevice] = useState<DeviceBrand | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [film, setFilm] = useState<FilmType | null>(null);

  const step = device === null ? 1 : size === null ? 2 : film === null ? 3 : 4;

  // productId: string = found, null = not available, undefined = not resolved yet
  const productId: string | null | undefined =
    device && size && film ? (COMPAT[device]?.[size]?.[film] ?? null) : undefined;

  function reset() {
    setDevice(null);
    setSize(null);
    setFilm(null);
  }

  const DEVICES: { brand: DeviceBrand; label: string }[] = [
    { brand: "MacBook Air",       label: "MacBook Air" },
    { brand: "MacBook Pro",       label: "MacBook Pro" },
    { brand: "Universal Laptop",  label: "Universal Laptop" },
    { brand: "iPad",              label: "iPad" },
    { brand: "Surface",           label: "Surface" },
  ];

  const FILM_OPTIONS: Record<DeviceBrand, FilmOption[]> = {
    "MacBook Air": [
      { type: "Privacy",  label: "Privacy Screen",  desc: t.aiPrivacyDesc },
      { type: "AntiBlue", label: "Anti-Blue",        desc: t.aiAntiBlueDesc, comingSoon: true },
    ],
    "MacBook Pro": [
      { type: "Privacy",  label: "Privacy Screen",  desc: t.aiPrivacyDesc },
      { type: "AntiBlue", label: "Anti-Blue",        desc: t.aiAntiBlueDesc, comingSoon: true },
    ],
    "Universal Laptop": [
      { type: "Privacy",  label: "Privacy Screen",  desc: t.aiPrivacyDesc },
      { type: "AntiBlue", label: "Anti-Blue",        desc: t.aiAntiBlueDesc, comingSoon: true },
    ],
    iPad: [
      { type: "Privacy",   label: "Privacy Film",   desc: t.aiPrivacyDesc },
      { type: "Paperlike", label: "Paperlike Film",  desc: t.aiPaperlikeDesc },
    ],
    Surface: [
      { type: "Privacy", label: "Privacy Screen", desc: t.aiPrivacyDesc },
    ],
  };

  const filmOptions = device ? FILM_OPTIONS[device] : [];

  return (
    <div className="min-h-screen bg-[var(--km-bg)]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--km-text)] mb-2">
            {t.aiTitle}
          </h1>
          <p className="text-[var(--km-text-secondary)]">{t.aiSubtitle}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center">
              <StepDot n={n} active={step === n} done={step > n} />
              {n < 3 && (
                <div
                  className={`h-0.5 w-12 md:w-20 transition-colors ${
                    step > n ? "bg-[var(--km-success)]" : "bg-[var(--km-border)]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step labels */}
        <div className="flex justify-between text-xs text-[var(--km-text-muted)] mb-8 px-1">
          <span className={step >= 1 ? "text-[var(--km-text-secondary)] font-medium" : ""}>
            {t.aiStepDevice}
          </span>
          <span className={step >= 2 ? "text-[var(--km-text-secondary)] font-medium" : ""}>
            {t.aiStepSize}
          </span>
          <span className={step >= 3 ? "text-[var(--km-text-secondary)] font-medium" : ""}>
            {t.aiStepFilm}
          </span>
        </div>

        {/* ── Step 1: Device ── */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--km-text)] mb-4">
              {t.aiSelectDevice}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {DEVICES.map(({ brand, label }) => (
                <button
                  key={brand}
                  onClick={() => { setDevice(brand); setSize(null); setFilm(null); }}
                  className="flex items-center justify-between gap-3 bg-white border border-[var(--km-border)] rounded-2xl px-5 py-4 text-left hover:border-[var(--km-brand)] hover:bg-[var(--km-brand-light)] transition-all group"
                >
                  <span className="font-medium text-[var(--km-text)] text-sm">{label}</span>
                  <ChevronRight
                    size={16}
                    className="text-[var(--km-text-muted)] group-hover:text-[var(--km-brand)] transition-colors flex-shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Size ── */}
        {step === 2 && device && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setDevice(null)}
                className="text-sm text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
              >
                {t.aiBack}
              </button>
              <span className="text-[var(--km-text-muted)]">/</span>
              <span className="text-sm font-medium text-[var(--km-text)]">{device}</span>
            </div>
            <h2 className="text-lg font-semibold text-[var(--km-text)] mb-4">
              {t.aiSelectSize}
            </h2>
            <div className="space-y-2">
              {SIZE_OPTIONS[device].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSize(s); setFilm(null); }}
                  className="w-full flex items-center justify-between bg-white border border-[var(--km-border)] rounded-xl px-5 py-3.5 text-left hover:border-[var(--km-brand)] hover:bg-[var(--km-brand-light)] transition-all group"
                >
                  <span className="font-medium text-[var(--km-text)] text-sm">{s}</span>
                  <ChevronRight
                    size={16}
                    className="text-[var(--km-text-muted)] group-hover:text-[var(--km-brand)] transition-colors"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Film type ── */}
        {step === 3 && device && size && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setSize(null)}
                className="text-sm text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
              >
                {t.aiBack}
              </button>
              <span className="text-[var(--km-text-muted)]">/</span>
              <span className="text-sm text-[var(--km-text-secondary)]">{device}</span>
              <span className="text-[var(--km-text-muted)]">/</span>
              <span className="text-sm font-medium text-[var(--km-text)]">{size}</span>
            </div>
            <h2 className="text-lg font-semibold text-[var(--km-text)] mb-4">
              {t.aiSelectFilm}
            </h2>
            <div className="space-y-3">
              {filmOptions.map((f) => (
                <button
                  key={f.type}
                  onClick={() => !f.comingSoon && setFilm(f.type)}
                  disabled={!!f.comingSoon}
                  className={`w-full flex items-center gap-4 border rounded-2xl px-5 py-4 text-left transition-all group ${
                    f.comingSoon
                      ? "bg-[var(--km-surface)] border-[var(--km-border)] opacity-60 cursor-not-allowed"
                      : "bg-white border-[var(--km-border)] hover:border-[var(--km-brand)] hover:bg-[var(--km-brand-light)]"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[var(--km-text)] text-sm">
                        {f.label}
                      </span>
                      {f.comingSoon && (
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: "rgba(217, 119, 6, 0.1)",
                            color: "var(--km-warning)",
                          }}
                        >
                          <Clock size={10} />
                          {t.aiComingSoon}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--km-text-secondary)] mt-0.5">{f.desc}</div>
                  </div>
                  {!f.comingSoon && (
                    <ChevronRight
                      size={16}
                      className="text-[var(--km-text-muted)] group-hover:text-[var(--km-brand)] transition-colors flex-shrink-0"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Results ── */}
        {step === 4 && device && size && film && (
          <div>
            {/* Selection summary */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[device, size, film === "Privacy" ? "Privacy Screen" : film === "Paperlike" ? "Paperlike Film" : "Anti-Blue"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs font-medium bg-[var(--km-surface)] border border-[var(--km-border)] text-[var(--km-text-secondary)] px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            {productId ? (
              <div>
                <h2 className="text-lg font-semibold text-[var(--km-text)] mb-1">
                  {t.aiFoundTitle}
                </h2>
                <p className="text-sm text-[var(--km-text-secondary)] mb-5">
                  {t.aiFoundDesc} {device} {size}
                </p>
                <div className="mb-8">
                  <ProductResultCard productId={productId} />
                </div>
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[var(--km-surface)] border border-[var(--km-border)] text-[var(--km-text-secondary)] font-medium rounded-xl hover:bg-[var(--km-border)] transition-colors text-sm"
                >
                  <ShoppingBag size={16} />
                  {t.aiViewAll}
                </Link>
              </div>
            ) : (
              <div className="bg-[var(--km-surface)] border border-[var(--km-border)] rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">😕</div>
                <h2 className="text-lg font-semibold text-[var(--km-text)] mb-2">
                  {t.aiNotFoundTitle}
                </h2>
                <p className="text-sm text-[var(--km-text-secondary)] mb-6">
                  {device} {size} {t.aiNotFoundDesc}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--km-brand)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {t.aiViewAll}
                  </Link>
                  <Link
                    href="/corporate"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--km-border)] text-[var(--km-text-secondary)] font-medium rounded-xl hover:bg-white transition-colors"
                  >
                    {t.aiContactTeam}
                  </Link>
                </div>
              </div>
            )}

            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 border border-[var(--km-border)] text-[var(--km-text-secondary)] text-sm font-medium rounded-xl hover:bg-[var(--km-surface)] transition-colors"
            >
              <RotateCcw size={15} />
              {t.aiReset}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
