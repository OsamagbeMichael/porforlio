// npm run jumps -- <slug>
// Lists the big jump cuts in the edit that no b-roll or anim covers yet, with the words around each.
import { existsSync, readFileSync } from "node:fs";
import { bigCuts } from "../src/edit.ts";
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
