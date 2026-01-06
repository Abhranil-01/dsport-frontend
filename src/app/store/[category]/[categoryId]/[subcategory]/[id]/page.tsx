"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ListFilter } from "lucide-react";

import ProductCard from "@/components/Product/ProductCrad";
import ProductFilter from "@/components/ProductFilter/ProductFilter";
import EmptyState from "@/components/EmptyState";
import ProductCardSkeleton from "@/components/Product/ProductCardSkeleton";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { useGetAllProductsColorWiseQuery } from "@/services/apiSlice";
import { useProductSocket } from "@/hooks/useProductSocket";
import { useRouter } from "next/navigation";
export default function Store() {
  useProductSocket();
const router=useRouter()
  const params = useParams();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { category: categorySlugRaw, categoryId, subcategory: subcategorySlugRaw, id } = params ?? {};

// Ensure they are strings (Next.js may give string[])
const categorySlug = Array.isArray(categorySlugRaw) ? categorySlugRaw[0] : categorySlugRaw ?? "";
const subcategorySlug = Array.isArray(subcategorySlugRaw) ? subcategorySlugRaw[0] : subcategorySlugRaw ?? "";

// Convert slug to display name
const displayName = (slug: string) =>
  slug
    .split("-")
    .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
    .join(" ");

// Usage
const categoryDisplay = displayName(categorySlug);      // "Bootas And Balls"
const subcategoryDisplay = displayName(subcategorySlug); // "Summer Collection"



  /* ✅ BUILD FILTER OBJECT FROM URL */
  const filters = useMemo(() => {
  return {
    subcategoryId: id as string,

    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,

    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,

    size: searchParams.get("size") || undefined,

    color: searchParams.get("color") || undefined,

    gender: searchParams.get("gender") || undefined,

    // ⭐ CORRECT RATING PARAMS
    rating: searchParams.get("rating") || undefined,     // "4,3,2"
    noRating:
      searchParams.get("noRating") === "true"
        ? true
        : undefined,
  };
}, [id, searchParams]);

  /* ✅ API AUTO REFETCHES WHEN URL CHANGES */
  const {
    data: products,
    isLoading,
    isError,
  } = useGetAllProductsColorWiseQuery(filters, {
    skip: !id,
    refetchOnMountOrArgChange: true
  });
console.log("products",products);

const navigateToSubcategory=()=>{
  // const categoryName = category.categoryName.toLowerCase().trim().replace(/\s+/g, "-");
  router.push(`/${categorySlug}/${categoryId}`);
}

  return (
    <>
      {isFilterOpen && (
        <ProductFilter handleClose={() => setIsFilterOpen(false)} />
      )}

      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl py-6">

          {/* Hero */}
          <div className="relative mb-5 h-48 sm:h-80 md:h-100 rounded-2xl overflow-hidden">
            <Image
              src="/image/ChatGPT Image Dec 28, 2025, 06_49_18 PM.png"
              alt="Explore"
              fill
              className="fill"
              priority
            />
          </div>

          {/* Breadcrumb */}
          <Breadcrumb className=" ms-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink  className="cursor-pointer" onClick={navigateToSubcategory}>{categoryDisplay}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{subcategoryDisplay}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Filter Button */}
          <div className="flex justify-end mb-2 me-5">
            <Button onClick={() => setIsFilterOpen(true)}>
              <ListFilter className="w-5 h-5 mr-2" />
              Filter
            </Button>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}

            {!isLoading &&
              !isError &&
              products?.colorItems?.length === 0 && (
                <div className="col-span-full">
                  <EmptyState
                    title="No Products Found"
                    description="No products match your filters."
                    imageSrc="/image/19197384.jpg"
                  />
                </div>
              )}

            {!isLoading &&
              !isError &&
              products?.colorItems?.map((product: any) => (
                <ProductCard key={product._id} productDetails={product} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
