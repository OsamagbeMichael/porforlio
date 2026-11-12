import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SANS, grow } from "./util";

export type DesktopCoreProps = {
  style: "desktop-core";
  title: string; // the window's title, e.g. "my-week.png"
  files: string[]; // folder names that appear on the desktop (2-5)
  src?: string; // a photo shown in the window
  time?: string; // menu-bar clock
};

const FOLDER = "#5aa9f0";

// A computer desktop as the stage: folders pop on, a window opens, the cursor clicks the last folder.
export const DesktopCore: React.FC<DesktopCoreProps> = ({ title, files, src, time = "9:41" }) => {
  const frame = useCurrentFrame();
  const win = grow(frame, 6, 14);
  // Cursor glides to the last folder, then "clicks" (folder darkens) at frame 60.
  const last = files.length - 1;
  const target = [800, 120 + last * 108];
  const cx = interpolate(frame, [30, 58], [470, target[0]], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(frame, [30, 58], [520, target[1] + 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clicked = frame >= 60;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #c9d6c3, #e9e1cf)", fontFamily: SANS }}>
      <div style={{ height: 30, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", font: `600 15px ${SANS}`, color: "#222" }}>
        <span>● File Edit View</span>
        <span>{time}</span>
      </div>
      {files.map((f, i) => {
        const p = grow(frame, 2 + i * 5, 8);
        return (
          <div key={f} style={{ position: "absolute", left: 760, top: 64 + i * 108, width: 120, textAlign: "center", scale: String(0.6 + 0.4 * p), opacity: p }}>
            <div style={{ width: 84, height: 64, margin: "0 auto", borderRadius: 8, background: clicked && i === last ? "#2f7fd0" : FOLDER, boxShadow: "inset 0 10px 0 rgba(255,255,255,0.35)" }} />
            <div style={{ font: `600 15px ${SANS}`, color: "#222", marginTop: 6, background: clicked && i === last ? "#2f7fd0" : "transparent", borderRadius: 4, padding: "1px 4px", display: "inline-block", ...(clicked && i === last ? { color: "white" } : {}) }}>
              {f}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 60, top: 80, width: 620, height: 500, background: "white", borderRadius: 12, boxShadow: "0 24px 60px rgba(0,0,0,0.25)", overflow: "hidden", scale: String(0.85 + 0.15 * win), opacity: win, transformOrigin: "30% 30%" }}>
        <div style={{ height: 36, background: "#f1f1f1", display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderBottom: "1px solid #ddd" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
          ))}
          <span style={{ marginLeft: 12, font: `600 15px ${SANS}`, color: "#444" }}>{title}</span>
        </div>
        {src ? <Img src={staticFile(src)} style={{ width: "100%", height: 464, objectFit: "cover" }} /> : <div style={{ height: 464, background: "#fafafa" }} />}
      </div>
      {/* Arrow cursor */}
      <svg width={28} height={40} viewBox="0 0 14 20" style={{ position: "absolute", left: cx, top: cy, scale: clicked && frame < 64 ? "0.85" : "1" }}>
        <path d="M1 1 L1 16 L5 12 L8 19 L10 18 L7 11 L13 11 Z" fill="black" stroke="white" strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
