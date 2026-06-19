"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuthStore } from "@/stores/adminAuth.store";

const TABS = [
  { href: "/admin/products",  label: "Products"  },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/orders",    label: "Orders"    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname      = usePathname();
  const router        = useRouter();
  const isLoggedIn    = useAdminAuthStore((s) => s.isAdminLoggedIn);
  const logout        = useAdminAuthStore((s) => s.logout);

  const isLoginPage = pathname === "/admin/login";

  // Guard: redirect to admin login if not authenticated
  useEffect(() => {
    if (!isLoginPage && !isLoggedIn) {
      router.replace("/admin/login");
    }
  }, [isLoggedIn, isLoginPage, router]);

  // Login page — render with no chrome
  if (isLoginPage) return <>{children}</>;

  // Not authenticated yet (before redirect fires)
  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[var(--km-surface)]" style={{ fontFamily: "var(--km-font)" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-[var(--km-border)] px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Image src="/logo.svg" alt="SafeScreen" width={220} height={28} className="h-6 w-auto" unoptimized />
          </Link>
          <span className="text-[11px] font-medium tracking-widest uppercase text-[var(--km-text-muted)] border border-[var(--km-border)] px-2 py-0.5 rounded">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[13px] text-[var(--km-text-muted)] hover:text-[var(--km-text)] transition-colors"
          >
            ← Back to Store
          </Link>
          <button
            onClick={() => { logout(); router.replace("/admin/login"); }}
            className="text-[13px] text-[var(--km-text-muted)] hover:text-[#DC2626] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-[var(--km-border)] px-6">
        <nav className="flex gap-0">
          {TABS.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-5 py-3.5 text-[13px] font-medium border-b-2 transition-colors ${
                  active
                    ? "border-transparent"
                    : "border-transparent text-[var(--km-text-muted)] hover:text-[var(--km-text-secondary)]"
                }`}
                style={active ? { borderBottomColor: "#F5A600", borderBottomWidth: 2, color: "#F5A600" } : {}}
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
