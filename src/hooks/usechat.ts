import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getConversation,
  getconversations,
  sendMessageRealtime,
} from "../api/chat";

import type { Message } from "../api/chat";

import { socket } from "../api/socket";

export const useChat = (userId: number) => {
  const queryClient = useQueryClient();

  const isValidUserId = Number.isInteger(userId) && userId > 0;

  // =========================
  // LOCAL STATE FOR SOCKET EVENTS
  // =========================
  const [socketError, setSocketError] = useState<string | null>(null);
  const [receiverOffline, setReceiverOffline] = useState(false);

  // لو المستخدم فتح محادثة تانية (userId اتغير)، الحالة القديمة
  // (offline/error) بتاعة المحادثة السابقة مش لازم تفضل ظاهرة هنا
  useEffect(() => {
    setSocketError(null);
    setReceiverOffline(false);
  }, [userId]);

  // =========================
  // GET CONVERSATION
  // =========================

  const {
    data: messages ,
    isLoading,
    isError,
    error,
  } = useQuery<Message[]>({
    queryKey: ["conversation", userId],
    queryFn: () => getConversation(userId),
    enabled: isValidUserId,
  });

  // =========================
  // SHARED: ADD MESSAGE TO CACHE
  // (used by both "newMessage" and "messageSent" handlers,
  //  which previously had identical, duplicated bodies)
  // =========================

  const addMessageToCache = useCallback(
    (message: Message) => {
      if (!message) return;

      const belongsToConversation =
        Number(message.senderId) === userId ||
        Number(message.receiverId) === userId;

      if (!belongsToConversation) return;

      queryClient.setQueryData<Message[]>(
        ["conversation", userId],
        (oldMessages = []) => {
          const messagesArray = Array.isArray(oldMessages)
            ? oldMessages
            : [];

          const exists = messagesArray.some(
            (msg) => msg.id === message.id
          );

          if (exists) return messagesArray;

          return [...messagesArray, message];
        }
      );
    },
    [userId, queryClient]
  );

  // =========================
  // SOCKET CONNECTION LIFECYCLE
  // =========================

  useEffect(() => {
    if (!isValidUserId) return;

    socket.auth = {
      token: localStorage.getItem("token"),
    };

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [userId, isValidUserId]);

  // =========================
  // RECEIVE NEW MESSAGE
  // =========================

  useEffect(() => {
    if (!isValidUserId) return;

    const handleNewMessage = (message: Message) => {
      addMessageToCache(message);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [isValidUserId, addMessageToCache]);

  // =========================
  // MESSAGE SENT (ack from server)
  // =========================

  useEffect(() => {
    if (!isValidUserId) return;

    const handleMessageSent = (message: Message) => {
      addMessageToCache(message);
    };

    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("messageSent", handleMessageSent);
    };
  }, [isValidUserId, addMessageToCache]);

  // =========================
  // SOCKET ERROR
  // =========================

  useEffect(() => {
    const handleError = (data: { message?: string }) => {
      const msg = data?.message || "Unknown socket error";
      console.error("❌ Chat error:", msg);
      setSocketError(msg);
    };

    socket.on("errorMessage", handleError);

    return () => {
      socket.off("errorMessage", handleError);
    };
  }, []);

  // =========================
  // RECEIVER OFFLINE
  // =========================

  useEffect(() => {
    const handleOffline = (data: { receiverId: number }) => {
      if (Number(data.receiverId) === userId) {
        setReceiverOffline(true);
      }
    };

    socket.on("receiverOffline", handleOffline);

    return () => {
      socket.off("receiverOffline", handleOffline);
    };
  }, [userId]);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = useCallback(
    (content: string) => {
      const trimmedContent = content.trim();

      if (!trimmedContent) return;

      if (!isValidUserId) {
        console.error("❌ Invalid receiver ID:", userId);
        return;
      }

      if (!socket.connected) {
        console.error("❌ Socket is not connected");
        setSocketError("Socket is not connected");
        return;
      }

      // Reset stale offline/error state on a fresh send attempt
      setReceiverOffline(false);
      setSocketError(null);

      sendMessageRealtime(userId, trimmedContent);
    },
    [userId, isValidUserId]
  );


  return {
    messages: Array.isArray(messages) ? messages : [],
    isLoading,
    isError,
    error,
    sendMessage,
    socketError,
    receiverOffline,
  };
};

export const usegetconversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getconversations

  })
}
