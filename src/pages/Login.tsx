import AuthPromoBanner from "../components/AuthPromoBanner"

const Login = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-300">
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-base-900 border-r border-base-100">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-3xl font-bold tracking-wide text-base-content font-mono uppercase">
            Welcome Back
          </h1>
          <p className="text-base-content/60">
            Sign in to continue your gaming chat experience.
          </p>
        </div>
      </div>

      <AuthPromoBanner
        badgeText="// Reconnect"
        title="Welcome Back to"
        highlight="Your Squad"
        description="Log in to reconnect with your guild, jump straight into chat, and keep your party strategy active."
      />
    </div>
  )
}

export default Login
