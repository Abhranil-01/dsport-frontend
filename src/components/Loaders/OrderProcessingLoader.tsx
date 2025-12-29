"use client";

import { Loader2, PackageCheck } from "lucide-react";

export default function OrderProcessingLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[90%] max-w-md text-center animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-black animate-spin" />
            <PackageCheck className="w-7 h-7 text-green-600 absolute bottom-0 right-0 bg-white rounded-full p-1" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Processing Your Order
        </h2>
        <p className="text-gray-600">
          Please don’t refresh or go back.  
          We’re confirming your order securely.
        </p>

        <div className="mt-6 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-black animate-loader" />
        </div>
      </div>
    </div>
  );
}
