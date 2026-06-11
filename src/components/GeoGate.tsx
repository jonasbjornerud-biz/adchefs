import { useEffect, useState } from "react";

// =============================================================================
// TEMPORARY GEO-BLOCK FOR NORWAY
// Remove this component and its wrapper in Index.tsx to lift the block.
// =============================================================================

type GeoStatus = "loading" | "allowed" | "blocked";

let cachedStatus: GeoStatus | null = null;

const GeoGate = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<GeoStatus>(cachedStatus ?? "loading");

  useEffect(() => {
    if (cachedStatus) {
      setStatus(cachedStatus);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Geo lookup failed");
        return res.json();
      })
      .then((data) => {
        const isNorway = data?.country_code === "NO";
        const result: GeoStatus = isNorway ? "blocked" : "allowed";
        cachedStatus = result;
        setStatus(result);
      })
      .catch(() => {
        cachedStatus = "allowed";
        setStatus("allowed");
      })
      .finally(() => clearTimeout(timeoutId));

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  // Optimistically render the site while loading; swap to block only if confirmed NO.
  if (status === "blocked") {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
        style={{ backgroundColor: "#F7F6F3" }}
      >
        <img
          src={adchefsLogo.url}
          alt="AdChefs"
          className="h-12 w-auto mb-6"
        />
        <p
          className="text-sm font-normal"
          style={{ color: "#75726B", fontFamily: "Inter, sans-serif" }}
        >
          Currently unavailable in your region.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default GeoGate;
