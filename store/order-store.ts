"use client";

import { create } from "zustand";
import type { Order, OrderFilters, OrderStatus, PaymentStatus } from "@/types/order";
import { logger } from "@/lib/logger-client";
import { useAuthStore } from "@/store/auth-store";

interface OrderStore {
  orders: Order[];
  filters: OrderFilters;
  isLoading: boolean;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, orderData: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
  setFilters: (filters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  loadOrdersFromDB: () => Promise<void>;
}

const defaultFilters: OrderFilters = {};

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  filters: defaultFilters,
  isLoading: false,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) =>
    set((state) => {
      const existingIndex = state.orders.findIndex((o) => o.id === order.id);
      if (existingIndex >= 0) {
        // Update existing order
        const updatedOrders = [...state.orders];
        updatedOrders[existingIndex] = order;
        return { orders: updatedOrders };
      }
      // Add new order
      return { orders: [...state.orders, order] };
    }),

  updateOrder: (id, orderData) =>
    set((state) => {
      const existingIndex = state.orders.findIndex((o) => o.id === id);
      if (existingIndex >= 0) {
        const updatedOrders = [...state.orders];
        updatedOrders[existingIndex] = {
          ...updatedOrders[existingIndex],
          ...orderData,
        };
        return { orders: updatedOrders };
      }
      return state;
    }),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date() } : o
      ),
    })),

  updatePaymentStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, paymentStatus: status, updatedAt: new Date() } : o
      ),
    })),

  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    })),

  getOrder: (id) => {
    const state = get();
    return state.orders.find((o) => o.id === id);
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  loadOrdersFromDB: async () => {
    set({ isLoading: true });
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      // استفاده از fetchWithAuth برای ارسال header های احراز هویت
      const { fetchWithAuth } = await import("@/lib/api/fetch-with-auth");
      logger.debug("Loading orders from database...");
      
      // Log auth state before request
      const authState = useAuthStore.getState();
      console.log('[OrderStore] Auth state before request:', {
        isAuthenticated: authState.isAuthenticated,
        hasUser: !!authState.user,
        userId: authState.user?.id,
        hasCheckedAuth: authState.hasCheckedAuth,
      });
      
      // Prepare headers
      const headers: HeadersInit = {
        "Cache-Control": "no-cache",
      };
      
      // Send userId in header as fallback if session cookie fails
      // This ensures admin can access orders even if session cookie has issues
      if (authState.user?.id) {
        headers['x-user-id'] = authState.user.id;
        console.log('[OrderStore] Adding userId header (fallback):', authState.user.id);
      }
      
      const response = await fetchWithAuth("/api/orders", {
        signal: controller.signal,
        credentials: "include", // Ensure session cookies are sent
        cache: "no-store", // Don't cache
        headers,
      });
      
      console.log('[OrderStore] Response status:', response.status);
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          logger.error("Error parsing orders response:", parseError);
          set({ orders: [], isLoading: false });
          return;
        }
        
        console.log('[OrderStore] Response from /api/orders:', {
          success: result.success,
          dataLength: result.data?.length || 0,
          hasData: !!result.data,
        });
        
        if (result.success && result.data) {
          try {
            // Parse dates and ensure proper structure
            const parsedOrders: Order[] = result.data.map((o: any) => {
              let items = [];
              let shippingAddress = {};
              
              try {
                items = Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []);
              } catch (e) {
                logger.warn("Error parsing items for order:", o.id, e);
                items = [];
              }
              
              try {
                shippingAddress = typeof o.shippingAddress === 'object' && o.shippingAddress !== null 
                  ? o.shippingAddress 
                  : (typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : {});
              } catch (e) {
                logger.warn("Error parsing shippingAddress for order:", o.id, e);
                shippingAddress = {};
              }
              
              return {
                ...o,
                items,
                shippingAddress,
                total: Number(o.total) || 0,
                shippingCost: Number(o.shippingCost) || 0,
                createdAt: o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt),
                updatedAt: o.updatedAt instanceof Date ? o.updatedAt : new Date(o.updatedAt),
              };
            });
            logger.info(`✅ Loaded ${parsedOrders.length} orders from database`);
            set({ orders: parsedOrders, isLoading: false });
          } catch (parseError) {
            logger.error("Error parsing orders data:", parseError);
            set({ orders: [], isLoading: false });
          }
        } else {
          // Empty result is valid
          logger.info("No orders found in database");
          set({ orders: [], isLoading: false });
        }
      } else {
        const errorText = await response.text().catch(() => "Unknown error");
        logger.error(`Failed to load orders: ${response.status} - ${errorText}`);
        
        // If 401 (Unauthorized), don't show error - user will be redirected by ProtectedRoute
        if (response.status === 401) {
          set({ orders: [], isLoading: false });
          return;
        }
        
        // Set empty orders and stop loading on error
        set({ orders: [], isLoading: false });
      }
    } catch (error) {
      // Handle network errors, timeouts, etc.
      if (error instanceof Error && error.name !== 'AbortError') {
        logger.error("Error loading orders from DB:", error);
      }
      // Always set isLoading to false, even on error
      set({ orders: [], isLoading: false });
    }
  },
}));

