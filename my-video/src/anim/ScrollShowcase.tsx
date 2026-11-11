import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SANS, grow } from "./util";

export type ScrollShowcaseProps = {
  style: "scroll-showcase";
  src: string; // a full-page (tall) screenshot under public/
  title?: string; // e.g. "Client paid $3,350"
  url?: string; // shown in the address bar
};

export const ScrollShowcase: React.FC<ScrollShowcaseProps> = ({ src, title, url = "yoursite.com" }) => {
  const frame = useCurrentFrame();
  // Scroll in three moves with a pause after each, like someone reading as they go.
  const scroll = interpolate(frame, [12, 24, 34, 46, 56, 70], [0, 0.33, 0.33, 0.66, 0.66, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const enter = grow(frame, 0, 12);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #1a2233, #05070c 70%)", perspective: 1600, fontFamily: SANS, alignItems: "center" }}>
      {title && <div style={{ marginTop: 34, color: "white", fontSize: 38, fontWeight: 700, opacity: enter }}>{title}</div>}
      <div
        style={{
          marginTop: 26,
          width: 820,
          height: 520,
          borderRadius: 16,
          overflow: "hidden",
          background: "#0d1017",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
          transform: `rotateX(${8 - enter * 4}deg) translateY(${(1 - enter) * 60}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: "#161a22" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
          ))}
          <span style={{ marginLeft: 16, flex: 1, maxWidth: 360, background: "#0d1017", color: "#8b93a3", fontSize: 15, padding: "5px 14px", borderRadius: 8 }}>{url}</span>
        </div>
        {/* object-fit: cover crops the tall page to the window; moving object-position from top to bottom scrolls it. */}
        <Img src={staticFile(src)} style={{ flex: 1, minHeight: 0, width: "100%", objectFit: "cover", objectPosition: `50% ${scroll * 100}%` }} />
      </div>
    </AbsoluteFill>
  );
};
