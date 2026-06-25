interface AnimationPlaceholderProps {
  /** Optional poster image shown until/while video loads, or as the static frame if no video is provided. */
  poster?: string;
  /** Optional MP4 source. Leave undefined to render poster only. */
  srcMp4?: string;
  /** Optional WebM source. Leave undefined to render poster only. */
  srcWebm?: string;
  /** Accessible label for the media block. */
  label?: string;
  className?: string;
}

/**
 * Contained media block for use at the top of a card.
 * Renders an autoplay/loop/muted/playsinline video with a poster fallback.
 * Surface background, rounded-[4px], fixed 16:9 aspect ratio (no layout shift).
 * Small JetBrains Mono "ANIMATION" label in the corner so placeholders stay visible
 * until real assets are dropped in.
 */
const AnimationPlaceholder = ({
  poster,
  srcMp4,
  srcWebm,
  label = "ANIMATION",
  className,
}: AnimationPlaceholderProps) => {
  const hasVideo = Boolean(srcMp4 || srcWebm);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[4px] ${className ?? ""}`}
      style={{
        aspectRatio: "16 / 9",
        background: "#EEEDE8",
      }}
      aria-label={label}
    >
      {hasVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* Drop sources here when ready: */}
          {srcWebm ? <source src={srcWebm} type="video/webm" /> : null}
          {srcMp4 ? <source src={srcMp4} type="video/mp4" /> : null}
        </video>
      ) : poster ? (
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* Corner label keeps placeholders visible until the asset is swapped. */}
      <span
        className="absolute left-3 top-3 inline-flex items-center rounded-[4px] border px-[8px] py-[3px]"
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#75726B",
          borderColor: "rgba(26,26,26,0.12)",
          background: "rgba(247,246,243,0.7)",
          backdropFilter: "blur(4px)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default AnimationPlaceholder;