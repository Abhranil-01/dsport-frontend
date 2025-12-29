"use client";
import React, { useState } from "react";

import { Edit, Home } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import AddressForm from "./AddressForm";

interface AddressCardProps {
  id: string;
  address: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function AddressCard({ id, address, isSelected, onSelect }: AddressCardProps) {
  console.log(address);
const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  return (
   <>
    {isAddressFormOpen && (
         <AddressForm handleClose={() => setIsAddressFormOpen(false)} address={address} />
       )}
     <Card
      onClick={() => onSelect(id)}
      className={`relative z-10 border-2 cursor-pointer transition-all duration-300 overflow-visible ${
        isSelected
          ? "border-blue-500 shadow-lg shadow-blue-200 bg-blue-50"
          : "border-gray-300 shadow-md hover:shadow-xl hover:border-gray-400"
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Home
            className={`h-4 w-4 ${
              isSelected ? "text-blue-600" : "text-gray-600"
            }`}
          />
          {address.addressName}
        </CardTitle>

        <CardDescription className="flex items-center justify-between text-gray-700 ">
          <div>
            <p className="font-medium truncate max-w-[80%] sm:max-w-[90%]">
              {address.address}
            </p>
            <p>
              {" "}
              {address.city}, {address.state} - {address.pincode}
            </p>{" "}
          </div>

          <Button
            variant="ghost" 
            size="icon"
            className="cursor-pointer hover:bg-gray-100"
            aria-label="Edit address"
            onClick={(e) => {
              e.stopPropagation();
              setIsAddressFormOpen(true);
            }}
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
        </CardDescription>
      </CardHeader>
    </Card>
   </>
  );
}

export default AddressCard;
