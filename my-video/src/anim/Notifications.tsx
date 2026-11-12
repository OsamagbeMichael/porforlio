import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SANS, grow } from "./util";

export type NotificationsProps = {
  style: "notifications";
  app: string; // e.g. "Shopify"
  items: { title: string; body: string }[]; // oldest first; each one lands on top of the last
  time?: string; // "9:41"
  date?: string; // "Friday, 14 March"
  color?: string; // app icon colour
};

const CARD_H = 112;
const GAP = 14;

export const Notifications: React.FC<NotificationsProps> = ({ app, items, time = "9:41", date = "Friday, 14 March", color = "#34c759" }) => {
  const frame = useCurrentFrame();
  const at = items.map((_, i) => 10 + i * 9); // the frame each notification arrives

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 30% 20%, #2e5d7d, #0b1a2c 60%, #04070d)", color: "white", fontFamily: SANS, alignItems: "center" }}>
      <div style={{ marginTop: 28, fontSize: 24, fontWeight: 600, opacity: 0.85 }}>{date}</div>
      <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>{time}</div>
      {items.map((n, i) => {
        const p = grow(frame, at[i], 8);
        // Every notification that arrived later pushes this one down by one slot.
        const pushed = at.slice(i + 1).reduce((s, f) => s + grow(frame, f, 8), 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 210 + pushed * (CARD_H + GAP),
              width: 680,
              height: CARD_H,
              boxSizing: "border-box",
              opacity: p,
              translate: `0 ${(1 - p) * -40}px`,
              scale: String(0.94 + 0.06 * p),
              background: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(20px)",
              borderRadius: 26,
              padding: "16px 20px",
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 13, background: color, flexShrink: 0, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 26 }}>{app[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, opacity: 0.75, textTransform: "uppercase", letterSpacing: 1 }}>
                <span>{app}</span>
                <span>now</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{n.title}</div>
              <div style={{ fontSize: 21, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.body}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
