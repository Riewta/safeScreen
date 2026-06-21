import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedAddress {
  id:         string;
  label:      string;
  firstName:  string;
  lastName:   string;
  phone:      string;
  address:    string;
  district:    string;
  subDistrict: string;
  province:    string;
  postalCode: string;
  isDefault:  boolean;
  country?:   string;
}

export const SHIPPING_OPTIONS = [
  { id: "kerry", name: "Kerry Express", eta: "1–2 วัน", fee: 60,  promoFee: 0  },
  { id: "flash", name: "Flash Express", eta: "1–3 วัน", fee: 50,  promoFee: 50 },
  { id: "jnt",   name: "J&T Express",   eta: "2–4 วัน", fee: 40,  promoFee: 40 },
  { id: "best",  name: "Best Express",  eta: "2–5 วัน", fee: 35,  promoFee: 35 },
] as const;

export type ShippingId = (typeof SHIPPING_OPTIONS)[number]["id"];

interface CheckoutStore {
  addresses:         SavedAddress[];
  selectedAddressId: string | null;
  shippingId:        ShippingId;
  paymentMethod:     "card" | "promptpay" | "cod" | "bank" | string;
  savedCards:        { id: string; last4: string; brand: string; name?: string }[];
  savedBanks:        { id: string; bankId: string; accountNo: string; name: string }[];
  guestContact:      { email: string; phone: string };

  selectAddress:     (id: string) => void;
  addAddress:        (a: Omit<SavedAddress, "id">) => string;
  updateAddress:     (id: string, data: Partial<Omit<SavedAddress, "id">>) => void;
  deleteAddress:     (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setShippingId:     (id: ShippingId) => void;
  setPaymentMethod:  (m: "card" | "promptpay" | "cod" | "bank" | string) => void;
  addSavedCard:      (data: { last4: string; brand: string; name?: string }) => void;
  addSavedBank:      (data: { bankId: string; accountNo: string; name: string }) => void;
  setGuestContact:   (data: Partial<{ email: string; phone: string }>) => void;
  reset:             () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      addresses:         [],
      selectedAddressId: null,
      shippingId:        "kerry",
      paymentMethod:     "promptpay",
      savedCards:        [],
      savedBanks:        [],
      guestContact:      { email: "", phone: "" },

      selectAddress: (id) => set({ selectedAddressId: id }),

      addAddress: (a) => {
        const id = `addr${Date.now()}`;
        const isFirst = get().addresses.length === 0;
        set((s) => ({ addresses: [...s.addresses, { ...a, id, isDefault: isFirst }] }));
        return id;
      },

      updateAddress: (id, a) =>
        set((s) => ({
          addresses: s.addresses.map((addr) =>
            addr.id === id
              ? { ...addr, ...a }
              : a.isDefault ? { ...addr, isDefault: false } : addr
          ),
        })),

      deleteAddress: (id) =>
        set((s) => {
          const remaining = s.addresses.filter((a) => a.id !== id);
          // If deleted was default, promote first
          const wasDefault = s.addresses.find((a) => a.id === id)?.isDefault;
          if (wasDefault && remaining.length > 0) remaining[0] = { ...remaining[0], isDefault: true };
          return {
            addresses: remaining,
            selectedAddressId: s.selectedAddressId === id ? (remaining[0]?.id ?? "") : s.selectedAddressId,
          };
        }),

      setDefaultAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      setShippingId:    (id) => set({ shippingId: id }),
      setPaymentMethod: (m)  => set({ paymentMethod: m }),
      addSavedCard:     (c)  => set((s) => ({ savedCards: [...s.savedCards, { ...c, id: `c_${Date.now()}` }].slice(-3) })),
      addSavedBank:     (b)  => set((s) => ({ savedBanks: [...s.savedBanks, { ...b, id: `b_${Date.now()}` }].slice(-3) })),
      setGuestContact:  (c)  => set((s) => ({ guestContact: { ...s.guestContact, ...c } })),

      reset: () =>
        set({
          addresses: [],
          selectedAddressId: null,
          shippingId: "kerry",
          paymentMethod: "promptpay",
          savedCards: [],
          savedBanks: [],
          guestContact: { email: "", phone: "" },
        }),
    }),
    {
      name: "safescreen-checkout",
      partialize: (s) => ({
        addresses:         s.addresses,
        selectedAddressId: s.selectedAddressId,
        savedCards:        s.savedCards,
        savedBanks:        s.savedBanks,
        guestContact:      s.guestContact,
      }),
    }
  )
);

export const useSelectedAddress = () =>
  useCheckoutStore((s) => s.addresses.find((a) => a.id === s.selectedAddressId) ?? s.addresses[0]);
