"use client";

import { create } from "zustand";
import type { Product, ProductFilters } from "@/types/product";
import { logger } from "@/lib/logger-client";
import { validateImageUrl, normalizeImageUrl } from "@/lib/image-utils";
import { normalizeImages, normalizeSpecifications } from "@/lib/product-utils";

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

  setProducts: (products) => {
    // Validate and normalize images for all products - be more lenient with base64
    const validatedProducts = products.map((product) => {
      // First, normalize images (this handles parsing JSON strings into arrays)
      const normalizedImages = normalizeImages(product.images);
      
      // Then validate and normalize each image URL
      const validatedImages = normalizedImages
        .map((img) => {
          if (!img || typeof img !== 'string') return null;
          const trimmed = img.trim();
          if (trimmed === '') return null;
          
          // For base64 images, validate directly without normalization
          if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) {
            if (trimmed.includes(';base64,') && trimmed.length > 50) {
              return trimmed; // Accept base64 images with basic validation
            } else if (trimmed.startsWith('data:image') && trimmed.length > 50) {
              // Even without ;base64,, if it's data:image and long enough, accept it
              return trimmed;
            }
            return null;
          }
          
          // For other URLs (http, https, blob, relative), normalize and validate
          const normalized = normalizeImageUrl(trimmed);
          if (!normalized) return null;
          return validateImageUrl(normalized) ? normalized : null;
        })
        .filter((img): img is string => img !== null);
      
      return {
        ...product,
        images: validatedImages,
      };
    });
    set({ products: validatedProducts });
  },

  addProduct: (product) =>
    set((state) => {
      // First, normalize images (this handles parsing JSON strings into arrays)
      const normalizedImages = normalizeImages(product.images);
      
      // Then validate and normalize each image URL - be more lenient with base64
      const validatedImages = normalizedImages
        .map((img) => {
          if (!img || typeof img !== 'string') return null;
          const trimmed = img.trim();
          if (trimmed === '') return null;
          
          // For base64 images, validate directly without normalization
          if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) {
            if (trimmed.includes(';base64,') && trimmed.length > 50) {
              return trimmed; // Accept base64 images with basic validation
            } else if (trimmed.startsWith('data:image') && trimmed.length > 50) {
              // Even without ;base64,, if it's data:image and long enough, accept it
              return trimmed;
            }
            return null;
          }
          
          // For other URLs (http, https, blob, relative), normalize and validate
          const normalized = normalizeImageUrl(trimmed);
          if (!normalized) return null;
          return validateImageUrl(normalized) ? normalized : null;
        })
        .filter((img): img is string => img !== null);
      
      const validatedProduct = {
        ...product,
        images: validatedImages,
        // Ensure boolean fields are properly converted from numbers (0/1) to booleans
        inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
        enabled: product.enabled !== undefined ? Boolean(product.enabled) : true,
        vinEnabled: product.vinEnabled !== undefined ? Boolean(product.vinEnabled) : false,
        airShippingEnabled: product.airShippingEnabled !== undefined ? Boolean(product.airShippingEnabled) : true,
        seaShippingEnabled: product.seaShippingEnabled !== undefined ? Boolean(product.seaShippingEnabled) : true,
      };

      const existingIndex = state.products.findIndex((p) => p.id === validatedProduct.id);
      if (existingIndex >= 0) {
        // Update existing product
        const updatedProducts = [...state.products];
        updatedProducts[existingIndex] = validatedProduct;
        return { products: updatedProducts };
      }
      // Add new product
      return { products: [...state.products, validatedProduct] };
    }),

  updateProduct: (product) =>
    set((state) => {
      // First, normalize images (this handles parsing JSON strings into arrays)
      const normalizedImages = normalizeImages(product.images);
      
      // Then validate and normalize each image URL - be more lenient with base64
      const validatedImages = normalizedImages
        .map((img) => {
          if (!img || typeof img !== 'string') return null;
          const trimmed = img.trim();
          if (trimmed === '') return null;
          
          // For base64 images, validate directly without normalization
          if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) {
            if (trimmed.includes(';base64,') && trimmed.length > 50) {
              return trimmed; // Accept base64 images with basic validation
            } else if (trimmed.startsWith('data:image') && trimmed.length > 50) {
              // Even without ;base64,, if it's data:image and long enough, accept it
              return trimmed;
            }
            return null;
          }
          
          // For other URLs (http, https, blob, relative), normalize and validate
          const normalized = normalizeImageUrl(trimmed);
          if (!normalized) return null;
          return validateImageUrl(normalized) ? normalized : null;
        })
        .filter((img): img is string => img !== null);
      
      const validatedProduct = {
        ...product,
        images: validatedImages,
        // Ensure boolean fields are properly converted from numbers (0/1) to booleans
        inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
        enabled: product.enabled !== undefined ? Boolean(product.enabled) : true,
        vinEnabled: product.vinEnabled !== undefined ? Boolean(product.vinEnabled) : false,
        airShippingEnabled: product.airShippingEnabled !== undefined ? Boolean(product.airShippingEnabled) : true,
        seaShippingEnabled: product.seaShippingEnabled !== undefined ? Boolean(product.seaShippingEnabled) : true,
      };

      const existingIndex = state.products.findIndex((p) => p.id === validatedProduct.id);
      if (existingIndex >= 0) {
        const updatedProducts = [...state.products];
        updatedProducts[existingIndex] = validatedProduct;
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

    // Apply search filter - search in all relevant fields
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) => {
          // Search in name
          if (p.name?.toLowerCase().includes(searchLower)) return true;
          // Search in description
          if (p.description?.toLowerCase().includes(searchLower)) return true;
          // Search in brand
          if (p.brand?.toLowerCase().includes(searchLower)) return true;
          // Search in category
          if (p.category?.toLowerCase().includes(searchLower)) return true;
          // Search in VIN
          if (p.vin?.toLowerCase().includes(searchLower)) return true;
          // Search in tags (if array)
          if (Array.isArray(p.tags) && p.tags.some(tag => tag?.toLowerCase().includes(searchLower))) return true;
          // Search in specifications (if object)
          if (p.specifications && typeof p.specifications === 'object') {
            const specString = JSON.stringify(p.specifications).toLowerCase();
            if (specString.includes(searchLower)) return true;
          }
          return false;
        }
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

    // Apply vehicle filter
    if (filters.vehicle) {
      filtered = filtered.filter((p) => p.vehicle === filters.vehicle);
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      filtered = filtered.filter((p) => p.inStock === filters.inStock);
    }

    return filtered;
  },

  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters };
      
      // Apply new filters
      Object.keys(newFilters).forEach((key) => {
        const value = newFilters[key as keyof ProductFilters];
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
          // Remove filter if undefined, null, or empty array
          delete updatedFilters[key as keyof ProductFilters];
        } else {
          // Set filter value
          (updatedFilters as any)[key] = value;
        }
      });
      
      return { filters: updatedFilters };
    }),

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
      
      // Debug: Log raw API response
      if (process.env.NODE_ENV === 'development') {
        console.log('[ProductStore] Raw API response:', {
          success: result.success,
          dataLength: result.data?.length || 0,
          firstProduct: result.data?.[0] ? {
            id: result.data[0].id,
            name: result.data[0].name,
            imagesRaw: result.data[0].images,
            imagesType: typeof result.data[0].images,
            imagesIsArray: Array.isArray(result.data[0].images),
            imagesLength: Array.isArray(result.data[0].images) ? result.data[0].images.length : 0,
            firstImagePreview: Array.isArray(result.data[0].images) && result.data[0].images[0] 
              ? result.data[0].images[0].substring(0, 100) 
              : null,
          } : null,
        });
      }
      
      const products = (result.data || []).map((product: any) => {
        // First, normalize images (this handles parsing JSON strings into arrays)
        const normalizedImages = normalizeImages(product.images);
        
        // Then validate and normalize each image URL - be more lenient with base64
        let validatedImages: string[] = normalizedImages
          .map((img: string) => {
            if (!img || typeof img !== 'string') {
              if (process.env.NODE_ENV === 'development') {
                console.warn('[ProductStore] Invalid image (not string):', { img, type: typeof img });
              }
              return null;
            }
            const trimmed = img.trim();
            if (trimmed === '') {
              if (process.env.NODE_ENV === 'development') {
                console.warn('[ProductStore] Invalid image (empty after trim)');
              }
              return null;
            }
            
            // For base64 images, validate directly without normalization
            if (trimmed.startsWith('data:image') || trimmed.startsWith('data:')) {
              // Just check basic structure for base64
              if (trimmed.includes(';base64,') && trimmed.length > 50) {
                if (process.env.NODE_ENV === 'development') {
                  console.log('[ProductStore] Accepted base64 image:', {
                    length: trimmed.length,
                    preview: trimmed.substring(0, 50),
                  });
                }
                return trimmed; // Accept base64 images with basic validation
              } else if (trimmed.startsWith('data:image') && trimmed.length > 50) {
                // Even without ;base64,, if it's data:image and long enough, accept it
                if (process.env.NODE_ENV === 'development') {
                  console.log('[ProductStore] Accepted base64 image (without ;base64,):', {
                    length: trimmed.length,
                    preview: trimmed.substring(0, 50),
                  });
                }
                return trimmed;
              } else {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('[ProductStore] Rejected base64 image (invalid structure):', {
                    hasBase64: trimmed.includes(';base64,'),
                    length: trimmed.length,
                    preview: trimmed.substring(0, 50),
                  });
                }
                return null;
              }
            }
            
            // For other URLs (http, https, blob, relative), normalize and validate
            const normalized = normalizeImageUrl(trimmed);
            if (!normalized) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('[ProductStore] Rejected image (normalization failed):', {
                  original: trimmed.substring(0, 100),
                });
              }
              return null;
            }
            
            const isValid = validateImageUrl(normalized);
            if (!isValid && process.env.NODE_ENV === 'development') {
              console.warn('[ProductStore] Rejected image (validation failed):', {
                original: trimmed.substring(0, 100),
                normalized: normalized.substring(0, 100),
              });
            }
            return isValid ? normalized : null;
          })
          .filter((img: string | null): img is string => img !== null);
        
        // Debug: Log if images were parsed from string
        if (process.env.NODE_ENV === 'development' && typeof product.images === 'string' && normalizedImages.length > 0) {
          console.log('[ProductStore] Parsed images from string:', {
            productId: product.id,
            originalType: typeof product.images,
            parsedCount: normalizedImages.length,
            validatedCount: validatedImages.length,
          });
        }

        const processedProduct = {
          ...product,
          images: validatedImages,
          specifications: normalizeSpecifications(product.specifications),
          // Ensure boolean fields are properly converted from numbers (0/1) to booleans
          inStock: product.inStock !== undefined ? Boolean(product.inStock) : true,
          enabled: product.enabled !== undefined ? Boolean(product.enabled) : true,
          vinEnabled: product.vinEnabled !== undefined ? Boolean(product.vinEnabled) : false,
          airShippingEnabled: product.airShippingEnabled !== undefined ? Boolean(product.airShippingEnabled) : true,
          seaShippingEnabled: product.seaShippingEnabled !== undefined ? Boolean(product.seaShippingEnabled) : true,
          createdAt: product.createdAt instanceof Date 
            ? product.createdAt 
            : new Date(product.createdAt),
          updatedAt: product.updatedAt instanceof Date 
            ? product.updatedAt 
            : new Date(product.updatedAt),
        };
        
        // Debug: Log processed product
        if (process.env.NODE_ENV === 'development' && processedProduct.images.length === 0 && Array.isArray(product.images) && product.images.length > 0) {
          console.warn('[ProductStore] Product lost all images during validation:', {
            productId: processedProduct.id,
            productName: processedProduct.name,
            originalImagesCount: Array.isArray(product.images) ? product.images.length : 0,
            validatedImagesCount: processedProduct.images.length,
            originalFirstImage: Array.isArray(product.images) && product.images[0] 
              ? product.images[0].substring(0, 200) 
              : null,
          });
        }
        
        return processedProduct;
      });
      
      // Debug: Log final products
      if (process.env.NODE_ENV === 'development') {
        const firstProductWithImages = products.find((p: Product) => p.images && p.images.length > 0);
        console.log('[ProductStore] Processed products:', {
          total: products.length,
          productsWithImages: products.filter((p: Product) => p.images && p.images.length > 0).length,
          productsWithoutImages: products.filter((p: Product) => !p.images || p.images.length === 0).length,
          firstProductWithImages: firstProductWithImages ? {
            id: firstProductWithImages.id,
            name: firstProductWithImages.name,
            imagesCount: firstProductWithImages.images.length,
            firstImagePreview: firstProductWithImages.images[0].substring(0, 100),
          } : null,
        });
      }
      
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


