import { Skeleton } from "@/components/ui/skeleton";

export function SubCategoryCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white">
      <div className="relative w-full aspect-305/315">
        <Skeleton className="h-full w-full bg-gray-400 rounded-xl" />
      </div>
    </div>
  );
}
