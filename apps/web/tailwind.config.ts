import type { Config } from "tailwindcss";
// Loaded by Tailwind/jiti (not part of the app's tsc program), so require() is
// the most robust way to pull the CommonJS preset across the workspace.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const etPreset = require("@et/brand/tailwind-preset");

export default {
  presets: [etPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/brand/src/**/*.{ts,tsx}",
    "../../packages/screens/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
