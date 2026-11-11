import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, drawOn, grow } from "./util";

export type OscilloscopeProps = {
  style: "oscilloscope";
  text: string; // short, shown in glowing caps
};

const GREEN = "#39ff88";

export const Oscilloscope: React.FC<OscilloscopeProps> = ({ text }) => {
  const frame = useCurrentFrame();
  // A Lissajous figure: x and y are two sine waves at a 3:2 ratio. Shifting the phase makes it turn.
  const phase = frame * 0.04;
  const pts = Array.from({ length: 241 }, (_, i) => {
    const t = (i / 240) * Math.PI * 2;
    return [W / 2 + 230 * Math.sin(3 * t + phase), 250 + 150 * Math.sin(2 * t)];
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const trace = grow(frame, 0, 28);
  const reveal = grow(frame, 26, 18); // the text gets "written" left to right by the beam

  return (
    <AbsoluteFill style={{ background: "#020604" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <filter id="scope-glow">
            <feGaussianBlur stdDeviation={6} />
          </filter>
        </defs>
        {/* Screen graticule: 10 x 8 faint divisions. */}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`v${i}`} x1={(i * W) / 10} x2={(i * W) / 10} y1={0} y2={H} stroke="#0f2a1b" strokeWidth={1.5} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} y1={(i * H) / 8} y2={(i * H) / 8} x1={0} x2={W} stroke="#0f2a1b" strokeWidth={1.5} />
        ))}
        {/* Same path twice: a blurred wide copy for the glow, a thin bright copy for the beam. */}
        <path d={d} fill="none" stroke={GREEN} strokeWidth={10} opacity={0.6} filter="url(#scope-glow)" {...drawOn(trace)} />
        <path d={d} fill="none" stroke="#c8ffe0" strokeWidth={2.5} {...drawOn(trace)} />
        <line x1={40} x2={W - 40} y1={540} y2={540} stroke={GREEN} strokeWidth={2} opacity={0.5} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          textAlign: "center",
          font: "700 88px Menlo, monospace",
          letterSpacing: 6,
          color: "#c8ffe0",
          textTransform: "uppercase",
          textShadow: `0 0 12px ${GREEN}, 0 0 34px ${GREEN}`,
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
