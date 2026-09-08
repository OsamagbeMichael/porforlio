// Visual-only replica of a Poolsuite-style TV window: flickering static via
// an animated SVG feTurbulence filter (index.html), and a decorative
// play/stop toggle. Nothing here actually plays media — see
// docs/decisions.md if that ever changes.

export function initPoolsuite(): void {
  initStatic();
  initPlayToggle();
}

function initStatic(): void {
  const turbulence = document.getElementById("tv-noise-turb");
  if (!turbulence) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  setInterval(() => {
    turbulence.setAttribute("seed", String(Math.floor(Math.random() * 100)));
  }, 90);
}

function initPlayToggle(): void {
  const btn = document.getElementById("tv-play");
  const status = document.getElementById("tv-status");
  if (!btn || !status) return;

  let playing = false;
  btn.addEventListener("click", () => {
    playing = !playing;
    status.textContent = playing ? "▸ Playing" : "▸ Stopped";
    btn.textContent = playing ? "❚❚" : "▶";
  });
}
