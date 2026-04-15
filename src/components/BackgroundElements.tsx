const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" aria-hidden="true">
      {/* Scanlines */}
      <div className="scanline-overlay opacity-20" />

      {/* Film frame bracket — top left */}
      <svg
        className="absolute top-[10%] left-[6%] w-20 h-20"
        style={{ opacity: 0.06, animation: "float-slow 20s ease-in-out infinite", willChange: "transform" }}
        viewBox="0 0 80 80"
        fill="none"
        stroke="white"
        strokeWidth="1"
      >
        <path d="M4 30V4h26" />
        <path d="M76 50v26H50" />
      </svg>

      {/* Film frame bracket — bottom right */}
      <svg
        className="absolute bottom-[12%] right-[8%] w-24 h-24"
        style={{ opacity: 0.04, animation: "float-slow 25s ease-in-out 4s infinite", willChange: "transform" }}
        viewBox="0 0 80 80"
        fill="none"
        stroke="white"
        strokeWidth="1"
      >
        <path d="M4 30V4h26" />
        <path d="M76 50v26H50" />
      </svg>

      {/* Timeline ticks */}
      <svg
        className="absolute top-[40%] left-[3%] w-56 h-4"
        style={{ opacity: 0.05, animation: "pulse-glow 7s ease-in-out infinite", willChange: "opacity" }}
        viewBox="0 0 224 16"
        fill="none"
        stroke="white"
        strokeWidth="0.8"
      >
        <line x1="0" y1="8" x2="224" y2="8" strokeDasharray="3 10" />
        {[0, 28, 56, 84, 112, 140, 168, 196].map((x) => (
          <line key={x} x1={x} y1="3" x2={x} y2="13" />
        ))}
      </svg>

      {/* Play triangle */}
      <svg
        className="absolute top-[22%] right-[12%] w-14 h-14"
        style={{ opacity: 0.05, animation: "rotate-slow 50s linear infinite", willChange: "transform" }}
        viewBox="0 0 56 56"
        fill="none"
        stroke="white"
        strokeWidth="1"
        strokeLinejoin="round"
      >
        <polygon points="16,8 44,28 16,48" />
      </svg>

      {/* Data stream dots — left edge */}
      <div className="absolute left-[2%] top-[20%] flex flex-col gap-8" style={{ opacity: 0.04 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-1 h-1 bg-white rounded-full"
            style={{ animation: `pulse-glow 3s ease-in-out ${i * 0.5}s infinite` }}
          />
        ))}
      </div>

      {/* Floating mono text */}
      <div
        className="absolute bottom-[20%] left-[12%] mono-label text-white/[0.03]"
        style={{ animation: "drift 30s ease-in-out infinite" }}
      >
        FRAME_BUFFER_ACTIVE
      </div>

      {/* Floating mono text — right */}
      <div
        className="absolute top-[60%] right-[6%] mono-label text-white/[0.03]"
        style={{ animation: "drift 26s ease-in-out 5s infinite" }}
      >
        RENDER_PIPELINE_v2.4
      </div>

      {/* Crosshair */}
      <svg
        className="absolute top-[70%] left-[50%] w-8 h-8"
        style={{ opacity: 0.04, animation: "float-slow 18s ease-in-out 2s infinite" }}
        viewBox="0 0 32 32"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
      >
        <line x1="16" y1="0" x2="16" y2="32" />
        <line x1="0" y1="16" x2="32" y2="16" />
        <circle cx="16" cy="16" r="6" />
      </svg>
    </div>
  );
};

export default BackgroundElements;
