import { useState } from "react";
import {
  MessageSquare,
  ChevronRight,
  User as UserIcon,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usegetconversations } from "../../hooks/usechat";

const MYChatsList = () => {
  const { data, isLoading, isError } = usegetconversations();
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = data?.data || [];

  const filteredConversations = conversations.filter((chat: any) => {
    const displayName = chat.userName || `User #${chat.userId}`;
    const lastMsg = chat.lastMessage || "";
    return (
      displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-amber-800" />
          <span className="text-xs text-stone-500">
            Loading chats...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-stone-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-sm">
          <MessageSquare className="mx-auto mb-3 text-rose-600" size={22} />
          <h3 className="text-sm font-bold text-stone-900">Unable to load chats</h3>
          <p className="mt-1 text-xs text-stone-500">Something went wrong while loading conversations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-amber-800">
              Messages
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Your Chats
            </h1>
            <p className="mt-0.5 text-xs text-stone-500">
              Conversations with owners and agents.
            </p>
          </div>

          {conversations.length > 0 && (
            <div className="flex h-11 items-center rounded-xl border border-stone-200 bg-stone-50 px-3 transition focus-within:border-amber-800 focus-within:bg-white focus-within:ring-1 focus-within:ring-amber-800">
              <Search size={15} className="text-stone-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-40 bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none sm:w-48"
              />
            </div>
          )}
        </div>

        {/* LIST */}
        {conversations.length === 0 || filteredConversations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-200 bg-white p-12 text-center shadow-sm">
            <MessageSquare size={24} className="mx-auto text-amber-800 mb-3" strokeWidth={1.5} />
            <h2 className="text-base font-semibold text-stone-900">No conversations found</h2>
            <p className="mt-1 text-xs text-stone-500">Your chat history will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredConversations.map((chat: any) => {
              const displayName = chat.userName || `User #${chat.userId}`;

              return (
                <Link
                  key={chat.id || chat.userId}
                  to={`/chat/${chat.userId}`}
                  className="group relative flex overflow-hidden rounded-2xl border border-stone-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-800 hover:shadow-md"
                >
                  <div className="flex flex-1 items-center gap-4">

                    {/* AVATAR */}
                    <div className="relative shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-amber-50">
                        {chat.userAvatar ? (
                          <img
                            src={chat.userAvatar}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserIcon size={20} strokeWidth={1.5} className="text-amber-800" />
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-xs font-bold text-stone-900">
                          {displayName}
                        </h3>
                        {chat.lastMessageTime && (
                          <span className="shrink-0 text-[10px] text-stone-400">
                            {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs font-medium text-stone-600 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-100">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>

                    {/* ARROW */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center text-stone-400 transition group-hover:text-amber-800 group-hover:translate-x-0.5">
                      <ChevronRight size={16} />
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MYChatsList;
