import Link from "next/link";

interface ViewMoreButtonProps {
  href: string;
  label?: string;
}

export function ViewMoreButton({ href, label = "ดูทั้งหมด" }: ViewMoreButtonProps) {
  return (
    <div className="mt-8 flex justify-center w-full">
      <Link
        href={href}
        className="flex md:inline-flex items-center justify-center w-full md:w-auto md:min-w-[240px] px-8 py-3.5 border border-[var(--km-border)] rounded-full text-[13px] font-medium text-[var(--km-text-secondary)] hover:border-[var(--km-text)] hover:text-[var(--km-text)] active:scale-[0.98] transition-all"
      >
        {label}
      </Link>
    </div>
  );
}
