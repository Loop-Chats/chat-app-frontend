export default function FriendsWindowSkeleton() {
  const skeletonRows = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Bar Placeholder */}
        <div className="w-full h-12 rounded-xl bg-base-900/80 border border-base-100/50 animate-pulse"></div>

        {/* Section Header */}
        <div className="animate-pulse">
          <div className="h-3 bg-base-800 rounded w-48 mb-4"></div>
        </div>

        {/* List of Friend Rows */}
        <div className="space-y-3">
          {skeletonRows.map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border border-base-100/30 bg-base-900/40 animate-pulse"
            >
              {/* Left Side: Avatar and Identity */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-base-800"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-base-700 ring-2 ring-base-900"></div>
                </div>

                <div className="space-y-2.5">
                  <div className="h-3.5 bg-base-800 rounded w-32 sm:w-40"></div>
                  <div className="h-2.5 bg-base-850 rounded w-20 sm:w-24"></div>
                </div>
              </div>

              {/* Right Side: Action Utility Buttons */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-base-800 hidden sm:block"></div>
                <div className="w-9 h-9 rounded-xl bg-base-800"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
