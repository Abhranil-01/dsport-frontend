import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-20">
      {/* ================= PRODUCT ================= */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
   
        <div className="rounded-2xl p-4 sm:p-6">
  
          <div className="flex flex-col-reverse lg:flex-row items-start gap-6">
         <div className="flex lg:flex-col gap-3 lg:w-20 overflow-x-auto lg:overflow-visible items-center lg:items-start">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-gray-300 shrink-0"
                />
              ))}
            </div>
            <div className="w-full flex justify-center">
              <Skeleton className="aspect-square w-full max-w-[420px] rounded-xl bg-gray-300" />
            </div>

         
        
          </div>
        </div>

   
        <div className="space-y-7">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-32 bg-gray-300" />
            <Skeleton className="h-7 w-3/4 bg-gray-300" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-28 rounded-full bg-gray-300" />
            <Skeleton className="h-4 w-36 bg-gray-300" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-300" />
            <Skeleton className="h-4 w-11/12 bg-gray-300" />
            <Skeleton className="h-4 w-9/12 bg-gray-300" />
          </div>

          {/* Price */}
          <div className="flex items-end gap-4">
            <Skeleton className="h-10 w-36 bg-gray-300" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24 bg-gray-300" />
              <Skeleton className="h-4 w-20 bg-gray-300" />
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-20 bg-gray-300" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="w-20 h-20 rounded-xl bg-gray-300"
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-20 bg-gray-300" />
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-16 rounded-full bg-gray-300"
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <Skeleton className="h-14 w-full rounded-2xl bg-gray-300 shadow-lg" />
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="max-w-5xl mx-auto mt-20 px-4">
        <Skeleton className="h-7 w-60 mb-6 bg-gray-300" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Average Rating */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-3">
            <Skeleton className="h-12 w-20 bg-gray-300" />
            <Skeleton className="h-5 w-32 bg-gray-300" />
            <Skeleton className="h-4 w-44 bg-gray-300" />
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-8 bg-gray-300" />
                <Skeleton className="h-2 w-full bg-gray-300" />
                <Skeleton className="h-4 w-8 bg-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-14 bg-gray-300" />
                <Skeleton className="h-4 w-36 bg-gray-300" />
              </div>

              <Skeleton className="h-4 w-28 bg-gray-300" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-4 w-10/12 bg-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPageSkeleton;
