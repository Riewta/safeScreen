# Karmarts Web — Task Tracker

> Phase 1 — B2C Storefront  
> อิง Direction: Premium Minimal · White Tone · IBM Plex Sans Thai · Magenta #E91E8C · Mobile-first

---

## ✅ Done

### Flow 1 — Home
- [x] HeroBanner carousel loop (clone technique + double rAF fix)
- [x] Brand showcase (scroll horizontal, logo images)
- [x] Category quick links (18 หมวดหมู่, icon grid)
- [x] TopHit section (tabbed: ในประเทศไทย / จากทั่วโลก)
- [x] FlashDeal (countdown 7 วัน, progress bar, horizontal scroll)
- [x] PromoScroll (image banner scroll)
- [x] ForYou (tabbed: สินค้ามาใหม่ / แคมเปญช่วงนี้ / สินค้าแนะนำ)
- [x] Centralized mock data (`src/lib/mock-data.ts`)

### Flow 2 — Product Listing Page (PLP)
- [x] `/products` — grid 2-col mobile / 4-col desktop
- [x] Filter sidebar desktop (ช่วงราคา / คะแนน / ประเภท / แบรนด์)
- [x] Filter bottom sheet mobile (animate up)
- [x] Sort dropdown (ยอดนิยม / ราคา / ใหม่ / คะแนน)
- [x] Active filter chips (ล้างแต่ละตัวได้)
- [x] Empty state

### Flow 3 — Product Detail Page (PDP)
- [x] Image gallery (main + 4 thumbnails)
- [x] Product info (brand, name, rating, price, discount badge)
- [x] Sticky section tab bar (รายละเอียด / ส่วนผสม / รีวิว) — IntersectionObserver
- [x] All sections inline (scroll to anchor, ไม่ใช่ tab switching)
- [x] Review section (rating breakdown + list)
- [x] Gift with purchase (ของแถม — เลือกได้จาก bottom sheet)
- [x] Mobile sticky bottom bar แทน BottomNav (❤️ 🛒 | ซื้อเลย)
- [x] Product sheet bottom sheet (variant + qty + gift selection + CTA)
- [x] Related products section

### Flow 4 — Cart
- [x] Zustand cart store (persist localStorage)
- [x] `/cart` — item list, qty edit, remove
- [x] Free shipping progress bar
- [x] Coupon code (KARMART10 / BEAUTY20 / NEWMEMBER)
- [x] Order summary sidebar (sticky desktop)
- [x] Empty cart state
- [x] Cart badge บน Header + BottomNav (live จาก store)

### Layout & System
- [x] Header (sticky, announcement bar, desktop nav, mobile drawer)
- [x] Footer (white tone, brand accent strip, social links)
- [x] BottomNav (4 tabs, ซ่อนบน PDP อัตโนมัติ)
- [x] Design tokens (CSS variables --km-*)
- [x] IBM Plex Sans Thai (next/font/google)
- [x] Scrollbar hidden globally
- [x] next/image remotePatterns (unsplash)

---

## 🔲 Todo

### Flow 5 — Checkout
- [ ] Step indicator (ที่อยู่ → จัดส่ง → ชำระเงิน)
- [ ] Step 1: Address form (ชื่อ / เบอร์ / ที่อยู่ / ตำบล / อำเภอ / จังหวัด / รหัสไปรษณีย์)
- [ ] Saved addresses (select จาก list)
- [ ] Step 2: Shipping method selector (Kerry / Flash / DHL / Best / J&T)
- [ ] Step 3: Payment method (Credit Card 2C2P / PromptPay QR / COD)
- [ ] Order summary sidebar (ตลอด 3 step)
- [ ] Order confirmation page (`/order/[id]`)

### Flow 6 — Auth
- [ ] `/login` — OTP Email / Google / Facebook / LINE
- [ ] `/register` — form + OTP verify
- [ ] OTP screen (6-digit input, resend countdown)
- [ ] Forgot password flow
- [ ] Social login callback pages
- [ ] **Gate: ต้องล็อคอินก่อน Add to Cart / Checkout** (redirect back หลัง login)

### Flow 7 — Member Area
- [ ] `/account` — dashboard (order summary, points, wishlist shortcut)
- [ ] `/account/profile` — edit name, phone, email
- [ ] `/account/orders` — order history list
- [ ] `/account/orders/[id]` — order detail + tracking
- [ ] `/account/wishlist` — wishlist grid (ProductCard)
- [ ] `/account/addresses` — address book (add / edit / delete / set default)
- [ ] `/account/points` — loyalty points history + tier (P1)

### Flow 8 — Search
- [ ] Search overlay (mobile full-screen, desktop dropdown)
- [ ] Autocomplete / Recent searches
- [ ] Results page `/search?q=X` (reuse PLP grid + filters)
- [ ] No results state

### Flow 9 — Campaign / Landing
- [ ] `/campaign/[slug]` — hero banner + product grid
- [ ] `/campaign/flash-deal` — flash deal full page

### Flow 10 — Legal & PDPA
- [ ] Cookie consent banner (first-visit, persist choice)
- [ ] `/privacy` — Privacy Policy page
- [ ] `/terms` — Terms of Service page

---

## 🔮 Future (Phase 2+)

| Feature | Note |
|---|---|
| B2B Portal | Login แยก, catalog, bulk order, credit control |
| LINE LIFF Mini App | — |
| Loyalty Points & Tier | คะแนน, redeem, tier badge |
| Personalization Engine | Recommendation based on history |
| Abandoned Cart Recovery | Email/LINE push |
| Affiliate / Referral | — |
| Admin CMS | Section reorder, Top Hit management, Popup |
| Review & Rating — verified purchase | — |
| RMA / Return flow | — |
| Notification center | In-app + push |

---

## ⏳ Pending Decisions (รอ Client)

| รายการ | Options | Status |
|---|---|---|
| Border radius | A) มุมมน / B) มุมเหลี่ยม | ⏳ รอ client เลือก |
| Loading screen | 3 concept | ⏳ รอ client เลือก |
| Brand list ทั้งหมด | TBD | ⏳ รอข้อมูล |
| Country selector | TH / MY / SG / etc. | ⏳ รอข้อมูล |
| Loyalty point rate | X คะแนน / 100 ฿ | ⏳ รอข้อมูล |
| Auth gate — cart | Login ก่อน หรือ Guest checkout? | ⏳ รอ decision |
| Payment — 2C2P | Sandbox credentials | ⏳ รอ credentials |
| Shipping API | Kerry / Flash integration | ⏳ รอ API key |

---

## 📁 Key Files

```
src/
├── app/(storefront)/
│   ├── page.tsx                    # Home
│   ├── products/page.tsx           # PLP
│   ├── products/[id]/page.tsx      # PDP
│   └── cart/page.tsx               # Cart
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BottomNav.tsx           # ซ่อนบน PDP อัตโนมัติ
│   │   ├── HeroBanner.tsx
│   │   └── BrandAccentStrip.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── PLPClient.tsx           # Filter + Sort + Grid
│   │   └── PDPClient.tsx           # Gallery + Sheet + Sections
│   ├── sections/
│   │   ├── TopHit.tsx
│   │   ├── FlashDeal.tsx
│   │   ├── PromoScroll.tsx
│   │   └── ForYou.tsx
│   └── cart/
│       └── CartClient.tsx
├── stores/
│   └── cart.store.ts               # Zustand + persist
└── lib/
    └── mock-data.ts                # Single source of truth สำหรับ mock
```

---

## 🎨 Design Notes

- **ห้ามใช้อิโมจิ** ในทุก component
- **Font lock**: IBM Plex Sans Thai เท่านั้น ห้ามเปลี่ยน
- **Color**: แบรนด์ override ได้แค่ `--km-brand-*` ห้ามแตะ base tokens
- **Mobile-first**: base → md: → lg: เสมอ
- **Tone**: Premium Minimal, White/Light surface, สินค้าเป็น hero
- **Images**: `next/image` ทุกที่ ห้ามใช้ `<img>`
- **Scrollbar**: ซ่อนทั้งระบบ (globals.css)
