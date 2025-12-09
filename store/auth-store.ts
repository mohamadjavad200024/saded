"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role?: string;
  createdAt: string | Date;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  
  // Actions
  register: (name: string, phone: string, password: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  loadUser: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      register: async (name: string, phone: string, password: string) => {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, phone, password }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "خطا در ثبت‌نام");
        }

        // Set current user
        set({
          user: {
            id: result.data.user.id,
            name: result.data.user.name,
            phone: result.data.user.phone,
            createdAt: result.data.user.createdAt,
          },
          isAuthenticated: true,
        });
      },

      login: async (phone: string, password: string): Promise<boolean> => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, password }),
        });

        const result = await response.json();

        if (!result.success) {
          return false;
        }

        // Set current user
        set({
          user: {
            id: result.data.user.id,
            name: result.data.user.name,
            phone: result.data.user.phone,
            role: result.data.user.role,
            createdAt: result.data.user.createdAt,
          },
          isAuthenticated: true,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<AuthUser>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
        }
      },

      loadUser: async (userId: string) => {
        try {
          const response = await fetch(`/api/auth/me?userId=${userId}`);
          const result = await response.json();

          if (result.success && result.data.user) {
            set({
              user: {
                id: result.data.user.id,
                name: result.data.user.name,
                phone: result.data.user.phone,
                role: result.data.user.role,
                createdAt: result.data.user.createdAt,
              },
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error("Error loading user:", error);
        }
      },
    }),
    {
      name: "saded_auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
