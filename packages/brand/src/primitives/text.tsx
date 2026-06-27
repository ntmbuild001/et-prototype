import React from "react";
import { colors, fontFamily } from "../tokens";

/** Monospace uppercase micro-label (eyebrow / stat label). */
export function Mono({
  children,
  color,
  size = 10.5,
  style = {},
}: {
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: fontFamily.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: color || colors.muted,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Eyebrow label — alias of Mono defaulting to the blue accent. */
export function Eyebrow({
  children,
  color,
  style = {},
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Mono color={color || colors.blue} style={style}>
      {children}
    </Mono>
  );
}
