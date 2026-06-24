import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  Search,
  ShieldAlert,
  Radio,
  Users,
  Plus,
  ImageIcon,
  MessageCircleIcon,
} from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeletons";
import CreateGroupModal from "./CreateGroupModal";
import { checkIsOnline, formatLatestMessagePreview } from "../lib/utils";

export default function Sidebar() {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    isChatsLoading,
    getChats,
    setShowFriendsView,
    showFriendsView,
    subscribeToGlobalChatEvents,
    unsubscribeFromGlobalChatEvents,
    markMessageAsRead,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getChats();
    subscribeToGlobalChatEvents();
    return () => unsubscribeFromGlobalChatEvents();
  }, [getChats, subscribeToGlobalChatEvents, unsubscribeFromGlobalChatEvents]);

  if (isChatsLoading) {
    return <SidebarSkeleton />;
  }

  const filteredChats = (chats || []).filter((chat) =>
    chat.chatName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="w-72 h-full flex flex-col bg-base-900/40 border-r border-base-100">
        {/* Search system */}
        <div className="p-4 border-b border-base-100/30 flex items-center h-16">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-base-content/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="input input-sm w-full bg-base-900 pl-9 border-base-100/50 focus:input-primary text-xs font-mono text-base-content"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Communications list mapping */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-1 border-b border-base-100/30 pb-3">
            <button
              onClick={() => {
                const nextShowFriendsView = !showFriendsView;
                setShowFriendsView(nextShowFriendsView);
                if (nextShowFriendsView) {
                  setSelectedChat(null);
                }
              }}
              className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all font-mono text-left group
              ${
                showFriendsView
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-base-800/40 text-base-content/70 hover:text-base-content"
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors
              ${showFriendsView ? "bg-white/20 text-white" : "bg-base-800 text-base-content/70 group-hover:text-base-content"}`}
              >
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-wide">Friends</span>
            </button>
          </div>
          {/* === DYNAMIC CHATS === */}
          <div className="flex items-center justify-between px-2 pt-1 group/header">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-base-content/40 block">
              Chats
            </span>
            <div className="flex items-center gap-2">
              {/* Create Group Button */}
              <button
                onClick={() => {
                  const modal = document.getElementById(
                    "create_group_modal",
                  ) as HTMLDialogElement;
                  if (modal) modal.showModal();
                }}
                className="w-5 h-5 rounded-md bg-base-800/50 flex items-center justify-center text-base-content/50 hover:bg-success hover:text-white transition-all tooltip tooltip-top"
                data-tip="Create Group"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-base-100/30 rounded-xl text-center space-y-2 text-base-content/30 mt-2">
              <ShieldAlert className="w-5 h-5" />
              <p className="text-xs font-mono uppercase tracking-wider">
                No chat found
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChats.map((chat) => {
                const isSelected = selectedChat?._id === chat._id;
                const isDirectChat = !chat.isGroupChat;
                const isOnline =
                  isDirectChat &&
                  checkIsOnline(chat, authUser?._id, onlineUsers);

                const hasUnreadMessage = Boolean(
                  chat.latestMessage &&
                  chat.latestMessage.senderId !== authUser?._id &&
                  !chat.latestMessage.readBy?.includes(authUser?._id) &&
                  !isSelected,
                );

                return (
                  <button
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setShowFriendsView(false);
                      if (hasUnreadMessage && chat.latestMessage?._id) {
                        markMessageAsRead(chat.latestMessage._id, chat._id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all border font-mono text-left group
                    ${
                      isSelected
                        ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_10px_rgba(116,185,255,0.05)]"
                        : "border-transparent hover:bg-base-800/40 text-base-content/70 hover:text-base-content"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-xl bg-base-800 border overflow-hidden transition-transform group-hover:scale-105 ${isSelected ? "border-primary/50" : "border-base-100"}`}
                      >
                        <img
                          src={
                            chat.chatImage ||
                            "https://api.dicebear.com/7.x/bottts/svg?seed=" +
                              chat.chatName
                          }
                          alt={chat.chatName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isDirectChat && (
                        <span
                          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-base-900 ${isOnline ? "bg-success shadow-[0_0_8px_rgba(46,213,115,0.5)]" : "bg-base-600"}`}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p
                          className={`text-xs font-bold truncate tracking-wide ${hasUnreadMessage ? "text-primary" : "text-base-content"}`}
                        >
                          {chat.chatName}
                        </p>

                        {/* Glowing dot pushed to the right edge */}
                        {hasUnreadMessage && (
                          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(116,185,255,0.8)] animate-pulse shrink-0"></span>
                        )}
                      </div>

                      <p
                        className={`text-[10px] truncate mt-0.5 flex items-center gap-1 ${hasUnreadMessage ? "text-primary/90 font-bold" : isSelected ? "text-primary/70" : "text-base-content/50 group-hover:text-base-content/70"}`}
                      >
                        {chat.latestMessage?.image ? (
                          <ImageIcon className="w-3 h-3 shrink-0" />
                        ) : (
                          <MessageCircleIcon className="w-3 h-3 shrink-0" />
                        )}
                        <span className="truncate">
                          {formatLatestMessagePreview(chat, authUser?._id)}
                        </span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Operational owner footer panel */}
        <div className="p-3 bg-base-950/40 border-t border-base-100/30 flex items-center justify-between h-16">
          <div className="flex items-center gap-3 min-w-0">
            <div className="avatar">
              <div className="w-9 h-9 rounded-xl border border-base-100 bg-base-800 overflow-hidden">
                <img
                  src={
                    authUser?.avatar ||
                    "https://api.dicebear.com/7.x/bottts/svg?seed=squad"
                  }
                  alt="My Profile"
                />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold font-mono text-base-content truncate">
                {authUser?.username || "Operator"}
              </h4>
              <div className="flex items-center gap-1 -mt-0.5">
                <Radio className="w-2.5 h-2.5 text-success animate-pulse" />
                <span className="text-[9px] font-mono text-success uppercase tracking-wider block">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateGroupModal />
    </>
  );
}
