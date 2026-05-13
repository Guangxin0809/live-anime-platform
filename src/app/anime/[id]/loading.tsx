import { Skeleton } from "@/components/ui/Skeleton";

export default function AnimeDetailLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Skeleton className="mb-4 h-4 w-20" />
      <div className="flex flex-col gap-8 md:flex-row">
        <Skeleton className="aspect-[3/4] w-full rounded-lg md:w-72" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="mb-4 h-6 w-24" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
