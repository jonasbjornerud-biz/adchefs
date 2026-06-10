import { useEffect, useRef } from "react";

const GLOW_SIZE = 800;

const HeroBackground = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      "ontouchstart" in window;

    let rect = root.getBoundingClientRect();
    const restingX = () => rect.width * 0.7;
    const restingY = () => rect.height * 0.4;

    // Current glow center (state)
    let cx = restingX();
    let cy = restingY();
    // Target the glow chases
    let tx = cx;
    let ty = cy;

    let hasPointer = false;
    let pointerInside = false;
    let lastPointerAt = performance.now();
    const startedAt = performance.now();

    const applyTransform = () => {
      glow.style.transform = `translate3d(${cx - GLOW_SIZE / 2}px, ${cy - GLOW_SIZE / 2}px, 0)`;
    };

    // Reduced motion: park at resting position, no rAF
    if (reduced) {
      cx = restingX();
      cy = restingY();
      applyTransform();
      const onResize = () => {
        rect = root.getBoundingClientRect();
        cx = restingX();
        cy = restingY();
        applyTransform();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    applyTransform();

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      hasPointer = true;
      lastPointerAt = performance.now();
      const r = root.getBoundingClientRect();
      rect = r;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      pointerInside = inside;
      if (inside) {
        tx = x;
        ty = y;
      }
    };
    const onResize = () => {
      rect = root.getBoundingClientRect();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);

    // Autonomous drift points (mobile / no-cursor fallback)
    const driftPoints = [
      { x: 0.7, y: 0.4 },
      { x: 0.3, y: 0.55 },
      { x: 0.55, y: 0.25 },
    ];
    const DRIFT_CYCLE = 90_000; // 90s full loop

    let raf = 0;
    const tick = (now: number) => {
      const elapsedSincePointer = now - lastPointerAt;
      const useAutonomous =
        isTouch || (!hasPointer && now - startedAt > 2000);

      if (useAutonomous) {
        // Loop through drift points with ease-in-out
        const t = (now % DRIFT_CYCLE) / DRIFT_CYCLE; // 0..1
        const seg = t * driftPoints.length;
        const i = Math.floor(seg) % driftPoints.length;
        const j = (i + 1) % driftPoints.length;
        let f = seg - Math.floor(seg);
        // ease-in-out
        f = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
        tx = (driftPoints[i].x * (1 - f) + driftPoints[j].x * f) * rect.width;
        ty = (driftPoints[i].y * (1 - f) + driftPoints[j].y * f) * rect.height;
      } else if (!pointerInside) {
        // Drift back to resting position
        tx = restingX();
        ty = restingY();
      }

      // Heavy damping
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      applyTransform();

      raf = requestAnimationFrame(tick);
      void elapsedSincePointer;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Base static gradient (top-right wash) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(158, 216, 245, 0.10) 0%, transparent 60%)",
        }}
      />

      {/* Interactive cursor-following glow */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0"
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(158, 216, 245, 0.22) 0%, transparent 65%)",
          filter: "blur(80px)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Static film grain overlay (unchanged) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.045,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          backgroundRepeat: "repeat",
          backgroundSize: "240px 240px",
        }}
      />
    </div>
  );
};

export default HeroBackground;