import { useEffect, useState } from "react";

/** Returns HH:MM:SS:FF timecode driven by scroll progress. */
export const useScrollTimecode = () => {
  const [tc, setTc] = useState("00:00:00:00");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const compute = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(p);
      // Map progress to a 60-second reel at 24fps => 1440 frames.
      const totalFrames = Math.round(p * 60 * 24);
      const ff = totalFrames % 24;
      const totalSec = Math.floor(totalFrames / 24);
      const ss = totalSec % 60;
      const mm = Math.floor(totalSec / 60) % 60;
      const hh = Math.floor(totalSec / 3600);
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`);
    };
    const onScroll = () => {
      if (reduced) { compute(); return; }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { tc, progress };
};

/** Fixed local timecode animating at 24fps for the REC header. */
export const useLocalTimecode = () => {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setTc("00:00:14:03"); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsedFrames = Math.floor(((t - start) / 1000) * 24);
      const ff = elapsedFrames % 24;
      const totalSec = Math.floor(elapsedFrames / 24);
      const ss = totalSec % 60;
      const mm = Math.floor(totalSec / 60) % 60;
      const hh = Math.floor(totalSec / 3600);
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return tc;
};