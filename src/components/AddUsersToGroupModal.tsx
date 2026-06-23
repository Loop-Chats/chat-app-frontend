import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import { UserPlus, X, Search } from "lucide-react";

const AddUsersToGroupModal = () => {
  const { authUser } = useAuthStore();
  const { selectedChat, addUserToGroupChat, isUpdatingGroupMembers } =
    useChatStore();
  const { friends, isFriendsLoading, getFriends } = useFriendStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const closeModal = () => {
    const modal = document.getElementById(
      "add_users_modal",
    ) as HTMLDialogElement;
    if (modal) modal.close();

    setTimeout(() => setSearchTerm(""), 200);
  };

  const availableFriends = friends.filter((friend) => {
    const isAlreadyInGroup = selectedChat?.users?.some(
      (u) => u._id === friend._id,
    );
    const matchesSearch = friend.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return !isAlreadyInGroup && matchesSearch;
  });

  const handleAddUser = async (friendId: string) => {
    if (!selectedChat || !authUser) return;

    await addUserToGroupChat({
      userId: authUser._id,
      chatId: selectedChat._id,
      newUserId: friendId,
    });
  };

  return (
    <dialog id="add_users_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-base-900 border border-base-100 p-0 overflow-hidden flex flex-col max-h-[85vh]">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-base-100/50 flex items-center justify-between bg-base-900/80 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="font-mono font-bold text-base-content tracking-wide">
              Recruit Operators
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost text-base-content/50 hover:text-base-content"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 pb-6 pt-4 flex flex-col flex-1 min-h-0">
          {/* Search Bar */}
          <div className="relative mb-4 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search active links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-sm w-full bg-base-950 pl-9 border-base-100/30 focus:border-primary text-xs font-mono transition-colors"
            />
          </div>

          {/* Dynamic Friends List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {isFriendsLoading ? (
              <div className="flex justify-center p-4">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            ) : availableFriends.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-base-100/50 rounded-xl text-base-content/40 text-xs font-mono uppercase tracking-wider">
                {searchTerm
                  ? "No matching personnel found."
                  : "No available personnel to recruit."}
              </div>
            ) : (
              availableFriends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between p-2 pr-4 rounded-xl bg-base-950/50 border border-base-100/30 hover:bg-base-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-base-800 overflow-hidden border border-base-100/50">
                      <img
                        src={
                          friend.avatar ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.username}`
                        }
                        alt={friend.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold font-mono text-base-content">
                      {friend.username}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddUser(friend._id)}
                    disabled={isUpdatingGroupMembers}
                    className="btn btn-sm bg-primary/10 text-primary hover:bg-primary hover:text-white border-transparent text-[10px] font-mono tracking-widest uppercase transition-colors"
                  >
                    Recruit
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-base-100/50 bg-base-900/80 flex justify-end shrink-0">
          <button
            onClick={closeModal}
            className="btn btn-ghost font-mono text-xs uppercase tracking-wide text-base-content/60"
          >
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
};

export default AddUsersToGroupModal;
