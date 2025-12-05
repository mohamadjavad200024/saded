"use client";

import { create } from "zustand";
import type { NavigationGroup } from "@/types/navigation";

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  group: NavigationGroup;
  enabled: boolean;
  order: number;
}

export interface NavigationGroupData {
  id: NavigationGroup;
  name: string;
  enabled: boolean;
  order: number;
}

interface NavigationStore {
  items: NavigationItem[];
  groups: NavigationGroupData[];
  
  // Actions
  getEnabledItems: () => NavigationItem[];
  getItemsByGroup: (group: NavigationGroup) => NavigationItem[];
  addItem: (item: NavigationItem) => void;
  updateItem: (id: string, updates: Partial<NavigationItem>) => void;
  removeItem: (id: string) => void;
}

const defaultGroups: NavigationGroupData[] = [
  { id: "main", name: "اصلی", enabled: true, order: 1 },
  { id: "user", name: "حساب کاربری", enabled: true, order: 2 },
  { id: "tools", name: "ابزارها", enabled: true, order: 3 },
  { id: "help", name: "راهنما", enabled: true, order: 4 },
];

const defaultItems: NavigationItem[] = [
  { id: "home", name: "خانه", href: "/", icon: "Home", group: "main", enabled: true, order: 1 },
  { id: "products", name: "محصولات", href: "/products", icon: "Package", group: "main", enabled: true, order: 2 },
  { id: "cart", name: "سبد خرید", href: "/cart", icon: "ShoppingCart", group: "main", enabled: true, order: 3 },
  { id: "orders", name: "سفارشات", href: "/orders", icon: "History", group: "user", enabled: true, order: 1 },
];

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  items: defaultItems,
  groups: defaultGroups,

  getEnabledItems: () => {
    return get().items.filter((item) => item.enabled);
  },

  getItemsByGroup: (group: NavigationGroup) => {
    return get()
      .getEnabledItems()
      .filter((item) => item.group === group)
      .sort((a, b) => a.order - b.order);
  },

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));

