// @et/screens — app screen components shared between the product app and the
// marketing-site reel. All screens are prop-driven and side-effect-free at
// module scope so the landing can render them statically without the app store.
// Each screen imports only from `@et/brand` and `react`.

export { TabBar } from "./TabBar";
export type { TabId } from "./TabBar";

export { PegasusMoon, usePegasusMoonStyles } from "./PegasusMoon";

export { Home, homeDemo, PortfolioHero } from "./Home";
export type { HomeProps, HomeDeal, HomePortfolio, LeagueItem } from "./Home";

export { Map, mapDemo } from "./Map";
export type { MapProps, MapNode } from "./Map";

export { Pegasus, pegasusDemo } from "./Pegasus";
export type { PegasusProps, PegasusMessage } from "./Pegasus";

export { Portfolio, portfolioDemo } from "./Portfolio";
export type { PortfolioProps, PortfolioHolding } from "./Portfolio";
