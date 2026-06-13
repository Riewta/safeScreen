import { ProductCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function GlobalLoading() {
  return (
    <div className="bg-[var(--km-surface)] min-h-screen p-6">
      {/* Home Hero Skeleton */}
      <Skeleton className="w-full h-[40vh] md:h-[60vh] rounded-[40px] mb-12 opacity-50" />
      
      {/* Section Skeleton */}
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-6">
          <Skeleton className="w-48 h-8 rounded-md" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <Skeleton className="w-64 h-8 rounded-md" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
