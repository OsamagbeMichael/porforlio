# Design principles

For anything visual in this repo: the website (`apps/web`), reel graphics (`my-video/src/anim`), thumbnails and carousels.
Use it as a checklist before calling a design done.

## 1. Visual hierarchy: decide what's read first
1. **Size for emphasis.** The most important thing is the biggest. Secondary things are clearly smaller, not slightly.
2. **Contrast by colour.** One bold colour for the key element, quiet tones for the rest. In a grid of grey squares, the one red square is all you see.
3. **Three type levels.** Heading, subheading, body. If you need a fourth, the content needs splitting.
4. **Font choices set the tone.** Serif for classic or editorial, sans-serif for clean and readable, script only as an accent. Pair one of each at most.
5. **Spacing groups things.** Things that belong together sit close; white space between groups. Crowding is the fastest way to look cheap.
6. **Composition leads the eye.** Rule of thirds, golden section, diagonals, radial lines or a Z-pattern. Place the subject off-centre on purpose.

## 2. Colour: five rules
1. **Colours carry a mood; pick it on purpose.** Red: energy, urgency. Blue: trust, calm. Yellow: optimism. Green: growth, health. Purple: luxury, imagination. Black: power, elegance. Culture and context can shift these, so match the message, not just the brand.
2. **Use the colour wheel for relationships.** Complementary (opposites) for high contrast, analogous (neighbours) for calm harmony, triadic (three evenly spaced) for lively balance.
3. **Temperature sets the tone.** Warm (red, orange, yellow) excites; cool (blue, teal, green) calms.
4. **Hierarchy through colour.** The call to action is the brightest thing on the page; everything else steps back. Contrast is direction, not volume.
5. **Accessible contrast.** Text needs a contrast ratio of at least 4.5:1 (big text 3:1). Check it; don't judge by eye.

## 3. Don't look "vibe-coded"
These are the tells of a site an AI made with no direction. Give this list to Claude with any website task, and remove each one unless there's a real reason for it:

harsh gradients · Lucide icons everywhere · pure white background · rainbow colouring · drop shadows on everything · three feature cards in a row · emojis as icons · liquid glass · em dashes in copy · Inter / Geist / Space Grotesk by default · a coloured stripe on the left of cards · fake testimonials · bento grids by reflex · fake terminal windows · "it's not X, it's Y" copy · checkmark bullet lists · three pricing tiers · no real product demo · the same soft corner radius on everything · purple and black · no skeleton loaders · blurry radial orbs · dot-grid backgrounds · sparkle icons · animated arrows · no terms or privacy page · hover animation on everything · neon colours · pastel everything

The fix is almost always the same: one real reference, one typeface pairing chosen on purpose, real content and screenshots, and fewer effects.

## 4. Three tricks that look "designed"
1. **One colour, oversized text.** A single bold colour and one huge word. Clean, like product launches. (`kinetic-type`, `risograph`)
2. **Text behind the subject.** The word sits behind the product or person, so it pops with depth. Hiding part of the text makes people look longer, not less. (`text-behind`, cut-out with `npm run cutout`)
3. **Footage inside the text.** Can't pick a text colour? Fill the letters with a photo or clip. The higher the contrast, the more premium it looks. (`footage-text`)

## 5. Style catalogue
Names to ask for, so a reference can be described exactly. Pick one per piece; don't mix three.

- **Trends going into 2026:** digital scrapbook (cut-outs, tape, stickers, notes) · desktop core (the computer desktop as the layout: windows, folders, cursor) · mid-century modern editorial (tight grotesque type, furniture, warm muted colour) · internet nostalgia (early-web stickers, chunky retro type).
- **Current looks:** scrapbooking · gorpcore (outdoor-gear labels) · bold serifs · cabaret (theatre posters, red and cream) · anti-design (deliberately messy) · contrasto (clashing poster colours) · web-like (UI as decoration) · art nouveau (ornate frames, botanical lines) · brutalism (raw grids, heavy type) · bento (rounded tile grids).
- **History to borrow from:** constructivism · modernism / Swiss · brutalism · experimental type · 80s editorial · post-modernism · synthwave · pop art · Web 1.0 · chrome core · skeuomorphism · glassmorphism · cyberpunk · maximalism · neubrutalism · vector minimalism · future funk · type doodles · psychedelic · kidcore · blueprint · Memphis · steampunk · glitch · vaporwave · Y2K gloss · luxury minimal · gothic · tech spec.

Each style is a reaction to the one before it. When a look feels tired, try its opposite.

## Already built
Reel graphics that use these: `scrapbook`, `desktop-core`, `bento`, `swiss-grid`, `risograph`, `blueprint`, `retro-crt` (`my-video/src/anim/`).
The website's retro desktop (`apps/web`) is already "desktop core".
