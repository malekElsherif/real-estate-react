import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../../hooks/usechat";
import { usegetme } from "../../hooks/useUsers";

const btnPrimary = "no-underline rounded-xl bg-amber-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-900";

const Chat = () => {
  const { userId } = useParams<{ userId: string }>();
  const receiverId = Number(userId);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // بيانات المستخدم الحالي
  const { data: userData, isLoading: isUserLoading } = usegetme();
  const currentUserId = userData?.data.userId ?? null;

  const {
    messages,
    isLoading,
    isError,
    sendMessage,
    socketError,
    receiverOffline,
  } = useChat(receiverId);

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
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="font-medium text-rose-600">Invalid user ID</p>
      </div>
    );
  }

  if (isLoading || isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="font-medium text-rose-600">Failed to load conversation</p>
      </div>
    );
  }

  if (currentUserId === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="font-medium text-rose-600">
          Unable to identify current user
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-80px)] max-w-4xl flex-col overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm my-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-900 px-6 py-4">
        <div>
          <h1 className="text-base font-bold text-white">Chat Room</h1>
          <p className="text-xs text-stone-300">Talking with User #{receiverId}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <span className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
          Online
        </span>
      </div>

      {/* Connection status banner (offline / socket error) */}
      {(receiverOffline || socketError) && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-xs text-amber-700">
          {receiverOffline && "The other user is currently offline. "}
          {socketError && `Connection issue: ${socketError}`}
        </div>
      )}

      {/* Messages Area */}
      <div dir="ltr" className="flex-1 overflow-y-auto bg-stone-50 p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-2 rounded-2xl bg-stone-100 p-4">
              <svg className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-stone-600">No messages yet</p>
            <p className="mt-1 text-xs text-stone-400">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMine = Number(msg.senderId) === Number(currentUserId);

              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                      isMine
                        ? "bg-amber-800 text-white rounded-br-none"
                        : "bg-white text-stone-900 border border-stone-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                    <div
                      className={`mt-1.5 flex items-center justify-end text-[10px] ${
                        isMine ? "text-amber-100" : "text-stone-400"
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
      <div className="flex items-center gap-3 border-t border-stone-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          aria-label="Message input"
          className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-amber-800 focus:bg-white focus:ring-1 focus:ring-amber-800"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim()}
          aria-label="Send message"
          className={`cursor-pointer inline-flex items-center justify-center ${btnPrimary} disabled:cursor-not-allowed disabled:opacity-50`}
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
