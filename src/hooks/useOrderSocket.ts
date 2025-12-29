"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/lib/socket";
import { apiSlice, useGetUserQuery } from "@/services/apiSlice";

export const useOrderSocket = () => {
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetUserQuery();

  const userId = data?.user?._id; // ✅ FIXED

  useEffect(() => {
    if (!isSuccess || !userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const joinRoom = () => {
      socket.emit("JOIN_USER", userId);
    };

    joinRoom();
    socket.on("connect", joinRoom);

    const onOrderUpdate = (payload: any) => {
      console.log("📦 USER ORDER_UPDATED:", payload);

      dispatch(
        apiSlice.util.invalidateTags([
          { type: "Order", id: payload.orderId },
          { type: "Order", id: "LIST" },
        ])
      );
    };

    socket.on("ORDER_UPDATED", onOrderUpdate);

    return () => {
      socket.off("ORDER_UPDATED", onOrderUpdate);
      socket.off("connect", joinRoom);
    };
  }, [dispatch, isSuccess, userId]);
};
