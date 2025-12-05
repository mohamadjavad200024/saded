"use client";

import { create } from "zustand";
import type { Product, ProductFilters } from "@/types/product";
import { logger } from "@/lib/logger-client";

interface ProductStore {
  products: Product[];
  filters: ProductFilters;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getEnabledProducts: () => Product[];
  getFilteredProducts: () => Product[];
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  
  // Additional actions for product table
  deleteProduct: (id: string) => Promise<void>;
  deleteProducts: (ids: string[]) => Promise<void>;
  toggleProduct: (id: string) => Promise<void>;
  toggleProducts: (ids: string[], enabled: boolean) => Promise<void>;
  
  // Async API sync methods (optional - for direct API calls with store sync)
  createProduct: (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<Product>;
  updateProductInDB: (id: string, productData: Partial<Product>) => Promise<Product>;
  deleteProductFromDB: (id: string) => Promise<void>;
  loadProductsFromDB: (includeInactive?: boolean) => Promise<void>;
}

const defaultFilters: ProductFilters = {};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filters: defaultFilters,

  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => {
      const existingIndex = state.products.findIndex((p) => p.id === product.id);
      if (existingIndex >= 0) {
        // Update existing product
        const updatedProducts = [...state.products];
        updatedProducts[existingIndex] = product;
        return { products: updatedProducts };
      }
      // Add new product
      return { products: [...state.products, product] };
    }),

  updateProduct: (product) =>
    set((state) => {
      const existingIndex = state.products.findIndex((p) => p.id === product.id);
      if (existingIndex >= 0) {
        const updatedProducts = [...state.products];
        updatedProducts[existingIndex] = product;
        return { products: updatedProducts };
      }
      return state;
    }),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  getProduct: (id) => {
    const state = get();
    return state.products.find((p) => p.id === id);
  },

  getEnabledProducts: () => {
    const state = get();
    return state.products.filter((p) => p.enabled);
  },

  getFilteredProducts: () => {
    const state = get();
    const { products, filters } = state;
    
    let filtered = products.filter((p) => p.enabled);

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower)
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Apply brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(
        (p) => p.brand && filters.brands!.includes(p.brand)
      );
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(
        (p) => p.category && filters.categories!.includes(p.category)
      );
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      filtered = filtered.filter((p) => p.inStock === filters.inStock);
    }

    return filtered;
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  // Async API sync methods
  createProduct: async (productData) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "خطا در ایجاد محصول");
    }

    const result = await response.json();
    const newProduct = result.data;
    get().addProduct(newProduct);
    return newProduct;
  },

  updateProductInDB: async (id, productData) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "خطا در به‌روزرسانی محصول");
    }

    const result = await response.json();
    const updatedProduct = result.data;
    get().updateProduct(updatedProduct);
    return updatedProduct;
  },

  deleteProductFromDB: async (id) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "خطا در حذف محصول");
    }

    get().removeProduct(id);
  },

  loadProductsFromDB: async (includeInactive: boolean = false) => {
    try {
      // For admin pages, we need all products (including inactive ones)
      const url = includeInactive ? "/api/products?limit=1000&all=true" : "/api/products?limit=1000";
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.message || "خطا در بارگذاری محصولات";
        throw new Error(errorMessage);
      }
      const result = await response.json();
      const products = (result.data || []).map((product: any) => ({
        ...product,
        createdAt: product.createdAt instanceof Date 
          ? product.createdAt 
          : new Date(product.createdAt),
        updatedAt: product.updatedAt instanceof Date 
          ? product.updatedAt 
          : new Date(product.updatedAt),
      }));
      get().setProducts(products);
    } catch (error) {
      logger.error("Error loading products from DB:", error);
      // Don't throw - allow app to continue with empty products
    }
  },

  // Additional actions for product table
  deleteProduct: async (id) => {
    await get().deleteProductFromDB(id);
  },

  deleteProducts: async (ids) => {
    await Promise.all(ids.map((id) => get().deleteProductFromDB(id)));
  },

  toggleProduct: async (id) => {
    const product = get().getProduct(id);
    if (product) {
      await get().updateProductInDB(id, { enabled: !product.enabled });
    }
  },

  toggleProducts: async (ids, enabled) => {
    await Promise.all(
      ids.map((id) => get().updateProductInDB(id, { enabled }))
    );
  },
}));


