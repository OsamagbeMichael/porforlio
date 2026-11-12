import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { SANS, drawOn, grow } from "./util";

export type BlueprintProps = {
  style: "blueprint";
  title: string;
  width: string; // dimension labels, e.g. "71.5 mm"
  height: string;
};

const MONO = "Menlo, monospace";
// The object: a phone-shaped device, centred left of middle. Box = x, y, w, h.
const D = { x: 290, y: 110, w: 230, h: 450 };

export const Blueprint: React.FC<BlueprintProps> = ({ title, width, height }) => {
  const frame = useCurrentFrame();
  const sketch = grow(frame, 0, 28); // pencil lines draw on...
  const blue = grow(frame, 30, 12); // ...then the paper turns into a blueprint
  const ink = interpolateColors(blue, [0, 1], ["#55524c", "#ffffff"]);
  const dims = grow(frame, 40, 12);
  const line = { fill: "none", stroke: ink, strokeLinecap: "round" as const };
  const { x, y, w, h } = D;

  return (
    <AbsoluteFill style={{ background: "#f4f1ea" }}>
      <AbsoluteFill
        style={{
          opacity: blue,
          background: "linear-gradient(#ffffff14 1px, transparent 1px) 0 0 / 40px 40px, linear-gradient(90deg, #ffffff14 1px, transparent 1px) 0 0 / 40px 40px, #1d4f9c",
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <rect x={x} y={y} width={w} height={h} rx={38} {...line} strokeWidth={4} {...drawOn(sketch)} />
        <rect x={x + 14} y={y + 50} width={w - 28} height={h - 100} rx={8} {...line} strokeWidth={2} {...drawOn(grow(frame, 8, 24))} />
        <circle cx={x + w / 2} cy={y + 26} r={8} {...line} strokeWidth={2} {...drawOn(grow(frame, 14, 10))} />
        <rect x={x + w / 2 - 30} y={y + h - 30} width={60} height={8} rx={4} {...line} strokeWidth={2} {...drawOn(grow(frame, 16, 10))} />
        {/* Dimension lines: a ruler line with end ticks, plus its label. */}
        <g opacity={dims} stroke={ink} strokeWidth={2}>
          <line x1={x} x2={x + w} y1={y + h + 40} y2={y + h + 40} />
          <line x1={x} x2={x} y1={y + h + 28} y2={y + h + 52} />
          <line x1={x + w} x2={x + w} y1={y + h + 28} y2={y + h + 52} />
          <line x1={x + w + 50} x2={x + w + 50} y1={y} y2={y + h} />
          <line x1={x + w + 38} x2={x + w + 62} y1={y} y2={y} />
          <line x1={x + w + 38} x2={x + w + 62} y1={y + h} y2={y + h} />
        </g>
        <g opacity={dims} fill={ink} style={{ font: `600 22px ${MONO}` }}>
          <text x={x + w / 2} y={y + h + 74} textAnchor="middle">{width}</text>
          <text x={x + w + 72} y={y + h / 2 + 8}>{height}</text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 40, top: 34, color: ink, fontFamily: SANS }}>
        <div style={{ font: `600 18px ${MONO}`, letterSpacing: 3, opacity: 0.7 }}>TECHNICAL DRAWING</div>
        <div style={{ fontSize: 34, fontWeight: 800 }}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};
