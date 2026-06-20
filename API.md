# SafeScreen Tech — API Contract

> **สำหรับ Backend Developer**
> Frontend ใช้ mock data เมื่อ `NEXT_PUBLIC_API_BASE_URL` ว่าง — set ค่านี้เพื่อเชื่อม real API

---

## Base URL

```
NEXT_PUBLIC_API_BASE_URL=https://api.safescreentech.com
```

## Authentication

ทุก endpoint ที่ต้องการ auth ให้ส่ง:
```
Authorization: Bearer <token>
```

token ได้มาจาก `/api/auth/login` หรือ `/api/auth/otp/verify`

---

## Client Auth — `/api/auth/*`

### POST /api/auth/login
เข้าสู่ระบบด้วย email/phone + password
```json
// Request
{ "email": "user@example.com", "password": "secret" }
// หรือ
{ "phone": "0891234567", "password": "secret" }

// Response 200
{
  "token": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "u1",
    "name": "ธนิดา โอวาท",
    "email": "user@example.com",
    "phone": "0891234567",
    "avatar": null,
    "tier": "Gold",
    "points": 3480
  }
}
```

### POST /api/auth/register
```json
// Request
{ "email": "user@example.com", "name": "ธนิดา", "password": "secret" }

// Response 200
{ "success": true }
```

### POST /api/auth/otp/request
ส่ง OTP ไปที่ email หรือเบอร์โทร
```json
// Request
{ "identifier": "user@example.com" }

// Response 200
{ "success": true, "maskedDestination": "us***@example.com" }
```

### POST /api/auth/otp/verify
ยืนยัน OTP และรับ token
```json
// Request
{ "identifier": "user@example.com", "otp": "1234" }

// Response 200
{
  "token": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { ...User }
}
```

### POST /api/auth/google
Login ด้วย Google OAuth token
```json
// Request
{ "token": "<google-id-token>" }

// Response 200
{ "token": "eyJ...", "user": { ...User } }
```

### POST /api/auth/logout
```
// Response 200 — no body
```

---

## Admin Auth — `/api/admin/auth/*`

### POST /api/admin/auth/login
```json
// Request
{ "email": "admin@safescreentech.com", "password": "..." }

// Response 200
{
  "token": "eyJ...",
  "admin": {
    "id": "a1",
    "email": "admin@safescreentech.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

### GET /api/admin/profile
```json
// Response 200
{ "id": "a1", "email": "...", "name": "Admin", "role": "admin" }
```

---

## User — `/api/me`

### GET /api/me
ดึงข้อมูล profile ของ user ที่ login อยู่
```json
// Response 200
{
  "id": "u1", "name": "ธนิดา", "email": "...", "phone": "...",
  "avatar": null, "tier": "Gold", "points": 3480
}
```

### PATCH /api/me
อัปเดต profile
```json
// Request (all fields optional)
{ "name": "ชื่อใหม่", "phone": "0891234567", "birthday": "1995-06-15" }

// Response 200 — updated User
```

### GET /api/me/points/history
```json
// Response 200
[
  { "id": "p1", "date": "2026-01-10", "description": "ซื้อสินค้า", "points": 120, "type": "earn" },
  ...
]
```

---

## Products — `/api/products`

### GET /api/products
```
Query params:
  type     = "privacy" | "nano" | "anti-blue" | "paper"
  brand    = string
  search   = string
  page     = number (default 1)
  limit    = number (default 20)
```
```json
// Response 200
{
  "products": [ ...Product[] ],
  "total": 120,
  "page": 1,
  "totalPages": 6
}
```

### GET /api/products/:id
```json
// Response 200 — Product
{
  "id": "p1", "name": "Privacy Film MacBook Pro 14"", "brand": "SafeScreen",
  "price": 1290, "originalPrice": 1590, "images": ["..."], "category": "privacy",
  "stock": 50, "rating": 4.8, "reviewCount": 234
}
```

### GET /api/products/:id/related
```json
// Response 200 — Product[]
```

---

## Orders — `/api/orders`

### GET /api/orders
ดึง order ทั้งหมดของ user
```json
// Response 200 — Order[]
```

### POST /api/orders
สร้าง order ใหม่จาก cart
```json
// Request
{
  "items": [ { "productId": "p1", "variant": "MacBook Pro 14\"", "quantity": 1, "price": 1290 } ],
  "subtotal": 1290, "shippingFee": 0, "discount": 0, "total": 1290,
  "couponCode": "KARMART10",
  "addressId": "addr1",
  "paymentMethod": "credit_card"
}

// Response 201 — Order
```

### GET /api/orders/:id
```json
// Response 200 — Order (with full detail)
```

### POST /api/orders/:id/cancel
```json
// Response 200
{ "success": true }
```

---

## Coupons — `/api/coupons`

### POST /api/coupons/validate
```json
// Request
{ "code": "KARMART10", "subtotal": 1290 }

// Response 200
{ "valid": true, "discountPercent": 10, "discountAmount": 129 }

// Response 200 (invalid)
{ "valid": false, "message": "Coupon not found or expired" }
```

---

## Addresses — `/api/addresses`

### GET /api/addresses
```json
// Response 200 — Address[]
```

### POST /api/addresses
```json
// Request — Address (without id)
// Response 201 — Address (with id)
```

### PUT /api/addresses/:id
```json
// Request — Address fields to update
// Response 200 — updated Address
```

### DELETE /api/addresses/:id
```
// Response 204 — no body
```

---

## TypeScript Types

ดู `src/types/api.types.ts` — types ทั้งหมดสอดคล้องกับ request/response ข้างบน

## Service Files

| Service | File |
|---|---|
| Client Auth | `src/services/auth.service.ts` |
| Admin Auth | `src/services/admin.service.ts` |
| Products | `src/services/product.service.ts` |
| Orders | `src/services/order.service.ts` |
| Cart/Coupon | `src/services/cart.service.ts` |
| User Profile | `src/services/user.service.ts` |

## วิธีเปิดใช้ Real API

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.safescreentech.com
```

ไม่ต้องแก้โค้ด frontend เพิ่ม — `USE_MOCK` flag ในทุก service จะ switch อัตโนมัติ
