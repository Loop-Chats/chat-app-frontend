import { useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import PendingRequestsSkeleton from "./skeletons/PendingWindowSkeleton";
import { Check, X } from "lucide-react";

export default function PendingWindow() {
  const {
    pendingRequests,
    isFriendRequestsLoading,
    getFriendRequests,
    isRespondingToRequest,
    respondToFriendRequest,
  } = useFriendStore();

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  if (isFriendRequestsLoading) {
    return <PendingRequestsSkeleton />;
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 border border-dashed rounded-2xl text-center text-sm font-mono text-base-content/50">
            No pending friend requests.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-base-content/40 mb-4 border-b border-base-100/50 pb-2 flex justify-between">
            <span>Incoming Requests</span>
            <span className="badge badge-primary badge-xs">
              {pendingRequests?.length || 0}
            </span>
          </div>

          {!pendingRequests || pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-base-100/30 rounded-2xl text-center space-y-3 mt-4">
              <span className="text-4xl">📥</span>
              <p className="text-sm font-mono text-base-content/50 uppercase tracking-wider">
                No pending requests
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border border-base-100/30 bg-base-900/40 hover:bg-base-900 transition-colors group"
                >
                  {/* Left Side: Sender Avatar and Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-base-800 border border-base-100 overflow-hidden flex-shrink-0">
                      <img
                        src={
                          req.sender?.avatar ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${req.sender?.username || req.sender}`
                        }
                        alt="sender avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold font-mono text-base-content truncate">
                        {req.sender?.username || "Unknown Operator"}
                      </span>
                      <span className="text-[10px] font-mono text-base-content/40 uppercase truncate mt-0.5">
                        Incoming Request
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Accept / Reject Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                      disabled={isRespondingToRequest}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center tooltip tooltip-top shadow-sm
                        ${
                          isRespondingToRequest
                            ? "bg-base-800 text-base-content/30 cursor-not-allowed"
                            : "bg-success/10 text-success hover:bg-success hover:text-white"
                        }`}
                      data-tip="Accept"
                      onClick={() =>
                        respondToFriendRequest({
                          requestId: req._id,
                          action: "accept",
                        })
                      }
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                      disabled={isRespondingToRequest}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center tooltip tooltip-top shadow-sm
                        ${
                          isRespondingToRequest
                            ? "bg-base-800 text-base-content/30 cursor-not-allowed"
                            : "bg-error/10 text-error hover:bg-error hover:text-white"
                        }`}
                      data-tip="Decline"
                      onClick={() =>
                        respondToFriendRequest({
                          requestId: req._id,
                          action: "reject",
                        })
                      }
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
