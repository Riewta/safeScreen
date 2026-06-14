"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/products",  label: "Products"  },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/orders",    label: "Orders"    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "var(--km-font)" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="SafeScreen" width={110} height={28} className="h-6 w-auto" />
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Admin</span>
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
