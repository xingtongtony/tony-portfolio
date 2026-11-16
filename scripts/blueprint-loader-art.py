#!/usr/bin/env python3
"""Draws the page loader's art: the logo as a clay block on a plinth.

    python3 scripts/blueprint-loader-art.py

It projects real geometry with the 3D stage's own camera (same angles as
scene.tsx), so the loader's drawing is in the same language as the figures it
introduces, and writes app/components/blueprint/loader-art.ts with two SVG
layers that register exactly: LINE (the patent drawing) and COLOUR (the built
object). Re-run it after changing the palette or the logo.
"""
import json, math, os

ROOT = os.path.join(os.path.dirname(__file__), "..")
AZ, EL, S = 0.56, 0.5, 100.0
DIR = (math.sin(AZ) * math.cos(EL), math.sin(EL), math.cos(AZ) * math.cos(EL))
RIGHT = (math.cos(AZ), 0.0, -math.sin(AZ))
UP = (-math.sin(EL) * math.sin(AZ), math.cos(EL), -math.sin(EL) * math.cos(AZ))
LIGHT = tuple(v / math.sqrt(25 + 196 + 49) for v in (-5, 14, 7))

INK, WHITE = "#151515", "#ffffff"
GROUND, MIST, STEP, PLUM, CORAL = "#DCD3F8", "#EDE8FD", "#BDAFF1", "#5E50A8", "#F58D74"

dot = lambda a, b: sum(x * y for x, y in zip(a, b))
proj = lambda p: (dot(p, RIGHT) * S, -dot(p, UP) * S)
depth = lambda pts: sum(dot(p, DIR) for p in pts) / len(pts)
rgb = lambda h: tuple(int(h[i : i + 2], 16) for i in (1, 3, 5))
hexc = lambda c: "#%02X%02X%02X" % tuple(max(0, min(255, round(v))) for v in c)
mix = lambda a, b, t: tuple(x + (y - x) * t for x, y in zip(a, b))


def shade(colour, f):
    """f = 1 is the colour itself, above it lightens, below it goes to a plum-tinted dark."""
    c = rgb(colour)
    if f >= 1:
        return hexc(mix(c, (255, 255, 255), min(1, (f - 1) * 2.4)))
    dark = mix(tuple(v * 0.5 for v in c), rgb(PLUM), 0.22)
    return hexc(mix(c, dark, 1 - f))


def side_f(n):
    return 0.6 + 0.32 * max(0.0, dot(n, LIGHT)) / 0.426


def rounded_rect(w, d, r, n=7):
    pts = []
    for cx, cz, a0 in ((w / 2 - r, d / 2 - r, 0), (-w / 2 + r, d / 2 - r, 90), (-w / 2 + r, -d / 2 + r, 180), (w / 2 - r, -d / 2 + r, 270)):
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            pts.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    return pts  # x, z; goes +x → +z (front) → -x → -z


faces = []  # (depth, colour_fill, line?, points3d)  line: True = also in the drawing


def slab(w, d, r, y0, y1, colour, outline=True):
    ring = rounded_rect(w, d, r)
    n = len(ring)
    visible = []
    for i in range(n):
        a, b = ring[i], ring[(i + 1) % n]
        ex, ez = b[0] - a[0], b[1] - a[1]
        nx, nz = ez, -ex
        mx, mz = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        if nx * mx + nz * mz < 0:
            nx, nz = -nx, -nz
        ln = math.hypot(nx, nz) or 1
        nrm = (nx / ln, 0.0, nz / ln)
        if dot(nrm, DIR) > 0.02:
            quad = [(a[0], y0, a[1]), (b[0], y0, b[1]), (b[0], y1, b[1]), (a[0], y1, a[1])]
            faces.append((depth(quad) - 0.001, shade(colour, side_f(nrm)), False, quad))
            visible.append(i)
    top = [(x, y1, z) for x, z in ring]
    faces.append((depth(top), shade(colour, 1.05), outline, top))
    if outline and visible:
        # One band for the drawing, not a stroke per facet of the rounded corners.
        start = next(i for i in visible if (i - 1) % n not in visible)
        run = [(start + k) % n for k in range(len(visible))]
        low = [(ring[i][0], y0, ring[i][1]) for i in run] + [(ring[(run[-1] + 1) % n][0], y0, ring[(run[-1] + 1) % n][1])]
        high = [(p[0], y1, p[2]) for p in low]
        band = low + high[::-1]
        faces.append((depth(band) - 0.0005, None, True, band))


def logo_outline():
    data = json.load(open(os.path.join(ROOT, "public/tonylogo.json")))
    found = []

    def walk(o):
        if isinstance(o, dict):
            if o.get("ty") == "sh":
                k = o["ks"]["k"]
                found.append(k[0]["s"][0] if isinstance(k, list) else k)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)

    walk(data)
    pts = [(x, -y) for x, y in found[0]["v"]]
    half = 5.0  # the logo's stroke is 10 wide
    left, right = [], []
    for i, p in enumerate(pts):
        dirs = []
        if i > 0:
            dirs.append((p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]))
        if i < len(pts) - 1:
            dirs.append((pts[i + 1][0] - p[0], pts[i + 1][1] - p[1]))
        ox = oy = 0.0
        for dx, dy in dirs:
            ln = math.hypot(dx, dy)
            ox += -dy / ln
            oy += dx / ln
        left.append((p[0] + ox * half, p[1] + oy * half))
        right.append((p[0] - ox * half, p[1] - oy * half))
    return left + right[::-1]


def block(colour, y0, zf, zb, width):
    out = logo_outline()
    xs = [p[0] for p in out]
    ys = [p[1] for p in out]
    s = width / (max(xs) - min(xs))
    cx = (max(xs) + min(xs)) / 2
    poly = [((x - cx) * s, y0 + (y - min(ys)) * s) for x, y in out]
    area = sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(poly, poly[1:] + poly[:1]))
    if area < 0:
        poly = poly[::-1]
    for a, b in zip(poly, poly[1:] + poly[:1]):
        ex, ey = b[0] - a[0], b[1] - a[1]
        ln = math.hypot(ex, ey)
        nrm = (ey / ln, -ex / ln, 0.0)
        if dot(nrm, DIR) > 0.02:
            quad = [(a[0], a[1], zf), (b[0], b[1], zf), (b[0], b[1], zb), (a[0], a[1], zb)]
            f = 1.06 if nrm[1] > 0.5 else 0.6
            faces.append((depth(quad), shade(colour, f), True, quad))
    cap = [(x, y, zf) for x, y in poly]
    faces.append((depth(cap) + 0.2, shade(colour, 0.92), True, cap))
    return poly


def hull(points):
    pts = sorted(set(points))
    cross = lambda o, a, b: (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


# ── the object ──
TOP = 0.107
slab(3.2, 2.2, 0.46, 0.0, 0.04, STEP)
slab(2.9, 1.9, 0.36, 0.0, 0.1, GROUND)
slab(2.6, 1.6, 0.26, 0.1, TOP, MIST, outline=False)
ZF, ZB, WIDTH = 0.2, -0.2, 1.95
poly = block(CORAL, TOP, ZF, ZB, WIDTH)
HEIGHT = max(p[1] for p in poly)

# Shadows fall away from the key light: right and back.
sx, sz = -LIGHT[0] / LIGHT[1], -LIGHT[2] / LIGHT[1]
foot = [(-WIDTH / 2, ZB), (WIDTH / 2, ZB), (WIDTH / 2, ZF), (-WIDTH / 2, ZF)]
h = HEIGHT - TOP
cast = hull(foot + [(x + sx * h, z + sz * h) for x, z in foot])
contact = [(x, TOP, z) for x, z in cast]
base = rounded_rect(3.2, 2.2, 0.46)
floor = hull([(x + sx * 0.12, z + sz * 0.12) for x, z in base] + [(x + sx * HEIGHT, z + sz * HEIGHT) for x, z in foot])
floor = [(x, 0.0, z) for x, z in floor]

faces.sort(key=lambda f: f[0])
every = [proj(p) for f in faces for p in f[3]] + [proj(p) for p in floor]
PAD_X, PAD_T, PAD_B = 96, 56, 30
x0 = min(p[0] for p in every) - PAD_X
y0 = min(p[1] for p in every) - PAD_T
W = max(p[0] for p in every) + PAD_X - x0
H = max(p[1] for p in every) + PAD_B - y0
fmt = lambda pts: " ".join("%.1f,%.1f" % (x - x0, y - y0) for x, y in (proj(p) for p in pts))
at = lambda p: tuple(round(v - o, 1) for v, o in zip(proj(p), (x0, y0)))

line = ['<g fill="%s" stroke="%s" stroke-width="1.25" stroke-linejoin="round">' % (WHITE, INK)]
line += ['<polygon points="%s"/>' % fmt(f[3]) for f in faces if f[2]]
line.append("</g>")
# Two patent callouts: a leader from the object to a numeral.
for label, src, dst in (("002", (WIDTH / 2 - 0.1, HEIGHT, ZF), (1.75, HEIGHT + 0.42, 0.0)), ("004", (-1.5, 0.06, 0.55), (-2.15, 0.34, 0.75))):
    (ax, ay), (bx, by) = at(src), at(dst)
    line.append('<path d="M%s %s Q%s %s %s %s" fill="none" stroke="%s" stroke-width="1"/>' % (ax, ay, round((ax + bx) / 2, 1), by, bx, by, INK))
    tx = bx + (8 if bx > ax else -8)
    line.append('<text x="%s" y="%s" text-anchor="%s" font-style="italic" font-size="13" fill="%s" style="font-family:var(--font-serif),Georgia,serif">%s</text>' % (tx, round(by + 4.5, 1), "start" if bx > ax else "end", INK, label))

colour = ['<defs><filter id="bp-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter><filter id="bp-near" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter></defs>']
colour.append('<polygon points="%s" fill="%s" opacity="0.26" filter="url(#bp-soft)"/>' % (fmt(floor), PLUM))
drawn_contact = False
for f in faces:
    if f[1] is None:
        continue
    colour.append('<polygon points="%s" fill="%s" stroke="%s" stroke-width="0.6" stroke-linejoin="round"/>' % (fmt(f[3]), f[1], f[1]))
    if not drawn_contact and f[1] == shade(MIST, 1.05):
        # The block's shadow on the base, drawn straight after the surface it falls on.
        colour.append('<polygon points="%s" fill="%s" opacity="0.3" filter="url(#bp-near)"/>' % (fmt(contact), PLUM))
        drawn_contact = True

out = os.path.join(ROOT, "app/components/blueprint/loader-art.ts")
with open(out, "w") as fh:
    fh.write("// Generated by scripts/blueprint-loader-art.py — do not edit by hand.\n")
    fh.write("// The page loader's art: the logo as a clay block on a plinth, projected with\n")
    fh.write("// the 3D stage's camera. Two layers that register exactly.\n\n")
    fh.write("export const LOADER_ART = {\n")
    fh.write("  width: %d,\n  height: %d,\n" % (round(W), round(H)))
    fh.write("  /** The patent drawing. */\n  line: %s,\n" % json.dumps("".join(line)))
    fh.write("  /** The built object. */\n  colour: %s,\n" % json.dumps("".join(colour)))
    fh.write("};\n")
print("wrote", os.path.relpath(out, ROOT), "%dx%d" % (round(W), round(H)), "faces", len(faces))
