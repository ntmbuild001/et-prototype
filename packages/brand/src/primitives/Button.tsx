import React from "react";
import { colors, fontFamily } from "../tokens";

type CtaColor = "blue" | "lime" | "ghost" | "white";

/** Full-width pill CTA (ported from ET2Cta). `lime` maps to the blue accent. */
export function Cta({
  label,
  color = "blue",
  onClick,
  disabled,
  arrow = true,
}: {
  label: React.ReactNode;
  color?: CtaColor;
  onClick?: () => void;
  disabled?: boolean;
  arrow?: boolean;
}) {
  const bg = disabled
    ? colors.surface
    : color === "ghost"
    ? colors.surface
    : color === "white"
    ? "#fff"
    : colors.blue;
  const fg = disabled
    ? colors.muted
    : color === "ghost"
    ? colors.ink
    : color === "white"
    ? "#000"
    : "#fff";
  return (
    <div style={{ padding: "14px 22px 22px", flexShrink: 0 }}>
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={{
          appearance: "none",
          cursor: disabled ? "default" : "pointer",
          width: "100%",
          height: 58,
          borderRadius: 999,
          border: 0,
          background: bg,
          color: fg,
          fontFamily: fontFamily.sans,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "-0.005em",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {label}
        {arrow && !disabled && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

/** 40px circular icon button (ported from ET2RoundBtn). */
export function RoundButton({
  onClick,
  label,
  children,
}: {
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        appearance: "none",
        cursor: "pointer",
        border: 0,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: colors.surface,
        color: colors.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

/** Inline pill button used on the marketing site (ported from landing PillBtn). */
export function PillButton({
  children,
  variant = "primary",
  onClick,
  href,
  type,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
}) {
  const primary = variant === "primary";
  const style: React.CSSProperties = {
    appearance: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    padding: "0 22px",
    borderRadius: 999,
    border: primary ? "0" : `1px solid ${colors.lineSoft2}`,
    background: primary ? colors.blue : "transparent",
    color: primary ? "#fff" : colors.ink,
    fontFamily: fontFamily.sans,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    boxShadow: primary ? `0 10px 34px ${colors.blue}55` : "none",
    textDecoration: "none",
  };
  if (href) {
    return (
      <a href={href} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button type={type || "button"} onClick={onClick} style={style}>
      {children}
    </button>
  );
}
