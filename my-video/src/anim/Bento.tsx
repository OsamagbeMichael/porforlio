import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SANS, grow } from "./util";

export type BentoProps = {
  style: "bento";
  cells: { value?: string; label: string }[]; // 3-6 tiles; the first one is the big one
  accent?: string; // colour of the big tile
};

// A bento grid: rounded tiles of different sizes that snap in one after another.
export const Bento: React.FC<BentoProps> = ({ cells, accent = "#c6f432" }) => {
  const frame = useCurrentFrame();
  // 4 columns x 3 rows; the first tile takes a 2x2 block, the rest fill around it.
  const spans = [
    { col: "1 / 3", row: "1 / 3" },
    { col: "3 / 5", row: "1 / 2" },
    { col: "3 / 4", row: "2 / 3" },
    { col: "4 / 5", row: "2 / 4" },
    { col: "1 / 2", row: "3 / 4" },
    { col: "2 / 4", row: "3 / 4" },
  ];

  return (
    <AbsoluteFill style={{ background: "#0e0e10", padding: 28, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: 14, fontFamily: SANS }}>
      {cells.slice(0, 6).map((c, i) => {
        const p = grow(frame, 3 + i * 5, 10);
        const big = i === 0;
        return (
          <div
            key={i}
            style={{
              gridColumn: spans[i].col,
              gridRow: spans[i].row,
              background: big ? accent : i % 3 === 1 ? "#1f1f24" : "#f3f1ec",
              color: big || i % 3 !== 1 ? "#0e0e10" : "white",
              borderRadius: 26,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              opacity: p,
              scale: String(0.9 + 0.1 * p),
            }}
          >
            {c.value && <div style={{ font: `800 ${big ? 110 : 54}px ${SANS}`, letterSpacing: "-0.04em", lineHeight: 1 }}>{c.value}</div>}
            <div style={{ font: `600 ${big ? 28 : 21}px ${SANS}`, marginTop: 8, opacity: 0.75 }}>{c.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
