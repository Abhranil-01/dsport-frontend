import { Skeleton } from "@/components/ui/skeleton";

const OrderSideBarSkeleton = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end h-screen">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/30" />

      {/* SIDEBAR */}
      <div
        className="relative bg-white w-full sm:w-[60%] md:w-[45%] lg:w-[35%]
        h-full shadow-2xl z-50 overflow-y-auto rounded-l-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48 bg-gray-300" />
            <Skeleton className="h-3 w-32 bg-gray-300" />
          </div>

          <Skeleton className="h-8 w-8 rounded-full bg-gray-300" />
        </div>

        <div className="p-4 space-y-6">
          {/* ORDER SUMMARY */}
          <div className="border rounded-xl p-4 space-y-3">
            <Skeleton className="h-4 w-32 bg-gray-300" />

            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-28 bg-gray-300" />
                <Skeleton className="h-3 w-20 bg-gray-300" />
              </div>
            ))}
          </div>

          {/* ORDERED ITEMS */}
          <div className="border rounded-xl p-4 space-y-4">
            <Skeleton className="h-4 w-32 bg-gray-300" />

            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-[70px] w-[70px] rounded-md bg-gray-300" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-40 bg-gray-300" />
                  <Skeleton className="h-3 w-28 bg-gray-300" />
                  <Skeleton className="h-3 w-24 bg-gray-300" />
                </div>

                <Skeleton className="h-3 w-14 bg-gray-300" />
              </div>
            ))}
          </div>

          {/* PAYMENT BREAKDOWN */}
          <div className="border rounded-xl p-4 space-y-3">
            <Skeleton className="h-4 w-40 bg-gray-300" />

            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3 w-28 bg-gray-300" />
                <Skeleton className="h-3 w-20 bg-gray-300" />
              </div>
            ))}

            <hr />

            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-gray-300" />
              <Skeleton className="h-4 w-24 bg-gray-300" />
            </div>
          </div>

          {/* INVOICE BUTTON */}
          <Skeleton className="h-12 w-full rounded-xl bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default OrderSideBarSkeleton;
