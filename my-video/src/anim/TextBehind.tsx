import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { SANS, grow } from "./util";

export type TextBehindProps = {
  style: "text-behind";
  text: string; // 1-2 short words; it fills the width
  subject: string; // cut-out PNG under public/ (make one: npm run cutout -- photo.jpg public/.../subject.png)
  bg?: string; // the original photo, same size as the cut-out; leave out for one bold colour
  color?: string; // background colour when there's no photo
  ink?: string; // text colour
};

// The subject stands in front of a giant word: photo (or colour), then text, then the cut-out on top.
export const TextBehind: React.FC<TextBehindProps> = ({ text, subject, bg, color = "#e8452c", ink = "white" }) => {
  const frame = useCurrentFrame();
  const rise = grow(frame, 4, 18);
  const push = 1.06 - 0.06 * grow(frame, 0, 40); // a slow push-in on the whole picture
  const fill: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };

  return (
    <AbsoluteFill style={{ background: color, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(push) }}>
        {bg && <Img src={staticFile(bg)} style={fill} />}
        <div
          style={{
            position: "absolute",
            top: 70,
            width: "100%",
            textAlign: "center",
            font: `900 ${Math.min(300, 1500 / Math.max(3, text.length))}px ${SANS}`,
            letterSpacing: "-0.04em",
            color: ink,
            lineHeight: 0.9,
            textTransform: "uppercase",
            translate: `0 ${(1 - rise) * 120}px`,
            opacity: rise,
          }}
        >
          {text}
        </div>
        <Img src={staticFile(subject)} style={fill} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
