import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, SANS, W, drawOn, grow, linePath } from "./util";

export type StatChartProps = {
  style: "stat-chart";
  value: number; // the big number, e.g. 4.1
  prefix?: string; // "$"
  suffix?: string; // "B"
  label: string; // small heading above the number
  points: number[]; // the line chart, oldest first
  callout?: string; // note pinned to the last point
};

// YOUR PIECE (docs/missions.md, mission 5).
// Spec: return the number to show at `frame`. It starts at 0 on frame 0, reaches `value` on frame 30
// and stays there. Ease it out so it slows down near the end (hint: `grow` in ./util does the hard part).
// Right now it just shows the final value, so the style works but doesn't count.
export const countUp = (frame: number, value: number) => {
  void frame;
  return value;
};

const ORANGE = "#ff7a1a";

export const StatChart: React.FC<StatChartProps> = ({ value, prefix = "", suffix = "", label, points, callout }) => {
  const frame = useCurrentFrame();
  const cw = W - 120;
  const ch = 240;
  const { d, last } = linePath(points, cw, ch);
  const chartTop = H - 50 - ch;
  const dot = grow(frame, 36, 8);
  const shown = countUp(frame, value).toFixed(Number.isInteger(value) ? 0 : 1);

  return (
    <AbsoluteFill style={{ background: "#0b0d10", color: "white", fontFamily: SANS, padding: "50px 60px" }}>
      <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#8a929c" }}>{label}</div>
      <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -5, lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>
        {prefix}
        {shown}
        {suffix}
      </div>

      <svg width={cw} height={ch} style={{ position: "absolute", left: 60, top: chartTop, overflow: "visible" }}>
        {[0, 0.5, 1].map((f) => (
          <line key={f} x1={0} x2={cw} y1={f * ch} y2={f * ch} stroke="#1f242b" strokeWidth={2} />
        ))}
        <path d={d} fill="none" stroke={ORANGE} strokeWidth={6} strokeLinejoin="round" {...drawOn(grow(frame, 8, 30))} />
        <circle cx={last[0]} cy={last[1]} r={12 * dot} fill={ORANGE} />
      </svg>

      {callout && (
        <div
          style={{
            position: "absolute",
            right: 60 + 34,
            top: chartTop + last[1] - 30,
            opacity: dot,
            translate: `${(1 - dot) * 20}px 0`,
            background: "#161a20",
            border: `2px solid ${ORANGE}`,
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          {callout}
        </div>
      )}
    </AbsoluteFill>
  );
};
