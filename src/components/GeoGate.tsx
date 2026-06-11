import { useEffect, useState } from "react";

// =============================================================================
// TEMPORARY GEO-BLOCK FOR NORWAY
// Resolve-first: nothing renders until the geolocation check returns
// (or the 3s timeout / an error fails open). Verdict cached in sessionStorage.
// To remove: delete this file and unwrap <GeoGate> in src/App.tsx.
// =============================================================================

type GeoVerdict = "allowed" | "blocked";

const STORAGE_KEY = "geo-gate-verdict";

const readCachedVerdict = (): GeoVerdict | null => {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return v === "allowed" || v === "blocked" ? v : null;
  } catch {
    return null;
  }
};

const writeCachedVerdict = (v: GeoVerdict) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, v);
  } catch {
    /* ignore */
  }
};

// Kick off the lookup at module evaluation (app bootstrap), before the
// component tree mounts. The gate reuses this in-flight promise.
const geoPromise: Promise<GeoVerdict> = (() => {
  const cached = readCachedVerdict();
  if (cached) return Promise.resolve(cached);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  return fetch("https://ipapi.co/json/", { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error("Geo lookup failed");
      return res.json();
    })
    .then((data): GeoVerdict => (data?.country_code === "NO" ? "blocked" : "allowed"))
    .catch((): GeoVerdict => "allowed") // fail open on error or timeout
    .finally(() => clearTimeout(timeoutId))
    .then((verdict) => {
      writeCachedVerdict(verdict);
      return verdict;
    });
})();

const InkScreen = ({ showText }: { showText: boolean }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 2147483647,
      backgroundColor: "#1A1A1A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    <span
      style={{
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontWeight: 700,
        fontSize: "14px",
        color: "#F7F6F3",
        letterSpacing: "0.02em",
        opacity: showText ? 1 : 0,
        transition: "opacity 300ms ease-out",
      }}
    >
      Work in progress.
    </span>
  </div>
);

const GeoGate = ({ children }: { children: React.ReactNode }) => {
  const initial = readCachedVerdict();
  const [verdict, setVerdict] = useState<GeoVerdict | null>(initial);

  useEffect(() => {
    if (verdict) return;
    let cancelled = false;
    geoPromise.then((v) => {
      if (!cancelled) setVerdict(v);
    });
    return () => {
      cancelled = true;
    };
  }, [verdict]);

  // Resolve-first: render nothing but the Ink screen until we have a verdict.
  if (verdict === null) return <InkScreen showText={false} />;
  if (verdict === "blocked") return <InkScreen showText={true} />;
  return <>{children}</>;
};

export default GeoGate;
