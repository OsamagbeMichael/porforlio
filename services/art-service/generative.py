"""
Generates the desktop wallpaper as an SVG, seeded per-visitor so every
session gets a slightly different arrangement while staying on-palette.
This is the "many interests" theme showing up structurally: the
background is a scattered collage, same idea as the moodboard, never
quite the same twice.
"""
import random

PALETTE = ["#A8A468", "#93905A", "#C2451D", "#E8A93B", "#8FA05B", "#3A1B14"]


def generate_wallpaper(seed: str, width: int = 1600, height: int = 1000) -> str:
    rng = random.Random(seed)
    base = "#A8A468"

    shapes: list[str] = []

    # diagonal stripe texture, consistent regardless of seed
    shapes.append(
        f'<rect width="{width}" height="{height}" fill="{base}" />'
    )
    stripe_color = "#93905A"
    step = 26
    x = -height
    while x < width:
        shapes.append(
            f'<line x1="{x}" y1="0" x2="{x + height}" y2="{height}" '
            f'stroke="{stripe_color}" stroke-width="2" opacity="0.5" />'
        )
        x += step

    # scattered generative shapes, seeded so a given visitor sees a
    # stable wallpaper across a session (seed = session id) but a new
    # one next time.
    shape_count = 22
    for _ in range(shape_count):
        cx = rng.uniform(0, width)
        cy = rng.uniform(0, height)
        color = rng.choice(PALETTE)
        kind = rng.choice(["circle", "rect", "ring"])
        opacity = round(rng.uniform(0.08, 0.22), 2)

        if kind == "circle":
            r = rng.uniform(20, 90)
            shapes.append(
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" '
                f'fill="{color}" opacity="{opacity}" />'
            )
        elif kind == "rect":
            size = rng.uniform(30, 110)
            rot = rng.uniform(0, 45)
            shapes.append(
                f'<rect x="{cx:.1f}" y="{cy:.1f}" width="{size:.1f}" height="{size:.1f}" '
                f'fill="{color}" opacity="{opacity}" '
                f'transform="rotate({rot:.1f} {cx:.1f} {cy:.1f})" />'
            )
        else:
            r = rng.uniform(40, 100)
            shapes.append(
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" '
                f'fill="none" stroke="{color}" stroke-width="3" opacity="{opacity + 0.1:.2f}" />'
            )

    svg_body = "".join(shapes)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'width="{width}" height="{height}">{svg_body}</svg>'
    )
