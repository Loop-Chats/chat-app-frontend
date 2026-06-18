import {
  Camera,
  User,
  Save,
  Edit2,
  Mail,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [username, setUsername] = useState(authUser?.username || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64data = reader.result as string;
      setSelectedImage(base64data);
      await updateProfile({ avatar: base64data });
    };
  };

  const handleUpdateUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username === authUser?.username) {
      setIsEditingName(false);
      return;
    }
    updateProfile({ username });
    setIsEditingName(false);
  };

  const joinDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "June 16, 2026";

  return (
    <div className="min-h-screen bg-base-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* GAMER CARD /S PROFILE HEADER */}
        <div className="card bg-base-900 border border-base-100 shadow-xl overflow-hidden relative">
          {/* Subtle Decorative Top Banner */}
          <div className="h-24 bg-gradient-to-r from-primary/30 via-secondary/20 to-base-100"></div>

          <div className="card-body pt-0 items-center text-center relative">
            {/* Avatar Container with Upload Overlay */}
            {/* Avatar Container with Upload Overlay */}
            <div className="-mt-16 relative group">
              <div className="avatar">
                <div className="w-28 h-28 rounded-2xl ring-4 ring-primary bg-base-200 shadow-2xl relative overflow-hidden">
                  <img
                    src={
                      selectedImage ||
                      authUser?.avatar ||
                      "https://api.dicebear.com/7.x/bottts/svg?seed=squad"
                    }
                    alt="Gamer Avatar"
                  />
                </div>
              </div>

              {/* Camera Upload Trigger / Loading Spinner Overlay */}
              <label
                htmlFor="avatar-upload"
                className={`absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center text-white text-xs transition-opacity duration-200
      ${
        isUpdatingProfile
          ? "opacity-100 cursor-not-allowed"
          : "opacity-0 group-hover:opacity-100 cursor-pointer"
      }`}
              >
                {isUpdatingProfile ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                    <span className="font-mono text-[10px] tracking-wider uppercase text-primary font-bold animate-pulse">
                      Uploading...
                    </span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mb-1 text-primary" />
                    <span className="font-mono uppercase tracking-wide text-[11px]">
                      Change
                    </span>
                  </>
                )}

                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            {/* Profile Meta Headers */}
            <div className="mt-4 space-y-1">
              <h2 className="card-title text-2xl font-mono uppercase tracking-wide justify-center text-base-content">
                {authUser?.username || "Gamer_Tag"}
              </h2>
              <div className="badge badge-primary badge-outline font-mono text-xs uppercase tracking-wider">
                Rank: Elite Moderator
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT SETTINGS FORM */}
        <div className="card bg-base-900 border border-base-100 shadow-xl">
          <div className="card-body space-y-6">
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-primary border-b border-base-100 pb-2">
              // Profile
            </h3>

            {/* Username Module */}
            <form
              onSubmit={handleUpdateUsername}
              className="form-control w-full"
            >
              <label className="label">
                <span className="label-text font-semibold text-base-content/70">
                  Username
                </span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditingName}
                    className={`input input-bordered w-full pl-10 focus:input-primary bg-base-200 text-base-content ${!isEditingName ? "opacity-70 cursor-not-allowed" : ""}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {isEditingName ? (
                  <button
                    type="submit"
                    className="btn btn-primary font-mono uppercase text-xs text-white"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="btn btn-outline btn-square"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Email Module (Read Only) */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-base-content/70">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/30">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  readOnly
                  className="input input-bordered w-full pl-10 bg-base-300 opacity-50 cursor-not-allowed border-dashed text-base-content/70"
                  value={authUser?.email || "player@loopchats.com"}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-success/60 gap-1 text-xs font-mono">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </div>
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/40">
                  System restrictions prevent modifying registration emails.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* NETWORK ANALYTICS / METADATA */}
        <div className="card bg-base-900 border border-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-primary border-b border-base-100 pb-2 mb-4">
              // Fleet Data & Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Creation Block */}
              <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-xl border border-base-100">
                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-base-content/40 uppercase">
                    Member Since
                  </h4>
                  <p className="text-sm font-semibold text-base-content/90">
                    {joinDate}
                  </p>
                </div>
              </div>

              {/* Status Operational Block */}
              <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-xl border border-base-100">
                <div className="p-3 bg-success/10 rounded-lg text-success">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-base-content/40 uppercase">
                    Account Status
                  </h4>
                  <p className="text-sm font-semibold text-success">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
