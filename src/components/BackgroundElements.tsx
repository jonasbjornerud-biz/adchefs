interface BackgroundElementsProps {
  variant?: "dark" | "light";
}

const BackgroundElements = ({ variant = "dark" }: BackgroundElementsProps) => {
  const baseOpacity = variant === "dark" ? 0.06 : 0.04;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" aria-hidden="true">
      {/* Film frame corner — top left */}
      <svg
        className="absolute top-[12%] left-[8%] w-16 h-16"
        style={{
          opacity: baseOpacity,
          animation: "float-slow 18s ease-in-out infinite",
          willChange: "transform",
        }}
        viewBox="0 0 64 64"
        fill="none"
        stroke={variant === "dark" ? "white" : "#1a1a2e"}
        strokeWidth="1.5"
      >
        <path d="M4 24V4h20" />
        <path d="M60 40v20H40" />
      </svg>

      {/* Film frame corner — bottom right */}
      <svg
        className="absolute bottom-[15%] right-[10%] w-20 h-20"
        style={{
          opacity: baseOpacity * 0.8,
          animation: "float-slow 22s ease-in-out 3s infinite",
          willChange: "transform",
        }}
        viewBox="0 0 64 64"
        fill="none"
        stroke={variant === "dark" ? "white" : "#1a1a2e"}
        strokeWidth="1.5"
      >
        <path d="M4 24V4h20" />
        <path d="M60 40v20H40" />
      </svg>

      {/* Timeline ticks — horizontal dashed line */}
      <svg
        className="absolute top-[45%] left-[5%] w-48 h-4"
        style={{
          opacity: baseOpacity * 0.7,
          animation: "pulse-soft 6s ease-in-out infinite",
          willChange: "opacity",
        }}
        viewBox="0 0 192 16"
        fill="none"
        stroke={variant === "dark" ? "white" : "#1a1a2e"}
        strokeWidth="1"
      >
        <line x1="0" y1="8" x2="192" y2="8" strokeDasharray="4 8" />
        {[0, 24, 48, 72, 96, 120, 144, 168].map((x) => (
          <line key={x} x1={x} y1="4" x2={x} y2="12" />
        ))}
      </svg>

      {/* Play triangle — outlined */}
      <svg
        className="absolute top-[25%] right-[15%] w-12 h-12"
        style={{
          opacity: baseOpacity,
          animation: "rotate-slow 40s linear infinite",
          willChange: "transform",
        }}
        viewBox="0 0 48 48"
        fill="none"
        stroke={variant === "dark" ? "white" : "#1a1a2e"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <polygon points="14,8 38,24 14,40" />
      </svg>

      {/* Timeline ticks — right side */}
      <svg
        className="absolute bottom-[30%] right-[4%] w-32 h-4"
        style={{
          opacity: baseOpacity * 0.5,
          animation: "pulse-soft 8s ease-in-out 2s infinite",
          willChange: "opacity",
        }}
        viewBox="0 0 128 16"
        fill="none"
        stroke={variant === "dark" ? "white" : "#1a1a2e"}
        strokeWidth="1"
      >
        <line x1="0" y1="8" x2="128" y2="8" strokeDasharray="4 8" />
        {[0, 16, 32, 48, 64, 80, 96, 112].map((x) => (
          <line key={x} x1={x} y1="4" x2={x} y2="12" />
        ))}
      </svg>

      {/* Small film frame — mid left */}
      <svg
        className="absolute top-[65%] left-[15%] w-10 h-10"
        style={{
          opacity: baseOpacity * 0.6,
          animation: "drift 24s ease-in-out infinite",
          willChange: "transform",
        }}
        viewBox="0 0 40 40"
        fill="none"
        stroke={variant === "dark" ? "white" : "#1a1a2e"}
        strokeWidth="1"
      >
        <rect x="4" y="4" width="32" height="32" rx="2" />
        <line x1="4" y1="12" x2="36" y2="12" />
        <line x1="4" y1="28" x2="36" y2="28" />
      </svg>
    </div>
  );
};

export default BackgroundElements;
