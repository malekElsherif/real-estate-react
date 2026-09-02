import { useState } from "react";
import {
  MessageSquare,
  ChevronRight,
  User as UserIcon,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { usegetconversations } from "../../hooks/usechat";

const Punchholes = () => (
  <div className="flex w-8 shrink-0 flex-col items-center justify-center gap-2 bg-[#1E2A38] py-4">
    <span className="h-2 w-2 rounded-full bg-[#F6F1E7]" />
    <span className="h-2 w-2 rounded-full bg-[#F6F1E7]" />
  </div>
);

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
      <div className="flex min-h-[500px] items-center justify-center bg-[#F6F1E7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#A9793C]/25 border-t-[#A9793C]" />
          <span className="text-[11px] text-[#6B6459] [font-family:'IBM_Plex_Mono',monospace]">
            Loading chats...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#F6F1E7] p-6">
        <div className="w-full max-w-md border border-[#A6432C]/20 bg-white p-6 text-center">
          <MessageSquare className="mx-auto mb-3 text-[#A6432C]" size={22} />
          <h3 className="text-sm font-bold text-[#1E2A38]">Unable to load chats</h3>
          <p className="mt-1 text-xs text-[#6B6459]">Something went wrong while loading conversations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F1E7] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 border border-[#1E2A38] bg-[#1E2A38] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#F6F1E7] [font-family:'Fraunces',serif]">
              Your Chats
            </h1>
            <p className="mt-0.5 text-xs text-[#F6F1E7]/60">
              Conversations with owners and agents.
            </p>
          </div>

          {conversations.length > 0 && (
            <div className="flex h-10 items-center border border-[#A9793C]/40 bg-[#1E2A38] px-3 focus-within:border-[#A9793C]">
              <Search size={14} className="text-[#A9793C] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-40 bg-transparent text-xs text-[#F6F1E7] placeholder:text-[#F6F1E7]/40 focus:outline-none sm:w-48"
              />
            </div>
          )}
        </div>

        {/* LIST */}
        {conversations.length === 0 || filteredConversations.length === 0 ? (
          <div className="border border-dashed border-[#A9793C]/40 bg-white/50 p-12 text-center">
            <MessageSquare size={24} className="mx-auto text-[#A9793C] mb-3" strokeWidth={1.5} />
            <h2 className="text-base font-semibold text-[#1E2A38]">No conversations found</h2>
            <p className="mt-1 text-xs text-[#6B6459]">Your chat history will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredConversations.map((chat: any) => {
              const displayName = chat.userName || `User #${chat.userId}`;

              return (
                <Link
                  key={chat.id || chat.userId}
                  to={`/chat/${chat.userId}`}
                  className="group relative flex overflow-hidden border border-[#1E2A38]/15 bg-white transition hover:border-[#A9793C] hover:shadow-sm"
                >
                  <Punchholes />

                  <div className="flex flex-1 items-center gap-4 px-4 py-4">

                    {/* AVATAR */}
                    <div className="relative shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-[#1E2A38]/15 bg-[#EFE7D6]">
                        {chat.userAvatar ? (
                          <img
                            src={chat.userAvatar}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserIcon size={20} strokeWidth={1.5} className="text-[#1E2A38]" />
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#6F8862]" />
                    </div>

                    {/* CONTENT & HIGHLIGHTED LAST MESSAGE */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-xs font-bold text-[#1E2A38]">
                          {displayName}
                        </h3>
                        {chat.lastMessageTime && (
                          <span className="shrink-0 text-[10px] text-[#6B6459] [font-family:'IBM_Plex_Mono',monospace]">
                            {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      {/* تمييز آخر رسالة بخط أوضح ولون أغمق */}
                      <p className="mt-1 truncate text-xs font-medium text-[#1E2A38]/90 bg-[#F6F1E7]/50 px-2 py-1 rounded-[2px] border border-[#1E2A38]/5">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>

                    {/* ARROW */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center text-[#6B6459] transition group-hover:text-[#A9793C] group-hover:translate-x-0.5">
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
