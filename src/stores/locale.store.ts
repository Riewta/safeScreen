import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  locale: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const COUNTRIES: Country[] = [
  { code: "TH", name: "ไทย",     flag: "https://flagcdn.com/th.svg", currency: "THB", locale: "th-TH" },
  { code: "EN", name: "English", flag: "https://flagcdn.com/gb.svg", currency: "USD", locale: "en-US" },
];

export interface Region {
  code: string;
  name: string;
  nameTH: string;
}

export const REGIONS: Region[] = [
  { code: "TH", name: "Thailand",     nameTH: "ไทย" },
  { code: "SG", name: "Singapore",    nameTH: "สิงคโปร์" },
  { code: "MY", name: "Malaysia",     nameTH: "มาเลเซีย" },
  { code: "VN", name: "Vietnam",      nameTH: "เวียดนาม" },
  { code: "ID", name: "Indonesia",    nameTH: "อินโดนีเซีย" },
  { code: "PH", name: "Philippines",  nameTH: "ฟิลิปปินส์" },
  { code: "CN", name: "China",        nameTH: "จีน" },
  { code: "US", name: "United States",nameTH: "สหรัฐอเมริกา" },
  { code: "GB", name: "United Kingdom",nameTH: "สหราชอาณาจักร" },
  { code: "JP", name: "Japan",        nameTH: "ญี่ปุ่น" },
  { code: "KR", name: "South Korea",  nameTH: "เกาหลีใต้" },
];

export const CURRENCIES: Currency[] = [
  { code: "THB", name: "บาทไทย",         symbol: "฿" },
  { code: "USD", name: "US Dollar",       symbol: "$" },
  { code: "CNY", name: "人民币",           symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar",symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit",symbol: "RM" },
  { code: "JPY", name: "Japanese Yen",    symbol: "¥" },
];

interface LocaleStore {
  country: Country;
  currency: Currency;
  region: Region;
  setCountry: (c: Country) => void;
  setCurrency: (c: Currency) => void;
  setRegion: (r: Region) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      country: COUNTRIES[0],
      currency: CURRENCIES[0],
      region: REGIONS[0],
      setCountry: (c) => set({ country: c }),
      setCurrency: (c) => set({ currency: c }),
      setRegion: (r) => set({ region: r }),
    }),
    {
      name: "safescreen-locale",
      version: 2,
      migrate: (persistedState: unknown) => {
        const s = persistedState as Partial<LocaleStore>;
        // Drop stale CN country (removed from COUNTRIES list)
        if (s.country?.code === "CN") {
          return { ...s, country: COUNTRIES[0] };
        }
        return s;
      },
    }
  )
);
