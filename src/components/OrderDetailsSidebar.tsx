"use client";

import {
  X,
  CreditCard,
  Package,
  FileDown,
  CalendarX,
  Truck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OrderDetailsSidebar({ order, onClose }: any) {
  const router = useRouter();
console.log(order);

  if (!order) return null;

  const isCancelled =
    order.orderStatus === "CANCELLED" ||
    order.deliveryStatus === "CANCELLED";

  const cancellationDate = order.cancelledAt
    ? new Date(order.cancelledAt).toLocaleString("en-IN")
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end h-screen">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <div className="relative bg-white w-full sm:w-[60%] md:w-[45%] lg:w-[35%] 
                      h-full shadow-2xl z-50 overflow-y-auto rounded-l-2xl animate-slideIn">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              Invoice — Order #{order._id}
            </h2>
            <div className="text-xs text-gray-500 mt-1">
              Ordered on: {new Date(order.createdAt).toLocaleString("en-IN")}
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* ORDER SUMMARY */}
          <Card className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Package className="text-blue-600 h-4 w-4" />
                <span>Order Status: {order.orderStatus}</span>
              </div>
     <div className="flex items-center gap-3">
                <Truck className="text-blue-600 h-4 w-4" />
                <span>Delivery Status: {order.deliveryStatus}</span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="text-purple-600 h-4 w-4" />
                <span>Payment Mode: {order.paymentMode}</span>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="text-green-600 h-4 w-4" />
                <span>
                  Payment Status:{" "}
                  <span
                    className={
                      order.paymentStatus === "Paid"
                        ? "text-green-600 font-semibold"
                        : order.paymentStatus === "Pending"
                        ? "text-yellow-600 font-semibold"
                        : order.paymentStatus === "Failed"
                        ? "text-red-600 font-semibold"
                        : order.paymentStatus === "Refunded"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600"
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* CANCELLED INFO */}
          {isCancelled && (
            <Card className="border border-red-200 bg-red-50">
              <CardContent className="py-4 space-y-1 text-sm">
                <div className="flex items-center gap-2 text-red-600 font-semibold">
                  <CalendarX className="h-4 w-4" />
                  Order Cancelled
                </div>

                {cancellationDate && (
                  <p className="text-xs text-red-500">
                    Cancelled on: {cancellationDate}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* ORDER ITEMS */}
          <Card className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-base">Ordered Items</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {order.orderItems.map((item: any) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border-b pb-3 last:border-none"
                >
                  <Image
                    src={item.coverImages[0]?.url}
                    alt="product image"
                    width={70}
                    height={70}
                    className="rounded-md border object-cover cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/product/${item.product.productName}/${item.productColorItem?.productColorName.replaceAll(
                          " ",
                          ""
                        )}/${item.productColorItem?._id}`
                      )
                    }
                  />

                  <div className="flex-1">
                    <p className="font-bold text-gray-500 text-sm">
                      {item.product?.productName}
                    </p>
                    <p className="font-medium text-sm">
                      {item.productColorItem?.productColorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {item.size?.size}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-sm">
                    ₹{item.size?.offerPrice.toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* PAYMENT BREAKDOWN */}
          <Card className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-base">Payment Breakdown</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Price</span>
                <span>₹{order.totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount Price</span>
                <span>₹{order.discountPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>₹{order.deliveryCharge.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Handling Charge</span>
                <span>₹{order.handlingCharge.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{order.tax.toLocaleString()}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-base">
                <span>Total Payable</span>
                <span>₹{order.totalPayableAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* INVOICE BUTTON */}
          <div className="pt-2">
            {isCancelled ? (
              <div className="w-full rounded-xl border border-red-200 bg-red-50 p-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
                  <X className="h-5 w-5" />
                  Order Cancelled
                </div>
                <p className="text-xs text-red-500">
                  Invoice is not available for cancelled orders.
                </p>
                <Button
                  disabled
                  className="w-full bg-red-200 text-red-700 cursor-not-allowed rounded-xl"
                >
                  Invoice Unavailable
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 py-3"
                onClick={() => window.open(order.invoiceUrl, "_blank")}
              >
                <FileDown className="h-4 w-4" />
                Download Invoice
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
