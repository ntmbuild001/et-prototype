"use client";

// Settings.tsx — ported from ET2SettingsScreen (et2-screens-extra.jsx).
// Toggle rows (sound, haptics — local state) + link rows. ET2P.lime ->
// colors.blue (Blue·Blue, never green).
import React from "react";
import { Shell, Header, Card, colors, fontFamily } from "@et/brand";

// Inline fallback: prototype's ET2Row (link/value row with forward chevron).
function Row({
  label,
  sub,
  value,
  onClick,
  danger,
  last,
}: {
  label: React.ReactNode;
  sub?: React.ReactNode;
  value?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        appearance: "none",
        cursor: onClick ? "pointer" : "default",
        textAlign: "left",
        width: "100%",
        background: "transparent",
        border: 0,
        borderBottom: last ? 0 : `1px solid ${colors.line}`,
        padding: "15px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        color: colors.ink,
        minHeight: 54,
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: danger ? colors.error : colors.ink }}>
          {label}
        </span>
        {sub && <span style={{ display: "block", fontSize: 12.5, color: colors.muted, marginTop: 2 }}>{sub}</span>}
      </span>
      {value && (
        <span style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, color: colors.muted, flexShrink: 0 }}>
          {value}
        </span>
      )}
      {onClick && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M9 6l6 6-6 6" stroke={colors.muted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

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

export function Settings({
  onBack,
  onNotifications,
  onPaywall,
}: {
  onBack: () => void;
  onNotifications: () => void;
  onPaywall: () => void;
}) {
  const [s, setS] = React.useState({ sound: true, haptics: true });

  return (
    <Shell label="Settings">
      <Header onBack={onBack} eyebrow="Account" title="Settings" />
      <div
        className="et-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "20px 22px 24px", display: "flex", flexDirection: "column", gap: 16 }}
      >
        <Card style={{ overflow: "hidden" }}>
          <Row label="Notifications" sub="Reminders, streak alerts" onClick={onNotifications} />
          <Toggle label="Sound effects" value={s.sound} onChange={(v) => setS({ ...s, sound: v })} />
          <Toggle label="Haptics" value={s.haptics} onChange={(v) => setS({ ...s, haptics: v })} last />
        </Card>

        <Card style={{ overflow: "hidden" }}>
          <Row label="Subscription" sub="Free plan" value="UPGRADE" onClick={onPaywall} />
          <Row label="Email" value="alex@chen.co" last />
        </Card>

        <Card style={{ overflow: "hidden" }}>
          <Row label="Restore purchases" onClick={() => {}} />
          <Row label="Privacy policy" onClick={() => {}} />
          <Row label="Sign out" danger onClick={() => {}} last />
        </Card>

        <div
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 9.5,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: colors.muted,
            textAlign: "center",
          }}
        >
          Elite Transition · v0.4 prototype
        </div>
      </div>
    </Shell>
  );
}
