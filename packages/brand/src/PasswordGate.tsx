"use client";

// PasswordGate.tsx — a lightweight client-side password screen for a PRIVATE
// PREVIEW. This is deterrence, not real security: the app bundle is still
// downloadable, so anyone determined can bypass it. It gates casual access and
// keeps the preview link shareable behind one shared password.
//
// On correct entry the unlock is remembered on the device (localStorage), so a
// visitor only types the password once per browser. Wrap a surface's root with
// <PasswordGate>…</PasswordGate>.

import React from "react";
import { ETLogo } from "./ETLogo";
import { colors, fontFamily } from "./tokens";

const GATE_KEY = "et-gate-v1";
const PASSWORD = "eternal2K27";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(GATE_KEY) === "1") setUnlocked(true);
    } catch {
      /* storage blocked — stays gated */
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      try {
        localStorage.setItem(GATE_KEY, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  // Before the client mounts we can't know the unlock state — render a neutral
  // black screen so gated content never flashes.
  if (!mounted) return <div style={{ minHeight: "100dvh", background: colors.bg }} />;
  if (unlocked) return <>{children}</>;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--et-screen-blue)",
        color: colors.ink,
        fontFamily: fontFamily.sans,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "rgba(var(--et-surface-rgb),0.82)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: `1px solid ${colors.line2}`,
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <ETLogo variant="trail" size={40} />
        <div
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: colors.blueLite,
            margin: "22px 0 10px",
          }}
        >
          Private Preview
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Enter the password.</div>
        <div style={{ fontSize: 14.5, color: colors.muted, lineHeight: 1.5, marginBottom: 24, maxWidth: 280 }}>
          Elite Transition is in private beta. Enter the password to continue.
        </div>

        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          aria-label="Password"
          autoFocus
          style={{
            width: "100%",
            height: 54,
            padding: "0 18px",
            boxSizing: "border-box",
            background: colors.surface,
            border: `1px solid ${error ? colors.error : colors.line2}`,
            borderRadius: 14,
            color: colors.ink,
            fontSize: 16,
            fontFamily: fontFamily.sans,
            outline: "none",
            textAlign: "center",
            letterSpacing: "0.04em",
          }}
        />
        {error && (
          <div style={{ color: colors.error, fontSize: 13, fontWeight: 600, marginTop: 10 }}>Incorrect password.</div>
        )}

        <button
          type="submit"
          style={{
            appearance: "none",
            border: 0,
            cursor: "pointer",
            width: "100%",
            height: 54,
            marginTop: 16,
            borderRadius: 999,
            background: colors.blue,
            color: "#fff",
            fontFamily: fontFamily.sans,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            boxShadow: `0 10px 30px ${colors.blue}55`,
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}
