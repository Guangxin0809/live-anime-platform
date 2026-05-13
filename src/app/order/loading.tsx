import { Skeleton } from "@/components/ui/Skeleton";

export default function OrderListLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
