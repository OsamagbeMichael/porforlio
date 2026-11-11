# Where to find taste

AI can build motion graphics, but it copies whatever you describe. Vague asks ("make it look better") get generic results.
Find a reference first, then describe exactly what you like about it: the colours, the type, how it moves, the timing.

| Site | Use it for |
| --- | --- |
| Prompt Motion | Motion graphics that come with the prompt used to make them |
| Eyecandy | Named video techniques (so you know what to call an effect) |
| React Bits | Animated text, backgrounds and UI pieces |
| MotionSites | Website designs with starter prompts |
| Savee | Visual moodboards when you don't know yet what you want |
| Motionographer | Launch films and motion design worth studying |
| Shadertoy | Live shader animations to use as backgrounds in videos or sites |
| ASCII Magic | Turns images or clips into ASCII art, for a Y2K look |
| Kitbitz | Free hand-drawn illustrations to build a little world from |
| Public Domain Image Archive | Curated historical images and art, free to reuse |
| Your Name in Landsat (NASA) | Spells words from satellite photos of landmarks |
| Khroma | Pick 50 colours you like; it learns your taste and makes palettes |
| Designspiration | Search real design work by up to 5 colours |
| Kosmik | An AI moodboard that tags saves by colour and style and finds related work |
| Pinterest | Search the style names in `docs/design-principles.md` (repo root) |

**Palette tip:** when a tool asks for colours, pick two that sit opposite on the colour wheel; the results are far more striking.

See also: `docs/design-principles.md` (hierarchy, colour, style names) and `docs/website-ideas.md` at the repo root.

## Turning a reference into a style here
1. Screenshot or save the reference into `research/` (never into a reel folder, never published).
2. Tell Claude: the reference, the **3 things** you like about it, and where in the reel it goes.
3. Claude builds it as a new file in `src/anim/` in its own words and colours (no copied logos, characters or exact frames), adds a sample to `ANIM_SAMPLES`, and shows you a still.
