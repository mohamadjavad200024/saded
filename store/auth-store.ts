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
  isCheckingAuth: boolean;
  hasCheckedAuth: boolean;
  
  // Actions
  register: (name: string, phone: string, password: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
      hasCheckedAuth: false,

      register: async (name: string, phone: string, password: string) => {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name, phone, password }),
        });

        const result = await response.json();

        if (!result.success) {
          // نمایش پیام خطای دقیق از سرور
          const errorMessage = result.error || result.message || "خطا در ثبت‌نام";
          
          // Log کامل برای debugging
          if (process.env.NODE_ENV === "development") {
            console.error("Register API error:", {
              status: response.status,
              statusText: response.statusText,
              result,
              body: { name, phone: "***", password: "***" },
            });
          }
          
          throw new Error(errorMessage);
        }

        // Set current user
        const user = {
          id: result.data.user.id,
          name: result.data.user.name,
          phone: result.data.user.phone,
          role: result.data.user.role || "user",
          createdAt: result.data.user.createdAt,
        };

        set({
          user,
          isAuthenticated: true,
          hasCheckedAuth: true,
        });
      },

      login: async (phone: string, password: string): Promise<boolean> => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ phone, password }),
        });

        const result = await response.json();

        if (!result.success) {
          // می‌توانیم پیام خطا را لاگ کنیم برای debugging
          if (process.env.NODE_ENV === "development") {
            console.error("Login error:", result.error || result.message);
          }
          return false;
        }

        // Set current user
        const user = {
          id: result.data.user.id,
          name: result.data.user.name,
          phone: result.data.user.phone,
          role: result.data.user.role || "user",
          createdAt: result.data.user.createdAt,
        };

        set({
          user,
          isAuthenticated: true,
          hasCheckedAuth: true,
        });

        return true;
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        } catch {
          // ignore
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            hasCheckedAuth: true,
          });
        }
      },

      checkAuth: async () => {
        const { isCheckingAuth, hasCheckedAuth } = get();
        if (isCheckingAuth) return;
        // Always allow re-check, but avoid spamming if already checked recently
        set({ isCheckingAuth: true });
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 7000);
          const res = await fetch("/api/auth/me", {
            credentials: "include",
            signal: controller.signal,
          });
          clearTimeout(timeout);
          const json = await res.json().catch(() => null);
          if (res.ok && json?.success && json?.data?.user) {
            const u = json.data.user;
            set({
              user: {
                id: u.id,
                name: u.name,
                phone: u.phone,
                role: u.role || "user",
                createdAt: u.createdAt,
              },
              isAuthenticated: true,
              hasCheckedAuth: true,
            });
          } else {
            set({ user: null, isAuthenticated: false, hasCheckedAuth: true });
          }
        } catch {
          // Network fail: don't force logout, but mark checked to prevent infinite spinner
          set({ user: null, isAuthenticated: false, hasCheckedAuth: true });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      updateUser: (userData: Partial<AuthUser>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
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
