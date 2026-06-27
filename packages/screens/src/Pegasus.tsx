"use client";

// Pegasus.tsx — the ET AI deal-coach chat surface (ported from et2-pegasus.jsx).
// Branded "Eddy" moon mark, message bubbles (user vs coach), a typing
// indicator, suggestion chips and a composer. The composer does a local echo
// (non-functional canned reply) so it feels real without any data fetching.
// Prop-driven & store-free; omit `nav` for the frameless landing reel.

import React from "react";
import { colors, fontFamily, Shell } from "@et/brand";
import { TabBar } from "./TabBar";
import type { TabId } from "./TabBar";
import { PegasusMoon, usePegasusMoonStyles } from "./PegasusMoon";

export interface PegasusMessage {
  from: "user" | "coach";
  text: string;
}

export interface PegasusProps {
  /** Conversation thread. Defaults to the canned demo convo. */
  messages?: PegasusMessage[];
  /** Suggestion chips shown above the composer. */
  suggestions?: string[];
  onProfile?: () => void;
  /** Top-right avatar initials. */
  initials?: string;
  nav?: { active: TabId; onTab: (t: TabId) => void };
}

// The animated "Eddy" moon mark now lives in ./PegasusMoon (shared with the
// bottom-nav Pegasus tab). It injects the keyframes used here for the typing
// dots too (pegDotBob), so usePegasusMoonStyles() is called below.

function Bubble({ from, text, fresh }: { from: "user" | "coach"; text: string; fresh?: boolean }) {
  const me = from === "user";
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "82%",
          background: me ? colors.blue : colors.surface,
          color: me ? "#fff" : colors.ink,
          border: me ? 0 : `1px solid ${colors.line}`,
          borderRadius: 16,
          borderTopRightRadius: me ? 5 : 16,
          borderTopLeftRadius: me ? 16 : 5,
          padding: "11px 14px",
          fontSize: 14.5,
          fontWeight: me ? 600 : 500,
          lineHeight: 1.45,
        }}
      >
        {text}
      </div>
    </div>
  );
}

const FALLBACK_REPLY =
  "Anchor every decision to a number — the 1% rule to filter, DSCR to finance, the 70% rule to flip. If the math doesn't clear the bar, the answer is no, and that's a win.";

export function Pegasus(props: PegasusProps) {
  const {
    messages: initial = pegasusDemo.messages!,
    suggestions = pegasusDemo.suggestions!,
    onProfile,
    initials = "AC",
    nav,
  } = props;

  usePegasusMoonStyles();

  const [thread, setThread] = React.useState<PegasusMessage[]>(initial);
  const [typing, setTyping] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [openChips, setOpenChips] = React.useState(suggestions);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread, typing]);

  const ask = (userText: string) => {
    setThread((t) => [...t, { from: "user", text: userText }]);
    setTyping(true);
    timerRef.current = setTimeout(() => {
      setTyping(false);
      setThread((t) => [...t, { from: "coach", text: FALLBACK_REPLY }]);
    }, 950);
  };

  const tapChip = (chip: string) => {
    setOpenChips((c) => c.filter((x) => x !== chip));
    ask(chip);
  };
  const send = () => {
    const v = draft.trim();
    if (!v) return;
    setDraft("");
    ask(v);
  };

  return (
    <Shell bg="var(--et-screen-blue)" label="Pegasus">
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px 14px",
          flexShrink: 0,
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            background: colors.surface,
            border: `1px solid ${colors.line2}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PegasusMoon size={28} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em" }}>Pegasus</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.green }} />
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.muted,
              }}
            >
              Deal coach · online
            </span>
          </div>
        </div>
        <button
          onClick={onProfile}
          aria-label="Profile"
          style={{
            appearance: "none",
            cursor: onProfile ? "pointer" : "default",
            border: 0,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: colors.surface2,
            color: colors.blue,
            flexShrink: 0,
            fontFamily: fontFamily.mono,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {initials}
        </button>
      </div>

      {/* thread */}
      <div
        ref={scrollRef}
        className="et-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 18px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {thread.map((m, i) => (
          <Bubble key={i} from={m.from} text={m.text} />
        ))}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                background: colors.surface,
                border: `1px solid ${colors.line}`,
                borderRadius: 16,
                borderTopLeftRadius: 5,
                padding: "13px 16px",
                display: "flex",
                gap: 5,
              }}
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="pegDot"
                  style={{
                    animation: "pegDotBob 1s ease-in-out infinite",
                    animationDelay: `${d * 0.15}s`,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: colors.muted,
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* suggestion chips */}
      {openChips.length > 0 && !typing && (
        <div
          className="et-scroll"
          style={{ flexShrink: 0, display: "flex", gap: 8, padding: "6px 18px 10px", overflowX: "auto" }}
        >
          {openChips.map((chip) => (
            <button
              key={chip}
              onClick={() => tapChip(chip)}
              style={{
                appearance: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                border: `1px solid ${colors.line2}`,
                borderRadius: 999,
                padding: "9px 14px",
                background: colors.surface,
                color: colors.ink,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* composer */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: 10,
          alignItems: "center",
          padding: "8px 16px 14px",
          borderTop: `1px solid ${colors.line}`,
          background: colors.bg,
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Ask Pegasus about a deal…"
          style={{
            flex: 1,
            appearance: "none",
            background: colors.surface,
            border: `1px solid ${colors.line2}`,
            borderRadius: 999,
            padding: "13px 18px",
            color: colors.ink,
            fontFamily: fontFamily.sans,
            fontSize: 14.5,
            outline: "none",
          }}
        />
        <button
          onClick={send}
          aria-label="Send"
          style={{
            appearance: "none",
            cursor: "pointer",
            border: 0,
            flexShrink: 0,
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: colors.blue,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {nav && <TabBar active={nav.active} onTab={nav.onTab} />}
    </Shell>
  );
}

export const pegasusDemo: PegasusProps = {
  messages: [
    {
      from: "coach",
      text: "I'm Pegasus — your deal coach. Ask me anything about a property, a number, or a lesson.",
    },
    { from: "user", text: "Explain DSCR like I'm new." },
    {
      from: "coach",
      text: "DSCR = Net Operating Income ÷ annual debt payments. At 1.0 the property exactly covers its mortgage. Lenders usually want 1.20+ — a 20% cushion.",
    },
  ],
  suggestions: [
    "Is a $170k flip on a $300k ARV good?",
    "Help me tighten my buy box",
    "What's a motivated-seller signal?",
  ],
  onProfile: () => {},
};
