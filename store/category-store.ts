"use client";

import { create } from "zustand";
import type { Category } from "@/types/category";
import { logger } from "@/lib/logger-client";

interface CategoryStore {
  categories: Category[];
  
  // Actions
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
  getActiveCategories: () => Category[];
  getEnabledCategories: () => Category[];
  
  // Async API sync method
  loadCategoriesFromDB: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],

  setCategories: (categories) => set({ categories }),

  addCategory: (category) =>
    set((state) => {
      const existingIndex = state.categories.findIndex((c) => c.id === category.id);
      if (existingIndex >= 0) {
        // Update existing category
        const updatedCategories = [...state.categories];
        updatedCategories[existingIndex] = category;
        return { categories: updatedCategories };
      }
      // Add new category
      return { categories: [...state.categories, category] };
    }),

  updateCategory: (category) =>
    set((state) => {
      const existingIndex = state.categories.findIndex((c) => c.id === category.id);
      if (existingIndex >= 0) {
        const updatedCategories = [...state.categories];
        updatedCategories[existingIndex] = category;
        return { categories: updatedCategories };
      }
      return state;
    }),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  toggleCategory: (id) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ),
    })),

  getCategory: (id) => {
    const state = get();
    return state.categories.find((c) => c.id === id);
  },

  getActiveCategories: () => {
    const state = get();
    return state.categories.filter((c) => c.isActive && c.enabled);
  },

  getEnabledCategories: () => {
    const state = get();
    return state.categories.filter((c) => c.enabled);
  },

  // Async API sync method
  loadCategoriesFromDB: async (includeInactive: boolean = false) => {
    try {
      // For admin pages, we need all categories (including inactive ones)
      const url = includeInactive ? "/api/categories?all=true" : "/api/categories";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("خطا در بارگذاری دسته‌بندی‌ها");
      }
      const result = await response.json();
      const categories = result.data || [];
      get().setCategories(categories);
    } catch (error) {
      logger.error("Error loading categories from DB:", error);
      // Don't throw - allow app to continue with empty categories
    }
  },
}));


