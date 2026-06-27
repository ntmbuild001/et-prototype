// Footer.tsx — dark landing footer.
// Ported from `Footer` in et-landing-2.jsx.
//
// Prototype-isms removed:
//  - Inlined the global Wrap helper as a fluid 1100px responsive grid.
//  - The prototype's <ETWordmark/> global is replaced by the brand
//    <ETLogo variant="wordmark"/>.
//  - The prototype set link hover colors via onMouseEnter/onMouseLeave JS
//    handlers (which would force a client component); here hover is done in CSS
//    via a scoped <style> block, so the footer stays a server component.

import React from "react";
import { colors, fontFamily, ETLogo } from "@et/brand";

const COLUMNS: ReadonlyArray<{ heading: string; items: string[] }> = [
  { heading: "Product", items: ["How it works", "Features", "The game", "Pegasus"] },
  { heading: "Company", items: ["About", "Careers", "Press", "Contact"] },
  { heading: "Legal", items: ["Privacy", "Terms", "Security"] },
];

export function Footer() {
  return (
    <footer style={{ background: colors.bg3, padding: "64px 0 40px" }}>
      <div
        className="et-footer-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 28px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 32,
        }}
      >
        <div>
          <ETLogo variant="wordmark" size={22} />
          <p style={{ fontFamily: fontFamily.sans, fontSize: 14.5, lineHeight: 1.55, color: colors.muted, margin: "18px 0 0", maxWidth: 280 }}>
            The wealth game built for pro athletes. Learn, simulate, own. Before the contract ends.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <div style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: colors.dim, marginBottom: 16 }}>
              {col.heading.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {col.items.map((it) => (
                <a key={it} href="#" className="et-footer-link" style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.muted, textDecoration: "none", transition: "color .15s" }}>
                  {it}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="et-footer-base"
        style={{
          maxWidth: 1100,
          margin: "48px auto 0",
          padding: "24px 28px 0",
          borderTop: `1px solid ${colors.line}`,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontFamily: fontFamily.sans, fontSize: 13.5, color: colors.dim }}>© 2026 Elite Transition. All rights reserved.</span>
        <span style={{ fontFamily: fontFamily.mono, fontSize: 12, letterSpacing: "0.1em", color: colors.dim }}>EARN MORE THAN YOU OWNED.</span>
      </div>

      {/* hover (CSS-only so the footer stays a server component) + responsive */}
      <style dangerouslySetInnerHTML={{ __html: `
        .et-footer-link:hover { color: ${colors.ink}; }
        @media (max-width: 720px) {
          .et-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      ` }} />
    </footer>
  );
}
