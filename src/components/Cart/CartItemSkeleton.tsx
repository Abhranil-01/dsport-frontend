import { Skeleton } from "@/components/ui/skeleton";

export default function CartItemSkeleton() {
  return (
    <div className="flex flex-col md:flex-row rounded-2xl w-full md:w-160 shadow-lg mt-8 overflow-hidden border bg-white">
      {/* IMAGE SKELETON */}
      <div className="w-full md:w-[40%]">
        <Skeleton className="w-full h-56 md:h-full bg-gray-400" />
      </div>

      {/* CONTENT SKELETON */}
      <div className="flex-1 flex flex-col justify-center gap-4 px-4 pb-6 pt-4">
        {/* TITLE */}
        <Skeleton className="h-6 w-3/4 bg-gray-400" />

        {/* COLOR */}
        <Skeleton className="h-4 w-1/3 bg-gray-400" />

        {/* PRICE ROW */}
        <div className="flex gap-3 items-center">
          <Skeleton className="h-5 w-14 bg-gray-400" />
          <Skeleton className="h-5 w-16 bg-gray-400" />
          <Skeleton className="h-5 w-20 bg-gray-400" />
        </div>

        {/* SIZE + QTY */}
        <div className="flex justify-between gap-6 mt-2">
          <Skeleton className="h-8 w-24 bg-gray-400" />
          <Skeleton className="h-8 w-32 bg-gray-400" />
        </div>

        {/* TOTAL PRICE */}
        <Skeleton className="h-6 w-32 bg-gray-400 mt-2" />
      </div>
    </div>
  );
}
