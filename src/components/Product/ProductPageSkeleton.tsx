import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPageSkeleton() {
  return (
    <div className="min-h-screen py-10 bg-gray-50">
      {/* PRODUCT SECTION */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT IMAGE SECTION */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="w-20 h-20 rounded-xl bg-gray-300"
              />
            ))}
          </div>

          {/* Main Image */}
          <Skeleton className="w-full h-[450px] rounded-2xl bg-gray-300" />
        </div>

        {/* RIGHT PRODUCT DETAILS */}
        <div className="space-y-5">
          <Skeleton className="h-4 w-40 bg-gray-300" />
          <Skeleton className="h-6 w-72 bg-gray-300" />

          {/* Rating */}
          <div className="flex gap-3">
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-4 w-32 bg-gray-300" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full bg-gray-300" />
            <Skeleton className="h-3 w-5/6 bg-gray-300" />
            <Skeleton className="h-3 w-4/6 bg-gray-300" />
          </div>

          {/* Price */}
          <div className="flex gap-3 items-center">
            <Skeleton className="h-8 w-28 bg-gray-300" />
            <Skeleton className="h-4 w-20 bg-gray-300" />
            <Skeleton className="h-4 w-16 bg-gray-300" />
          </div>

          {/* Colors */}
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-20 h-20 bg-gray-300" />
            ))}
          </div>

          {/* Sizes */}
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="w-14 h-9 rounded-lg bg-gray-300"
              />
            ))}
          </div>

          {/* Button */}
          <Skeleton className="h-12 w-full rounded-xl bg-gray-300" />
        </div>
      </div>

      {/* ================= REVIEWS SKELETON ================= */}
      <div className="max-w-5xl mx-auto mt-16 px-4">
        <Skeleton className="h-6 w-56 mb-6 bg-gray-300" />

        <div className="flex gap-10 items-start mb-6">
          {/* AVG RATING BOX */}
          <div className="flex flex-col items-center p-4 border rounded-lg w-40 space-y-3">
            <Skeleton className="h-10 w-16 bg-gray-300" />
            <Skeleton className="h-4 w-24 bg-gray-300" />
            <Skeleton className="h-3 w-32 bg-gray-300" />
          </div>

          {/* STAR DISTRIBUTION */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-8 bg-gray-300" />
                <Skeleton className="h-2 w-full bg-gray-300" />
                <Skeleton className="h-3 w-6 bg-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* REVIEW CARDS */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-md p-4 space-y-3"
            >
              <div className="flex gap-2 items-center">
                <Skeleton className="h-5 w-12 bg-gray-300" />
                <Skeleton className="h-4 w-32 bg-gray-300" />
              </div>

              <Skeleton className="h-3 w-24 bg-gray-300" />

              <Skeleton className="h-3 w-full bg-gray-300" />
              <Skeleton className="h-3 w-5/6 bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
