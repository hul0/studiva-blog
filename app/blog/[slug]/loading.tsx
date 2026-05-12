import { Skeleton } from "@/components/ui/skeleton"

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/5 py-4">
        <div className="mx-auto max-w-6xl px-4 flex gap-2">
           <Skeleton className="h-4 w-12" />
           <Skeleton className="h-4 w-12" />
           <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8 space-y-8">
            <header className="space-y-6">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-6 border-y border-border/10 py-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </header>

            <Skeleton className="aspect-video w-full rounded-2xl" />

            <div className="space-y-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </aside>
        </div>
      </div>
    </div>
  )
}
