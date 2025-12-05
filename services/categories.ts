"use client";

import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types/category";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch categories from the API
 */
async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Don't use cache in client-side, let React Query handle it
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const result: ApiResponse<Category[]> = await response.json();

    if (!result.success || !result.data) {
      console.error("API Error:", result.error || "Failed to fetch categories", result);
      throw new Error(result.error || "Failed to fetch categories");
    }
    
    // Log for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("Fetched categories:", result.data.length);
    }

    // Parse dates from strings or Date objects
    return result.data.map((category) => {
      let createdAt: Date;
      let updatedAt: Date;
      
      try {
        createdAt = category.createdAt instanceof Date 
          ? category.createdAt 
          : new Date(category.createdAt);
        updatedAt = category.updatedAt instanceof Date 
          ? category.updatedAt 
          : new Date(category.updatedAt);
      } catch (e) {
        // Fallback to current date if parsing fails
        createdAt = new Date();
        updatedAt = new Date();
      }
      
      return {
        ...category,
        createdAt,
        updatedAt,
      };
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching categories:", error);
    // Return empty array instead of throwing to prevent UI crash
    return [];
  }
}

/**
 * React Query hook for fetching categories
 */
export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Don't treat empty array as error
    throwOnError: false,
  });
}

