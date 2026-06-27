import React from "react";
import { colors } from "../tokens";

/** iOS status bar chrome (ported from IOSFrame). */
export function IOSStatusBar({ dark = true, time = "9:41" }: { dark?: boolean; time?: string }) {
  const c = dark ? "#fff" : "#000";
  return (
    <div
      style={{
        display: "flex",
        gap: 154,
        alignItems: "center",
        justifyContent: "center",
        padding: "21px 24px 19px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 20,
        width: "100%",
      }}
    >
      <div style={{ flex: 1, height: 22, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 1.5 }}>
        <span style={{ fontFamily: '-apple-system, "SF Pro", system-ui', fontWeight: 590, fontSize: 17, lineHeight: "22px", color: c }}>{time}</span>
      </div>
      <div style={{ flex: 1, height: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, paddingTop: 1, paddingRight: 1 }}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c} />
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c} />
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c} />
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c} />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c} />
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c} />
          <circle cx="8.5" cy="10.5" r="1.5" fill={c} />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c} />
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Canonical product phone frame (412×891 inner, ported from ET2Phone with the
 * IOSFrame chrome). `scale` shrinks the whole device for the marketing reel so
 * the fixed 412px frame never forces horizontal scroll on narrow viewports.
 */
export function PhoneFrame({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
  const frame = (
    <div
      style={{
        width: 412,
        height: 891,
        background: "var(--et-frame)",
        borderRadius: 52,
        padding: 9,
        boxShadow: "0 30px 80px rgba(0,0,0,.6), inset 0 0 0 1.5px var(--et-frame-edge)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 44, overflow: "hidden", background: colors.bg, position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 122, height: 36, borderRadius: 18, background: "#000", zIndex: 30 }} />
        <div style={{ flexShrink: 0, position: "relative", zIndex: 20 }}>
          <IOSStatusBar dark />
        </div>
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>{children}</div>
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 3, background: "rgba(var(--et-ink-rgb),0.4)", zIndex: 30 }} />
      </div>
    </div>
  );

  if (scale === 1) return frame;
  return (
    <div style={{ width: 412 * scale, height: 891 * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>{frame}</div>
    </div>
  );
}
