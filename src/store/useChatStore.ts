import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export interface User {
  _id: string;
  email: string;
  username: string;
  avatar?: string;
  friends?: string[]; // array of user ids
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  text?: string;
  image?: string;
  chat?: string; // chat id
  readBy?: string[]; // user ids
  createdAt?: string;
  updatedAt?: string;
}

export interface Chat {
  _id: string;
  chatName?: string;
  chatImage?: string;
  isGroupChat?: boolean;
  users: User[];
  latestMessage?: string | Message;
  groupAdmin?: string | User;
  createdAt?: string;
  updatedAt?: string;
}

interface ChatState {
  messages: Message[];
  chats: Chat[];
  selectedChat: Chat | null;
  isChatsLoading: boolean;
  isMessagesLoading: boolean;
  showFriendsView: boolean;

    getChats: () => Promise<void>;
    getMessages: (chatId: string) => Promise<void>;
    setSelectedChat: (chat: Chat | null) => void;
    sendMessage: (messageData: { chatId?: string, text?: string, image?: string }) => Promise<void>;
    setShowFriendsView: (show: boolean) => void;
    createChat: (data: { otherUserIds: string[], chatName?: string; chatImage?: string; }) => Promise<Chat | undefined>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  chats: [],
  friends: [],
  selectedChat: null,
  isChatsLoading: false,
  isMessagesLoading: false,
  showFriendsView: false,

  getChats: async () => {
    set({ isChatsLoading: true });

    try {
        const response = await axiosInstance.get("/chats");
        set({ chats: response.data });
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || 'Failed to fetch chats. Please try again.';
            toast.error(message);
        } else {
            toast.error('An unexpected error occurred.');
        }
    } finally {
      set({ isChatsLoading: false });
    }
  },

  getMessages: async (chatId: string) => {
    set({ isMessagesLoading: true });

    try {
        const response = await axiosInstance.get(`/messages/chats/${chatId}`);
        set({ messages: response.data });
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || 'Failed to fetch messages. Please try again.';
            toast.error(message);
        } else {
            toast.error('An unexpected error occurred.');
        }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: { chatId?: string, text?: string, image?: string }) => {
    const { selectedChat, messages } = get();
    const chatId = messageData.chatId || selectedChat?._id;

    if (!chatId) {
      toast.error('No chat selected. Unable to send message.');
      return;
    }

    try {
        const response = await axiosInstance.post(`/messages/chats/${chatId}`, messageData);
        set({ messages: [...messages, response.data] });
    } catch (error) {
        if (isAxiosError(error)) {
            const message = error.response?.data?.message || 'Failed to send message. Please try again.';
            toast.error(message);
        } else {
            toast.error('An unexpected error occurred.');
        }
    }
  },

  createChat: async (data: { otherUserIds: string[], chatName?: string; chatImage?: string; }) => {
    try {
      const response = await axiosInstance.post('/chats', data);
      set((state) => ({ chats: [...state.chats, response.data] }));
      toast.success('Chat created successfully!');
      return response.data as Chat;
    } catch (error) {
      if (isAxiosError(error)) {
            const message = error.response?.data?.message || 'Failed to create chat. Please try again.';
            toast.error(message);
        } else {
            toast.error('An unexpected error occurred.');
        }
    }
  },

  setSelectedChat: (chat: Chat | null) => set({ selectedChat: chat }),

  setShowFriendsView: (show: boolean) => set({ showFriendsView: show }),
}));