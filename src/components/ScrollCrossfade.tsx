import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

/**
 * ScrollCrossfade — cinematic scroll-driven cross-fade between two
 * stacked sections with subtle parallax and scale depth.
 *
 * The two sections are stacked inside a relative container with a shared
 * "transition zone" (controlled by `overlap`) where the incoming section
 * is pulled up to overlap the outgoing one. As the user scrolls through
 * that overlap zone:
 *   - Outgoing: opacity 1→0, translateY 0→-10%, scale 1→0.98
 *   - Incoming: opacity 0→1, translateY +10%→0,  scale 1.02→1
 *
 * Driven entirely by scroll position (no time-based easing on top).
 */

function FadingLayer({
  children,
  scrollYProgress,
  direction,
  zIndex,
}: {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  direction: "out" | "in";
  zIndex: number;
}) {
  const isOut = direction === "out";

  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    isOut ? [1, 0] : [0, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isOut ? ["0%", "-10%"] : ["10%", "0%"]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isOut ? [1, 0.98] : [1.02, 1]
  );

  return (
    <motion.div
      className="will-change-transform"
      style={{
        opacity,
        y,
        scale,
        position: "relative",
        zIndex,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function ScrollCrossfade({
  outgoing,
  incoming,
  /** Vertical overlap between the two sections in viewport heights. */
  overlap = 0.6,
}: {
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
  overlap?: number;
}) {
  const zoneRef = useRef<HTMLDivElement>(null);

  // Scroll progress through the overlap zone only.
  // The zone starts when its top reaches the viewport bottom,
  // and ends when its bottom reaches the viewport top.
  const { scrollYProgress } = useScroll({
    target: zoneRef,
    offset: ["start end", "end start"],
  });

  // Map full 0→1 zone scroll to the actual fade window.
  // We keep the fade tight (35%–65%) so each section has calm read time
  // before/after the transition.
  const fadeProgress = useTransform(scrollYProgress, [0.35, 0.65], [0, 1], {
    clamp: true,
  });

  const overlapPx = `-${overlap * 100}vh`;

  return (
    <div className="relative">
      {/* Outgoing section */}
      <FadingLayer
        scrollYProgress={fadeProgress}
        direction="out"
        zIndex={1}
      >
        {outgoing}
      </FadingLayer>

      {/* Transition zone — invisible spacer that the scroll progress is
          tracked against. Sits at the seam between the two sections. */}
      <div
        ref={zoneRef}
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: `${overlap * 100}vh`,
          // Place the zone at the bottom of the outgoing section,
          // extending into the top of the incoming section.
          top: `calc(100% - ${overlap * 100}vh)`,
          transform: `translateY(${overlap * 50}vh)`,
        }}
      />

      {/* Incoming section — pulled up to overlap the outgoing section */}
      <div style={{ marginTop: overlapPx, position: "relative", zIndex: 2 }}>
        <FadingLayer
          scrollYProgress={fadeProgress}
          direction="in"
          zIndex={2}
        >
          {incoming}
        </FadingLayer>
      </div>
    </div>
  );
}
