import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TaxInvoiceData {
  id:           string;
  type:         "individual" | "corporate";
  firstName:    string;
  lastName:     string;
  companyName:  string;
  isHeadOffice: boolean;
  email:        string;
  phone:        string;
  taxId:        string;
  address:      string;
  postalCode:   string;
  isDefault:    boolean;
}

interface TaxInvoiceStore {
  profiles: TaxInvoiceData[];
  selectedId: string | null;
  addProfile: (data: Omit<TaxInvoiceData, "id">) => void;
  updateProfile: (id: string, data: Omit<TaxInvoiceData, "id">) => void;
  selectProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  clear: () => void;
}

export const useTaxInvoiceStore = create<TaxInvoiceStore>()(
  persist(
    (set) => ({
      profiles: [],
      selectedId: null,

      addProfile: (data) => set((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newProfile = { ...data, id };
        
        // If it's the first profile or set as default, update others
        let updatedProfiles = [...state.profiles];
        if (data.isDefault) {
          updatedProfiles = updatedProfiles.map(p => ({ ...p, isDefault: false }));
        }
        updatedProfiles.push(newProfile);
        
        return { 
          profiles: updatedProfiles,
          selectedId: id // Select the newly added one
        };
      }),

      updateProfile: (id, data) => set((state) => {
        let updated = state.profiles.map(p => p.id === id ? { ...data, id } : p);
        if (data.isDefault) {
          updated = updated.map(p => p.id === id ? p : { ...p, isDefault: false });
        }
        return { profiles: updated };
      }),

      selectProfile: (id) => set({ selectedId: id }),

      deleteProfile: (id) => set((state) => ({
        profiles: state.profiles.filter(p => p.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId
      })),

      clear: () => set({ profiles: [], selectedId: null }),
    }),
    { name: "karmart-tax-invoice-v2" }
  )
);
