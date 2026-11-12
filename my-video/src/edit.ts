// Pure edit logic shared by scripts/cut.ts (Node) and the Reel composition.

export type Word = { text: string; startInSeconds: number; endInSeconds: number };
export type Segment = { start: number; end: number }; // seconds in the raw take
export type Cue = { text: string; start: number; end: number }; // seconds in the edit

export const FPS = 30;

// Rough-cut knobs. docs/editor-rules.md decides these; change them here.
export const MAX_GAP = 0.1; // a pause longer than this between kept words gets cut
export const PAD = 0.05; // breathing room kept around each run of words
export const FILLERS = new Set(["um", "uh", "uhm", "erm", "ah", "hmm", "mm"]);

// Caption knobs (same meaning as the reel's captions.py).
export const MAX_WORDS = 3; // words per cue before we look for a break
export const SERIF_WORDS = 7; // calm serif captions read as short lines, not pops (older audiences)
export const GAP_LEAD = 0.02; // a cue ends this long before the next one starts
export const MAX_HOLD = 2.0; // never let a cue hold longer than this over a silence

// A cut that removes more raw take than this is a visible jump (a retake, a long ramble).
export const BIG_CUT = 1.0;

const snap = (s: number) => Math.round(s * FPS) / FPS;
const bare = (w: string) => w.trim().toLowerCase().replace(/[^a-z']/g, "");

// drops: [start, end] ranges of the raw take to throw away (retakes, flubs).
export const cut = (words: Word[], drops: [number, number][] = []) => {
  const kept = words
    .map((w, i) => ({ w, i }))
    .filter(
      ({ w }) =>
        !FILLERS.has(bare(w.text)) &&
        !drops.some(([a, b]) => w.startInSeconds < b && w.endInSeconds > a),
    );

  const runs: (typeof kept)[] = [];
  for (const k of kept) {
    const run = runs[runs.length - 1];
    const prev = run?.[run.length - 1];
    // Split on long pauses and wherever a word was removed, so it never plays.
    if (prev && prev.i === k.i - 1 && k.w.startInSeconds - prev.w.endInSeconds <= MAX_GAP) {
      run.push(k);
    } else {
      runs.push([k]);
    }
  }

  const segments: Segment[] = [];
  const out: Word[] = [];
  let offset = 0;
  for (const run of runs) {
    const prevEnd = segments[segments.length - 1]?.end ?? 0;
    // Frame-snapped so the composition's frame math adds up to the same timeline.
    const start = Math.max(prevEnd, snap(Math.max(0, run[0].w.startInSeconds - PAD)));
    const end = snap(run[run.length - 1].w.endInSeconds + PAD);
    if (end <= start) continue;
    segments.push({ start, end });
    for (const { w } of run) {
      out.push({
        text: w.text,
        startInSeconds: offset + Math.max(0, w.startInSeconds - start),
        endInSeconds: offset + Math.min(end, w.endInSeconds) - start,
      });
    }
    offset += end - start;
  }
  return { segments, words: out };
};

// Edit-time seconds of each big jump cut, so b-roll can be laid over it (docs/editor-rules.md).
export const bigCuts = (segments: Segment[]) => {
  const out: number[] = [];
  let t = 0;
  segments.forEach((s, i) => {
    t += s.end - s.start;
    const next = segments[i + 1];
    if (next && next.start - s.end > BIG_CUT) out.push(t);
  });
  return out;
};

export const pageWords = (words: Word[], maxWords = MAX_WORDS): Cue[] => {
  const groups: Word[][] = [];
  for (const w of words) {
    const g = groups[groups.length - 1];
    if (g && g.length < maxWords && !/[.?!]$/.test(g[g.length - 1].text.trim())) g.push(w);
    else groups.push([w]);
  }
  return groups.map((g, i) => {
    const next = groups[i + 1]?.[0].startInSeconds ?? Infinity;
    const last = g[g.length - 1].endInSeconds;
    return {
      text: g.map((w) => w.text.trim()).join(" "),
      start: g[0].startInSeconds,
      end: Math.min(next - GAP_LEAD, last + MAX_HOLD),
    };
  });
};
