"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
// type ProductCardProps = {
//   id?: string;
//   title: string;
//   price: string | number;
//   image: string;
//   rating?: number; // 0 - 5
//   tags?: string[];
//   onAddToCart?: (id?: string) => void;
// };

export default function ProductCard({ productDetails }: any) {
  console.log(productDetails);
  const [price, setPrice] = useState({
    actualprice: 0,
    offerprice: 0,
    percentage: 0,
  });
  const router = useRouter();
  useEffect(() => {
    productDetails?.sizes.map((size: any) => {
      console.log("kjohohu", size);

      if (size.defaultsize === true) {
        setPrice({
          actualprice: size.actualPrice,
          offerprice: size.offerPrice,
          percentage: size.offerPercentage,
        });
      }
    });
  }, []);
    const slugify = (value: string) =>
    value.trim().toLowerCase().replaceAll("/", ",").replace(/\s+/g, "-");
  const handleNavigatetoSingleProductPage = () => {
    router.push(
      `/product/${
        productDetails.productName
      }/${slugify(productDetails.productColorName)}/${
        productDetails._id
      }`
    );
  };
  return (
<Card
  onClick={handleNavigatetoSingleProductPage}
  className="
    group cursor-pointer
    bg-white
    rounded-none md:rounded-xl
    overflow-hidden
    shadow-sm hover:shadow-lg
    transition-all duration-300
  "
>
  {/* IMAGE */}
  <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
    <Image
      src={productDetails.coverImage?.[0]?.url}
      alt={productDetails.productColorName}
      fill
      sizes="
        (max-width: 640px) 50vw,
        (max-width: 1024px) 33vw,
        20vw
      "
      className="object-cover"
    />

    {/* ⭐ Review Badge */}
    <div className="absolute bottom-2 left-2">
      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow text-xs font-medium">
        <span
          className="text-white px-1.5 rounded"
          style={{
            backgroundColor:
              productDetails.averageRating >= 4 ? "#388e3c" : "#ff9f00",
          }}
        >
          {productDetails.averageRating} ★
        </span>
        <span className="text-gray-600">
          ({productDetails.totalReviews})
        </span>
      </div>
    </div>
  </div>

  {/* CONTENT */}
  <CardContent className="px-3 pt-3 pb-4 space-y-1">
    <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2">
      {productDetails.productName}
    </h3>

    <p className="text-xs text-gray-500">
      {productDetails.productColorName}
    </p>

    <div className="flex items-center gap-2 pt-1">
      <span className="text-base md:text-lg font-semibold text-gray-900">
        ₹{price.offerprice.toLocaleString("en-IN")}
      </span>
      <span className="text-xs md:text-sm line-through text-gray-400">
        ₹{price.actualprice.toLocaleString("en-IN")}
      </span>
      <span className="text-xs md:text-sm font-semibold text-green-600">
        {price.percentage}% off
      </span>
    </div>
  </CardContent>
</Card>



  );
}
