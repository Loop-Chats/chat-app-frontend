import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Send, Image } from "lucide-react";
import toast from "react-hot-toast";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim() || undefined,
        image: imagePreview || undefined,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message!");
    }
  };

  return (
    <div className="p-4 w-full bg-base-900/40 border-t border-base-100 relative">
      {/* 1. IMAGE PREVIEW FLOATING OVERLAY POPUP */}
      {imagePreview && (
        <div className="absolute bottom-full left-4 mb-3 p-2 bg-base-900 border border-base-100 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="relative group w-16 h-16 rounded-lg overflow-hidden border border-base-100 bg-base-200">
            <img
              src={imagePreview}
              alt="Attachment Preview"
              className="w-full h-full object-cover"
            />
            {/* Quick Remove Overlay */}
            <button
              type="button"
              onClick={removeImage}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-error"
              title="Remove File Attachment"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-left font-mono pr-4">
            <p className="text-[10px] text-primary uppercase font-bold tracking-wider">
              // Attached Node
            </p>
            <p className="text-[9px] text-base-content/40 truncate max-w-[100px]">
              Ready to deploy
            </p>
          </div>
        </div>
      )}

      {/* 2. CORE INPUT FORM GRID INTERACTION DOCK */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 w-full"
      >
        <div className="flex-1 flex items-center gap-2 bg-base-900 border border-base-100 rounded-xl px-3 h-12 focus-within:border-primary transition-colors">
          {/* Hidden Core File System Native Input Trigger */}
          <input
            type="file"
            id="image-input"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Graphical File Attachment Trigger Button */}
          <button
            type="button"
            className={`btn btn-ghost btn-sm btn-square hover:bg-primary/10 transition-colors
              ${imagePreview ? "text-primary" : "text-base-content/40 hover:text-base-content"}`}
            onClick={() => fileInputRef.current?.click()}
            title="Upload Media Asset"
          >
            <Image className="w-5 h-5" />
          </button>

          {/* Core Text Input Element Field */}
          <input
            type="text"
            className="input w-full bg-transparent border-none outline-none focus:outline-none focus:border-none p-0 h-full text-xs font-mono text-base-content placeholder-base-content/30"
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* 3. SEND INTERACTION COMMAND BUTTON */}
        <button
          type="submit"
          className={`btn btn-primary h-12 min-h-[48px] px-4 rounded-xl text-white font-mono uppercase tracking-wider text-xs gap-2
            ${!text.trim() && !imagePreview ? "btn-disabled opacity-40" : "shadow-[0_0_15px_rgba(116,185,255,0.15)]"}`}
          disabled={!text.trim() && !imagePreview}
        >
          <span className="hidden sm:inline">Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
