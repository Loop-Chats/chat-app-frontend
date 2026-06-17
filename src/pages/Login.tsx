import { useState } from "react";
import AuthPromoBanner from "../components/AuthPromoBanner";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Gamepad2, Loader2, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    login(formData);
  };


  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-300">
      {/* LEFT COLUMN: LOGIN FORM */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-base-900 border-r border-base-100">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-primary/30 shadow-[0_0_15px_rgba(116,185,255,0.1)]">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2 tracking-wide text-base-content font-mono uppercase">
                Welcome <span className="text-primary">Back</span>
              </h1>
              <p className="text-sm text-base-content/60">
                Sign in to continue your chat experience.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base-content/70">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 focus:input-primary bg-base-200"
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label flex justify-between items-center">
                <span className="label-text font-semibold text-base-content/70">
                  Password
                </span>
                <a
                  href="/forgot-password"
                  className="label-text-alt link link-primary no-underline hover:underline text-xs"
                >
                  Forgot password?
                </a>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 focus:input-primary bg-base-200"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full text-white font-mono uppercase tracking-wider"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin"></Loader2>
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Redirect Option */}
          <div className="text-center">
            <p className="text-sm text-base-content/50">
              New to the platform?{" "}
              <Link
                to="/register"
                className="link link-primary no-underline font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: PROMO BANNER COMPONENT */}
      <AuthPromoBanner
        badgeText="// Reconnect"
        title="Welcome Back to"
        highlight="Your Squad"
        description="Log in to reconnect with your guild, jump straight into chat, and keep your party strategy active."
      />
    </div>
  );
};

export default Login;
