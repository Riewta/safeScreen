# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Senior Fullstack + Design reference. อ่านทุกครั้งก่อนเริ่ม session.

---

## 1. Project Overview

**Product:** Premium Minimal Multi-Brand Beauty E-Commerce Platform
**Client:** Karmarts PCL (บริษัทมหาชน)
**Phase:** B2C (Phase 1 — current) | B2B Portal (Phase 2 — future)
**Traffic:** Mobile-first — 70–80% จาก mobile
**URL:** karmart.com (TBD)

### Vision
> Platform เดียวรวมหลายแบรนด์ในเครือ Karmarts — แต่ละแบรนด์มี identity ผ่านสีและ banner โดยไม่ทำลาย consistency ของระบบ ใช้โทนขาว-ดำเป็นฐานให้สินค้าเป็นจุดเด่น

### Competitive Reference
| Brand | สิ่งที่ดึงมาใช้ |
|---|---|
| **Reunrom** | Premium benchmark — Karmarts brand ที่ Go Inter สำเร็จ |
| **Sephora** | Minimal layout — สินค้าเป็น hero, พื้นที่โล่ง |
| **Olive Young** | UI Consistency — ทุกหน้าสม่ำเสมอ |
| **Konvy** | Beauty category UX — reference ตลาดไทย |
| **Innisfree** | Brand accent style — สีแบรนด์ที่ footer |
| **Lazada / Shopee** | Shopping flow มาตรฐาน — UX pattern หลัก |

---

## 2. Tech Stack

```
Framework:     Next.js 16 (App Router + Turbopack)
Language:      TypeScript (strict)
Styling:       Tailwind CSS v4
Components:    shadcn/ui (Radix UI primitives)
Font:          IBM Plex Sans Thai (Google Fonts) ← lock เดียวทั้งระบบ
State:         Zustand (client state) + TanStack Query (server state)
Payment:       2C2P
Shipping:      Kerry / Flash / DHL / Best / J&T
Auth:          OTP (Email + SMS) / Google / Facebook / LINE
PDPA:          Cookie consent + Consent Management
```

---

## 3. Design System

### 3.1 Mood & Tone
**คีย์เวิร์ด:** Minimal · Premium · เรียบหรู · Modern · ไม่ดูเด็ก
**Product Imagery:** Pack Shot เรียบหรู (หลัก) + Theme/Prop (Hero + Campaign)
**Approach:** สินค้าเป็น hero — background เป็นแค่ canvas ไม่แย่งความสนใจ

---

### 3.2 Color Tokens

```css
/* === CORPORATE (Karmarts) === */
--color-corporate-magenta:       #E91E8C;
--color-corporate-magenta-hover: #C4177A;
--color-corporate-magenta-light: #FCE4F3;

/* === BASE (Global — ทุกแบรนด์ใช้ร่วมกัน) === */
--color-background:    #FFFFFF;
--color-surface:       #F7F7F7;    /* card / section bg */
--color-surface-dark:  #0A0A0A;   /* dark section bg */
--color-border:        #E5E5E5;
--color-border-strong: #D4D4D4;

/* === TEXT === */
--color-text-primary:   #0A0A0A;
--color-text-secondary: #525252;
--color-text-muted:     #A3A3A3;
--color-text-inverse:   #FFFFFF;

/* === SEMANTIC === */
--color-success: #16A34A;
--color-warning: #D97706;
--color-error:   #DC2626;
--color-info:    #2563EB;

/* === BRAND OVERRIDE (per-brand — เปลี่ยนแค่ตัวนี้) === */
--color-brand-primary:       #E91E8C;   /* default = corporate magenta */
--color-brand-primary-hover: #C4177A;
--color-brand-primary-light: #FCE4F3;
--color-brand-on-primary:    #FFFFFF;
```

**กฎเหล็ก:** แบรนด์ override ได้แค่ `--color-brand-*` ห้ามแตะ base tokens

---

### 3.3 Typography — IBM Plex Sans Thai

> **Lock font เดียวทั้งระบบ** — แบรนด์เปลี่ยนได้แค่สี ไม่เปลี่ยน font

```css
/* Scale */
--text-xs:   0.75rem;   /* 12px — label, badge */
--text-sm:   0.875rem;  /* 14px — caption, meta */
--text-base: 1rem;      /* 16px — body */
--text-lg:   1.125rem;  /* 18px — body large */
--text-xl:   1.25rem;   /* 20px — subtitle */
--text-2xl:  1.5rem;    /* 24px — section title */
--text-3xl:  1.875rem;  /* 30px — page title */
--text-4xl:  2.25rem;   /* 36px — hero */
--text-5xl:  3rem;      /* 48px — campaign hero */

/* Weight */
--font-light:    300;
--font-regular:  400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

---

### 3.4 Spacing Scale (8px base grid)

```
4px / 8px / 12px / 16px / 20px / 24px / 32px / 40px / 48px / 64px / 80px / 96px
```

---

### 3.5 Border Radius — A/B Pending

```css
/* Option A — มุมมน (Soft/Modern) */
--radius-sm: 4px  --radius-md: 8px  --radius-lg: 12px  --radius-xl: 16px

/* Option B — มุมเหลี่ยม (Sharp/Luxury) */
--radius-sm: 2px  --radius-md: 4px  --radius-lg: 4px   --radius-xl: 4px

--radius-full: 9999px  /* pill — ใช้ได้ทั้งสอง option */
```

> ⏳ รอ Karmarts เลือก — implement เป็น CSS variable สลับได้ทันที

---

### 3.6 Shadow

```css
--shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.07);
--shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.08);
--shadow-card: 0 2px 8px 0 rgb(0 0 0 / 0.06);
```

---

### 3.7 Breakpoints (Mobile-first)

```
< 768px    Mobile   → Bottom Navbar, single-col
768–1023px Tablet   → Hybrid, 2-col grid
≥ 1024px   Desktop  → Full header nav, 4-col grid
```

---

### 3.8 Z-Index Scale

```
base: 0 | raised: 10 | dropdown: 100 | sticky: 200 | overlay: 300
drawer: 400 | modal: 500 | toast: 600 | tooltip: 700 | bottomnav: 800
```

---

## 4. Layout Architecture

### Desktop
```
┌────────────────────────────────────────┐
│  TopBar (announcement / country)       │
├────────────────────────────────────────┤
│  Header (Logo | Nav | Search | Cart)   │  sticky
├────────────────────────────────────────┤
│  [Page Content]                        │
├────────────────────────────────────────┤
│  Brand Accent Strip  ██████ magenta    │  Innisfree-style
├────────────────────────────────────────┤
│  Footer                                │
└────────────────────────────────────────┘
```

### Mobile
```
┌─────────────────────┐
│  Header (Logo|Cart) │  sticky top
├─────────────────────┤
│  [Page Content]     │
│                     │
├─────────────────────┤
│  🏠   ⊞   🛒   👤  │  fixed bottom — z-800
│ Home Shop Cart  Me  │  64px + safe-area-inset
└─────────────────────┘
```

### Mobile Bottom Navbar — 4 Tabs
| Tab | Icon | Destination |
|---|---|---|
| **Home** | House | หน้าแรก, hero, promotions |
| **Shop** | Grid | Categories, Brands A–Z |
| **Cart** | Bag | ตะกร้า + item count badge |
| **Me** | Person | Login / Profile / Orders / Points |

**Spec:** Active = `--color-brand-primary` | Inactive = `--color-text-muted` | Height 64px + safe-area

---

## 5. Multi-Brand System

```typescript
interface BrandConfig {
  id: string;
  name: string;
  primaryColor: string;       // → --color-brand-primary
  primaryHover: string;
  primaryLight: string;
  onPrimary: string;
  heroImages: string[];
  campaignLanding?: string;
}

// Default (Karmarts Corporate)
const karmartsBrand: BrandConfig = {
  id: 'karmarts',
  name: 'Karmarts',
  primaryColor: '#E91E8C',
  primaryHover: '#C4177A',
  primaryLight: '#FCE4F3',
  onPrimary: '#FFFFFF',
}
```

- Brand Menu เรียง A–Z
- ใช้ชื่อแบรนด์ ไม่ใช้ logo ใน menu

---

## 6. Folder Structure

```
src/
├── app/
│   ├── (storefront)/          # B2C public pages
│   │   ├── page.tsx           # Home
│   │   ├── [brand]/           # Brand flagship store
│   │   ├── products/          # PLP + PDP
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── payment/
│   │   ├── account/           # Member area
│   │   └── campaign/[slug]/   # Campaign landing pages
│   ├── (auth)/                # Login, Register, OTP
│   ├── (legal)/               # PDPA, Privacy, Terms
│   └── api/
│
├── components/
│   ├── ui/                    # shadcn/ui base
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BottomNav.tsx      # Mobile bottom navbar ★
│   │   └── BrandAccentStrip.tsx
│   ├── product/
│   ├── cart/
│   ├── brand/                 # BrandProvider, BrandTheme
│   └── shared/
│
├── lib/
│   ├── brands/                # Brand configs
│   └── utils.ts
│
├── stores/                    # Zustand
│   ├── cart.store.ts
│   ├── brand.store.ts
│   └── user.store.ts
│
├── hooks/
├── types/
└── styles/
    ├── globals.css            # CSS variables + base
    └── tokens.css             # Design tokens
```

---

## 7. B2C Screen Priority (Phase 1)

### P0 — Must Launch
- Home, Country Selector, PLP, PDP, Search
- Cart, Checkout, Payment (2C2P), Order Confirmation
- Login, Register + OTP, Social Login
- Cookie Banner, Privacy Policy, Terms of Service

### P1 — Launch + 2 Weeks
- Campaign / Landing Page, Delivery Tracking, Loading Screen
- Member Dashboard, Profile, Order History, Wishlist ✓

### P2 — Iteration
- Loyalty Points, Tier, Review & Rating, RMA, Notification

---

## 8. Coding Conventions

- `strict: true` — ห้าม `any`
- Server Components by default — `"use client"` เมื่อจำเป็น
- Tailwind utilities เป็นหลัก, CSS variables สำหรับ tokens
- Mobile-first: `base → md: → lg:`
- Images: `next/image` ทุกที่ — ห้ามใช้ `<img>`
- Components: named export PascalCase
- Hooks: `use-kebab-case.ts`

---

## 9. Performance Rules

- Hero video: < 5MB, lazy load
- Banner 20–30+ รูป → virtual carousel
- Font preload: IBM Plex Sans Thai 400 + 600 เท่านั้น
- Bottom Navbar: render ใน 1st paint (no layout shift)

---

## 10. Pending Decisions

| รายการ | Options | Status |
|---|---|---|
| Border radius | A) มุมมน / B) มุมเหลี่ยม | ⏳ รอ client เลือก |
| Loading screen | 3 concept | ⏳ รอ client เลือก |
| Brand list ทั้งหมด | TBD | ⏳ รอข้อมูล |
| Country list | TBD | ⏳ รอข้อมูล |
| Loyalty point rate | X คะแนน / 100 ฿ | ⏳ รอข้อมูล |

---

## 11. Future Phases (ไม่ทำใน Phase 1)

- B2B Portal (Login, Catalog, Bulk Order, Credit Control)
- LINE LIFF Mini App
- Personalization Engine
- Abandoned Cart Recovery
- Affiliate / Referral System
- Admin CMS (Section reorder, Top Hit management)
- Popup Promotion system

---

## 12. Development Commands

```bash
npm run dev      # Start dev server (Next.js + Turbopack) at localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite exists yet.

---

## 13. Runtime Architecture

### CSS Tokens
All design tokens are `--km-*` CSS variables defined in `src/app/globals.css`. Use these exclusively — never hardcode colors or use `--color-*` shadcn tokens in new components. Key tokens: `--km-text`, `--km-surface`, `--km-border`, `--km-border-strong`, `--km-text-muted`, `--km-text-secondary`, `--km-success`, `--km-error`, `--km-warning`.

### Zustand Stores (`src/stores/`)
All client state. No TanStack Query yet — data comes from mock objects in `src/lib/mock-data.ts`.

| Store | Responsibility |
|---|---|
| `cart.store.ts` | Cart items, coupon code, subtotal selector |
| `checkout.store.ts` | Saved addresses (persisted), shipping selection, payment method |
| `ui.store.ts` | Header visibility/lock, header height, search/category overlay state, `headerTitleOverride` |
| `orders.store.ts` | Mock order history — persisted, `version` field for cache-busting seed data. Bump `version` + add `migrate: () => ({ orders: SEED_ORDERS, reviews: [] })` whenever seed data changes. |
| `auth.store.ts` | `isLoggedIn`, `login()`, `logout()` — persisted as `karmart-auth`. Guest flow by default; login triggered by protected actions only. |
| `taxInvoice.store.ts` | Tax invoice form data (persisted) |
| `wishlist.store.ts` | Wishlist item IDs |
| `user.store.ts` | Mock profile (name, email, tier, points) |
| `locale.store.ts` | Selected country/currency (persisted as `karmart-locale`). `COUNTRIES` array defines TH/EN/CN options. |

### Auth & Guest Flow
No forced redirect on first visit. App works as guest by default. Login is triggered only by protected actions (wishlist heart → `LoginModal`, account sub-pages → redirect to `/login?redirect=...`). `LoginClient` accepts email OR phone; auto-detects input type for `inputMode`. Mock OTP is `1234`.

### Header System
`Header.tsx` reads `ROUTE_CONFIGS` (pattern → `{ left, title, right, announcement }`) to switch between hamburger/back button, logo/title, and full/cart-only/none right side. When adding a new route that needs a custom header, add an entry to `ROUTE_CONFIGS`.

- `headerLocked: true` (via `useUIStore`) → header never hides on scroll; also resets hidden state immediately. Use this on full-screen sub-pages (cart, coupon, etc.).
- `headerTitleOverride` → overrides the route-config title without a route change. Use for in-page mode switches (e.g. add/edit address).
- `HeaderSpacer` in the storefront layout pushes content below the fixed header using the measured height stored in `ui.store`.

### Checkout Flow Animation
`CheckoutSlideWrapper` (client component in storefront layout) intercepts pathname changes between `CHECKOUT_STEPS` and animates panels left/right using CSS keyframes defined in `globals.css` (`slideInFromRight`, `slideInFromLeft`, `slideOutToLeft`, `slideOutToRight`). Uses `overflow-x: clip` (not `hidden`) to avoid creating a new scroll container.

### Layout Visibility Rules
Footer and BottomNav both maintain a `CHECKOUT_PATHS` array and return `null` on checkout/cart/coupon routes. When adding a new full-screen route that should hide chrome, add its path to both components.

### Order List Architecture (`/account/orders`)
- Orders are grouped by brand within each order (`groupByBrand()`). Each brand group renders as a separate `BrandCard`.
- `OrderItem` has `isFree?: boolean` and `originalPrice?: number` for free gift items.
- `BrandCard` shows first item always; remaining items collapse/expand with `maxHeight` animation. Entire card is a `div` with `onClick → router.push()` (not `<Link>`) to avoid nested `<a>` errors. Inner links use `e.stopPropagation()`.
- Status shown as plain text in `--km-warning` color (no badge background).
- Action buttons per status: `pending_payment` / `processing` → cancel button in detail page bottom; `delivered` → "ซื้ออีกครั้ง" + "ให้คะแนน" in card footer.
- Countdown timer (`useCountdown`) in order detail page for `pending_payment` orders — 15-minute window from `createdAt`.

### BottomNav Icons
Uses `@phosphor-icons/react` — single import per icon, toggle active state with `weight="fill"` prop (not separate `*Fill` imports which don't exist).

### Page Patterns
- **Flat list without box**: `divide-y divide-[var(--km-border)]` on wrapper, each row `bg-white px-4 py-3.5` — used for notifications, points history.
- **Infinite scroll**: `IntersectionObserver` on sentinel div at bottom, `setTimeout` delay for loading UX. Pattern used in `/account/points/history`.
- **Sticky bottom CTA**: `fixed bottom-0 left-0 right-0`, `paddingBottom: "max(12px, env(safe-area-inset-bottom))"`, `z-[810]`.
- **Coupon card**: Left icon block (72px, dashed right border), right content area — used in both `/coupon` and `/account/coupons`.
- **Non-sticky tab bar**: `PillTabs` with `scrollable` prop — place in page body (not sticky) to scroll with content. Remove outer `px-*` wrapper; padding lives inside `PillTabs` via `px-4` on the scrollable div.
