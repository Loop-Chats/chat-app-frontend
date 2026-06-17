import { Navigate, Route, Routes } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Settings from "./pages/Settings"
import Navbar from "./components/Navbar"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log('Authenticated User:', authUser)

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={ authUser ? <Home /> : <Navigate to="/login" /> } />
        <Route path="/register" element={ !authUser ? <Register /> : <Navigate to="/" /> } />
        <Route path="/login" element={ !authUser ? <Login /> : <Navigate to="/" /> } />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={ authUser ? <Profile /> : <Navigate to="/login" /> } />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
