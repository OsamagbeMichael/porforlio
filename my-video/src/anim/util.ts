import { Easing, interpolate } from "remotion";

// Every style is drawn for the b-roll card in Reel.tsx: 1080 - 2*70 wide, 680 tall.
export const W = 940;
export const H = 680;
export const SANS = "'Helvetica Neue', Arial, sans-serif";
export const SERIF = "Georgia, 'Times New Roman', serif";

// 0 -> 1 over `dur` frames starting at frame `from`, easing out. Stays at 0 before and 1 after.
export const grow = (frame: number, from: number, dur: number) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

// Numbers -> an SVG path that fills a w x h box (bigger numbers sit higher), plus the last point.
export const linePath = (points: number[], w: number, h: number) => {
  const min = Math.min(...points);
  const range = Math.max(...points) - min || 1;
  const xy = points.map((p, i) => [(i / Math.max(1, points.length - 1)) * w, h - ((p - min) / range) * h]);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return { d, last: xy[xy.length - 1] };
};

// Isometric projection: a point on a flat (x, y) floor, z metres up -> screen position around (cx, cy).
export const iso = (x: number, y: number, z: number, cx: number, cy: number): [number, number] => [
  cx + (x - y) * 0.866,
  cy + (x + y) * 0.5 - z,
];

// The point `t` (0-1) of the way along a polyline, measured by length, not by corner count.
export const along = (pts: number[][], t: number) => {
  const legs = pts.slice(1).map(([x, y], i) => Math.hypot(x - pts[i][0], y - pts[i][1]));
  let left = t * legs.reduce((a, b) => a + b, 0);
  for (let i = 0; i < legs.length; i++) {
    if (left <= legs[i] || i === legs.length - 1) {
      const f = legs[i] ? Math.min(1, left / legs[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    left -= legs[i];
  }
  return pts[0];
};

// Draw-on trick: with pathLength={1} every path is 1 unit long, so the dash offset is just 1 - progress.
export const drawOn = (progress: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - progress });

// A shadow straight below (light from above) with blur = 3 x distance: the further it falls, the more it floats.
export const floatShadow = (distance: number, opacity = 0.35) => `0 ${distance}px ${distance * 3}px rgba(0,0,0,${opacity})`;
