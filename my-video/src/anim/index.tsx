import { BeforeAfter, BeforeAfterProps } from "./BeforeAfter";
import { Blueprint, BlueprintProps } from "./Blueprint";
import { DayCounter, DayCounterProps } from "./DayCounter";
import { GlobeArcs, GlobeArcsProps } from "./GlobeArcs";
import { InkWash, InkWashProps } from "./InkWash";
import { IsoFlow, IsoFlowProps } from "./IsoFlow";
import { KineticType, KineticTypeProps } from "./KineticType";
import { LaptopReveal, LaptopRevealProps } from "./LaptopReveal";
import { MapRoute, MapRouteProps } from "./MapRoute";
import { Notifications, NotificationsProps } from "./Notifications";
import { Oscilloscope, OscilloscopeProps } from "./Oscilloscope";
import { PaperDesk, PaperDeskProps } from "./PaperDesk";
import { RetroCrt, RetroCrtProps } from "./RetroCrt";
import { Risograph, RisographProps } from "./Risograph";
import { StatChart, StatChartProps } from "./StatChart";
import { SwissGrid, SwissGridProps } from "./SwissGrid";
import { Teardown, TeardownProps } from "./Teardown";

// One reel.json `anim` entry. The `style` field says which component draws it.
export type AnimSpec =
  | StatChartProps
  | PaperDeskProps
  | MapRouteProps
  | TeardownProps
  | InkWashProps
  | KineticTypeProps
  | RetroCrtProps
  | RisographProps
  | SwissGridProps
  | BlueprintProps
  | OscilloscopeProps
  | GlobeArcsProps
  | BeforeAfterProps
  | IsoFlowProps
  | NotificationsProps
  | DayCounterProps
  | LaptopRevealProps;

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
    case "kinetic-type":
      return <KineticType {...p} />;
    case "retro-crt":
      return <RetroCrt {...p} />;
    case "risograph":
      return <Risograph {...p} />;
    case "swiss-grid":
      return <SwissGrid {...p} />;
    case "blueprint":
      return <Blueprint {...p} />;
    case "oscilloscope":
      return <Oscilloscope {...p} />;
    case "globe-arcs":
      return <GlobeArcs {...p} />;
    case "before-after":
      return <BeforeAfter {...p} />;
    case "iso-flow":
      return <IsoFlow {...p} />;
    case "notifications":
      return <Notifications {...p} />;
    case "day-counter":
      return <DayCounter {...p} />;
    case "laptop-reveal":
      return <LaptopReveal {...p} />;
  }
};

const SHOT = "b-roll/screens/example.jpg";

// Sample props for the Studio previews (Root.tsx). Copy one into reel.json to start.
export const ANIM_SAMPLES: AnimSpec[] = [
  { style: "stat-chart", label: "Annual payment volume", prefix: "$", value: 4.1, suffix: "B", points: [1, 1.2, 1.1, 1.6, 2.2, 2.1, 3, 4.1], callout: "Card launches" },
  { style: "paper-desk", kicker: "Study, 2026", headline: "Most viewers decide in the first three seconds", points: [100, 62, 40, 31, 27, 25, 24] },
  { style: "map-route", stops: ["Studio", "Old Town", "Central Station"] },
  { style: "teardown", title: "A phone, opened", parts: ["Glass", "Display", "Battery", "Logic board", "Frame"] },
  { style: "ink-wash", text: "Slow is smooth, smooth is fast", sub: "an old training saying" },
  { style: "kinetic-type", text: "every frame tells a story" },
  { style: "retro-crt", text: "Stay tuned", sub: "SIGNAL ACQUIRED" },
  { style: "risograph", lines: ["Print", "in", "motion"] },
  { style: "swiss-grid", lines: ["Form", "follows", "motion."], tags: ["Grid", "Field", "Type"] },
  { style: "blueprint", title: "Phone, front view", width: "71.5 mm", height: "147.6 mm" },
  { style: "oscilloscope", text: "In sync" },
  {
    style: "globe-arcs",
    label: "Orders shipped",
    from: { name: "Lagos", lat: 6.5, lon: 3.4 },
    to: [
      { name: "London", lat: 51.5, lon: -0.1 },
      { name: "Cairo", lat: 30.0, lon: 31.2 },
      { name: "Nairobi", lat: -1.3, lon: 36.8 },
      { name: "Dubai", lat: 25.2, lon: 55.3 },
      { name: "Cape Town", lat: -33.9, lon: 18.4 },
    ],
  },
  { style: "before-after", before: SHOT, after: SHOT, title: "Same reel. New edit." },
  { style: "iso-flow", title: "How an order reaches you", steps: ["Order", "Pack", "Ship", "Deliver"] },
  {
    style: "notifications",
    app: "Shop",
    items: [
      { title: "New order: ₦48,000", body: "2 items · Lagos" },
      { title: "New order: ₦12,500", body: "1 item · Abuja" },
      { title: "New order: ₦96,000", body: "4 items · Port Harcourt" },
    ],
  },
  { style: "day-counter", day: 30, kicker: "Posting every day", month: "April" },
  { style: "laptop-reveal", src: SHOT, caption: "Your week, planned in minutes." },
];
