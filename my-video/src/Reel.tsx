import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Img,
  Sequence,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Anim, AnimSpec } from "./anim";
import { FPS, Segment, Word, pageWords } from "./edit";

// Everything below is in seconds of the finished edit, except segments (raw take).
type Timed = { start: number; end: number };
export type ReelData = {
  segments: Segment[]; // from cut.json
  words: Word[]; // from cut.json
  labels?: (Timed & { text: string })[]; // "1: The hook" section cards
  broll?: (Timed & { src: string })[]; // image/video path under public/
  anim?: (Timed & AnimSpec)[]; // animated graphics drawn in the b-roll card (src/anim/)
  music?: { src: string; volume?: number };
};
export type ReelProps = { slug: string; data?: ReelData };

const frames = (s: number) => Math.round(s * FPS);
const ZOOM_EVERY = 3; // punch in on every 3rd cut so hard cuts don't feel static
const ZOOM = 1.12;

export const calculateReelMetadata: CalculateMetadataFunction<ReelProps> = async ({ props }) => {
  const get = async (f: string) => {
    const res = await fetch(staticFile(`reels/${props.slug}/${f}`));
    return res.ok ? res.json() : null;
  };
  const cut = await get("cut.json");
  if (!cut) throw new Error(`public/reels/${props.slug}/cut.json missing - run: npm run cut -- ${props.slug}`);
  const data: ReelData = { ...cut, ...(await get("reel.json")) };
  const durationInFrames = data.segments.reduce((n, s) => n + frames(s.end) - frames(s.start), 0);
  return { durationInFrames: Math.max(1, durationInFrames), props: { ...props, data } };
};

const PopIn: React.FC<{ children: React.ReactNode; style: React.CSSProperties }> = ({ children, style }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 4], [0.85, 1], { extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", scale: String(scale), ...style }}>{children}</div>;
};

const isVideo = (src: string) => /\.(mp4|mov|webm|m4v)$/i.test(src);
// The b-roll card: 940 x 680 near the top, so the face and captions stay visible below it.
const CARD: React.CSSProperties = { top: 110, left: 70, right: 70, height: 680, borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" };

export const Reel: React.FC<ReelProps> = ({ slug, data }) => {
  if (!data) return null;
  const at = (t: Timed) => ({ from: frames(t.start), durationInFrames: Math.max(1, frames(t.end) - frames(t.start)) });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Series>
        {data.segments.map((s, i) => (
          <Series.Sequence key={i} durationInFrames={frames(s.end) - frames(s.start)} name={`Cut ${i + 1}`}>
            <AbsoluteFill style={{ scale: i % ZOOM_EVERY === ZOOM_EVERY - 1 ? String(ZOOM) : "1", transformOrigin: "50% 35%" }}>
              <Video
                src={staticFile(`reels/${slug}/raw.mp4`)}
                trimBefore={frames(s.start)}
                trimAfter={frames(s.end)}
                objectFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>

      {data.broll?.map((b, i) => (
        <Sequence key={`b${i}`} {...at(b)} name={`B-roll ${b.src}`}>
          <PopIn style={CARD}>
            {isVideo(b.src) ? (
              <Video src={staticFile(b.src)} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
            ) : (
              <Img src={staticFile(b.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </PopIn>
        </Sequence>
      ))}

      {data.anim?.map((a, i) => (
        <Sequence key={`a${i}`} {...at(a)} name={`Anim ${a.style}`}>
          <PopIn style={CARD}>
            <Anim {...a} />
          </PopIn>
        </Sequence>
      ))}

      {data.labels?.map((l, i) => (
        <Sequence key={`l${i}`} {...at(l)} name={`Label ${l.text}`}>
          <PopIn style={{ top: 330, width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ background: "#111", color: "white", font: "800 64px 'Helvetica Neue', Arial, sans-serif", padding: "14px 34px", borderRadius: 18, rotate: "-2deg" }}>
              {l.text}
            </div>
          </PopIn>
        </Sequence>
      ))}

      {pageWords(data.words).map((c, i) => (
        <Sequence key={`c${i}`} {...at(c)} name={`Caption ${c.text}`}>
          <div
            style={{
              position: "absolute",
              top: 1250,
              width: "100%",
              padding: "0 60px",
              textAlign: "center",
              color: "white",
              font: "900 76px 'Helvetica Neue', Arial, sans-serif",
              textTransform: "uppercase",
              WebkitTextStroke: "10px black",
              paintOrder: "stroke fill",
            }}
          >
            {c.text}
          </div>
        </Sequence>
      ))}

      {data.music && <Audio src={staticFile(data.music.src)} volume={data.music.volume ?? 0.12} loop />}
    </AbsoluteFill>
  );
};
