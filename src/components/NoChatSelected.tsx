import { Gamepad2, MessageSquareCode, Radio } from "lucide-react";

export default function NoChatSelected() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-16 bg-gradient-to-b from-base-100 to-base-200/50 relative overflow-hidden">

      {/* Subtle Digital Grid Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" 
      />

      {/* Ambient Radial Glow behind the icon */}
      <div className="absolute w-72 h-72 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-md text-center space-y-6 relative z-10">

        {/* Animated Icon Container */}
        <div className="flex justify-center justify-items-center">
          <div className="relative group">
            {/* Outer Glowing Ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

            {/* Core Icon Box */}
            <div className="w-16 h-16 rounded-2xl bg-base-300/80 border border-base-100 flex items-center justify-center shadow-xl backdrop-blur-sm">
              <Gamepad2 className="w-8 h-8 text-primary animate-bounce [animation-duration:3s]" />
            </div>

            {/* Micro Ping Status Radar */}
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
          </div>
        </div>

        {/* Header Text Block */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 badge badge-outline badge-primary/40 font-mono tracking-widest text-[10px] py-1 px-2.5 uppercase">
            <Radio className="w-3 h-3 text-primary animate-pulse" /> Standby Mode
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide font-mono uppercase text-base-content">
            Welcome to <span className="text-primary drop-shadow-[0_0_15px_rgba(116,185,255,0.2)]">Loop Chats</span>
          </h2>
          <p className="text-sm text-base-content/50 leading-relaxed">
            Your secure communications hub is online and operational. Ready to initialize connection arrays.
          </p>
        </div>

        {/* Divider Graphic Line */}
        <div className="flex items-center justify-center gap-2 opacity-30">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-base-content"></div>
          <MessageSquareCode className="w-4 h-4 text-base-content/60" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-base-content"></div>
        </div>

        {/* Action Prompt Instructions */}
        <p className="text-xs font-mono text-primary/70 uppercase tracking-widest animate-pulse">
          ◀ Select a channel or friend from the sidebar to link up
        </p>

      </div>
    </div>
  );
}