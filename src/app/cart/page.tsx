"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPinHouse, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import CartItemCard from "@/components/Cart/CartItemCard";
import AddressForm from "@/components/Address/AddressForm";
import Address from "@/components/Address/Address";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  useCreateOrderCODMutation,
  useCreateOrderOnlineMutation,
  useCreateRazorpayPaymentMutation,
  useGetAddressByIdQuery,
  useGetAllAddressQuery,
  useGetCartItemsQuery,
  useGetChargesQuery,
} from "@/services/apiSlice";

import CartItemSkeleton from "@/components/Cart/CartItemSkeleton";
import ErrorState from "@/components/ErrorState";
import OrderProcessingLoader from "@/components/Loaders/OrderProcessingLoader";

export default function Page() {
  const router = useRouter();

  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isAddressContainerOpen, setIsAddressContainerOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | null>(
    null
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [warning, setWarning] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { addressId } = useSelector((state: any) => state.stateManage);

  useEffect(() => {
    const id = localStorage.getItem("selectedAddressId");
    setSelectedAddressId(id);
  }, []);

  /* -------------------- API HOOKS -------------------- */

  const {
    data: addressById,
    isLoading: isAddressByIdLoading,
    isError: isAddressError,
  } = useGetAddressByIdQuery(addressId || selectedAddressId, {
    skip: !addressId && !selectedAddressId,
  });

  const { data: address } = useGetAllAddressQuery();

  const {
    data: cartItems,
    isLoading: isCartItemLoading,
    isError: isCartError,
  } = useGetCartItemsQuery();

  const {
    data: charges,
    isLoading: isChargesLoading,
    isError: isChargesError,
  } = useGetChargesQuery();

  const [createOrderCOD] = useCreateOrderCODMutation();
  const [createRazorpayPayment] = useCreateRazorpayPaymentMutation();
  const [createOrderOnline] = useCreateOrderOnlineMutation();

  /* -------------------- ORDER HANDLERS -------------------- */

  const handleOrder = () => {
    if (!paymentMethod) return setWarning("Please select a payment method");
    paymentMethod === "cod" ? codOrderAPI() : razorpayOrderAPI();
  };

  const codOrderAPI = async () => {
    try {
      setIsProcessing(true);

      const res = await createOrderCOD({
        addressId: addressById?.data?._id,
        chargesId: charges?.data?._id,
        cartItemIds: cartItems?.data?.map((i: any) => i._id),
      }).unwrap();

      router.push(`/orders`);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const razorpayOrderAPI = async () => {
    const res = await createRazorpayPayment({
      totalAmount: charges?.data?.totalPayableAmount,
    });

    if (res?.data?.data?.order) {
      openRazorpayCheckOut(res.data.data.order);
    }
  };

  const openRazorpayCheckOut = (order: any) => {
    if (!window.Razorpay) return alert("Razorpay SDK not loaded!");

    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "SportZone",
      description: "Order Payment",
      handler: verifyPaymentAndCreateOrder,
      theme: { color: "#3399cc" },
    });

    rzp.open();
  };

  const verifyPaymentAndCreateOrder = async (response: any) => {
    try {
      setIsProcessing(true);

      const res = await createOrderOnline({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        addressId: addressById?.data?._id,
        chargesId: charges?.data?._id,
        cartItemIds: cartItems?.data?.map((i: any) => i._id),
      }).unwrap();

      router.push(`/orders`);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <>
      {isProcessing && <OrderProcessingLoader />}

      {isAddressFormOpen && address?.data?.length === 0 && (
        <AddressForm handleClose={() => setIsAddressFormOpen(false)} />
      )}

      {isAddressContainerOpen && (
        <Address setIsAddressContainerOpen={setIsAddressContainerOpen} />
      )}

      <div className="px-4 md:px-16">
        {/* HEADER */}
        {/* <div className="flex justify-between items-center border-b pb-4 mb-4">
          <Link href="/" className="flex items-center gap-1 text-2xl">
            <Store />
            <span className="hidden md:block">Back to shop</span>
          </Link>
          <h1 className="text-4xl font-bold">SportZone</h1>
          <Button variant="ghost">
            <User />
          </Button>
        </div> */}

        {isCartError && (
          <ErrorState title="You are not authorized please login" />
        )}

        {!isCartItemLoading && cartItems?.data?.length === 0 && (
          <div className="flex flex-col items-center text-center mt-10">
            <Image
              src="/image/19197384.jpg"
              alt="Empty Cart"
              width={220}
              height={220}
            />
            <h2 className="text-xl font-semibold">No products available</h2>
            <Link href="/">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          </div>
        )}

        {cartItems?.data?.length > 0 && (
          <div className="flex flex-col md:flex-row gap-16">
            {/* LEFT */}
            <div className="flex-1">
              <h1 className="text-3xl border-b">Delivery Address</h1>

              {isAddressByIdLoading && (
                <div className="border p-6 mt-4 rounded-xl space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-400" />
                  <Skeleton className="h-4 w-48 bg-gray-400" />
                  <Skeleton className="h-4 w-64 bg-gray-400" />
                </div>
              )}

              {isAddressError && (
                <p className="text-red-600 mt-4">Failed to load address</p>
              )}

              {addressById?.data && (
                <div className="border p-4 mt-4 rounded-xl shadow">
                  <div className="flex gap-1 text-gray-600">
                    <MapPinHouse />
                    <p className="font-bold">{addressById.data.addressName}</p>
                  </div>
                  <p>{addressById.data.name}</p>
                  <p>{addressById.data.address}</p>
                  <p>
                    {addressById.data.city}, {addressById.data.state}
                  </p>
                  <p>Phone: {addressById.data.phone}</p>

                  <Button
                    className="mt-2"
                    onClick={() => setIsAddressContainerOpen(true)}
                  >
                    Change Address
                  </Button>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {isCartItemLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <CartItemSkeleton key={i} />
                  ))}

                {!isCartItemLoading &&
                  cartItems?.data?.map((item: any) => (
                    <CartItemCard key={item._id} item={item} />
                  ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1 border p-6 rounded-2xl shadow bg-white">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              {isChargesLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full bg-gray-400" />
                ))}

              {isChargesError && (
                <p className="text-red-600">Failed to calculate charges</p>
              )}

              {!isChargesLoading && charges?.data && (
                <>
                  <div className="flex justify-between">
                    <p>Total MRP</p>
                    <p>₹{charges.data.totalPrice.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <p>Discount</p>
                    <p>
                      -₹{charges.data.discountPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Delivery</p>
                    <p>
                      ₹{charges.data.deliveryCharge.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Handling</p>
                    <p>
                      ₹{charges.data.handlingCharge.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Tax</p>
                    <p>₹{charges.data.tax.toLocaleString("en-IN")}</p>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <p>Total Payable</p>
                    <p>
                      ₹{charges.data.totalPayableAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </>
              )}

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full p-4 border rounded-xl ${
                    paymentMethod === "cod" && "border-black bg-gray-100"
                  }`}
                >
                  Cash on Delivery
                </button>

                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full p-4 border rounded-xl ${
                    paymentMethod === "online" && "border-black bg-gray-100"
                  }`}
                >
                  Online Payment
                </button>

                {warning && <p className="text-red-600">{warning}</p>}
              </div>

              <Button
                onClick={handleOrder}
                disabled={
                  isProcessing ||
                  isCartItemLoading ||
                  isChargesLoading ||
                  isAddressByIdLoading
                }
                className="w-full mt-8 py-4 text-lg"
              >
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
