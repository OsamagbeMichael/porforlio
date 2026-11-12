import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, SANS, SERIF, W, drawOn, grow, linePath } from "./util";

export type PaperDeskProps = {
  style: "paper-desk";
  headline: string; // printed like a newspaper headline
  kicker?: string; // small red line above it, e.g. "Study, 2026"
  points?: number[]; // optional ink chart under the headline
};

const PW = 700; // paper width
const PH = 560;

export const PaperDesk: React.FC<PaperDeskProps> = ({ headline, kicker, points }) => {
  const frame = useCurrentFrame();
  const slide = grow(frame, 0, 14);
  const sheet: React.CSSProperties = {
    position: "absolute",
    left: (W - PW) / 2,
    top: (H - PH) / 2,
    width: PW,
    height: PH,
    boxSizing: "border-box",
    background: "#f3eee3",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
  };
  const chartW = PW - 100;
  const chart = points && linePath(points, chartW, 150);

  return (
    <AbsoluteFill
      style={{
        // Wood: faint stripes over a brown gradient.
        background:
          "repeating-linear-gradient(100deg, rgba(255,255,255,0.035) 0 6px, transparent 6px 22px), linear-gradient(135deg, #4a3324, #1f130b)",
      }}
    >
      {/* A second sheet underneath so it reads as a pile of paper on a desk. */}
      <div style={{ ...sheet, rotate: "4deg", translate: "26px 14px", background: "#e6dfd0" }} />
      <div
        style={{
          ...sheet,
          rotate: `${-3 + slide * 1.5}deg`,
          translate: `0 ${(1 - slide) * 140}px`,
          padding: "44px 50px",
          fontFamily: SERIF,
          color: "#16130f",
        }}
      >
        {kicker && (
          <div style={{ fontFamily: SANS, fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "#b3261e", fontWeight: 700 }}>
            {kicker}
          </div>
        )}
        <div style={{ fontSize: headline.length > 60 ? 42 : 52, fontWeight: 700, lineHeight: 1.08, marginTop: 12 }}>{headline}</div>
        <div style={{ height: 3, background: "#16130f", margin: "22px 0" }} />
        {chart && (
          <svg width={chartW} height={150} style={{ overflow: "visible" }}>
            {[0, 75, 150].map((y) => (
              <line key={y} x1={0} x2={chartW} y1={y} y2={y} stroke="#cfc6b4" strokeDasharray="6 6" strokeWidth={2} />
            ))}
            <path d={chart.d} fill="none" stroke="#16130f" strokeWidth={4} strokeLinejoin="round" {...drawOn(grow(frame, 12, 26))} />
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
};
