"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logger } from "@/lib/logger-client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  shippingMethod: "air" | "sea" | null;
  sessionId: string | null;
  
  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setShippingMethod: (method: "air" | "sea" | null) => void;
  syncToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
  initializeSession: () => void;
}

// Helper function to optimize image URL (truncate if too long, remove base64 data)
function optimizeImageUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return "";
  }
  
  // If it's a base64 data URL, only keep if it's small
  if (url.startsWith("data:image")) {
    // Keep small base64 images (under 50KB to avoid quota issues)
    if (url.length < 50000) {
      return url;
    }
    // For large base64, return empty - we'll fetch from product when displaying
    return "";
  }
  
  // For regular URLs (http/https), always keep them - they're usually short
  // URLs are typically under 500 chars, so we can keep them as-is
  // Only truncate extremely long URLs (keep first 2000 chars)
  if (url.length > 2000) {
    logger.warn("Very long image URL detected, truncating:", url.substring(0, 100));
    return url.substring(0, 2000);
  }
  return url;
}

// Helper function to optimize cart items before storing
function optimizeCartItems(items: CartItem[]): CartItem[] {
  // Limit to 100 items max
  const limitedItems = items.slice(0, 100);
  
  // Optimize image URLs
  return limitedItems.map(item => ({
    ...item,
    image: optimizeImageUrl(item.image),
  }));
}

// Custom storage with error handling
const customStorage = createJSONStorage<Pick<CartStore, 'items' | 'shippingMethod' | 'sessionId'>>(() => {
  const baseStorage = {
    getItem: (name: string): string | null => {
      // Check if we're in browser environment
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return null;
      }
      try {
        return localStorage.getItem(name);
      } catch (error) {
        logger.error("Error reading from localStorage:", error);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      // Check if we're in browser environment
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return;
      }
      try {
        // Check if data is too large (localStorage limit is usually 5-10MB)
        const sizeInBytes = new Blob([value]).size;
        const maxSize = 4 * 1024 * 1024; // 4MB limit (leave some room)
        
        if (sizeInBytes > maxSize) {
          logger.warn("Cart data too large, clearing old items");
          // Try to reduce by removing oldest items
          try {
            const data = JSON.parse(value);
            if (data.state?.items && Array.isArray(data.state.items)) {
              // Keep only last 50 items
              data.state.items = data.state.items.slice(-50);
              const optimized = JSON.stringify(data);
              const optimizedSize = new Blob([optimized]).size;
              
              if (optimizedSize < maxSize) {
                localStorage.setItem(name, optimized);
                return;
              }
            }
          } catch (e) {
            // If parsing fails, clear the storage
          }
          
          // If still too large, clear it
          localStorage.removeItem(name);
          throw new Error("QUOTA_EXCEEDED");
        }
        
        localStorage.setItem(name, value);
      } catch (error: any) {
        if (error?.name === "QuotaExceededError" || error?.message === "QUOTA_EXCEEDED") {
          logger.error("localStorage quota exceeded. Clearing cart data.");
          // Clear old cart data and try again with empty cart
          try {
            localStorage.removeItem(name);
            const emptyCart = JSON.stringify({
              state: { items: [], shippingMethod: null },
              version: 0,
            });
            localStorage.setItem(name, emptyCart);
          } catch (e) {
            logger.error("Failed to clear localStorage:", e);
          }
          throw error;
        }
        logger.error("Error writing to localStorage:", error);
      }
    },
    removeItem: (name: string): void => {
      // Check if we're in browser environment
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return;
      }
      try {
        localStorage.removeItem(name);
      } catch (error) {
        logger.error("Error removing from localStorage:", error);
      }
    },
  };
  
  return baseStorage as any;
});

// Helper function to get or create session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("cart-session-id");
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("cart-session-id", sessionId);
  }
  return sessionId;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingMethod: null,
      sessionId: null,

      initializeSession: () => {
        if (typeof window !== "undefined") {
          const sessionId = getSessionId();
          set({ sessionId });
        }
      },

      syncToDatabase: async () => {
        try {
          const state = get();
          const sessionId = state.sessionId || getSessionId();
          
          if (!sessionId) {
            logger.warn("No session ID, skipping database sync");
            return;
          }

          // For database sync, we want to keep images as-is (don't optimize)
          // Only optimize for localStorage to avoid quota issues
          // Database can handle larger data, so we keep original images
          const itemsForDB = state.items.map(item => {
            // Log for debugging
            logger.debug("Syncing item to DB:", {
              id: item.id,
              name: item.name,
              hasImage: !!item.image,
              imageLength: item.image?.length || 0,
              imageType: item.image?.startsWith("data:") ? "base64" : "url",
            });
            return {
              ...item,
              // Keep original image for database - don't optimize
              // If image is a large base64, we'll still store it in DB (DB can handle it)
              // But we won't store it in localStorage
            };
          });

          const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: itemsForDB,
              shippingMethod: state.shippingMethod,
              sessionId,
            }),
          });

          if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            let errorData: any = null;
            try {
              errorData = await response.json();
              if (errorData && typeof errorData === 'object') {
                errorMessage = errorData.error || errorData.message || errorMessage;
              }
            } catch (parseError) {
              // If JSON parsing fails, use the status text
              try {
                const text = await response.text();
                if (text) {
                  errorMessage = `${errorMessage} - ${text.substring(0, 100)}`;
                }
              } catch (textError) {
                // If text parsing also fails, just use the status
                logger.warn("Could not parse error response", { status: response.status });
              }
            }
            
            // Only log if it's a real error (not 200-299 range)
            if (response.status >= 400) {
              const errorInfo: any = {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
                sessionId: sessionId || 'unknown',
                itemCount: itemsForDB.length,
              };
              
              // Add error data if available
              if (errorData) {
                errorInfo.errorData = errorData;
              }
              
              logger.error("Failed to sync cart to database:", errorInfo);
            }
          } else {
            try {
              const result = await response.json();
              if (result && result.success) {
                if (process.env.NODE_ENV === "development") {
                  logger.debug("Cart synced to database successfully", {
                    sessionId,
                    itemCount: itemsForDB.length,
                  });
                }
              }
            } catch (parseError) {
              // If response is ok but JSON parsing fails, it might be empty response
              // This is not necessarily an error, so we don't log it
            }
          }
        } catch (error) {
          // Only log if it's a real error (not network errors that are expected)
          if (error instanceof Error) {
            // Don't log network errors in production (they're expected when offline)
            if (process.env.NODE_ENV === "development" || 
                (!error.message.includes("fetch") && !error.message.includes("network"))) {
              logger.error("Error syncing cart to database:", {
                message: error.message,
                name: error.name,
                sessionId: get().sessionId || getSessionId(),
              });
            }
          } else {
            // Build error info for non-Error objects
            const errorInfo: any = {
              sessionId: get().sessionId || getSessionId() || 'unknown',
              itemCount: get().items.length,
            };
            
            if (error && typeof error === 'object') {
              errorInfo.error = error;
              const errorObj = error as { message?: string; code?: string; status?: number };
              errorInfo.message = errorObj.message || error.toString() || 'Unknown error';
              if (errorObj.code) errorInfo.code = errorObj.code;
              if (errorObj.status) errorInfo.status = errorObj.status;
            } else {
              errorInfo.message = String(error) || 'Unknown error';
            }
            
            logger.error("Failed to sync cart to database:", errorInfo);
          }
          // Don't throw - allow app to continue with localStorage
        }
      },

      loadFromDatabase: async () => {
        try {
          const sessionId = getSessionId();
          if (!sessionId) {
            return;
          }

          const response = await fetch("/api/cart", {
            headers: {
              "x-cart-session-id": sessionId,
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              logger.debug("Cart loaded from database:", {
                itemCount: result.data.items?.length || 0,
                sessionId,
              });
              // Ensure all items have images - if image is empty, we'll fetch from product store
              const itemsWithImages = (result.data.items || []).map((item: CartItem) => {
                // If image is empty or invalid, keep it empty - will be fetched from product store
                if (!item.image || item.image.trim() === "") {
                  return item; // Keep as is, will be handled in component
                }
                return item;
              });
              
              set({
                items: itemsWithImages,
                shippingMethod: result.data.shippingMethod || null,
                sessionId,
              });
            } else {
              logger.debug("No cart data in response or empty cart");
            }
          } else {
            let errorMessage = `HTTP ${response.status}`;
            try {
              const errorData = await response.json();
              if (errorData && typeof errorData === 'object') {
                errorMessage = errorData.error || errorData.message || errorMessage;
              }
            } catch (parseError) {
              // If JSON parsing fails, try to get text
              const text = await response.text().catch(() => '');
              if (text) {
                errorMessage = `${errorMessage} - ${text.substring(0, 100)}`;
              }
            }
            
            // Only log if it's a real error (not 200-299 range)
            if (response.status >= 400) {
              logger.error("Failed to load cart from database:", {
                status: response.status,
                error: errorMessage,
                sessionId,
              });
            }
          }
        } catch (error) {
          // Only log if it's a real error (not network errors that are expected)
          if (error instanceof Error) {
            // Don't log network errors in production (they're expected when offline)
            if (process.env.NODE_ENV === "development" || 
                (!error.message.includes("fetch") && !error.message.includes("network"))) {
              logger.error("Error loading cart from database:", {
                message: error.message,
                name: error.name,
                sessionId: getSessionId(),
              });
            }
          } else {
            logger.error("Error loading cart from database:", error);
          }
          // Don't throw - allow app to continue with localStorage
        }
      },

      addItem: (item) => {
        try {
          set((state) => {
            // Limit cart to 100 items
            if (state.items.length >= 100) {
              logger.warn("Cart limit reached (100 items). Please remove some items.");
              return state;
            }
            
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
              // Update quantity if item already exists
              return {
                items: state.items.map((i) =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                    : i
                ),
              };
            }
            // Add new item - keep original image (don't optimize here)
            // Optimization only happens in partialize for localStorage
            const newState = {
              items: [
                ...state.items,
                {
                  ...item,
                  image: item.image || "", // Keep original image
                  quantity: item.quantity || 1,
                },
              ],
            };
            
            // Sync to database after state update
            setTimeout(() => {
              get().syncToDatabase();
            }, 100);
            
            return newState;
          });
        } catch (error: any) {
          if (error?.name === "QuotaExceededError") {
            logger.error("Storage quota exceeded. Please clear your cart.");
            // Optionally show a toast notification to the user
          }
          throw error;
        }
      },

      updateQuantity: (id, quantity) => {
        try {
          set((state) => {
            if (quantity <= 0) {
              // Remove item if quantity is 0 or less
              return {
                items: state.items.filter((i) => i.id !== id),
              };
            }
            // Update quantity
            const newState = {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity } : i
              ),
            };
            
            // Sync to database after state update
            setTimeout(() => {
              get().syncToDatabase();
            }, 100);
            
            return newState;
          });
        } catch (error: any) {
          if (error?.name === "QuotaExceededError") {
            logger.error("Storage quota exceeded. Please clear your cart.");
          }
          throw error;
        }
      },

      removeItem: (id) => {
        set((state) => {
          const newState = {
            items: state.items.filter((i) => i.id !== id),
          };
          
          // Sync to database after state update
          setTimeout(() => {
            get().syncToDatabase();
          }, 100);
          
          return newState;
        });
      },

      clearCart: () => {
        set({
          items: [],
          shippingMethod: null,
        });
        // Sync to database after clearing
        setTimeout(() => {
          get().syncToDatabase();
        }, 100);
      },

      getTotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },

      setShippingMethod: (method) => {
        set({ shippingMethod: method });
        // Sync to database after updating shipping method
        setTimeout(() => {
          get().syncToDatabase();
        }, 100);
      },
    }),
    {
      name: "cart-storage", // localStorage key
      storage: customStorage,
      partialize: (state) => {
        // Optimize items before storing
        const optimizedItems = optimizeCartItems(state.items);
        return {
          items: optimizedItems,
          shippingMethod: state.shippingMethod,
          sessionId: state.sessionId,
        };
      },
    }
  )
);


