"use client";

// anim.ts — client animation hooks. Replaces the prototype's global
// MutationObserver + window-scope WAAPI driver with React-scoped effects.
// All guard prefers-reduced-motion and run only on the client.

import React from "react";

function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export type EntranceKind = "fade" | "screenfade" | "pop";

const SPECS: Record<EntranceKind, { kf: Keyframe[]; opts: KeyframeAnimationOptions }> = {
  fade: {
    kf: [
      { opacity: 0, transform: "translateY(10px)" },
      { opacity: 1, transform: "none" },
    ],
    opts: { duration: 350, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
  },
  screenfade: {
    kf: [{ opacity: 0 }, { opacity: 1 }],
    opts: { duration: 280, easing: "ease", fill: "both" },
  },
  pop: {
    kf: [
      { opacity: 0, transform: "scale(.7) rotate(8deg)" },
      { opacity: 1, transform: "rotate(0deg) scale(1)" },
    ],
    opts: { duration: 500, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "both" },
  },
};

/** Run a WAAPI entrance animation on mount. Returns a ref to attach. */
export function useEntrance<T extends HTMLElement = HTMLDivElement>(
  kind: EntranceKind = "fade",
  delay = 0
) {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || !el.animate) return;
    const spec = SPECS[kind];
    let anim: Animation | null = null;
    const t = window.setTimeout(() => {
      try {
        anim = el.animate(spec.kf, spec.opts);
        // Safety: force end state so content never sticks hidden.
        window.setTimeout(() => {
          try {
            anim && anim.finish();
          } catch {}
        }, (spec.opts.duration as number) + 60);
      } catch {}
    }, delay);
    return () => {
      window.clearTimeout(t);
      try {
        anim && anim.cancel();
      } catch {}
    };
  }, [kind, delay]);
  return ref;
}

/**
 * Scroll-reveal timeline. Returns a ref + progress 0..1. Starts a RAF timeline
 * the first time the element is ~20% in view, then holds at 1. Reduced-motion
 * jumps straight to 1.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(durationMs = 1200) {
  const ref = React.useRef<T>(null);
  const [progress, setProgress] = React.useState(0);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      setProgress(1);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            raf = requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      // Re-arm so a StrictMode remount (which cancels the first run mid-flight)
      // can restart the reveal instead of leaving it stuck partway.
      started.current = false;
    };
  }, [durationMs]);

  return { ref, progress };
}
