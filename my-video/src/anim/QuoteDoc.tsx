import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SANS, SERIF, floatShadow, grow } from "./util";

export type QuoteDocProps = {
  style: "quote-doc";
  text: string; // the paragraph from the book or paper
  highlight: string; // the sentence you read out; must appear in `text`
  source?: string; // e.g. "Journal of Sleep Research, 2024"
  heading?: string; // e.g. "INTRODUCTION"
};

// Quoting a paper without losing people: the page appears, the sentence is highlighted,
// everything else dims, and the camera eases in on the sentence.
export const QuoteDoc: React.FC<QuoteDocProps> = ({ text, highlight, source, heading = "INTRODUCTION" }) => {
  const frame = useCurrentFrame();
  const at = Math.max(0, text.indexOf(highlight));
  const before = text.slice(0, at);
  const after = text.slice(at + highlight.length);
  const sweep = grow(frame, 10, 16); // 1. highlight
  const dim = grow(frame, 28, 12); // 2. mask the rest
  const zoom = interpolate(grow(frame, 30, 30), [0, 1], [1, 1.2]); // 3. zoom in, gently enough to keep the sentence whole
  // Ease in roughly where the sentence sits: its share of the text ~ its height on the page.
  const originY = 30 + ((at + highlight.length / 2) / text.length) * 55;
  const rest: React.CSSProperties = { opacity: 1 - 0.75 * dim };

  return (
    <AbsoluteFill style={{ background: `hsl(0 0% ${100 - 53 * dim}%)` }}>
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: `50% ${originY}%`, padding: "70px 80px", opacity: grow(frame, 0, 8) }}>
        {source && <div style={{ font: `italic 400 22px ${SERIF}`, color: "#555", marginBottom: 18, ...rest }}>{source}</div>}
        <div style={{ font: `600 18px ${SANS}`, letterSpacing: "0.08em", color: "#333", borderBottom: "1px solid #ccc", paddingBottom: 10, marginBottom: 18, ...rest }}>{heading}</div>
        <div style={{ font: `400 30px ${SERIF}`, lineHeight: 1.5, color: "#1b1b1b" }}>
          <span style={rest}>{before}</span>
          <span
            style={{
              // The yellow grows left to right like a marker, then the sentence lifts off the dimmed page.
              background: `linear-gradient(#ffeb3b, #ffeb3b) no-repeat 0 0 / ${sweep * 100}% 100%, ${dim ? `rgba(255,255,255,${dim})` : "transparent"}`,
              boxShadow: dim ? floatShadow(6 * dim, 0.3 * dim) : "none",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              padding: "2px 4px",
            }}
          >
            {highlight}
          </span>
          <span style={rest}>{after}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
