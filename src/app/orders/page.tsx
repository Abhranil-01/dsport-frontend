"use client";

import { useState } from "react";
import OrderCard from "@/components/Order/OrderCard";
import { useGetAllOrdersQuery, useGetUserQuery } from "@/services/apiSlice";
import OrderCardSkeleton from "@/components/Order/OrderCardSkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ErrorState from "@/components/ErrorState";
import { useOrderSocket } from "@/hooks/useOrderSocket";

export default function OrdersPage() {
  useOrderSocket();
  const { data: orders, isLoading, isError } = useGetAllOrdersQuery();
  console.log(orders);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>

          {/* 5 Skeleton Cards */}
          {[1, 2, 3, 4, 5].map((i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    // Check if unauthorized error

    return (
        <ErrorState title="You are not authorized please login"/>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-5">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>

        {orders?.data.length === 0 && (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Image
              src="/image/20943429.jpg" // <-- put your image inside /public
              alt="Unauthorized"
              width={200}
              height={200}
              className="opacity-90"
            />

            <p className="text-red-600 text-xl font-semibold">
              No Orders Found
            </p>
          </div>
        )}

        {orders?.data?.map((order: any) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
