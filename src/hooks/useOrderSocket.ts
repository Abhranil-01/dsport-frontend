"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { socket } from "@/lib/socket";
import { apiSlice, useGetUserQuery } from "@/services/apiSlice";

export const useOrderSocket = () => {
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetUserQuery();

  const userId = data?.user?._id;
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!isSuccess || !userId) return;

    if (!socket.connected) socket.connect();

    const join = () => {
      if (joinedRef.current) return;
      socket.emit("JOIN_USER", userId);
      joinedRef.current = true;
      console.log("🔌 Joined USER:", userId);
    };

    join();
    socket.on("connect", join);

    const onOrderUpdated = ({ orderId }: any) => {
      console.log("📦 ORDER_UPDATED:", orderId);

      dispatch(
        apiSlice.util.invalidateTags([
          { type: "Order", id: orderId },
          { type: "Order", id: "LIST" },
        ])
      );
    };

    socket.on("ORDER_UPDATED", onOrderUpdated);

    return () => {
      socket.off("ORDER_UPDATED", onOrderUpdated);
      socket.off("connect", join);

      if (joinedRef.current) {
        socket.emit("LEAVE_USER", userId);
        joinedRef.current = false;
      }
    };
  }, [dispatch, isSuccess, userId]);
};
