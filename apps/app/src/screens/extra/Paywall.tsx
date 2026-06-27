"use client";

// Paywall.tsx — ported from ET2PaywallScreen (et2-screens-extra.jsx).
// Plan selection (Annual/Monthly radio — local state), feature checklist,
// 7-day trial copy, CTA, close. ET2P.lime -> colors.blue (Blue·Blue, never
// green); ET2RoundBtn -> RoundButton, ET2Cta -> Cta, ET2Mono -> Mono.
import React from "react";
import { Shell, Cta, RoundButton, Mono, colors, fontFamily } from "@et/brand";

const FEATURES = [
  "Every module, lesson and simulator",
  "Unlimited sim replays — chase the S grade",
  "Leagues, streak shields & bonus XP",
  "New modules every month",
];

interface Plan {
  id: "annual" | "monthly";
  label: string;
  price: string;
  sub: string;
  badge?: string;
}

const PLANS: Plan[] = [
  { id: "annual", label: "Annual", price: "$79.99/yr", sub: "$6.67/mo · save 44%", badge: "BEST VALUE" },
  { id: "monthly", label: "Monthly", price: "$11.99/mo", sub: "Cancel anytime" },
];

export function Paywall({ onClose }: { onClose: () => void }) {
  const [plan, setPlan] = React.useState<Plan["id"]>("annual");

  return (
    <Shell bg="var(--et-screen-blue)" label="Paywall">
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 22px 0", flexShrink: 0 }}>
        <RoundButton onClick={onClose} label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </RoundButton>
      </div>

      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 26px 10px" }}>
        <Mono color={colors.blue} style={{ marginBottom: 10 }}>
          ET Pro
        </Mono>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.06 }}>
          Train like your money depends on it.
        </h1>
        <div
          style={{
            fontFamily: fontFamily.serif,
            fontStyle: "italic",
            fontSize: 17,
            color: "rgba(var(--et-ink-rgb),0.65)",
            marginTop: 10,
            lineHeight: 1.4,
          }}
        >
          Because it does.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 11, margin: "24px 0" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14.5, fontWeight: 600 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" fill={colors.blue} fillOpacity="0.14" />
                <path
                  d="M7.5 12.5l3 3 6-7"
                  stroke={colors.blue}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {f}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PLANS.map((p) => {
            const on = plan === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                style={{
                  appearance: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  border: `2px solid ${on ? colors.blue : colors.line}`,
                  borderRadius: 18,
                  padding: "15px 16px",
                  background: colors.surface,
                  color: colors.ink,
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  boxShadow: on ? `0 0 30px ${colors.blue}22` : "none",
                  position: "relative",
                  minHeight: 54,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    flexShrink: 0,
                    border: `2px solid ${on ? colors.blue : colors.line2}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {on && <span style={{ width: 11, height: 11, borderRadius: "50%", background: colors.blue }} />}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 15.5, fontWeight: 800 }}>{p.label}</span>
                  <span style={{ display: "block", fontSize: 12.5, color: colors.muted, marginTop: 2 }}>{p.sub}</span>
                </span>
                <span
                  style={{
                    fontFamily: fontFamily.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    color: on ? colors.blue : colors.ink,
                    flexShrink: 0,
                  }}
                >
                  {p.price}
                </span>
                {p.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: -9,
                      right: 14,
                      background: colors.blue,
                      color: "#fff",
                      fontFamily: fontFamily.mono,
                      fontSize: 8.5,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      padding: "3px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.1em",
            color: colors.muted,
            textAlign: "center",
            marginTop: 16,
            textTransform: "uppercase",
          }}
        >
          7-day free trial · cancel anytime
        </div>
      </div>

      <Cta label="Start free trial" onClick={onClose} />
    </Shell>
  );
}
