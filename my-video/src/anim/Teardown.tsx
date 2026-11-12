import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { H, SANS, W, grow } from "./util";

export type TeardownProps = {
  style: "teardown";
  title: string;
  parts: string[]; // top layer first, 2-6 of them
};

const COLORS = ["#4cc9f0", "#7b8cff", "#b388ff", "#ff7ab6", "#ffb347", "#7ee081"];
const SIDE = 260; // each layer is a SIDE x SIDE square laid flat
const CX = W * 0.36; // stack centre
const SIN60 = Math.sin(Math.PI / 3);

export const Teardown: React.FC<TeardownProps> = ({ title, parts }) => {
  const frame = useCurrentFrame();
  const n = parts.length;
  // Layers start pressed together, then spread apart (the "explode").
  const gap = interpolate(grow(frame, 6, 26), [0, 1], [14, Math.min(110, 380 / Math.max(1, n - 1))]);
  const stackH = (n - 1) * gap * SIN60;
  const bottomY = H / 2 + 40 + stackH / 2;
  // rotateX(60deg) turns "lift by z" into "move up the screen by z * sin(60deg)", so each label can line up with its layer.
  const layerY = (i: number) => bottomY - (n - 1 - i) * gap * SIN60;
  const iso = (z: number) => `rotateX(60deg) rotateZ(-45deg) translateZ(${z}px)`;

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 35% 55%, #18202c, #0b0e13 70%)", color: "white", fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 50, top: 40 }}>
        <div style={{ fontSize: 20, letterSpacing: 4, color: "#7d8794" }}>EXPLODED VIEW</div>
        <div style={{ fontSize: 40, fontWeight: 800 }}>{title}</div>
      </div>

      {/* Bottom layer first: without preserve-3d, later elements paint on top. */}
      {parts.map((_, i) => n - 1 - i).map((i) => {
        const c = COLORS[i % COLORS.length];
        const box: React.CSSProperties = { position: "absolute", left: CX - SIDE / 2, top: layerY(i) - SIDE / 2, width: SIDE, height: SIDE, borderRadius: 18 };
        return (
          <div key={i}>
            <div style={{ ...box, transform: iso(-12), background: `${c}55` }} />
            <div
              style={{
                ...box,
                transform: iso(0),
                background: `repeating-linear-gradient(0deg, ${c}22 0 2px, transparent 2px 26px), ${c}33`,
                border: `3px solid ${c}`,
                boxShadow: `0 0 40px ${c}66`,
              }}
            />
          </div>
        );
      })}

      {parts.map((name, i) => {
        const show = grow(frame, 24 + i * 4, 8);
        const x0 = CX + SIDE * Math.SQRT1_2 + 14; // right-hand corner of the layer
        return (
          <div key={name} style={{ position: "absolute", left: x0, top: layerY(i), opacity: show, display: "flex", alignItems: "center", translate: "0 -50%" }}>
            <div style={{ width: 110 * show, height: 2, background: COLORS[i % COLORS.length] }} />
            <div style={{ fontSize: 28, fontWeight: 700, marginLeft: 14, whiteSpace: "nowrap" }}>{name}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
