# Editor rules

The numbers live in `src/edit.ts` and `src/Reel.tsx`. This file says why. Update both together.

| Rule | Value | Where |
| --- | --- | --- |
| Cut any pause between kept words longer than | 0.10 s | `MAX_GAP` |
| Keep breathing room around each run of words | 0.05 s | `PAD` |
| Filler words always cut | um, uh, erm, ah, hmm… | `FILLERS` |
| Words per caption | up to 3, break early at `.?!` | `MAX_WORDS` |
| Gap between consecutive captions | 0.02 s | `GAP_LEAD` |
| Longest a caption stays up over a silence | 2 s | `MAX_HOLD` |
| Punch-in zoom | every 3rd cut, 1.12× | `ZOOM_EVERY`, `ZOOM` |
| Music under speech | 0.05–0.12 volume | `reel.json` |
| B-roll / screenshot on screen | 2–4 s, card in the top half | `reel.json` |
| A cut that skips more raw take than this is a "big jump" | 1.0 s | `BIG_CUT` |
| Every big jump is covered by b-roll or an anim | start ~0.3 s before the cut | `npm run jumps -- <slug>` |
| Something cuts away (b-roll, anim, explainer) | at least every 3–5 s | `BARE_MAX`, `npm run jumps -- <slug>` |
| Effects and music | secondary: never louder or busier than the message; keep it raw | judgement |
| Different sound-effect files per reel | 3 at most | `reel.json` `sfx` |
| Reusing a sound effect: change it | `rate` 1.5 or 0.75 (speed), or `pitch` 1.2 / 0.85 | `reel.json` `sfx` |
| Loudness of the final file | -14 LUFS, peaks under -2 dB | `npm run master -- <slug>` |
| Plain screenshots as b-roll | `"look": "vintage"` (paper, RGB split, grain, vignette) | `reel.json` `broll` |
| Calm, talky reels | `"captionStyle": "serif"` | `reel.json` |
| Caption length by audience | teens: 1–3 words (`bold`); 20s–30s: 3–5; older: 5–10 (`serif`, up to 7) | `MAX_WORDS`, `SERIF_WORDS` |
| Old-TV / documentary b-roll | `"look": "crt"` | `reel.json` `broll` |
| Photo b-roll | slow push-in (automatic), `focus: [x%, y%]` on the eyes, a camera-shutter `sfx` on each cut | `reel.json` `broll` |
| Only one shot and no b-roll | `"zoomEvery": 2` (punch in every other cut) + `explainer` cards with `color` | `reel.json` |
| Card shadow | straight down, blur = 3 × distance (20 → 60) | `floatShadow` in `src/anim/util.ts` |
| Quoting a book or paper | `quote-doc`: highlight → dim the rest → ease in | `reel.json` `anim` |
| Word behind the speaker | 1 word, 1–3 s, top third, head overlapping the letters | `reel.json` `behind`, `npm run matte -- <slug>` |

Why: on a phone, dead air is where people swipe. Short captions can be read at a glance, and a zoom on a hard cut resets attention without a flashy transition.

Why the newer rules:
- **Jump cuts.** Cutting out a big chunk makes the head jump. Lay a b-roll shot over the cut and the speech carries across it; viewers never see the jump. Small cuts are fine (the punch-in zoom handles them).
- **Sound effects.** Hunting for a new effect every time wastes hours, and the same "whoosh" on every shot gets noticed. Keep 3 good ones and change speed or pitch so each use sounds different.
- **Loudness.** Don't trust your ears on laptop speakers: it can sound fine there and awful on a phone. `master` cleans the voice (cuts rumble under 80 Hz, lifts clarity around 3.5 kHz) and sets the standard loudness, then prints the measured values. A cheap mic or a phone is enough with this.
- **Vintage look.** A plain screenshot looks cheap; paper texture, a slight RGB split, film grain and a vignette make it look filmed. Simple effects, expensive feel.
- **Captions follow the audience.** Fast word-by-word pops suit short attention spans; older viewers feel rushed by them and prefer a calm line they can read. Decide from who watches (Instagram insights → age range), not from taste.
- **Photos as b-roll.** A still that doesn't move kills momentum, so every photo pushes in slowly. When cutting fast between photos, line the eyes up on the same spot (`focus`) so viewers don't have to hunt for the face; a shutter click on each cut feels like flipping through memories.
- **Shadows.** A flat, offset shadow looks cheap. Light from straight above, blur three times the distance; more distance = more "floating", which makes pop-in animations feel lighter.
- **J- and L-cuts.** In a two-person video, let the next voice start before the cut (J) or let the picture change while the last sentence finishes (L). Hard cuts exactly on the speaker change look choppy. For solo reels, the same idea is why b-roll starts ~0.3 s before the line it illustrates.
- **Text behind the speaker.** A word that the head passes in front of looks placed in the room, not pasted on the screen, so it reads as a produced edit. It only works when the head really overlaps the letters; with no overlap it's just a big title. Use it on the one word that matters, not as a caption style. The matte is the raw take with everything but the person made transparent, drawn on the same cuts and zoom as the take, so it never drifts.
- **Spend effort on fundamentals.** Claude handles cuts and captions well; the script, the hook and the rhythm are where your time pays off (`docs/hooks.md`).

<!-- Add rules learned with `npm run study` below, each with a number. -->
