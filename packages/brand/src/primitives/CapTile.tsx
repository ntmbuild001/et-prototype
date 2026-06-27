import React from "react";
import type { CapState, MapSkin } from "../skins";

/** Glossy extruded key-cap tile for the lessons map (ported from ET2CapTile). */
export function CapTile({
  state = "done",
  isCurrent = false,
  skin,
  children,
  big = false,
  size,
}: {
  state?: CapState;
  isCurrent?: boolean;
  skin: MapSkin;
  children?: React.ReactNode;
  big?: boolean;
  size?: number;
}) {
  const t = skin.cap[state];
  const W = size || (big ? (isCurrent ? 112 : 98) : 64);
  const lip = big ? 14 : 9;
  return (
    <div
      style={{
        position: "relative",
        width: W,
        height: W + lip,
        filter: isCurrent && t.glow ? `drop-shadow(0 0 22px ${t.glow})` : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: lip,
          bottom: 0,
          borderRadius: big ? 26 : 16,
          background: t.lip,
          boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: W,
          borderRadius: big ? 26 : 16,
          background: t.top,
          border: `1px solid ${t.edge}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "8%",
            right: "8%",
            top: "6%",
            height: "42%",
            borderRadius: "50%",
            background: "radial-gradient(120% 100% at 30% 0%, rgba(var(--et-ink-rgb),0.55), rgba(var(--et-ink-rgb),0) 70%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
