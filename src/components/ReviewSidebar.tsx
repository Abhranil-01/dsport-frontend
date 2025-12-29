"use client";

import { X, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "@/services/apiSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ReviewSidebar({ product, onClose }: any) {
  const router=useRouter()
  // Prefill data if review exists
  const [rating, setRating] = useState(product?.productReview?.rating || 0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState(product?.productReview?.review || "");

  const [CreateReview, { isLoading: creating }] = useCreateReviewMutation();
  const [UpdateReview, { isLoading: updating }] = useUpdateReviewMutation();

const handleSubmitReview = async () => {
  if (rating === 0) {
    toast.warn("Please give at least 1 star before submitting.");
    return;
  }

  try {
    let res;

    if (product.productReview) {
      // ⭐ UPDATE – send only rating + review
      res = await UpdateReview({
        id: product.productReview._id,
        reviewData: {
          rating,
          review
        }
      }).unwrap();

      toast.success("Your review has been updated successfully.");
    } else {
      // ⭐ CREATE – send full data
      const reviewData = {
        rating,
        review,
        productcolorId: product.productColorItem,
        address: product.address,
        orderItemId: product.orderItemId,
      };

      res = await CreateReview(reviewData).unwrap();
      toast.success("Thank you! Your review has been submitted.");
    }

    console.log("Review Response:", res);
    onClose();
  } catch (error: any) {
    toast.error(error?.data?.message || "Something went wrong!");
  }
};

  return (
    <div className="fixed h-screen inset-0 z-60 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="relative bg-white w-full sm:w-[60%] md:w-[45%] lg:w-[35%] h-full shadow-2xl z-50 overflow-y-auto animate-slideIn rounded-l-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {product.productReview ? "Update Review" : "Write a Review"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-5 space-y-6">
          {/* Product Summary */}
          <div className="flex items-center gap-4 border-b pb-4">
            <Image
              src={product.image}
              alt={product.title}
              width={80}
              height={80}
              className="rounded-lg object-cover border"
                  onClick={() => {
                    router.push(
                      `/product/${
                        product.productName
                      }/${product.title.replaceAll(
                        " ",
                        ""
                      )}/${product.productColorItem}`
                    );
                  }}
            />

            <div className="space-y-1 text-sm">
              <p className="font-bold  text-gray-500">{product.productName}</p>
              <p className="font-medium">{product.title}</p>
              <p className="text-gray-600">Size: {product.size}</p>
              <p className="text-gray-600">Qty: {product.quantity}</p>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-black">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-gray-500 line-through text-xs">
                  ₹{product.actualPrice.toLocaleString()}
                </span>
                <span className="text-green-600 text-xs font-medium">
                  {product.offerPercentage}% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div>
            <p className="font-medium text-sm mb-2">Your Rating</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className={`h-6 w-6 cursor-pointer transition-all ${
                    star <= (hover || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Review Text Area */}
          <div>
            <p className="font-medium text-sm mb-2">Your Review</p>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Share your experience with this product..."
            />
          </div>

          {/* Submit Button */}
          <Button
            disabled={creating || updating}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl flex items-center justify-center gap-2 py-2"
            onClick={handleSubmitReview}
          >
            <Send className="h-4 w-4" />
            {product.productReview
              ? updating
                ? "Updating..."
                : "Update Review"
              : creating
              ? "Submitting..."
              : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
