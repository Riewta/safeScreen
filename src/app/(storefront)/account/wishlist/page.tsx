"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist.store";
import { PRODUCTS, BRANDS } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";
import { useRequireAuth } from "@/hooks/use-require-auth";
import Link from "next/link";

export default function AccountWishlistPage() {
  const isLoggedIn = useRequireAuth();
  const ids        = useWishlistStore((s) => s.ids);
  const products   = PRODUCTS.filter((p) => ids.includes(p.id));

  // Mock favorite brands for now
  const favoriteBrands = BRANDS.slice(0, 5);

  if (!isLoggedIn) return null;

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      {/* Favorite Brands Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-[var(--km-text)]">แบรนด์ที่ถูกใจ</h2>
          {favoriteBrands.length > 0 && (
            <span className="text-xs text-[var(--km-text-muted)]">{favoriteBrands.length} แบรนด์</span>
          )}
        </div>
        
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {favoriteBrands.length > 0 ? (
            favoriteBrands.map((brand) => (
              <Link 
                key={brand.name} 
                href={brand.href}
                className="flex flex-col items-center gap-2 group flex-shrink-0"
              >
                <div className="w-20 h-20 rounded-2xl bg-[var(--km-surface)] border border-[var(--km-border)] flex items-center justify-center overflow-hidden group-active:scale-95 transition-transform">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-[var(--km-text-muted)]/30">{brand.name[0]}</span>
                  )}
                </div>
                <span className="text-[13px] text-[var(--km-text-secondary)] text-center max-w-[80px] truncate">{brand.name}</span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-[var(--km-text-muted)] py-4">ยังไม่มีแบรนด์ที่ถูกใจ</p>
          )}
        </div>
      </section>

      {/* Favorite Products Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-[var(--km-text)]">สินค้าที่ถูกใจ</h2>
          {products.length > 0 && (
            <span className="text-xs text-[var(--km-text-muted)]">{products.length} รายการ</span>
          )}
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center gap-4">
            <Heart size={48} strokeWidth={1} className="text-[var(--km-text-muted)]" />
            <div>
              <h2 className="text-[15px] font-medium text-[var(--km-text)]">ยังไม่มีสินค้าที่ถูกใจ</h2>
              <p className="text-[13px] text-[var(--km-text-muted)] mt-1 max-w-[240px] leading-relaxed">
                กดไอคอนหัวใจที่สินค้าเพื่อบันทึกรายการโปรดของคุณไว้ที่นี่
              </p>
            </div>
            <Link
              href="/products"
              className="mt-2 px-6 py-2.5 rounded-full border border-[var(--km-border)] text-[13px] text-[var(--km-text-secondary)] hover:border-[var(--km-border-strong)] hover:text-[var(--km-text)] transition-all"
            >
              เริ่มช้อปสินค้า
            </Link>
          </div>
        )}

        {/* Product grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} rank={undefined} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
