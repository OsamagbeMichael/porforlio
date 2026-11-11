import { AbsoluteFill, useCurrentFrame } from "remotion";
import { countUp } from "./StatChart";
import { H, SANS, W, drawOn, grow } from "./util";

type Place = { name: string; lat: number; lon: number };
export type GlobeArcsProps = {
  style: "globe-arcs";
  from: Place;
  to: Place[]; // arcs fly from `from` to each of these
  label?: string; // small heading, e.g. "Orders shipped"
  value?: number; // the big number, defaults to how many places `to` has
  unit?: string; // "countries"
};

const R = 250; // globe radius on screen
const CX = W / 2;
const CY = H / 2 + 70;
const LAT0 = 22; // camera tilt: we look at the globe from slightly north
const ORANGE = "#ff8a3d";
const rad = Math.PI / 180;

// Orthographic projection (the "seen from far away" globe). z > 0 means the point faces us.
const project = (lat: number, lon: number, lon0: number, lift = 1) => {
  const φ = lat * rad, λ = (lon - lon0) * rad, φ0 = LAT0 * rad;
  return {
    x: CX + lift * R * Math.cos(φ) * Math.sin(λ),
    y: CY - lift * R * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ)),
    z: Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ),
  };
};

// Points along the shortest route over the sphere (great circle) between two places.
const greatCircle = (a: Place, b: Place, n = 40) => {
  const v = (p: Place) => [Math.cos(p.lat * rad) * Math.cos(p.lon * rad), Math.cos(p.lat * rad) * Math.sin(p.lon * rad), Math.sin(p.lat * rad)];
  const [p, q] = [v(a), v(b)];
  const ω = Math.acos(Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2])) || 1e-6;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const [s1, s2] = [Math.sin((1 - t) * ω) / Math.sin(ω), Math.sin(t * ω) / Math.sin(ω)];
    const [x, y, z] = [0, 1, 2].map((k) => s1 * p[k] + s2 * q[k]);
    return { lat: Math.asin(z) / rad, lon: Math.atan2(y, x) / rad, t };
  });
};

// Join projected points into a path, lifting the pen wherever the line goes behind the globe.
const toPath = (pts: { x: number; y: number; z: number }[]) =>
  pts.map((p, i) => (p.z < 0 ? "" : `${i && pts[i - 1].z >= 0 ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)).join(" ");

export const GlobeArcs: React.FC<GlobeArcsProps> = ({ from, to, label, value = to.length, unit = "countries" }) => {
  const frame = useCurrentFrame();
  const lon0 = from.lon + 25 + frame * 0.12; // slow spin
  const grid: string[] = [];
  for (let lon = -180; lon < 180; lon += 30) grid.push(toPath(Array.from({ length: 37 }, (_, i) => project(-90 + i * 5, lon, lon0))));
  for (let lat = -60; lat <= 60; lat += 30) grid.push(toPath(Array.from({ length: 73 }, (_, i) => project(lat, -180 + i * 5, lon0))));

  const dot = (p: Place, show: number, big = false) => {
    const s = project(p.lat, p.lon, lon0);
    if (s.z < 0) return null;
    return (
      <g key={p.name} opacity={show}>
        <circle cx={s.x} cy={s.y} r={big ? 8 : 6} fill={big ? "white" : ORANGE} />
        <text x={s.x + 12} y={s.y + 6} fill="white" style={{ font: `600 20px ${SANS}` }}>{p.name}</text>
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 60%, #0f1d33, #050913 70%)", color: "white", fontFamily: SANS }}>
      <div style={{ position: "absolute", top: 30, width: "100%", textAlign: "center" }}>
        {label && <div style={{ fontSize: 18, letterSpacing: 5, color: "#8ea3c4", textTransform: "uppercase" }}>{label}</div>}
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>
          {Math.round(countUp(frame, value))} <span style={{ fontSize: 40, fontWeight: 500 }}>{unit}</span>
        </div>
      </div>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <circle cx={CX} cy={CY} r={R} fill="#0b1830" stroke="#2b4a7a" strokeWidth={2} />
        {grid.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#1d3558" strokeWidth={1.5} />
        ))}
        {to.map((p, k) => {
          // Lift the middle of each arc off the surface so it reads as a flight path.
          const arc = greatCircle(from, p).map((g) => project(g.lat, g.lon, lon0, 1 + 0.18 * Math.sin(Math.PI * g.t)));
          return <path key={p.name} d={toPath(arc)} fill="none" stroke={ORANGE} strokeWidth={3} strokeLinecap="round" {...drawOn(grow(frame, 8 + k * 5, 26))} />;
        })}
        {dot(from, 1, true)}
        {to.map((p, k) => dot(p, grow(frame, 28 + k * 5, 6)))}
      </svg>
    </AbsoluteFill>
  );
};
