import { useState } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { Loader2, Search } from "lucide-react";

export default function AddFriendView() {
  const [searchUsername, setSearchUsername] = useState("");
  const { sendFriendRequest, isSendingFriendRequest } = useFriendStore();

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    const success = await sendFriendRequest(searchUsername.trim());

    if (success) {
      setSearchUsername("");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-bold font-mono text-base-content tracking-wide uppercase mb-2">
          Add Friend
        </h2>
        <p className="text-xs font-mono text-base-content/50 mb-6">
          You can add a friend with their exact username.
        </p>

        <form
          onSubmit={handleSendRequest}
          className={`flex items-center gap-3 bg-base-900 p-2 rounded-2xl border transition-colors
            ${isSendingFriendRequest ? "border-base-100/30 opacity-70" : "border-base-100/50 focus-within:border-primary/50"}`}
        >
          <Search className="w-4 h-4 ml-2 text-base-content/40" />
          <input
            type="text"
            placeholder="Enter exact username..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            disabled={isSendingFriendRequest}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm font-mono"
          />
          <button
            type="submit"
            disabled={!searchUsername.trim() || isSendingFriendRequest}
            className="btn btn-primary btn-sm rounded-xl font-mono uppercase tracking-widest text-[10px] min-w-[120px]"
          >
            {isSendingFriendRequest ? (
              <>
                <Loader2 className="size-5 animate-spin"></Loader2>
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
