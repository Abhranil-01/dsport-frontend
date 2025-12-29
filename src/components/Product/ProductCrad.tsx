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
  const handleNavigatetoSingleProductPage = () => {
    router.push(
      `/product/${
        productDetails.productName
      }/${productDetails.productColorName.replaceAll(" ", "")}/${
        productDetails._id
      }`
    );
  };
  return (
    <Card className="md:rounded-2xl rounded-none overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200 p-0 pb-6  cursor-pointer">
      <div onClick={handleNavigatetoSingleProductPage}>
        <div className="relative h-40 md:h-65 w-full ">
          <Image
            src={productDetails.coverImage[0].url}
            alt={productDetails.productColorName}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <CardContent className="pt-4">
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-semibold leading-tight">
              {productDetails.productName}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              {productDetails.productColorName}
            </CardDescription>
          </CardHeader>
          <div className="my-3 flex items-center justify-between gap-4 ">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1" aria-hidden>
              <span
                className="text-xs font-semibold text-white px-2 py-1 rounded-sm"
                style={{
                  backgroundColor:
                    productDetails.averageRating >= 4 ? "#2e7d32" : "#ff9f00",
                }}
              >
                {productDetails.averageRating} ★

                
              </span>
                <span>({productDetails.totalReviews})</span>
              </div>
             
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">₹{price.offerprice.toLocaleString("en-IN")}</div>
            <div className="text-xl text-gray-400 line-through">
              ₹{price.actualprice.toLocaleString("en-IN")}
            </div>
            <div className="text-green-700">{price.percentage}%off</div>
          </div>
        </CardContent>
      </div>

      {/* <CardFooter>
        <Button
          variant="outline"
          size="sm"
          // onClick={() => onAddToCart?.(id)}
          className="flex items-center gap-2 w-full bg-black text-white "
        >
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>
      </CardFooter> */}
    </Card>
  );
}
