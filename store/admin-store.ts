"use client";

import { create } from "zustand";
import { useProductStore } from "./product-store";
import { useCategoryStore } from "./category-store";
import { useOrderStore } from "./order-store";
import { useAuthStore } from "./auth-store";
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
  logoUrl?: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  lowStockThreshold: number;
  itemsPerPage?: number;
  showNotifications?: boolean;
  theme?: string;
  lastUpdated?: string;
}

interface AdminStore {
  stats: AdminStats | null;
  isLoading: boolean;
  settings: AdminSettings;
  
  // Actions
  refreshStats: () => void;
  updateSettings: (newSettings: Partial<AdminSettings>, saveToAPI?: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings: AdminSettings = {
  siteName: "ساد",
  siteDescription: "فروشگاه آنلاین قطعات خودرو وارداتی",
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  lowStockThreshold: 10,
  itemsPerPage: 10,
  showNotifications: true,
  theme: "system",
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

// Load settings from API on initialization
const loadSettingsFromAPI = async (): Promise<AdminSettings> => {
  if (typeof window === "undefined") {
    return defaultSettings;
  }
  
  try {
    const response = await fetch("/api/site-settings", {
      credentials: "include", // Include cookies for session authentication
    });
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return {
          ...defaultSettings,
          siteName: result.data.siteName || defaultSettings.siteName,
          siteDescription: result.data.siteDescription || defaultSettings.siteDescription,
          logoUrl: result.data.logoUrl || defaultSettings.logoUrl,
          maintenanceMode: result.data.maintenanceMode ?? defaultSettings.maintenanceMode,
          allowRegistration: result.data.allowRegistration ?? defaultSettings.allowRegistration,
          emailNotifications: result.data.emailNotifications ?? defaultSettings.emailNotifications,
          lowStockThreshold: result.data.lowStockThreshold ?? defaultSettings.lowStockThreshold,
          itemsPerPage: result.data.itemsPerPage ?? defaultSettings.itemsPerPage,
          showNotifications: result.data.showNotifications ?? defaultSettings.showNotifications,
          theme: result.data.theme || defaultSettings.theme,
        };
      }
    }
  } catch (error) {
    console.error("Error loading admin settings from API:", error);
  }
  
  return defaultSettings;
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
      const orderStore = useOrderStore.getState();
      
      const products = productStore.products;
      const categories = categoryStore.categories;
      const orders = orderStore.orders;
      
      // Calculate stats from store data
      const enabledProducts = products.filter((p) => p.enabled);
      const totalPrice = enabledProducts.reduce((sum, p) => sum + (p.price || 0), 0);
      const averagePrice = enabledProducts.length > 0 ? totalPrice / enabledProducts.length : 0;
      
      // Calculate order stats from order store
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => 
        o.status === "pending" || o.paymentStatus === "pending"
      ).length;
      const totalRevenue = orders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + (o.total + o.shippingCost), 0);
      
      const stats: AdminStats = {
        totalProducts: products.length,
        activeProducts: enabledProducts.length,
        totalStock: products.reduce((sum, p) => sum + p.stockCount, 0),
        lowStockProducts: products.filter((p) => p.stockCount < get().settings.lowStockThreshold).length,
        totalCategories: categories.length,
        activeCategories: categories.filter((c) => c.isActive && c.enabled).length,
        totalOrders,
        pendingOrders,
        totalRevenue,
        averagePrice: Math.round(averagePrice),
      };
      
      set({ stats, isLoading: false });
    } catch (error) {
      logger.error("Error refreshing stats:", error);
      set({ stats: defaultStats, isLoading: false });
    }
  },

  updateSettings: (newSettings, saveToAPI = true) => {
    const updatedSettings = { ...get().settings, ...newSettings };
    set({ settings: updatedSettings });
    
    // Save to API (database) in background - only if saveToAPI is true
    // This prevents PUT requests when loading settings from API
    if (saveToAPI && typeof window !== "undefined") {
      // #region agent log
      const cookies = document.cookie;
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin-store.ts:164',message:'Client: About to send PUT request',data:{hasCookies:!!cookies,cookieCount:(cookies.match(/;/g)||[]).length+1,hasSadedSession:cookies.includes('saded_session'),saveToAPI},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      
      // Get user from auth store to send userId header as fallback
      const authState = useAuthStore.getState();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      // Add userId header as fallback if session cookie fails
      if (authState.user?.id) {
        headers['x-user-id'] = authState.user.id;
      }
      
      fetch("/api/site-settings", {
        method: "PUT",
        credentials: "include", // Include cookies for session authentication
        headers,
        body: JSON.stringify(updatedSettings),
      }).then((response) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin-store.ts:175',message:'Client: PUT response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        if (!response.ok) {
          return response.json().then((err) => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin-store.ts:179',message:'Client: PUT error response',data:{status:response.status,error:err},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
            // #endregion
            throw new Error(err.error || 'Request failed');
          });
        }
        
        // Save to localStorage for Header/Sidebar components
        try {
          localStorage.setItem("admin_site_settings", JSON.stringify(updatedSettings));
        } catch (storageError) {
          console.warn("Failed to save settings to localStorage:", storageError);
        }
        
        // Dispatch event to notify other components
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("settingsUpdated"));
        }
      }).catch((error) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin-store.ts:186',message:'Client: PUT request failed',data:{error:error?.message||'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
        // #endregion
        console.error("Error saving admin settings to API:", error);
      });
    } else if (!saveToAPI) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6e2493c0-cc8b-4c0b-9456-c04638b7e615',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin-store.ts:206',message:'Client: updateSettings called with saveToAPI=false (loading from API)',data:{saveToAPI},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'O'})}).catch(()=>{});
      // #endregion
    }
  },

  resetSettings: () => {
    set({ settings: defaultSettings });
  },
}));

// Load settings from API on mount
if (typeof window !== "undefined") {
  loadSettingsFromAPI().then((settings) => {
    // Pass saveToAPI=false to prevent PUT request when loading settings
    useAdminStore.getState().updateSettings(settings, false);
    
    // Also save to localStorage for Header/Sidebar components
    try {
      localStorage.setItem("admin_site_settings", JSON.stringify(settings));
    } catch (storageError) {
      console.warn("Failed to save settings to localStorage:", storageError);
    }
  });
  
  // Listen for custom settingsUpdated event to reload from API
  window.addEventListener("settingsUpdated", () => {
    loadSettingsFromAPI().then((settings) => {
      // Pass saveToAPI=false to prevent PUT request when loading settings
      useAdminStore.getState().updateSettings(settings, false);
    });
  });
}


