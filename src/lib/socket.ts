import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;

export const socket: Socket = io(SOCKET_URL, {
  path: "/socket.io",
  transports: ["polling", "websocket"], // ✅ DO NOT FORCE websocket
  withCredentials: true,
  autoConnect: true,
});
