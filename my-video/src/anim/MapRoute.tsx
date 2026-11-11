import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { H, SANS, W, drawOn, grow } from "./util";

export type MapRouteProps = {
  style: "map-route";
  stops: string[]; // 2-4 place names, first to last
};

// A made-up city, not a real map: a flat SVG street grid tilted in 3D with CSS.
const S = 1400; // map size before tilting
const TILT = 55; // degrees the map leans back
const STREETS = [-60, 240, 540, 840, 1140, 1440]; // street centre lines, both directions
const ROUTE = [[240, 1240], [240, 940], [540, 940], [540, 640], [840, 640], [840, 340], [1140, 340], [1140, 140]];
const BLUE = "#2f6bff";

// Where along the route (0-1) each corner sits, so a stop's pin can appear as the line reaches it.
const legs = ROUTE.slice(1).map(([x, y], i) => Math.hypot(x - ROUTE[i][0], y - ROUTE[i][1]));
const total = legs.reduce((a, b) => a + b, 0);
const at = ROUTE.map((_, i) => legs.slice(0, i).reduce((a, b) => a + b, 0) / total);

export const MapRoute: React.FC<MapRouteProps> = ({ stops }) => {
  const frame = useCurrentFrame();
  const line = grow(frame, 10, 45);
  const spin = interpolate(frame, [0, 120], [-34, -22], { extrapolateRight: "clamp" }); // slow camera turn
  const d = ROUTE.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");

  // Spread the stops over the route's corners: first, last, and evenly in between.
  const pins = stops.map((name, k): { name: string; x: number; y: number; show: number } => {
    const i = Math.round((k * (ROUTE.length - 1)) / Math.max(1, stops.length - 1));
    // Pop in over the last 10% of the line before it reaches the stop (so the final stop still appears at 100%).
    return { name, x: ROUTE[i][0], y: ROUTE[i][1], show: Math.min(1, Math.max(0, (line - at[i] + 0.1) * 10)) };
  });

  const lots: React.ReactNode[] = [];
  STREETS.slice(0, -1).forEach((x0, i) =>
    STREETS.slice(0, -1).forEach((y0, j) => {
      [0, 1].forEach((a) =>
        [0, 1].forEach((b) => {
          const park = (i * 7 + j * 3 + a + b * 2) % 11 === 0;
          lots.push(
            <rect key={`${i}-${j}-${a}-${b}`} x={x0 + 32 + a * 121} y={y0 + 32 + b * 121} width={115} height={115} rx={8}
              fill={park ? "#cfe8c4" : "#ffffff"} stroke="#d5dae1" strokeWidth={3} />,
          );
        }),
      );
    }),
  );

  return (
    <AbsoluteFill style={{ background: "#dfe3e9", perspective: 1400, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: (W - S) / 2,
          top: (H - S) / 2 + 30,
          width: S,
          height: S,
          transformStyle: "preserve-3d",
          transform: `rotateX(${TILT}deg) rotateZ(${spin}deg) scale(0.55)`,
        }}
      >
        <svg width={S} height={S} style={{ position: "absolute" }}>
          <rect width={S} height={S} fill="#e9ecf1" />
          {lots}
          <path d={d} fill="none" stroke="white" strokeWidth={40} strokeLinejoin="round" strokeLinecap="round" {...drawOn(line)} />
          <path d={d} fill="none" stroke={BLUE} strokeWidth={24} strokeLinejoin="round" strokeLinecap="round" {...drawOn(line)} />
        </svg>
        {pins.map((p) => (
          // Undo the map's rotation (in reverse order) so the label stands up facing the camera.
          <div key={p.name} style={{ position: "absolute", left: p.x, top: p.y, transformStyle: "preserve-3d", transform: `rotateZ(${-spin}deg) rotateX(${-TILT}deg)` }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, translate: "-50% 0", scale: String(p.show), transformOrigin: "50% 100%", textAlign: "center" }}>
              <div style={{ background: "white", color: "#111", font: `700 40px ${SANS}`, padding: "10px 22px", borderRadius: 16, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                {p.name}
              </div>
              <div style={{ width: 26, height: 26, margin: "10px auto 0", borderRadius: 13, background: BLUE, border: "6px solid white" }} />
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
