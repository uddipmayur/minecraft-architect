# Shape Generator Algorithms — Python Implementations

Ready-to-use functions for generating Minecraft structural geometry.
Copy these directly into build scripts.

```python
import math
import random
from typing import Callable


# ═══════════════════════════════════════════════════════════════
# CIRCLE / CYLINDER
# ═══════════════════════════════════════════════════════════════

def circle_filled(cx: int, cz: int, radius: float):
    """Yields (x, z) for all blocks inside a filled circle."""
    r2 = radius * radius
    for x in range(int(cx - radius) - 1, int(cx + radius) + 2):
        for z in range(int(cz - radius) - 1, int(cz + radius) + 2):
            if (x - cx) ** 2 + (z - cz) ** 2 <= r2:
                yield x, z


def circle_shell(cx: int, cz: int, radius: float, thickness: float = 1.0):
    """Yields (x, z) for blocks on the ring (shell) of a circle."""
    r_outer2 = radius * radius
    r_inner2 = (radius - thickness) ** 2
    for x in range(int(cx - radius) - 1, int(cx + radius) + 2):
        for z in range(int(cz - radius) - 1, int(cz + radius) + 2):
            d2 = (x - cx) ** 2 + (z - cz) ** 2
            if r_inner2 <= d2 <= r_outer2:
                yield x, z


def cylinder(cx: int, cz: int, radius: float, y_start: int, y_end: int,
             hollow: bool = False, thickness: float = 1.0):
    """Yields (x, y, z) for a vertical cylinder."""
    gen = circle_shell if hollow else circle_filled
    kwargs = {"thickness": thickness} if hollow else {}
    for y in range(y_start, y_end + 1):
        for x, z in gen(cx, cz, radius, **kwargs):
            yield x, y, z


# ═══════════════════════════════════════════════════════════════
# SPHERE / DOME
# ═══════════════════════════════════════════════════════════════

def sphere_filled(cx: int, cy: int, cz: int, radius: float):
    """Yields (x, y, z) for all blocks inside a filled sphere."""
    r2 = radius * radius
    ri = int(radius) + 1
    for x in range(cx - ri, cx + ri + 1):
        for y in range(cy - ri, cy + ri + 1):
            for z in range(cz - ri, cz + ri + 1):
                if (x - cx)**2 + (y - cy)**2 + (z - cz)**2 <= r2:
                    yield x, y, z


def sphere_shell(cx: int, cy: int, cz: int, radius: float,
                 thickness: float = 1.0):
    """Yields (x, y, z) for blocks on the surface shell of a sphere."""
    r_outer2 = radius * radius
    r_inner2 = (radius - thickness) ** 2
    ri = int(radius) + 1
    for x in range(cx - ri, cx + ri + 1):
        for y in range(cy - ri, cy + ri + 1):
            for z in range(cz - ri, cz + ri + 1):
                d2 = (x - cx)**2 + (y - cy)**2 + (z - cz)**2
                if r_inner2 <= d2 <= r_outer2:
                    yield x, y, z


def dome(cx: int, cy: int, cz: int, radius: float, thickness: float = 1.0):
    """Yields (x, y, z) for the upper half of a hollow sphere (dome)."""
    for x, y, z in sphere_shell(cx, cy, cz, radius, thickness):
        if y >= cy:
            yield x, y, z


# ═══════════════════════════════════════════════════════════════
# ELLIPSE / ELLIPSOID
# ═══════════════════════════════════════════════════════════════

def ellipse_filled(cx: int, cz: int, rx: float, rz: float):
    """Yields (x, z) for a filled ellipse."""
    for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
        for z in range(int(cz - rz) - 1, int(cz + rz) + 2):
            if ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 <= 1:
                yield x, z


def ellipsoid_shell(cx, cy, cz, rx, ry, rz, thickness=1.0):
    """Yields (x, y, z) for a hollow ellipsoid surface."""
    for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for z in range(int(cz - rz) - 1, int(cz + rz) + 2):
                d = ((x-cx)/rx)**2 + ((y-cy)/ry)**2 + ((z-cz)/rz)**2
                d_inner = ((x-cx)/(rx-thickness))**2 + \
                          ((y-cy)/(ry-thickness))**2 + \
                          ((z-cz)/(rz-thickness))**2
                if d <= 1 and d_inner >= 1:
                    yield x, y, z


# ═══════════════════════════════════════════════════════════════
# ARCH
# ═══════════════════════════════════════════════════════════════

def arch(x_start: int, y_base: int, z_pos: int,
         width: int, height: int):
    """
    Yields (x, y, z) for a semicircular arch along the X axis.
    """
    cx = x_start + width / 2.0
    r = width / 2.0
    # Vertical pillars
    for y in range(y_base, y_base + height - int(r)):
        yield x_start, y, z_pos
        yield x_start + width - 1, y, z_pos
    # Curved top
    for x in range(width):
        dx = (x + 0.5) - (width / 2.0)
        if abs(dx) <= r:
            curve_y = math.sqrt(r**2 - dx**2)
            y = y_base + height - int(r) + round(curve_y)
            yield x_start + x, y, z_pos


# ═══════════════════════════════════════════════════════════════
# SPIRAL STAIRCASE
# ═══════════════════════════════════════════════════════════════

def spiral_staircase(cx: int, cz: int, y_start: int,
                     total_steps: int, radius: float,
                     steps_per_revolution: int = 16):
    """
    Yields (x, y, z, facing) for a spiral staircase.
    `facing` is one of 'north', 'south', 'east', 'west'.
    """
    for step in range(total_steps):
        angle = step * (2 * math.pi / steps_per_revolution)
        x = cx + round(radius * math.cos(angle))
        z = cz + round(radius * math.sin(angle))
        y = y_start + step

        # Determine stair facing (perpendicular to radius, clockwise)
        # The stair's "full side" faces the direction you walk UP from
        facing_angle = angle + math.pi / 2
        if -math.pi/4 <= facing_angle % (2*math.pi) < math.pi/4:
            facing = "east"
        elif math.pi/4 <= facing_angle % (2*math.pi) < 3*math.pi/4:
            facing = "south"
        elif 3*math.pi/4 <= facing_angle % (2*math.pi) < 5*math.pi/4:
            facing = "west"
        else:
            facing = "north"

        yield x, y, z, facing


# ═══════════════════════════════════════════════════════════════
# LINE (Bresenham 3D)
# ═══════════════════════════════════════════════════════════════

def line_3d(x0, y0, z0, x1, y1, z1):
    """Yields (x, y, z) for all blocks along a 3D line (Bresenham)."""
    dx = abs(x1 - x0); dy = abs(y1 - y0); dz = abs(z1 - z0)
    sx = 1 if x1 > x0 else -1
    sy = 1 if y1 > y0 else -1
    sz = 1 if z1 > z0 else -1

    dm = max(dx, dy, dz)
    x, y, z = x0, y0, z0
    ex = ey = ez = dm // 2

    for _ in range(dm + 1):
        yield x, y, z
        ex -= dx; ey -= dy; ez -= dz
        if ex < 0: ex += dm; x += sx
        if ey < 0: ey += dm; y += sy
        if ez < 0: ez += dm; z += sz


# ═══════════════════════════════════════════════════════════════
# TEXTURING HELPER
# ═══════════════════════════════════════════════════════════════

def textured_block(primary: str, mix: list[str],
                   mix_chance: float = 0.15,
                   seed: int | None = None) -> str:
    """
    Returns a block ID with controlled random variation.
    Use for wall texturing to avoid monotonous surfaces.
    """
    rng = random.Random(seed) if seed is not None else random
    if rng.random() < mix_chance:
        return rng.choice(mix)
    return primary


def gradient_block(y: int, gradient_map: list[tuple[int, str]]) -> str:
    """
    Returns the block type for a given Y level based on a gradient map.
    gradient_map: [(max_y, block_id), ...] sorted ascending.
    Example: [(3, "deepslate_bricks"), (6, "stone_bricks"), (99, "smooth_stone")]
    """
    for max_y, block in gradient_map:
        if y <= max_y:
            return block
    return gradient_map[-1][1]
```
