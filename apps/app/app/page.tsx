"use client";

// The app is a fully client-side, localStorage-driven state machine, so we load
// AppRoot with SSR disabled to avoid hydration mismatches (matches the
// prototype's dynamic(ssr:false) pattern).
import dynamic from "next/dynamic";
import { PasswordGate } from "@et/brand";

const AppRoot = dynamic(() => import("@/AppRoot").then((m) => m.AppRoot), {
  ssr: false,
  loading: () => <div style={{ minHeight: "100dvh", background: "var(--et-bg)" }} />,
});

export default function Page() {
  return (
    <PasswordGate>
      <AppRoot />
    </PasswordGate>
  );
}
