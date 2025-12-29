"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export function CategoryCard({ category }: any) {
  const router=useRouter()

const navigateToSubcategory=()=>{
  const categoryName = category.categoryName.toLowerCase().trim().replace(/\s+/g, "-");
  router.push(`/${categoryName}/${category._id}`)
}
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="w-full"
    >
      <Card className="relative overflow-hidden h-40 p-0 sm:h-48 md:h-56 rounded-2xl shadow-md group cursor-pointer border border-gray-200 hover:shadow-lg" onClick={navigateToSubcategory}>
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          <Image
            src={category.image[0]?.url}
            alt={category.categoryName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />

          {/* Text */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-white text-lg sm:text-xl font-bold uppercase tracking-wide">
              {category.categoryName}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
