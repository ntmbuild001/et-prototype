"use client";

// Waitlist.tsx — the gamified email-capture form.
// Ported from `WaitlistForm` in et-landing-1.jsx. Backed by the `waitlist`
// client (apps/web/src/lib/waitlist.ts) which is currently a STUB: it returns a
// canned position (~#2,417) and persists to localStorage, no network. Swap the
// stub for a real backend later — this component never touches storage directly.

import React from "react";
import { colors, fontFamily, PillButton } from "@et/brand";
import { waitlist, type WaitlistEntry } from "@/lib/waitlist";

/** Goal the progress bar fills toward (matches the prototype's `target`). */
const WAITLIST_TARGET = 3000;

const EMAIL_RE = /.+@.+\..+/;

export function Waitlist({ size = "lg" }: { size?: "md" | "lg" }) {
  const [email, setEmail] = React.useState("");
  const [err, setErr] = React.useState(false);
  const [joined, setJoined] = React.useState<WaitlistEntry | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Restore a previously persisted spot once mounted (browser-only).
  React.useEffect(() => {
    setJoined(waitlist.current());
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setErr(true);
      return;
    }
    setSubmitting(true);
    try {
      const { position } = await waitlist.join(email);
      setJoined({ email, position, at: Date.now() });
    } finally {
      setSubmitting(false);
    }
  };

  if (joined) {
    const pct = Math.min(100, Math.round((joined.position / WAITLIST_TARGET) * 100));
    return (
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.lineSoft2}`,
          borderRadius: 20,
          padding: 24,
          maxWidth: 520,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: colors.blue,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div style={{ fontFamily: fontFamily.sans, fontSize: 19, fontWeight: 800, color: colors.ink, letterSpacing: "-0.01em" }}>
            You&rsquo;re on the list.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: fontFamily.mono, fontSize: 13, color: colors.muted, letterSpacing: "0.1em" }}>YOUR SPOT</span>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 30, fontWeight: 800, color: colors.blueLite, letterSpacing: "-0.02em" }}>
            #{joined.position.toLocaleString()}
          </span>
        </div>

        <div style={{ height: 8, borderRadius: 999, background: colors.surface2, overflow: "hidden", margin: "14px 0 10px" }}>
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${colors.blueDeep}, ${colors.blue} 60%, ${colors.blueLite})`,
            }}
          />
        </div>

        <div style={{ fontFamily: fontFamily.sans, fontSize: 14, color: colors.muted }}>
          Move up the list: <span style={{ color: colors.ink, fontWeight: 600 }}>refer 3 teammates</span> to skip to early access.
        </div>
      </div>
    );
  }

  const inputPad = size === "lg" ? "18px 24px" : "15px 22px";

  return (
    <form onSubmit={submit} style={{ width: "100%", maxWidth: 540 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErr(false);
          }}
          type="email"
          placeholder="you@team.com"
          aria-label="Email address"
          aria-invalid={err}
          style={{
            flex: "1 1 240px",
            minWidth: 0,
            appearance: "none",
            borderRadius: 999,
            padding: inputPad,
            background: colors.surface,
            border: `1px solid ${err ? colors.error : colors.lineSoft2}`,
            color: colors.ink,
            fontFamily: fontFamily.sans,
            fontSize: 16,
            outline: "none",
          }}
        />
        <PillButton variant="primary" type="submit">
          {submitting ? "Joining…" : "Join the waitlist"}
        </PillButton>
      </div>

      {err && (
        <div style={{ marginTop: 8, fontFamily: fontFamily.sans, fontSize: 13.5, color: colors.error }}>
          Enter a valid email address.
        </div>
      )}

      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, fontFamily: fontFamily.sans, fontSize: 14, color: colors.muted }}>
        <span style={{ display: "inline-flex" }}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                marginLeft: i ? -8 : 0,
                border: `2px solid ${colors.bg}`,
                background: `linear-gradient(150deg, ${colors.blueLite}, ${colors.blueDeep})`,
              }}
            />
          ))}
        </span>
        <span>
          <span style={{ color: colors.ink, fontWeight: 700 }}>2,400+ athletes</span> already in line.
        </span>
      </div>

      {/* NOTE: stub waitlist — positions are canned client-side. See lib/waitlist.ts */}
    </form>
  );
}
