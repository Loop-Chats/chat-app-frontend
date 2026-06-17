import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';

interface User {
  id: string;
  email: string;
  username: string;
  profilePic?: string;
}

interface AuthState {
  authUser: User | null;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check-auth');

      set({ authUser: response.data });
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (data: { username: string; email: string; password: string }) => {
    set({ isRegistering: true });
    try {
      const response = await axiosInstance.post('/auth/register', data);

      set({ authUser: response.data });
      toast.success('Account created successfully!');
    } catch (error) {
      if (isAxiosError(error)) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        } else {
            toast.error('An unexpected error occurred.');
        }
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (data: { email: string; password: string }) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', data);

      set({ authUser: response.data });
      toast.success('Logged in successfully!');
    } catch (error) {
      if (isAxiosError(error)) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
        } else {
            toast.error('An unexpected error occurred.');
        }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully!');
    } catch (error) {
       if (isAxiosError(error)) {
            const message = error.response?.data?.message || 'Failed to log out. Please try again.';
            toast.error(message);
        } else {
            toast.error('An unexpected error occurred.');
        }
    }
  },

  updateProfile: async () => {}
}));