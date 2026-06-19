export default function PendingRequestsSkeleton() {
  const skeletonRows = Array(4).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Header Skeleton */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-base-100/50 pb-2">
            <div className="h-2.5 w-32 bg-base-800 rounded animate-pulse"></div>
            <div className="h-4 w-6 bg-primary/20 rounded-md animate-pulse"></div>
          </div>

          {/* List of Incoming Request Rows */}
          <div className="space-y-2">
            {skeletonRows.map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-2xl border border-base-100/30 bg-base-900/40 animate-pulse"
              >
                {/* Left Side: Avatar and Identity */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-base-800 flex-shrink-0"></div>

                  <div className="flex flex-col gap-2">
                    {/* Username placeholder */}
                    <div className="h-3.5 bg-base-800 rounded w-32 sm:w-40"></div>
                    {/* Subtitle placeholder */}
                    <div className="h-2.5 bg-base-850 rounded w-20"></div>
                  </div>
                </div>

                {/* Right Side: Action Utility Buttons (Accept / Reject) */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-base-800"></div>
                  <div className="w-9 h-9 rounded-xl bg-base-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
