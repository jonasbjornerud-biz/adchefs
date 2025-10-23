import React from "react"
import { cn } from "@/lib/utils"

type SpotlightProps = { className?: string; fill?: string }

export const Spotlight = ({ className, fill }: SpotlightProps) => (
  <svg
    className={cn("pointer-events-none absolute opacity-20 blur-2xl", className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 3787 2842"
    fill="none"
  >
    <g filter="url(#f)">
      <ellipse
        cx="1924.71"
        cy="273.501"
        rx="1924.71"
        ry="273.501"
        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        fill={fill || "#6b4bff"}
        fillOpacity="0.18"
      />
    </g>
    <defs>
      <filter
        id="f"
        x="0.86"
        y="0.83"
        width="3785.16"
        height="2840.26"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
)
