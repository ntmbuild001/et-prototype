"use client";

// ClientApp.tsx — mounts the prototype client-only (ssr:false), mirroring the
// original ReactDOM.createRoot behavior and sidestepping hydration mismatches
// from new Date() (Home greeting/fact) and React.useId (logo clip ids).

import dynamic from "next/dynamic";

const App = dynamic(() => import("./App"), { ssr: false });

export default function ClientApp() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050505",
        overflow: "hidden",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <App />
    </main>
  );
}
