# AI-generated b-roll

For shots you can't film: a building that doesn't exist yet, a product render, a space walkthrough.
The result is a normal video file: save it to `public/b-roll/<category>/` and use it as a `broll` entry.

## The rule that keeps it believable: give the video model a skeleton
A video model asked to invent a whole scene drifts (rooms change shape, a hallway appears halfway through).
So build the layout and the camera move first, and let the AI only paint the look on top.

1. **Build the real model.** From a floor plan, sketch or measurements, have Claude build the space in Blender (simple boxes are enough: walls, doors, windows, room sizes).
2. **Draw one camera line.** One path through the plan at eye height (about 1.5 m), slowing down in each room. Render this plain "driving video" from Blender.
3. **Lock the look.** Write the materials and light once (e.g. "raw concrete, light pine, white linen, soft daylight") and paste the **same words** into every prompt, so all rooms feel like one place. Make a still per room with them.
4. **Generate.** Give the video model the driving video plus a start and an end frame (the stills). It follows the move instead of inventing one.

## Where to generate
- **Higgsfield** (connected in Claude here): has video models, including Seedance. Spends credits: **Claude asks before every generation** and says the cost.
- **Open Higgsfield AI** (`github.com/Autom8AI/Open-Higgsfield-AI`): a self-hosted interface for the same kind of models, but every generation still goes through the paid Muapi.ai API with your own key. Its README's desktop downloads point to a different GitHub account and need you to bypass macOS Gatekeeper. Don't install those; if you want it, run it from source after reading the code.

## Before using a clip
- Watch it end to end (`/watch <file>`). Look for walls, signs or hands that change between frames.
- Say it's AI-generated when it shows something real (a property for sale, a product): viewers and platforms expect it.
