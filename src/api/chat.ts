import api from "./axios";
import { socket } from "./socket";

// ==============================
// Types
// ==============================

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
}

// ==============================
// Get Conversation
// ==============================

export const getConversation = async (
  userId: number
): Promise<Message[]> => {
  const res = await api.get<Message[]>(
    `/messages/conversation/${userId}`
  );

  return res.data;
};

// ==============================
// Send Realtime Message
// ==============================

export const sendMessageRealtime = (
  receiverId: number,
  content: string
) => {
  if (!content.trim()) return;

  socket.emit("sendMessage", {
    receiverId,
    content: content.trim(),
  });
};
export const getconversations = () => {
  const res = api.get("/messages/conversations/")
  return res
};
