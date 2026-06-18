import { Search } from "lucide-react";

export default function SidebarSkeleton() {
  const skeletonRows = Array(6).fill(null);

  return (
    <div className="w-72 h-full flex flex-col bg-base-900/40 border-r border-base-100">

      {/* 1. SEARCH BAR PLACEHOLDER */}
      <div className="p-4 border-b border-base-100/30 flex items-center h-16">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-base-content/20 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Loading tactical links..."
            className="input input-sm w-full bg-base-900/50 pl-9 border-base-100/30 text-xs font-mono opacity-40 cursor-not-allowed"
            disabled
          />
        </div>
      </div>

      {/* 2. SKELETON CHAT LIST (PULSING) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">

        {/* Category Header Placeholder */}
        <div className="px-2 mb-2 animate-pulse">
          <div className="h-3 bg-base-800 rounded w-28"></div>
        </div>

        {/* Dynamic Placeholder Rows */}
        <div className="space-y-2">
          {skeletonRows.map((_, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-2 border border-transparent rounded-xl animate-pulse"
            >
              {/* Avatar Box Placeholder */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-base-800"></div>
                {/* Tiny Status Dot Placeholder */}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-base-700 ring-2 ring-base-900"></span>
              </div>

              {/* Text Meta Placeholders */}
              <div className="flex-1 space-y-2">
                {/* Username bar */}
                <div className="h-3.5 bg-base-800 rounded w-2/3"></div>
                {/* Subtext status bar */}
                <div className="h-2.5 bg-base-850 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 3. FOOTER USER UNIT BADGE SKELETON */}
      <div className="p-3 bg-base-950/40 border-t border-base-100/30 flex items-center gap-3 h-16 animate-pulse">
        <div className="w-9 h-9 rounded-xl bg-base-800"></div>
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-base-800 rounded w-24"></div>
          <div className="h-2 bg-base-850 rounded w-16"></div>
        </div>
      </div>

    </div>
  );
}