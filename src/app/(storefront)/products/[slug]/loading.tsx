import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-5">
      <Skeleton className="h-4 w-64 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Gallery */}
        <div className="flex flex-col gap-4 min-w-0">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6 min-w-0">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-3/4 mb-1" />
            <Skeleton className="h-8 w-1/2" />
            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Separator />

          <div>
            <Skeleton className="h-4 w-32 mb-3" />
            <div className="flex gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-9 rounded-full" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-4 rounded-sm shrink-0" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-28 rounded-lg shrink-0" />
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
          </div>

          <Separator />

          <div>
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-border/40 pb-2"
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-20">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
