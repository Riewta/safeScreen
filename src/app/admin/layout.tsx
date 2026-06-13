"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/products",  label: "Products" },
  { href: "/admin/campaigns", label: "Campaigns" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">SafeScreen Admin</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">CMS</span>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Back to Store</Link>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex gap-1">
          {TABS.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main>{children}</main>
    </div>
  );
}
