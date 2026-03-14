import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import VideoCard from "./VideoCard";

const videoSources = [
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501822/GIF9_u1acww.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF2_wnilkz.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501820/GIF11_dfnd9x.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF6_eycqkn.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF7_xrgax0.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF5_NEW_c8ocsj.webm",
];

const DRAG_THRESHOLD = 50;

const Hero = () => {
  const totalVideos = videoSources.length;
  const [centerIndex, setCenterIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Drag/touch state refs
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const isPointerDown = useRef(false);
  const touchLocked = useRef<"horizontal" | "vertical" | null>(null);

  const goNext = useCallback(() => {
    setCenterIndex((prev) => (prev < totalVideos - 1 ? prev + 1 : 0));
  }, [totalVideos]);

  const goPrev = useCallback(() => {
    setCenterIndex((prev) => (prev > 0 ? prev - 1 : totalVideos - 1));
  }, [totalVideos]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // --- Mouse drag ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isPointerDown.current = true;
    dragStartX.current = e.clientX;
    setIsDragging(false);
    setDragOffset(0);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPointerDown.current) return;
    const delta = e.clientX - dragStartX.current;
    setDragOffset(delta * 0.3); // subtle follow
    if (Math.abs(delta) > 5) setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    if (Math.abs(dragOffset) > DRAG_THRESHOLD * 0.3) {
      if (dragOffset < 0) goNext();
      else goPrev();
    }
    setDragOffset(0);
    // Reset isDragging after a tick so click events on children are suppressed
    setTimeout(() => setIsDragging(false), 0);
  }, [dragOffset, goNext, goPrev]);

  // --- Touch swipe ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    touchLocked.current = null;
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - dragStartX.current;
    const dy = e.touches[0].clientY - dragStartY.current;

    if (!touchLocked.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        touchLocked.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }
      return;
    }

    if (touchLocked.current === "vertical") return;

    e.preventDefault();
    setDragOffset(dx * 0.3);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchLocked.current === "horizontal" && Math.abs(dragOffset) > DRAG_THRESHOLD * 0.3) {
      if (dragOffset < 0) goNext();
      else goPrev();
    }
    setDragOffset(0);
    touchLocked.current = null;
  }, [dragOffset, goNext, goPrev]);

  return (
    <section className="hero-section relative min-h-[100svh] flex items-center overflow-x-hidden pt-[calc(80px+env(safe-area-inset-top))] md:pt-0 md:h-screen">
      <div className="hero-grain" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="max-w-[480px] text-left animate-text-entrance">
            <div className="inline-flex items-center justify-center px-5 py-1.5 mb-6 rounded-full bg-white/[0.06] dark:bg-[rgba(126,61,255,0.08)] backdrop-blur-md border border-[rgba(126,61,255,0.4)] dark:border-[rgba(126,61,255,0.25)] transition-colors duration-300">
              <span className="text-sm text-[#4a4a6a] dark:text-[#a0a0b8] transition-colors duration-300">Blending AI automations with expert video editors</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[4.2rem] font-bold mb-6 text-[#0a0a14] dark:text-white leading-[1.08] transition-colors duration-300">
              We cook up <span className="text-[#7e3dff]">ads</span> that{" "}
              <span className="text-[#7e3dff]">scale</span> your brand
            </h1>
            <p className="text-lg md:text-xl mb-8 text-[#4a4a6a] dark:text-[#a0a0b8] leading-relaxed transition-colors duration-300">
              Creative strategy, <span className="text-[#7e3dff]">AI insights</span>, and elite editors working
              together to deliver videos that drive consistent growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button
                size="lg"
                variant="cta"
                onClick={() => scrollToSection("booking")}
                className="text-lg px-8 py-6 h-auto group relative overflow-hidden shimmer-button"
              >
                <span className="relative z-10 flex items-center">
                  Book Call Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>

          {/* Right side - Stacked Carousel */}
          <div
            className="relative h-[420px] md:h-[560px] lg:h-[70vh] max-h-[720px] animate-fade-in select-none"
            style={{ animationDelay: '0.3s', animationFillMode: 'backwards', cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Arrow buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="carousel-arrow carousel-arrow-left"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="carousel-arrow carousel-arrow-right"
              aria-label="Next video"
            >
              <ChevronRight className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
            </button>

            <div className="carousel-bloom" />
            <div className="stacked-carousel-container">
              {videoSources.map((videoSrc, i) => {
                let offset = i - centerIndex;
                if (offset > totalVideos / 2) offset -= totalVideos;
                else if (offset < -totalVideos / 2) offset += totalVideos;

                if (Math.abs(offset) > 3) return null;

                const positions = [
                  { x: -260, y: 44, rotate: -11, z: -140, scale: 0.78 },
                  { x: -175, y: 26, rotate: -7, z: -90, scale: 0.85 },
                  { x: -88, y: 10, rotate: -3, z: -40, scale: 0.93 },
                  { x: 0, y: 0, rotate: 0, z: 0, scale: 1.05 },
                  { x: 88, y: 10, rotate: 3, z: -40, scale: 0.93 },
                  { x: 175, y: 26, rotate: 7, z: -90, scale: 0.85 },
                  { x: 260, y: 44, rotate: 11, z: -140, scale: 0.78 },
                ];

                const posIndex = Math.min(Math.max(offset + 3, 0), positions.length - 1);
                const pos = positions[posIndex];

                return (
                  <div
                    key={i}
                    className="stacked-carousel-item"
                    style={{
                      transform: `translate(${pos.x + dragOffset}px, ${pos.y}px) rotateY(${pos.rotate}deg) translateZ(${pos.z}px) scale(${pos.scale})`,
                      zIndex: i === centerIndex ? 100 : totalVideos - Math.abs(offset),
                    }}
                  >
                    <VideoCard src={videoSrc} isCenter={i === centerIndex} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
