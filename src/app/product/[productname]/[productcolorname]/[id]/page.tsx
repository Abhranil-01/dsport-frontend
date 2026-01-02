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

  if (isLoading)
    return (
<ProductPageSkeleton/>
    );

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
      console.log(error,"when add to cart");
      
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





  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT IMAGES */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-3">
            {product?.images.map((img: any, index: number) => (
              <button
                key={img._id}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-xl border overflow-hidden transition ${
                  selectedImage === index
                    ? "border-black shadow-md"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt="thumbnail"
                  width={90}
                  height={90}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg w-full">
            <Image
              src={product?.images[selectedImage]?.url}
              alt=""
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT PRODUCT DETAILS */}
        <div>
          <h1 className="font-bold text-gray-600">{product?.productName}</h1>
          <h2 className="text-xl font-bold mb-4">
            {product?.productColorName}
          </h2>

          {/* STAR RATING */}
<div className="flex items-center gap-4 mb-6">
  {/* ⭐ Star Rating + Numeric */}
  <div className="flex items-center ">
    {renderStars(avgRating)}
    <span className="text-lg font-semibold text-gray-700">
      {avgRating.toFixed(1)}
    </span>
  </div>

  {/* Ratings & Reviews Count */}
  <div className="text-gray-500 text-sm flex gap-1 items-center">
    <span>{totalRatings} Ratings</span>
    <span>|</span>
    <span>{totalReviews} Reviews</span>
  </div>
</div>



          {/* DESCRIPTION */}
          <p className="text-gray-700 mb-6">{product.productDescription}</p>

          {/* PRICE */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-4xl font-bold">
              ₹{showPrices.offerprice.toLocaleString("en-IN")}
            </h2>
            <span className="line-through text-gray-500">
              ₹{showPrices.actualprice.toLocaleString("en-IN")}
            </span>
            <span className="text-green-600 font-semibold">
              {showPrices.percentage}% Off
            </span>
          </div>

          {/* COLORS */}
          <div className="mb-8">
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex gap-4">
              {productMain?.data?.colors.map((color: any) => {
                const colorOut = isColorOutOfStock(color);

                return (
                  <div key={color._id} className="text-center">
                    <Button
                      onClick={() =>
                        !colorOut &&
                        router.push(
                          `/product/${
                            productMain?.data?.productName
                          }/${color.productColorName.replaceAll(" ", "")}/${
                            color._id
                          }`
                        )
                      }
                      disabled={colorOut}
                      className={`w-20 h-20 p-0 border rounded-none overflow-hidden ${
                        colorOut
                          ? "opacity-40 cursor-not-allowed"
                          : product?._id === color._id
                          ? "border-black shadow-md"
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
                        colorOut ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {colorOut ? "Out of Stock" : "In Stock"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIZES */}
          <div className="mb-8">
            <h3 className="font-medium mb-2">Sizes</h3>
            <div className="flex gap-3">
              {product?.sizes.map((size: any) => {
                const isOut = size.stock === 0;
                const isLow = size.stock <= 10 && size.stock > 0;

                return (
                  <div key={size._id} className="flex flex-col">
                    <button
                      onClick={() => {
                        if (!isOut) {
                          setShowPrices({
                            id: size._id,
                            actualprice: size.actualPrice,
                            offerprice: size.offerPrice,
                            percentage: size.offerPercentage,
                          });
                          setSelectedSize(size._id);
                        }
                      }}
                      disabled={isOut}
                      className={`px-4 py-2 rounded-lg border w-fit text-sm ${
                        isOut
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : selectedSize === size._id
                          ? "bg-black text-white"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {size.size}
                    </button>

                    <span
                      className={`text-xs ml-1 ${
                        isOut
                          ? "text-red-600"
                          : isLow
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {isOut
                        ? "Out of Stock"
                        : isLow
                        ? `Only ${size.stock} left!`
                        : "In Stock"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ADD TO CART */}
          <Button
            className="w-full py-5 text-lg rounded-xl"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>


      <div className="max-w-5xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-semibold mb-3">Ratings & Reviews</h2>

        <div className="flex gap-10 items-start mb-6">
          {/* LEFT AVG BOX */}
          <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm w-40">
            <h1 className="text-4xl font-bold">{avgRating.toFixed(1)}</h1>

            <div className="flex mt-1">
              <div className="flex items-center mb-4">
                {renderStars(avgRating)}
                <span className="ml-2 text-gray-600">
            
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {totalRatings} Ratings & {totalReviews} Reviews
            </p>
          </div>

          {/* RIGHT STAR DISTRIBUTION */}
          <div className="flex flex-col gap-1 w-full max-w-sm">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starCounts[star] || 0;
              const percent = totalRatings ? (count / totalRatings) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-5">{star}★</span>

                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-green-500 rounded"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <span className="text-sm text-gray-600 w-6 text-right">
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
