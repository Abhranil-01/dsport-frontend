// src/providers/SocketProvider.tsx
"use client";

import { useOrderSocket } from "@/hooks/useOrderSocket";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useOrderSocket();
  return <>{children}</>;
}
