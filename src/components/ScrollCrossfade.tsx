import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const SHARED_BG = "#09090f";

export default function ScrollCrossfade({
  outgoing,
  incoming,
}: {
  outgoing: React.ReactNode;
  incoming: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const incomingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [sceneHeight, setSceneHeight] = useState<number>(1600);

  useEffect(() => {
    const updateHeight = () => {
      const outgoingHeight = outgoingRef.current?.offsetHeight ?? 0;
      const incomingHeight = incomingRef.current?.offsetHeight ?? 0;
      const nextHeight = Math.max(outgoingHeight, incomingHeight, 1200);
      setSceneHeight(nextHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(() => updateHeight());
    if (outgoingRef.current) observer.observe(outgoingRef.current);
    if (incomingRef.current) observer.observe(incomingRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });

  const outgoingOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0], {
    clamp: true,
  });
  const outgoingY = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"], {
    clamp: true,
  });
  const outgoingScale = useTransform(scrollYProgress, [0, 1], [1, 0.985], {
    clamp: true,
  });

  const incomingOpacity = useTransform(scrollYProgress, [0.25, 1], [0, 1], {
    clamp: true,
  });
  const incomingY = useTransform(scrollYProgress, [0, 1], ["4%", "0%"], {
    clamp: true,
  });
  const incomingScale = useTransform(scrollYProgress, [0, 1], [1.015, 1], {
    clamp: true,
  });

  const staticLayerStyle = prefersReducedMotion
    ? { opacity: 1, y: "0%", scale: 1 }
    : undefined;

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden"
      style={{
        minHeight: sceneHeight,
        background: SHARED_BG,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(9,9,15,1) 0%, rgba(9,9,15,1) 100%), radial-gradient(ellipse 70% 50% at 50% 8%, rgba(124,58,237,0.14) 0%, transparent 70%)",
        }}
      />

      <motion.div
        ref={outgoingRef}
        className="absolute inset-x-0 top-0 z-[1] will-change-transform"
        style={
          staticLayerStyle ?? {
            opacity: outgoingOpacity,
            y: outgoingY,
            scale: outgoingScale,
            transformOrigin: "50% 18%",
          }
        }
      >
        {outgoing}
      </motion.div>

      <motion.div
        ref={incomingRef}
        className="absolute inset-x-0 top-0 z-[2] will-change-transform"
        style={
          staticLayerStyle ?? {
            opacity: incomingOpacity,
            y: incomingY,
            scale: incomingScale,
            transformOrigin: "50% 18%",
          }
        }
      >
        {incoming}
      </motion.div>

      <div aria-hidden="true" style={{ height: sceneHeight }} />
    </div>
  );
}
