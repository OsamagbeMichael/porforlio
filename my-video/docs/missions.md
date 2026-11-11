# Rebuild missions

Easiest first. Do each one without looking at the old code (`git stash` or copy it somewhere first), then self-check.

## 1. Restyle the captions
**Spec:** in `src/Reel.tsx`, change the captions to yellow (`#ffe14d`) with a 12px black stroke, and move them up 100px.
**Check:** run `npx remotion still Reel out/m1.png --frame=210 --props='{"slug":"example"}'` and open `out/m1.png`.

## 2. Slide labels in from the left
**Spec:** labels ("2: Rough cut") start 300px left of their place, at 0 opacity. Over 6 frames they arrive at their place, fully visible. Use `useCurrentFrame` and `interpolate` with `extrapolateRight: "clamp"`. Leave the b-roll's `PopIn` alone.
**Check:** render stills at frames 102, 105 and 110. The label should be off to the left, halfway in, then in place.

## 3. Rebuild `pageWords` (`src/edit.ts`)
**Spec:** it takes `Word[]` (edit seconds) and returns `Cue[]`:
- Group the words in order. A group holds at most `MAX_WORDS` words, and it also ends after any word whose trimmed text ends in `.`, `?` or `!`.
- `text` is the group's words, each trimmed and joined with single spaces.
- `start` is the first word's `startInSeconds`.
- `end` is the smaller of (the next group's start − `GAP_LEAD`) and (this group's last word end + `MAX_HOLD`). The last group has no next group.

**Check:** `npm test` prints `edit.test.ts: ok`.

## 4. Rebuild the run-splitting loop in `cut` (`src/edit.ts`)
**Spec:** given the kept words (each with its original index `i`), start a new run when either:
- the previous kept word wasn't directly before this one (`prev.i !== k.i - 1`), because a word was removed in between, or
- the pause between them is longer than `MAX_GAP`.

**Check:** `npm test`.

## 5. Make the stat chart count up (your piece, nothing to stash)
**Spec:** `countUp(frame, value)` in `src/anim/StatChart.tsx` returns the number to show. On frame 0 it's 0. On frame 30 it reaches `value`, and it stays there afterwards. It slows down near the end (ease out). Hint: `grow` in `src/anim/util.ts` already gives you 0 → 1.
**Check:** `npx remotion still stat-chart out/m5.png --frame=10`: the number should be partway up (around 2.9 for the $4.1B sample). At `--frame=40` it reads `$4.1B`. Or scrub "Styles → stat-chart" in `npm run dev`.

## 6. Rebuild `drawOn` and `linePath` (`src/anim/util.ts`)
**Spec:**
- `drawOn(progress)` returns the three SVG props that make a path draw itself: at 0 nothing is visible, at 1 the whole path is visible. Use `pathLength: 1` so you never need to measure the path.
- `linePath(points, w, h)` maps numbers to `{ d, last }`: the first point at x=0, the last at x=w, the smallest value at y=h, the largest at y=0. `d` is an SVG path (`M x,y L x,y ...`).

**Check:** `npm run lint`, then render stills of `stat-chart` and `paper-desk` at frames 20 and 75. The lines should be half drawn, then fully drawn, matching `out/styles/*.png`.

## 7. Add a sixth style
**Spec:** make `src/anim/Quote.tsx`: a big quote in white on black, with the speaker's name below it in grey. The words fade in one after another (one word every 3 frames). Add its props type to `AnimSpec`, a `case` to `Anim`, and a sample to `ANIM_SAMPLES` in `src/anim/index.tsx`.
**Check:** it appears in Studio under "Styles", and `npm run lint` passes. TypeScript tells you if the `switch` misses your new style.

## 8. Rebuild the notification push-down (`src/anim/Notifications.tsx`)
**Spec:** each notification arrives on its own frame (`at[i]`). A card's `top` is `210 + pushed * (CARD_H + GAP)`, where `pushed` counts how many notifications arrived **after** it, but smoothly: each later arrival adds `grow(frame, at[j], 8)` (0 → 1), not a sudden 1. Write `pushed` with `slice` and `reduce`.
**Check:** `npx remotion still notifications out/m8.png --frame=22`: the first card is sliding down while the second fades in on top. At `--frame=75` the three cards are stacked newest first.

## 9. Rebuild `bigCuts` (`src/edit.ts`)
**Spec:** given the kept `segments` (raw-take seconds), return the **edit** time of every cut where more than `BIG_CUT` seconds of raw take was skipped. Walk the segments once, keep a running total of edit time `t` (add each segment's length), and push `t` when the gap to the next segment's `start` is bigger than `BIG_CUT`.
**Check:** `npm test`. The test expects `[1.8]` for segments `0–1`, `1.2–2`, `5–6`: the first gap (0.2 s) is small, the second (3 s) is big.

## 10. Add an item to the tier list on a schedule (`src/anim/TierList.tsx`)
**Spec:** items drop in one every 6 frames across **all** rows, best row first. Today a counter `n` outside the loop does it. Rewrite it without the outside counter: work out each item's position in the whole list from the row lengths before it (`tiers.slice(0, r)` and `reduce`).
**Check:** `npx remotion still tier-list out/m10.png --frame=20` shows only the first item; at `--frame=75` all items are in place. `npm run lint` passes.
