"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, ChevronUp, ChevronDown, X, Check, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
}

const STORAGE_KEY = "safescreen-products";

const SEED_PRODUCTS: Product[] = [
  { id: "1",  name: "NanoSnap Privacy Screen — MacBook Air 13.3\" (M1/Retina)",      brand: "SafeScreen", category: "magnetic-privacy", price: 1290, originalPrice: 1590, image: "/products/nano-macbook/nano-macbook-air-13-3.jpg",  rating: 4.9, reviewCount: 1842 },
  { id: "2",  name: "NanoSnap Privacy Screen — MacBook Air 13.6\" (M2/M3/M4)",       brand: "SafeScreen", category: "magnetic-privacy", price: 1390, originalPrice: 1690, image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",  rating: 4.9, reviewCount: 2103 },
  { id: "3",  name: "NanoSnap Privacy Screen — MacBook Air 15\" (M2/M3/M4/M5)",      brand: "SafeScreen", category: "magnetic-privacy", price: 1490, originalPrice: 1790, image: "/products/nano-macbook/nano-macbook-air-15.jpg",    rating: 4.8, reviewCount: 876  },
  { id: "4",  name: "NanoSnap Privacy Screen — MacBook Pro 13.3\" (2019–2022)",      brand: "SafeScreen", category: "magnetic-privacy", price: 1290, originalPrice: 1590, image: "/products/nano-macbook/nano-macbook-pro-13-3.jpg", rating: 4.8, reviewCount: 654  },
  { id: "5",  name: "NanoSnap Privacy Screen — MacBook Pro 14\" (M2/M3/M4/M5)",      brand: "SafeScreen", category: "magnetic-privacy", price: 1490, originalPrice: 1890, image: "/products/nano-macbook/nano-macbook-pro-14.jpg",   rating: 4.9, reviewCount: 987  },
  { id: "6",  name: "NanoSnap Privacy Screen — MacBook Pro 16\" (M2/M3/M4/M5)",      brand: "SafeScreen", category: "magnetic-privacy", price: 1590, originalPrice: 1990, image: "/products/nano-macbook/nano-macbook-pro-16.jpg",   rating: 4.8, reviewCount: 521  },
  { id: "7",  name: "NanoSnap Privacy Screen — Universal 13.3\" (16:9)",              brand: "SafeScreen", category: "magnetic-privacy", price: 990,  originalPrice: 1290, image: "/products/nano-universal/nano-universal-13-3.jpg", rating: 4.7, reviewCount: 3201 },
  { id: "8",  name: "NanoSnap Privacy Screen — Universal 14\" (16:9)",                brand: "SafeScreen", category: "magnetic-privacy", price: 1090, originalPrice: 1390, image: "/products/nano-universal/nano-universal-14.jpg",   rating: 4.7, reviewCount: 1543 },
  { id: "9",  name: "NanoSnap Privacy Screen — Universal 15.6\" (16:9)",              brand: "SafeScreen", category: "magnetic-privacy", price: 1090, originalPrice: 1390, image: "/products/nano-universal/nano-universal-15-6.jpg", rating: 4.7, reviewCount: 2109 },
  { id: "10", name: "NanoSnap Privacy Screen — Universal 16\" (16:10)",               brand: "SafeScreen", category: "magnetic-privacy", price: 1190, originalPrice: 1490, image: "/products/nano-universal/nano-universal-16.jpg",   rating: 4.8, reviewCount: 598  },
];

const CATEGORY_OPTIONS = [
  { value: "magnetic-privacy", label: "Magnetic Privacy" },
  { value: "anti-blue",        label: "Anti-Blue Light" },
  { value: "nano",             label: "Nano Privacy" },
  { value: "surface",          label: "Surface" },
  { value: "monitor",          label: "Monitor" },
  { value: "ipad",             label: "iPad" },
];

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((c) => [c.value, c.label])
);

const EMPTY_FORM: Omit<Product, "id" | "rating" | "reviewCount"> = {
  name: "",
  brand: "SafeScreen",
  category: "magnetic-privacy",
  price: 0,
  originalPrice: undefined,
  image: "/products/nano-macbook/nano-macbook-air-13-6.jpg",
};

type SortKey = keyof Pick<Product, "name" | "brand" | "category" | "price" | "originalPrice">;
type SortDir = "asc" | "desc";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded]     = useState(false);
  const [search, setSearch]     = useState("");
  const [sortKey, setSortKey]   = useState<SortKey>("id" as SortKey);
  const [sortDir, setSortDir]   = useState<SortDir>("asc");

  // Modal state
  const [modalOpen, setModalOpen]   = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState<Omit<Product, "id" | "rating" | "reviewCount">>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  /* ─── Load from localStorage ─── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        } else {
          setProducts(SEED_PRODUCTS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
        }
      } else {
        setProducts(SEED_PRODUCTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
      }
    } catch {
      setProducts(SEED_PRODUCTS);
    }
    setLoaded(true);
  }, []);

  /* ─── Persist to localStorage ─── */
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, loaded]);

  /* ─── Toast auto-dismiss ─── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  /* ─── Sort + Filter ─── */
  const displayed = useMemo(() => {
    let list = [...products];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortKey] ?? "";
      const bVal = (b as unknown as Record<string, unknown>)[sortKey] ?? "";
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [products, search, sortKey, sortDir]);

  /* ─── Helpers ─── */
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? <ChevronUp size={14} className="inline ml-0.5 text-blue-600" /> : <ChevronDown size={14} className="inline ml-0.5 text-blue-600" />
    ) : (
      <ChevronDown size={14} className="inline ml-0.5 text-gray-300" />
    );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<string, string>> = {};
    if (!form.name.trim()) errors.name = "กรุณาใส่ชื่อสินค้า";
    if (!form.brand.trim()) errors.brand = "กรุณาใส่แบรนด์";
    if (!form.price || form.price <= 0) errors.price = "กรุณาใส่ราคาที่ถูกต้อง";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...form,
                originalPrice: form.originalPrice || undefined,
              }
            : p
        )
      );
      setToast({ msg: "แก้ไขสินค้าสำเร็จ", type: "success" });
    } else {
      const newId = String(Date.now());
      setProducts((prev) => [
        ...prev,
        {
          id: newId,
          ...form,
          originalPrice: form.originalPrice || undefined,
          rating: 0,
          reviewCount: 0,
        },
      ]);
      setToast({ msg: "เพิ่มสินค้าสำเร็จ", type: "success" });
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
    setToast({ msg: "ลบสินค้าแล้ว", type: "success" });
  };

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">{products.length} รายการทั้งหมด</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} />
          เพิ่มสินค้า
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อ, แบรนด์, หมวดหมู่..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">#</th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none"
                  onClick={() => handleSort("name")}
                >
                  ชื่อสินค้า <SortIcon col="name" />
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                  onClick={() => handleSort("brand")}
                >
                  แบรนด์ <SortIcon col="brand" />
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                  onClick={() => handleSort("category")}
                >
                  หมวดหมู่ <SortIcon col="category" />
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                  onClick={() => handleSort("price")}
                >
                  ราคา <SortIcon col="price" />
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                  onClick={() => handleSort("originalPrice")}
                >
                  ราคาเต็ม <SortIcon col="originalPrice" />
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    {search ? `ไม่พบสินค้าที่ค้นหา "${search}"` : "ยังไม่มีสินค้า"}
                  </td>
                </tr>
              ) : (
                displayed.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800 leading-snug">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.brand}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {CATEGORY_LABELS[p.category] ?? p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800 whitespace-nowrap">
                      ฿{p.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs whitespace-nowrap">
                      {p.originalPrice ? `฿${p.originalPrice.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="แก้ไข"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="ลบ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        แสดง {displayed.length} จาก {products.length} รายการ · บันทึกใน localStorage อัตโนมัติ
      </p>

      {/* ─── Add / Edit Modal ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  ชื่อสินค้า <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder='เช่น Magnetic Privacy Film — MacBook Air 13.3"'
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.name ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-gray-200"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  แบรนด์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="SafeScreen"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.brand ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-gray-200"
                  }`}
                />
                {formErrors.brand && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.brand}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  หมวดหมู่
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price + Original Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    ราคาขาย (฿) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price || ""}
                    onChange={(e) => updateField("price", Number(e.target.value))}
                    placeholder="1190"
                    min={0}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
                      formErrors.price ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-gray-200"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    ราคาเต็ม (฿) <span className="text-gray-400 font-normal normal-case">(ไม่บังคับ)</span>
                  </label>
                  <input
                    type="number"
                    value={form.originalPrice ?? ""}
                    onChange={(e) =>
                      updateField("originalPrice", e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="1490"
                    min={0}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              {/* Image path */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Image Path
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="/product/image.png"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 font-mono"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                <Check size={14} />
                {editingId ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">ลบสินค้า?</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {products.find((p) => p.id === deleteId)?.name ?? "สินค้านี้"} จะถูกลบออกถาวร
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                ลบออก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast ─── */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-[fadeIn_0.2s_ease] ${
            toast.type === "success"
              ? "bg-gray-900 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? <Check size={14} /> : <X size={14} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
