import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SANS, grow } from "./util";

export type TierListProps = {
  style: "tier-list";
  title: string; // what's being ranked
  tiers: { label?: string; items: string[] }[]; // best first; labels default to S, A, B, C, D
};

const COLORS = ["#ff7f7f", "#ffbf7f", "#ffdf7f", "#bfff7f", "#7fbfff"];
const LABELS = ["S", "A", "B", "C", "D"];

// The ranking format: items drop into their row one by one, best row first.
export const TierList: React.FC<TierListProps> = ({ title, tiers }) => {
  const frame = useCurrentFrame();
  const rowH = Math.min(118, 560 / tiers.length);
  let n = 0;

  return (
    <AbsoluteFill style={{ background: "#1a1a1d", fontFamily: SANS, padding: "34px 40px" }}>
      <div style={{ color: "white", font: `800 40px ${SANS}`, marginBottom: 18, opacity: grow(frame, 0, 10) }}>{title}</div>
      {tiers.map((t, r) => (
        <div key={r} style={{ display: "flex", height: rowH, marginBottom: 6, opacity: grow(frame, 4 + r * 3, 8) }}>
          <div style={{ width: rowH, background: COLORS[r % COLORS.length], display: "grid", placeItems: "center", font: `800 ${rowH * 0.42}px ${SANS}`, color: "#1a1a1d" }}>
            {t.label ?? LABELS[r]}
          </div>
          <div style={{ flex: 1, background: "#2a2a2f", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
            {t.items.map((item, i) => {
              const k = n++;
              const p = grow(frame, 14 + k * 6, 10); // one item every 6 frames
              return (
                <div key={i} style={{ background: "white", color: "#1a1a1d", font: `700 ${rowH * 0.24}px ${SANS}`, padding: "10px 16px", borderRadius: 8, opacity: p, translate: `0 ${(1 - p) * -60}px`, rotate: `${(1 - p) * -8}deg` }}>
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
