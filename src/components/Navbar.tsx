import { Gamepad2, Settings, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="navbar bg-base-900 border-b border-base-100 px-4 sm:px-8 h-16 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      {/* LEFT SIDER: LOGO AND APP NAME */}
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-primary/20 shadow-[0_0_10px_rgba(116,185,255,0.05)]">
            <img
              src="/logo.png"
              alt="Loop"
              className="w-5 h-5 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.classList.remove("hidden");
                }
              }}
            />
            <Gamepad2 className="w-5 h-5 text-primary hidden" />
          </div>
          <span className="font-mono text-lg font-bold tracking-wider uppercase text-base-content">
            Loop<span className="text-primary">Chats</span>
          </span>
        </Link>
      </div>

      {/* RIGHT SIDE: UTILITY CONTROLS */}
      <div className="flex-none gap-2">
        {authUser ? (
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Settings Button */}
            <Link
              to="/settings"
              className="btn btn-ghost btn-sm sm:btn-md gap-2 font-mono uppercase tracking-wide text-xs"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-base-content/70 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* Profile Button */}
            <Link
              to="/profile"
              className="btn btn-ghost btn-sm sm:btn-md gap-2 font-mono uppercase tracking-wide text-xs"
              title="Profile"
            >
              {authUser.profilePic ? (
                <div className="avatar">
                  <div className="w-5 h-5 rounded-full ring-1 ring-primary ring-offset-base-100 ring-offset-1">
                    <img src={authUser.profilePic} alt="Avatar" />
                  </div>
                </div>
              ) : (
                <User className="w-4 h-4 text-base-content/70" />
              )}
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {/* Divider line for visual separation */}
            <div className="divider divider-horizontal mx-1 my-3 hidden sm:flex"></div>

            {/* Logout Action Button */}
            <button
              onClick={logout}
              className="btn btn-outline btn-error btn-sm sm:btn-md gap-2 font-mono uppercase tracking-wide text-xs"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="btn btn-ghost btn-sm font-mono uppercase tracking-wide text-xs"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn btn-primary btn-sm font-mono uppercase tracking-wide text-xs text-white"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
