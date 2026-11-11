import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SANS, W, grow } from "./util";

export type StepCardProps = {
  style: "step-card";
  step: number; // the circled number
  label: string; // short step name next to the number, e.g. "Build the real model"
  text: string; // the line that appears in the middle
  accent?: string; // a word or phrase from `text` to colour blue
};

const BLUE = "#3346c8";
const INK = "#2a2723";

export const StepCard: React.FC<StepCardProps> = ({ step, label, text, accent }) => {
  const frame = useCurrentFrame();
  const head = grow(frame, 0, 10);
  const arrow = grow(frame, 4, 20);
  // Split around the accent so that part can be coloured, keeping the words in order.
  const parts = accent && text.includes(accent) ? text.split(accent).flatMap((p, i) => (i ? [{ t: accent, a: true }, { t: p, a: false }] : [{ t: p, a: false }])) : [{ t: text, a: false }];
  let n = 0;

  return (
    <AbsoluteFill
      style={{
        // Faint drafting-paper grid: two repeating 1px lines, one each way.
        background: "linear-gradient(#0000000a 1px, transparent 1px) 0 0 / 32px 32px, linear-gradient(90deg, #0000000a 1px, transparent 1px) 0 0 / 32px 32px, #ece7df",
        color: INK,
        fontFamily: SANS,
      }}
    >
      <div style={{ position: "absolute", left: 50, top: 46, display: "flex", alignItems: "center", gap: 16, opacity: head }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, border: `2px solid ${INK}`, display: "grid", placeItems: "center", fontSize: 22 }}>{step}</div>
        <div style={{ fontSize: 22 }}>{label}</div>
      </div>
      <svg width={W} height={120} style={{ position: "absolute", top: 40 }}>
        <line x1={50} x2={50 + (W - 100) * arrow} y1={90} y2={90} stroke={INK} strokeWidth={2} />
        <path d={`M${40 + (W - 100) * arrow},82 L${50 + (W - 100) * arrow},90 L${40 + (W - 100) * arrow},98`} fill="none" stroke={INK} strokeWidth={2} opacity={arrow} />
      </svg>
      <div style={{ position: "absolute", left: 70, right: 70, top: 0, bottom: 0, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", columnGap: 18, fontSize: 70, lineHeight: 1.2 }}>
        {parts.map((p) =>
          p.t.trim().split(/\s+/).filter(Boolean).map((w) => {
            const k = n++;
            const show = grow(frame, 10 + k * 3, 10);
            return (
              <span key={k} style={{ color: p.a ? BLUE : INK, fontWeight: p.a ? 600 : 400, opacity: show, translate: `0 ${(1 - show) * 20}px` }}>
                {w}
              </span>
            );
          }),
        )}
      </div>
    </AbsoluteFill>
  );
};
