import { InkWash, InkWashProps } from "./InkWash";
import { MapRoute, MapRouteProps } from "./MapRoute";
import { PaperDesk, PaperDeskProps } from "./PaperDesk";
import { StatChart, StatChartProps } from "./StatChart";
import { Teardown, TeardownProps } from "./Teardown";

// One reel.json `anim` entry. The `style` field says which component draws it.
export type AnimSpec = StatChartProps | PaperDeskProps | MapRouteProps | TeardownProps | InkWashProps;

export const Anim: React.FC<AnimSpec> = (p) => {
  switch (p.style) {
    case "stat-chart":
      return <StatChart {...p} />;
    case "paper-desk":
      return <PaperDesk {...p} />;
    case "map-route":
      return <MapRoute {...p} />;
    case "teardown":
      return <Teardown {...p} />;
    case "ink-wash":
      return <InkWash {...p} />;
  }
};

// Sample props for the Studio previews (Root.tsx). Copy one into reel.json to start.
export const ANIM_SAMPLES: AnimSpec[] = [
  { style: "stat-chart", label: "Annual payment volume", prefix: "$", value: 4.1, suffix: "B", points: [1, 1.2, 1.1, 1.6, 2.2, 2.1, 3, 4.1], callout: "Card launches" },
  { style: "paper-desk", kicker: "Study, 2026", headline: "Most viewers decide in the first three seconds", points: [100, 62, 40, 31, 27, 25, 24] },
  { style: "map-route", stops: ["Studio", "Old Town", "Central Station"] },
  { style: "teardown", title: "A phone, opened", parts: ["Glass", "Display", "Battery", "Logic board", "Frame"] },
  { style: "ink-wash", text: "Slow is smooth, smooth is fast", sub: "an old training saying" },
];
