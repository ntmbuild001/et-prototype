"use client";

// Notifications.tsx — ported from ET2NotificationsScreen (et2-screens-extra.jsx).
// Daily reminder toggle + time picker, streak alerts, league updates, module
// drops (all local state). ET2P.lime -> colors.blue (Blue·Blue, never green).
import React from "react";
import { Shell, Header, Card, colors, fontFamily } from "@et/brand";

// Inline fallback: prototype's ET2Toggle (label + iOS-style switch).
function Toggle({
  label,
  sub,
  value,
  onChange,
  last,
}: {
  label: React.ReactNode;
  sub?: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "15px 18px",
        borderBottom: last ? 0 : `1px solid ${colors.line}`,
        minHeight: 54,
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>{label}</span>
        {sub && <span style={{ display: "block", fontSize: 12.5, color: colors.muted, marginTop: 2 }}>{sub}</span>}
      </span>
      <button
        onClick={() => onChange(!value)}
        aria-label={typeof label === "string" ? label : "toggle"}
        style={{
          appearance: "none",
          cursor: "pointer",
          border: 0,
          flexShrink: 0,
          width: 50,
          height: 30,
          borderRadius: 999,
          position: "relative",
          background: value ? colors.blue : colors.line2,
          transition: "background .2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: value ? 23 : 3,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: value ? colors.ink : "#777",
            transition: "left .2s",
          }}
        />
      </button>
    </div>
  );
}

const TIMES = ["8:00 AM", "12:30 PM", "7:00 PM"];

export function Notifications({ onBack }: { onBack: () => void }) {
  const [n, setN] = React.useState({ daily: true, streak: true, league: true, drops: false });
  const [time, setTime] = React.useState("7:00 PM");

  return (
    <Shell label="Notifications">
      <Header onBack={onBack} eyebrow="Settings" title="Notifications" />
      <div
        className="et-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "20px 22px 24px", display: "flex", flexDirection: "column", gap: 16 }}
      >
        <Card style={{ overflow: "hidden" }}>
          <Toggle
            label="Daily reminder"
            sub="One nudge to keep the streak alive"
            value={n.daily}
            onChange={(v) => setN({ ...n, daily: v })}
            last={!n.daily}
          />
          {n.daily && (
            <div style={{ padding: "4px 18px 16px", display: "flex", gap: 8 }}>
              {TIMES.map((t) => {
                const on = time === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    style={{
                      appearance: "none",
                      cursor: "pointer",
                      flex: 1,
                      border: `1.5px solid ${on ? colors.blue : colors.line}`,
                      borderRadius: 12,
                      background: on ? "rgba(30,91,255,0.10)" : colors.surface2,
                      color: colors.ink,
                      padding: "10px 0",
                      fontFamily: fontFamily.mono,
                      fontSize: 11,
                      fontWeight: 700,
                      minHeight: 44,
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card style={{ overflow: "hidden" }}>
          <Toggle
            label="Streak alerts"
            sub="Warn me before midnight if I haven't trained"
            value={n.streak}
            onChange={(v) => setN({ ...n, streak: v })}
          />
          <Toggle
            label="League updates"
            sub="Rank changes, promotion day"
            value={n.league}
            onChange={(v) => setN({ ...n, league: v })}
          />
          <Toggle label="New module drops" value={n.drops} onChange={(v) => setN({ ...n, drops: v })} last />
        </Card>
      </div>
    </Shell>
  );
}
