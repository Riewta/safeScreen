# Backend Integration Guide — SafeScreen / Karmarts Platform

เอกสารนี้เขียนสำหรับทีม Backend โดยเฉพาะ อธิบายทุกอย่างที่ Frontend ต้องการ — endpoints, request/response shape, auth flow, และวิธีเปิดใช้งาน real API

---

## สารบัญ

1. [วิธีเชื่อม Backend (เริ่มต้นเร็ว)](#1-วิธีเชื่อม-backend-เริ่มต้นเร็ว)
2. [Architecture Overview](#2-architecture-overview)
3. [Auth Flow](#3-auth-flow)
4. [API Endpoints ทั้งหมด](#4-api-endpoints-ทั้งหมด)
5. [Data Types Reference](#5-data-types-reference)
6. [Shipping & Payment Options](#6-shipping--payment-options)
7. [Business Rules ที่ Frontend ทำอยู่](#7-business-rules-ที่-frontend-ทำอยู่)
8. [Mock Data ที่ใช้อยู่](#8-mock-data-ที่ใช้อยู่)

---

## 1. วิธีเชื่อม Backend (เริ่มต้นเร็ว)

### ขั้นตอนเดียว — ตั้ง environment variable

สร้างไฟล์ `.env.local` ที่ root ของ project แล้วใส่:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourbackend.com
```

เท่านี้พอ — ทุก service จะเปลี่ยนจาก mock data ไปใช้ real API call ทันที ไม่ต้องแก้โค้ด

ถ้าไม่ตั้ง (หรือตั้งเป็นค่าว่าง) → Frontend ใช้ mock data ทั้งหมด (สำหรับ dev/demo)

### ตรวจสอบว่าเชื่อมแล้ว

เปิด browser DevTools → Network tab → กรองด้วย `api.yourbackend.com` — ถ้าเห็น request แสดงว่าเชื่อมแล้ว

---

## 2. Architecture Overview

```
Browser
  │
  ├── Zustand Stores          ← CLIENT state เท่านั้น
  │     cart.store.ts           (ตะกร้า, UI, locale, checkout form)
  │     ui.store.ts
  │     checkout.store.ts
  │     locale.store.ts
  │
  ├── TanStack Query Hooks    ← SERVER state (query + cache)
  │     hooks/queries/          useProducts, useOrders, useUserProfile ...
  │     hooks/mutations/        useCancelOrder, useSubmitReview ...
  │        │
  │        ▼
  │     services/*.service.ts  ← abstraction layer (mock OR real)
  │        │
  │        ▼
  │     lib/api-client.ts      ← HTTP fetch wrapper
  │        │
  │        ▼
  └──  YOUR BACKEND API
```

### กฎสำคัญ

| State ประเภทไหน | เก็บที่ไหน |
|---|---|
| ตะกร้าสินค้า, ที่อยู่จัดส่ง, วิธีชำระเงิน | Zustand (localStorage) |
| รายการสินค้า, ออเดอร์, โปรไฟล์ user | TanStack Query (ดึงจาก API) |
| UI state (modal เปิด/ปิด, header) | Zustand (ไม่ persist) |

---

## 3. Auth Flow

### 3.1 Token Storage

เมื่อ login สำเร็จ Frontend เก็บ token ใน Zustand store (persist ลง `localStorage` key: `karmart-auth`):

```json
{
  "state": {
    "isLoggedIn": true,
    "email": "user@example.com",
    "name": "ชื่อผู้ใช้",
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### 3.2 ส่ง Token อัตโนมัติ

`api-client.ts` อ่าน `accessToken` จาก localStorage แล้วแนบ header ทุก request อัตโนมัติ:

```
Authorization: Bearer <accessToken>
```

ไม่ต้องทำอะไรพิเศษ — ทุก API call ที่ผ่าน `apiClient` จะมี header นี้เสมอถ้า user login แล้ว

### 3.3 Login Flow (OTP)

```
1. User กรอก email หรือเบอร์โทร
         ↓
2. POST /api/auth/otp/request
         ↓
3. Backend ส่ง OTP ไปที่ email/SMS → ตอบกลับ maskedDestination
         ↓
4. User กรอก OTP 6 หลัก
         ↓
5. POST /api/auth/otp/verify
         ↓
6. Backend ตรวจสอบ OTP → ตอบกลับ accessToken + refreshToken
         ↓
7. Frontend เก็บ token → เรียก GET /api/me → แสดงชื่อ/โปรไฟล์
```

### 3.4 Login Flow (Social)

```
1. User กด Google / Facebook / LINE
         ↓
2. Frontend ได้ provider token จาก OAuth SDK
         ↓
3. POST /api/auth/social  { provider, token }
         ↓
4. Backend verify กับ provider → ตอบกลับ accessToken + refreshToken
         ↓
5. เหมือนขั้น 7 ข้างบน
```

### 3.5 Guest Mode

Frontend รองรับ guest (ไม่ต้อง login) — user เพิ่มสินค้าลงตะกร้าได้โดยไม่ต้อง login  
Login จะ trigger เมื่อ: กดหัวใจ (wishlist) หรือเข้าหน้า account

---

## 4. API Endpoints ทั้งหมด

Base URL: `NEXT_PUBLIC_API_BASE_URL` (เช่น `https://api.example.com`)

ทุก endpoint ที่ต้อง login → Frontend ส่ง `Authorization: Bearer <token>` ไปให้อัตโนมัติ

---

### 4.1 Auth

#### `POST /api/auth/otp/request`
ขอ OTP — Backend ส่ง SMS หรือ Email

**Request:**
```json
{
  "identifier": "user@email.com"
}
```
`identifier` เป็น email หรือเบอร์โทรก็ได้ Frontend detect เองว่าเป็นประเภทไหน

**Response:**
```json
{
  "sent": true,
  "maskedDestination": "us***@email.com"
}
```

---

#### `POST /api/auth/otp/verify`
ยืนยัน OTP → ได้ token

**Request:**
```json
{
  "identifier": "user@email.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```
ถ้า OTP ผิด → HTTP 400 + error message

---

#### `POST /api/auth/social`
Login ผ่าน Social

**Request:**
```json
{
  "provider": "google",
  "token": "<provider-oauth-token>"
}
```
`provider`: `"google"` | `"facebook"` | `"line"`

**Response:** เหมือน `/api/auth/otp/verify`

---

#### `POST /api/auth/logout`
Invalidate refresh token

**Request:** ไม่ต้องส่ง body (token อยู่ใน header)

**Response:** `200 OK` (empty body)

---

### 4.2 Products

#### `GET /api/products`
ดึงรายการสินค้า รองรับ filter และ pagination

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `category` | string | กรองตาม category |
| `brand` | string | กรองตาม brand |
| `search` | string | ค้นหาจากชื่อสินค้า |
| `sort` | string | `price_asc` \| `price_desc` \| `rating` \| `newest` |
| `page` | number | หน้าที่ต้องการ (เริ่มจาก 1) |
| `limit` | number | จำนวนต่อหน้า |

**Response:**
```json
{
  "products": [ "...Product[]" ],
  "total": 44,
  "page": 1,
  "totalPages": 5
}
```

---

#### `GET /api/products/:id`
ดึงข้อมูลสินค้าชิ้นเดียว

**Response:** `Product` object หรือ `404` ถ้าไม่เจอ

---

#### `GET /api/campaigns/flash-sale/products`
ดึงสินค้า flash sale (แสดงบน homepage)

**Response:** `FlashDealProduct[]`

---

#### `GET /api/campaigns/flash-sale/session`
ดึงเวลาเริ่ม/สิ้นสุด flash sale สำหรับ countdown timer

**Response:**
```json
{
  "startsAt": "2024-06-01T10:00:00.000Z",
  "endsAt": "2024-06-01T22:00:00.000Z",
  "isActive": true
}
```

---

### 4.3 Orders (ต้อง login)

#### `GET /api/orders`
ดึงประวัติออเดอร์ของ user ที่ login อยู่

**Response:** `Order[]`

---

#### `GET /api/orders/:id`
ดึงออเดอร์ตาม ID

**Response:** `Order` object หรือ `404`

---

#### `POST /api/orders/:id/cancel`
ยกเลิกออเดอร์

**Request:** ไม่ต้องส่ง body

**Response:** `200 OK`

> สถานะที่ cancel ได้: `pending_payment`, `processing`

---

#### `POST /api/returns`
ยื่นคำร้องคืนสินค้า

**Request:**
```json
{
  "orderId": "ORD-20240514-001",
  "productIds": ["product-id-1", "product-id-2"],
  "reason": "สินค้าชำรุด"
}
```

**Response:** `200 OK`

---

### 4.4 Reviews (ต้อง login)

#### `POST /api/reviews`
ส่งรีวิวสินค้า

**Request:**
```json
{
  "orderId": "ORD-20240514-001",
  "productId": "product-id-1",
  "rating": 5,
  "comment": "สินค้าดีมาก คุ้มค่า",
  "images": ["https://..."],
  "anonymous": false
}
```

**Response:** `Review` object ที่เพิ่งบันทึก

---

### 4.5 User Profile (ต้อง login)

#### `GET /api/me`
ดึงข้อมูล profile ของ user ที่ login อยู่

**Response:**
```json
{
  "name": "ธนิดา โอวาท",
  "email": "thanida@example.com",
  "phone": "0891234567",
  "avatar": null,
  "gender": "female",
  "birthday": "1995-03-15",
  "points": 3480,
  "pointsHistory": [ "...PointsEntry[]" ]
}
```

---

#### `PATCH /api/me`
แก้ไขข้อมูล profile (ส่งเฉพาะ field ที่เปลี่ยน)

**Request:**
```json
{
  "name": "ธนิดา โอวาท",
  "phone": "0899999999",
  "gender": "female",
  "birthday": "1995-03-15",
  "avatar": "https://..."
}
```

**Response:** `UserProfile` ที่อัปเดตแล้ว

---

#### `GET /api/me/points/history`
ดึงประวัติคะแนนสะสม

**Response:** `PointsEntry[]`

---

### 4.6 Coupons

#### `POST /api/coupons/validate`
ตรวจสอบโค้ดส่วนลด

**Request:**
```json
{
  "code": "KARMART10",
  "subtotal": 2500
}
```

**Response (ถ้า valid):**
```json
{
  "valid": true,
  "discountPercent": 10,
  "discountAmount": 250
}
```

**Response (ถ้าไม่ valid):**
```json
{
  "valid": false,
  "message": "Coupon not found or expired"
}
```

---

### 4.7 Checkout (เตรียมไว้ — ยังไม่ได้ implement service)

endpoint เหล่านี้ Frontend จะเรียกใน phase ถัดไป:

#### `POST /api/orders`
สร้างออเดอร์ใหม่

**Request:**
```json
{
  "addressId": "addr123",
  "shippingId": "kerry",
  "paymentMethod": "promptpay",
  "cartItemIds": ["item-1", "item-2"],
  "couponCode": "KARMART10"
}
```

**Response:**
```json
{
  "orderId": "ORD-20240601-001",
  "paymentUrl": "https://2c2p.com/pay/...",
  "qrData": "00020101...",
  "total": 2250
}
```

`paymentUrl` → redirect ไปหน้า payment gateway (บัตรเครดิต)  
`qrData` → ใช้ generate QR PromptPay

---

## 5. Data Types Reference

### Product

```typescript
interface Product {
  id:                  string;
  name:                string;
  brand:               string;
  price:               number;           // ราคาขายจริง (บาท)
  originalPrice?:      number;           // ราคาก่อนลด → แสดงขีดฆ่า
  image:               string;           // URL รูปหลัก
  href?:               string;           // override URL ถ้าต้องการ
  rank?:               number;           // อันดับ Top Hit
  badge?:              "hot";
  category?:           string;
  rating?:             number;           // 0–5
  reviewCount?:        number;
  freeGifts?:          ProductFreeGift[];
  customBrandColor?:   string;           // hex color สำหรับ brand badge
  unavailableRegions?: string[];         // รหัสประเทศที่ซื้อไม่ได้
}

interface ProductFreeGift {
  productId:     string;
  name:          string;
  image:         string;
  originalPrice: number;
  quantity:      number;
  maxPerUnit?:   number;   // ของแถมสูงสุดต่อ 1 ชิ้นสินค้าหลัก
  minQty?:       number;   // ต้องซื้อสินค้าหลักอย่างน้อยกี่ชิ้น
  brand?:        string;
  isThreshold?:  boolean;  // true = ของแถมเมื่อซื้อครบยอด (ไม่ใช่ต่อชิ้น)
}

interface FlashDealProduct {
  id:            string;
  name:          string;
  brand:         string;
  price:         number;
  originalPrice: number;
  image:         string;
  sold:          number;     // จำนวนที่ขายแล้ว
  total:         number;     // จำนวนทั้งหมด (ใช้ทำ progress bar)
  endsAt:        string;     // ISO datetime
  rating?:       number;
  reviewCount?:  number;
  badge?:        "hot";
}
```

---

### Order & OrderItem

```typescript
type OrderStatus =
  | "pending_payment"   // รอชำระเงิน — มี countdown 15 นาที
  | "processing"        // ชำระแล้ว รอจัดเตรียม
  | "shipped"           // อยู่ระหว่างจัดส่ง
  | "delivered"         // ส่งแล้ว
  | "cancelled";        // ยกเลิก

type ReturnStatus =
  | "return_requested"  // ยื่นคำร้องแล้ว
  | "return_pending"    // รอดำเนินการ
  | "return_completed"; // คืนเงินแล้ว

interface Order {
  id:                  string;    // เช่น "ORD-20240514-001"
  createdAt:           string;    // ISO datetime
  status:              OrderStatus;
  items:               OrderItem[];
  subtotal:            number;
  shippingFee:         number;
  discount:            number;    // ส่วนลดรวม
  discountBreakdown?:  { label: string; amount: number }[];
  total:               number;
  paymentMethod?:      string;    // "promptpay" | "card" | "cod" | "bank"
  paidAt?:             string;    // ISO datetime
  trackingNumber?:     string;
  shippingProvider?:   string;    // "Kerry" | "Flash" | "J&T" | "Best"
  estimatedDelivery?:  string;    // เช่น "15–17 มิ.ย."
  recipientName:       string;
  phone:               string;
  address:             string;    // full address string สำหรับแสดงผล
}

interface OrderItem {
  productId:      string;
  name:           string;
  brand:          string;
  image:          string;
  price:          number;
  originalPrice?: number;
  isFree?:        boolean;   // true = ของแถม (ราคา 0)
  variant:        string;    // เช่น 'MacBook Air 13.6"'
  quantity:       number;
  reviewId?:      string;    // ถ้ามีค่า = รีวิวแล้ว
  returnStatus?:  ReturnStatus;
}
```

---

### User & Points

```typescript
interface UserProfile {
  name:           string;
  email:          string;
  phone:          string;
  avatar:         string | null;    // URL รูปโปรไฟล์
  gender?:        "male" | "female" | "other";
  birthday?:      string;           // ISO date "1995-03-15"
  points:         number;           // คะแนนสะสมปัจจุบัน
  pointsHistory:  PointsEntry[];
}

interface PointsEntry {
  id:    string;
  date:  string;    // ISO datetime
  desc:  string;    // คำอธิบาย เช่น "ซื้อสินค้า ORD-001"
  pts:   number;    // บวก = ได้รับ, ลบ = ใช้ไป
}

type MemberTier = "Silver" | "Gold" | "Platinum" | "Diamond";
```

---

### Auth

```typescript
interface RequestOtpPayload {
  identifier: string;    // email หรือเบอร์โทร
}

interface RequestOtpResponse {
  sent:               boolean;
  maskedDestination?: string;    // เช่น "th***@gmail.com" หรือ "089****567"
}

interface LoginWithOtpPayload {
  identifier: string;
  otp:        string;
}

interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;    // วินาที เช่น 3600
}

interface SocialLoginPayload {
  provider: "google" | "facebook" | "line";
  token:    string;    // token จาก OAuth provider
}
```

---

### Cart & Coupon

```typescript
interface CouponValidatePayload {
  code:     string;    // โค้ดส่วนลด
  subtotal: number;    // ยอดสินค้าก่อนหักส่วนลด (บาท)
}

interface CouponValidateResponse {
  valid:            boolean;
  discountPercent?: number;    // เปอร์เซ็นต์ส่วนลด
  discountAmount?:  number;    // จำนวนเงินที่หัก (บาท)
  message?:         string;    // error message ถ้า valid = false
}
```

---

### Checkout

```typescript
interface SavedAddress {
  id:           string;
  label:        string;      // เช่น "บ้าน", "ที่ทำงาน"
  firstName:    string;
  lastName:     string;
  phone:        string;
  address:      string;      // บ้านเลขที่ ซอย ถนน
  district:     string;      // อำเภอ/เขต
  subDistrict:  string;      // ตำบล/แขวง
  province:     string;
  postalCode:   string;
  isDefault:    boolean;
  country?:     string;      // default "TH"
}

interface PlaceOrderPayload {
  addressId:     string;
  shippingId:    string;         // "kerry" | "flash" | "jnt" | "best"
  paymentMethod: string;         // "card" | "promptpay" | "cod" | "bank"
  cartItemIds:   string[];
  couponCode?:   string;
}

interface PlaceOrderResponse {
  orderId:     string;
  paymentUrl?: string;    // redirect URL สำหรับ card payment
  qrData?:     string;    // PromptPay QR string
  total:       number;
}
```

---

### Notification

```typescript
type NotificationType = "order" | "promo" | "system";

interface Notification {
  id:       string;
  type:     NotificationType;
  title:    string;
  body:     string;
  time:     string;          // ISO datetime
  read:     boolean;
  image?:   string;
  href?:    string;          // URL ที่จะ navigate ไปเมื่อกด
  orderId?: string;          // ถ้า type = "order"
}
```

---

### Review

```typescript
interface Review {
  id:         string;
  orderId:    string;
  productId:  string;
  rating:     number;      // 1–5
  comment:    string;
  user?:      string;      // ชื่อผู้รีวิว (ถ้า anonymous = false)
  avatar?:    string;
  images?:    string[];
  anonymous?: boolean;
  createdAt:  string;      // ISO datetime
}

interface SubmitReviewPayload {
  orderId:    string;
  productId:  string;
  rating:     number;
  comment:    string;
  images?:    string[];
  anonymous?: boolean;
}
```

---

## 6. Shipping & Payment Options

### Shipping

Frontend แสดงตัวเลือกเหล่านี้ — Backend ต้องรองรับ `shippingId` เดียวกัน:

| id | ชื่อ | ETA | ค่าส่งปกติ |
|---|---|---|---|
| `kerry` | Kerry Express | 1–2 วัน | ฿60 |
| `flash` | Flash Express | 1–3 วัน | ฿50 |
| `jnt` | J&T Express | 2–4 วัน | ฿40 |
| `best` | Best Express | 2–5 วัน | ฿35 |

### Payment Methods

| id | คำอธิบาย |
|---|---|
| `promptpay` | QR PromptPay (generate จาก `qrData` ที่ Backend ส่งมา) |
| `card` | บัตรเครดิต/เดบิต ผ่าน 2C2P (redirect ไปที่ `paymentUrl`) |
| `cod` | เก็บเงินปลายทาง |
| `bank` | โอนผ่านธนาคาร |

---

## 7. Business Rules ที่ Frontend ทำอยู่

สิ่งเหล่านี้ทำอยู่บน Frontend แล้ว — Backend ควรรู้ไว้เพื่อไม่ให้ทำซ้ำหรือขัดกัน

### ของแถม (Free Gifts)
- ของแถมแนบอยู่ใน `Product.freeGifts[]`
- เมื่อ user เพิ่มสินค้าลงตะกร้า Frontend คำนวณจำนวนของแถมตาม `maxPerUnit` และ `minQty` อัตโนมัติ
- ถ้า Backend คำนวณของแถมเอง ต้องส่งมาใน `OrderItem` ที่มี `isFree: true`

### Countdown Timer
- ออเดอร์ `pending_payment` มี countdown 15 นาทีจาก `order.createdAt`
- เมื่อหมดเวลา Frontend แสดงว่าหมดอายุ (ยังไม่ auto-cancel — Backend ควร handle)

### Order Status Flow
```
pending_payment → processing → shipped → delivered
                                              ↓
                                     (return_requested → return_pending → return_completed)
pending_payment → cancelled
processing      → cancelled
```

### Points
- Frontend แสดงคะแนนจาก `UserProfile.points` และ `pointsHistory`
- Backend คำนวณและบันทึก points — Frontend แค่แสดงผล
- `pts` ที่เป็นลบ = ใช้คะแนนแลก

### Member Tiers
Frontend แสดง tier badge ตาม: `Silver` → `Gold` → `Platinum` → `Diamond`  
Backend ควรส่ง tier กลับมาใน profile response (field: `tier`)

---

## 8. Mock Data ที่ใช้อยู่

ถ้าไม่ตั้ง `NEXT_PUBLIC_API_BASE_URL` → Frontend ใช้ข้อมูลจาก:

| ไฟล์ | ข้อมูล |
|---|---|
| `src/lib/mock-data.ts` | สินค้า 44+ ชิ้น, flash deals, brands, campaigns |
| `src/stores/orders.store.ts` | ออเดอร์ตัวอย่าง 17 รายการ ทุก status |
| `src/stores/auth.store.ts` | Mock OTP = `1234` |
| `src/services/cart.service.ts` | Coupons: `KARMART10` (10%), `BEAUTY20` (20%), `NEWMEMBER` (15%), `NEWKARMART50` (50%) |

### Mock OTP สำหรับ Demo
```
OTP: 1234
```

---

## Services Layer

แต่ละ service อยู่ใน `src/services/` และมีโครงสร้างเหมือนกัน:

```typescript
const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getOrders(): Promise<Order[]> {
  if (!USE_MOCK) {
    return apiClient.get<Order[]>("/api/orders");   // ← real API
  }
  // mock fallback ...
}
```

เมื่อตั้ง `NEXT_PUBLIC_API_BASE_URL` แล้ว → บรรทัด `apiClient.get(...)` จะทำงาน

---

## Error Handling

Frontend รับ error ผ่าน `ApiError` class:

```typescript
class ApiError extends Error {
  status: number;   // HTTP status code
}
```

- `401` → Frontend ควร handle token expired (ยังไม่ implement auto-refresh — อาจต้องเพิ่ม)
- `400` → แสดง error message จาก response body
- `404` → แสดงหน้า not found
- `500` → แสดง generic error

**Backend ควรส่ง error response ในรูปแบบ:**
```json
{
  "message": "คำอธิบาย error เป็นภาษาไทยหรืออังกฤษ"
}
```

---

## Files สำคัญ

```
src/
├── lib/api-client.ts          ← HTTP wrapper + token injection
├── services/                  ← 1 ไฟล์ต่อ 1 domain (product, order, user, ...)
├── hooks/queries/             ← TanStack Query hooks (useProducts, useOrders, ...)
├── hooks/mutations/           ← TanStack Mutation hooks (useCancelOrder, ...)
├── types/                     ← TypeScript interfaces ทั้งหมด
├── stores/                    ← Zustand stores (client state)
└── lib/mock-data.ts           ← Mock data สำหรับ dev/demo
```

`.env.example` — template ตัวแปรทั้งหมด (copy ไปเป็น `.env.local` แล้วใส่ค่า)
