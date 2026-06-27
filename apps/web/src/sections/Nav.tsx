"use client";

// Nav.tsx — fixed top navigation for the ET landing page.
// Ported from et-landing-1.jsx (`Nav` + `ETWordmark`). Uses the brand ETLogo
// ('trail' mark) plus an "Elite Transition" wordmark span, anchor nav links, and
// a "Join the waitlist" PillButton. The bar gains a blurred translucent
// background once the page is scrolled past the hero edge.

import React from "react";
import { colors, fontFamily, ETLogo, PillButton } from "@et/brand";

// Reference labels (et-landing-1.jsx:119) point at functional section ids:
// "Moguls" → the Players/locker-room band, "How it works" → the path section.
const LINKS: ReadonlyArray<readonly [label: string, id: string]> = [
  ["Moguls", "players"],
  ["Experience", "experience"],
  ["How it works", "path"],
];

export function Nav() {
  const [solid, setSolid] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const sc = document.scrollingElement || document.documentElement;
      setSolid((sc.scrollTop || window.scrollY) > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: solid ? "rgba(5,6,8,0.55)" : "transparent",
        backdropFilter: solid ? "blur(16px)" : "none",
        WebkitBackdropFilter: solid ? "blur(16px)" : "none",
        transition: "background .25s",
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        {/* brand lockup: ET mark + wordmark */}
        <a
          href="#top"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
          aria-label="Elite Transition — home"
        >
          <ETLogo variant="trail" size={28} />
          <span
            className="et-nav-wordmark"
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "-0.03em",
              color: colors.ink,
              whiteSpace: "nowrap",
            }}
          >
            Elite Transition
          </span>
        </a>

        {/* links — hidden on narrow screens to avoid crowding the bar */}
        <div className="et-nav-links" style={{ display: "flex", alignItems: "center", gap: 34 }}>
          {LINKS.map(([label, id]) => (
            <NavLink key={id} href={`#${id}`} label={label} />
          ))}
        </div>

        <PillButton href="#waitlist">Join the waitlist</PillButton>
      </nav>

      {/* responsive: collapse the centre links, then drop the wordmark text so the
          mark + waitlist pill never crowd on very small screens */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 760px) {
          .et-nav-links { display: none !important; }
        }
        @media (max-width: 440px) {
          .et-nav-wordmark { display: none !important; }
        }
      ` }} />
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        fontFamily: fontFamily.sans,
        fontSize: 15,
        fontWeight: 500,
        color: colors.muted,
        textDecoration: "none",
        transition: "color .15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = colors.ink)}
      onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
    >
      {label}
    </a>
  );
}
