import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Easing } from "remotion";
import { SANS } from "./util";

export type BeforeAfterProps = {
  style: "before-after";
  before: string; // image path under public/
  after: string;
  title?: string;
};

const pill = (text: string, side: "left" | "right"): React.ReactNode => (
  <div style={{ position: "absolute", top: 24, [side]: 24, background: "rgba(0,0,0,0.65)", color: "white", font: `800 20px ${SANS}`, letterSpacing: 3, padding: "8px 16px", borderRadius: 999 }}>
    {text}
  </div>
);

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ before, after, title }) => {
  const frame = useCurrentFrame();
  // The divider sweeps from the right edge to the left, uncovering "after" as it goes.
  const pos = interpolate(frame, [8, 40], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const fill: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", objectFit: "cover" };

  return (
    <AbsoluteFill style={{ background: "#111" }}>
      <Img src={staticFile(before)} style={fill} />
      <Img src={staticFile(after)} style={{ ...fill, clipPath: `inset(0 0 0 ${pos}%)` }} />
      {pos > 0 && pos < 100 && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 4, translate: "-50% 0", background: "white", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", width: 56, height: 56, borderRadius: 28, background: "white", display: "grid", placeItems: "center", font: `800 24px ${SANS}`, color: "#111" }}>⇆</div>
        </div>
      )}
      {pos > 50 ? pill("BEFORE", "left") : pill("AFTER", "right")}
      {title && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "60px 30px 24px", background: "linear-gradient(transparent, rgba(0,0,0,0.75))", color: "white", font: `800 44px ${SANS}`, textAlign: "center" }}>
          {title}
        </div>
      )}
    </AbsoluteFill>
  );
};
