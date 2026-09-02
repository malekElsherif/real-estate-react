import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../../hooks/usechat";
import { usegetme } from "../../hooks/useUsers";

const Chat = () => {
  const { userId } = useParams<{ userId: string }>();
  const receiverId = Number(userId);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // بيانات المستخدم الحالي
  const { data: userData, isLoading: isUserLoading } = usegetme();
  // استخدام ?? بدل || عشان لو الـ id = 0 مايتحسبش falsy وميتستبدلش غلط
  const currentUserId = userData?.data.userId ?? null;
  console.log(userData)

  const {
    messages,
    isLoading,
    isError,
    sendMessage,
    socketError,
    receiverOffline,
  } = useChat(receiverId);
// console.log(messages)


  // التمرير التلقائي لأسفل الشات عند تغير الرسائل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (!receiverId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <p className="text-red-500 font-medium">Invalid user ID</p>
      </div>
    );
  }

  // منتظرين تحميل بيانات المحادثة أو بيانات المستخدم الحالي
  if (isLoading || isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#14213D]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <p className="text-red-500 font-medium">Failed to load conversation</p>
      </div>
    );
  }

  // لو تعذر تحديد هوية المستخدم الحالي، مفيش داعي نكمل ونعرض شات غلط
  if (currentUserId === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <p className="text-red-500 font-medium">
          Unable to identify current user
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-80px)] max-w-4xl flex-col shadow-lg rounded-xl overflow-hidden border border-[#14213D]/10 bg-[#FFFDF9] my-4">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#14213D]/10 bg-[#14213D] px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-white">Chat Room</h1>
          <p className="text-xs text-gray-300">Talking with User #{receiverId}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          <span className="h-2 w-2 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Online
        </span>
      </div>

      {/* Connection status banner (offline / socket error) */}
      {(receiverOffline || socketError) && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-700">
          {receiverOffline && "The other user is currently offline. "}
          {socketError && `Connection issue: ${socketError}`}
        </div>
      )}

      {/* Messages Area */}
      <div dir="ltr" className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#FFFDF9] to-[#f9f8f3]">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-gray-100 p-4 mb-2">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              // رسائلي تتحاذى يمين، رسائل الطرف التاني تتحاذى شمال
              const isMine = Number(msg.senderId) === Number(currentUserId);
              // console.log(isMine)

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                      isMine
                        ? "bg-[#14213D] text-white rounded-br-none"
                        : "bg-white text-[#14213D] border border-[#E4DFD3] rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                    <div
                      className={`mt-1.5 flex items-center justify-end text-[10px] ${
                        isMine ? "text-gray-300" : "text-gray-400"
                      }`}
                    >
                      <span>
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-3 border-t border-[#E4DFD3] bg-white p-4 shadow-md">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          aria-label="Message input"
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#14213D] focus:bg-white focus:ring-1 focus:ring-[#14213D]"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim()}
          aria-label="Send message"
          className="inline-flex items-center justify-center rounded-xl bg-[#14213D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B8863B] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
        >
          <span>Send</span>
          <svg className="ml-2 h-4 w-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default Chat;
