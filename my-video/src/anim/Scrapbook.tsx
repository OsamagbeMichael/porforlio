import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { SANS, SERIF, grow } from "./util";

export type ScrapbookProps = {
  style: "scrapbook";
  title: string; // set as cut-out "ransom note" letters
  notes: string[]; // handwritten-style sticky notes (1-3)
  src?: string; // a photo, taped on at an angle
};

const PAPERS = ["#f7d046", "#ff6b4a", "#ffffff", "#9ad1f5", "#111111", "#c6e377"];
const FONTS = [`900 64px ${SANS}`, `italic 700 66px ${SERIF}`, `800 58px 'Courier New', monospace`, `700 70px ${SERIF}`];

// Digital scrapbook: grid paper, a taped photo, cut-out letters and sticky notes, each stuck on in turn.
export const Scrapbook: React.FC<ScrapbookProps> = ({ title, notes, src }) => {
  const frame = useCurrentFrame();
  const stick = (from: number) => {
    const p = grow(frame, from, 7);
    return { opacity: p, scale: String(1.25 - 0.25 * p) };
  };

  return (
    <AbsoluteFill
      style={{ background: "linear-gradient(#0000000d 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(90deg, #0000000d 1px, transparent 1px) 0 0 / 28px 28px, #f4f1ea" }}
    >
      {src && (
        <div style={{ position: "absolute", left: 480, top: 170, width: 390, height: 450, background: "white", padding: 14, paddingBottom: 54, rotate: "4deg", boxShadow: "0 10px 26px rgba(0,0,0,0.2)", ...stick(4) }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", top: -16, left: 140, width: 120, height: 34, background: "rgba(255,240,170,0.75)", rotate: "-6deg" }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 50, top: 40, right: 50, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {title.split("").map((ch, i) => {
          if (ch === " ") return <div key={i} style={{ width: 24 }} />;
          const r = (k: string) => random(`${k}-${i}-${title}`);
          const bg = PAPERS[Math.floor(r("bg") * PAPERS.length)];
          return (
            <div
              key={i}
              style={{
                font: FONTS[Math.floor(r("font") * FONTS.length)],
                background: bg,
                color: bg === "#111111" || bg === "#ff6b4a" ? "white" : "#111",
                padding: "2px 10px",
                lineHeight: 1.1,
                rotate: `${(r("rot") - 0.5) * 14}deg`,
                boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                ...stick(10 + i * 2),
              }}
            >
              {ch.toUpperCase()}
            </div>
          );
        })}
      </div>
      {notes.map((n, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 60 + i * 130,
            top: 330 + i * 70,
            width: 280,
            minHeight: 150,
            padding: "20px 22px",
            background: ["#fff59d", "#ffcdd2", "#c8e6c9"][i % 3],
            font: `600 30px 'Marker Felt', 'Chalkboard SE', 'Comic Sans MS', cursive`,
            color: "#222",
            rotate: `${i % 2 ? 3 : -4}deg`,
            boxShadow: "0 8px 18px rgba(0,0,0,0.15)",
            ...stick(30 + i * 8),
          }}
        >
          {n}
        </div>
      ))}
    </AbsoluteFill>
  );
};
