import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { H, W, drawOn, grow } from "./util";

export type SketchNoteProps = {
  style: "sketch-note";
  title: string; // hand-lettered, in caps
  number?: number; // circled list number, e.g. 3 -> "03"
  src?: string; // optional illustration under public/ (draw or generate it first)
};

// macOS marker fonts first; rendering happens on this Mac, so they're available.
const MARKER = "'Marker Felt', 'Chalkboard SE', 'Comic Sans MS', cursive";
const ORANGE = "#f07a2b";

export const SketchNote: React.FC<SketchNoteProps> = ({ title, number, src }) => {
  const frame = useCurrentFrame();
  const ring = grow(frame, 0, 12);
  const write = grow(frame, 6, 20); // the title is "written" left to right
  const pic = grow(frame, 22, 12);
  const cy = src ? 110 : 245; // the circled number sits level with the title's first line

  return (
    <AbsoluteFill style={{ background: "#fbfaf7" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          {/* Wobble straight vector lines so they look hand-drawn with a pen. */}
          <filter id="sketch-wobble">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={3} />
            <feDisplacementMap in="SourceGraphic" scale={6} />
          </filter>
        </defs>
        {number !== undefined && <circle cx={92} cy={cy} r={44} fill="none" stroke="#111" strokeWidth={5} filter="url(#sketch-wobble)" transform={`rotate(-80 92 ${cy})`} {...drawOn(ring)} />}
        <path d={`M${number !== undefined ? 160 : 60},${src ? 190 : 420} q220,-14 ${W - 260},4`} fill="none" stroke={ORANGE} strokeWidth={8} strokeLinecap="round" filter="url(#sketch-wobble)" {...drawOn(grow(frame, 24, 12))} />
      </svg>
      {number !== undefined && (
        <div style={{ position: "absolute", left: 48, top: cy - 28, width: 88, textAlign: "center", font: `700 46px ${MARKER}`, color: "#111", opacity: ring }}>
          {String(number).padStart(2, "0")}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: number !== undefined ? 160 : 60,
          right: 50,
          top: src ? 60 : 200,
          font: `700 ${src ? 60 : 84}px ${MARKER}`,
          lineHeight: 1.05,
          textTransform: "uppercase",
          color: "#111",
          clipPath: `inset(0 ${(1 - write) * 100}% 0 0)`,
        }}
      >
        {title}
      </div>
      {src && (
        <Img src={staticFile(src)} style={{ position: "absolute", left: 120, right: 120, top: 220, height: 420, width: W - 240, objectFit: "contain", opacity: pic, scale: String(0.96 + 0.04 * pic) }} />
      )}
    </AbsoluteFill>
  );
};
