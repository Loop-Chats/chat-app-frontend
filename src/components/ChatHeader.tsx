import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { X, ShieldAlert, Radio, Settings } from "lucide-react";
import EditGroupModal from "./EditGroupModal";

export default function ChatHeader() {
  const { selectedChat, setSelectedChat } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedChat) return null;

  const isOnline = onlineUsers?.includes(selectedChat._id);

  return (
    <>
      <div className="h-16 border-b border-base-100 bg-base-900/60 px-4 flex items-center justify-between backdrop-blur-sm">
        {/* LEFT SIDE: USER PROFILE INFO */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-base-800 border border-base-100 overflow-hidden">
              <img
                src={
                  selectedChat.chatImage ||
                  "https://api.dicebear.com/7.x/bottts/svg?seed=" +
                    selectedChat.chatName
                }
                alt={selectedChat.chatName}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-base-900
            ${isOnline ? "bg-success shadow-[0_0_8px_rgba(46,213,115,0.4)]" : "bg-base-600"}`}
            />
          </div>

          <div className="font-mono text-left">
            <h3 className="text-xs font-bold text-base-content tracking-wide">
              {selectedChat.chatName}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              {isOnline ? (
                <>
                  <Radio className="w-2.5 h-2.5 text-success animate-pulse" />
                  <span className="text-[9px] text-success uppercase tracking-wider font-bold">
                    Online
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-2.5 h-2.5 text-base-content/30" />
                  <span className="text-[9px] text-base-content/40 uppercase tracking-wider">
                    Offline
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: UTILITY ACTIONS */}
        <div className="flex items-center gap-2">
          {/* EDIT GROUP BUTTON - Wrapped in tooltip div */}
          {selectedChat.isGroupChat && (
            <div className="tooltip tooltip-bottom" data-tip="Node Settings">
              <button
                onClick={() => {
                  const modal = document.getElementById(
                    "edit_group_modal",
                  ) as HTMLDialogElement;
                  if (modal) modal.showModal();
                }}
                className="btn btn-ghost btn-sm btn-square hover:bg-base-800 text-base-content/40 hover:text-base-content transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* DISCONNECT BUTTON */}
          <div className="tooltip tooltip-left" data-tip="Disconnect">
            <button
              onClick={() => setSelectedChat(null)}
              className="btn btn-ghost btn-sm btn-square hover:bg-error/10 hover:text-error text-base-content/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <EditGroupModal />
    </>
  );
}
