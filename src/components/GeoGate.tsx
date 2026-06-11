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
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center text-center px-6 max-w-md">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-6"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#FF6B9D"
            />
          </svg>
          <h1 className="text-xl font-semibold text-[#1a1a1a] mb-2 tracking-tight">
            This project is still a work in progress
          </h1>
          <p className="text-sm text-[#666666]">
            The creator hasn't published this project yet.
          </p>
        </div>
        <div className="absolute bottom-8 text-xs text-[#999999] font-medium tracking-wide">
          LOVABLE
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GeoGate;
