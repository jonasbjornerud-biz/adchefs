import { useRef, useState, useEffect, useCallback } from "react";

interface PhoneCardProps {
  src: string;
  isCenter: boolean;
  preload: "auto" | "metadata" | "none";
  floatDuration: number;
  floatDelay: number;
  isHoveredSibling: boolean;
}

const PhoneCard = ({
  src,
  isCenter,
  preload,
  floatDuration,
  floatDelay,
  isHoveredSibling,
}: PhoneCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const handleLoaded = useCallback(() => {
    setLoaded(true);
  }, []);

  const scaleValue = hovered ? 1.05 : isHoveredSibling ? 0.97 : 1;

  return (
    <div
      ref={cardRef}
      className="phone-card-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDuration: `${floatDuration}s`,
        animationDelay: `${floatDelay}s`,
        animationPlayState: hovered ? "paused" : "running",
      }}
    >
      <div
        className={`phone-card ${isCenter ? "phone-card-center" : ""}`}
        style={{
          transform: `scale(${scaleValue})`,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease",
          boxShadow: hovered
            ? "0 30px 60px -10px hsl(260 60% 10% / 0.6), 0 18px 36px -18px hsl(260 100% 62% / 0.25)"
            : "0 20px 40px -10px hsl(260 60% 10% / 0.4), 0 10px 20px -10px hsl(260 100% 62% / 0.1)",
        }}
      >
        {/* Phone bezel frame */}
        <div className="phone-bezel">
          {/* Notch */}
          <div className="phone-notch" />

          {/* Skeleton shimmer */}
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,60%,8%)] to-[hsl(260,50%,14%)]" />
            <div className="absolute inset-0 overflow-hidden">
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
              preload={preload}
              onCanPlay={handleLoaded}
            />
          )}

          {/* Dark vignette overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none video-vignette" />
        </div>

        {/* Glowing border */}
        <div
          className={`absolute inset-0 z-30 pointer-events-none rounded-[2rem] border-2 transition-all duration-500 ${
            isCenter
              ? "border-accent/30"
              : "border-border/40 group-hover:border-accent/40"
          }`}
        />
      </div>

      {/* Center glow behind card */}
      {isCenter && (
        <div className="phone-center-glow" />
      )}
    </div>
  );
};

export default PhoneCard;
