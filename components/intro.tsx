"use client";

// intro.tsx — Three onboarding intro screens shown before signup
// (ported from et-intro.jsx). Inline styles preserved verbatim.

import React from "react";
import { ETLogo } from "./ETLogo";
import { PrimaryBtn } from "./screens";

const INTRO_FONT_SERIF = "'Instrument Serif', 'Times New Roman', serif";
const INTRO_FONT_SANS = "'Inter Tight', -apple-system, system-ui, sans-serif";
const INTRO_FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

// Slide content. Each line is an array of segments; serif:true renders that
// segment in Instrument Serif italic.
const INTRO_SLIDES: any[] = [
  {
    // SCREEN 1 — The promise. Logo replaces eyebrow on this slide.
    showLogo: true,
    headline: [
      [{ t: 'Own more than' }],
      [{ t: 'you ' }, { t: 'earned', serif: true, accent: 'accent' }, { t: '.' }],
    ],
    body: [
      { t: 'A wealth education made for ' },
      { t: 'pro athletes', serif: true, accent: 'accent' },
      { t: '. ' },
      { t: <React.Fragment><br/>Real estate is the asset. Ownership is the outcome.</React.Fragment> },
    ],
    blob: 'accent',
    blobPos: 'br',
    cta: 'BEGIN',
  },
  {
    // SCREEN 2 — The stakes.
    eyebrow: 'The Numbers',
    headline: [
      [{ t: 'Your contract has' }],
      [{ t: 'an ' }, { t: 'end date', serif: true, accent: 'accent2' }, { t: '.' }],
    ],
    body: [
      { t: 'Your portfolio doesn’t have to. ' },
      { t: '68% of former NFL players', serif: true, accent: 'accent2' },
      { t: ' file for bankruptcy within two years of retirement. The portfolio is the difference.' },
    ],
    blob: 'accent2',
    blobPos: 'bl',
    cta: 'NEXT',
  },
  {
    // SCREEN 3 — The product.
    eyebrow: 'Lessons',
    headline: [
      [{ t: 'Real estate,' }],
      [{ t: 'made ' }, { t: 'plain', serif: true, accent: 'accent' }, { t: '.' }],
    ],
    body: [
      { t: 'One lesson a day. Short, sharp, built for the time you actually have. No jargon. No fluff. Just what you need to ' },
      { t: 'own', serif: true, accent: 'accent' },
      { t: ' — first property, fifth, tenth. A private space, for pro athletes only.' },
    ],
    blob: 'accent',
    blobPos: 'tr',
    cta: 'NEXT',
  },
];

function IntroBlob({ color, pos }: any) {
  const sizes: any = {
    br: { right: -180, bottom: -160 },
    bl: { left: -200, bottom: -120 },
    tr: { right: -200, top: -120 },
    tl: { left: -200, top: -120 },
  };
  const pos2 = sizes[pos] || sizes.br;
  return (
    <div style={{
      position: 'absolute',
      width: 540, height: 540, borderRadius: '50%',
      background: `radial-gradient(circle at 50% 50%, ${color}66 0%, ${color}22 38%, transparent 70%)`,
      pointerEvents: 'none', filter: 'blur(8px)',
      ...pos2,
    }} />
  );
}

function IntroHeadline({ lines, palette }: any) {
  const copyKey = palette.copyAccent;
  return (
    <h1 style={{
      margin: 0, fontFamily: INTRO_FONT_SANS,
      fontSize: 40, fontWeight: 700,
      lineHeight: 1.08, letterSpacing: '-0.025em',
      color: palette.text,
    }}>
      {lines.map((line: any, li: number) => (
        <div key={li} style={{ display: 'block' }}>
          {line.map((seg: any, si: number) => (
            <span key={si} style={seg.serif ? {
              fontFamily: INTRO_FONT_SERIF, fontStyle: 'italic',
              fontWeight: 400, color: palette[copyKey || seg.accent || 'accent'],
              letterSpacing: '-0.01em',
              fontSize: '1.08em', // serif optical sizing
            } : undefined}>{seg.t}</span>
          ))}
        </div>
      ))}
    </h1>
  );
}

function IntroBody({ segs, palette }: any) {
  const copyKey = palette.copyAccent;
  return (
    <p style={{
      margin: 0, fontFamily: INTRO_FONT_SANS,
      fontSize: 15, lineHeight: 1.55, color: palette.muted, fontWeight: 400,
      maxWidth: 340,
    }}>
      {segs.map((s: any, i: number) => (
        <span key={i} style={s.serif ? {
          fontFamily: INTRO_FONT_SERIF, fontStyle: 'italic',
          color: palette[copyKey || s.accent || 'accent'], fontSize: '1.1em',
          letterSpacing: '0.005em',
        } : undefined}>{s.t}</span>
      ))}
    </p>
  );
}

function IntroDots({ count, current, palette }: any) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 6, height: 6, borderRadius: 3,
          background: i === current ? palette.accent : palette.line,
          transition: 'width .25s ease, background .25s ease',
        }} />
      ))}
    </div>
  );
}

export function Intro({ ctx, go }: any) {
  const { palette, tweak } = ctx;
  const [step, setStep] = React.useState(0);
  const slide = INTRO_SLIDES[step];
  const last = step === INTRO_SLIDES.length - 1;

  const next = () => {
    if (last) go('welcome');
    else setStep(step + 1);
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: palette.bg, color: palette.text,
      overflow: 'hidden', fontFamily: INTRO_FONT_SANS,
    }}>
      {/* Decorative blob */}
      <IntroBlob color={palette[slide.blob]} pos={slide.blobPos} />

      {/* Content stack */}
      <div style={{
        position: 'relative', zIndex: 1, height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: '18px 24px 22px',
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 44 }}>
          {step > 0 ? (
            <button onClick={back} aria-label="Back" style={{
              appearance: 'none', cursor: 'pointer', border: `1px solid ${palette.line}`,
              width: 40, height: 40, borderRadius: '50%',
              background: 'transparent', color: palette.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : <div style={{ width: 40 }} />}

          <div style={{ flex: 1 }} />
        </div>

        {/* Spacer pushes content to lower-middle */}
        <div style={{ height: 60 }} />

        {/* Eyebrow OR logo (slide 1 gets the wordmark) */}
        {slide.showLogo ? (
          <div style={{ marginBottom: 18 }}>
            <ETLogo variant={tweak.logoVariant} size={32} color={palette.text} accent={palette.accent} />
          </div>
        ) : (
          <div style={{
            fontFamily: INTRO_FONT_MONO, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: palette[palette.copyAccent || slide.blob], marginBottom: 16,
          }}>{slide.eyebrow}</div>
        )}

        {/* Headline */}
        <IntroHeadline lines={slide.headline} palette={palette} />

        {/* Body */}
        <div style={{ marginTop: 22 }}>
          <IntroBody segs={slide.body} palette={palette} />
        </div>

        <div style={{ flex: 1 }} />

        {/* CTA + dots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PrimaryBtn palette={palette} color="lime" onClick={next}>
            {slide.cta}
          </PrimaryBtn>
          <IntroDots count={INTRO_SLIDES.length} current={step} palette={palette} />
        </div>
      </div>
    </div>
  );
}
