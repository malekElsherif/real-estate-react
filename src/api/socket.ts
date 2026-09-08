import { io } from "socket.io-client";

export const socket = io("https://real-estate-nest-production.up.railway.app", {

   autoConnect: false,
});

socket.on("connect", () => {

  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});
