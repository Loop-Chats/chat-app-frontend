import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTimestamp } from "../lib/utils";

export default function ChatWindow() {
  const { messages, selectedChat, isMessagesLoading, getMessages, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat?._id) {
      getMessages(selectedChat._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedChat?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-950/20">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-base-950/10">
      <ChatHeader />

      {/* CHAT MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => {
          const isMyMessage = message.senderId === authUser?._id;

          const sender = isMyMessage
            ? authUser
            : selectedChat?.users?.find((u) => u._id === message.senderId);

          const displayName = sender?.username || "Unknown Operator";
          const avatarSrc = sender?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}`;

          return (
            <div
              key={message._id}
              className={`chat ${isMyMessage ? "chat-end" : "chat-start"} animate-in fade-in duration-200`}
            >
              {/* User Avatar */}
              <div className="chat-image avatar">
                <div className="w-9 h-9 rounded-xl border border-base-100 bg-base-800 overflow-hidden shadow-md">
                  <img src={avatarSrc} alt="profile pic" />
                </div>
              </div>

              {/* Message Header (Username & Time Metadata) */}
              <div className="chat-header mb-1 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="font-bold text-base-content/80">
                  {isMyMessage ? "You" : sender?.username}
                </span>
                <time className="text-[10px] opacity-40">
                  {message.createdAt
                    ? formatMessageTimestamp(message.createdAt)
                    : ""}
                </time>
              </div>

              {/* Message Content Bubble (Clean Vertical Layout Stack) */}
              <div
                className={`chat-bubble flex flex-col gap-2 p-3 text-xs max-w-[75%] sm:max-w-[60%] shadow-md font-mono border
                ${
                  isMyMessage
                    ? "bg-primary text-white border-primary/20 shadow-[0_0_15px_rgba(116,185,255,0.05)]"
                    : "bg-base-900 text-base-content border-base-100/50"
                }`}
              >
                {message.image && (
                  <div className="relative rounded-lg overflow-hidden border border-black/10 max-w-full sm:max-w-xs">
                    <img
                      src={message.image}
                      alt="Attachment payload"
                      className="w-full h-auto max-h-60 object-cover hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
                    />
                  </div>
                )}

                {message.text && (
                  <p className="leading-relaxed break-words whitespace-pre-wrap text-left">
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
}
