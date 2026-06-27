"use client";

import React from "react";
import type { Progress } from "../lib/types";
import { DEFAULT_PROGRESS, progressStore } from "./progressStore";

/**
 * Progress hook. Loads from the store after mount (so SSR/first paint use
 * defaults and there's no hydration mismatch), then persists every update.
 */
export function useProgress() {
  const [progress, setProgressState] = React.useState<Progress>(DEFAULT_PROGRESS);

  React.useEffect(() => {
    setProgressState(progressStore.load());
  }, []);

  const setProgress = React.useCallback((next: Progress) => {
    setProgressState(next);
    progressStore.save(next);
  }, []);

  const updateProgress = React.useCallback(
    (fn: (p: Progress) => Progress) => {
      setProgressState((prev) => {
        const next = fn(prev);
        progressStore.save(next);
        return next;
      });
    },
    []
  );

  const reset = React.useCallback(() => {
    progressStore.reset();
    setProgressState({ ...DEFAULT_PROGRESS });
  }, []);

  return { progress, setProgress, updateProgress, reset };
}
