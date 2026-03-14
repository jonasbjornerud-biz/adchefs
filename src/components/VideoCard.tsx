import { useRef, useState, useEffect, useCallback } from "react";

interface VideoCardProps {
  src: string;
  isCenter: boolean;
  preloadStrategy: "auto" | "metadata" | "none";
}

const VideoCard = ({ src, isCenter, preloadStrategy }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset loaded state when src changes
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const handleLoaded = useCallback(() => {
    setLoaded(true);
  }, []);

  // Parallax tilt on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className="aspect-[9/16] w-[140px] md:w-[180px] lg:w-[210px] rounded-xl md:rounded-2xl overflow-hidden relative group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(600px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {/* Skeleton shimmer while loading */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-500 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,60%,8%)] to-[hsl(260,50%,14%)] rounded-xl md:rounded-2xl" />
        <div className="absolute inset-0 overflow-hidden rounded-xl md:rounded-2xl">
          <div className="video-skeleton-shimmer" />
        </div>
      </div>

      {/* Video */}
      {inView && (
        <video
          ref={videoRef}
          src={src}
          className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
          autoPlay
          loop
          muted
          playsInline
          preload={preloadStrategy}
          onCanPlayThrough={handleLoaded}
        />
      )}

      {/* Dark vignette overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none rounded-xl md:rounded-2xl video-vignette" />

      {/* Glowing border */}
      <div
        className={`absolute inset-0 z-30 pointer-events-none rounded-xl md:rounded-2xl border transition-all duration-500 ${
          isCenter
            ? "border-accent/40 shadow-[0_0_20px_hsl(260,100%,62%,0.3)]"
            : "border-border/60 group-hover:border-accent/50 group-hover:shadow-[0_0_15px_hsl(260,100%,62%,0.25)]"
        }`}
        style={{
          animation: isCenter ? "glow-pulse 3s ease-in-out infinite" : undefined,
        }}
      />
    </div>
  );
};

export default VideoCard;
