"use client";

import { create } from "zustand";
import type { User, UserFilters, UserRole, UserStatus } from "@/types/user";
import { logger } from "@/lib/logger-client";

interface UserStore {
  users: User[];
  filters: UserFilters;
  isLoading: boolean;
  
  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  updateUserStatus: (id: string, status: UserStatus) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  deleteUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
  setFilters: (filters: Partial<UserFilters>) => void;
  clearFilters: () => void;
  loadUsersFromDB: () => Promise<void>;
}

const defaultFilters: UserFilters = {};

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  filters: defaultFilters,
  isLoading: false,

  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => {
      const existingIndex = state.users.findIndex((u) => u.id === user.id);
      if (existingIndex >= 0) {
        // Update existing user
        const updatedUsers = [...state.users];
        updatedUsers[existingIndex] = user;
        return { users: updatedUsers };
      }
      // Add new user
      return { users: [...state.users, user] };
    }),

  updateUser: (id, userData) =>
    set((state) => {
      const existingIndex = state.users.findIndex((u) => u.id === id);
      if (existingIndex >= 0) {
        const updatedUsers = [...state.users];
        updatedUsers[existingIndex] = {
          ...updatedUsers[existingIndex],
          ...userData,
          updatedAt: new Date(),
        };
        return { users: updatedUsers };
      }
      return state;
    }),

  updateUserStatus: (id, status) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, status, updatedAt: new Date() } : u
      ),
    })),

  updateUserRole: (id, role) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, role, updatedAt: new Date() } : u
      ),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),

  getUser: (id) => {
    const state = get();
    return state.users.find((u) => u.id === id);
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  loadUsersFromDB: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/users?limit=1000", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || "خطا در بارگذاری کاربران";
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const users: User[] = result.data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || undefined,
          role: (u.role || "user") as User["role"],
          status: (u.status || (u.enabled === 1 || u.enabled === true ? "active" : "inactive")) as User["status"],
          avatar: u.avatar || undefined,
          ordersCount: u.ordersCount || undefined,
          totalSpent: u.totalSpent || undefined,
          createdAt: u.createdAt instanceof Date ? u.createdAt : new Date(u.createdAt),
          updatedAt: u.updatedAt instanceof Date ? u.updatedAt : new Date(u.updatedAt),
        }));

        get().setUsers(users);
        logger.info(`✅ Loaded ${users.length} users from database`);
      } else {
        get().setUsers([]);
        logger.info("No users found in database");
      }
    } catch (error) {
      logger.error("Error loading users from DB:", error);
      // Don't throw - allow app to continue with empty users
      get().setUsers([]);
    } finally {
      set({ isLoading: false });
    }
  },
}));

