import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AuroraCanvasProps {
  speed?: number;
  intensity?: number;
  tint?: string;
  grain?: number;
  className?: string;
}

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

export const AuroraCanvas = ({
  speed = 0.008,
  intensity = 0.3,
  tint = "#6b4bff",
  grain = 0.08,
  className,
}: AuroraCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const blobsRef = useRef<Blob[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Cap devicePixelRatio for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Purple palette
    const colors = ["#6b4bff", "#5636e7", "#2f2455", "#8b5cf6", "#4c2f7a"];

    // Initialize 6-8 larger blobs
    const initBlobs = () => {
      const blobCount = Math.floor(Math.random() * 3) + 6; // 6-8 blobs
      blobsRef.current = Array.from({ length: blobCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        radius: Math.random() * 200 + 150, // Larger blobs: 150-350px
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.2 + 0.15, // 0.15-0.35
      }));
    };

    initBlobs();

    // Generate purple film grain
    const generateGrain = () => {
      const grainCanvas = document.createElement("canvas");
      grainCanvas.width = 200;
      grainCanvas.height = 200;
      const grainCtx = grainCanvas.getContext("2d");
      if (!grainCtx) return null;

      const imageData = grainCtx.createImageData(200, 200);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * grain * 255;
        // Purple-biased monochrome grain
        data[i] = 107 + noise; // R (purple bias)
        data[i + 1] = 75 + noise * 0.7; // G
        data[i + 2] = 255 + noise * 0.8; // B (purple bias)
        data[i + 3] = Math.abs(noise) * 0.5; // Alpha
      }

      grainCtx.putImageData(imageData, 0, 0);
      return grainCanvas;
    };

    const grainPattern = generateGrain();

    let isPaused = false;

    // Pause animation when document is hidden
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Animation loop
    const animate = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Dark purple background
      ctx.fillStyle = "#0b0613";
      ctx.fillRect(0, 0, width, height);

      // Update and draw blobs
      blobsRef.current.forEach((blob) => {
        // Update position
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off edges
        if (blob.x < -blob.radius || blob.x > width + blob.radius) blob.vx *= -1;
        if (blob.y < -blob.radius || blob.y > height + blob.radius) blob.vy *= -1;

        // Keep within bounds
        blob.x = Math.max(-blob.radius, Math.min(width + blob.radius, blob.x));
        blob.y = Math.max(-blob.radius, Math.min(height + blob.radius, blob.y));

        // Draw radial gradient blob
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        
        // Parse color and apply intensity
        const colorOpacity = blob.opacity * intensity;
        gradient.addColorStop(0, `${blob.color}${Math.floor(colorOpacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.5, `${blob.color}${Math.floor(colorOpacity * 0.5 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${blob.color}00`);

        ctx.fillStyle = gradient;
        ctx.fillRect(
          blob.x - blob.radius,
          blob.y - blob.radius,
          blob.radius * 2,
          blob.radius * 2
        );
      });

      // Apply purple film grain
      if (grainPattern) {
        ctx.globalAlpha = grain;
        ctx.globalCompositeOperation = "overlay";
        const pattern = ctx.createPattern(grainPattern, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, width, height);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, intensity, tint, grain]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        className
      )}
      style={{ zIndex: 0 }}
    />
  );
};

