import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Hero Skeleton */}
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
          <Skeleton className="hidden h-[500px] w-full rounded-3xl lg:block" />
        </div>

        {/* Content Skeleton */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-9 space-y-8">
            <Skeleton className="h-10 w-48" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4 rounded-2xl border border-border/40 p-3">
                  <Skeleton className="aspect-[16/9] w-full rounded-xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-12 mt-16 lg:mt-0">
             <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
             </div>
             <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
