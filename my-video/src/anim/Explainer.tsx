import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { SERIF, grow } from "./util";

export type ExplainerProps = {
  style: "explainer";
  text: string; // one calm sentence, said in the take at the same time
  src?: string; // a small diagram, screenshot or meme under public/
  paper?: boolean; // white paper instead of black
  tag?: string; // a small grey label above the picture, e.g. "RGB split"
};

// The quiet cutaway: a small picture on a plain card with one serif line under it. Nothing flashy.
export const Explainer: React.FC<ExplainerProps> = ({ text, src, paper = false, tag }) => {
  const frame = useCurrentFrame();
  const show = grow(frame, 0, 8);
  const ink = paper ? "#1b1b1b" : "#f4f1ea";

  return (
    <AbsoluteFill style={{ background: paper ? "#f4f1ea" : "#000", color: ink, alignItems: "center", justifyContent: "center", gap: 34, padding: "0 90px", opacity: show }}>
      {tag && <div style={{ font: `italic 600 30px ${SERIF}`, color: paper ? "#666" : "#aaa" }}>{tag}</div>}
      {src && <Img src={staticFile(src)} style={{ maxWidth: 520, maxHeight: 330, objectFit: "contain", scale: String(0.97 + 0.03 * show) }} />}
      <div style={{ font: `400 46px ${SERIF}`, textAlign: "center", lineHeight: 1.25 }}>{text}</div>
    </AbsoluteFill>
  );
};
