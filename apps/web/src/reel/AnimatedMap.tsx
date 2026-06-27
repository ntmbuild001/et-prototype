"use client";

// AnimatedMap — the real Map journey screen inside a scaled, revealing
// PhoneFrame. `appear` animates the trail + node pop-in on mount. mapDemo omits
// `nav`, so no bottom tab bar renders in the reel.

import React from "react";
import { Map, mapDemo } from "@et/screens";
import { PhoneReel } from "./PhoneReel";

export function AnimatedMap() {
  return (
    <PhoneReel>
      <Map {...mapDemo} appear />
    </PhoneReel>
  );
}
