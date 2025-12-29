import { Skeleton } from "@/components/ui/skeleton";

function OrderCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-4 w-32 bg-gray-300" />
        <Skeleton className="h-4 w-20 bg-gray-300" />
      </div>

      <Skeleton className="h-3 w-40 mb-4 bg-gray-300" />

      {/* Items */}
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-14 w-14 rounded-md bg-gray-300" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32 bg-gray-300" />
              <Skeleton className="h-3 w-24 bg-gray-300" />
              <Skeleton className="h-3 w-16 bg-gray-300" />
            </div>
            <Skeleton className="h-4 w-10 bg-gray-300" />
            <Skeleton className="h-6 w-12 bg-gray-300" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-5 w-24 bg-gray-300" />
        <Skeleton className="h-8 w-24 rounded-md bg-gray-300" />
      </div>
    </div>
  );
}
export default OrderCardSkeleton