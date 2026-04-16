import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ScrollCrossfade — cinematic scroll-driven cross-fade between two
 * stacked sections with subtle parallax and scale depth.
 *
 * Behavior (driven entirely by scroll position):
 *   - Outgoing section: opacity 1→0, translateY 0→-10%, scale 1→0.98
 *   - Incoming section: opacity 0→1, translateY +10%→0,  scale 1.02→1
 *
 * The transition is synced to the wrapper's scroll progress, so it begins
 * as the wrapper enters the viewport and completes once it has fully
 * passed through. The two sections overlap during the transition.
 */
export default function ScrollCrossfade({
  outgoing,
  incoming,
}: {
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress through the wrapper.
  // start: when the wrapper top hits viewport top
  // end:   when the wrapper bottom hits viewport bottom
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Transition window: the cross-fade happens between 35% and 65% of
  // the wrapper's scroll range, leaving each section a relaxed read
  // window on either side.
  const FADE_START = 0.35;
  const FADE_END = 0.65;

  // Outgoing ("How it works")
  const outOpacity = useTransform(scrollYProgress, [FADE_START, FADE_END], [1, 0]);
  const outY = useTransform(scrollYProgress, [FADE_START, FADE_END], ["0%", "-10%"]);
  const outScale = useTransform(scrollYProgress, [FADE_START, FADE_END], [1, 0.98]);

  // Incoming ("What sets us apart")
  const inOpacity = useTransform(scrollYProgress, [FADE_START, FADE_END], [0, 1]);
  const inY = useTransform(scrollYProgress, [FADE_START, FADE_END], ["10%", "0%"]);
  const inScale = useTransform(scrollYProgress, [FADE_START, FADE_END], [1.02, 1]);

  return (
    // Wrapper is 200vh tall so we have scroll runway for the cross-fade.
    // Inside, both sections are stacked (sticky) and overlap during transition.
    <div ref={ref} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Outgoing layer */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            opacity: outOpacity,
            y: outY,
            scale: outScale,
          }}
        >
          <div className="h-full overflow-y-auto no-scrollbar">{outgoing}</div>
        </motion.div>

        {/* Incoming layer */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            opacity: inOpacity,
            y: inY,
            scale: inScale,
          }}
        >
          <div className="h-full overflow-y-auto no-scrollbar">{incoming}</div>
        </motion.div>
      </div>
    </div>
  );
}
