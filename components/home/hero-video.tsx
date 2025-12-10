"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set playback rate to slower (0.7 = 70% speed, 0.5 = 50% speed)
    video.playbackRate = 0.7;

    const handleLoadedData = () => {
      setIsLoaded(true);
      // Ensure playback rate is set after video loads
      video.playbackRate = 0.7;
      // Auto-play video when loaded
      video.play().catch((error) => {
        console.error("Error playing video:", error);
        setHasError(true);
      });
    };

    const handleError = () => {
      console.error("Error loading video");
      setHasError(true);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    // Try to load the video
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, []);

  // Fallback if video doesn't exist or fails to load
  if (hasError) {
    return null;
  }

  return (
    <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-black/50">
      {/* Video Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          preload="auto"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* Overlay gradient for better content visibility - stronger at bottom 20% */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />
      {/* Additional gradient overlay for bottom 20% */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-background/90 via-background/70 to-transparent pointer-events-none" />

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </section>
  );
}

