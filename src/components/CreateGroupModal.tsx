import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { Camera, X, Users, Check } from "lucide-react";

const CreateGroupModal = () => {
  const { isCreatingChat, createChat } = useChatStore();
  const { friends, isFriendsLoading, getFriends } = useFriendStore();

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const defaultGroupImage = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
    groupName || "group-node",
  )}`;
  const previewImage = imagePreview || defaultGroupImage;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const closeModal = () => {
    const modal = document.getElementById(
      "create_group_modal",
    ) as HTMLDialogElement;
    if (modal) modal.close();

    setTimeout(() => {
      setGroupName("");
      setSelectedFriends([]);
      setImagePreview(null);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFriends.length < 2 || !groupName.trim() || isCreatingChat)
      return;

    const success = await createChat({
      otherUserIds: selectedFriends,
      chatName: groupName.trim(),
      chatImage: imagePreview || defaultGroupImage,
    });

    if (success) {
      closeModal();
    }
  };

  return (
    <dialog
      id="create_group_modal"
      className="modal modal-bottom sm:modal-middle z-[9999]"
    >
      <div className="modal-box bg-base-900 border border-base-100 p-0 overflow-hidden flex flex-col max-h-[85vh] z-50">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-base-100/50 flex items-center justify-between bg-base-900/80 backdrop-blur z-10 overflow-visible">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-mono font-bold text-base-content tracking-wide">
              Establish Group Node
            </h3>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="btn btn-sm btn-circle btn-ghost text-base-content/50 hover:text-base-content"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form
            id="create-group-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Image Upload UI */}
            <div className="flex flex-col items-center gap-3">
              <label className="relative cursor-pointer group border border-base-100/20 rounded-full p-1">
                <div
                  className={`w-24 h-24 rounded-full border-2 overflow-hidden flex items-center justify-center transition-all duration-200
                  ${imagePreview ? "border-primary" : "border-dashed border-base-100 group-hover:border-primary/50 bg-base-800"}`}
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <span className="text-[10px] font-mono uppercase tracking-widest text-base-content/40">
                {imagePreview ? "Change Avatar" : "Upload Avatar"}
              </span>
            </div>

            {/* Group Name Input */}
            <div>
              <label className="label text-[10px] font-mono uppercase tracking-widest text-base-content/50 py-1">
                Group Designation
              </label>
              <input
                type="text"
                placeholder="e.g. Strike Team Alpha"
                className="input input-bordered w-full bg-base-950 focus:border-primary text-sm font-mono"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            {/* Friend Selection List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label text-[10px] font-mono uppercase tracking-widest text-base-content/50 py-1">
                  Select Operators
                </label>
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest ${selectedFriends.length >= 2 ? "text-success" : "text-error"}`}
                >
                  {selectedFriends.length} Selected (Min 2)
                </span>
              </div>

              {isFriendsLoading ? (
                <div className="flex justify-center p-4">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center p-4 border border-dashed border-base-100 rounded-xl text-base-content/40 text-xs font-mono">
                  No active links found.
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar border border-base-100/30 p-1 rounded-xl bg-base-950">
                  {friends.map((friend) => {
                    const isSelected = selectedFriends.includes(friend._id);
                    return (
                      <div
                        key={friend._id}
                        onClick={() => toggleFriend(friend._id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                          ${isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-base-800/50 border border-transparent"}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-base-800 overflow-hidden flex-shrink-0">
                            <img
                              src={
                                friend.avatar ||
                                `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.username}`
                              }
                              alt={friend.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-base-content">
                            {friend.username}
                          </span>
                        </div>

                        {/* Checkbox indicator */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors
                          ${isSelected ? "bg-primary border-primary text-white" : "border-base-100/50 text-transparent"}`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-base-100/50 bg-base-900/80 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={closeModal}
            className="btn btn-ghost font-mono text-xs uppercase tracking-wide text-base-content/60 hover:text-error hover:bg-error/10"
          >
            Abort
          </button>

          <button
            type="submit"
            form="create-group-form"
            disabled={
              selectedFriends.length < 2 || !groupName.trim() || isCreatingChat
            }
            className={`btn btn-primary font-mono text-xs uppercase tracking-widest text-white ${
              selectedFriends.length < 2 || !groupName.trim() || isCreatingChat
                ? ""
                : "shadow-lg shadow-primary/20"
            }`}
          >
            {isCreatingChat ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Create Group"
            )}
          </button>
        </div>
      </div>

      {/* BACKDROP - Closes modal when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
};

export default CreateGroupModal;
