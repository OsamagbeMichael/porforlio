import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, SANS, W, grow } from "./util";

export type SwissGridProps = {
  style: "swiss-grid";
  lines: string[]; // 1-3 short lines of big type
  tags?: string[]; // small numbered labels along the bottom
};

export const SwissGrid: React.FC<SwissGridProps> = ({ lines, tags = [] }) => {
  const frame = useCurrentFrame();
  const grid = grow(frame, 0, 12);

  return (
    <AbsoluteFill style={{ background: "#f2efe8", color: "#111", fontFamily: SANS }}>
      {/* A 6 x 4 grid of hairlines that everything snaps to. */}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`v${i}`} x1={(i * W) / 6} x2={(i * W) / 6} y1={0} y2={H * grid} stroke="#cbc6ba" strokeWidth={1.5} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1={0} x2={W * grid} y1={(i * H) / 4} y2={(i * H) / 4} stroke="#cbc6ba" strokeWidth={1.5} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: W / 2, top: 0, width: W / 2, height: H / 2, background: "#e8371e", scale: `${grow(frame, 6, 12)} 1`, transformOrigin: "right" }} />
      <div style={{ position: "absolute", left: (W * 3) / 4 - 55, top: H / 4 - 55, width: 110, height: 110, borderRadius: 55, background: "#111", scale: String(grow(frame, 12, 10)) }} />

      {lines.map((l, i) => {
        const p = grow(frame, 14 + i * 5, 10);
        return (
          // overflow: hidden + sliding the text up = the line "rises" out of an invisible slot.
          <div key={i} style={{ position: "absolute", left: 28, top: H / 2 + 6 + i * 94, height: 100, overflow: "hidden" }}>
            <div style={{ font: `800 98px ${SANS}`, letterSpacing: -4, lineHeight: "100px", translate: `0 ${(1 - p) * 100}%` }}>{l}</div>
          </div>
        );
      })}

      {tags.map((t, i) => (
        <div key={t} style={{ position: "absolute", left: 28 + (i * W) / 6, bottom: 18, fontSize: 18, fontWeight: 700, opacity: grow(frame, 26 + i * 3, 8) }}>
          {String(i + 1).padStart(2, "0")} {t}
        </div>
      ))}
    </AbsoluteFill>
  );
};
