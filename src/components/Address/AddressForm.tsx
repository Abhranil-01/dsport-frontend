"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { useAddAddressMutation } from "@/services/apiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAddressId } from "@/services/stateManageSlice";
const formSchema = z.object({
  name: z.string(),
  phone: z.string().min(10, "Phone number must be 10 digits"),
  altPhone: z.string().optional(),
  email: z.string().email("Invalid email"),
  address: z.string(),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  state: z.string(),
  city: z.string(),
  addressName: z.string(), // home/office/etc
});

const AddressForm = ({ handleClose, address }: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: address
      ? {
          ...address,
          phone: String(address.phone || ""),
          altPhone: String(address.altPhone || ""),
          pincode: String(address.pincode || ""),
        }
      : {
          name: "",
          phone: "",
          altPhone: "",
          email: "",
          address: "",
          pincode: "",
          state: "",
          city: "",
          addressName: "",
        },
  });
const dispatch=useDispatch()
  const fetchLocation = async (pincode: string) => {
    if (pincode.length !== 6) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_LOCATION_URL}/${Number(pincode)}`
      );
      const data = res.data;
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        form.setValue("city", postOffice.District);
        form.setValue("state", postOffice.State);
      } else {
        form.setValue("city", "");
        form.setValue("state", "");
      }
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  };

  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useAddAddressMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (address) {
      const res = await updateAddress({ ...values, id: address._id });
      if (res.data.success) {
        toast.success("Address updated successfully");
        dispatch(setAddressId(res.data.data._id));
        localStorage.setItem("selectedAddressId", res.data.data._id);
      } else {
        toast.error("Failed to update address");
      }
      handleClose();
    } else {
      const res = await addAddress(values);
      console.log("Add Address Response:", res.data.success);
      if (res.data.success) {
        toast.success("Address added successfully");
        dispatch(setAddressId(res.data.data._id));
        localStorage.setItem("selectedAddressId", res.data.data._id);
      } else {
        toast.error("Failed to add address");
      }
      handleClose();
    }
  };
  return (
    <div className="fixed top-0 w-full h-screen z-9999 left-0 flex justify-end">
      {/* Overlay */}
      <div
        className="fixed inset-0  bg-black/30"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute right-0  lg:w-[45%] md:w-[45%] w-full h-full border-l border-gray-300 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="text-black p-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="font-bold text-lg">Add Delivery Address</h1>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-gray-100"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        {/* Form */}
        <div className="p-5 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Row 1 → Address Name + Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="addressName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Tag (Home / Office)</FormLabel>
                      <FormControl>
                        <Input placeholder="Home" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2 → Phone + Alt Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="altPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 3 → Email (full width) */}
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 4 → Address (full width) */}
              <div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="House no, road, area..."
                          className="h-25 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 5 → Pincode + City + State */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="700123"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            const pin = e.target.value;

                            if (pin.length === 6) {
                              fetchLocation(pin);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Kolkata" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="West Bengal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button className="w-full mt-3" type="submit">
                Save Address
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
