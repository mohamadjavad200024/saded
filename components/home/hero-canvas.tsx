"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  opacity: number;
  baseOpacity: number;
}

interface Wave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const wavesRef = useRef<Wave[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const [isLoaded, setIsLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate particle count based on screen size
  const getParticleCount = (width: number, height: number) => {
    const area = width * height;
    if (area < 300000) return 30; // Mobile
    if (area < 800000) return 50; // Tablet
    return 80; // Desktop
  };

  // Initialize particles
  const initParticles = (width: number, height: number, count: number) => {
    const particles: Particle[] = [];
    const colors = [
      "rgba(147, 51, 234, 0.6)", // Purple
      "rgba(59, 130, 246, 0.6)", // Blue
      "rgba(236, 72, 153, 0.6)", // Pink
      "rgba(251, 191, 36, 0.6)", // Yellow/Gold
    ];

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 2 + 1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius,
        baseRadius: radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
        baseOpacity: Math.random() * 0.5 + 0.3,
      });
    }

    particlesRef.current = particles;
  };

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isActive: true,
    };

    // Create wave effect
    wavesRef.current.push({
      x: mouseRef.current.x,
      y: mouseRef.current.y,
      radius: 0,
      maxRadius: Math.min(canvas.width, canvas.height) * 0.3,
      opacity: 0.4,
      speed: 2,
    });

    // Limit waves
    if (wavesRef.current.length > 5) {
      wavesRef.current.shift();
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.isActive = false;
  };

  // Handle touch move
  const handleTouchMove = (e: TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
      isActive: true,
    };
  };

  // Draw function
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use CSS dimensions (not pixel dimensions) since context is scaled
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouse = mouseRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(15, 23, 42, 0.8)");
    gradient.addColorStop(0.5, "rgba(30, 41, 59, 0.6)");
    gradient.addColorStop(1, "rgba(51, 65, 85, 0.8)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Update and draw waves
    wavesRef.current = wavesRef.current.filter((wave) => {
      wave.radius += wave.speed;
      wave.opacity -= 0.02;

      if (wave.opacity > 0 && wave.radius < wave.maxRadius) {
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(147, 51, 234, ${wave.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        return true;
      }
      return false;
    });

    // Update and draw particles
    const particles = particlesRef.current;
    const connectionDistance = Math.min(width, height) * 0.15;

    particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      // Mouse interaction
      if (mouse.isActive) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = connectionDistance * 1.5;

        if (distance < maxDistance) {
          // Attract particles to mouse
          const force = (maxDistance - distance) / maxDistance;
          particle.vx += (dx / distance) * force * 0.02;
          particle.vy += (dy / distance) * force * 0.02;

          // Increase size and opacity near mouse
          const sizeMultiplier = 1 + (1 - distance / maxDistance) * 2;
          particle.radius = particle.baseRadius * sizeMultiplier;
          particle.opacity = Math.min(
            1,
            particle.baseOpacity + (1 - distance / maxDistance) * 0.5
          );
        } else {
          // Return to base values
          particle.radius += (particle.baseRadius - particle.radius) * 0.1;
          particle.opacity += (particle.baseOpacity - particle.opacity) * 0.1;
        }
      } else {
        // Return to base values
        particle.radius += (particle.baseRadius - particle.radius) * 0.1;
        particle.opacity += (particle.baseOpacity - particle.opacity) * 0.1;
      }

      // Draw connections
      particles.slice(i + 1).forEach((otherParticle) => {
        const dx = otherParticle.x - particle.x;
        const dy = otherParticle.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace(
        "0.6",
        particle.opacity.toString()
      );
      ctx.fill();

      // Add glow effect
      if (mouse.isActive) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionDistance) {
          const glowRadius = particle.radius * 2;
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            glowRadius
          );
          gradient.addColorStop(0, particle.color.replace("0.6", "0.3"));
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fillRect(
            particle.x - glowRadius,
            particle.y - glowRadius,
            glowRadius * 2,
            glowRadius * 2
          );
        }
      }
    });

    // Draw mouse glow effect
    if (mouse.isActive) {
      const glowGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        100
      );
      glowGradient.addColorStop(0, "rgba(147, 51, 234, 0.3)");
      glowGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.1)");
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.fillRect(mouse.x - 100, mouse.y - 100, 200, 200);
    }

    animationFrameRef.current = requestAnimationFrame(draw);
  };

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      setDimensions({ width, height });

      // Reinitialize particles with new dimensions
      const count = getParticleCount(width, height);
      initParticles(width, height, count);

      if (!isLoaded) {
        setIsLoaded(true);
      }
    };

    // Initial setup
    updateDimensions();

    // Handle resize
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener("resize", handleResize);

    // Add event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Start animation
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-black/50">
      {/* Canvas Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
        />
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

