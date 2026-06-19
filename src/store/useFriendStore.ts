import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FriendRequest {
  _id: string;
  sender: User;
  receiver: string;
  status: "pending" | "accepted" | "rejected";
  createdAt?: string;
}

interface FriendState {
  friends: User[];
  pendingRequests: FriendRequest[];
  isFriendsLoading: boolean;
  isFriendRequestsLoading: boolean;
  isSendingFriendRequest: boolean;
  isRespondingToRequest: boolean;
  getFriends: () => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  sendFriendRequest: (username: string) => Promise<boolean>;
  getFriendRequests: () => Promise<void>;
  respondToFriendRequest: (data: { requestId: string; action: "accept" | "reject";}) => Promise<void>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
  friends: [],
  pendingRequests: [],
  isFriendsLoading: false,
  isFriendRequestsLoading: false,
  isRespondingToRequest: false,
  isSendingFriendRequest: false,

  getFriends: async () => {
    set({ isFriendsLoading: true });

    try {
      const response = await axiosInstance.get("/users/friends");
      set({ friends: response.data });
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to fetch friends. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  removeFriend: async (friendId: string) => {
    try {
      await axiosInstance.patch(`/users/friends/${friendId}`);
      set((state) => ({
        friends: state.friends.filter((friend) => friend._id !== friendId),
      }));
      toast.success("Friend removed successfully!");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to remove friend. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  },

  sendFriendRequest: async (username: string) => {
    set({ isSendingFriendRequest: true });

    try {
      const response = await axiosInstance.post("/users/send-friend-request", {
        username,
      });
      set((state) => ({
        pendingRequests: [
          ...state.pendingRequests,
          response.data.friendRequest,
        ],
      }));
      toast.success("Friend request sent!");
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to send friend request. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ isSendingFriendRequest: false });
    }
  },

  getFriendRequests: async () => {
    set({ isFriendRequestsLoading: true });

    try {
      const response = await axiosInstance.get("/users/friend-requests");
      console.log(response);

      set({ pendingRequests: response.data });
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to get friend requests. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isFriendRequestsLoading: false });
    }
  },

  respondToFriendRequest: async (data: {
    requestId: string;
    action: "accept" | "reject";
  }) => {
    set({ isRespondingToRequest: true });

    try {
      const { pendingRequests } = get();
      const requestData = pendingRequests.find(
        (req) => req._id === data.requestId,
      );

      if (!requestData) return;

      await axiosInstance.patch(
        `/users/respond-friend-request/${data.requestId}`,
        { action: data.action },
      );

      set((state) => {
        const updatedPending = state.pendingRequests.filter(
          (req) => req._id !== data.requestId,
        );

        let updatedFriends = state.friends;
        if (data.action === "accept") {
          updatedFriends = [...state.friends, requestData.sender];
        }

        return {
          pendingRequests: updatedPending,
          friends: updatedFriends,
        };
      });

      toast.success(`Request ${data.action}ed!`);
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to respond to the friend request. Please try again.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ isRespondingToRequest: false });
    }
  },
}));
