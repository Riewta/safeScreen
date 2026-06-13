"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({ className, variant = "rect", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-[#f0f0f0] dark:bg-[#222]",
        variant === "circle" ? "rounded-full" : "rounded-md",
        variant === "text" ? "h-4 w-full" : "",
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-1/2 h-3" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-1/3 h-4" />
      </div>
    </div>
  );
}

export function BrandHeroSkeleton() {
  return (
    <div className="w-full h-[95vh] relative bg-[#111] overflow-hidden">
      <Skeleton className="absolute inset-0 opacity-10" />
      <div className="relative z-10 p-6 pt-6 flex justify-between">
        <Skeleton className="w-32 h-12 rounded-full opacity-20" />
        <Skeleton className="w-12 h-12 rounded-full opacity-20" />
      </div>
      <div className="absolute bottom-12 left-6 right-6 space-y-4">
        <Skeleton className="w-48 h-6 rounded-md opacity-20" />
        <Skeleton className="w-full h-24 rounded-md opacity-20" />
        <div className="flex gap-4 overflow-hidden pt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="flex-shrink-0 w-[145px] md:w-[200px] aspect-square rounded-[32px] opacity-20" />
          ))}
        </div>
      </div>
    </div>
  );
}
