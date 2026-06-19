import { Users } from "lucide-react";

type TabKey = "online" | "all" | "pending" | "add";

interface FriendsHeaderProps {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
}

export default function FriendsHeader({
  activeTab,
  setActiveTab,
}: FriendsHeaderProps) {
  const getTabStyle = (tab: TabKey) => {
    const isActive = activeTab === tab;
    return `px-3 py-1.5 rounded-md transition-all duration-200 ${
      isActive
        ? "bg-base-700 text-base-content shadow-sm"
        : "text-base-content/50 hover:bg-base-800 hover:text-base-content"
    }`;
  };

  return (
    <div className="h-16 border-b border-base-100 bg-base-900/60 px-6 flex items-center justify-between backdrop-blur-sm shrink-0">
      {/* LEFT & MIDDLE: Branding and Standard Filters */}
      <div className="flex items-center gap-4">
        {/* Branding with Vertical Divider */}
        <div className="flex items-center gap-3 pr-4 border-r border-base-100/50">
          <div className="w-8 h-8 rounded-xl bg-base-800 flex items-center justify-center border border-base-100 shadow-sm">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-mono text-sm font-bold tracking-wide text-base-content uppercase">
            Friends
          </h2>
        </div>

        {/* Standard Navigation Tabs */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wide">
          <button
            className={getTabStyle("online")}
            onClick={() => setActiveTab("online")}
          >
            Online
          </button>
          <button
            className={getTabStyle("all")}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          {/* === NEW PENDING TAB === */}
          <button
            className={getTabStyle("pending")}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
        </div>
      </div>

      {/* RIGHT: Action / Utility Tabs */}
      <div className="flex items-center font-mono text-xs font-bold tracking-wide">
        <button
          className={`px-4 py-1.5 rounded-lg transition-all duration-200 ${
            activeTab === "add"
              ? "bg-success text-white shadow-[0_0_10px_rgba(46,213,115,0.3)]"
              : "bg-success/10 text-success hover:bg-success/20"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add Friend
        </button>
      </div>
    </div>
  );
}