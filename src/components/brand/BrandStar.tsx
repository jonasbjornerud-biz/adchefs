import { cn } from "@/lib/utils";

type Props = {
  active?: boolean;
  size?: number;
  className?: string;
  title?: string;
};

/**
 * AdChefs branded star — outlined 6-point geometric mark.
 * Hairline ink stroke; fills to brand soft-blue when `active`.
 */
export function BrandStar({ active = false, size = 16, className, title }: Props) {
  const stroke = "#1A1A1A";
  const fill = active ? "#9ED8F5" : "transparent";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {/* 6-point geometric star (two overlapping triangles), thin stroke */}
      <path
        d="M12 2.2 L14.2 8.8 L21 9.6 L15.6 13.8 L17.6 20.4 L12 16.6 L6.4 20.4 L8.4 13.8 L3 9.6 L9.8 8.8 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BrandStar;