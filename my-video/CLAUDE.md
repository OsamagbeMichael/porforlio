# Reel editor

Claude Code edits vertical reels here. One reel = one folder: `public/reels/<slug>/`.
Data flows one way: `raw.mp4` -> `words.raw.json` -> `cut.json` -> render. Change the edit by changing JSON, not `src/Reel.tsx`.

| File | Who writes it | Times are in |
| --- | --- | --- |
| `raw.mp4` | the user (talking-head take) | raw take |
| `words.raw.json` | `npm run transcribe -- <slug>` | raw take |
| `drops.json` | Claude: `[[start, end], ...]` ranges to throw away | raw take |
| `cut.json` | `npm run cut -- <slug>`: kept segments and retimed words | segments: raw take, words: edit |
| `reel.json` | Claude: labels, b-roll (`look`, `focus`), anim, music, sfx, captionStyle, zoomEvery | edit |

## Workflow for a new reel

The user stays in control: stop and wait for an OK at every **[check]**. Small steps are easy to change; a finished edit isn't.

0. **Style.** Read `docs/signature-style.md` and `docs/learnings.md` first. If the style file isn't written yet, offer to build it from 3–4 of the user's own videos (instructions in the file).
1. **Hook.** Read `docs/hooks.md` (patterns, rhythm, loop endings) and `docs/formats.md` (which format this take is). Check the take's first sentence against the patterns. If it's weak, say which pattern fits better (the user re-records; we never fake a hook).
2. **Rough cut.** `npm run transcribe -- <slug>`, then read `words.raw.json`. When a line is said twice, keep the better take (usually the last, complete one) and put the other in `drops.json`. Then run `npm run cut -- <slug>`. Fillers and pauses over `MAX_GAP` are cut automatically (`src/edit.ts`). **[check]** Show what was dropped and the new length.
2b. **Direction and storyboard.** Ask for the creative direction (feeling, audience, the one thing to remember). Then write `public/reels/<slug>/storyboard.md`: one line per beat with its time, the words said, and the label / b-roll / anim / music planned for it. **[check]** Change the storyboard, not `reel.json`, until it's approved.
3. **Subtitles.** These are automatic: `pageWords` in `src/edit.ts` builds cues of up to 3 words.
4. **Music.** Pick a track from `docs/music-library.md` by the video's feeling. If the user gives a link, run `npm run music -- <url>` and add the track to the library. Set `reel.json` `music` and keep the volume at 0.05–0.12 under speech.
5. **B-roll.** File everything first (rule below). Then add `broll` entries to `reel.json`, timed to the words in `cut.json` that mention the thing. Show each one for 2–4 s. For a website, screenshot it with the browser tool into the reel folder.
5b. **Animated graphics.** When the take names a number, a place-to-place trip, the parts of a thing, a headline or a saying, add an `anim` entry to `reel.json` instead of a still. Time it like b-roll (2–4 s, starting on the word). Styles live in `src/anim/`; sample props for each are in `ANIM_SAMPLES` (`src/anim/index.tsx`) and preview in Studio under "Styles":
   | Say this in the take | Style | Props |
   | --- | --- | --- |
   | a number that grew | `stat-chart` | `value`, `prefix`, `suffix`, `label`, `points`, `callout` |
   | a study / news headline | `paper-desk` | `headline`, `kicker`, `points` |
   | going from A to B | `map-route` | `stops` (2–4) |
   | what's inside something | `teardown` | `title`, `parts` (top first) |
   | a saying or quote | `ink-wash` | `text`, `sub` |
   | a punchy sentence | `kinetic-type` | `text`, `color` |
   | a teaser / "stay tuned" | `retro-crt` | `text`, `sub` |
   | a bold 1–3 word title | `risograph` | `lines` |
   | a structured title, chapters | `swiss-grid` | `lines`, `tags` |
   | how something is built / sized | `blueprint` | `title`, `width`, `height` |
   | "in sync", rhythm, a signal | `oscilloscope` | `text` |
   | reach across countries | `globe-arcs` | `from`, `to` (`{name, lat, lon}`), `label`, `value`, `unit` |
   | a makeover | `before-after` | `before`, `after` (image paths), `title` |
   | a process in steps | `iso-flow` | `title`, `steps` (2–5) |
   | sales or messages coming in | `notifications` | `app`, `items` (`{title, body}`), `time`, `date` |
   | a streak / challenge day | `day-counter` | `day`, `kicker`, `month` |
   | launching a site or app | `laptop-reveal` | `src` (screenshot path), `caption` |
   | showing off a website you built | `scroll-showcase` | `src` (full-page screenshot), `title`, `url` |
   | "step 1, step 2…" in a how-to | `step-card` | `step`, `label`, `text`, `accent` |
   | a numbered tip in a list | `sketch-note` | `title`, `number`, `src` (optional drawing) |
   | a product or person as the hero | `text-behind` | `text`, `subject` (cut-out PNG), `bg`, `color` |
   | one strong word over footage | `footage-text` | `text`, `src` (image or clip), `color`, `sub` |
   | ranking things best to worst | `tier-list` | `title`, `tiers` (`{label?, items}`, best first) |
   | files, apps, "my computer" | `desktop-core` | `title`, `files`, `src`, `time` |
   | a personal week / diary feel | `scrapbook` | `title`, `notes`, `src` |
   | several numbers at once | `bento` | `cells` (`{value?, label}`, big one first), `accent` |
   | a calm aside with a diagram | `explainer` | `text`, `src`, `tag`, `paper`, `color` |
   | quoting a book, paper or article | `quote-doc` | `text`, `highlight` (sentence in `text`), `source`, `heading` |
   | "here's how I edited this" | `edit-timeline` | `title`, `notes` (1–3 short lines) |

   Don't overlap an `anim` with `broll` or a label: they share the same spot on screen. To add a style from a reference, follow `docs/inspiration.md`.
   For `text-behind`, cut the subject out on this Mac first: `npm run cutout -- <photo> public/b-roll/<category>/<name>.png`.
5c. **Jump cuts and sound.** Run `npm run jumps -- <slug>` and cover every jump it lists with b-roll or an anim. Add `sfx` entries only where something happens on screen; at most 3 different files, varied with `rate`/`pitch` (`docs/editor-rules.md`).
6. **Transitions.** Hard cuts, plus a punch-in zoom every `ZOOM_EVERY` cuts (`src/Reel.tsx`). Nothing to do per reel.
7. **Call to action.** The last line of the take. Add a label for it only if the user asks.
8. **Opening first.** Render only the first ~12 s (`--frames=0-359`) and stills of its graphics. **[check]** Only after the opening is approved, render the whole reel.
9. **Final review.** The user gives fixes by timestamp ("at 0:06, move the caption up"). Fix, re-render, repeat until they say it's approved. Then `npm run master -- <slug>` and hand over `out/<slug>-master.mp4` (-14 LUFS; check the printed values).
9b. **Keywords and caption.** Pick 3–5 niche keywords (ask Claude for them from a screenshot of the profile grid). Check the main one is **said** in the first 3 s, **shown** in an on-screen title (label or anim), and in the caption's first line; suggest it for the bio if it's missing. Keywords stay visible: no hidden text layers. Write the caption with the `instagram-agent:ig-caption` skill.
10. **Learnings.** On approval, add one dated line to `docs/learnings.md`: what the user changed and what that says about their taste. If it's a lasting rule, propose the edit to `docs/signature-style.md`.

### After posting (48 hours later)
Ask the user for the post's numbers: views, average watch time, and the retention curve (a screenshot is fine; it goes in the reel folder). Write them to `public/reels/<slug>/stats.md` with where viewers dropped off, matched to the words in `cut.json` at that time. Add one line to `docs/learnings.md` and suggest what the next reel or a re-cut should change (a different hook, a shorter middle). Claude doesn't log into TikTok or Instagram itself; the user reads the numbers from the app.

Add section `labels` ("1: The hook") when the reel is a numbered list. Show each one for about 2 s, starting on the word that names the section.

### Filing rule (one line)
Talking to camera -> `public/reels/<slug>/raw.mp4`. Reusable in another reel -> `public/b-roll/<category>/`. Only for this reel -> `public/reels/<slug>/`.
Name files `YYYY-MM-DD_<what>.<ext>`.

## Render and check

```bash
npx remotion render Reel out/<slug>.mp4 --props='{"slug":"<slug>"}'
npx remotion still Reel out/still.png --frame=<n> --props='{"slug":"<slug>"}'
npx remotion render Reel out/<slug>-opening.mp4 --frames=0-359 --props='{"slug":"<slug>"}'
npm run jumps -- <slug>    # big jump cuts not yet covered by b-roll
npm run master -- <slug>   # out/<slug>.mp4 -> out/<slug>-master.mp4 at -14 LUFS
npm run cutout -- <photo> <out.png>   # subject cut-out for text-behind (Apple Vision, offline)
```
Look at stills at the labels and b-roll times before calling a reel done. `npm test` checks the cut and caption logic.
For AI-generated b-roll (walkthroughs, product shots), follow `docs/ai-broll.md`.
Editing for a client instead of the user's own page: read `docs/career.md` (audience, b-roll space, captions by age).
To learn a creator's editing style: `npm run study -- <youtube-url>`, then distil `research/*.md` into `docs/editor-rules.md`.
