# Reel editor

Claude Code edits vertical reels here. One reel = one folder: `public/reels/<slug>/`.
Data flows one way: `raw.mp4` -> `words.raw.json` -> `cut.json` -> render. Change the edit by changing JSON, not `src/Reel.tsx`.

| File | Who writes it | Times are in |
| --- | --- | --- |
| `raw.mp4` | the user (talking-head take) | raw take |
| `words.raw.json` | `npm run transcribe -- <slug>` | raw take |
| `drops.json` | Claude: `[[start, end], ...]` ranges to throw away | raw take |
| `cut.json` | `npm run cut -- <slug>`: kept segments and retimed words | segments: raw take, words: edit |
| `reel.json` | Claude: labels, b-roll, anim, music | edit |

## Workflow for a new reel

1. **Hook.** Read `docs/hooks.md`. Check the take's first sentence against the patterns. If it's weak, say which pattern fits better (the user re-records; we never fake a hook).
2. **Rough cut.** `npm run transcribe -- <slug>`, then read `words.raw.json`. When a line is said twice, keep the better take (usually the last, complete one) and put the other in `drops.json`. Then run `npm run cut -- <slug>`. Fillers and pauses over `MAX_GAP` are cut automatically (`src/edit.ts`).
3. **Subtitles.** These are automatic: `pageWords` in `src/edit.ts` builds cues of up to 3 words.
4. **Music.** Pick a track from `docs/music-library.md` by the video's feeling. If the user gives a link, run `npm run music -- <url>` and add the track to the library. Set `reel.json` `music` and keep the volume at 0.05–0.12 under speech.
5. **B-roll.** File everything first (rule below). Then add `broll` entries to `reel.json`, timed to the words in `cut.json` that mention the thing. Show each one for 2–4 s. For a website, screenshot it with the browser tool into the reel folder.
5b. **Animated graphics.** When the take names a number, a place-to-place trip, the parts of a thing, a headline or a saying, add an `anim` entry to `reel.json` instead of a still. Time it like b-roll (2–4 s, starting on the word). Styles live in `src/anim/`; sample props for each are in `ANIM_SAMPLES` (`src/anim/index.tsx`) and preview in Studio under "Styles":
   - `stat-chart`: one big number + a line chart (`value`, `prefix`, `suffix`, `label`, `points`, `callout`)
   - `paper-desk`: a headline printed on paper (`headline`, `kicker`, `points`)
   - `map-route`: a route drawn across a made-up city (`stops`, 2–4 names)
   - `teardown`: an exploded view with labeled layers (`title`, `parts`, top first)
   - `ink-wash`: a saying painted in ink (`text`, `sub`)
   Don't overlap an `anim` with `broll` or a label: they share the same spot on screen.
6. **Transitions.** Hard cuts, plus a punch-in zoom every `ZOOM_EVERY` cuts (`src/Reel.tsx`). Nothing to do per reel.
7. **Call to action.** The last line of the take. Add a label for it only if the user asks.

Add section `labels` ("1: The hook") when the reel is a numbered list. Show each one for about 2 s, starting on the word that names the section.

### Filing rule (one line)
Talking to camera -> `public/reels/<slug>/raw.mp4`. Reusable in another reel -> `public/b-roll/<category>/`. Only for this reel -> `public/reels/<slug>/`.
Name files `YYYY-MM-DD_<what>.<ext>`.

## Render and check

```bash
npx remotion render Reel out/<slug>.mp4 --props='{"slug":"<slug>"}'
npx remotion still Reel out/still.png --frame=<n> --props='{"slug":"<slug>"}'
```
Look at stills at the labels and b-roll times before calling a reel done. `npm test` checks the cut and caption logic.
To learn a creator's editing style: `npm run study -- <youtube-url>`, then distil `research/*.md` into `docs/editor-rules.md`.
