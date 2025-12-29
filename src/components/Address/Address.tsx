"use client";
import React, { useState, useEffect } from "react";

import { X } from "lucide-react";
import AddressCard from "./AddressCard";
import { Button } from "../ui/button";
import { useGetAllAddressQuery } from "@/services/apiSlice";
import AddressForm from "./AddressForm";
import { useDispatch } from "react-redux";
import { setAddressId } from "@/services/stateManageSlice";

interface AddressProps {
  setIsAddressContainerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Address({ setIsAddressContainerOpen }: AddressProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const dispatch = useDispatch();

  const {
    data: address,
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = useGetAllAddressQuery();

  useEffect(() => {
    const savedAddressId = localStorage.getItem("selectedAddressId");
    if (savedAddressId) {
      setSelectedAddressId(savedAddressId);
    }
  }, []);

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    dispatch(setAddressId(id));
    localStorage.setItem("selectedAddressId", id);
  };

  const handleClose = () => {
    setIsAddressContainerOpen(false);
  };

  const hasAddress = address?.data && address.data.length > 0;

  return (
    <>
      {isAddressFormOpen && (
        <AddressForm handleClose={() => setIsAddressFormOpen(false)} />
      )}

      <div className="fixed top-0 w-full h-screen z-999 left-0 flex justify-end">
        <div
          className="fixed inset-0 bg-black/30"
          onClick={handleClose}
          aria-hidden="true"
        />

        <div className="absolute right-0 lg:w-[40%] md:w-[45%] w-full h-full border-l-2 border-gray-300 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="text-black p-4 flex items-center justify-between border-b border-gray-200">
            <h1 className="font-bold text-lg">Delivery Address</h1>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-gray-100"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Add Address Button (ONLY if not error) */}
          {!isAddressError && (
            <div className="p-4 border-b border-gray-200">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsAddressFormOpen(true)}
              >
                Add New Address
              </Button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Loading */}
            {isAddressLoading && (
              <p className="text-center text-gray-500">
                Loading addresses...
              </p>
            )}

            {/* Error → Please Login */}
            {isAddressError && (
              <div className="text-center text-red-600 font-medium mt-10">
                Please login to manage your addresses
              </div>
            )}

            {/* No Address */}
            {!isAddressLoading && !isAddressError && !hasAddress && (
              <div className="text-center text-gray-600 mt-10">
                No address available. Please create one.
              </div>
            )}

            {/* Address List */}
            {!isAddressLoading && !isAddressError && hasAddress && (
              <div className="flex flex-col gap-4">
                {address.data.map((data: any) => (
                  <AddressCard
                    key={data._id}
                    id={data._id}
                    address={data}
                    isSelected={selectedAddressId === data._id}
                    onSelect={handleSelectAddress}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Address;
