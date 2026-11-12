import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { SANS, SERIF, W, grow } from "./util";

export type EditTimelineProps = {
  style: "edit-timeline";
  title?: string; // e.g. "day-80.mp4"
  notes?: string[]; // short explanations that appear under the timeline as the playhead passes (1-3)
};

const TRACKS = [
  { name: "V2", color: "#8e6bd8", fill: 0.45 }, // b-roll, sparse
  { name: "V1", color: "#3d8fd6", fill: 0.95 }, // a-roll, lots of small cuts
  { name: "A1", color: "#3fa45b", fill: 0.95 }, // voice
  { name: "A2", color: "#2f7a45", fill: 0.6 }, // music + sfx
];
const LEFT = 70;
const RIGHT = W - 40;

// "Show the timeline": an editing timeline with a moving playhead tells viewers this is real editing work.
export const EditTimeline: React.FC<EditTimelineProps> = ({ title = "reel.mp4", notes = [] }) => {
  const frame = useCurrentFrame();
  const head = interpolate(frame, [6, 84], [LEFT, RIGHT], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#1c1d21", fontFamily: SANS, color: "#cfd2d8" }}>
      <div style={{ padding: "26px 40px 0", font: `600 20px ${SANS}`, opacity: grow(frame, 0, 8) }}>{title}</div>
      <svg width={W} height={330} style={{ position: "absolute", top: 70 }}>
        {TRACKS.map((t, r) => {
          // Seeded clip layout so every render of the same title looks identical.
          const clips: [number, number][] = [];
          for (let x = LEFT; x < RIGHT; ) {
            const len = 20 + random(`${title}-${r}-${x}`) * 90;
            if (random(`${title}-${r}-${x}-on`) < t.fill) clips.push([x, Math.min(len - 3, RIGHT - x)]);
            x += len;
          }
          const y = 20 + r * 72;
          return (
            <g key={t.name} opacity={grow(frame, r * 3, 10)}>
              <text x={20} y={y + 36} fill="#8a8f99" fontSize={18} fontFamily={SANS}>
                {t.name}
              </text>
              {clips.map(([x, w], i) => (
                <g key={i}>
                  <rect x={x} y={y} width={w} height={56} rx={4} fill={t.color} opacity={x < head ? 1 : 0.55} />
                  {/* audio clips get a little waveform */}
                  {r >= 2 && <path d={Array.from({ length: Math.floor(w / 4) }, (_, k) => `M${x + 2 + k * 4},${y + 28 - random(`${i}-${k}-${r}`) * 18}v${random(`${k}-${i}`) * 36}`).join("")} stroke="#ffffff66" strokeWidth={2} />}
                </g>
              ))}
            </g>
          );
        })}
        <line x1={head} x2={head} y1={6} y2={318} stroke="#ff4d4d" strokeWidth={3} />
        <path d={`M${head - 9},0 h18 l-9,12 z`} fill="#ff4d4d" />
      </svg>
      {notes.map((n, i) => {
        // Each note shows while the playhead crosses its third of the timeline.
        const from = 10 + i * (70 / Math.max(1, notes.length));
        const p = grow(frame, from, 8);
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", font: `400 40px ${SERIF}`, color: "white", opacity: i === notes.length - 1 ? p : p * (1 - grow(frame, from + 70 / notes.length, 6)) }}>
            {n}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
