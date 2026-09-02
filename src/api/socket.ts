import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {

   autoConnect: false,
});

socket.on("connect", () => {

  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});
