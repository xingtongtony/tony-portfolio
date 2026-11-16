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
# S is pixels per world unit: the loader shows the art at its natural size, so
# this is what sets how big the object is on the page. Line weight and the
# numerals do not scale with it.
AZ, EL, S = 0.56, 0.5, 58.0
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
# The plinth is sized from the block, so the margin round it is the same on
# all four sides, and the two layers differ enough in size and height to read
# as two layers in a line drawing.
WIDTH, DEPTH = 1.95, 0.42
MARGIN, STEP_OUT, STEP_H, BASE_H = 0.34, 0.22, 0.09, 0.13
BW, BD = WIDTH + 2 * MARGIN, DEPTH + 2 * MARGIN
slab(BW + 2 * STEP_OUT, BD + 2 * STEP_OUT, 0.34, 0.0, STEP_H, STEP)
slab(BW, BD, 0.24, STEP_H, STEP_H + BASE_H, GROUND)
TOP = STEP_H + BASE_H
ZF, ZB = DEPTH / 2, -DEPTH / 2
poly = block(CORAL, TOP, ZF, ZB, WIDTH)
HEIGHT = max(p[1] for p in poly)

# Shadows fall away from the key light: right and back.
sx, sz = -LIGHT[0] / LIGHT[1], -LIGHT[2] / LIGHT[1]
foot = [(-WIDTH / 2, ZB), (WIDTH / 2, ZB), (WIDTH / 2, ZF), (-WIDTH / 2, ZF)]
h = HEIGHT - TOP
cast = hull(foot + [(x + sx * h, z + sz * h) for x, z in foot])
contact = [(x, TOP, z) for x, z in cast]
outer = rounded_rect(BW + 2 * STEP_OUT, BD + 2 * STEP_OUT, 0.34)
floor = hull([(x + sx * 0.2, z + sz * 0.2) for x, z in outer] + [(x + sx * HEIGHT, z + sz * HEIGHT) for x, z in foot])
floor = [(x, 0.0, z) for x, z in floor]

faces.sort(key=lambda f: f[0])
solid = [proj(p) for f in faces for p in f[3]]
# The canvas is centred on the object itself, with the same room either side
# for a numeral, so centring the image centres the object.
cx = (min(p[0] for p in solid) + max(p[0] for p in solid)) / 2
half_w = (max(p[0] for p in solid) - min(p[0] for p in solid)) / 2 + 84
top_y = min(p[1] for p in solid)
bot_y = max(p[1] for p in solid)
# The pool of colour on the floor must fit inside the canvas, or its edge shows as a straight cut.
pool_x, pool_y = proj((0.2, 0.0, -0.05))
POOL_RX, POOL_RY = half_w * 0.9, half_w * 0.36
x0, y0 = cx - half_w, min(top_y - 34, pool_y - POOL_RY - 4)
W, H = 2 * half_w, max(bot_y + 34, pool_y + POOL_RY + 4) - y0
fmt = lambda pts: " ".join("%.1f,%.1f" % (x - x0, y - y0) for x, y in (proj(p) for p in pts))
at = lambda p: tuple(round(v - o, 1) for v, o in zip(proj(p), (x0, y0)))

line = ['<g fill="%s" stroke="%s" stroke-width="1.25" stroke-linejoin="round">' % (WHITE, INK)]
line += ['<polygon points="%s"/>' % fmt(f[3]) for f in faces if f[2]]
line.append("</g>")
# Two patent callouts: a leader from the object to a numeral, one each side.
edge_l, edge_r = cx - half_w + 36, cx + half_w - 36
for label, src, side in (("002", (WIDTH / 2 - 0.12, HEIGHT, ZF), 1), ("004", (-BW / 2 - STEP_OUT + 0.1, STEP_H, BD / 2 + STEP_OUT - 0.12), -1)):
    ax, ay = at(src)
    bx = round((edge_r if side > 0 else edge_l) - x0, 1)
    by = round(ay - 18, 1)
    line.append('<path d="M%s %s Q%s %s %s %s" fill="none" stroke="%s" stroke-width="1"/>' % (ax, ay, round((ax + bx) / 2, 1), by, bx, by, INK))
    line.append('<text x="%s" y="%s" text-anchor="%s" font-style="italic" font-size="13" fill="%s" style="font-family:var(--font-serif),Georgia,serif">%s</text>' % (bx + side * 7, round(by + 4.5, 1), "start" if side > 0 else "end", INK, label))

# ── the built object ──
sil = " ".join('M%sZ' % fmt(f[3]).replace(" ", "L") for f in faces if f[1])
pool_c = (round(pool_x - x0, 1), round(pool_y - y0, 1))
colour = [
    "<defs>"
    '<filter id="bp-soft" x="-40%%" y="-40%%" width="180%%" height="180%%"><feGaussianBlur stdDeviation="5.4"/></filter>'
    '<filter id="bp-near" x="-40%%" y="-40%%" width="180%%" height="180%%"><feGaussianBlur stdDeviation="2"/></filter>'
    '<radialGradient id="bp-pool" cx="50%%" cy="50%%" r="50%%"><stop offset="0" stop-color="%s" stop-opacity="0.75"/><stop offset="0.45" stop-color="%s" stop-opacity="0.42"/><stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>'
    # Light falls off across the object: brightest toward the key light (upper left), dimmer away from it.
    '<linearGradient id="bp-fall" x1="0.12" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.2"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="%s" stop-opacity="0.2"/></linearGradient>'
    '<clipPath id="bp-sil"><path d="%s"/></clipPath>'
    "</defs>" % (GROUND, GROUND, GROUND, PLUM, sil)
]
colour.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#bp-pool)"/>' % (pool_c[0], pool_c[1], round(POOL_RX, 1), round(POOL_RY, 1)))
colour.append('<polygon points="%s" fill="%s" opacity="0.3" filter="url(#bp-soft)"/>' % (fmt(floor), PLUM))
ground_top = shade(GROUND, 1.05)
drawn_contact = False
for f in faces:
    if f[1] is None:
        continue
    colour.append('<polygon points="%s" fill="%s" stroke="%s" stroke-width="0.6" stroke-linejoin="round"/>' % (fmt(f[3]), f[1], f[1]))
    if not drawn_contact and f[1] == ground_top:
        # The block's shadow on the base, drawn straight after the surface it
        # falls on, and a tighter, darker one where it touches.
        colour.append('<polygon points="%s" fill="%s" opacity="0.34" filter="url(#bp-near)"/>' % (fmt(contact), PLUM))
        colour.append('<polygon points="%s" fill="%s" opacity="0.3" filter="url(#bp-near)"/>' % (fmt([(x, TOP, z) for x, z in [(-WIDTH / 2 - 0.03, ZB), (WIDTH / 2 + 0.05, ZB - 0.04), (WIDTH / 2 + 0.05, ZF + 0.03), (-WIDTH / 2 - 0.03, ZF + 0.03)]]), PLUM))
        drawn_contact = True
# A bevel catches a line of light: the upper edges of the block's and the plinth's faces.
hi = []
for a, b in zip(poly, poly[1:] + poly[:1]):
    if abs(a[1] - b[1]) < 1e-6 and (b[0] - a[0]) < 0:  # a top edge of the front cap
        hi.append([(a[0], a[1], ZF), (b[0], b[1], ZF)])
for seg in hi:
    (ax, ay), (bx, by) = at(seg[0]), at(seg[1])
    colour.append('<path d="M%s %s L%s %s" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.9" stroke-linecap="round" fill="none"/>' % (ax, ay, bx, by))
colour.append('<rect x="0" y="0" width="%d" height="%d" fill="url(#bp-fall)" clip-path="url(#bp-sil)"/>' % (round(W), round(H)))

frac = lambda p: (round((proj(p)[0] - x0) / W, 4), round((proj(p)[1] - y0) / H, 4))
left_base, left_top = frac((-WIDTH / 2, TOP, ZF)), frac((-WIDTH / 2, HEIGHT, ZF))
right_base, right_top = frac((WIDTH / 2, TOP, ZF)), frac((WIDTH / 2, HEIGHT, ZF))

out = os.path.join(ROOT, "app/components/blueprint/loader-art.ts")
with open(out, "w") as fh:
    fh.write("// Generated by scripts/blueprint-loader-art.py — do not edit by hand.\n")
    fh.write("// The page loader's art: the logo as a clay block on a plinth, projected with\n")
    fh.write("// the 3D stage's camera. Two layers that register exactly, on a canvas\n")
    fh.write("// centred on the object.\n\n")
    fh.write("export const LOADER_ART = {\n")
    fh.write("  width: %d,\n  height: %d,\n" % (round(W), round(H)))
    fh.write("  /** Where the block's front edges meet the plinth and where they end, as fractions of the canvas: the path of the build front. */\n")
    fh.write("  left: { x: %s, from: %s, to: %s },\n" % (left_base[0], left_base[1], left_top[1]))
    fh.write("  right: { x: %s, from: %s, to: %s },\n" % (right_base[0], right_base[1], right_top[1]))
    fh.write("  /** The patent drawing. */\n  line: %s,\n" % json.dumps("".join(line)))
    fh.write("  /** The built object. */\n  colour: %s,\n" % json.dumps("".join(colour)))
    fh.write("};\n")
print("wrote", os.path.relpath(out, ROOT), "%dx%d" % (round(W), round(H)), "faces", len(faces))
