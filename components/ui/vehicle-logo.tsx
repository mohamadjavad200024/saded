"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleLogoProps {
  logo: string | null | undefined;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fallbackIcon?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function VehicleLogo({
  logo,
  alt,
  className,
  size = "md",
  fallbackIcon = true,
}: VehicleLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if logo is valid
  const isValidLogo =
    logo &&
    typeof logo === "string" &&
    logo.trim().length > 0 &&
    (logo.startsWith("data:image") || logo.startsWith("data:") || logo.startsWith("/") || logo.startsWith("http"));

  // If no valid logo or error occurred, show fallback
  if (!isValidLogo || imageError) {
    if (!fallbackIcon) return null;
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-full",
          sizeClasses[size],
          className
        )}
      >
        <Car className={cn("text-muted-foreground", sizeClasses[size])} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-background border border-border/30",
        sizeClasses[size],
        className
      )}
    >
      <img
        src={logo}
        alt={alt}
        className={cn(
          "object-contain w-full h-full rounded-full",
          !imageLoaded && "opacity-0"
        )}
        onLoad={() => {
          setImageLoaded(true);
          setImageError(false);
        }}
        onError={(e) => {
          console.warn(`[VehicleLogo] Failed to load logo for ${alt}:`, {
            logoLength: logo?.length,
            logoStart: logo?.substring(0, 50),
          });
          setImageError(true);
          setImageLoaded(false);
        }}
        style={{
          display: imageError ? "none" : "block",
        }}
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <Car className={cn("text-muted-foreground", sizeClasses[size])} />
        </div>
      )}
    </div>
  );
}

