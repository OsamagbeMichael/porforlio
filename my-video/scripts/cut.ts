// npm run cut -- <slug>
// words.raw.json (+ optional drops.json) -> cut.json: the segments to keep and the words retimed to the edit.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { cut } from "../src/edit.ts";

const slug = process.argv[2];
if (!slug) throw new Error("usage: npm run cut -- <slug>");
const dir = `public/reels/${slug}`;
const read = (f: string) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));

const raw = read("words.raw.json");
// drops.json: [[start, end], ...] in raw-take seconds; Claude writes it for retakes and flubs.
const drops = existsSync(`${dir}/drops.json`) ? read("drops.json") : [];
const result = cut(raw, drops);

writeFileSync(`${dir}/cut.json`, JSON.stringify(result, null, 1));
const before = raw.length ? raw[raw.length - 1].endInSeconds : 0;
const after = result.segments.reduce((s, x) => s + x.end - x.start, 0);
console.log(`${result.segments.length} segments, ${before.toFixed(1)}s -> ${after.toFixed(1)}s -> ${dir}/cut.json`);
