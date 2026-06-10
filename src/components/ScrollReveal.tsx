import { useEffect, useRef } from "react";

/**
 * ScrollReveal — wraps a section and fades/translates its direct children
 * into view once when the section enters the viewport.
 *
 * Expects a single section/element child. On reveal, applies the
 * `.sr-visible` class to the wrapper, which triggers the staggered
 * transitions defined in index.css.
 */
const ScrollReveal = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("sr-visible");
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("sr-visible");
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="sr-root">
      {children}
    </div>
  );
};

export default ScrollReveal;