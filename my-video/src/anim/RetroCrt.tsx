import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, SANS, grow } from "./util";

export type RetroCrtProps = {
  style: "retro-crt";
  text: string; // 1-3 words, shown in caps
  sub?: string; // typed out underneath like a terminal
};

const PINK = "#ff5fa2";

export const RetroCrt: React.FC<RetroCrtProps> = ({ text, sub }) => {
  const frame = useCurrentFrame();
  const line = grow(frame, 0, 6); // an old TV switching on: a thin line first...
  const open = grow(frame, 6, 8); // ...then the picture opens up from it
  const flicker = 0.88 + 0.12 * Math.sin(frame * 2.3) * Math.sin(frame * 0.7);
  const typed = (sub ?? "").slice(0, Math.max(0, Math.floor((frame - 18) / 2)));

  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: H / 2 - 2, left: "50%", width: `${line * 90}%`, translate: "-50% 0", height: 4, background: "white", boxShadow: `0 0 24px ${PINK}`, opacity: 1 - open }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: `1 ${Math.max(0.01, open)}`, opacity: open * flicker }}>
        <div
          style={{
            font: `900 112px ${SANS}`,
            color: "white",
            textAlign: "center",
            lineHeight: 1,
            letterSpacing: 4,
            textTransform: "uppercase",
            // Red/blue fringes either side fake the colour bleed of a CRT.
            textShadow: `-4px 0 ${PINK}, 4px 0 #4cc9f0, 0 0 30px ${PINK}, 0 0 70px ${PINK}88`,
          }}
        >
          {text}
        </div>
        {sub && (
          <div style={{ marginTop: 34, font: "500 30px Menlo, monospace", color: "#ffd1e6", letterSpacing: 3, minHeight: 36 }}>
            {typed}
            <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>█</span>
          </div>
        )}
      </AbsoluteFill>
      {/* Scanlines and a dark vignette on top, like the curved glass of an old screen. */}
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 5px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85))" }} />
    </AbsoluteFill>
  );
};
