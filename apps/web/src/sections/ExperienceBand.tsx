"use client";

// ExperienceBand.tsx — "A locker room for owners" band.
// Ported from `ExperienceBand` (et-landing-3.jsx) + the `AnimatedFeed` / `FeedCard`
// / `FeedIcon` / `EXP_FEED` machinery (et-landing-motion.jsx). id="experience"
// anchors the "Experience" nav link.
//
// The infinite feed scroll uses a CSS keyframe (`etExpFeedScroll`) defined inline
// via a <style> tag — the prototype relied on a global `etFeedScroll` keyframe
// that is not part of @et/brand's styles.css, so we scope our own here. The
// animation is paused under prefers-reduced-motion.
//
// The 3 value points originally used the brand puffy icons (ET2Puffy); here we
// inline matching line icons (the FeedIcon set) to keep this section
// self-contained and avoid coupling to puffy type names.

import React from "react";
import { colors, fontFamily } from "@et/brand";

type IconName = "trophy" | "home" | "coins" | "flame" | "moon" | "apartments";

interface FeedItem {
  icon: IconName;
  title: string;
  sub?: string;
  time?: string;
  accent?: string;
  state?: "done" | "current" | "locked";
}

const EXP_FEED: ReadonlyArray<FeedItem> = [
  { icon: "trophy", title: "Fred Brown reached Elite Mogul", time: "2m", accent: colors.blueLite },
  { icon: "home", title: "New deal tracked", sub: "The Fifth & Fondren · Jackson, MS", time: "8m" },
  { icon: "coins", title: "Bobby Evans · +$48K equity", time: "21m" },
  { icon: "flame", title: "Marcus hit a 12-day streak", time: "47m" },
  { icon: "moon", title: "Pegasus answered a deal question", time: "1h" },
  { icon: "apartments", title: "David Fales opened deal #2", time: "2h" },
];

const VALUE_POINTS: ReadonlyArray<{ icon: IconName; t: string }> = [
  { icon: "trophy", t: "A status, not a subscription" },
  { icon: "apartments", t: "Deals you can follow" },
  { icon: "coins", t: "A network that compounds" },
];

export function ExperienceBand() {
  return (
    <section id="experience" style={{ position: "relative", padding: "110px 0", overflow: "hidden" }}>
      <div
        className="et-exp-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 28px",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: colors.blue, marginBottom: 16 }}>
            The experience
          </div>
          <h2
            style={{
              fontFamily: fontFamily.sans,
              fontSize: "clamp(32px, 4vw, 50px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.04,
              color: colors.ink,
              margin: "0 0 18px",
              textWrap: "balance",
            }}
          >
            More than an app.
            <br />
            <span style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontWeight: 400, color: colors.blue }}>A private room for owners.</span>
          </h2>
          <p style={{ fontFamily: fontFamily.sans, fontSize: 18, lineHeight: 1.55, color: colors.muted, margin: 0, maxWidth: 460 }}>
            We&rsquo;re not selling a course. We&rsquo;re building the room where athletes become owners, and your standing in it is something you earn.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 30 }}>
            {VALUE_POINTS.map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(30,91,255,0.14)",
                    border: "1px solid rgba(30,91,255,0.3)",
                  }}
                >
                  <FeedIcon name={it.icon} color={colors.blueLite} size={20} />
                </span>
                <div style={{ fontFamily: fontFamily.sans, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: colors.ink }}>{it.t}</div>
              </div>
            ))}
          </div>
        </div>

        <AnimatedFeed items={EXP_FEED} glow={colors.blue} dur={24} />
      </div>

      {/* responsive: stack on small viewports */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 860px) {
          .et-exp-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </section>
  );
}

function AnimatedFeed({ items, glow, dur }: { items: ReadonlyArray<FeedItem>; glow: string; dur: number }) {
  // Duplicate the list so the upward scroll loops seamlessly.
  const list = [...items, ...items];
  return (
    <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          inset: "-6% -2%",
          background: `radial-gradient(52% 48% at 50% 42%, ${glow}26, transparent 72%)`,
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          height: 452,
          borderRadius: 26,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(16,18,24,0.5)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 13%, #000 85%, transparent 100%)",
            maskImage: "linear-gradient(180deg, transparent 0, #000 13%, #000 85%, transparent 100%)",
          }}
        >
          <div className="et-exp-feed-track" style={{ padding: "18px 16px 0", animationDuration: `${dur}s` }}>
            {list.map((it, i) => (
              <FeedCard key={i} item={it} />
            ))}
          </div>
        </div>
      </div>

      {/* The track scrolls up by half its height (one copy of the list), looping. */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes etExpFeedScroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .et-exp-feed-track {
          animation-name: etExpFeedScroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .et-exp-feed-track { animation: none !important; }
        }
      ` }} />
    </div>
  );
}

function StateDot({ state }: { state: NonNullable<FeedItem["state"]> }) {
  const c = state === "done" ? colors.green : state === "current" ? colors.blue : colors.dim;
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: c,
        boxShadow: state === "current" ? `0 0 8px ${colors.blue}` : "none",
        flexShrink: 0,
      }}
    />
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const accent = item.accent || colors.blueLite;
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "13px 15px",
        borderRadius: 16,
        marginBottom: 12,
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(30,91,255,0.16)",
        }}
      >
        <FeedIcon name={item.icon} color={accent} size={16} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 14.5, fontWeight: 700, color: colors.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {item.state && <StateDot state={item.state} />}
            {item.time && <span style={{ fontFamily: fontFamily.mono, fontSize: 11, color: colors.dim }}>{item.time}</span>}
          </span>
        </div>
        {item.sub && (
          <div style={{ fontFamily: fontFamily.sans, fontSize: 13, color: colors.muted, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.sub}</div>
        )}
      </div>
    </div>
  );
}

function FeedIcon({ name, color, size = 16 }: { name: IconName; color: string; size?: number }) {
  const p = { stroke: color, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    trophy: <path d="M7 4h10v4a5 5 0 0 1-10 0V4zM7 5H4.5a4 4 0 0 0 3 4M17 5h2.5a4 4 0 0 1-3 4M12 13v3M8.5 20h7M9.5 16.5h5l.5 3.5h-6l.5-3.5z" {...p} />,
    home: <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" {...p} />,
    coins: (
      <g>
        <ellipse cx="12" cy="7" rx="6.5" ry="2.6" {...p} />
        <path d="M5.5 7v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V7M5.5 12v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-5" {...p} />
      </g>
    ),
    flame: <path d="M12 4C9 8 7.5 10 7.5 13.2a4.5 4.5 0 0 0 9 0C16.5 10 15 8 12 4z" {...p} />,
    moon: (
      <g>
        <circle cx="12" cy="12" r="8" {...p} />
        <circle cx="9.6" cy="9.4" r="1.1" fill={color} stroke="none" />
        <circle cx="14.4" cy="13" r="1.5" fill={color} stroke="none" />
      </g>
    ),
    apartments: <path d="M4 20V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14M12 20v-9h7a1 1 0 0 1 1 1v8M7 9h2M7 13h2M15 14h2" {...p} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {paths[name]}
    </svg>
  );
}
