import { create } from "zustand";
import type React from "react";

interface UIStore {
  categoryMenuOpen: boolean;
  searchOpen: boolean;
  headerHidden: boolean;
  headerHeight: number;
  forceHeaderVisible: boolean;
  headerLocked: boolean;
  headerTitleOverride: string | null;
  headerBackOverride: (() => void) | null;
  headerRightOverride: React.ReactNode | null;
  headerCenterTitle: boolean;
  headerHideBack: boolean;
  bottomAnnouncementVisible: boolean;
  openCategoryMenu: () => void;
  closeCategoryMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setHeaderHidden: (v: boolean) => void;
  setHeaderHeight: (v: number) => void;
  setForceHeaderVisible: (v: boolean) => void;
  setHeaderLocked: (v: boolean) => void;
  setHeaderTitleOverride: (v: string | null) => void;
  setHeaderBackOverride: (v: (() => void) | null) => void;
  setHeaderRightOverride: (v: React.ReactNode | null) => void;
  setHeaderCenterTitle: (v: boolean) => void;
  setBottomAnnouncementVisible: (v: boolean) => void;
  regionModalOpen: boolean;
  regionModalFocusedDropdown: "region" | "lang" | "currency" | null;
  openRegionModal: (focusDropdown?: "region" | "lang" | "currency" | null) => void;
  closeRegionModal: () => void;
  cartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  notifDrawerOpen: boolean;
  openNotifDrawer: () => void;
  closeNotifDrawer: () => void;
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  categoryMenuOpen: false,
  searchOpen: false,
  headerHidden: false,
  headerHeight: 56,
  forceHeaderVisible: false,
  headerLocked: false,
  headerTitleOverride: null,
  headerBackOverride: null,
  headerRightOverride: null,
  headerCenterTitle: false,
  headerHideBack: false,
  bottomAnnouncementVisible: false,
  regionModalOpen: false,
  regionModalFocusedDropdown: null,
  openCategoryMenu:       () => set({ categoryMenuOpen: true }),
  closeCategoryMenu:      () => set({ categoryMenuOpen: false }),
  openSearch:             () => set({ searchOpen: true }),
  closeSearch:            () => set({ searchOpen: false }),
  setHeaderHidden:        (v) => set({ headerHidden: v }),
  setHeaderHeight:        (v) => set({ headerHeight: v }),
  setForceHeaderVisible:  (v) => set({ forceHeaderVisible: v }),
  setHeaderLocked:        (v) => set({ headerLocked: v }),
  setHeaderTitleOverride: (v) => set({ headerTitleOverride: v }),
  setHeaderBackOverride:  (v) => set({ headerBackOverride: v }),
  setHeaderRightOverride: (v) => set({ headerRightOverride: v }),
  setHeaderCenterTitle:   (v) => set({ headerCenterTitle: v }),
  setBottomAnnouncementVisible: (v) => set({ bottomAnnouncementVisible: v }),
  openRegionModal:        (focusDropdown = null) => set({ regionModalOpen: true, regionModalFocusedDropdown: focusDropdown }),
  closeRegionModal:       () => set({ regionModalOpen: false, regionModalFocusedDropdown: null }),
  cartDrawerOpen: false,
  openCartDrawer:  () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  notifDrawerOpen: false,
  openNotifDrawer:  () => set({ notifDrawerOpen: true }),
  closeNotifDrawer: () => set({ notifDrawerOpen: false }),
  mobileNavOpen: false,
  openMobileNav:  () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
}));
