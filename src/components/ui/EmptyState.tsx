import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
      {Icon && <Icon size={40} className="text-[var(--km-border-strong)] mb-2" strokeWidth={1} />}
      <p className="text-sm font-medium text-[var(--km-text-secondary)]">{title}</p>
      {description && (
        <p className="text-xs text-[var(--km-text-muted)]">{description}</p>
      )}
    </div>
  );
}
