import type { Chat, Message } from "../store/useChatStore";

export function formatMessageTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getMessageSenderId(message: Message): string {
    const { senderId } = message;

    if (senderId == null) return "";

    if (typeof senderId === "object" && "_id" in senderId) {
        return String((senderId as { _id: string })._id);
    }

    return String(senderId);
}

function getLatestMessageContent(message: Message): string {
    if (message.text?.trim()) return message.text;
    if (message.image) return "Photo";
    return "No communications yet";
}

export function formatLatestMessagePreview(
    chat: Chat,
    authUserId: string | undefined,
): string {
    const latestMessage = chat.latestMessage;

    if (!latestMessage || typeof latestMessage === "string") {
        return "No communications yet";
    }

    const content = getLatestMessageContent(latestMessage);
    const senderId = getMessageSenderId(latestMessage);
    const isOwnMessage = senderId === String(authUserId);

    if (isOwnMessage) {
        return `You: ${content}`;
    }

    if (chat.isGroupChat) {
        const sender = chat.users.find((user) => String(user._id) === senderId);
        const senderName = sender?.username || "Unknown";
        return `${senderName}: ${content}`;
    }

    return content;
}

export const checkIsOnline = (chat: Chat, authUserId: string, onlineUsers: string[]) => {
    const otherUser = chat.users.find((u) => u._id !== authUserId);
    return Boolean(otherUser && onlineUsers.includes(otherUser._id));
};