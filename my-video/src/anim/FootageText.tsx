import { Video } from "@remotion/media";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { H, SANS, W, grow } from "./util";

export type FootageTextProps = {
  style: "footage-text";
  text: string; // one word works best
  src: string; // image or video under public/ that shows through the letters
  color?: string; // the single flat colour around the letters
  sub?: string; // small line under the word
};

// A word cut out of a flat colour, with footage playing inside the letters.
export const FootageText: React.FC<FootageTextProps> = ({ text, src, color = "#f2efe8", sub }) => {
  const frame = useCurrentFrame();
  const open = grow(frame, 0, 24);
  const word = text.toUpperCase();
  // The word is an SVG mask; textLength stretches it to the same width whatever its length.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><text x="${W / 2}" y="${H / 2 + 95}" text-anchor="middle" textLength="${W - 90}" lengthAdjust="spacingAndGlyphs" font-family="Helvetica Neue, Arial, sans-serif" font-weight="900" font-size="300">${word.replace(/[<&>]/g, "")}</text></svg>`;
  const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  const fill: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", scale: String(1.25 - 0.15 * open) };

  return (
    <AbsoluteFill style={{ background: color }}>
      <AbsoluteFill style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", opacity: open }}>
        {/\.(mp4|mov|webm|m4v)$/i.test(src) ? <Video src={staticFile(src)} muted objectFit="cover" style={fill} /> : <Img src={staticFile(src)} style={fill} />}
      </AbsoluteFill>
      {sub && (
        <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", font: `500 30px ${SANS}`, letterSpacing: "0.3em", textTransform: "uppercase", color: "#222", opacity: grow(frame, 18, 12) }}>
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
};
