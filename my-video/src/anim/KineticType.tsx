import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SANS, SERIF, grow } from "./util";

export type KineticTypeProps = {
  style: "kinetic-type";
  text: string; // a short sentence; every second word is set in big serif italics
  color?: string; // background, default electric blue
};

export const KineticType: React.FC<KineticTypeProps> = ({ text, color = "#1f3bff" }) => {
  const frame = useCurrentFrame();
  const words = text.trim().split(/\s+/);

  return (
    <AbsoluteFill style={{ background: color, color: "white", padding: 70, flexDirection: "row", flexWrap: "wrap", alignContent: "center", alignItems: "baseline", columnGap: 22 }}>
      {words.map((w, i) => {
        const p = grow(frame, 4 + i * 5, 10); // one word every 5 frames
        return (
          <span
            key={i}
            style={{
              font: i % 2 ? `italic 400 124px ${SERIF}` : `800 66px ${SANS}`,
              lineHeight: 1.05,
              opacity: p,
              translate: `0 ${(1 - p) * 50}px`,
              filter: `blur(${(1 - p) * 10}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 60, height: 2, background: "rgba(255,255,255,0.55)", scale: `${grow(frame, 0, 30)} 1`, transformOrigin: "left" }} />
    </AbsoluteFill>
  );
};
