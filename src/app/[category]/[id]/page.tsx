"use client";

import { SubCategoryCard } from "@/components/SubCategory/SubcategoryCard";
import { SubCategoryCardSkeleton } from "@/components/SubCategory/SubcategoryCardSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubCategorySocket } from "@/hooks/useSubCategory";
import { useGetCategoryByIdQuery, useGetSubCategoriesQuery } from "@/services/apiSlice";
import Image from "next/image";
import { useParams } from "next/navigation";
export default function SubcategoryPage() {
  useSubCategorySocket(); // 🔥 enable live updates

  const params = useParams();
  const { id } = params;
const rawCategorySlug = Array.isArray(params.category)
  ? params.category[0]
  : params.category;

const decodedCategorySlug = decodeURIComponent(rawCategorySlug || "");


const displayCategoryName = decodedCategorySlug
  .split("-")
  .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
  .join(" ");


  const {
    data: subcategories,
    isLoading,
    isError,
  } = useGetSubCategoriesQuery({ categoryId: id as string });

  const subCategoryList = subcategories?.data?.subCategories || [];
const { data: category,isLoading:isCategoryLoading } = useGetCategoryByIdQuery(id as string);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero Banner */}
   {isCategoryLoading ? (
      /* 🔹 Skeleton Loader */
      <div className="relative mb-10 h-48 overflow-hidden rounded-2xl sm:h-80 md:h-[450px]">
        <Skeleton className="h-full w-full rounded-2xl bg-gray-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-10 w-64 rounded-lg bg-gray-400" />
        </div>
      </div>
    ) : (
      /* 🔹 Actual Banner */
      <div className="relative mb-10 h-48 overflow-hidden rounded-2xl shadow-md sm:h-80 md:h-[450px]">
        <Image
          src={category?.data[0]?.image[0]?.url}
          alt="Explore destinations"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Explore Categories
          </h1>
        </div>
      </div>
    )}

        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{displayCategoryName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isError && (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              src="/image/error.png"
              alt="Error"
              width={220}
              height={220}
            />
            <p className="mt-4 text-lg text-red-600 font-semibold">
              Failed to load subcategories
            </p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SubCategoryCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoading && !isError && subCategoryList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              src="/image/19197384.jpg"
              alt="No subcategory"
              width={250}
              height={250}
            />
            <p className="mt-4 text-xl font-semibold text-gray-600">
              No subcategory available
            </p>
          </div>
        )}

        {!isLoading && !isError && subCategoryList.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {subCategoryList.map((subcategory: any) => (
              <SubCategoryCard
                key={subcategory._id}
                subcategoryData={subcategory}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
