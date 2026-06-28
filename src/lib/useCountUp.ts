import { useEffect, useRef, useState } from 'react';

/**
 * Smoothly counts a numeric value up from 0 to target over `duration` ms.
 * Respects prefers-reduced-motion. Returns the formatted display value.
 * Non-numeric values pass through unchanged.
 */
export function useCountUp(target: number | null | undefined, duration = 700) {
  const [value, setValue] = useState<number>(typeof target === 'number' ? target : 0);
  const raf = useRef<number | null>(null);
  const start = useRef<number>(0);
  const from = useRef<number>(0);

  useEffect(() => {
    if (target === null || target === undefined || Number.isNaN(target)) return;
    const reduce = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || duration <= 0) {
      setValue(target);
      return;
    }
    from.current = value;
    start.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start.current) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from.current + (target - from.current) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}
