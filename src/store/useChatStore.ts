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
  isCreatingChat: boolean;
  isUpdatingGroupChatDetails: boolean;
  isUpdatingGroupMembers: boolean;
  showFriendsView: boolean;

  getChats: () => Promise<void>;
  getMessages: (chatId: string) => Promise<void>;
  setSelectedChat: (chat: Chat | null) => void;
  sendMessage: (messageData: {
    chatId?: string;
    text?: string;
    image?: string;
  }) => Promise<void>;
  setShowFriendsView: (show: boolean) => void;
  createChat: (data: {
    otherUserIds: string[];
    chatName?: string;
    chatImage?: string;
  }) => Promise<Chat | undefined>;
  updateGroupChatDetails: (data: {
    chatId: string;
    chatName?: string;
    chatImage?: string;
  }) => Promise<Chat | undefined>;
  addUserToGroupChat: (data: {
    userId: string;
    chatId: string;
    newUserId: string;
  }) => Promise<Chat | undefined>;
  removeUserFromTheGroupChat: (data: {
    userId: string;
    chatId: string;
    removeUserId: string;
  }) => Promise<Chat | undefined>;
  makeChatAdmin: (data: {
    userId: string;
    chatId: string;
    selectedUserId: string;
  }) => Promise<Chat | undefined>;
  isAdmin: (chatId: string) => boolean;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  chats: [],
  friends: [],
  selectedChat: null,
  isChatsLoading: false,
  isMessagesLoading: false,
  isCreatingChat: false,
  isUpdatingGroupChatDetails: false,
  isUpdatingGroupMembers: false,
  showFriendsView: false,

  getChats: async () => {
    set({ isChatsLoading: true });

    try {
      const response = await axiosInstance.get("/chats");
      set({ chats: response.data });
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to fetch chats. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
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
        const message =
          error.response?.data?.message ||
          "Failed to fetch messages. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: {
    chatId?: string;
    text?: string;
    image?: string;
  }) => {
    const { selectedChat, messages } = get();
    const chatId = messageData.chatId || selectedChat?._id;

    if (!chatId) {
      toast.error("No chat selected. Unable to send message.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/messages/chats/${chatId}`,
        messageData,
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to send message. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  },

  createChat: async (data: {
    otherUserIds: string[];
    chatName?: string;
    chatImage?: string;
  }) => {
    set({ isCreatingChat: true });
    try {
      const response = await axiosInstance.post("/chats", data);
      set((state) => ({ chats: [...state.chats, response.data] }));
      toast.success("Chat created successfully!");
      return response.data as Chat;
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to create chat. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isCreatingChat: false });
    }
  },

  updateGroupChatDetails: async (data: {
    chatId: string;
    chatName?: string;
    chatImage?: string;
  }) => {
    set({ isUpdatingGroupChatDetails: true });

    try {
      const response = await axiosInstance.patch(`/chats/${data.chatId}`, data);
      const updatedChat = response.data;

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === data.chatId ? updatedChat : chat,
        ),

        selectedChat:
          state.selectedChat?._id === data.chatId
            ? updatedChat
            : state.selectedChat,
      }));
      toast.success("Chat updated successfully!");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to update chat. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isUpdatingGroupChatDetails: false });
    }
  },

  addUserToGroupChat: async (data: {
    userId: string;
    chatId: string;
    newUserId: string;
  }) => {
    set({ isUpdatingGroupMembers: true });

    try {
      const response = await axiosInstance.post(
        `/chats/${data.chatId}/add-user`,
        data,
      );
      const updatedChat = response.data;

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === data.chatId ? updatedChat : chat,
        ),

        selectedChat:
          state.selectedChat?._id === data.chatId
            ? updatedChat
            : state.selectedChat,
      }));
      toast.success("User added successfully!");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to add the user to the chat. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isUpdatingGroupMembers: false });
    }
  },

  removeUserFromTheGroupChat: async (data: {
    userId: string;
    chatId: string;
    removeUserId: string;
  }) => {
    set({ isUpdatingGroupMembers: true });

    try {
      const response = await axiosInstance.patch(
        `/chats/${data.chatId}/remove-user`,
        data,
      );
      const updatedChat = response.data;

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === data.chatId ? updatedChat : chat,
        ),

        selectedChat:
          state.selectedChat?._id === data.chatId
            ? updatedChat
            : state.selectedChat,
      }));
      toast.success("User removed successfully!");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to remove the user from the chat. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isUpdatingGroupMembers: false });
    }
  },

  makeChatAdmin: async (data: {
    userId: string;
    chatId: string;
    selectedUserId: string;
  }) => {
    set({ isUpdatingGroupMembers: true });

    try {
      const response = await axiosInstance.patch(
        `/chats/${data.chatId}/make-admin`,
        data,
      );
      const updatedChat = response.data;      

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat._id === data.chatId ? updatedChat : chat,
        ),

        selectedChat:
          state.selectedChat?._id === data.chatId
            ? updatedChat
            : state.selectedChat,
      }));
      toast.success("User promoted to admin successfully!");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to promote the user to admin. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isUpdatingGroupMembers: false });
    }
  },

  setSelectedChat: (chat: Chat | null) => set({ selectedChat: chat }),

  setShowFriendsView: (show: boolean) => set({ showFriendsView: show }),
}));
