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

// Draw-on trick: with pathLength={1} every path is 1 unit long, so the dash offset is just 1 - progress.
export const drawOn = (progress: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - progress });
