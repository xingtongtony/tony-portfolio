#!/usr/bin/env python3
"""Draws the page loader's art: the logo as a clay block on a plinth.

    python3 scripts/blueprint-loader-art.py

It projects real geometry with the 3D stage's own camera (same angles as
scene.tsx), so the loader's drawing is in the same language as the figures it
introduces, and writes app/components/blueprint/loader-art.ts with three SVG
layers that register exactly: LINE (the patent drawing, drawn on stroke by
stroke), COLOUR (the built object) and GLINT (light on top of it: the build
front and one sweep across the logo). Re-run it after changing the palette,
the logo or the plinth.

The object follows the stage's modelling rules (rules/BLUEPRINT_STAGE.md):
flat faces with rounded corners and a tight bevel that catches a line of
light, the stage's own two-tier plinth, one palette (the lilac world), soft
shadows that are darkest where things touch, and three scales of detail.
"""
import json, math, os

ROOT = os.path.join(os.path.dirname(__file__), "..")
# S is pixels per world unit: the loader shows the art at its natural size, so
# this is what sets how big the object is on the page. Line weight and the
# numerals do not scale with it.
AZ, EL, S = 0.56, 0.5, 58.0


def norm(v):
    ln = math.sqrt(sum(x * x for x in v)) or 1.0
    return tuple(x / ln for x in v)


dot = lambda a, b: sum(x * y for x, y in zip(a, b))
DIR = (math.sin(AZ) * math.cos(EL), math.sin(EL), math.cos(AZ) * math.cos(EL))  # towards the camera
RIGHT = (math.cos(AZ), 0.0, -math.sin(AZ))
UP = (-math.sin(EL) * math.sin(AZ), math.cos(EL), -math.sin(EL) * math.cos(AZ))
LIGHT = norm((-5, 14, 7))  # the key soft box: high, front left
HALF = norm(tuple(a + b for a, b in zip(LIGHT, DIR)))

INK, WHITE = "#151515", "#ffffff"
# The lilac world (THEMES.lilac in figures.ts): its hue owns the area, the logo
# is the strong accent, yellow the second one.
MIST, GROUND, LILAC, PLUM, CORAL, YELLOW = "#EDE8FD", "#DCD3F8", "#BDAFF1", "#5E50A8", "#F58D74", "#F7CF6E"

proj = lambda p: (dot(p, RIGHT) * S, -dot(p, UP) * S)
depth = lambda pts: sum(dot(p, DIR) for p in pts) / len(pts)
rgb = lambda h: tuple(int(h[i : i + 2], 16) for i in (1, 3, 5))
hexc = lambda c: "#%02X%02X%02X" % tuple(max(0, min(255, round(v))) for v in c)
mix = lambda a, b, t: tuple(x + (y - x) * t for x, y in zip(a, b))


def shade(colour, f, spec=0.0):
    """f = 1 is the colour itself, above it lightens, below it goes to a plum-tinted dark; spec adds the soft box's reflection."""
    c = rgb(colour)
    if f >= 1:
        out = mix(c, (255, 255, 255), min(1, (f - 1) * 2.4))
    else:
        dark = mix(tuple(v * 0.5 for v in c), rgb(PLUM), 0.22)
        out = mix(c, dark, 1 - f)
    return hexc(mix(out, (255, 255, 255), min(1.0, spec)))


def tone(n):
    """Lit tops land near the palette colour, fronts lower, shaded sides a little over half (the stage's rule)."""
    f = max(0.5, min(1.1, 0.68 + 0.4225 * dot(n, LIGHT)))
    spec = max(0.0, dot(n, HALF)) ** 28 * 0.5
    # In steps, so neighbouring faces of one tone share a fill and go out as one path.
    return round(f * 50) / 50, round(spec * 20) / 20


# ── plane geometry ──
def area(poly):
    return sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(poly, poly[1:] + poly[:1])) / 2


def ccw(poly):
    return poly if area(poly) > 0 else poly[::-1]


def edge_normal(a, b):
    """Outward normal of edge a→b of a counter-clockwise outline."""
    du, dv = b[0] - a[0], b[1] - a[1]
    ln = math.hypot(du, dv) or 1.0
    return (dv / ln, -du / ln)


def fillet(poly, r_out, r_in, n_out=4, n_in=2):
    """Round every corner: convex ones by r_out, concave ones by r_in (each clamped to its edges)."""
    out = []
    n = len(poly)
    for i in range(n):
        p0, p1, p2 = poly[i - 1], poly[i], poly[(i + 1) % n]
        d1 = (p1[0] - p0[0], p1[1] - p0[1])
        d2 = (p2[0] - p1[0], p2[1] - p1[1])
        l1, l2 = math.hypot(*d1), math.hypot(*d2)
        d1, d2 = (d1[0] / l1, d1[1] / l1), (d2[0] / l2, d2[1] / l2)
        turn = d1[0] * d2[1] - d1[1] * d2[0]
        ang = math.acos(max(-1.0, min(1.0, d1[0] * d2[0] + d1[1] * d2[1])))
        if ang < 1e-4:
            out.append(p1)
            continue
        convex = turn > 0
        r = r_out if convex else r_in
        t = min(r * math.tan(ang / 2), l1 * 0.5, l2 * 0.5)
        r = t / math.tan(ang / 2)
        a = (p1[0] - d1[0] * t, p1[1] - d1[1] * t)
        left = (-d1[1], d1[0])
        side = 1 if convex else -1
        c = (a[0] + left[0] * r * side, a[1] + left[1] * r * side)
        a0 = math.atan2(a[1] - c[1], a[0] - c[0])
        steps = n_out if convex else n_in
        for k in range(steps + 1):
            th = a0 + side * ang * k / steps
            out.append((c[0] + r * math.cos(th), c[1] + r * math.sin(th)))
    return out


def inset(poly, d):
    """The outline moved inwards by d (mitred: the corners are already rounded)."""
    n = len(poly)
    out = []
    for i in range(n):
        na = edge_normal(poly[i - 1], poly[i])
        nb = edge_normal(poly[i], poly[(i + 1) % n])
        nv = (na[0] + nb[0], na[1] + nb[1])
        ln = math.hypot(*nv) or 1.0
        nv = (nv[0] / ln, nv[1] / ln)
        m = d / max(0.3, nv[0] * na[0] + nv[1] * na[1])
        out.append((poly[i][0] - nv[0] * m, poly[i][1] - nv[1] * m))
    return out


def rounded_rect(w, d, r, n=7):
    pts = []
    for cx, cz, a0 in ((w / 2 - r, d / 2 - r, 0), (-w / 2 + r, d / 2 - r, 90), (-w / 2 + r, -d / 2 + r, 180), (w / 2 - r, -d / 2 + r, 270)):
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            pts.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    return ccw(pts)


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


# ── solids ──
K = 1 - math.sqrt(0.5)  # where the middle of a fillet sits inside the sharp edge, per radius


class Prism:
    """An outline (u, v) extruded along w from w0 to w1, each end rounded by its own bevel.

    `to3d` places (u, v, w) in the world; `axis` is +w in the world. Faces carry their
    normal, so each is lit like the stage lights it, bevels catching the soft box.
    """

    STEPS = 2

    def __init__(self, outline, w0, w1, b0, b1, colour, to3d, axis):
        self.outline, self.colour, self.to3d, self.axis = ccw(outline), colour, to3d, axis
        self.w0, self.w1, self.b0, self.b1 = w0, w1, b0, b1
        rings = []  # (inset, w, psi): psi runs from -90° (the w0 cap) to +90° (the w1 cap)
        if b0 > 0:
            for k in range(self.STEPS + 1):
                th = math.pi / 2 * (1 - k / self.STEPS)
                rings.append((b0 * (1 - math.cos(th)), w0 + b0 - b0 * math.sin(th), -th))
        else:
            rings.append((0.0, w0, 0.0))
        if b1 > 0:
            for k in range(self.STEPS + 1):
                th = math.pi / 2 * k / self.STEPS
                rings.append((b1 * (1 - math.cos(th)), w1 - b1 + b1 * math.sin(th), th))
        else:
            rings.append((0.0, w1, 0.0))
        self.rings = rings
        self.normals2 = [edge_normal(a, b) for a, b in zip(self.outline, self.outline[1:] + self.outline[:1])]

    def n3(self, n2, psi):
        c, s = math.cos(psi), math.sin(psi)
        flat = self.to3d(n2[0], n2[1], 0.0)
        return norm(tuple(f * c + a * s for f, a in zip(flat, self.axis)))

    def ring(self, d, w):
        return [self.to3d(u, v, w) for u, v in (inset(self.outline, d) if d > 1e-9 else self.outline)]

    def faces(self):
        """{"b0": [...], "side": [...], "b1": [...], "cap1": face}: each face (points, normal)."""
        out = {"b0": [], "side": [], "b1": [], "cap1": None}
        pts = [self.ring(d, w) for d, w, _ in self.rings]
        n = len(self.outline)
        for j in range(len(self.rings) - 1):
            (_, wa, pa), (_, wb, pb) = self.rings[j], self.rings[j + 1]
            if abs(wa - wb) < 1e-9 and pa == pb:
                continue
            kind = "side" if pa == 0 and pb == 0 else ("b0" if pa + pb < 0 else "b1")
            for i in range(n):
                nrm = self.n3(self.normals2[i], (pa + pb) / 2)
                if dot(nrm, DIR) <= 0.01:
                    continue
                quad = [pts[j][i], pts[j][(i + 1) % n], pts[j + 1][(i + 1) % n], pts[j + 1][i]]
                out[kind].append((quad, nrm))
        cap = pts[-1]
        out["cap1"] = (cap, self.axis)
        return out

    def drawing(self):
        """The patent drawing: the side as bands (one per run of visible faces) and the end cap, both at the middle of the bevels."""
        lo = self.ring(self.b0 * K, self.w0 + self.b0 * K)
        hi = self.ring(self.b1 * K, self.w1 - self.b1 * K)
        n = len(self.outline)
        visible = [dot(self.n3(self.normals2[i], 0.0), DIR) > 0.01 for i in range(n)]
        bands = []
        if any(visible) and not all(visible):
            start = next(i for i in range(n) if visible[i] and not visible[i - 1])
            i = start
            for _ in range(n):
                if visible[i] and not visible[i - 1]:
                    run = []
                    j = i
                    while visible[j % n]:
                        run.append(j % n)
                        j += 1
                    idx = run + [(run[-1] + 1) % n]
                    band = [lo[k] for k in idx] + [hi[k] for k in idx[::-1]]
                    bands.append(band)
                i = (i + 1) % n
        return bands, hi


# ── the logo, from its own animation file ──
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


# ── the object ──
# The block: the logo, 1.95 wide and 0.42 deep, every corner rounded a little
# (the stroke's outer corners more than its inner ones, as a bent bar would be)
# and its front and back edges bevelled.
WIDTH, DEPTH = 1.95, 0.42
R_OUT, R_IN, BEVEL = 0.07, 0.03, 0.034
# The stage's plinth (plinth() in figures.ts): a lilac tier under a deck with
# an even setback, both rounded, the deck's top edge bevelled — a little
# thicker than on the stage, because the loader shows it at half the size. The
# deck is the world's ground colour, not its mist: that is how the mist deck
# reads on the stage, under its light and over its tinted floor, and on the
# loader's white a mist deck all but disappears.
MARGIN, SETBACK, RADIUS = 0.34, 0.13, 0.29
LOW_T, TOP = 0.06, 0.17
BW, BD = WIDTH + 2 * MARGIN, DEPTH + 2 * MARGIN

slab_3d = lambda u, v, w: (u, w, v)
lower = Prism(rounded_rect(BW + 2 * SETBACK, BD + 2 * SETBACK, RADIUS + SETBACK), 0.0, LOW_T, 0.0, 0.0, LILAC, slab_3d, (0.0, 1.0, 0.0))
deck = Prism(rounded_rect(BW, BD, RADIUS), LOW_T - 0.012, TOP, 0.0, 0.03, GROUND, slab_3d, (0.0, 1.0, 0.0))

raw = logo_outline()
xs, ys = [p[0] for p in raw], [p[1] for p in raw]
scale = WIDTH / (max(xs) - min(xs))
mid_x = (max(xs) + min(xs)) / 2
logo2d = ccw([((x - mid_x) * scale, TOP + (y - min(ys)) * scale) for x, y in raw])
logo2d = fillet(logo2d, R_OUT, R_IN)
ZF, ZB = DEPTH / 2, -DEPTH / 2
block = Prism(logo2d, ZB, ZF, 0.0, BEVEL, CORAL, lambda u, v, w: (u, v, w), (0.0, 0.0, 1.0))
HEIGHT = max(p[1] for p in logo2d)

# Small things on the deck, the stage's own props: a yellow ball at the front
# left and a plum ring lying flat at the front right, both in front of the
# block (so they are painted after it) and clear of its outline.
BALL = ((-1.08, 0.36), 0.1)  # (x, z), radius
RING = ((1.08, 0.3), 0.095, 0.028)  # (x, z), radius, tube

# ── faces, in the order they are painted ──
faces = []  # (points, fill colour, group)


def paint(prism, group, apart=("b0", "side", "b1")):
    """Far to near. Kinds in `apart` never overlap one another on screen (the sides of a
    convex slab, the bevel round the logo's face), so their faces are gathered by fill."""
    f = prism.faces()
    for kind in ("b0", "side", "b1"):
        lit = [(pts, shade(prism.colour, *tone(nrm))) for pts, nrm in sorted(f[kind], key=lambda q: depth(q[0]))]
        if kind in apart:
            first = {}
            for _, fill in lit:
                first.setdefault(fill, len(first))
            lit.sort(key=lambda q: first[q[1]])
        faces.extend((pts, fill, group) for pts, fill in lit)
    pts, nrm = f["cap1"]
    fl, sp = tone(nrm)
    faces.append((pts, shade(prism.colour, fl, sp), group))


paint(lower, "plinth")
paint(deck, "plinth")
DECK_FACES = len(faces)
paint(block, "logo", apart=("b1",))

# ── the canvas ──
solid = [proj(p) for f in faces for p in f[0]]
cx = (min(p[0] for p in solid) + max(p[0] for p in solid)) / 2
half_w = (max(p[0] for p in solid) - min(p[0] for p in solid)) / 2 + 84
top_y = min(p[1] for p in solid)
bot_y = max(p[1] for p in solid)
# The pool of colour on the floor must fit inside the canvas, or its edge shows as a straight cut.
pool_x, pool_y = proj((0.2, 0.0, -0.05))
POOL_RX, POOL_RY = half_w * 0.9, half_w * 0.36
x0, y0 = cx - half_w, min(top_y - 34, pool_y - POOL_RY - 4)
W, H = 2 * half_w, max(bot_y + 34, pool_y + POOL_RY + 4) - y0
at = lambda p: tuple(round(v - o, 1) for v, o in zip(proj(p), (x0, y0)))
d_of = lambda pts: "M" + "L".join("%.1f,%.1f" % at(p) for p in pts) + "Z"
pts_of = lambda pts: " ".join("%.1f,%.1f" % at(p) for p in pts)
perimeter = lambda pts: sum(math.dist(at(a), at(b)) for a, b in zip(pts, pts[1:] + pts[:1]))

# ── LINE: the patent drawing, drawn on stroke by stroke ──
# Every outline is a path of length 1 (pathLength) whose dash is pulled along
# it: --d is when its pen starts, --t how long it takes, at one steady speed.
# The fills are white on white, so they hide what is behind from the start and
# a line only ever appears where it will stay.
PEN = 0.95  # px per ms
pen_end = 0
line = ['<g fill="%s" stroke="%s" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round">' % (WHITE, INK)]


def pen(d, start, length, cap=620):
    global pen_end
    t = max(240, min(cap, length / PEN))
    pen_end = max(pen_end, start + t)
    return '<path class="bp-anim bp-pen" pathLength="1" style="--d:%dms;--t:%dms" d="%s"/>' % (start, t, d)


for prism, start in ((lower, 0), (deck, 110)):
    bands, cap = prism.drawing()
    for band in bands:
        line.append(pen(d_of(band), start, perimeter(band)))
    line.append(pen(d_of(cap), start + 40, perimeter(cap)))
bands, cap = block.drawing()
# The sides first, left to right, then the face: the logo is written in one stroke.
span = (min(at(p)[0] for b in bands for p in b), max(at(p)[0] for b in bands for p in b))
for band in sorted(bands, key=depth):
    bx = sum(at(p)[0] for p in band) / len(band)
    line.append(pen(d_of(band), 360 + round(240 * (bx - span[0]) / (span[1] - span[0])), perimeter(band), 300))
# Start the face's outline at its left end, so the pen writes the logo from there.
first = min(range(len(cap)), key=lambda i: (round(at(cap[i])[0], 0), -at(cap[i])[1]))
cap = cap[first:] + cap[:first]
line.append(pen(d_of(cap), 300, perimeter(cap), 640))

# The props: a circle for the ball, two ellipses for the ring.
(bx, bz), br = BALL
ball_c = at((bx, TOP + br, bz))
(rx_, rz_), rr, rt = RING
ring_c = at((rx_, TOP + rt, rz_))
SIN_EL = math.sin(EL)


def ellipse_d(c, rx, ry):
    return "M%.1f,%.1f a%.1f,%.1f 0 1 0 %.1f,0 a%.1f,%.1f 0 1 0 %.1f,0Z" % (c[0] - rx, c[1], rx, ry, 2 * rx, rx, ry, -2 * rx)


ring_out = ((rr + rt) * S, (rr + rt) * S * SIN_EL + rt * S * math.cos(EL))
ring_in = ((rr - rt) * S, (rr - rt) * S * SIN_EL)
ring_in_c = (ring_c[0], ring_c[1] - rt * S * math.cos(EL) * 0.55)
line.append(pen(ellipse_d(ring_c, *ring_out), 640, 2 * math.pi * ring_out[0]))
line.append(pen(ellipse_d(ring_in_c, *ring_in), 700, 2 * math.pi * ring_in[0]))
line.append(pen(ellipse_d(ball_c, br * S, br * S), 680, 2 * math.pi * br * S))
line.append("</g>")

# Two patent callouts: a leader from the object to a numeral, one each side.
edge_l, edge_r = cx - half_w + 36, cx + half_w - 36
for label, src, side in (("002", (WIDTH / 2 - 0.16, HEIGHT - 0.02, ZF), 1), ("004", (-(BW / 2 + SETBACK) + 0.1, LOW_T, BD / 2 + SETBACK - 0.12), -1)):
    ax, ay = at(src)
    bx_ = round((edge_r if side > 0 else edge_l) - x0, 1)
    by_ = round(ay - 18, 1)
    lead = "M%s %s Q%s %s %s %s" % (ax, ay, round((ax + bx_) / 2, 1), by_, bx_, by_)
    line.append('<path class="bp-anim bp-pen" pathLength="1" style="--d:760ms;--t:300ms" d="%s" fill="none" stroke="%s" stroke-width="1" stroke-linecap="round"/>' % (lead, INK))
    line.append(
        '<text class="bp-anim bp-ink" x="%s" y="%s" text-anchor="%s" font-style="italic" font-size="13" fill="%s" style="--d:960ms;--t:260ms;font-family:var(--font-serif),Georgia,serif">%s</text>'
        % (bx_ + side * 7, round(by_ + 4.5, 1), "start" if side > 0 else "end", INK, label)
    )
pen_end = max(pen_end, 1220)

# ── COLOUR: the built object ──
sx, sz = -LIGHT[0] / LIGHT[1], -LIGHT[2] / LIGHT[1]  # shadows fall away from the key light: right and back
foot = [(-WIDTH / 2, ZB), (WIDTH / 2, ZB), (WIDTH / 2, ZF), (-WIDTH / 2, ZF)]
h = HEIGHT - TOP
cast = hull(foot + [(x + sx * h, z + sz * h) for x, z in foot])
outer = lower.outline
floor = hull([(x + sx * 0.12, z + sz * 0.12) for x, z in outer] + [(x + sx * HEIGHT * 0.8, z + sz * HEIGHT * 0.8) for x, z in foot])
# Outlines to clip light to: the plinth is convex, so its outline is one hull;
# the block's is its drawing (side bands and face).
plinth_hull = hull([at(p) for prism in (lower, deck) for kind, fs in prism.faces().items() for q in (fs if isinstance(fs, list) else [fs]) for p in q[0]])
logo_sil = " ".join(d_of(b) for b in bands + [cap])
sil = "M" + "L".join("%.1f,%.1f" % p for p in plinth_hull) + "Z " + logo_sil
pool_c = (round(pool_x - x0, 1), round(pool_y - y0, 1))

colour = [
    "<defs>"
    '<filter id="bp-soft" x="-40%%" y="-40%%" width="180%%" height="180%%"><feGaussianBlur stdDeviation="5.4"/></filter>'
    '<filter id="bp-near" x="-40%%" y="-40%%" width="180%%" height="180%%"><feGaussianBlur stdDeviation="2"/></filter>'
    '<filter id="bp-touch" x="-40%%" y="-40%%" width="180%%" height="180%%"><feGaussianBlur stdDeviation="0.9"/></filter>'
    '<radialGradient id="bp-pool" cx="50%%" cy="50%%" r="50%%"><stop offset="0" stop-color="%s" stop-opacity="0.75"/><stop offset="0.45" stop-color="%s" stop-opacity="0.42"/><stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>'
    # Light falls off across the object: brightest toward the key light (upper left), dimmer away from it.
    '<linearGradient id="bp-fall" x1="0.12" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="%s" stop-opacity="0.16"/></linearGradient>'
    # The ball: lit from the upper left, a soft reflection of the box, plum in the core of its shadow.
    '<radialGradient id="bp-ball" cx="0.36" cy="0.3" r="0.78"><stop offset="0" stop-color="%s"/><stop offset="0.16" stop-color="%s"/><stop offset="0.72" stop-color="%s"/><stop offset="1" stop-color="%s"/></radialGradient>'
    '<linearGradient id="bp-ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
    '<clipPath id="bp-sil"><path d="%s"/></clipPath>'
    '<clipPath id="bp-logo"><path d="%s"/></clipPath>'
    "</defs>"
    % (GROUND, GROUND, GROUND, PLUM, shade(YELLOW, 1.0, 0.55), shade(YELLOW, 1.04), shade(YELLOW, 0.8), shade(YELLOW, 0.6), shade(PLUM, 1.3), shade(PLUM, 0.78), sil, logo_sil)
]
colour.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#bp-pool)"/>' % (pool_c[0], pool_c[1], round(POOL_RX, 1), round(POOL_RY, 1)))
colour.append('<polygon points="%s" fill="%s" opacity="0.26" filter="url(#bp-soft)"/>' % (pts_of([(x, 0.0, z) for x, z in floor]), PLUM))
batch = []  # consecutive faces of one fill go out as one path


def flush():
    if batch:
        fill = batch[0][1]
        colour.append('<path d="%s" fill="%s" stroke="%s" stroke-width="0.6" stroke-linejoin="round"/>' % ("".join(d_of(p) for p, _ in batch), fill, fill))
        batch.clear()


for i, (pts, fill, _) in enumerate(faces):
    if batch and batch[0][1] != fill:
        flush()
    if i == DECK_FACES:
        flush()
        # The block's shadow on the deck, drawn straight after the surface it
        # falls on: a soft one, a tighter one, and a thin dark line where it touches.
        colour.append('<polygon points="%s" fill="%s" opacity="0.3" filter="url(#bp-near)"/>' % (pts_of([(x, TOP, z) for x, z in cast]), PLUM))
        colour.append('<polygon points="%s" fill="%s" opacity="0.3" filter="url(#bp-near)"/>' % (pts_of([(x, TOP, z) for x, z in [(-WIDTH / 2 - 0.02, ZB), (WIDTH / 2 + 0.05, ZB - 0.04), (WIDTH / 2 + 0.05, ZF + 0.03), (-WIDTH / 2 - 0.02, ZF + 0.03)]]), PLUM))
        # Under each foot of the logo.
        feet = []
        run = []
        for u, v in logo2d:
            if v < TOP + 0.012:
                run.append(u)
            elif run:
                feet.append((min(run), max(run)))
                run = []
        if run:
            feet.append((min(run), max(run)))
        for a, b in feet:
            touch = [(a + 0.01, TOP, ZF - 0.01), (b - 0.01, TOP, ZF - 0.01), (b + 0.02, TOP, ZF + 0.025), (a - 0.0, TOP, ZF + 0.025)]
            colour.append('<polygon points="%s" fill="%s" opacity="0.5" filter="url(#bp-touch)"/>' % (pts_of(touch), PLUM))
        # The props stand on the deck too: their shadows go under them.
        colour.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" opacity="0.32" filter="url(#bp-near)"/>' % (*at((bx + sx * br * 0.9, TOP, bz + sz * br * 0.9)), br * S * 1.1, br * S * SIN_EL * 1.1, PLUM))
        colour.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" opacity="0.45" filter="url(#bp-touch)"/>' % (*at((bx, TOP, bz)), br * S * 0.5, br * S * 0.5 * SIN_EL, PLUM))
        colour.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" stroke="%s" stroke-width="%.1f" opacity="0.28" filter="url(#bp-near)"/>' % (*at((rx_ + sx * rt, TOP, rz_ + sz * rt)), rr * S, rr * S * SIN_EL, PLUM, rt * S * 2.2))
    batch.append((pts, fill))
flush()
# The props, in front of the block.
colour.append('<path d="%s" fill="url(#bp-ring)"/>' % ellipse_d(ring_c, *ring_out))
colour.append('<path d="%s" fill="%s"/>' % (ellipse_d(ring_in_c, *ring_in), shade(GROUND, 0.94)))
colour.append('<path d="%s" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.8" stroke-linecap="round"/>' % "M%.1f,%.1f a%.1f,%.1f 0 0 1 %.1f,0" % (ring_c[0] - ring_out[0] * 0.78, ring_c[1] - ring_out[1] * 0.42, ring_out[0] * 0.8, ring_out[1] * 0.75, ring_out[0] * 1.2))
colour.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="url(#bp-ball)"/>' % (ball_c[0], ball_c[1], br * S))
colour.append('<rect x="0" y="0" width="%d" height="%d" fill="url(#bp-fall)" clip-path="url(#bp-sil)"/>' % (round(W), round(H)))

# ── GLINT: light on the built object ──
# The build front: a soft seam of light that rises with the colour (the same
# timing as the colour's reveal, set in blueprint-stage.tsx), inside the
# object's outline only. Then, once it is built, one sweep of light across
# the logo, catching its bevels.
glint = [
    "<defs>"
    '<linearGradient id="bp-seam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>'
    '<linearGradient id="bp-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.6"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>'
    "</defs>"
]
glint.append('<g clip-path="url(#bp-sil)"><rect class="bp-anim bp-seam" x="0" y="%d" width="%d" height="12" fill="url(#bp-seam)"/></g>' % (round(H) - 8, round(W)))
logo_px = [at(p) for f in faces if f[2] == "logo" for p in f[0]]
lx0, lx1 = min(p[0] for p in logo_px), max(p[0] for p in logo_px)
glint.append('<g clip-path="url(#bp-logo)"><g transform="skewX(-24)"><rect class="bp-anim bp-sheen" x="%.1f" y="0" width="42" height="%d" fill="url(#bp-sheen)"/></g></g>' % (lx0 - 42 - 10, round(H)))
sheen_travel = (lx1 - lx0) + 42 + 10 + H * math.tan(math.radians(24)) + 10

frac = lambda p: (round((proj(p)[0] - x0) / W, 4), round((proj(p)[1] - y0) / H, 4))
left_base, left_top = frac((-WIDTH / 2, TOP, ZF)), frac((-WIDTH / 2, HEIGHT, ZF))
right_base, right_top = frac((WIDTH / 2, TOP, ZF)), frac((WIDTH / 2, HEIGHT, ZF))

out = os.path.join(ROOT, "app/components/blueprint/loader-art.ts")
with open(out, "w") as fh:
    fh.write("// Generated by scripts/blueprint-loader-art.py — do not edit by hand.\n")
    fh.write("// The page loader's art: the logo as a clay block on the stage's plinth,\n")
    fh.write("// projected with the 3D stage's camera. Three layers that register exactly,\n")
    fh.write("// on a canvas centred on the object.\n\n")
    fh.write("export const LOADER_ART = {\n")
    fh.write("  width: %d,\n  height: %d,\n" % (round(W), round(H)))
    fh.write("  /** Where the block's front edges meet the plinth and where they end, as fractions of the canvas: the path of the build front. */\n")
    fh.write("  left: { x: %s, from: %s, to: %s },\n" % (left_base[0], left_base[1], left_top[1]))
    fh.write("  right: { x: %s, from: %s, to: %s },\n" % (right_base[0], right_base[1], right_top[1]))
    fh.write("  /** When the last line of the drawing is down, in ms. */\n  drawn: %d,\n" % round(pen_end))
    fh.write("  /** How far the sweep of light travels across the logo, in the art's pixels. */\n  sheen: %d,\n" % round(sheen_travel))
    fh.write("  /** The patent drawing. Its strokes are timed by --d and --t (globals.css: .bp-pen). */\n  line: %s,\n" % json.dumps("".join(line)))
    fh.write("  /** The built object. */\n  colour: %s,\n" % json.dumps("".join(colour)))
    fh.write("  /** Light on the built object: the build front's seam and the sweep (globals.css: .bp-seam, .bp-sheen). */\n  glint: %s,\n" % json.dumps("".join(glint)))
    fh.write("};\n")
print("wrote", os.path.relpath(out, ROOT), "%dx%d" % (round(W), round(H)), "faces", len(faces), "drawn", round(pen_end), "bytes", os.path.getsize(out))
