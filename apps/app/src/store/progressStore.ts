// progressStore.ts — persistence behind an interface so a real backend can
// drop in later without touching the UI. v1 uses localStorage (key
// et2-progress-v1), matching the prototype's contract.
import type { Progress } from "../lib/types";

export const STORE_KEY = "et2-progress-v1";

export const DEFAULT_PROGRESS: Progress = {
  completed: ["spot", "buybox", "underwrite"],
  xp: 1240,
  streak: 6,
  simGrades: {},
  onboarded: false,
};

export interface ProgressStore {
  load(): Progress;
  save(p: Progress): void;
  reset(): void;
}

export class LocalStorageProgressStore implements ProgressStore {
  load(): Progress {
    if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
    } catch {}
    return { ...DEFAULT_PROGRESS };
  }
  save(p: Progress): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(p));
    } catch {}
  }
  reset(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORE_KEY);
    } catch {}
  }
}

export const progressStore: ProgressStore = new LocalStorageProgressStore();
