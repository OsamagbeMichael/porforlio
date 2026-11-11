// node scripts/edit.test.ts
import assert from "node:assert/strict";
import { bigCuts, cut, pageWords } from "../src/edit.ts";

const w = (text: string, startInSeconds: number, endInSeconds: number) => ({ text, startInSeconds, endInSeconds });

const raw = [
  w(" This", 1.0, 1.2),
  w(" video", 1.25, 1.5),
  w(" um", 1.55, 1.8), // filler: cut even though the gaps are tiny
  w(" you're", 1.85, 2.0),
  w(" watching", 5.0, 5.4), // 3 s pause before this word
  w(" bad", 6.0, 6.3), // dropped as a retake
  w(" take.", 6.35, 6.6),
];
const { segments, words } = cut(raw, [[5.9, 6.7]]);

assert.equal(segments.length, 3);
assert.deepEqual(words.map((x) => x.text.trim()), ["This", "video", "you're", "watching"]);
// The 3 s silence is gone: the edit is the three segments back to back.
const total = segments.reduce((s, x) => s + x.end - x.start, 0);
assert.ok(total < 1.5, `edit should be short, got ${total}`);
for (const x of words) assert.ok(x.startInSeconds >= 0 && x.endInSeconds <= total + 1e-9);
// Segments sit on frame boundaries and never overlap.
for (const [i, s] of segments.entries()) {
  assert.ok(Math.abs(s.start * 30 - Math.round(s.start * 30)) < 1e-9);
  if (i) assert.ok(s.start >= segments[i - 1].end);
}

const cues = pageWords([w("one", 0, 0.2), w("two", 0.3, 0.5), w("three.", 0.6, 0.8), w("four", 9, 9.2)]);
assert.deepEqual(cues.map((c) => c.text), ["one two three.", "four"]);
assert.equal(cues[0].end, 0.8 + 2.0); // held MAX_HOLD over the long silence, not until 9 s
assert.deepEqual(pageWords([w("a.", 0, 1), w("b", 1, 2)]).map((c) => c.text), ["a.", "b"]);

// Only the cut that skipped 3 s of raw take is a big jump; it lands where segment 2 ends in the edit.
const s3 = [{ start: 0, end: 1 }, { start: 1.2, end: 2 }, { start: 5, end: 6 }];
assert.deepEqual(bigCuts(s3).map((t) => +t.toFixed(3)), [1.8]);

console.log("edit.test.ts: ok");
