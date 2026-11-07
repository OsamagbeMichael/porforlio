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
