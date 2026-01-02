"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import OrderDetailsSidebar from "@/components/OrderDetailsSidebar";
import ReviewSidebar from "@/components/ReviewSidebar";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCancleOrderMutation } from "@/services/apiSlice";

function OrderCard({ order }: any) {
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [reviewProduct, setReviewProduct] = useState<any | null>(null);

  /* 🔴 Cancel Order Modal State */
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const [cancelOrder, { isLoading }] = useCancleOrderMutation();

  const isOrderDelivered = order?.deliveryStatus === "Delivered";

  const allItemsCancelled = order?.orderItems?.every(
    (item: any) => item.orderStatus === "cancelled"
  );



  /* ================= CANCEL HANDLER ================= */
  const handleCancelConfirm = async () => {
    if (!cancelOrderId) return;

    try {
      await cancelOrder({ orderId: cancelOrderId }).unwrap();
      toast.success("Order cancelled successfully");
      setCancelOrderId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel order");
    }
  };
console.log(order,"ijo");

  return (
    <>
      {/* ================= ORDER DETAILS SIDEBAR ================= */}
      {selectedOrder && (
        <OrderDetailsSidebar
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* ================= REVIEW SIDEBAR ================= */}
      {reviewProduct && (
        <ReviewSidebar
          product={reviewProduct}
          onClose={() => setReviewProduct(null)}
        />
      )}

      {/* ================= CANCEL CONFIRMATION MODAL ================= */}
      {cancelOrderId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              Cancel this order?
            </h3>

            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to cancel this entire order? All items will be
              cancelled and refund (if applicable) will be initiated.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setCancelOrderId(null)}
                disabled={isLoading}
              >
                No
              </Button>

              <Button
                variant="destructive"
                onClick={handleCancelConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ORDER CARD ================= */}
      <Card className="shadow-sm hover:shadow-md transition border border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">
              Order #{order._id}
            </CardTitle>

            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                allItemsCancelled
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {allItemsCancelled ? "Cancelled" : order.deliveryStatus}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-3">
            {order?.orderItems.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center gap-3 border-b pb-2 last:border-none"
              >
                <Image
                  src={item.coverImages[0]?.url}
                  alt={item.productColorItem?.productColorName}
                  width={55}
                  height={55}
                  className="rounded-md object-cover cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/product/${
                        item.product.productName
                      }/${item.productColorItem?.productColorName.replaceAll(
                        " ",
                        ""
                      )}/${item.productColorItem?._id}`
                    )
                  }
                />

                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-bold">
                    {item.product.productName}
                  </p>
                  <p className="text-sm font-medium">
                    {item.productColorItem.productColorName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                {/* <span className="text-sm font-semibold">
                  ₹{item.size?.offerPrice.toLocaleString()}
                </span> */}

                {/* ================= ACTION BUTTONS ================= */}
                <div className="flex flex-col items-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={!isOrderDelivered}
                    onClick={() =>
                      setReviewProduct({
                        productName:
                          item.product.productName,
                        image:
                          item.coverImages[0]?.url,
                        title:
                          item.productColorItem?.productColorName,
                        price: item.size?.offerPrice,
                        quantity: item.quantity,
                        offerPercentage:
                          item.size.offerPercentage,
                        actualPrice:
                          item.size.actualPrice,
                        size: item.size.size,
                        orderItemId: item._id,
                        productColorItem:
                          item.productColorItem._id,
                        address: order.address?._id,
                        productReview: item.reviews[0],
                      })
                    }
                  >
                    Review
                  </Button>

                  {!isOrderDelivered && (
                    <span className="text-[10px] text-gray-400">
                      Review available after delivery
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            {allItemsCancelled ? (
              <p className="font-semibold text-red-600 text-sm">
                Order Cancelled
              </p>
            ) : (
              <p className="font-semibold text-lg">
                ₹{order.totalPayableAmount.toLocaleString()}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => setSelectedOrder(order)}
              >
                View Details
              </Button>

              {order.orderStatus === "Active" &&
                !isOrderDelivered &&
                !allItemsCancelled && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs"
                    disabled={isLoading}
                    onClick={() => setCancelOrderId(order._id)}
                  >
                    Cancel
                  </Button>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default OrderCard;
