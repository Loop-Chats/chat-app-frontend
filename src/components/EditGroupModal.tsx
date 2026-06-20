import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Camera, X, Settings, Lock } from "lucide-react";
import MembersListOptions from "./MembersListOptions";
import { useAuthStore } from "../store/useAuthStore";

const EditGroupModal = () => {
  const { authUser } = useAuthStore();
  const { selectedChat, isUpdatingGroupChatDetails, updateGroupChatDetails } =
    useChatStore();
  const [activeTab, setActiveTab] = useState<"overview" | "members">(
    "overview",
  );

  const isAdmin = selectedChat?.groupAdmin === authUser?._id;

  const [groupName, setGroupName] = useState(
    () => selectedChat?.chatName || "",
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    () => selectedChat?.chatImage || null,
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
  };

  const closeModal = () => {
    const modal = document.getElementById(
      "edit_group_modal",
    ) as HTMLDialogElement;
    if (modal) modal.close();

    setTimeout(() => {
      if (selectedChat) {
        setGroupName(selectedChat.chatName || "");
        setImagePreview(selectedChat.chatImage || null);
      }
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !groupName.trim() || isUpdatingGroupChatDetails)
      return;

    await updateGroupChatDetails({
      chatId: selectedChat._id,
      chatName: groupName.trim(),
      chatImage: imagePreview || "",
    });

    closeModal();
  };

  return (
    <dialog
      key={selectedChat?._id || "edit-group-modal"}
      id="edit_group_modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box bg-base-900 border border-base-100 p-0 overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-base-100/50 flex items-center justify-between bg-base-900/80 backdrop-blur z-10 overflow-visible">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-mono font-bold text-base-content tracking-wide flex items-center gap-2">
              Configure Node
              {!isAdmin && (
                <Lock className="w-3.5 h-3.5 text-base-content/40" />
              )}
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

        {/* TAB NAVIGATION */}
        <div className="flex w-full border-b border-base-100/50 bg-base-900/40">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-widest transition-colors
      ${activeTab === "overview" ? "border-b-2 border-primary text-primary" : "text-base-content/50 hover:bg-base-800/50 hover:text-base-content"}`}
          >
            Node Configuration
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-widest transition-colors
      ${activeTab === "members" ? "border-b-2 border-primary text-primary" : "text-base-content/50 hover:bg-base-800/50 hover:text-base-content"}`}
          >
            Operators ({selectedChat?.users?.length || 0})
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {activeTab === "overview" ? (
            <form
              id="edit-group-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Image Upload UI */}
              <div className="flex flex-col items-center gap-3">
                <label
                  className={`relative ${isAdmin ? "cursor-pointer group" : "cursor-default"}`}
                >
                  <div
                    className={`w-24 h-24 rounded-full border-2 overflow-hidden flex items-center justify-center transition-all duration-200
                  ${imagePreview ? "border-primary" : "border-dashed border-base-100 bg-base-800"} 
                  ${isAdmin && !imagePreview ? "group-hover:border-primary/50" : ""}
                  ${!isAdmin ? "opacity-70" : ""}`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera
                        className={`w-8 h-8 text-base-content/30 ${isAdmin && "group-hover:text-primary/50"} transition-colors`}
                      />
                    )}

                    {/* Only show the hover overlay if they are an admin */}
                    {isAdmin && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={!isAdmin}
                  />
                </label>
                <span className="text-[10px] font-mono uppercase tracking-widest text-base-content/40">
                  {isAdmin ? "Update Avatar" : "Node Avatar"}
                </span>
              </div>

              {/* Group Name Input */}
              <div>
                <label className="label text-[10px] font-mono uppercase tracking-widest text-base-content/50 py-1 flex justify-between">
                  <span>Node Designation</span>
                  {!isAdmin && (
                    <span className="text-warning/70">Admin Only</span>
                  )}
                </label>
                <input
                  type="text"
                  readOnly={!isAdmin}
                  className={`input input-bordered w-full bg-base-950 focus:border-primary text-sm font-mono
                    ${!isAdmin ? "opacity-60 cursor-not-allowed focus:border-base-100/50" : ""}`}
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
            </form>
          ) : (
            <MembersListOptions />
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-base-100/50 bg-base-900/80 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className={`btn btn-ghost font-mono text-xs uppercase tracking-wide
              ${isAdmin ? "text-base-content/60 hover:text-error hover:bg-error/10" : "text-base-content"}`}
          >
            {isAdmin ? "Abort" : "Close"}
          </button>

          {/* Only render Save button for Admins on the Overview Tab */}
          {isAdmin && activeTab === "overview" && (
            <button
              type="submit"
              form="edit-group-form"
              disabled={!groupName.trim() || isUpdatingGroupChatDetails}
              className="btn btn-primary font-mono text-xs uppercase tracking-widest text-white shadow-lg shadow-primary/20"
            >
              {isUpdatingGroupChatDetails ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Save Parameters"
              )}
            </button>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
};

export default EditGroupModal;
