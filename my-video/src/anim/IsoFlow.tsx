import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SANS, W, along, drawOn, grow, iso } from "./util";

export type IsoFlowProps = {
  style: "iso-flow";
  title: string;
  steps: string[]; // 2-5 stages, in order
};

const S = 440; // platform size on the floor
const CX = W / 2;
const CY = 190; // where the platform's back corner sits on screen
const ROAD = [[60, 400], [60, 230], [230, 230], [230, 60], [400, 60]]; // a zig-zag over the platform
const COLORS = ["#2f7cf6", "#ff8a3d", "#22b07d", "#e0457b", "#8a5cf6"];
const P = (x: number, y: number, z = 0) => iso(x, y, z, CX, CY).join(",");

// A box standing on the floor at (x, y): three visible faces, each a little darker than the last.
const Cube: React.FC<{ x: number; y: number; s: number; h: number; color: string; scale: number }> = ({ x, y, s, h, color, scale }) => {
  const [bx, by] = iso(x, y, 0, CX, CY);
  return (
    <g style={{ transformOrigin: `${bx}px ${by}px`, transform: `scale(${scale})` }}>
      <polygon points={`${P(x - s, y + s)} ${P(x + s, y + s)} ${P(x + s, y + s, h)} ${P(x - s, y + s, h)}`} fill={color} filter="brightness(0.8)" />
      <polygon points={`${P(x + s, y - s)} ${P(x + s, y + s)} ${P(x + s, y + s, h)} ${P(x + s, y - s, h)}`} fill={color} filter="brightness(0.65)" />
      <polygon points={`${P(x - s, y - s, h)} ${P(x + s, y - s, h)} ${P(x + s, y + s, h)} ${P(x - s, y + s, h)}`} fill={color} />
    </g>
  );
};

export const IsoFlow: React.FC<IsoFlowProps> = ({ title, steps }) => {
  const frame = useCurrentFrame();
  const road = grow(frame, 6, 40);
  const d = ROAD.map(([x, y], i) => `${i ? "L" : "M"}${P(x, y)}`).join(" ");
  const stops = steps.map((name, k) => {
    const t = k / Math.max(1, steps.length - 1);
    const [x, y] = along(ROAD, t);
    return { name, k, x, y, show: Math.min(1, Math.max(0, (road - t + 0.125) * 8)) }; // full size by the time the road arrives
  });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#f4f6f9, #e3e8ef)", fontFamily: SANS }}>
      <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center", fontSize: 40, fontWeight: 800, color: "#1b2330" }}>{title}</div>
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        {/* The platform: top face plus two side faces for thickness. */}
        <polygon points={`${P(0, S)} ${P(S, S)} ${P(S, S, -26)} ${P(0, S, -26)}`} fill="#c9d2de" />
        <polygon points={`${P(S, 0)} ${P(S, S)} ${P(S, S, -26)} ${P(S, 0, -26)}`} fill="#b3bdcb" />
        <polygon points={`${P(0, 0)} ${P(S, 0)} ${P(S, S)} ${P(0, S)}`} fill="#ffffff" />
        <path d={d} fill="none" stroke="#2c3440" strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" {...drawOn(road)} />
        <path d={d} fill="none" stroke="white" strokeWidth={2} strokeDasharray="10 12" opacity={road > 0.99 ? 1 : 0} />
        {[[330, 330], [130, 120], [360, 200], [150, 340]].map(([x, y]) => (
          <g key={`${x}${y}`}>
            <line x1={iso(x, y, 0, CX, CY)[0]} y1={iso(x, y, 0, CX, CY)[1]} x2={iso(x, y, 0, CX, CY)[0]} y2={iso(x, y, 26, CX, CY)[1]} stroke="#7a6248" strokeWidth={4} />
            <circle cx={iso(x, y, 0, CX, CY)[0]} cy={iso(x, y, 36, CX, CY)[1]} r={16} fill="#5cbf7a" />
          </g>
        ))}
        {stops.map((s) => (
          <Cube key={s.name} x={s.x + 34} y={s.y + 34} s={22} h={44} color={COLORS[s.k % COLORS.length]} scale={s.show} />
        ))}
      </svg>
      {stops.map((s) => {
        const [x, y] = iso(s.x + 34, s.y + 34, 70, CX, CY);
        return (
          <div key={s.name} style={{ position: "absolute", left: x, top: y, translate: "-50% -100%", scale: String(s.show), transformOrigin: "50% 100%", display: "flex", alignItems: "center", gap: 10, background: "white", padding: "8px 16px 8px 8px", borderRadius: 999, boxShadow: "0 8px 20px rgba(20,30,50,0.18)", whiteSpace: "nowrap" }}>
            <span style={{ width: 32, height: 32, borderRadius: 16, background: COLORS[s.k % COLORS.length], color: "white", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18 }}>{s.k + 1}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#1b2330" }}>{s.name}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
