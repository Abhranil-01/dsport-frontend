"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, MoveDown, Trash } from "lucide-react";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import {
  useGetSingleColorWiseProductQuery,
  useUpdateCartMutation,
  useRemoveItemFromCartMutation,
} from "@/services/apiSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

function CartItemCard({ item }: any) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(
    item.productSizeAndStock[0]._id
  );
  const [quantity, setQuantity] = useState(item.quantity);
  const [open, setOpen] = useState(false);

  const [updateCart, { isLoading }] = useUpdateCartMutation();
  const [removeItemFromCart] = useRemoveItemFromCartMutation();

  const { data: productDetails } = useGetSingleColorWiseProductQuery({
    id: item.productItems[0]._id,
  });

  // ----------------------------
  // ORDERED SIZES
  // ----------------------------
  const orderedSizeDetails = useMemo(() => {
    const sizes = productDetails?.sizes || [];
    const matched = sizes.find((s: any) => s._id === selectedSize);
    const rest = sizes.filter((s: any) => s._id !== selectedSize);
    return matched ? [matched, ...rest] : rest;
  }, [productDetails?.sizes, selectedSize]);

  // ----------------------------
  // UPDATE SIZE
  // ----------------------------
  const handleUpdateSize = async (newSizeId: string) => {
    setSelectedSize(newSizeId);

    try {
      await updateCart({
        cartUpdateData: { productPriceAndSizeAndStockId: newSizeId },
        id: item._id,
      }).unwrap();
    } catch (error) {
      toast.error("Failed to update size. Try again.");
    }
  };

  // ----------------------------
  // UPDATE QUANTITY
  // ----------------------------
  const handleUpdateQuantity = async (newQty: number) => {
    if (newQty < 1) {
      toast.warning("Minimum quantity is 1");
      return;
    }
    if (newQty > 10) {
      toast.warning("Maximum 10 items allowed");
      return;
    }

    setQuantity(newQty);

    try {
      await updateCart({
        cartUpdateData: { quantity: newQty },
        id: item._id,
      }).unwrap();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // ----------------------------
  // DELETE CART ITEM
  // ----------------------------
  const handleDeleteItem = async () => {
    try {
      await removeItemFromCart(item._id).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };
    const handleNavigatetoSingleProductPage = () => {
    router.push(
      `/product/${
        productDetails.productName
      }/${productDetails.productColorName.replaceAll(" ", "")}/${
        productDetails._id
      }`
    );
  };

  return (
    <Card className="flex flex-col md:flex-row rounded-2xl w-full md:w-160 shadow-lg mt-8 relative overflow-hidden p-0">
      {/* Delete Button (Opens Popover) */}
      <Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      size="icon"
      variant="ghost"
      className="absolute top-2 right-2 cursor-pointer"
      onClick={() => setOpen(true)}
    >
      <Trash className="h-6 w-6 text-red-700" />
    </Button>
  </PopoverTrigger>

  <PopoverContent className="w-56 p-4">
    <p className="font-medium text-center mb-3">Delete this item?</p>

    <div className="flex justify-center gap-3">
      {/* CANCEL BUTTON */}
      <Button
        variant="outline"
        className="h-8 px-4"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>

      {/* DELETE BUTTON */}
      <Button
        variant="destructive"
        className="h-8 px-4"
        onClick={async () => {
          await handleDeleteItem();
          setOpen(false); // close popover
        }}
      >
        Delete
      </Button>
    </div>
  </PopoverContent>
</Popover>


      {/* Product Image */}
      <div className="w-full md:w-[40%]">
        <Image
          src={item.productItems[0].coverImages[0].url}
          alt={item.productItems[0].productColorName}
          width={500}
          height={500}
          className="w-full h-auto md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none cursor-pointer"
          onClick={handleNavigatetoSingleProductPage}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center gap-4 px-4 pb-6">
        <CardHeader className="p-0">
          <CardTitle>
            {item.productItems[0].product[0].productName}
          </CardTitle>
          <CardDescription className="text-base">
            {item.productItems[0].productColorName}
          </CardDescription>

          {/* Price */}
          <div className="text-xl flex gap-2 items-center mt-1">
            <p className="font-bold flex items-center text-green-700">
              <MoveDown className="h-4 w-4 mr-1" />
              <span>{item.productSizeAndStock[0].offerPercentage}%</span>
            </p>
            <p className="line-through text-gray-500">
              ₹{item.productSizeAndStock[0].actualPrice.toLocaleString("en-IN")}
            </p>
            <p className="font-bold text-black">
              ₹{item.productSizeAndStock[0].offerPrice.toLocaleString("en-IN")}
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex md:flex-row md:justify-between gap-6">
            {/* Size Selector */}
            <div className="flex items-center gap-2">
              <span>Size:</span>

              <NativeSelect
                disabled={isLoading}
                value={selectedSize}
                onChange={(e) => handleUpdateSize(e.target.value)}
                className="outline-0 border-0 focus:ring-0"
              >
                {orderedSizeDetails.map((sizeOption: any) => (
                  <NativeSelectOption key={sizeOption._id} value={sizeOption._id}>
                    {sizeOption.size}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            {/* Quantity Counter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-900">Qty:</label>

              <div className="relative flex items-center">
                <Button
                  disabled={isLoading || quantity === 1}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 h-6 w-6"
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                >
                  <Minus className="h-3 w-3 text-gray-600" />
                </Button>

                <Input
                  disabled={isLoading}
                  type="text"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= 10) setQuantity(val);
                  }}
                  className="text-center w-10 bg-transparent border-0"
                />

                <Button
                  disabled={isLoading || quantity === 10}
                  className="bg-gray-100 hover:bg-gray-200 border border-gray-300 h-6 w-6"
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                >
                  <Plus className="h-3 w-3 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="text-xl flex gap-2 items-center">
            <p>Total Price:</p>
            <p className="font-bold">₹{item.totalPrice.toLocaleString("en-IN")}</p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default CartItemCard;
