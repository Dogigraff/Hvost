import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-border/70 before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(90deg,transparent,hsl(var(--surface)/0.65),transparent)] before:animate-[shimmer_1.4s_infinite]',
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-border/50 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function SkeletonDogCard() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-border/50">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
