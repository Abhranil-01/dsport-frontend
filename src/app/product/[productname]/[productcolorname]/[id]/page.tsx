"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  useAddItemToCartMutation,
  useGetSingleColorWiseProductQuery,
  useGetSingleProductQuery,
} from "@/services/apiSlice";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReviewList from "@/components/ReviewList";
import ProductPageSkeleton from "@/components/Product/ProductPageSkeleton";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const [showPrices, setShowPrices] = useState({
    id: "" as any,
    actualprice: "" as any,
    offerprice: "" as any,
    percentage: "" as any,
  });

  const {
    data: product,
    isLoading,
    isError,
  } = useGetSingleColorWiseProductQuery({ id: id as string });

  const { data: productMain } = useGetSingleProductQuery({
    id: product?.productId as string,
  });

  const [addItemToCart] = useAddItemToCartMutation();

  useEffect(() => {
    if (product?.selectedSize) {
      setShowPrices({
        id: product.selectedSize._id,
        actualprice: product.selectedSize.actualPrice,
        offerprice: product.selectedSize.offerPrice,
        percentage: product.selectedSize.offerPercentage,
      });
      setSelectedSize(product.selectedSize._id);
    }
  }, [product]);

  if (isLoading) return <ProductPageSkeleton />;

  if (isError || !product) return <div>Product Not Found</div>;

  const selectedSizeData = product?.sizes.find(
    (s: any) => s._id === selectedSize
  );

  const isOutOfStock = selectedSizeData?.stock === 0;

  // ADD TO CART
  const handleAddToCart = async () => {
    try {
      if (isOutOfStock) {
        toast.error("This size is out of stock");
        return;
      }

      const itemData = {
        productcolorwiseitemId: product._id,
        quantity: 1,
        productPriceAndSizeAndStockId: selectedSize,
      };

      const res = await addItemToCart(itemData).unwrap();

      if (res?.statusCode === 201 || res?.success === true) {
        toast.success("Added to cart successfully");
      } else {
        toast.error("Not added to cart");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Please Login to add to cart");
      console.log(error, "when add to cart");
    }
  };

  const isColorOutOfStock = (color: any) => {
    return color.sizes.every((s: any) => s.stock === 0);
  };
  // Ensure we have reviews array
  const reviews = product?.reviews || [];

  // Ratings calculation (all users who rated)
  const totalRatings = reviews.length; // total number of ratings
  const ratingSum = reviews.reduce(
    (sum: number, r: any) => sum + (r.rating || 0),
    0
  );
  const avgRating = totalRatings ? ratingSum / totalRatings : 0;

  // Reviews with comments (users who actually wrote a review)
  const reviewsWithComments = reviews.filter(
    (r: any) => r.review && r.review.trim() !== ""
  );
  const totalReviews = reviewsWithComments.length;

  // STAR DISTRIBUTION
  const starCounts = [1, 2, 3, 4, 5].reduce((acc: any, star) => {
    acc[star] = reviews.filter((r: any) => r.rating === star).length;
    return acc;
  }, {});
  const renderStars = (rating: number) => {
    const totalStars = 5;

    return Array.from({ length: totalStars }).map((_, i) => {
      const starNumber = i + 1;
      const fillPercent =
        starNumber <= rating
          ? 100 // full star
          : starNumber - rating < 1
          ? (rating % 1) * 100 // partial star
          : 0; // empty star

      return (
        <span key={i} className="relative inline-block w-4 h-4">
          {/* Gray Star */}
          <Star className="absolute w-4 h-4 text-gray-300 fill-gray-300" />

          {/* Yellow Star clipped by fillPercent */}
          <Star
            className="absolute w-4 h-4 text-yellow-400 fill-yellow-400"
            style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
          />
        </span>
      );
    });
  };
  const slugify = (value: string) =>
    value.trim().toLowerCase().replaceAll("/", ",").replace(/\s+/g, "-");

  return (
 <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-20">
      {/* ================= PRODUCT ================= */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ================= LEFT : IMAGES ================= */}
        <div className="rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ================= THUMBNAILS ================= */}
            <div className="flex lg:flex-col gap-3 lg:w-20 overflow-x-auto lg:overflow-visible items-center lg:items-start">
              {product?.images.map((img:any, index:any) => (
                <Button
                  key={img._id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden border p-0 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-black ring-2 ring-black/30 scale-105"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                  />
                </Button>
              ))}
            </div>

            {/* ================= MAIN IMAGE ================= */}
            <div className="w-full flex justify-center">
              <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-xl group">
                <Image
                  src={product?.images[selectedImage]?.url}
                  alt="product image"
                  fill
                  priority
                  className="object-contain transition-transform duration-300 group-hover:scale-150 cursor-zoom-in"
                />

                {/* Mobile Zoom Hint */}
                <div className="absolute bottom-3 right-3 text-xs bg-black/70 text-white px-3 py-1 rounded-full lg:hidden">
                  Tap to zoom
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT : DETAILS ================= */}
        <div className="space-y-7">
          {/* Title */}
          <div>
            <h1 className="text-xs uppercase tracking-wide text-gray-500">
              {product?.productName}
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {product?.productColorName}
            </h2>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
              {renderStars(avgRating)}
              <span className="text-sm font-semibold text-green-700">
                {avgRating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {totalRatings} Ratings • {totalReviews} Reviews
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {product?.productDescription}
          </p>

          {/* Price */}
          <div className="flex items-end gap-4">
            <h2 className="text-4xl font-extrabold text-gray-900">
              ₹{showPrices.offerprice.toLocaleString("en-IN")}
            </h2>
            <div>
              <p className="line-through text-gray-400 text-sm">
                ₹{showPrices.actualprice.toLocaleString("en-IN")}
              </p>
              <p className="text-green-600 font-semibold text-sm">
                {showPrices.percentage}% OFF
              </p>
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-medium mb-3">Color</h3>
            <div className="flex gap-4 flex-wrap">
              {productMain?.data?.colors.map((color: any) => {
                const out = isColorOutOfStock(color);

                return (
                  <div key={color._id} className="text-center">
                    <Button
                      disabled={out}
                      onClick={() =>
                        !out &&
                        router.push(
                          `/product/${productMain.data.productName}/${slugify(
                            color.productColorName
                          )}/${color._id}`
                        )
                      }
                      className={`w-20 h-20 p-0 rounded-xl border overflow-hidden transition ${
                        out
                          ? "opacity-40 cursor-not-allowed"
                          : product?._id === color._id
                          ? "border-black ring-2 ring-black/30 scale-105"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <Image
                        src={color.coverImage[0].url}
                        alt="color"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </Button>

                    <p
                      className={`text-xs mt-1 ${
                        out ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {out ? "Out of Stock" : "In Stock"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-medium mb-3">Size</h3>
            <div className="flex gap-3 flex-wrap">
              {product?.sizes.map((size: any) => {
                const out = size.stock === 0;
                const low = size.stock > 0 && size.stock <= 10;

                return (
                  <div key={size._id} className="flex flex-col">
                    <button
                      disabled={out}
                      onClick={() => !out && setSelectedSize(size._id)}
                      className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
                        out
                          ? "bg-gray-200 text-gray-400"
                          : selectedSize === size._id
                          ? "bg-black text-white"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {size.size}
                    </button>

                    <span
                      className={`text-xs mt-1 ${
                        out
                          ? "text-red-600"
                          : low
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {out
                        ? "Out of Stock"
                        : low
                        ? `Only ${size.stock} left`
                        : "In Stock"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full h-14 rounded-2xl text-lg bg-black hover:bg-gray-900 shadow-lg"
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="max-w-5xl mx-auto mt-20 px-4">
        <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold">{avgRating.toFixed(1)}</h1>
            <div className="mt-2">{renderStars(avgRating)}</div>
            <p className="text-sm text-gray-500 mt-2">
              {totalRatings} Ratings & {totalReviews} Reviews
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starCounts[star] || 0;
              const percent = totalRatings
                ? (count / totalRatings) * 100
                : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium">{star}★</span>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-green-500 rounded transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-sm text-gray-600 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="mb-6" />
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
