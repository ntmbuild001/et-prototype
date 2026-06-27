import React from "react";
import { colors, fontFamily } from "../tokens";
import { RoundButton } from "./Button";

/** Rounded surface card. */
export function Card({
  children,
  style = {},
  active = false,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  active?: boolean;
}) {
  return (
    <div
      style={{
        background: active ? colors.surface2 : colors.surface,
        border: `1px solid ${colors.line}`,
        borderRadius: 22,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Small chip / tag. */
export function Tag({
  children,
  color,
  bg,
  style = {},
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 26,
        padding: "0 10px",
        borderRadius: 999,
        background: bg || colors.surface2,
        border: `1px solid ${colors.line}`,
        color: color || colors.muted,
        fontFamily: fontFamily.mono,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Stat block — big value over a mono label. */
export function Stat({
  value,
  label,
  color,
  align = "left",
}: {
  value: React.ReactNode;
  label: React.ReactNode;
  color?: string;
  align?: "left" | "center";
}) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: color || colors.ink }}>{value}</div>
      <div
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: colors.muted,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/** Screen shell — fills the phone frame. */
export function Shell({
  children,
  bg,
  label,
}: {
  children: React.ReactNode;
  bg?: string;
  label?: string;
}) {
  return (
    <div
      data-screen-label={label}
      style={{
        width: "100%",
        height: "100%",
        background: bg || colors.bg,
        color: colors.ink,
        fontFamily: fontFamily.sans,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

/** Screen header with optional back/close and eyebrow/title/sub. */
export function Header({
  eyebrow,
  eyebrowColor,
  title,
  sub,
  onBack,
  onClose,
}: {
  eyebrow?: React.ReactNode;
  eyebrowColor?: string;
  title?: React.ReactNode;
  sub?: React.ReactNode;
  onBack?: () => void;
  onClose?: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 22px 0", gap: 12, flexShrink: 0 }}>
      {onBack ? (
        <RoundButton onClick={onBack} label="Back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </RoundButton>
      ) : (
        <div style={{ width: 40 }} />
      )}
      <div style={{ flex: 1, paddingTop: 2 }}>
        {eyebrow && (
          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: eyebrowColor || colors.blue,
              marginBottom: 4,
            }}
          >
            {eyebrow}
          </div>
        )}
        {title && <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{title}</div>}
        {sub && <div style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {onClose ? (
        <RoundButton onClick={onClose} label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </RoundButton>
      ) : (
        <div style={{ width: 40 }} />
      )}
    </div>
  );
}

/** Thin progress bar. */
export function Progress({ percent, color }: { percent: number; color?: string }) {
  return (
    <div style={{ padding: "16px 22px 0", flexShrink: 0 }}>
      <div style={{ height: 4, background: colors.surface, borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color || colors.blue,
            borderRadius: 999,
            transition: "width .45s cubic-bezier(.22,1,.36,1)",
          }}
        />
      </div>
    </div>
  );
}
