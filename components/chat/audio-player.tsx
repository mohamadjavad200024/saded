"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioPlayerProps {
  url: string;
  duration?: number;
  className?: string;
}

export function AudioPlayer({ url, duration: initialDuration, className = "" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(0);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    } else {
      audioRef.current.src = url;
    }

    const audio = audioRef.current;

    const updateTime = () => {
      if (audio && !isDragging) {
        setCurrentTime(audio.currentTime);
        const newProgress = duration > 0 ? (audio.currentTime / duration) * 100 : 0;
        setProgress(newProgress);
      }
    };

    const updateDuration = () => {
      if (audio) {
        const audioDuration = audio.duration;
        if (audioDuration && isFinite(audioDuration)) {
          setDuration(audioDuration);
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [url, duration, isDragging]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
      setIsPlaying(true);
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !waveformRef.current || isDragging) return;

    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (clickX / width) * 100));

    const newTime = (percentage / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || !audioRef.current) return;
    setIsDragging(true);
    const rect = waveformRef.current.getBoundingClientRect();
    dragStartX.current = e.clientX - rect.left;
    dragStartProgress.current = progress;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !waveformRef.current || !audioRef.current) return;

    const rect = waveformRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const width = rect.width;
    const deltaX = currentX - dragStartX.current;
    const deltaProgress = (deltaX / width) * 100;
    const newProgress = Math.max(0, Math.min(100, dragStartProgress.current + deltaProgress));

    setProgress(newProgress);
    const newTime = (newProgress / 100) * duration;
    setCurrentTime(newTime);
  };

  const handleMouseUp = () => {
    if (!isDragging || !audioRef.current) return;
    setIsDragging(false);
    audioRef.current.currentTime = (progress / 100) * duration;
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate realistic waveform bars with better distribution
  const waveformBars = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < url.length; i++) {
      seed = ((seed << 5) - seed) + url.charCodeAt(i);
      seed = seed & seed;
    }
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Create more realistic waveform with varying heights
    const bars = Array.from({ length: 60 }, (_, i) => {
      // Create wave-like pattern with some randomness
      const wave = Math.sin((i / 60) * Math.PI * 4) * 0.3 + 0.7;
      const random = seededRandom() * 0.4 + 0.6;
      const height = wave * random;
      return Math.max(0.15, Math.min(1, height)); // Clamp between 15% and 100%
    });

    return bars.map((height, i) => {
      const isActive = (i / 60) * 100 <= progress;
      return (
        <motion.div
          key={i}
          className={`rounded-full transition-colors ${
            isActive ? "bg-primary" : "bg-muted-foreground/25"
          }`}
          style={{
            width: "3px",
            height: `${height * 100}%`,
            minHeight: "6px",
            maxHeight: "32px",
          }}
          animate={
            isPlaying && isActive
              ? {
                  scaleY: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }
              : {}
          }
          transition={{
            duration: 0.6,
            repeat: isPlaying && isActive ? Infinity : 0,
            delay: (i % 5) * 0.1,
          }}
        />
      );
    });
  }, [url, progress, isPlaying]);

  return (
    <div
      className={`flex items-center gap-3 p-2.5 bg-gradient-to-br from-background to-muted/20 rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* Play/Pause Button - Larger and more prominent */}
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="pause"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Pause className="h-5 w-5" fill="currentColor" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>
        {isPlaying && (
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      {/* Waveform Container */}
      <div
        ref={waveformRef}
        onClick={handleWaveformClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 flex items-center justify-between gap-1 h-10 px-3 cursor-pointer relative group"
      >
        {/* Waveform Bars */}
        <div className="absolute inset-0 flex items-center justify-between gap-1 px-3">
          {waveformBars}
        </div>

        {/* Progress Indicator (Blue Circle) - More prominent */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg z-10 cursor-grab active:cursor-grabbing border-2 border-background"
          style={{
            left: `${progress}%`,
            marginLeft: "-8px",
          }}
          animate={{
            scale: isDragging ? 1.3 : isPlaying ? [1, 1.15, 1] : 1,
          }}
          transition={{
            duration: isDragging ? 0 : 1,
            repeat: isDragging ? 0 : isPlaying ? Infinity : 0,
          }}
        />
      </div>

      {/* Time Display - Better styling */}
      <div className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-muted-foreground min-w-[5rem] justify-end">
        <span className="text-foreground">{formatTime(currentTime)}</span>
        <span className="text-muted-foreground/40">/</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
