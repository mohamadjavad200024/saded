import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get placeholder image URL
 * Uses external service for Next.js Image component compatibility
 * @param width - Image width in pixels (default: 600)
 * @param height - Image height in pixels (default: 600)
 * @returns Placeholder image URL
 */
export const getPlaceholderImage = (width: number = 600, height: number = 600): string => {
  // Use placehold.co service for Next.js Image compatibility
  const text = encodeURIComponent(`${width}x${height}`);
  return `https://placehold.co/${width}x${height}/f3f4f6/9ca3af?text=${text}`;
};
