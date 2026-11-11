import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SERIF, W, drawOn, grow } from "./util";

export type InkWashProps = {
  style: "ink-wash";
  text: string; // one short line, like a proverb
  sub?: string;
};

// Three ridges, far to near. Darker = closer, like ink diluted with more or less water.
const HILLS = [
  { d: "M0 470 C120 400 200 420 300 380 C400 340 470 410 560 390 C680 360 780 300 940 350 L940 680 L0 680Z", ink: 0.14 },
  { d: "M0 540 C100 480 220 500 330 460 C430 430 520 500 640 480 C760 460 850 430 940 470 L940 680 L0 680Z", ink: 0.3 },
  { d: "M0 610 C140 570 260 600 380 580 C520 556 640 610 760 590 C840 578 900 560 940 570 L940 680 L0 680Z", ink: 0.6 },
];

export const InkWash: React.FC<InkWashProps> = ({ text, sub }) => {
  const frame = useCurrentFrame();
  const words = grow(frame, 14, 18);
  const seal = grow(frame, 34, 6);

  return (
    <AbsoluteFill style={{ background: "#efe7d6" }}>
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <defs>
          {/* Noise that wobbles a shape's edges: turns clean vector strokes into brush strokes. */}
          <filter id="ink-brush">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={3} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={14} />
          </filter>
          <filter id="ink-wash">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={9} />
            <feDisplacementMap in="SourceGraphic" scale={30} />
            <feGaussianBlur stdDeviation={5} />
          </filter>
          <filter id="ink-paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.35 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#ink-paper)" />
        {HILLS.map((h, i) => {
          const rise = grow(frame, i * 6, 24);
          return <path key={i} d={h.d} fill={`rgba(20,18,15,${h.ink})`} filter="url(#ink-wash)" opacity={rise} transform={`translate(0 ${(1 - rise) * 60})`} />;
        })}
        {/* Ensō: one brush circle, left slightly open. Rotated so the stroke starts at the lower left. */}
        <circle cx={W * 0.72} cy={210} r={130} fill="none" stroke="#111" strokeWidth={26} strokeLinecap="round" filter="url(#ink-brush)"
          transform={`rotate(-110 ${W * 0.72} 210)`} {...drawOn(grow(frame, 4, 28) * 0.88)} />
      </svg>

      <div style={{ position: "absolute", left: 60, top: 70, width: 400, fontFamily: SERIF, color: "#14110d", opacity: words, filter: `blur(${(1 - words) * 8}px)` }}>
        <div style={{ fontSize: 62, lineHeight: 1.1, fontWeight: 700 }}>{text}</div>
        {sub && <div style={{ fontSize: 26, marginTop: 16, color: "#5a5246", fontStyle: "italic" }}>{sub}</div>}
        {/* The red seal sits under the words, so it moves down with them however many lines they wrap to. */}
        <div style={{ marginTop: 22, width: 64, height: 64, borderRadius: 6, background: "#b3261e", color: "#f6ecd8", font: `700 38px ${SERIF}`, display: "grid", placeItems: "center", scale: String(seal), rotate: "-6deg" }}>
          {text.trim()[0]}
        </div>
      </div>
    </AbsoluteFill>
  );
};
