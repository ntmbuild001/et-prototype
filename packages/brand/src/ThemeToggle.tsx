"use client";

// ThemeToggle.tsx — sun/moon theme switch for the app header.
// Theme is AUTO by default (follows the device's prefers-color-scheme, resolved
// into `document.documentElement.dataset.theme` by the no-FOUC script in the app
// layout). Tapping this sets a manual override (localStorage "et-theme") that
// wins over the system setting. The icon reflects the current effective theme:
// sun = light, moon = dark.

import React from "react";
import { colors } from "./tokens";

function effectiveTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  const o = document.documentElement.dataset.theme;
  if (o === "light" || o === "dark") return o;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    setTheme(effectiveTheme());
    // Keep the icon in sync if the global script flips data-theme on a system change.
    const obs = new MutationObserver(() => setTheme(effectiveTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const next = effectiveTheme() === "light" ? "dark" : "light";
    try {
      localStorage.setItem("et-theme", next);
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.theme = next;
    setTheme(next);
  };

  const isLight = theme === "light";
  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Light mode — tap for dark" : "Dark mode — tap for light"}
      style={{
        appearance: "none",
        cursor: "pointer",
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: colors.surface,
        border: `1px solid ${colors.line}`,
        color: colors.blue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {isLight ? (
        // sun
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // moon
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20.5 13.4A8 8 0 1 1 10.6 3.5a6.4 6.4 0 0 0 9.9 9.9z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
