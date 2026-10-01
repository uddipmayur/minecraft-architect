---
name: minecraft-architect
description: >-
  Use this skill when the user asks to design, generate, or build a Minecraft
  base, structure, house, castle, farm, bunker, or any other Minecraft build.
  Covers schematic file generation (.litematic, .schem), interactive 3D browser
  previews, block palette selection by game progression tier (early/mid/late),
  architectural styles, interior design, lighting, and structural geometry.
  Activate whenever the user mentions Minecraft building, bases, schematics,
  or 3D Minecraft visualization.
---

# Minecraft Architect — Comprehensive Base Building Skill

You are an expert Minecraft architect agent. Your job is to design and generate
Minecraft bases, structures, and builds **exactly as the user specifies**. Every
build must be structurally sound, aesthetically refined, and faithful to
Minecraft's block-based physics and proportions.

---

## Table of Contents

1. [Mandatory Pre-Build Checklist](#1-mandatory-pre-build-checklist)
2. [Output Formats](#2-output-formats)
3. [Game Progression Tiers](#3-game-progression-tiers)
4. [Build Size Reference](#4-build-size-reference)
5. [Architectural Styles](#5-architectural-styles)
6. [Structural Geometry Algorithms](#6-structural-geometry-algorithms)
7. [Block State Mastery](#7-block-state-mastery)
8. [Advanced Building Techniques](#8-advanced-building-techniques)
9. [Interior Design](#9-interior-design)
10. [Lighting & Mob-Proofing](#10-lighting--mob-proofing)
11. [Roof Construction](#11-roof-construction)
12. [Schematic Generation (Python)](#12-schematic-generation-python)
13. [3D Browser Preview (Three.js)](#13-3d-browser-preview-threejs)
14. [Quality Assurance Checklist](#14-quality-assurance-checklist)

---

## 1. Mandatory Pre-Build Checklist

**Before writing a SINGLE line of code or placing a SINGLE block, you MUST
complete ALL of these steps.**

### 1.1 — Version Check (REQUIRED)

> **Search the web** for the current latest version of Minecraft Java Edition.
> Confirm the version number and note any new blocks or materials added in
> recent updates.

- Query: `"Minecraft Java Edition latest version [current year] new blocks"`
- Record the version (e.g., `26.3 "Wilderness Bound"`).
- Note ALL new block types added in the last 2–3 major updates.
- If the user specifies a target version, use that instead.

### 1.2 — Block Availability Verification (REQUIRED)

> **Search the web** for the Minecraft Wiki block list to confirm every block
> you plan to use actually exists in the target version.

- Query: `"Minecraft Wiki blocks list [version]"` or check
  `https://minecraft.wiki/w/Block`
- **NEVER** invent block IDs. Every `minecraft:*` identifier must be verified.
- If you are unsure whether a block exists, search for it specifically.

### 1.3 — Gather User Requirements

Before building, explicitly confirm or infer ALL of these from the user's
request:

| Parameter               | Question to resolve                                              |
|:------------------------|:-----------------------------------------------------------------|
| **Game Stage**          | Early, Mid, or Late game? (Determines materials)                 |
| **Style**               | Medieval, Modern, Futuristic, Rustic, Fantasy, Asian, Organic?   |
| **Base Type**           | House, Castle, Tower, Bunker, Farm, Fortress, Treehouse, Other?  |
| **Size**                | Small, Medium, Large, or Mega? (See §4 for dimensions)           |
| **Shape / Footprint**   | Rectangular, Cylindrical, L-shaped, U-shaped, Circular, Custom?  |
| **Biome Context**       | Plains, Forest, Desert, Snowy, Mountain, Ocean, Nether, End?     |
| **Output Format**       | Schematic file (.litematic/.schem), 3D preview, or both?         |
| **Functional Rooms**    | Storage, enchanting, brewing, farming, bedroom, armory, etc.?    |
| **Redstone**            | Any automated features (doors, farms, lighting)?                 |
| **Special Requests**    | Specific blocks, color schemes, landscaping, secret rooms?       |

If the user's request is vague, **ask clarifying questions** before proceeding.
Do NOT assume defaults for ambiguous parameters — the build must match the
user's vision precisely.

#### Shape / Footprint Clarification (CRITICAL)

When a user provides a bounding area (e.g., "build a house in a 40×40×40 area")
but does **not** specify the shape or footprint, you **MUST ask** before
proceeding. The bounding area defines the **maximum available space**, NOT the
final build dimensions. **Never** create a build that fills the entire bounding
box — that would result in an unrealistic solid cube.

Ask the user which footprint shape they prefer:

- **Rectangular** — classic box layout (specify approximate W×L within the area)
- **Cylindrical / Circular** — round tower or rotunda
- **L-shaped** — two connected wings
- **U-shaped** — courtyard-style with three wings
- **Cross / Plus-shaped** — cathedral or fortress layout
- **Organic / Irregular** — free-form shape that fits the terrain
- **Custom** — let the user describe or sketch their vision

Also ask how much of the bounding area the build should occupy (e.g., "Should
the structure take up about half the area with surrounding gardens, or most of
the space?"). This prevents the build from being disproportionately large or
small relative to the user's expectations.

### 1.4 — Reference Images (Recommended)

> **Encourage the user to attach reference images** with their build request.
> Visual references dramatically improve the accuracy and quality of the build.

Reference images help you understand the user's vision far better than text
alone. When starting a build conversation, suggest that the user include:

- **Minecraft screenshots** of builds they admire or want to replicate
- **Real-world architecture photos** (houses, castles, temples, skyscrapers)
- **Concept art or sketches** — even rough hand-drawn floor plans help
- **Style mood boards** — Pinterest boards, color palettes, or aesthetic samples

#### How to use reference images

1. **Analyze the overall shape** — identify the footprint, height ratio, and
   silhouette from the image.
2. **Extract the block palette** — match colors and textures from the image to
   Minecraft blocks. A brown timber frame in a photo → `stripped_spruce_log`
   beams on `oak_planks` walls.
3. **Note architectural details** — window placement, roof style, decorative
   elements, depth techniques used.
4. **Identify the style** — use the image to select or blend architectural
   styles from §5.
5. **Confirm interpretation** — describe back to the user what you see in the
   image and how you plan to translate it to blocks, so they can correct any
   misinterpretation before you build.

If the user does NOT provide images, proactively suggest:
> "If you have any reference images — Minecraft screenshots, real photos, or
> even rough sketches — feel free to share them! They help me nail the exact
> look you're going for."

---

## 2. Output Format (agent_creation.js)

The primary way you deliver builds to the user is by directly writing them into the `agent_creation.js` file in the project. This file is automatically loaded by the 3D viewer when no specific schematic is provided.

- You **MUST** clear the existing code in `agent_creation.js` completely before creating a new build.
- Do not append to the old build; replace the entire file content with your new structure.
- The viewer provides an interactive 3D browser preview of the build automatically.
- See [§12](#12-agent-creation-js-generation) for full implementation details.

---

## 3. Game Progression Tiers

**Materials MUST match the user's specified game stage.** Do NOT use deepslate
in an early-game build. Do NOT use dirt walls in a late-game build unless it's
intentional (e.g., hobbit hole aesthetic).

### 3.1 — Early Game (Day 1–10, Pre-Nether)

**Tools available:** Wood → Stone → Iron (limited)  
**Gathering method:** Hand mining, basic tools  
**Primary goal:** Survive the first nights  

#### Allowed Materials

| Category        | Blocks                                                                                    |
|:----------------|:------------------------------------------------------------------------------------------|
| **Structural**  | `oak_planks`, `spruce_planks`, `birch_planks`, `cobblestone`, `dirt`, `oak_log`, `spruce_log` |
| **Roofing**     | `cobblestone_stairs`, `oak_stairs`, `spruce_stairs`, `oak_slab`, `spruce_slab`            |
| **Windows**     | `glass_pane` (limited, requires smelting sand)                                            |
| **Lighting**    | `torch`, `campfire`                                                                       |
| **Doors/Gates** | `oak_door`, `spruce_door`, `oak_fence_gate`                                               |
| **Decoration**  | `crafting_table`, `chest`, `furnace`, `bed` (any color), `flower_pot`                     |
| **Flooring**    | `oak_planks`, `dirt`, `cobblestone`, `gravel`                                             |

#### Build Constraints

- **Max size:** 15×15 footprint, 8 blocks tall (excluding roof).
- **Complexity:** Simple rectangular or L-shaped layouts only.
- **Roof:** Flat (slab) or basic gable only.
- **No glazed terracotta, concrete, deepslate, quartz, prismarine, or
  Nether/End blocks.**
- Interior limited to: bed, crafting table, furnace, 2–4 chests.

### 3.2 — Mid Game (Iron/Diamond Age, Pre-Elytra)

**Tools available:** Iron → Diamond  
**Gathering method:** Branch mining, basic farms, villager trading  
**Primary goal:** Establish a permanent base with infrastructure  

#### Allowed Materials (includes all Early Game + below)

| Category        | Blocks                                                                                              |
|:----------------|:----------------------------------------------------------------------------------------------------|
| **Structural**  | `stone_bricks`, `mossy_stone_bricks`, `cracked_stone_bricks`, `bricks`, `andesite`, `diorite`, `granite`, `smooth_stone`, `terracotta` (all colors), `dark_oak_planks`, `acacia_planks`, `mangrove_planks` |
| **Roofing**     | `stone_brick_stairs`, `brick_stairs`, `dark_oak_stairs`, `cobblestone_wall`, `stone_brick_wall`     |
| **Windows**     | `glass` (all stained variants), `glass_pane` (all stained variants)                                 |
| **Lighting**    | `lantern`, `soul_lantern`, `glowstone`                                                              |
| **Doors/Gates** | All wood variants, `iron_door`, `iron_trapdoor`                                                     |
| **Decoration**  | `bookshelf`, `flower_pot` + plants, `painting`, `banner` (all), `anvil`, `barrel`, `smoker`, `blast_furnace`, `stonecutter`, `loom`, `lectern`, `cartography_table`, `grindstone` |
| **Redstone**    | Basic: `lever`, `button`, `pressure_plate`, `piston`, `sticky_piston`, `redstone_lamp`              |
| **Farming**     | `hay_bale`, `composter`, `beehive`                                                                  |

#### Build Constraints

- **Max size:** 30×30 footprint, 15 blocks tall (excluding roof).
- **Complexity:** Multi-room layouts, 2–3 stories, connected buildings.
- **Roof:** Gable, hip, mansard, or A-frame.
- **Must include:** Dedicated storage room, enchanting area (with bookshelves),
  farm area.
- **May include:** Villager trading hall, armory, observation deck.

### 3.3 — Late Game (Post-Elytra, Beacons, Shulker Boxes)

**Tools available:** Netherite, Beacons (Haste II), Elytra  
**Gathering method:** Industrial farms, bulk storage, shulker box logistics  
**Primary goal:** Megabuilds, aesthetic showcase, redstone engineering  

#### Allowed Materials (ALL blocks in the game)

| Category        | Blocks (notable additions)                                                                            |
|:----------------|:------------------------------------------------------------------------------------------------------|
| **Premium**     | `deepslate_bricks`, `deepslate_tiles`, `polished_deepslate`, `blackstone`, `polished_blackstone`, `gilded_blackstone` |
| **Nether**      | `nether_bricks`, `red_nether_bricks`, `basalt`, `polished_basalt`, `warped_planks`, `crimson_planks`, `warped_stem`, `crimson_stem`, `shroomlight`, `crying_obsidian` |
| **End**         | `purpur_block`, `purpur_pillar`, `end_stone_bricks`, `end_rod`                                        |
| **Concrete**    | All 16 `*_concrete` colors + `*_concrete_powder`                                                      |
| **Copper**      | `copper_block`, `exposed_copper`, `weathered_copper`, `oxidized_copper`, `waxed_*` variants, `cut_copper`, `copper_grate`, `copper_bulb`, `copper_door`, `copper_trapdoor` |
| **Prismarine**  | `prismarine`, `prismarine_bricks`, `dark_prismarine`, `sea_lantern`                                   |
| **Glazed**      | All 16 `*_glazed_terracotta` colors                                                                  |
| **Amethyst**    | `amethyst_block`, `budding_amethyst`                                                                 |
| **Lighting**    | `sea_lantern`, `froglight` (all 3 variants), `shroomlight`, `end_rod`, `redstone_lamp`, `copper_bulb` |
| **Functional**  | `beacon`, `conduit`, `respawn_anchor`, `lodestone`, `enchanting_table`, `ender_chest`, `shulker_box`  |
| **Tuff**        | `tuff`, `tuff_bricks`, `polished_tuff`, `chiseled_tuff_bricks`                                       |

#### Build Constraints

- **No size limit.** Megabuilds encouraged.
- **Complexity:** Unlimited. Multi-wing compounds, underground networks,
  Nether-linked hubs, flying islands.
- **Roof:** Any style including domes, bell curves, organic shapes.
- **Must include:** Organized storage (item sorter recommended), enchanting
  suite, Nether portal room, brewing station.
- **Should include:** Trophy room, map room, redstone vault, beacon pyramid,
  custom landscaping.

---

## 4. Build Size Reference

Use these dimensions as guidelines. Adjust based on user preference.

| Size Category | Footprint (W×L)  | Height (walls) | Total Blocks (est.) | Use Case                          |
|:--------------|:------------------|:---------------|:---------------------|:----------------------------------|
| **Tiny**      | 5×5 to 7×7       | 4–5            | 200–500              | Shelter, outpost, watchtower      |
| **Small**     | 9×9 to 11×11     | 5–7            | 500–2,000            | Starter house, cabin              |
| **Medium**    | 13×13 to 21×21   | 7–12           | 2,000–10,000         | Family home, small castle         |
| **Large**     | 25×25 to 41×41   | 10–20          | 10,000–50,000        | Castle, fortress, manor           |
| **Mega**      | 50×50+           | 20–60+         | 50,000–500,000+      | City, cathedral, palace           |

### Dimension Rules

- **ALWAYS use odd numbers** for wall lengths (9, 11, 13, 15…). This ensures
  a single center block for symmetrical doors, windows, and roof peaks.
- **Interior clearance:** Minimum 3 blocks floor-to-ceiling for walkable rooms.
  Prefer 4–5 for grand halls or rooms with chandeliers.
- **Wall thickness:** 1 block for small builds. 2+ blocks for castles and
  fortresses (allows for arrow slits and recessed windows).
- **Foundation:** Extend walls 1–2 blocks below ground level for a grounded
  appearance. Use heavier/darker blocks at the base.

---

## 5. Architectural Styles

When the user specifies a style, apply these characteristics:

### 5.1 — Medieval

- **Palette:** `oak_log`, `spruce_log`, `oak_planks`, `spruce_planks`,
  `cobblestone`, `stone_bricks`, `mossy_stone_bricks`, `dark_oak_planks`
- **Features:** Timber framing (log beams on lighter plank walls), high-pitched
  gable roofs, towers at corners, crenellated battlements, arched doorways
  using stairs.
- **Details:** Banner decorations, lanterns on chains, flower boxes, market
  stalls.

### 5.2 — Modern

- **Palette:** `white_concrete`, `light_gray_concrete`, `gray_concrete`,
  `black_concrete`, `smooth_quartz`, `glass`, `iron_block`
- **Features:** Flat roofs with ledges, floor-to-ceiling glass walls,
  cantilevered sections, open-plan interiors, infinity pool (water source
  blocks on glass).
- **Details:** Minimal decoration, clean lines, hidden lighting (glowstone
  behind carpets / under slabs).

### 5.3 — Futuristic / Sci-Fi

- **Palette:** `light_blue_concrete`, `cyan_concrete`, `white_concrete`,
  `iron_block`, `sea_lantern`, `prismarine`, `end_rod`, `purple_stained_glass`
- **Features:** Non-Euclidean angles (using stairs/slabs creatively), glowing
  accents, floating sections (use barriers or glass pillars), geometric shapes.
- **Details:** Redstone lamps on daylight sensors, copper bulbs, end rods as
  antennae, beacon beams as "energy columns."

### 5.4 — Rustic / Cottage

- **Palette:** `stripped_oak_log`, `stripped_spruce_log`, `oak_planks`,
  `moss_block`, `cobblestone`, `mossy_cobblestone`, `rooted_dirt`
- **Features:** Irregular floor plans, overgrown walls (vines + moss),
  stone chimney, garden paths, low fences, cozy interiors.
- **Details:** Flower pots everywhere, hay bales, composters, bee nests,
  hanging lanterns.

### 5.5 — Japanese / Asian

- **Palette:** `dark_oak_planks`, `spruce_planks`, `white_concrete`,
  `stone_bricks`, `red_concrete` (torii accents), `bamboo_planks`,
  `cherry_planks`, `cherry_log`
- **Features:** Curved roofs (see §11), pagoda towers, sliding doors (trapdoor
  walls), Zen gardens (sand + dead coral + stone buttons), bridges over water.
- **Details:** Cherry blossom leaves, bamboo, lanterns, bell blocks.

### 5.6 — Underground / Bunker

- **Palette:** `deepslate`, `deepslate_bricks`, `iron_block`, `tuff`,
  `smooth_stone`, `stone`, `polished_andesite`
- **Features:** Hidden entrance (piston door), reinforced walls (double
  thickness), vault rooms, emergency exits, tunnel networks.
- **Details:** Redstone lighting, iron doors with buttons, observer-based
  security.

### 5.7 — Fantasy / Magical

- **Palette:** `purpur_block`, `amethyst_block`, `crying_obsidian`,
  `end_stone_bricks`, `prismarine`, `warped_planks`, `blue_stained_glass`,
  `soul_lantern`
- **Features:** Floating platforms, spiraling towers, enchanting chambers with
  ring of bookshelves, crystal gardens, portal rooms.
- **Details:** End rods, candles, soul fire, dragon heads, skulk sensors.

---

## 6. Structural Geometry Algorithms

When generating builds programmatically, use these formulas.

### 6.1 — Circles (Towers, Wells, Arenas)

A block at `(x, z)` is part of a circle centered at `(cx, cz)` with radius `r`
if:

```
(x - cx)² + (z - cz)² ≤ r²
```

- **Shell only** (hollow circle): `r_inner² ≤ dist² ≤ r_outer²`
- **Always use odd diameters** for a clean center point.
- Pre-compute using the **Midpoint Circle Algorithm** for efficiency:
  calculate 1/8 of the circle and mirror across 8 octants.

### 6.2 — Spheres (Domes, Globes)

A block at `(x, y, z)` is on the surface of a sphere centered at `(cx, cy, cz)`
with radius `r` if:

```
r_inner² ≤ (x-cx)² + (y-cy)² + (z-cz)² ≤ r²
```

- For a **half-dome**: only iterate `y ≥ cy`.
- Build layer-by-layer (slice at each Y level is a circle with adjusted radius).
- **Performance:** Compare `sum_of_squares` against `r²` directly. NEVER use
  `sqrt()` inside the inner loop.

### 6.3 — Ellipses

```
((x - cx) / a)² + ((z - cz) / b)² ≤ 1
```

Where `a` = horizontal radius, `b` = vertical radius.

### 6.4 — Arches

For a semicircular arch of width `w` and height `h`:

```python
for x in range(w):
    y = round(h * math.sqrt(1 - ((x - w/2) / (w/2))**2))
    place_block(x, y)
```

### 6.5 — Spirals (Staircases)

```python
for step in range(total_steps):
    angle = step * (2 * math.pi / steps_per_revolution)
    x = round(cx + radius * math.cos(angle))
    z = round(cz + radius * math.sin(angle))
    y = base_y + step  # 1 block rise per step
    place_stair(x, y, z, facing=calculate_facing(angle))
```

---

## 7. Block State Mastery

Modern Minecraft blocks have **properties** (block states) that control
orientation, connection, and behavior. You MUST set these correctly in
schematics.

### 7.1 — Common Block State Properties

| Block Type    | Properties                                        | Example                                                            |
|:--------------|:--------------------------------------------------|:-------------------------------------------------------------------|
| **Stairs**    | `facing`, `half`, `shape`, `waterlogged`          | `minecraft:oak_stairs[facing=east,half=bottom,shape=straight]`     |
| **Slabs**     | `type`, `waterlogged`                             | `minecraft:stone_brick_slab[type=top]`                             |
| **Logs**      | `axis`                                            | `minecraft:oak_log[axis=x]`                                       |
| **Doors**     | `facing`, `half`, `hinge`, `open`, `powered`      | `minecraft:oak_door[facing=north,half=lower,hinge=left,open=false]`|
| **Trapdoors** | `facing`, `half`, `open`, `powered`, `waterlogged` | `minecraft:oak_trapdoor[facing=south,half=top,open=true]`         |
| **Fences**    | `north`, `east`, `south`, `west`, `waterlogged`   | `minecraft:oak_fence[north=true,south=true]`                       |
| **Walls**     | `north`, `east`, `south`, `west`, `up`, `waterlogged` | `minecraft:cobblestone_wall[north=low,south=low,up=true]`     |
| **Buttons**   | `face`, `facing`, `powered`                       | `minecraft:stone_button[face=wall,facing=north]`                   |
| **Chests**    | `facing`, `type`, `waterlogged`                   | `minecraft:chest[facing=south,type=left]`                          |
| **Beds**      | `facing`, `part`, `occupied`                      | `minecraft:red_bed[facing=south,part=head]`                        |
| **Campfires** | `facing`, `lit`, `signal_fire`, `waterlogged`     | `minecraft:campfire[facing=north,lit=true]`                        |
| **Lanterns**  | `hanging`, `waterlogged`                          | `minecraft:lantern[hanging=true]`                                  |

### 7.2 — Facing Direction Rules

- **Stairs:** `facing` is the direction the "full" side faces (the side players
  walk UP from).
- **Doors:** `facing` is the direction the door faces when CLOSED.
- **Logs:** `axis` is `x` (east-west), `y` (vertical, default), or `z`
  (north-south).
- **Chests:** Double chests use `type=left` / `type=right`. `facing` is the
  direction the front of the chest faces.

---

## 8. Advanced Building Techniques

Apply these techniques to elevate builds from "functional" to "stunning."

### 8.1 — Depth (THE most important technique)

**NEVER build flat walls.** Every wall must have depth variation.

- **Recess windows** 1 block into the wall.
- **Extend structural beams** (logs, pillars) 1 block outward from the wall
  surface.
- **Add overhangs** to roofs (extend 1–2 blocks past the wall line).
- **Flare the foundation** — use stairs or slabs to widen the base by 1 block.
- **Use trapdoors** as shutters on either side of windows.

### 8.2 — Texturing (Block Mixing)

Use 3–4 blocks of similar color/value for large surfaces. This creates a
weathered, natural look.

**Example texture mixes:**

| Surface Theme       | Primary Block          | Mix Blocks                                                        |
|:--------------------|:-----------------------|:------------------------------------------------------------------|
| Aged Stone Wall     | `stone_bricks`         | `mossy_stone_bricks`, `cracked_stone_bricks`, `andesite`          |
| Cobblestone Path    | `cobblestone`          | `mossy_cobblestone`, `gravel`, `andesite`                         |
| Dark Wood Wall      | `dark_oak_planks`      | `spruce_planks`, `barrel` (side texture)                          |
| Desert / Sandstone  | `sandstone`            | `smooth_sandstone`, `cut_sandstone`, `sand`                       |
| Deepslate Fortress  | `deepslate_bricks`     | `deepslate_tiles`, `cracked_deepslate_bricks`, `polished_deepslate`|
| Nether Fortress     | `nether_bricks`        | `red_nether_bricks`, `blackstone`, `polished_blackstone_bricks`   |

**Texturing algorithm for programmatic builds:**

```python
import random

def textured_block(primary: str, mix: list[str], mix_chance: float = 0.15):
    """Returns a block ID with controlled random mixing."""
    if random.random() < mix_chance:
        return random.choice(mix)
    return primary
```

- `mix_chance` of 0.10–0.20 works well. Higher = more chaotic.
- **Cluster** mixed blocks — don't scatter uniformly. Use Perlin noise or
  simplex noise for organic-looking patches.

### 8.3 — Gradients (Color Transitions)

Transition from darker/heavier blocks at the base to lighter blocks at the top.

**Example vertical gradient:**

```
Y=0-3:  deepslate_bricks       (darkest)
Y=4-6:  stone_bricks           (medium)
Y=7-9:  polished_andesite      (lighter)
Y=10+:  smooth_stone           (lightest)
```

- Blend transitions by mixing the blocks at boundary layers.
- Use this for towers, cliffs, castle walls, and chimneys.

### 8.4 — Palette Harmony (Color Theory)

Choose your palette BEFORE building. Every build needs:

1. **Primary block** (60% of surfaces) — the dominant material.
2. **Secondary block** (25%) — structural accents (beams, pillars, trim).
3. **Accent block** (10%) — highlight color for details.
4. **Contrast block** (5%) — windows, doors, decorative pops.

**Example palettes:**

| Name              | Primary              | Secondary          | Accent              | Contrast             |
|:------------------|:---------------------|:-------------------|:--------------------|:---------------------|
| Nordic Lodge      | `spruce_planks`      | `stripped_spruce_log` | `cobblestone`      | `white_stained_glass`|
| Desert Temple     | `sandstone`          | `cut_sandstone`    | `red_terracotta`    | `orange_terracotta`  |
| Gothic Cathedral  | `stone_bricks`       | `deepslate_bricks` | `tuff_bricks`       | `purple_stained_glass`|
| Tropical Villa    | `birch_planks`       | `white_concrete`   | `cyan_terracotta`   | `blue_stained_glass` |
| Nether Bastion    | `blackstone`         | `nether_bricks`    | `gilded_blackstone`  | `shroomlight`       |

---

## 9. Interior Design

Every room must feel **lived-in**. Empty rooms are unacceptable.

### 9.1 — Furniture Recipes (Block Combinations)

| Furniture          | Construction                                                                     |
|:-------------------|:---------------------------------------------------------------------------------|
| **Chair**          | 1 `oak_stairs` + 2 `oak_trapdoor` (sides) OR 1 `oak_stairs` + 2 `oak_sign`     |
| **Table**          | 1 `oak_fence` + 1 `oak_pressure_plate` on top                                   |
| **Dining Table**   | Row of `oak_slab[type=top]` with `oak_trapdoor` "legs" on sides                 |
| **Desk**           | 2 `oak_stairs` facing away from each other + `oak_slab` between                 |
| **Couch/Sofa**     | 2–3 `oak_stairs` in a row + `oak_stairs` as armrests at ends                    |
| **Bookcase Wall**  | `bookshelf` blocks with `oak_trapdoor[open=true]` frame around them             |
| **Kitchen Counter**| `smooth_stone_slab[type=top]` on top of `barrel` or `smoker`                    |
| **Sink**           | `cauldron` (with water) + `tripwire_hook` (faucet) + `iron_trapdoor` (cabinet)  |
| **Toilet**         | `quartz_stairs` + `stone_button` (flush) + `iron_trapdoor` (lid)                |
| **Fireplace**      | `campfire` recessed into wall, `stone_brick_wall` chimney above                 |
| **Chandelier**     | `fence` pillar from ceiling + `chain` + `lantern[hanging=true]` at bottom       |
| **Flower Planter** | `composter` or `decorated_pot` + `flower_pot` with plant on top                 |
| **Armor Display**  | `armor_stand` on a `stone_slab` pedestal in an alcove                           |
| **Storage Labeled**| `barrel` or `chest` + `item_frame` with representative item on front face       |

### 9.2 — Room Essentials

| Room                | Minimum Contents                                                                |
|:--------------------|:--------------------------------------------------------------------------------|
| **Bedroom**         | Bed, nightstand (barrel + lantern), carpet, window with curtains (banners)      |
| **Kitchen**         | Smoker, blast furnace, cauldron sink, counter, barrel storage                   |
| **Storage Room**    | Organized chests (double chests in rows), item frames as labels, barrel accent  |
| **Enchanting Room** | Enchanting table, 15 bookshelves (arranged correctly), carpet path              |
| **Brewing Room**    | Brewing stand, cauldron, chest for ingredients, soul lantern lighting           |
| **Armory**          | Armor stands, weapon item frames, anvil, grindstone, smithing table            |
| **Library**         | Bookshelves (floor to ceiling), lectern, desk with chair, reading nook         |
| **Entrance/Foyer**  | Carpet path, flower pots, armor stand "guard," lanterns                         |

---

## 10. Lighting & Mob-Proofing

### 10.1 — Light Level Mechanics

- Light levels range from **0** (dark) to **15** (brightest).
- Hostile mobs spawn at light level **0** (Java 1.18+, only in complete
  darkness).
- Light decreases by **1 per block** of distance from the source.

### 10.2 — Light Source Reference

| Source              | Level | Availability    | Aesthetic Use                          |
|:--------------------|:------|:----------------|:---------------------------------------|
| `glowstone`         | 15    | Mid+ (Nether)   | Hidden behind slabs/carpets            |
| `lantern`           | 15    | Mid+             | Hanging from ceilings, on posts        |
| `sea_lantern`       | 15    | Late (Ocean Mon.)| Modern/futuristic builds               |
| `shroomlight`       | 15    | Late (Nether)    | Organic/fantasy builds                 |
| `froglight`         | 15    | Late             | Colored ambient lighting (3 variants)  |
| `torch`             | 14    | Early            | Caves, rustic interiors                |
| `campfire`          | 15    | Early            | Cozy interiors, medieval kitchens      |
| `soul_lantern`      | 10    | Mid+             | Moody/dark atmosphere, blue tint       |
| `redstone_lamp`     | 15*   | Mid+ (powered)   | Togglable lighting systems             |
| `candle` (1–4)      | 3–12  | Mid+             | Dining tables, atmospheric details     |
| `end_rod`           | 14    | Late (End)       | Elegant/futuristic pillars             |
| `copper_bulb`       | 15*   | Late             | Redstone-controlled modern lighting    |

### 10.3 — Spacing Rules for Full Coverage

For a flat room with ceiling height `h`:

- **Torches/Lanterns (level 14–15):** Place every **12 blocks** apart on flat
  ground for guaranteed mob-proofing. For rooms, every **8–10 blocks**.
- **Along hallways (1-wide):** Every 11–13 blocks.
- **Along hallways (2-wide):** Every 8–10 blocks.

### 10.4 — Hidden Lighting Techniques

- Embed `glowstone` or `sea_lantern` into the floor, then cover with `carpet`.
  Carpet does NOT block light.
- Place light sources behind `stairs` (the gap lets light through).
- Embed in ceiling recesses (1-block gap above the room).
- Use `light` blocks (creative/commands only) for invisible illumination.

---

## 11. Roof Construction

### 11.1 — Roof Style Reference

| Style          | Profile Shape      | Best For                  | Blocks Used                      |
|:---------------|:-------------------|:--------------------------|:---------------------------------|
| **Flat**       | Horizontal         | Modern, bunkers           | Slabs, full blocks               |
| **Gable**      | △ Triangle          | Houses, barns             | Stairs + slabs at peak           |
| **Hip**        | 4-sided slope      | Elegant homes, Asian      | Stairs on all 4 edges            |
| **Mansard**    | Steep lower + flat  | Victorian, French         | Stairs (steep) + slabs (flat)    |
| **A-Frame**    | △ to ground        | Cabins, chalets           | Stairs from ground to peak       |
| **Dome**       | ◠ Hemisphere        | Mosques, observatories    | Sphere algorithm (§6.2)          |
| **Bell/Gambrel** | Curved sides     | Barns, cottages           | Stairs + slabs gradient          |
| **Pagoda**     | Multi-tiered flare | Asian temples             | Slabs + stairs, flared per level |

### 11.2 — Roof Construction Rules

1. **Overhang:** ALWAYS extend the roof 1–2 blocks past the wall line.
2. **Peak treatment:** Use slabs at the very top for a clean finish. Avoid a
   jagged all-stairs peak.
3. **Material contrast:** The roof material should differ from the wall material.
   E.g., `stone_brick` walls → `dark_oak_stairs` roof.
4. **Dormer windows:** Cut into the roof slope to add windows for light and
   visual interest.
5. **Chimney:** Add a chimney using `stone_brick_wall` or `cobblestone_wall`
   stacked 3–5 blocks above the roof line. Place a `campfire[lit=true]` inside
   for smoke.

### 11.3 — Gable Roof Algorithm

```python
def build_gable_roof(width, length, start_y, block="dark_oak_stairs"):
    """Build a symmetrical gable roof along the Z-axis."""
    half = width // 2
    for layer in range(half + 1):
        y = start_y + layer
        for z in range(length):
            # Left slope
            place(half - layer, y, z, f"{block}[facing=east,half=bottom]")
            # Right slope
            place(half + layer, y, z, f"{block}[facing=west,half=bottom]")
        if layer == half:
            # Peak: use slabs for clean top
            for z in range(length):
                place(half, y, z, block.replace("stairs", "slab") + "[type=top]")
```

---

## 12. agent_creation.js Generation

To generate a build, you must overwrite the `agent_creation.js` file in the root directory. This file exports a single function `generateDefaultBuild()` that returns an object containing the blocks array, name, and description.

**CRITICAL:** Always overwrite the entire file and clear out any previous builds. Do not try to merge with the existing house.

### 12.1 — Template: agent_creation.js

```javascript
/**
 * agent_creation.js
 * 
 * Generates a default Minecraft build as an array of { x, y, z, type } block objects.
 */

export function generateDefaultBuild() {
    const blocks = [];

    function place(x, y, z, type) {
        blocks.push({ x, y, z, type: `minecraft:${type}` });
    }

    // ─── Dimensions ──────────────────────────────────────────────
    const WIDTH = 11;
    const LENGTH = 13;
    const HEIGHT = 7;

    // ─── Main Build Logic ───────────────────────────────────────────
    
    // Example: Floor
    for (let x = 0; x < WIDTH; x++) {
        for (let z = 0; z < LENGTH; z++) {
            place(x, 0, z, 'oak_planks');
        }
    }

    // Example: Walls
    for (let y = 1; y <= HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            for (let z = 0; z < LENGTH; z++) {
                const isEdge = (x === 0 || x === WIDTH - 1 || z === 0 || z === LENGTH - 1);
                if (isEdge) {
                    place(x, y, z, 'cobblestone');
                }
            }
        }
    }

    // Add more details (roof, doors, interior, etc.)

    return {
        blocks,
        name: 'AI Architect — Custom Build',
        description: 'A custom build generated by the Minecraft Architect agent.'
    };
}
```

### 12.2 — Key Rules for Javascript Code

1. **ALWAYS verify block IDs** against the Minecraft Wiki before using them.
2. **ALWAYS set block states** correctly by appending them in brackets (e.g., `oak_door[facing=south,half=lower,hinge=left,open=false]`).
3. **Use relative coordinates** — anchor the build at (0, 0, 0).
4. **Add the foundation** — don't start walls at Y=0 if you want a floor. Leave Y=0 for the floor layer.
5. **Handle double blocks** correctly — doors (upper/lower), beds (head/foot),
   chests (left/right), tall flowers (upper/lower).
6. **Clear the file:** Make sure you completely replace the contents of `agent_creation.js`.


## 14. Quality Assurance Checklist

**Before delivering ANY build to the user, verify ALL of the following:**

### Structural Integrity
- [ ] All walls are connected — no floating blocks or gaps.
- [ ] Foundation extends below the lowest wall block.
- [ ] Roof covers the entire structure with overhang.
- [ ] All doors have upper and lower halves correctly placed.
- [ ] All beds have head and foot blocks correctly placed.
- [ ] Double chests have `type=left` and `type=right` set correctly.

### Block Validity
- [ ] Every block ID has been verified against the Minecraft Wiki or web search.
- [ ] All block states are syntactically correct and use valid property values.
- [ ] No blocks from a later game stage than specified by the user.
- [ ] Log blocks have correct `axis` property for their orientation.
- [ ] Stair blocks have correct `facing` and `half` properties.
- [ ] Slab blocks have correct `type` (`top`, `bottom`, or `double`).

### Aesthetics
- [ ] Walls have depth variation (not flat).
- [ ] At least 3 different block types used per wall surface (texturing).
- [ ] Palette follows the 60/25/10/5 ratio.
- [ ] Windows are recessed and proportionally spaced.
- [ ] Roof material contrasts with wall material.

### Functionality
- [ ] All rooms are accessible (doors connect to hallways/exterior).
- [ ] Lighting coverage prevents mob spawning in all interior spaces.
- [ ] Enchanting room has exactly 15 bookshelves in valid positions (if included).
- [ ] Storage room has organized, labeled chests (if included).
- [ ] All interior rooms have furniture — no empty rooms.

### Output Quality
- [ ] Block data is successfully written to `agent_creation.js`.
- [ ] 3D preview loads in browser without console errors.
- [ ] Block count and dimensions reported to user.

---

## Appendix A: Minecraft Wiki Quick Reference URLs

Always prefer these sources for block verification:

- **All Blocks:** `https://minecraft.wiki/w/Block`
- **Block States:** `https://minecraft.wiki/w/Block_states`
- **Data Values:** `https://minecraft.wiki/w/Java_Edition_data_values`
- **Version History:** `https://minecraft.wiki/w/Java_Edition_version_history`
- **Biomes:** `https://minecraft.wiki/w/Biome`

## Appendix B: Common Errors to Avoid

| Error                                   | Consequence                            | Fix                                       |
|:----------------------------------------|:---------------------------------------|:------------------------------------------|
| Using `wood` instead of `oak_planks`    | Invalid block ID                       | Use full namespaced ID                    |
| Missing `axis` on logs                  | Log appears vertical (maybe wrong)     | Set `axis=x/y/z` explicitly               |
| Stairs with wrong `facing`              | Stairs point wrong direction           | Check compass direction carefully          |
| Slab without `type`                     | Defaults to bottom (maybe wrong)       | Set `type=top` or `type=bottom` explicitly |
| Door without both halves                | Broken door                            | Always place `half=lower` AND `half=upper` |
| Region too small for build              | Blocks silently clipped                | Add margin to region dimensions            |
| Using blocks from wrong game tier       | Breaks immersion for survival players  | Cross-reference §3 tier tables             |
| Flat walls with no depth                | Build looks amateur                    | See §8.1 — ALWAYS add depth               |
| No lighting plan                        | Mobs spawn inside the base             | See §10 — calculate spacing               |
| Symmetric builds with even dimensions   | No center point for doors/windows      | ALWAYS use odd wall lengths                |
