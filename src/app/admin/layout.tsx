import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">SafeScreen Admin</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">CMS</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/admin/products" className="text-sm text-gray-600 hover:text-gray-900">Products</Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Back to Store</Link>
        </nav>
      </div>
      <main>{children}</main>
    </div>
  );
}