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

Why: on a phone, dead air is where people swipe. Short captions can be read at a glance, and a zoom on a hard cut resets attention without a flashy transition.

<!-- Add rules learned with `npm run study` below, each with a number. -->
