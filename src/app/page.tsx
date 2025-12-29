"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

import { CarouselAuto } from "@/components/CarsoulAuto";
import { CategoryCard } from "@/components/CategoryCard";
import { socket } from "@/lib/socket";
import { useGetCategoriesQuery, apiSlice } from "@/services/apiSlice";

export default function Home() {
  const { data: categories, isError } = useGetCategoriesQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const invalidateCategories = () => {
      dispatch(apiSlice.util.invalidateTags(["Category"]));
    };

    socket.on("CATEGORY_CREATED", invalidateCategories);
    socket.on("CATEGORY_UPDATED", invalidateCategories);
    socket.on("CATEGORY_DELETED", invalidateCategories);

    return () => {
      socket.off("CATEGORY_CREATED", invalidateCategories);
      socket.off("CATEGORY_UPDATED", invalidateCategories);
      socket.off("CATEGORY_DELETED", invalidateCategories);
    };
  }, [dispatch]);

  return (
    <main className="font-sans bg-linear-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:to-black">
      <section className="w-full flex items-center justify-center py-4">
        <CarouselAuto />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800 dark:text-gray-100">
          Shop by Sports Category
        </h1>

        {isError && (
          <p className="text-center text-red-500">
            Failed to load categories
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories?.data?.data?.map((cat: any) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      {/* About Section unchanged */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl overflow-hidden my-14">
        <div className="w-full md:w-1/2 h-64 md:h-[450px] relative">
          <Image
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1000&q=80"
            alt="Sports Spirit"
            fill
            className="object-cover opacity-80"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Fuel Your Passion for Sports
          </h2>
          <p className="text-lg opacity-90">
            Welcome to our sports store — where energy meets performance.
          </p>
        </div>
      </section>
    </main>
  );
}
