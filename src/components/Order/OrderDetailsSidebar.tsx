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
import { useGetOrderByIdQuery } from "@/services/apiSlice";
import OrderSideBarSkeleton from "./OrderSideBarSkeleton";

export default function OrderDetailsSidebar({ orderId, onClose }: any) {
  const router = useRouter();

  const { data: response, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const order = response?.data;

  /* ------------------ GUARDS ------------------ */
  if (isError) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="bg-white w-[35%] h-full flex items-center justify-center">
          Failed to load order
        </div>
      </div>
    );
  }

  if (isLoading || !order) {
    return <OrderSideBarSkeleton />;
  }

  /* ------------------ DERIVED STATE ------------------ */
  const isOrderCancelled =
    order.orderStatus === "Cancelled" || order.deliveryStatus === "Cancelled";

  const canDownloadInvoice =
    !isOrderCancelled && order.invoiceStatus === "READY" && !!order.invoiceUrl;

  const cancellationDate = order.cancelledAt
    ? new Date(order.cancelledAt).toLocaleString("en-IN")
    : null;

  /* ------------------ UI ------------------ */
  return (
    <div className="fixed inset-0 z-50 flex justify-end h-screen">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <div
        className="relative bg-white w-full sm:w-[60%] md:w-[45%] lg:w-[35%]
        h-full shadow-2xl z-50 overflow-y-auto rounded-l-2xl animate-slideIn"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              Invoice — Order #{order._id}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Ordered on: {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* ORDER SUMMARY */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <Row
                icon={<Package />}
                label="Order Status"
                value={order.orderStatus}
              />
              <Row
                icon={<Truck />}
                label="Delivery Status"
                value={order.deliveryStatus}
              />
              <Row
                icon={<CreditCard />}
                label="Payment Mode"
                value={order.paymentMode}
              />
              <Row
                icon={<CreditCard />}
                label="Payment Status"
                value={order.paymentStatus}
              />
            </CardContent>
          </Card>

          {/* CANCELLED INFO */}
          {isOrderCancelled && (
            <Card className="border-red-200 bg-red-50">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ordered Items</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {order.orderItems.map((item: any) => (
                <div
                  key={item._id}
                  className="flex gap-4 border-b pb-3 last:border-none"
                >
                  <Image
                    src={item.coverImages?.[0]?.url}
                    alt="product"
                    width={70}
                    height={70}
                    className="rounded-md border cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/product/${
                          item.product.productName
                        }/${item.productColorItem.productColorName.replaceAll(
                          " ",
                          ""
                        )}/${item.productColorItem._id}`
                      )
                    }
                  />

                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-600">
                      {item.product.productName}
                    </p>
                    <p className="text-sm">
                      {item.productColorItem.productColorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {item.size?.size} | Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-sm">
                    ₹{item.size?.offerPrice?.toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* PAYMENT BREAKDOWN */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Breakdown</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <Amount label="Total Price" value={order.totalPrice} />
              <Amount label="Discount" value={order.discountPrice} />
              <Amount label="Delivery" value={order.deliveryCharge} />
              <Amount label="Handling" value={order.handlingCharge} />
              <Amount label="Tax" value={order.tax} />
              <hr />
              <Amount
                label="Total Payable"
                value={order.totalPayableAmount}
                bold
              />
            </CardContent>
          </Card>

          {/* INVOICE */}
          <Button
            disabled={!canDownloadInvoice}
            onClick={() => window.open(order.invoiceUrl, "_blank")}
            className="w-full py-3 rounded-xl font-semibold"
          >
            <FileDown className="h-4 w-4 mr-2" />

            {isOrderCancelled
              ? "Invoice not available (Order Cancelled)"
              : order.invoiceStatus === "READY"
              ? "Download Invoice"
              : "Invoice Processing"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- HELPERS ---------- */

function Row({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-blue-600">{icon}</span>
      <span>
        {label}: <b>{value}</b>
      </span>
    </div>
  );
}

function Amount({ label, value, bold = false }: any) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "font-semibold text-base" : ""
      }`}
    >
      <span>{label}</span>
      <span>₹{value?.toLocaleString()}</span>
    </div>
  );
}
