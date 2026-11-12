import { AbsoluteFill, useCurrentFrame } from "remotion";
import { countUp } from "./StatChart";
import { SANS, grow } from "./util";

export type DayCounterProps = {
  style: "day-counter";
  day: number; // e.g. 30 -> "DAY 30", and 30 days ticked off
  kicker?: string; // "Posting every day"
  month?: string; // "April"
};

const RED = "#e63027";
const CONDENSED = "'Helvetica Neue Condensed', 'Arial Narrow', Impact, sans-serif";

export const DayCounter: React.FC<DayCounterProps> = ({ day, kicker, month }) => {
  const frame = useCurrentFrame();
  const shown = Math.round(countUp(frame, day));
  const cells = Math.max(28, Math.ceil(day / 7) * 7);
  const card = grow(frame, 0, 12);

  return (
    <AbsoluteFill style={{ background: "#f4f2ee", alignItems: "center", fontFamily: SANS }}>
      {kicker && <div style={{ marginTop: 34, fontSize: 20, letterSpacing: 6, color: "#6c6862", textTransform: "uppercase" }}>{kicker}</div>}
      <div style={{ font: `900 150px ${CONDENSED}`, color: RED, lineHeight: 1, letterSpacing: -2, fontVariantNumeric: "tabular-nums" }}>DAY {shown}</div>
      <div style={{ marginTop: 16, width: 560, background: "white", borderRadius: 22, boxShadow: "0 16px 40px rgba(0,0,0,0.12)", padding: "16px 22px", opacity: card, translate: `0 ${(1 - card) * 40}px` }}>
        {month && <div style={{ font: `900 26px ${CONDENSED}`, textTransform: "uppercase", marginBottom: 6 }}>{month}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {"SMTWTFS".split("").map((d, i) => (
            <div key={`d${i}`} style={{ textAlign: "center", fontSize: 15, color: "#9a958d", fontWeight: 700 }}>{d}</div>
          ))}
          {Array.from({ length: cells }, (_, i) => {
            const done = i < shown;
            return (
              <div key={i} style={{ height: cells > 35 ? 36 : 44, borderRadius: 8, background: done ? "#fde3e1" : "#f3f1ed", display: "grid", placeItems: "center", position: "relative", fontSize: 14, color: "#b5b0a8" }}>
                {done ? <span style={{ color: RED, fontSize: 28, fontWeight: 900 }}>✓</span> : i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
