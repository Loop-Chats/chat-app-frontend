import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { ShieldAlert, Shield, UserMinus } from "lucide-react";

const MembersListOptions = () => {
  const { authUser } = useAuthStore();
  const { selectedChat, removeUserFromTheGroupChat, isUpdatingGroupMembers } =
    useChatStore();

  if (!selectedChat || !selectedChat.users || !authUser?._id) return null;

  const viewerId = authUser._id;
  const isViewerAdmin = selectedChat.groupAdmin === viewerId;

  return (
    <div className="flex-1 px-8">
      {/* HEADER */}
      <div className="mb-4 border-b border-base-100/50 pb-2">
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-base-content/40 block">
          Active Roster
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-base-content/60">
          {selectedChat.users.length} Operators in this node
        </span>
      </div>

      {/* ROSTER LIST */}
      <div className="space-y-2">
        {selectedChat.users.map((member) => {
          const isMemberAdmin = selectedChat.groupAdmin === member._id;
          const isSelf = member._id === authUser?._id;

          return (
            <div
              key={member._id}
              // Added 'group' class for hover state, and changed padding to p-2 pr-4
              className="group flex items-center justify-between rounded-xl bg-base-950/50 border border-base-100/30 hover:bg-base-900/50 transition-colors"
            >
              {/* LEFT SIDE: Avatar & Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-base-800 overflow-hidden border border-base-100/50">
                  <img
                    src={
                      member.avatar ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${member.username}`
                    }
                    alt={member.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold font-mono text-base-content flex items-center gap-1.5">
                    {member.username}
                    {isSelf && (
                      <span className="text-[9px] bg-primary/20 text-primary px-1 rounded-sm">
                        YOU
                      </span>
                    )}
                    {isMemberAdmin && (
                      <ShieldAlert className="w-3.5 h-3.5 text-warning" />
                    )}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider ${isMemberAdmin ? "text-warning/70" : "text-base-content/40"}`}
                  >
                    {isMemberAdmin ? "Node Admin" : "Operator"}
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE: Admin Actions */}
              {isViewerAdmin && !isSelf && (
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity lg:opacity-100">
                  {/* MAKE ADMIN BUTTON - Wrapped in tooltip div */}
                  {!isMemberAdmin && (
                    <div
                      className="tooltip tooltip-top"
                      data-tip="Transfer Admin Rights"
                    >
                      <button
                        disabled={isUpdatingGroupMembers}
                        onClick={() =>
                          console.log(
                            "TODO: Implement makeAdmin function for",
                            member._id,
                          )
                        }
                        className="btn btn-square btn-sm bg-warning/10 text-warning hover:bg-warning hover:text-warning-content border-transparent transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* KICK BUTTON - Wrapped in tooltip div */}
                  <div
                    className="tooltip tooltip-top"
                    data-tip="Discharge Operator"
                  >
                    <button
                      disabled={isUpdatingGroupMembers}
                      onClick={() =>
                        removeUserFromTheGroupChat({
                          userId: viewerId,
                          chatId: selectedChat._id,
                          removeUserId: member._id,
                        })
                      }
                      className="btn btn-square btn-sm bg-error/10 text-error hover:bg-error hover:text-white border-transparent transition-colors"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembersListOptions;
