import { useChatStore } from "../store/useChatStore";
import ChatWindow from "../components/ChatWindow";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const { selectedChat } = useChatStore();

  return (
    // min-h-screen layout matching your background profile specs
    <div className="h-screen bg-base-300 flex flex-col justify-between">
      {/* Main Dashboard Layout Window
        Takes the remaining screen space minus the navbar height
      */}
      <div className="flex-1 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-base-900 border border-base-100 rounded-2xl shadow-2xl w-full max-w-6xl h-[calc(100vh-6rem)] flex overflow-hidden backdrop-blur-sm bg-opacity-95">
          {/* Left Side Navigation Matrix */}
          <Sidebar />

          {/* Right Side Main Interaction Display Grid */}
          <div className="flex-1 flex flex-col h-full bg-base-950/20">
            {!selectedChat ? <NoChatSelected /> : <ChatWindow />}
          </div>
        </div>
      </div>
    </div>
  );
}
