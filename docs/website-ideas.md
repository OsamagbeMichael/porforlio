# Website ideas

A backlog for the portfolio site (`apps/web`). Nothing here is built yet; pick one, then build it with Claude.
Read `docs/design-principles.md` first, especially "Don't look vibe-coded".

## Ideas for this site
| Idea | What it is | Fits because |
| --- | --- | --- |
| Pre-loader | A short intro animation with your own picture before the site appears | sets the tone in the first second |
| Freeform canvas | Polaroid-style photos and sticky notes you can drag around, with a "View work" button | personal, playful, and it's already a desktop |
| Typewriter headline | The intro line types itself out | cheap to build, easy to get right |
| A small character | A hand-drawn mascot that reacts (waves, follows the cursor) | makes the site yours, not a template |
| Page-flip transition | Opening a project turns like a book page | a transition people remember |
| 3D gallery strip | Projects on cards that rotate past in 3D as you scroll | shows many projects without a grid |
| Moving gradient background | A slow shader gradient behind the hero (shape, colour, speed adjustable) | depth without a photo |
| Liquid metal logo | Your logo with a chrome, liquid look | one striking detail is enough |
| Image to 3D | Turn a photo of an object into an interactive 3D model | for a product or gear section |

## Code to borrow (open source)
| Repo | Gives you |
| --- | --- |
| React Three Fiber (`pmndrs/react-three-fiber`) | Three.js 3D in React |
| liquid-glass-js | Apple-style liquid glass with full controls |
| ShaderGradient (`ruucm/shadergradient`) | the moving gradient above |
| liquid-logo | the chrome liquid-metal logo effect |
| img2threejs | photo of an object → a 3D model in code |

How to use a repo safely (it's reference code, not a magic asset):
1. Check its **licence**, that it's **still maintained**, and that it fits our stack (Vite + TypeScript, no React on the site yet).
2. On a **throwaway branch**, ask Claude to isolate the **smallest piece** you need and adapt it, instead of installing the whole thing.
3. Merge only after it works and the bundle stays small. Never run install scripts or downloads you haven't read.

## Tools that make Claude design better
| Tool | What it does | Status here |
| --- | --- | --- |
| Impeccable | design rules and vocabulary, plus a live editor | installed (skill `impeccable`) |
| Awesome design (design.md files) | design systems copied from real sites: type, spacing, buttons, layout | installed (skill `design-md-library`) |
| Playwright | opens real browsers, tests the site and takes screenshots | available through Claude's browser tools (`browser-qa`) |
| Taste skill | anti-generic design rules | not installed; read it before adding |
| img2threejs | image → 3D model | not installed |
| Framer | no-code site builder with ready components (pre-loader, freeform canvas, typewriter) | not used; this site is hand-built |

## Where to look for references
See `my-video/docs/inspiration.md` (sites for motion, palettes, images and landing pages).
