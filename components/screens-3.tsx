"use client";

// screens-3.tsx — Home / Dashboard (ported from et-screens-3.jsx).
// Inline styles preserved verbatim. Dead legacy helpers from the original
// (StreakBlock, BentoTile, StatCell, ProgressRing) are omitted — unreferenced.

import React from "react";
import { ScreenShell, FONT, MONO } from "./screens";

export function Home({ ctx, go }: any) {
  const { palette, tweak, state } = ctx;
  const greeting = greetingForHour();
  const firstName = (state.name || 'Marcus').split(' ')[0];
  const style = tweak.homeStyle || 'striped';

  // Fact of the day — short, sharp, brand voice.
  const facts = [
    'The S&P returned 10% last year. A leveraged rental returned 27%.',
    'A 30-year mortgage at 7% costs you 1.4× the home price in interest. Worth knowing before you sign.',
    'Depreciation lets a profitable rental show a paper loss. Legal. Common. Underused.',
    '1031 exchanges defer capital gains indefinitely. Most rookies don’t know they exist.',
  ];
  const fact = facts[new Date().getDate() % facts.length];

  const isStriped = style === 'striped';
  const isGlow = style === 'glow';
  const isGlassV2 = style === 'glass-v2';
  const isGlass = style === 'glass' || isGlassV2;

  const stripeTexture = (color: string, alpha = 0.18) =>
    `repeating-linear-gradient(68deg, ${withAlpha(color, alpha)} 0 6px, transparent 6px 18px)`;

  const streakBg = isStriped
    ? `${stripeTexture(palette.text, 0.10)}, ${palette.surface}`
    : isGlow
      ? `radial-gradient(120% 140% at 20% 0%, ${palette.surface} 0%, #0a0a0a 90%)`
      : isGlass
        ? `radial-gradient(80% 90% at 0% 0%, ${withAlpha(palette.accent2, 0.32)} 0%, transparent 55%), rgba(20, 24, 36, 0.65)`
        : palette.surface;
  const streakShadow = isGlow
    ? `0 18px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`
    : isGlass
      ? `0 30px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`
      : 'none';

  const lessonsBg = isStriped
    ? `${stripeTexture(palette.accentText, 0.10)}, ${palette.accent}`
    : isGlow
      ? `radial-gradient(120% 140% at 80% 0%, ${palette.surface} 0%, #0a0a0a 90%)`
      : isGlass
        ? `radial-gradient(80% 90% at 100% 0%, ${withAlpha(palette.accent, 0.20)} 0%, transparent 55%), rgba(20, 24, 36, 0.65)`
        : palette.surface;
  const lessonsFg = isStriped ? palette.accentText : palette.text;
  const lessonsMutedFg = isStriped ? `${palette.accentText}99` : palette.muted;
  const lessonsShadow = isGlow
    ? `0 18px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`
    : isGlass
      ? `0 30px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`
      : 'none';

  const heroBg = isGlow
    ? `radial-gradient(140% 120% at 0% 0%, #5187FF 0%, ${palette.accent2} 38%, #0E3FB8 100%)`
    : isGlass
      ? `radial-gradient(120% 120% at 0% 0%, ${withAlpha('#7FA8FF', 0.45)} 0%, transparent 50%), ${palette.accent2}`
      : palette.accent2;
  const heroShadow = isGlow
    ? `0 28px 60px rgba(30, 91, 255, 0.45), 0 0 0 1px rgba(255,255,255,0.08) inset`
    : isGlass
      ? `0 30px 60px rgba(30, 91, 255, 0.40), inset 0 1px 0 rgba(255,255,255,0.18)`
      : 'none';

  const factBg = isGlow
    ? `linear-gradient(160deg, ${palette.surface} 0%, #0a0a0a 100%)`
    : isGlass
      ? `radial-gradient(70% 120% at 100% 100%, ${withAlpha(palette.accent, 0.10)} 0%, transparent 60%), rgba(20, 24, 36, 0.65)`
      : palette.surface;
  const factShadow = isGlow
    ? `0 18px 40px rgba(0,0,0,0.5)`
    : isGlass
      ? `0 30px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`
      : 'none';

  const bgBackdrop = isGlass
    ? `radial-gradient(80% 60% at 20% 0%, #0e1626 0%, #000 70%)`
    : null;

  return (
    <ScreenShell palette={palette}>
      {bgBackdrop && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: bgBackdrop,
        }} />
      )}
      <div style={{
        flex: 1, overflow: 'auto', position: 'relative',
        padding: '14px 22px 110px',
      }} className="et-scroll">
        {/* Greeting */}
        <div style={{
          fontFamily: FONT, fontSize: 17, color: palette.muted,
          fontWeight: 500, marginBottom: 6,
        }}>{greeting}</div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
        }}>
          <h1 style={{
            margin: 0, fontFamily: FONT, fontSize: 36, fontWeight: 800,
            letterSpacing: '-0.025em', color: palette.text, lineHeight: 1.04,
          }}>{firstName}.</h1>
          {isGlassV2 && (
            <button onClick={() => go && go('profile')} aria-label="Profile" style={{
              appearance: 'none', cursor: 'pointer', flexShrink: 0,
              width: 44, height: 44, borderRadius: 999, padding: 0,
              background: 'rgba(28,30,42,0.7)',
              border: `1px solid ${palette.line}`,
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: palette.text,
              boxShadow: '0 10px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>
              <TabIcon name="profile" color="currentColor" size={20} />
            </button>
          )}
        </div>

        {/* Streak + lessons bento — equal squares */}
        <div style={{
          marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          <BentoTileV2 palette={palette} label="Streak"
            bg={streakBg} shadow={streakShadow} fg={palette.text} mutedFg={palette.muted}>
            <div style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 6,
            }}>
              <span style={{
                fontFamily: FONT, fontSize: 44, fontWeight: 800,
                letterSpacing: '-0.035em', lineHeight: 1, color: palette.text,
              }}>12</span>
              <span style={{
                fontSize: 15, fontWeight: 700, color: palette.accent,
                letterSpacing: '-0.005em',
              }}>days</span>
            </div>
            <div style={{
              marginTop: 6,
              fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: palette.muted,
            }}>Don&rsquo;t break it</div>
          </BentoTileV2>

          <BentoTileV2 palette={palette} label="Lessons done"
            bg={lessonsBg} shadow={lessonsShadow} fg={lessonsFg} mutedFg={lessonsMutedFg}>
            <div style={{
              fontFamily: FONT, fontSize: 44, fontWeight: 800,
              letterSpacing: '-0.035em', lineHeight: 1, color: lessonsFg,
            }}>12</div>
            <div style={{
              marginTop: 6,
              fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: lessonsMutedFg,
            }}>This year</div>
          </BentoTileV2>
        </div>

        {/* Hero blue card */}
        <div style={{
          marginTop: 10,
          background: heroBg,
          borderRadius: 24, padding: '22px 22px 20px',
          position: 'relative', overflow: 'hidden',
          color: '#ffffff',
          boxShadow: heroShadow,
        }}>
          {/* Striped variant: diagonal stripe overlay (matches Trail-ET) */}
          {isStriped && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: stripeTexture('#ffffff', 0.06),
            }} />
          )}
          {/* Glow variant: bright top-left highlight */}
          {isGlow && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(60% 70% at 10% 10%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
            }} />
          )}

          {/* Glass variant: brighter top-left highlight + sheen */}
          {isGlass && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(60% 70% at 8% 8%, rgba(255,255,255,0.25) 0%, transparent 55%)`,
            }} />
          )}

          <div style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: MONO, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap',
            }}>Today &middot; Lesson 5 / 12</div>
            <div style={{
              fontFamily: MONO, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap',
            }}>~6 min</div>
          </div>

          <h2 style={{
            position: 'relative', margin: 0,
            fontFamily: FONT, fontSize: 30, fontWeight: 800,
            letterSpacing: '-0.025em', lineHeight: 1.04,
            textWrap: 'balance',
          }}>How much house can<br/>you actually afford?</h2>

          <div style={{ position: 'relative', marginTop: 18 }}>
            <div style={{
              height: 6, borderRadius: 999,
              background: 'rgba(255,255,255,0.25)', overflow: 'hidden',
            }}>
              <div style={{ width: '40%', height: '100%', background: '#fff', borderRadius: 999 }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 8,
              fontFamily: MONO, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
            }}>
              <span>First Property Fundamentals</span>
              <span>40%</span>
            </div>
          </div>

          <button onClick={() => go('lesson')} style={{
            position: 'relative',
            appearance: 'none', cursor: 'pointer', width: '100%',
            marginTop: 18, height: 48, borderRadius: 999, border: 0,
            background: '#fff', color: '#000',
            fontFamily: FONT, fontSize: 15, fontWeight: 700,
            letterSpacing: '-0.01em',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: isGlow ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
          }}>
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Fact of the day — long bento rectangle */}
        <div style={{
          marginTop: 10,
          background: factBg,
          border: `1px solid ${palette.line}`,
          borderRadius: 24, padding: '20px 22px',
          position: 'relative', overflow: 'hidden',
          boxShadow: factShadow,
        }}>
          {isStriped && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: stripeTexture(palette.accent, 0.05),
            }} />
          )}
          <div style={{
            position: 'relative',
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: palette.accent, marginBottom: 10,
          }}>Fact of the day</div>
          <p style={{
            position: 'relative', margin: 0,
            fontFamily: FONT, fontSize: 17, fontWeight: 600,
            lineHeight: 1.35, color: palette.text, letterSpacing: '-0.01em',
            textWrap: 'pretty',
          }}>{fact}</p>
        </div>

        {/* Up next — bento module list */}
        <div style={{
          marginTop: 28, marginBottom: 14,
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <h3 style={{
            margin: 0, fontFamily: FONT, fontSize: 22, fontWeight: 700,
            letterSpacing: '-0.02em', color: palette.text,
          }}>Up next</h3>
          <button style={{
            appearance: 'none', background: 'transparent', border: 0, cursor: 'pointer',
            color: palette.muted, fontFamily: MONO, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', padding: 0,
          }}>See all →</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ModuleRow palette={palette} icon="stack"
            title="Tax Shelters & 1031" meta="8 Lessons · Advanced"
            value="Not started" valueSub="" muted shadow={isGlow} />
          <ModuleRow palette={palette} icon="house"
            title="Multifamily Math" meta="6 Lessons · Intermediate"
            value="Day 2" valueSub="/6" shadow={isGlow} />
          <ModuleRow palette={palette} icon="chart"
            title="Cashflow & Cap Rates" meta="10 Lessons · Intermediate"
            value="Locked" valueSub="" muted lock shadow={isGlow} />
        </div>
      </div>

      <TabBar palette={palette} current="dashboard"
        tabs={isGlassV2 ? [
          { id: 'dashboard', label: 'Home',    icon: 'home' },
          { id: 'lessons',   label: 'Lessons', icon: 'lessons' },
          { id: 'agent',     label: 'Agent',   icon: 'agent' },
        ] : undefined}
        onJump={(t: string) => {
          if (t === 'dashboard') return;
        }} />
    </ScreenShell>
  );
}

// Hex-with-alpha helper — accepts hex (#rrggbb / #rgb) and returns rgba(...).
function withAlpha(color: string, alpha = 1) {
  if (!color || color[0] !== '#') return color;
  let h = color.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Bento tile v2 — takes explicit bg/shadow/fg so each variant can override.
function BentoTileV2({ palette, label, bg, shadow, fg, mutedFg, children }: any) {
  return (
    <div style={{
      background: bg || palette.surface,
      border: bg === palette.surface ? `1px solid ${palette.line}` : '0',
      borderRadius: 24, padding: '18px 18px 18px',
      minHeight: 124, display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
      boxShadow: shadow || 'none',
      position: 'relative', overflow: 'hidden',
      color: fg || palette.text,
    }}>
      <div style={{
        fontFamily: FONT, fontSize: 13, color: mutedFg || palette.muted,
        fontWeight: 500, marginBottom: 'auto',
      }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

function greetingForHour() {
  const h = new Date().getHours();
  if (h < 5)  return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function ModuleIcon({ name, color, size = 22 }: any) {
  const c: any = { stroke: color, strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'bank') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M3 9l9-5 9 5" {...c} />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8" {...c} />
      <path d="M3 20h18" {...c} />
    </svg>);
  if (name === 'stack') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 3l9 5-9 5-9-5 9-5z" {...c} />
      <path d="M3 13l9 5 9-5" {...c} />
      <path d="M3 17l9 5 9-5" {...c} />
    </svg>);
  if (name === 'house') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-7h-6v7H5a1 1 0 0 1-1-1v-9z" {...c} />
    </svg>);
  if (name === 'chart') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 17l5-5 4 4 7-9" {...c} />
      <path d="M14 7h6v6" {...c} />
    </svg>);
  return null;
}

function ModuleRow({ palette, icon, title, meta, value, valueSub, muted, lock, shadow }: any) {
  return (
    <button style={{
      appearance: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
      background: palette.surface, border: `1px solid ${palette.line}`,
      borderRadius: 24, padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
      color: palette.text, fontFamily: FONT,
      boxShadow: shadow ? '0 12px 28px rgba(0,0,0,0.4)' : 'none',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: palette.bg, border: `1px solid ${palette.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: palette.text, flexShrink: 0,
      }}>
        {lock ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="1.5" stroke={palette.text} strokeWidth="1.7" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={palette.text} strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        ) : <ModuleIcon name={icon} color={palette.text} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: palette.muted, marginTop: 2 }}>{meta}</div>
      </div>
      <div style={{
        fontFamily: FONT, fontSize: 14, fontWeight: 700,
        color: muted ? palette.muted : palette.text, whiteSpace: 'nowrap',
      }}>
        {value}
        {valueSub && <span style={{ color: palette.muted, fontWeight: 600 }}>{valueSub}</span>}
      </div>
    </button>
  );
}

function TabIcon({ name, color, size = 20 }: any) {
  const c: any = { stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'home') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" {...c} />
    </svg>);
  if (name === 'lessons') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M3 5a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H3V5z" {...c} />
      <path d="M21 5a1 1 0 0 0-1-1h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7V5z" {...c} />
    </svg>);
  if (name === 'portfolio') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" {...c} />
    </svg>);
  if (name === 'profile') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.6" {...c} />
      <path d="M4.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7" {...c} />
    </svg>);
  if (name === 'agent') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 3v2" {...c} />
      <circle cx="12" cy="2.4" r="0.9" fill={color} stroke="none" />
      <rect x="4.5" y="6" width="15" height="12" rx="4" {...c} />
      <circle cx="9" cy="12" r="1.2" fill={color} stroke="none" />
      <circle cx="15" cy="12" r="1.2" fill={color} stroke="none" />
      <path d="M3 11v3M21 11v3" {...c} />
    </svg>);
  return null;
}

function TabBar({ palette, current = 'dashboard', onJump, tabs }: any) {
  tabs = tabs || [
    { id: 'dashboard', label: 'Home',      icon: 'home' },
    { id: 'lessons',   label: 'Lessons',   icon: 'lessons' },
    { id: 'portfolio', label: 'Portfolio', icon: 'portfolio' },
    { id: 'profile',   label: 'Profile',   icon: 'profile' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 14, left: 16, right: 16, zIndex: 5,
    }}>
      <div style={{
        background: 'rgba(28,28,28,0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${palette.line}`,
        borderRadius: 999, padding: 6,
        display: 'flex', alignItems: 'center', gap: 4,
        overflowX: 'auto', scrollbarWidth: 'none',
      }} className="et-scroll">
        {tabs.map((t: any) => {
          const active = t.id === current;
          return (
            <button key={t.id} onClick={() => onJump && onJump(t.id)}
              aria-label={t.label} title={t.label} style={{
              appearance: 'none', cursor: 'pointer', flexShrink: 0, flex: 1,
              padding: '12px 14px', borderRadius: 999, border: 0,
              background: active ? '#fff' : 'transparent',
              color: active ? '#000' : palette.muted,
              fontFamily: FONT,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s ease, color .15s ease',
            }}>
              <TabIcon name={t.icon} color="currentColor" size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
