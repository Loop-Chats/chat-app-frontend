import { useEffect, useState } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import FriendsWindowSkeleton from "./skeletons/FriendsWindowSkeleton";
import FriendsHeader from "./FriendsHeader";
import AddFriendsWindow from "./AddFriendsWindow";
import PendingWindow from "./PendingWindow";
import { MessageSquare, Phone, MoreVertical, UserMinus } from "lucide-react";
export default function FriendsWindow() {
  const { friends, getFriends, isFriendsLoading } = useFriendStore();
  const { onlineUsers } = useAuthStore();
  const { chats, createChat, setSelectedChat, setShowFriendsView } = useChatStore();
  const [activeTab, setActiveTab] = useState<"online" | "all" | "pending" | "add">("all");

  const handleStartMessage = async (friendId: string) => {
    const existingChat = chats.find((chat) => !chat.isGroupChat && chat.users.some((u) => u._id === friendId));

    if (existingChat) {
      setSelectedChat(existingChat);
      setShowFriendsView(false);
      return;
    }

    try {
      const chatData = await createChat({ otherUserIds: [friendId] });
      if (chatData) {
        setSelectedChat(chatData);
        setShowFriendsView(false);
      }
    } catch (error) {
      console.error("Failed to initialize comms link:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  if (isFriendsLoading) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-base-950/10">
        <FriendsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <FriendsWindowSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-base-950/10">
      <FriendsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "add" ? (
        <AddFriendsWindow />
      ) : activeTab === "pending" ? (
        <PendingWindow />
      ) : (
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-base-content/40 mb-4 border-b border-base-100/50 pb-2">
              All Friends — {friends.length}
            </div>

            {friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border border-dashed border-base-100/30 rounded-2xl text-center space-y-3 mt-4">
                <span className="text-4xl">📡</span>
                <p className="text-sm font-mono text-base-content/50 uppercase tracking-wider">No active links found. Try adding some friends!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => {
                  const isOnline = onlineUsers?.includes(friend._id);

                  return (
                    <div key={friend._id} className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border border-transparent hover:border-base-100/30 bg-transparent hover:bg-base-900/40 transition-all group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-base-800 border border-base-100 overflow-hidden group-hover:border-primary/30 transition-colors">
                            <img src={friend.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.username}`} alt={friend.username} className="w-full h-full object-cover" />
                          </div>

                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-base-900 ${isOnline ? "bg-success shadow-[0_0_8px_rgba(46,213,115,0.5)]" : "bg-base-600"}`}></span>
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold font-mono text-base-content tracking-wide truncate group-hover:text-primary transition-colors">{friend.username}</span>
                          <span className={`text-[11px] font-mono mt-0.5 truncate ${isOnline ? "text-success" : "text-base-content/40"}`}>{isOnline ? "Online Node" : "Offline"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <button onClick={() => handleStartMessage(friend._id)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-base-800/50 flex items-center justify-center text-base-content/50 hover:bg-primary hover:text-white hover:shadow-[0_0_15px_rgba(116,185,255,0.2)] transition-all tooltip tooltip-top" data-tip="Direct Message">
                          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-base-800/50 hidden sm:flex items-center justify-center text-base-content/50 hover:bg-success hover:text-white hover:shadow-[0_0_15px_rgba(46,213,115,0.2)] transition-all tooltip tooltip-top" data-tip="Voice Uplink">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <div className="dropdown dropdown-end">
                          <div tabIndex={0} role="button" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-base-800/50 flex items-center justify-center text-base-content/50 hover:bg-base-700 hover:text-base-content transition-all tooltip tooltip-top m-0" data-tip="More Options">
                            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>

                          <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 mt-2 shadow-2xl bg-base-900 border border-base-100/50 rounded-xl w-48 font-mono text-xs animate-in fade-in zoom-in-95 duration-200">
                            <li>
                              <button onClick={() => { /* remove friend action */ }} className="text-error hover:bg-error/10 hover:text-error active:bg-error/20 flex items-center gap-2 py-2.5 rounded-lg">
                                <UserMinus className="w-4 h-4" />
                                <span className="tracking-wide font-bold uppercase text-[10px]">Remove Link</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
