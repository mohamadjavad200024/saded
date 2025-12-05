"use client";

import { create } from "zustand";
import { useProductStore } from "./product-store";
import { useCategoryStore } from "./category-store";
import { logger } from "@/lib/logger-client";

interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  lowStockProducts: number;
  totalCategories: number;
  activeCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averagePrice: number;
}

interface AdminSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  lowStockThreshold: number;
}

interface AdminStore {
  stats: AdminStats | null;
  isLoading: boolean;
  settings: AdminSettings;
  
  // Actions
  refreshStats: () => void;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AdminSettings = {
  siteName: "ساد",
  siteDescription: "فروشگاه آنلاین قطعات خودرو وارداتی",
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  lowStockThreshold: 10,
};

const defaultStats: AdminStats = {
  totalProducts: 0,
  activeProducts: 0,
  totalStock: 0,
  lowStockProducts: 0,
  totalCategories: 0,
  activeCategories: 0,
  totalOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  averagePrice: 0,
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  stats: null,
  isLoading: false,
  settings: defaultSettings,

  refreshStats: async () => {
    set({ isLoading: true });
    
    try {
      // Get data from stores
      const productStore = useProductStore.getState();
      const categoryStore = useCategoryStore.getState();
      
      const products = productStore.products;
      const categories = categoryStore.categories;
      
      // Calculate stats from store data
      const enabledProducts = products.filter((p) => p.enabled);
      const totalPrice = enabledProducts.reduce((sum, p) => sum + (p.price || 0), 0);
      const averagePrice = enabledProducts.length > 0 ? totalPrice / enabledProducts.length : 0;
      
      const stats: AdminStats = {
        totalProducts: products.length,
        activeProducts: enabledProducts.length,
        totalStock: products.reduce((sum, p) => sum + p.stockCount, 0),
        lowStockProducts: products.filter((p) => p.stockCount < get().settings.lowStockThreshold).length,
        totalCategories: categories.length,
        activeCategories: categories.filter((c) => c.isActive && c.enabled).length,
        totalOrders: 0, // Will be updated when order store is available
        pendingOrders: 0, // Will be updated when order store is available
        totalRevenue: 0, // Will be updated when order store is available
        averagePrice: Math.round(averagePrice),
      };
      
      // Try to fetch additional stats from API if available
      try {
        const response = await fetch("/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const orders = result.data;
            stats.totalOrders = orders.length;
            stats.pendingOrders = orders.filter((o: any) => 
              o.status === "pending" || o.paymentStatus === "pending"
            ).length;
            stats.totalRevenue = orders
              .filter((o: any) => o.paymentStatus === "paid")
              .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
          }
        }
      } catch (error) {
        // API not available, use default values
        logger.warn("Could not fetch order stats:", error);
      }
      
      set({ stats, isLoading: false });
    } catch (error) {
      logger.error("Error refreshing stats:", error);
      set({ stats: defaultStats, isLoading: false });
    }
  },

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  resetSettings: () => set({ settings: defaultSettings }),
}));


