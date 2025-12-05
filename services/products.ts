"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product, ProductFilters, PaginationInfo } from "@/types/product";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

/**
 * Fetch products from the API
 */
async function fetchProducts(
  filters?: ProductFilters,
  page: number = 1,
  limit: number = 50
): Promise<{ products: Product[]; pagination: PaginationInfo }> {
  try {
    const url = new URL("/api/products", window.location.origin);
    
    if (!filters) {
      // Use GET for simple pagination
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());
      
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const result: ApiResponse<Product[]> = await response.json();

      if (!result.success || !result.data) {
        console.error("API Error:", result.error || "Failed to fetch products", result);
        throw new Error(result.error || "Failed to fetch products");
      }
      
      // Log for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Fetched products:", result.data.length);
      }

      // Parse dates and JSON fields
      const products = result.data.map((product) => {
        let createdAt: Date;
        let updatedAt: Date;
        
        try {
          createdAt = product.createdAt instanceof Date 
            ? product.createdAt 
            : new Date(product.createdAt);
          updatedAt = product.updatedAt instanceof Date 
            ? product.updatedAt 
            : new Date(product.updatedAt);
        } catch (e) {
          // Fallback to current date if parsing fails
          createdAt = new Date();
          updatedAt = new Date();
        }
        
        return {
          ...product,
          images: Array.isArray(product.images) ? product.images : [],
          tags: Array.isArray(product.tags) ? product.tags : [],
          specifications: product.specifications || {},
          createdAt,
          updatedAt,
        };
      });

      return {
        products,
        pagination: result.pagination || {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
        },
      };
    } else {
      // Use POST for filtered products
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters,
          page,
          limit,
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const result: ApiResponse<Product[]> = await response.json();

      if (!result.success || !result.data) {
        console.error("API Error:", result.error || "Failed to fetch products", result);
        throw new Error(result.error || "Failed to fetch products");
      }
      
      // Log for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Fetched products:", result.data.length);
      }

      // Parse dates and JSON fields
      const products = result.data.map((product) => {
        let createdAt: Date;
        let updatedAt: Date;
        
        try {
          createdAt = product.createdAt instanceof Date 
            ? product.createdAt 
            : new Date(product.createdAt);
          updatedAt = product.updatedAt instanceof Date 
            ? product.updatedAt 
            : new Date(product.updatedAt);
        } catch (e) {
          // Fallback to current date if parsing fails
          createdAt = new Date();
          updatedAt = new Date();
        }
        
        return {
          ...product,
          images: Array.isArray(product.images) ? product.images : [],
          tags: Array.isArray(product.tags) ? product.tags : [],
          specifications: product.specifications || {},
          createdAt,
          updatedAt,
        };
      });

      return {
        products,
        pagination: result.pagination || {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
        },
      };
    }
  } catch (error: any) {
    // Log error for debugging
    console.error("Error fetching products:", error);
    
    // Check if it's a 503 Service Unavailable error (database connection issue)
    if (error.message?.includes("Service Unavailable") || error.message?.includes("503")) {
      console.warn("⚠️ Database service unavailable - returning empty products");
    }
    
    // Return empty array instead of throwing to prevent UI crash
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 0,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

/**
 * React Query hook for fetching products with pagination and filters
 * Returns: { data: Product[], pagination: PaginationInfo, isLoading, isError, error }
 */
export function useProducts(
  filters?: ProductFilters,
  page: number = 1,
  limit: number = 50
) {
  const query = useQuery<{ products: Product[]; pagination: PaginationInfo }, Error>({
    queryKey: ["products", filters, page, limit],
    queryFn: () => fetchProducts(filters, page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Don't treat empty array as error
    throwOnError: false,
  });

  // Transform the response to match expected format
  return {
    data: query.data?.products || [],
    pagination: query.data?.pagination || {
      page: 1,
      limit: 0,
      total: 0,
      totalPages: 0,
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

