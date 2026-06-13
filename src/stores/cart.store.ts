import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

export interface FreeGift {
  productId: string;
  name: string;
  image: string;
  originalPrice: number;
  quantity: number;    // total selected quantity
  maxPerUnit: number;  // max gift units per 1 main product unit
  minQty: number;      // min main product qty required to unlock
  brand?: string;
  isThreshold?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  variant: string;
  quantity: number;
  freeGifts?: FreeGift[];
}

interface CartStore {
  items: CartItem[];
  selectedIds: string[];
  buyNowItem: CartItem | null;

  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  updateGiftQty: (itemId: string, giftProductId: string, newQty: number) => void;
  clearCart: () => void;
  setBuyNowItem: (item: Omit<CartItem, "id">) => void;
  clearBuyNow: () => void;

  toggleSelect: (id: string) => void;
  selectAll: () => void;
  selectNone: () => void;

  coupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const MOCK_COUPONS: Record<string, number> = {
  "KARMART10":    10,
  "BEAUTY20":     20,
  "NEWMEMBER":    15,
  "NEWKARMART50": 50,
};

// Merge incoming freeGifts list into existing, scaling quantities dynamically
function mergeFreeGifts(
  existing: FreeGift[] | undefined,
  incoming: FreeGift[] | undefined,
  newQty: number,
): FreeGift[] | undefined {
  if (!incoming || incoming.length === 0) return existing;
  return incoming.map((g) => {
    if (g.isThreshold) {
      return { ...g, quantity: g.quantity };
    }
    const cap = newQty < g.minQty ? 0 : (newQty * g.maxPerUnit);
    return { ...g, quantity: cap };
  });
}

// Reduce/scale gift quantities when main product qty changes
export function smartClampGifts(gifts: FreeGift[], newQty: number): FreeGift[] {
  return gifts.map((g) => {
    if (g.isThreshold) {
      return { ...g, quantity: g.quantity };
    }
    return {
      ...g,
      quantity: newQty < g.minQty ? 0 : (newQty * g.maxPerUnit),
    };
  });
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      buyNowItem: null,
      items: [
        {
          id: "item-1",
          productId: "2",
          name: 'NanoSnap Privacy Screen — MacBook Air 13.6" (M2/M3/M4)',
          brand: "SafeScreen",
          image: "/products/privacy-macbook/privacy-macbook-air-13-6.jpg",
          price: 1390,
          originalPrice: 1690,
          variant: "MacBook Air 13.6\"",
          quantity: 1,
        },
        {
          id: "item-2",
          productId: "5",
          name: 'NanoSnap Privacy Screen — MacBook Pro 14" (M2/M3/M4/M5)',
          brand: "SafeScreen",
          image: "/products/privacy-macbook/privacy-macbook-pro-14.jpg",
          price: 1490,
          originalPrice: 1890,
          variant: "MacBook Pro 14\"",
          quantity: 1,
        }
      ],
      selectedIds: ["item-1", "item-2"],
      coupon:          null,
      couponDiscount:  0,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.variant === item.variant
        );
        if (existing) {
          const newQty = existing.quantity + item.quantity;
          set((s) => ({
            items: s.items.map((i) =>
              i.id !== existing.id ? i : {
                ...i,
                quantity:   newQty,
                freeGifts:  mergeFreeGifts(i.freeGifts, item.freeGifts, newQty),
              }
            ),
          }));
        } else {
          const newId = `${item.productId}-${item.variant}-${Date.now()}`;
          set((s) => ({
            items:       [...s.items, { ...item, id: newId }],
            selectedIds: [...s.selectedIds, newId],
          }));
        }
      },

      removeItem: (id) =>
        set((s) => ({
          items:       s.items.filter((i) => i.id !== id),
          selectedIds: s.selectedIds.filter((sid) => sid !== id),
        })),

      updateQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.id !== id)
            : s.items.map((i) =>
                i.id !== id ? i : {
                  ...i,
                  quantity:  qty,
                  freeGifts: i.freeGifts ? smartClampGifts(i.freeGifts, qty) : undefined,
                }
              ),
          selectedIds: qty <= 0 ? s.selectedIds.filter((sid) => sid !== id) : s.selectedIds,
        })),

      updateGiftQty: (itemId, giftProductId, newQty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id !== itemId ? i : {
              ...i,
              freeGifts: i.freeGifts?.map((g) =>
                g.productId !== giftProductId ? g : { ...g, quantity: Math.max(0, newQty) }
              ),
            }
          ),
        })),

      clearCart: () => set({ items: [], selectedIds: [], coupon: null, couponDiscount: 0 }),

      setBuyNowItem: (item) => {
        const id = `buynow-${item.productId}-${item.variant}-${Date.now()}`;
        set({ buyNowItem: { ...item, id } });
      },
      clearBuyNow: () => set({ buyNowItem: null }),

      toggleSelect: (id) =>
        set((s) => ({
          selectedIds: s.selectedIds.includes(id)
            ? s.selectedIds.filter((sid) => sid !== id)
            : [...s.selectedIds, id],
        })),

      selectAll:  () => set((s) => ({ selectedIds: s.items.map((i) => i.id) })),
      selectNone: () => set({ selectedIds: [] }),

      applyCoupon: (code) => {
        const pct = MOCK_COUPONS[code.toUpperCase()];
        if (pct) {
          set({ coupon: code.toUpperCase(), couponDiscount: pct });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ coupon: null, couponDiscount: 0 }),
    }),
    {
      name: "karmart-cart",
      version: 3,
      migrate: () => undefined,
      partialize: (s) => ({
        items:          s.items,
        selectedIds:    s.selectedIds,
        coupon:         s.coupon,
        couponDiscount: s.couponDiscount,
      }),
    }
  )
);

export const useCartSubtotal = () =>
  useCartStore((s) =>
    s.items
      .filter((i) => s.selectedIds.includes(i.id))
      .reduce((n, i) => n + i.price * i.quantity, 0)
  );

export const useSelectedItems = () =>
  useCartStore(useShallow((s) => s.items.filter((i) => s.selectedIds.includes(i.id))));
