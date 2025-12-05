"use client";

import { create } from "zustand";
import type { User, UserFilters, UserRole, UserStatus } from "@/types/user";

interface UserStore {
  users: User[];
  filters: UserFilters;
  
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
}

const defaultFilters: UserFilters = {};

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  filters: defaultFilters,

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
}));

