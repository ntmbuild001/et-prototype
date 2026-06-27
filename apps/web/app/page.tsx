import { PasswordGate } from "@et/brand";
import { Backdrop } from "@/sections/Backdrop";
import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Players } from "@/sections/Players";
import { Spotlight } from "@/sections/Spotlight";
import { ExperienceBand } from "@/sections/ExperienceBand";
import { Features } from "@/sections/Features";
import { PegasusSection } from "@/sections/PegasusSection";
import { FinalCTA } from "@/sections/FinalCTA";
import { Footer } from "@/sections/Footer";

export default function Page() {
  return (
    <PasswordGate>
      <Backdrop />
      <Nav />
      <main>
        <Hero />
        <Players />
        <Spotlight />
        <ExperienceBand />
        <Features />
        <PegasusSection />
        <FinalCTA />
      </main>
      <Footer />
    </PasswordGate>
  );
}
