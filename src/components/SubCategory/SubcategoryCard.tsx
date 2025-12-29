"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export function SubCategoryCard({ subcategoryData }: any) {
  const router = useRouter();
  console.log(subcategoryData);

  const handelNavigateToProduct = () => {
const slugify = (str: string) =>
  str.toLowerCase().trim().replace(/\s+/g, "-");

// Create slugs
const categorySlug = slugify(subcategoryData.category.categoryName);
const subcategorySlug = slugify(subcategoryData.subCategoryName);

// Push to URL
router.push(
  `/store/${categorySlug}/${subcategoryData.category._id}/${subcategorySlug}/${subcategoryData._id}`
);
  };
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl bg-white transition-all duration-300"
    >
      <div
        className="relative  w-full aspect-305/315 overflow-hidden rounded-xl"
        onClick={handelNavigateToProduct}
      >
        <Image
          src={subcategoryData.image[0].url}
          alt={subcategoryData.subCategoryName}
          fill
          quality={100} // 👈 makes it sharp again
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors" />
        <h2 className="absolute bottom-4 left-4 text-xl font-semibold text-white drop-shadow-lg">
          {subcategoryData.subCategoryName}
        </h2>
      </div>
    </motion.div>
  );
}
