"use client";

// PhoneReel — shared wrapper for the marketing-site "reel". Renders a real
// product screen inside a SCALED PhoneFrame and, on scroll into view, plays a
// subtle entrance (opacity + translateY + scale) driven by brand's useReveal.
//
// The scaled PhoneFrame reserves its own 412*scale × 891*scale box (see
// PhoneFrame), so this wrapper only needs to center that box within the parent
// and never causes horizontal scroll on narrow viewports.

import React from "react";
import { PhoneFrame, useReveal } from "@et/brand";

const DEFAULT_SCALE = 0.62;

export interface PhoneReelProps {
  children: React.ReactNode;
  /** Shrink factor for the 412×891 device frame. Defaults to 0.62. */
  scale?: number;
  /** Play the scroll-triggered entrance. Defaults to true. */
  reveal?: boolean;
}

export function PhoneReel({ children, scale, reveal = true }: PhoneReelProps) {
  const resolvedScale = scale ?? DEFAULT_SCALE;
  const { ref, progress } = useReveal(700);

  // When reveal is disabled, hold at the fully-settled state.
  const p = reveal ? progress : 1;

  // Ease-out so the entrance decelerates into place.
  const eased = 1 - Math.pow(1 - p, 3);

  const style: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    opacity: 0.15 + eased * 0.85,
    transform: `translateY(${(1 - eased) * 28}px) scale(${0.96 + eased * 0.04})`,
    transformOrigin: "center top",
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} style={style}>
      <PhoneFrame scale={resolvedScale}>{children}</PhoneFrame>
    </div>
  );
}
