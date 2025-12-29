"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/lib/socket";
import { apiSlice } from "@/services/apiSlice";

export const useSubCategorySocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const onSubCategoryChange = (payload:any) => {
      if (!payload?.categoryId) return;

      dispatch(
        apiSlice.util.invalidateTags([
          { type: "Subcategory", id: payload.categoryId },
        ])
      );
    };

    socket.on("SUBCATEGORY_CREATED", onSubCategoryChange);
    socket.on("SUBCATEGORY_UPDATED", onSubCategoryChange);
    socket.on("SUBCATEGORY_DELETED", onSubCategoryChange);

    return () => {
      socket.off("SUBCATEGORY_CREATED", onSubCategoryChange);
      socket.off("SUBCATEGORY_UPDATED", onSubCategoryChange);
      socket.off("SUBCATEGORY_DELETED", onSubCategoryChange);
    };
  }, [dispatch]);
};
