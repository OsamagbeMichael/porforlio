import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SANS, grow } from "./util";

export type LaptopRevealProps = {
  style: "laptop-reveal";
  src: string; // screenshot under public/, shown on the screen
  caption?: string;
};

const LW = 600; // lid and base size
const LH = 380;

export const LaptopReveal: React.FC<LaptopRevealProps> = ({ src, caption }) => {
  const frame = useCurrentFrame();
  const open = grow(frame, 4, 26);
  // The lid swings on its bottom edge: -90deg lies flat on the base (closed), +10deg leans back (open).
  const lid = interpolate(open, [0, 1], [-90, 10]);
  const face: React.CSSProperties = { position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 18 };

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #ffffff, #dfe2e7 75%)", perspective: 1800, fontFamily: SANS }}>
      {/* The camera looks slightly down at the desk. preserve-3d keeps lid and base in one 3D scene. */}
      <div style={{ position: "absolute", left: "50%", top: 470, transformStyle: "preserve-3d", transform: "rotateX(-14deg) scale(0.9)" }}>
        <div style={{ position: "absolute", left: -LW / 2, top: 0, width: LW, height: LH, borderRadius: 18, transformOrigin: "50% 0%", transform: "rotateX(90deg)", background: "linear-gradient(#e9ebee, #c9cdd3)", boxShadow: "0 0 0 2px #b8bcc3 inset" }} />
        <div style={{ position: "absolute", left: -LW / 2, top: -LH, width: LW, height: LH, transformOrigin: "50% 100%", transformStyle: "preserve-3d", transform: `rotateX(${lid}deg)` }}>
          <div style={{ ...face, background: "#111", padding: 14, boxSizing: "border-box" }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6, opacity: grow(frame, 22, 10) }} />
          </div>
          <div style={{ ...face, transform: "rotateY(180deg)", background: "linear-gradient(135deg, #e4e6ea, #b9bec6)" }} />
        </div>
      </div>
      {caption && (
        <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center", fontSize: 34, fontWeight: 800, color: "#1b2330", opacity: grow(frame, 30, 10) }}>{caption}</div>
      )}
    </AbsoluteFill>
  );
};
