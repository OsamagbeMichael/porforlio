import { AbsoluteFill, random, useCurrentFrame } from "remotion";

// "Old camera" treatment for a plain screenshot or clip: paper texture, RGB split, film grain,
// a slight flicker and a vignette. Used by b-roll entries with `"look": "vintage"`.
export const Vintage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const flicker = 0.94 + random(`flicker-${frame}`) * 0.06;

  return (
    <AbsoluteFill style={{ background: "#efe9dc" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          {/* Shift red left and blue right, keep green, then add them back together. */}
          <filter id="vintage-rgb" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx={-4} result="r2" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="b" dx={4} result="b2" />
            <feBlend in="r2" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b2" mode="screen" />
          </filter>
          <filter id="vintage-paper">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={4} seed={7} />
            <feDiffuseLighting lightingColor="#fff" surfaceScale={1.6}>
              <feDistantLight azimuth={45} elevation={60} />
            </feDiffuseLighting>
          </filter>
          {/* A new seed every frame so the grain moves like film. */}
          <filter id="vintage-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={frame % 100} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: "url(#vintage-rgb) sepia(0.25) contrast(1.06)", opacity: flicker }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ filter: "url(#vintage-paper)", mixBlendMode: "multiply", opacity: 0.35 }} />
      <AbsoluteFill style={{ filter: "url(#vintage-grain)", mixBlendMode: "overlay", opacity: 0.35 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(20,12,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};
