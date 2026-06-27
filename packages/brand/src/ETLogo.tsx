"use client";

// ETLogo.tsx — Elite Transition logomarks. Variants: 'trail' | 'wordmark' |
// 'bars' | 'monogram'. 'trail' is the locked production mark.
//
// Optional `video` prop: renders an animated logo (e.g. /et-logo.webm) layered
// over the SVG, which stays as a graceful fallback if the asset is missing or
// fails to load. Used as the landing hero treatment.

import React from "react";

type LogoProps = {
  size?: number;
  color?: string;
  accent?: string;
};

function ETLogoBars({ size = 56, color = "#fff" }: LogoProps) {
  const slope = 0.18;
  const w = 14,
    h = 78,
    top = 6,
    left = 4;
  const topRight = 100,
    eMidRight = 50,
    eBotRight = 82,
    tStemX = 60;
  const my = top + (h - w) / 2 - 2;
  const by = top + h - w;

  const pg = (x: number, y: number, ww: number, hh: number, fill: string, opacity = 1, key?: string) => (
    <polygon
      key={key}
      points={`${x},${y} ${x + ww},${y} ${x + ww - slope * hh},${y + hh} ${x - slope * hh},${y + hh}`}
      fill={fill}
      opacity={opacity}
    />
  );
  const arrowBar = (xLeft: number, xRight: number, y: number, fill: string, op = 1, tipLen = 8, key?: string) => (
    <polygon
      key={key}
      points={`${xLeft},${y} ${xRight},${y} ${xRight + tipLen},${y + w / 2} ${xRight - slope * w},${y + w} ${xLeft - slope * w},${y + w}`}
      fill={fill}
      opacity={op}
    />
  );
  const bars = (ink: string, op = 1, k = "") => [
    arrowBar(left, topRight, top, ink, op, 14, k + "top"),
    pg(left, top, w, h, ink, op, k + "es"),
    arrowBar(left, eMidRight, my, ink, op, 8, k + "em"),
    arrowBar(left, eBotRight, by, ink, op, 10, k + "eb"),
    pg(tStemX, top, w, h, ink, op, k + "ts"),
  ];
  const layers = [
    { dx: -18, op: 0.16 },
    { dx: -12, op: 0.3 },
    { dx: -6, op: 0.55 },
    { dx: 0, op: 1.0 },
  ];
  const aspect = 150 / 96;
  return (
    <svg width={size * aspect} height={size} viewBox="-28 -2 150 96" fill="none" aria-label="Elite Transition">
      {layers.map((l, i) => (
        <g key={i} transform={`translate(${l.dx} 0)`}>
          {bars(color, l.op, `l${i}-`)}
        </g>
      ))}
    </svg>
  );
}

function ETLogoWordmark({ size = 56, color = "#fff" }: LogoProps) {
  const slope = 0.18;
  const w = 14,
    h = 78,
    top = 6,
    left = 4;
  const tStemX = 60,
    topRight = 100,
    eMidRight = 50,
    eBotRight = 82;
  const my = top + (h - w) / 2 - 2;
  const by = top + h - w;
  const pg = (x: number, y: number, ww: number, hh: number, fill: string, opacity = 1, key?: string) => (
    <polygon
      key={key}
      points={`${x},${y} ${x + ww},${y} ${x + ww - slope * hh},${y + hh} ${x - slope * hh},${y + hh}`}
      fill={fill}
      opacity={opacity}
    />
  );
  const bars = (ink: string, op = 1, k = "") => [
    pg(left, top, topRight - left, w, ink, op, k + "top"),
    pg(left, top, w, h, ink, op, k + "es"),
    pg(left, my, eMidRight - left, w, ink, op, k + "em"),
    pg(left, by, eBotRight - left, w, ink, op, k + "eb"),
    pg(tStemX, top, w, h, ink, op, k + "ts"),
  ];
  const layers = [
    { dx: -18, op: 0.16 },
    { dx: -12, op: 0.3 },
    { dx: -6, op: 0.55 },
    { dx: 0, op: 1.0 },
  ];
  const aspect = 150 / 96;
  return (
    <svg width={size * aspect} height={size} viewBox="-28 -2 150 96" fill="none" aria-label="Elite Transition">
      {layers.map((l, i) => (
        <g key={i} transform={`translate(${l.dx} 0)`}>
          {bars(color, l.op, `l${i}-`)}
        </g>
      ))}
    </svg>
  );
}

function ETLogoMonogram({ size = 56, color = "#fff", accent }: LogoProps) {
  const a = accent || color;
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" aria-label="Elite Transition">
      <rect x="1" y="1" width="58" height="58" rx="14" stroke={color} strokeOpacity="0.18" strokeWidth="1" />
      <rect x="14" y="14" width="22" height="6" fill={color} />
      <rect x="14" y="14" width="6" height="32" fill={color} />
      <rect x="14" y="27" width="18" height="6" fill={color} />
      <rect x="14" y="40" width="22" height="6" fill={color} />
      <path d="M40 18 L48 30 L40 42" stroke={a} strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}

function ETLogoTrail({ size = 56, color = "#fff" }: LogoProps) {
  const slope = 0.404; // tan(22°)
  const w = 15,
    h = 78,
    top = 6,
    left = 14;
  const tStemX = 70,
    topRight = 108,
    eMidRight = 42,
    eBotRight = 60;
  const my = top + (h - w) / 2 - 2;
  const by = top + h - w;
  const leftAtBot = left - slope * (by - top);

  const pg = (x: number, y: number, ww: number, hh: number, fill: string, opacity = 1, key?: string) => (
    <polygon
      key={key}
      points={`${x},${y} ${x + ww},${y} ${x + ww - slope * hh},${y + hh} ${x - slope * hh},${y + hh}`}
      fill={fill}
      opacity={opacity}
    />
  );
  const bars = (ink: string, op = 1) => [
    pg(left, top, topRight - left, w, ink, op, "top"),
    pg(left, top, w, h, ink, op, "es"),
    pg(left, my, eMidRight - left, w, ink, op, "em"),
    pg(leftAtBot, by, eBotRight - leftAtBot, w, ink, op, "eb"),
    pg(tStemX, top, w, h, ink, op, "ts"),
  ];

  const ET_BLUE = "#1E5BFF";
  const ET_BLUE_MID = "#7FA8FF";
  const ramp = [
    { cx: -35, w: 4, fill: ET_BLUE },
    { cx: -23, w: 5.5, fill: ET_BLUE_MID },
    { cx: -11, w: 7, fill: color },
  ];
  const stripes = ramp.map((s, i) => (
    <rect key={i} x={s.cx - s.w / 2} y={-40} width={s.w} height={170} fill={s.fill} transform={`rotate(22 ${s.cx} 45)`} />
  ));

  const aspect = 180 / 96;
  const reactId = React.useId();
  const clipId = `et-trail-${reactId.replace(/[:]/g, "")}`;
  return (
    <svg width={size * aspect} height={size} viewBox="-58 -4 180 96" fill="none" aria-label="Elite Transition">
      <defs>
        <clipPath id={clipId}>
          <rect x="-60" y={top} width="240" height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{stripes}</g>
      {bars(color)}
    </svg>
  );
}

export type ETLogoVariant = "trail" | "wordmark" | "bars" | "monogram";

export function ETLogo({
  variant = "trail",
  size = 56,
  color = "#fff",
  accent,
  video,
}: LogoProps & { variant?: ETLogoVariant; video?: string }) {
  const svg =
    variant === "trail" ? (
      <ETLogoTrail size={size} color={color} />
    ) : variant === "wordmark" ? (
      <ETLogoWordmark size={size} color={color} />
    ) : variant === "monogram" ? (
      <ETLogoMonogram size={size} color={color} accent={accent} />
    ) : (
      <ETLogoBars size={size} color={color} />
    );

  const [videoOk, setVideoOk] = React.useState(Boolean(video));
  if (!video) return svg;

  return (
    <span style={{ position: "relative", display: "inline-flex", lineHeight: 0 }}>
      <span style={{ opacity: videoOk ? 0 : 1, transition: "opacity .3s" }}>{svg}</span>
      {videoOk && (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          aria-label="Elite Transition"
          onError={() => setVideoOk(false)}
          style={{ position: "absolute", inset: 0, height: size, width: "auto" }}
        />
      )}
    </span>
  );
}
