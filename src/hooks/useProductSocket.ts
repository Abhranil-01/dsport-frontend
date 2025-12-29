"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/lib/socket";
import { apiSlice } from "@/services/apiSlice";

export const useProductSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const onProductUpdate = (payload:any) => {
      if (!payload?.subcategoryId) return;

      dispatch(
        apiSlice.util.invalidateTags([
          { type: "Product", id: payload.subcategoryId },
        ])
      );
    };

    socket.on("PRODUCT_UPDATED", onProductUpdate);
    socket.on("PRODUCT_CREATED", onProductUpdate);
    socket.on("PRODUCT_DELETED", onProductUpdate);

    return () => {
      socket.off("PRODUCT_UPDATED", onProductUpdate);
      socket.off("PRODUCT_CREATED", onProductUpdate);
      socket.off("PRODUCT_DELETED", onProductUpdate);
    };
  }, [dispatch]);
};
