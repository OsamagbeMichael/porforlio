// npm run jumps -- <slug>
// Lists big jump cuts that no b-roll or anim covers yet, and stretches over 5 s with nothing cutting away.
import { existsSync, readFileSync } from "node:fs";
import { BARE_MAX, bareStretches, bigCuts } from "../src/edit.ts";
import type { Word } from "../src/edit.ts";

const slug = process.argv[2];
if (!slug) throw new Error("usage: npm run jumps -- <slug>");
const dir = `public/reels/${slug}`;
const read = (f: string) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));

const { segments, words } = read("cut.json") as { segments: { start: number; end: number }[]; words: Word[] };
const reel = existsSync(`${dir}/reel.json`) ? read("reel.json") : {};
const covers: { start: number; end: number }[] = [...(reel.broll ?? []), ...(reel.anim ?? [])];

const bare = bigCuts(segments).filter((t) => !covers.some((c) => c.start <= t && c.end >= t));
// "...last words | first words..." with the bar where the cut is.
const around = (t: number) => {
  const near = words.filter((w) => w.endInSeconds > t - 1.5 && w.startInSeconds < t + 1.5);
  const before = near.filter((w) => w.startInSeconds < t).map((w) => w.text.trim());
  const after = near.filter((w) => w.startInSeconds >= t).map((w) => w.text.trim());
  return `${before.join(" ")} | ${after.join(" ")}`;
};

for (const t of bare) console.log(`${t.toFixed(2)}s  ${around(t)}`);
console.log(bare.length ? `${bare.length} uncovered jump cut(s): put b-roll or an anim over each (start ~0.3 s before).` : "No uncovered jump cuts.");

const total = segments.reduce((n, s) => n + s.end - s.start, 0);
const stretches = bareStretches(total, covers);
for (const [a, b] of stretches) console.log(`${a.toFixed(1)}-${b.toFixed(1)}s  nothing on screen for ${(b - a).toFixed(1)} s`);
console.log(stretches.length ? `${stretches.length} stretch(es) over ${BARE_MAX} s: add b-roll, an anim or a "b-roll space" explainer.` : `Something cuts away at least every ${BARE_MAX} s.`);
