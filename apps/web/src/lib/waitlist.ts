// waitlist.ts — client for the "join the waitlist" capture on the landing page.
//
// The prototype (et-landing-1.jsx) faked the waitlist entirely client-side:
// a canned base position (~#2,417), a small random offset, and persistence to
// localStorage under 'et-waitlist'. This module preserves that behaviour behind
// a small interface so the UI can swap in a real backend later without changing
// any component code.

export interface WaitlistEntry {
  email: string;
  position: number;
  at: number;
}

export interface WaitlistClient {
  /** Join the waitlist and return the assigned position. */
  join(email: string): Promise<{ position: number }>;
  /** Read a previously persisted entry (if any). Synchronous, browser-only. */
  current(): WaitlistEntry | null;
}

const STORAGE_KEY = "et-waitlist";

/** Canned base position carried over from the prototype (`WAITLIST_BASE`). */
const WAITLIST_BASE = 2417;

/**
 * Stub waitlist client. No network — returns a position near #2,417 and
 * persists the entry to localStorage so a returning visitor keeps their spot.
 *
 * TODO: wire to real backend — replace `join()` with a POST to the waitlist
 * API and return the server-assigned position. Keep the localStorage cache as
 * an optimistic UI hint, or drop it once the backend is the source of truth.
 */
export class StubWaitlistClient implements WaitlistClient {
  private safeRead(): WaitlistEntry | null {
    // Guard: localStorage only exists in the browser. Never touch it at module
    // scope — only inside methods invoked from client components / handlers.
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<WaitlistEntry>;
      if (parsed && typeof parsed.email === "string" && typeof parsed.position === "number") {
        return { email: parsed.email, position: parsed.position, at: parsed.at ?? Date.now() };
      }
    } catch {
      // ignore malformed / unavailable storage
    }
    return null;
  }

  current(): WaitlistEntry | null {
    return this.safeRead();
  }

  async join(email: string): Promise<{ position: number }> {
    // Re-use an existing spot if this browser already joined.
    const existing = this.safeRead();
    if (existing) return { position: existing.position };

    // Canned: base minus a small random offset, exactly like the prototype.
    const position = WAITLIST_BASE - Math.floor(Math.random() * 40);
    const entry: WaitlistEntry = { email, position, at: Date.now() };

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
      } catch {
        // non-fatal: still return the position so the UI advances
      }
    }
    return { position };
  }
}

/** Shared default instance used by the landing UI. */
export const waitlist: WaitlistClient = new StubWaitlistClient();
