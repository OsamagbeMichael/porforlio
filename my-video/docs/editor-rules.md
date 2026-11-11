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
| Different sound-effect files per reel | 3 at most | `reel.json` `sfx` |
| Reusing a sound effect: change it | `rate` 1.5 or 0.75 (speed), or `pitch` 1.2 / 0.85 | `reel.json` `sfx` |
| Loudness of the final file | -14 LUFS, peaks under -2 dB | `npm run master -- <slug>` |
| Plain screenshots as b-roll | `"look": "vintage"` (paper, RGB split, grain, vignette) | `reel.json` `broll` |
| Calm, talky reels | `"captionStyle": "serif"` | `reel.json` |

Why: on a phone, dead air is where people swipe. Short captions can be read at a glance, and a zoom on a hard cut resets attention without a flashy transition.

Why the newer rules:
- **Jump cuts.** Cutting out a big chunk makes the head jump. Lay a b-roll shot over the cut and the speech carries across it; viewers never see the jump. Small cuts are fine (the punch-in zoom handles them).
- **Sound effects.** Hunting for a new effect every time wastes hours, and the same "whoosh" on every shot gets noticed. Keep 3 good ones and change speed or pitch so each use sounds different.
- **Loudness.** Don't trust your ears on laptop speakers: it can sound fine there and awful on a phone. `master` cleans the voice (cuts rumble under 80 Hz, lifts clarity around 3.5 kHz) and sets the standard loudness, then prints the measured values. A cheap mic or a phone is enough with this.
- **Vintage look.** A plain screenshot looks cheap; paper texture, a slight RGB split, film grain and a vignette make it look filmed. Simple effects, expensive feel.
- **Spend effort on fundamentals.** Claude handles cuts and captions well; the script, the hook and the rhythm are where your time pays off (`docs/hooks.md`).

<!-- Add rules learned with `npm run study` below, each with a number. -->
