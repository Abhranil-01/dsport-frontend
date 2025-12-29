'use client';

import { Card, CardContent } from "@/components/ui/card";

export default function ReviewList({ reviews }: any) {
  return (
    <div className="space-y-4">
      {reviews?.map((review: any, index: number) => (
        <Card
          key={index}
          className="border border-gray-200 rounded-md shadow-sm hover:shadow transition"
        >
          <CardContent className="p-4">
            {/* RATING + NAME */}
            <div className="flex items-center gap-2 mb-1">
              {/* Rating Badge */}
              <span
                className="text-xs font-semibold text-white px-2 py-1 rounded-sm"
                style={{
                  backgroundColor:
                    review.rating >= 4 ? "#2e7d32" : "#ff9f00",
                }}
              >
                {review.rating} ★
              </span>

              {/* Reviewer Name */}
              <span className="text-gray-800 font-medium text-sm">
                {review.addressName}
              </span>
            </div>

            {/* CITY */}
            <p className="text-xs text-gray-500 mb-2">{review.city}</p>

            {/* REVIEW TEXT */}
            <p className="text-gray-800 text-sm leading-relaxed">
              {review.review}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
