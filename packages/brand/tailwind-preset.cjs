/* tailwind-preset.cjs — shared Tailwind theme for both apps. CommonJS so it
   resolves cleanly from any tailwind.config.ts. Colors map to the CSS vars
   defined in src/styles.css; fonts map to the next/font variables. */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: "var(--et-bg)",
        "bg-2": "var(--et-bg-2)",
        "bg-3": "var(--et-bg-3)",
        surface: "var(--et-surface)",
        "surface-2": "var(--et-surface-2)",
        line: "var(--et-line)",
        "line-2": "var(--et-line-2)",
        ink: "var(--et-ink)",
        muted: "var(--et-muted)",
        dim: "var(--et-dim)",
        blue: "var(--et-blue)",
        "blue-lite": "var(--et-blue-lite)",
        "blue-deep": "var(--et-blue-deep)",
        green: "var(--et-green)",
        error: "var(--et-error)",
      },
      fontFamily: {
        sans: ["var(--font-inter-tight)", "-apple-system", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      letterSpacing: {
        mono: "0.2em",
        tightest: "-0.03em",
      },
    },
  },
};
