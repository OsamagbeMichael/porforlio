import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, SANS, grow } from "./util";

export type RisographProps = {
  style: "risograph";
  lines: string[]; // 1-3 short words, one per line
};

const PINK = "#ff3ea5";
const BLUE = "#3346ff";
// Halftone dots: one dot drawn by a radial gradient, tiled every 12px.
const dots = (c: string) => `radial-gradient(${c} 36%, transparent 40%) 0 0 / 12px 12px`;
const LINE_H = 190;

export const Risograph: React.FC<RisographProps> = ({ lines }) => {
  const frame = useCurrentFrame();
  const a = grow(frame, 0, 14);
  const b = grow(frame, 6, 14);
  const top0 = (H - lines.length * LINE_H) / 2;

  return (
    <AbsoluteFill style={{ background: "#f1ede4" }}>
      {/* multiply = two inks printed over each other: where they overlap you get a darker third colour. */}
      <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", background: PINK, mixBlendMode: "multiply", left: 150 - (1 - a) * 400, top: 250 }} />
      <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", background: dots(BLUE), mixBlendMode: "multiply", left: 400 + (1 - b) * 400, top: 110 }} />
      {lines.map((l, i) => {
        const p = grow(frame, 10 + i * 6, 10);
        const style: React.CSSProperties = { position: "absolute", inset: 0, textAlign: "center", font: `900 150px ${SANS}`, letterSpacing: -2, textTransform: "uppercase", lineHeight: `${LINE_H}px`, mixBlendMode: "multiply" };
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: top0 + i * LINE_H, height: LINE_H, opacity: p }}>
            {/* The pink copy sits a few pixels off, like two print passes that didn't line up. */}
            <div style={{ ...style, color: PINK, translate: `${5 + (1 - p) * 40}px 5px` }}>{l}</div>
            <div style={{ ...style, color: BLUE }}>{l}</div>
          </div>
        );
      })}
      <svg width="100%" height="100%" style={{ position: "absolute", mixBlendMode: "multiply", opacity: 0.5 }}>
        <filter id="riso-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.45 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#riso-grain)" />
      </svg>
    </AbsoluteFill>
  );
};
