import { useEffect, useRef, useState } from "react";

/**
 * ParallaxSection — wraps a section so its content shifts vertically
 * relative to scroll position, creating a smooth parallax handoff
 * between adjacent sections.
 *
 * speed: how strongly the content moves against scroll. 0 = no movement,
 *        positive = content drifts up (faster than scroll),
 *        negative = content drifts down (slower than scroll).
 */
export default function ParallaxSection({
  children,
  speed = 0.15,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 (just below viewport) ... 0 (centered) ... 1 (just above)
      const center = rect.top + rect.height / 2;
      const progress = (vh / 2 - center) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      setOffset(clamped * 60 * speed * 5); // tunable amplitude in px
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        ref={innerRef}
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
