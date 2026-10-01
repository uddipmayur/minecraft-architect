/**
 * agent_creation.js
 * 
 * Generates an authentic 41x41 Early-Game Nether Hub for Minecraft Java Edition.
 * Conforms to the Minecraft Architect specification:
 * - 41x41 overall footprint with an imposing fortress silhouette
 * - Grand Nether Portal chamber centerpiece with active portal blocks
 * - Dedicated 15-bookshelf Enchanting Ritual Chamber with anvil, grindstone & lectern
 * - 16-double-chest Storage Vault with blast furnaces, smoker, brewing stand & barrels
 * - Sacred Respawn Anchor Sanctuary with glowing 4-charge anchor & crying obsidian
 * - Thick fortress walls, basalt corner towers, crenellated parapets, and recessed lava channels
 */

export function generateDefaultBuild() {
    const grid = new Map();

    function place(x, y, z, type) {
        const fullType = type.startsWith('minecraft:') ? type : `minecraft:${type}`;
        grid.set(`${x},${y},${z}`, { x, y, z, type: fullType });
    }

    function remove(x, y, z) {
        grid.delete(`${x},${y},${z}`);
    }

    // Deterministic pseudo-random block texturing for authentic aged Nether fortress look
    function textured(x, y, z, primary, alts, chance = 0.25) {
        const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453) % 1;
        if (hash < chance && alts.length > 0) {
            const idx = Math.floor((hash / chance) * alts.length);
            return alts[idx];
        }
        return primary;
    }

    // ═══════════════════════════════════════════════════════════
    // 1. FOUNDATIONS & SUB-TERRAIN (Y = 0)
    // ═══════════════════════════════════════════════════════════
    // Build extent: X: 0..40, Z: 0..40. Center is (20, 20).
    for (let x = 0; x <= 40; x++) {
        for (let z = 0; z <= 40; z++) {
            const inCenter = (x >= 12 && x <= 28 && z >= 12 && z <= 28);
            const inNorth = (x >= 14 && x <= 26 && z >= 0 && z <= 14);
            const inSouth = (x >= 14 && x <= 26 && z >= 26 && z <= 40);
            const inWest = (x >= 0 && x <= 14 && z >= 14 && z <= 26);
            const inEast = (x >= 26 && x <= 40 && z >= 14 && z <= 26);
            const inNW = (x >= 6 && x <= 13 && z >= 6 && z <= 13);
            const inNE = (x >= 27 && x <= 34 && z >= 6 && z <= 13);
            const inSW = (x >= 6 && x <= 13 && z >= 27 && z <= 34);
            const inSE = (x >= 27 && x <= 34 && z >= 27 && z <= 34);

            if (inCenter || inNorth || inSouth || inWest || inEast || inNW || inNE || inSW || inSE) {
                const b = textured(x, 0, z, 'blackstone', ['polished_blackstone', 'netherrack', 'nether_bricks'], 0.3);
                place(x, 0, z, b);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 2. FLOORING & LAVA CHANNELS (Y = 1)
    // ═══════════════════════════════════════════════════════════
    // Center rotunda floor (13..27, 13..27)
    for (let x = 13; x <= 27; x++) {
        for (let z = 13; z <= 27; z++) {
            const dx = Math.abs(x - 20);
            const dz = Math.abs(z - 20);
            const dist = Math.max(dx, dz);

            if (dist === 0) {
                place(x, 1, z, 'gilded_blackstone');
            } else if (dist === 1) {
                place(x, 1, z, 'crying_obsidian');
            } else if (dist === 2 || dist === 4) {
                place(x, 1, z, 'nether_bricks');
            } else if (dist === 3) {
                place(x, 1, z, 'red_nether_bricks');
            } else {
                const b = textured(x, 1, z, 'polished_blackstone_bricks', ['cracked_polished_blackstone_bricks', 'polished_blackstone'], 0.3);
                place(x, 1, z, b);
            }
        }
    }

    // Recessed lava rills with magma block bases
    const lavaSpots = [
        { x: 17, z1: 15, z2: 17 }, { x: 23, z1: 15, z2: 17 },
        { x: 17, z1: 23, z2: 25 }, { x: 23, z1: 23, z2: 25 },
        { z: 17, x1: 15, x2: 17 }, { z: 17, x1: 23, x2: 25 },
        { z: 23, x1: 15, x2: 17 }, { z: 23, x1: 23, x2: 25 },
    ];
    for (const r of lavaSpots) {
        if (r.x !== undefined) {
            for (let z = r.z1; z <= r.z2; z++) {
                place(r.x, 0, z, 'magma_block');
                place(r.x, 1, z, 'lava');
            }
        } else if (r.z !== undefined) {
            for (let x = r.x1; x <= r.x2; x++) {
                place(x, 0, r.z, 'magma_block');
                place(x, 1, r.z, 'lava');
            }
        }
    }

    // North wing floor (Enchanting / Ritual): Crimson & Red Nether Brick motif
    for (let x = 14; x <= 26; x++) {
        for (let z = 1; z <= 12; z++) {
            const dx = Math.abs(x - 20);
            if (dx <= 1) {
                place(x, 1, z, 'crimson_planks');
            } else if (dx === 2) {
                place(x, 1, z, 'red_nether_bricks');
            } else {
                const b = textured(x, 1, z, 'polished_blackstone_bricks', ['chiseled_nether_bricks', 'polished_blackstone'], 0.25);
                place(x, 1, z, b);
            }
        }
    }

    // South wing floor (Entrance Walkway): Sturdy smooth basalt path
    for (let x = 14; x <= 26; x++) {
        for (let z = 28; z <= 39; z++) {
            const dx = Math.abs(x - 20);
            if (dx <= 1) {
                place(x, 1, z, 'smooth_basalt');
            } else if (dx === 2) {
                place(x, 1, z, 'nether_bricks');
            } else {
                const b = textured(x, 1, z, 'polished_blackstone_bricks', ['cracked_polished_blackstone_bricks', 'blackstone'], 0.3);
                place(x, 1, z, b);
            }
        }
    }

    // West wing floor (Respawn Sanctuary): Warped & Soul theme
    for (let x = 1; x <= 12; x++) {
        for (let z = 14; z <= 26; z++) {
            const dz = Math.abs(z - 20);
            if (dz <= 1) {
                place(x, 1, z, 'warped_planks');
            } else if (dz === 2) {
                place(x, 1, z, 'polished_blackstone_bricks');
            } else {
                const b = textured(x, 1, z, 'polished_blackstone_bricks', ['cracked_polished_blackstone_bricks', 'polished_blackstone'], 0.25);
                place(x, 1, z, b);
            }
        }
    }

    // East wing floor (Storage Vault): Blackstone & Crimson checker
    for (let x = 28; x <= 39; x++) {
        for (let z = 14; z <= 26; z++) {
            const dz = Math.abs(z - 20);
            if (dz <= 1) {
                place(x, 1, z, (x % 2 === 0) ? 'polished_blackstone' : 'polished_blackstone_bricks');
            } else if (dz >= 2 && dz <= 4) {
                place(x, 1, z, 'crimson_planks');
            } else {
                place(x, 1, z, 'polished_blackstone_bricks');
            }
        }
    }

    // Tower base floors
    const towerCoords = [
        { x1: 7, x2: 12, z1: 7, z2: 12 },
        { x1: 28, x2: 33, z1: 7, z2: 12 },
        { x1: 7, x2: 12, z1: 28, z2: 33 },
        { x1: 28, x2: 33, z1: 28, z2: 33 }
    ];
    for (const tc of towerCoords) {
        for (let x = tc.x1; x <= tc.x2; x++) {
            for (let z = tc.z1; z <= tc.z2; z++) {
                place(x, 1, z, 'polished_basalt[axis=y]');
            }
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 3. PILLARS & ARCHES (Y = 2 to 9)
    // ═══════════════════════════════════════════════════════════
    // 4 Grand Central Rotunda Pillars
    const grandPillars = [
        { x: 15, z: 15 }, { x: 25, z: 15 },
        { x: 15, z: 25 }, { x: 25, z: 25 }
    ];
    for (const gp of grandPillars) {
        place(gp.x, 2, gp.z, 'chiseled_polished_blackstone');
        for (let y = 3; y <= 7; y++) {
            place(gp.x, y, gp.z, 'polished_basalt[axis=y]');
        }
        place(gp.x, 8, gp.z, 'polished_blackstone_bricks');
        place(gp.x, 8, gp.z - 1, 'polished_blackstone_brick_stairs[facing=north,half=top,shape=straight]');
        place(gp.x, 8, gp.z + 1, 'polished_blackstone_brick_stairs[facing=south,half=top,shape=straight]');
        place(gp.x - 1, 8, gp.z, 'polished_blackstone_brick_stairs[facing=west,half=top,shape=straight]');
        place(gp.x + 1, 8, gp.z, 'polished_blackstone_brick_stairs[facing=east,half=top,shape=straight]');
    }

    // Corridor entrance arches into 4 wings:
    // North Arch (Z = 13, X = 18..22)
    for (let x = 18; x <= 22; x++) place(x, 6, 13, 'nether_brick_slab[type=top]');
    place(18, 5, 13, 'nether_brick_stairs[facing=west,half=top,shape=straight]');
    place(22, 5, 13, 'nether_brick_stairs[facing=east,half=top,shape=straight]');
    for (let y = 2; y <= 4; y++) {
        place(17, y, 13, 'nether_bricks');
        place(23, y, 13, 'nether_bricks');
    }

    // South Arch (Z = 27, X = 18..22)
    for (let x = 18; x <= 22; x++) place(x, 6, 27, 'nether_brick_slab[type=top]');
    place(18, 5, 27, 'nether_brick_stairs[facing=west,half=top,shape=straight]');
    place(22, 5, 27, 'nether_brick_stairs[facing=east,half=top,shape=straight]');
    for (let y = 2; y <= 4; y++) {
        place(17, y, 27, 'nether_bricks');
        place(23, y, 27, 'nether_bricks');
    }

    // West Arch (X = 13, Z = 18..22)
    for (let z = 18; z <= 22; z++) place(13, 6, z, 'nether_brick_slab[type=top]');
    place(13, 5, 18, 'nether_brick_stairs[facing=north,half=top,shape=straight]');
    place(13, 5, 22, 'nether_brick_stairs[facing=south,half=top,shape=straight]');
    for (let y = 2; y <= 4; y++) {
        place(13, y, 17, 'nether_bricks');
        place(13, y, 23, 'nether_bricks');
    }

    // East Arch (X = 27, Z = 18..22)
    for (let z = 18; z <= 22; z++) place(27, 6, z, 'nether_brick_slab[type=top]');
    place(27, 5, 18, 'nether_brick_stairs[facing=north,half=top,shape=straight]');
    place(27, 5, 22, 'nether_brick_stairs[facing=south,half=top,shape=straight]');
    for (let y = 2; y <= 4; y++) {
        place(27, y, 17, 'nether_bricks');
        place(27, y, 23, 'nether_bricks');
    }

    // ═══════════════════════════════════════════════════════════
    // 4. EXTERIOR & INTERIOR WALLS (Y = 2 to 7)
    // ═══════════════════════════════════════════════════════════
    function buildWall(x1, z1, x2, z2, height = 7) {
        const dx = Math.sign(x2 - x1);
        const dz = Math.sign(z2 - z1);
        let cx = x1, cz = z1;
        while (true) {
            for (let y = 2; y <= height; y++) {
                let block = textured(cx, y, cz, 'blackstone', ['polished_blackstone_bricks', 'nether_bricks'], 0.25);
                if (y === 2) block = 'polished_blackstone_bricks';
                else if (y === height) block = 'nether_bricks';
                place(cx, y, cz, block);
            }
            if (cx === x2 && cz === z2) break;
            cx += dx;
            cz += dz;
        }
    }

    // North Wing outer walls
    buildWall(14, 0, 26, 0, 7);
    buildWall(14, 0, 14, 13, 7);
    buildWall(26, 0, 26, 13, 7);

    // South Wing outer walls
    buildWall(14, 27, 14, 40, 7);
    buildWall(26, 27, 26, 40, 7);
    buildWall(14, 40, 18, 40, 7);
    buildWall(22, 40, 26, 40, 7);
    for (let x = 19; x <= 21; x++) {
        place(x, 5, 40, 'nether_brick_slab[type=top]');
        place(x, 6, 40, 'nether_bricks');
        place(x, 7, 40, 'nether_bricks');
    }
    place(18, 4, 40, 'nether_brick_stairs[facing=west,half=top,shape=straight]');
    place(22, 4, 40, 'nether_brick_stairs[facing=east,half=top,shape=straight]');

    // West Wing outer walls (Respawn Sanctuary)
    buildWall(0, 14, 0, 26, 7);
    buildWall(0, 14, 13, 14, 7);
    buildWall(0, 26, 13, 26, 7);

    // East Wing outer walls (Storage Vault)
    buildWall(40, 14, 40, 26, 7);
    buildWall(27, 14, 40, 14, 7);
    buildWall(27, 26, 40, 26, 7);

    // 4 Corner Bastions / Watchtowers
    const towerBoxes = [
        { x1: 6, z1: 6, x2: 12, z2: 12 },
        { x1: 28, z1: 6, x2: 34, z2: 12 },
        { x1: 6, z1: 28, x2: 12, z2: 34 },
        { x1: 28, z1: 28, x2: 34, z2: 34 }
    ];
    for (const tb of towerBoxes) {
        for (let x = tb.x1; x <= tb.x2; x++) {
            for (let z = tb.z1; z <= tb.z2; z++) {
                const isEdge = (x === tb.x1 || x === tb.x2 || z === tb.z1 || z === tb.z2);
                const isCorner = ((x === tb.x1 || x === tb.x2) && (z === tb.z1 || z === tb.z2));
                if (isEdge) {
                    for (let y = 2; y <= 9; y++) {
                        if (isCorner) {
                            place(x, y, z, 'polished_basalt[axis=y]');
                        } else if (y === 6 && (x === Math.floor((tb.x1+tb.x2)/2) || z === Math.floor((tb.z1+tb.z2)/2))) {
                            place(x, y, z, 'nether_brick_fence[north=true,south=true]');
                        } else {
                            const b = textured(x, y, z, 'polished_blackstone_bricks', ['cracked_polished_blackstone_bricks', 'nether_bricks'], 0.2);
                            place(x, y, z, b);
                        }
                    }
                    if ((x + z) % 2 === 0) {
                        place(x, 10, z, 'polished_blackstone_brick_slab[type=bottom]');
                    } else {
                        place(x, 10, z, 'polished_blackstone_brick_wall[up=true]');
                    }
                }
            }
        }
    }

    // ═══════════════════════════════════════════════════════════
    // 5. THE MAIN NETHER PORTAL CHAMBER (CENTER: X=20, Z=20)
    // ═══════════════════════════════════════════════════════════
    // Elevated Portal Dais (Y = 2)
    for (let x = 17; x <= 23; x++) {
        for (let z = 19; z <= 21; z++) {
            place(x, 2, z, 'polished_blackstone_bricks');
        }
    }
    // Dais steps
    for (let x = 17; x <= 23; x++) {
        place(x, 2, 18, 'polished_blackstone_brick_stairs[facing=north,half=bottom,shape=straight]');
        place(x, 2, 22, 'polished_blackstone_brick_stairs[facing=south,half=bottom,shape=straight]');
    }
    place(16, 2, 20, 'polished_blackstone_brick_stairs[facing=west,half=bottom,shape=straight]');
    place(24, 2, 20, 'polished_blackstone_brick_stairs[facing=east,half=bottom,shape=straight]');

    // Nether Portal Structure: 5 wide, 6 high (X: 18..22, Y: 3..8, Z: 20)
    // Obsidian Frame
    place(18, 3, 20, 'crying_obsidian');
    place(19, 3, 20, 'obsidian');
    place(20, 3, 20, 'obsidian');
    place(21, 3, 20, 'obsidian');
    place(22, 3, 20, 'crying_obsidian');

    for (let y = 4; y <= 7; y++) {
        place(18, y, 20, 'obsidian');
        place(19, y, 20, 'nether_portal[axis=x]');
        place(20, y, 20, 'nether_portal[axis=x]');
        place(21, y, 20, 'nether_portal[axis=x]');
        place(22, y, 20, 'obsidian');
    }

    place(18, 8, 20, 'crying_obsidian');
    place(19, 8, 20, 'obsidian');
    place(20, 8, 20, 'obsidian');
    place(21, 8, 20, 'obsidian');
    place(22, 8, 20, 'crying_obsidian');

    // Ornate Portal Over-Arch & Basalt Buttresses
    for (let y = 3; y <= 8; y++) {
        place(17, y, 20, 'smooth_basalt');
        place(23, y, 20, 'smooth_basalt');
    }
    // Crown above portal
    place(20, 9, 20, 'chiseled_nether_bricks');
    place(19, 9, 20, 'red_nether_brick_stairs[facing=east,half=bottom,shape=straight]');
    place(21, 9, 20, 'red_nether_brick_stairs[facing=west,half=bottom,shape=straight]');
    place(18, 9, 20, 'red_nether_bricks');
    place(22, 9, 20, 'red_nether_bricks');
    place(17, 9, 20, 'red_nether_brick_slab[type=bottom]');
    place(23, 9, 20, 'red_nether_brick_slab[type=bottom]');

    // Soul Lanterns hanging around portal chamber
    place(17, 8, 19, 'iron_chain[axis=y]');
    place(17, 7, 19, 'soul_lantern[hanging=true]');
    place(23, 8, 19, 'iron_chain[axis=y]');
    place(23, 7, 19, 'soul_lantern[hanging=true]');
    place(17, 8, 21, 'iron_chain[axis=y]');
    place(17, 7, 21, 'soul_lantern[hanging=true]');
    place(23, 8, 21, 'iron_chain[axis=y]');
    place(23, 7, 21, 'soul_lantern[hanging=true]');

    // Grand Central Chandelier
    place(20, 11, 20, 'iron_chain[axis=y]');
    place(20, 10, 20, 'iron_chain[axis=y]');
    place(20, 9, 19, 'iron_chain[axis=y]');
    place(20, 8, 19, 'soul_lantern[hanging=true]');
    place(20, 9, 21, 'iron_chain[axis=y]');
    place(20, 8, 21, 'soul_lantern[hanging=true]');

    // ═══════════════════════════════════════════════════════════
    // 6. ENCHANTING ROOM (NORTH WING: Center at 20, 6)
    // ═══════════════════════════════════════════════════════════
    // Enchanting Table at (20, 2, 6)
    place(20, 2, 6, 'enchanting_table');

    // 15+ Bookshelves setup in valid distance-2 horseshoe:
    // Back row (Z = 4): X = 19, 20, 21 at Y = 2, 3 (6 bookshelves)
    for (let x = 19; x <= 21; x++) {
        place(x, 2, 4, 'bookshelf');
        place(x, 3, 4, 'bookshelf');
    }
    // West row (X = 18): Z = 5, 6, 7 at Y = 2, 3 (6 bookshelves)
    for (let z = 5; z <= 7; z++) {
        place(18, 2, z, 'bookshelf');
        place(18, 3, z, 'bookshelf');
    }
    // East row (X = 22): Z = 5, 6, 7 at Y = 2, 3 (6 bookshelves)
    for (let z = 5; z <= 7; z++) {
        place(22, 2, z, 'bookshelf');
        place(22, 3, z, 'bookshelf');
    }

    // Crimson slab trim on top of bookshelves
    for (let x = 19; x <= 21; x++) place(x, 4, 4, 'crimson_slab[type=bottom]');
    for (let z = 5; z <= 7; z++) {
        place(18, 4, z, 'crimson_slab[type=bottom]');
        place(22, 4, z, 'crimson_slab[type=bottom]');
    }

    // Utilities & Ritual Gear in Enchanting Room:
    place(16, 2, 9, 'anvil[facing=north]');
    place(24, 2, 9, 'grindstone[face=floor,facing=north]');
    place(16, 2, 8, 'crafting_table');
    place(20, 2, 8, 'lectern[facing=north]');

    // Decorative ritual side alcoves
    place(16, 2, 5, 'chiseled_nether_bricks');
    place(16, 3, 5, 'crimson_slab[type=bottom]');
    place(24, 2, 5, 'chiseled_nether_bricks');
    place(24, 3, 5, 'crimson_slab[type=bottom]');

    // Ancient Nether Altar / Soul Fire Hearth at back wall (Z = 1)
    place(20, 1, 1, 'soul_sand');
    place(20, 2, 1, 'soul_fire');
    place(19, 2, 1, 'polished_blackstone_brick_stairs[facing=east,half=bottom,shape=straight]');
    place(21, 2, 1, 'polished_blackstone_brick_stairs[facing=west,half=bottom,shape=straight]');
    place(20, 3, 1, 'nether_brick_stairs[facing=south,half=top,shape=straight]');

    // Hanging Soul Lantern in Enchanting Room
    place(20, 6, 6, 'iron_chain[axis=y]');
    place(20, 5, 6, 'iron_chain[axis=y]');
    place(20, 4, 6, 'soul_lantern[hanging=true]');

    // ═══════════════════════════════════════════════════════════
    // 7. STORAGE ROOM (EAST WING: Center at 34, 20)
    // ═══════════════════════════════════════════════════════════
    // 16 Double Chests (32 chest blocks) in two double-tiered banks:
    // North Bank: Z = 16. Chest pairs at X = (30,31), (32,33), (34,35), (36,37)
    for (let x = 30; x <= 37; x++) {
        place(x, 2, 16, 'chest[facing=south]');
        place(x, 3, 15, 'polished_blackstone_brick_stairs[facing=south,half=top,shape=straight]');
        place(x, 4, 16, 'chest[facing=south]');
    }

    // South Bank: Z = 24. Chest pairs at X = (30,31), (32,33), (34,35), (36,37)
    for (let x = 30; x <= 37; x++) {
        place(x, 2, 24, 'chest[facing=north]');
        place(x, 3, 25, 'polished_blackstone_brick_stairs[facing=north,half=top,shape=straight]');
        place(x, 4, 24, 'chest[facing=north]');
    }

    // Workshop & Smelting Wall (X = 39):
    place(38, 2, 16, 'barrel[facing=up]');
    place(38, 3, 16, 'barrel[facing=up]');
    place(38, 2, 24, 'barrel[facing=up]');
    place(38, 3, 24, 'barrel[facing=up]');

    place(39, 2, 18, 'blast_furnace[facing=west]');
    place(39, 2, 19, 'blast_furnace[facing=west]');
    place(39, 2, 20, 'brewing_stand');
    place(39, 2, 21, 'smoker[facing=west]');
    place(39, 2, 22, 'crafting_table');

    for (let z = 18; z <= 22; z++) {
        place(39, 3, z, 'polished_blackstone_brick_slab[type=bottom]');
    }

    // Center storage aisle lighting
    place(32, 6, 20, 'iron_chain[axis=y]');
    place(32, 5, 20, 'lantern[hanging=true]');
    place(36, 6, 20, 'iron_chain[axis=y]');
    place(36, 5, 20, 'lantern[hanging=true]');

    // ═══════════════════════════════════════════════════════════
    // 8. RESPAWN ANCHOR ROOM (WEST WING: Center at 6, 20)
    // ═══════════════════════════════════════════════════════════
    // Raised Dais for Respawn Anchor at (6, 2, 20)
    for (let x = 4; x <= 8; x++) {
        for (let z = 18; z <= 22; z++) {
            place(x, 2, z, 'polished_blackstone_bricks');
        }
    }
    for (let x = 4; x <= 8; x++) {
        place(x, 2, 17, 'polished_blackstone_brick_stairs[facing=north,half=bottom,shape=straight]');
        place(x, 2, 23, 'polished_blackstone_brick_stairs[facing=south,half=bottom,shape=straight]');
    }
    place(9, 2, 20, 'polished_blackstone_brick_stairs[facing=east,half=bottom,shape=straight]');

    // Center Respawn Anchor (fully charged with 4 glowstone charges)
    place(6, 3, 20, 'respawn_anchor[charges=4]');

    // Crying Obsidian ritual ring
    place(5, 3, 20, 'crying_obsidian');
    place(7, 3, 20, 'crying_obsidian');
    place(6, 3, 19, 'crying_obsidian');
    place(6, 3, 21, 'crying_obsidian');

    // Flanking basalt ritual pillars with soul lanterns
    place(4, 3, 18, 'polished_basalt[axis=y]');
    place(4, 4, 18, 'polished_blackstone_wall[up=true]');
    place(4, 5, 18, 'soul_lantern[hanging=false]');

    place(4, 3, 22, 'polished_basalt[axis=y]');
    place(4, 4, 22, 'polished_blackstone_wall[up=true]');
    place(4, 5, 22, 'soul_lantern[hanging=false]');

    // Glowstone replenishment supply chest
    place(2, 2, 17, 'chest[facing=east]');
    place(2, 2, 23, 'barrel[facing=up]');

    // Warped & crimson potted flora
    place(2, 2, 19, 'crying_obsidian');
    place(2, 3, 19, 'potted_warped_fungus');
    place(2, 2, 21, 'crying_obsidian');
    place(2, 3, 21, 'potted_crimson_fungus');

    // ═══════════════════════════════════════════════════════════
    // 9. ENTRANCE GATEHOUSE (SOUTH WING: Center at 20, 34)
    // ═══════════════════════════════════════════════════════════
    for (let y = 2; y <= 6; y++) {
        place(17, y, 38, 'smooth_basalt');
        place(23, y, 38, 'smooth_basalt');
    }
    // Lava cauldrons outside gate
    place(16, 2, 40, 'nether_bricks');
    place(16, 3, 40, 'lava_cauldron');
    place(24, 2, 40, 'nether_bricks');
    place(24, 3, 40, 'lava_cauldron');

    // Steps leading out into the Nether
    for (let x = 18; x <= 22; x++) {
        place(x, 1, 40, 'nether_brick_stairs[facing=south,half=bottom,shape=straight]');
    }

    // Gatehouse interior guard lanterns
    place(17, 5, 33, 'iron_chain[axis=y]');
    place(17, 4, 33, 'lantern[hanging=true]');
    place(23, 5, 33, 'iron_chain[axis=y]');
    place(23, 4, 33, 'lantern[hanging=true]');

    // ═══════════════════════════════════════════════════════════
    // 10. ROOFING, VAULTED CEILING & PARAPETS (Y = 7 to 14)
    // ═══════════════════════════════════════════════════════════
    // North Wing roof
    for (let x = 14; x <= 26; x++) {
        for (let z = 0; z <= 13; z++) {
            if (x === 14 || x === 26 || z === 0) {
                if ((x + z) % 2 === 0) place(x, 8, z, 'nether_brick_wall[up=true]');
                else place(x, 8, z, 'nether_brick_slab[type=bottom]');
            } else {
                place(x, 7, z, 'polished_blackstone_brick_slab[type=bottom]');
            }
        }
    }

    // South Wing roof
    for (let x = 14; x <= 26; x++) {
        for (let z = 27; z <= 40; z++) {
            if (x === 14 || x === 26 || z === 40) {
                if ((x + z) % 2 === 0) place(x, 8, z, 'nether_brick_wall[up=true]');
                else place(x, 8, z, 'nether_brick_slab[type=bottom]');
            } else {
                place(x, 7, z, 'polished_blackstone_brick_slab[type=bottom]');
            }
        }
    }

    // West Wing roof
    for (let x = 0; x <= 13; x++) {
        for (let z = 14; z <= 26; z++) {
            if (x === 0 || z === 14 || z === 26) {
                if ((x + z) % 2 === 0) place(x, 8, z, 'nether_brick_wall[up=true]');
                else place(x, 8, z, 'nether_brick_slab[type=bottom]');
            } else {
                place(x, 7, z, 'polished_blackstone_brick_slab[type=bottom]');
            }
        }
    }

    // East Wing roof
    for (let x = 27; x <= 40; x++) {
        for (let z = 14; z <= 26; z++) {
            if (x === 40 || z === 14 || z === 26) {
                if ((x + z) % 2 === 0) place(x, 8, z, 'nether_brick_wall[up=true]');
                else place(x, 8, z, 'nether_brick_slab[type=bottom]');
            } else {
                place(x, 7, z, 'polished_blackstone_brick_slab[type=bottom]');
            }
        }
    }

    // Grand Central Dome / Raised Lantern Tower (X: 14..26, Z: 14..26, Y: 8..14)
    for (let x = 14; x <= 26; x++) {
        for (let z = 14; z <= 26; z++) {
            const isEdge = (x === 14 || x === 26 || z === 14 || z === 26);
            if (isEdge) {
                place(x, 8, z, 'polished_blackstone_bricks');
            }
        }
    }

    // Y = 9 (15..25, 15..25)
    for (let x = 15; x <= 25; x++) {
        for (let z = 15; z <= 25; z++) {
            const isEdge = (x === 15 || x === 25 || z === 15 || z === 25);
            if (isEdge) place(x, 9, z, 'nether_bricks');
        }
    }

    // Y = 10 (16..24, 16..24) - Clerestory openings
    for (let x = 16; x <= 24; x++) {
        for (let z = 16; z <= 24; z++) {
            const isEdge = (x === 16 || x === 24 || z === 16 || z === 24);
            if (isEdge) {
                if (x === 20 || z === 20) {
                    place(x, 10, z, 'nether_brick_fence[north=true,south=true]');
                } else {
                    place(x, 10, z, 'red_nether_bricks');
                }
            }
        }
    }

    // Y = 11 (17..23, 17..23)
    for (let x = 17; x <= 23; x++) {
        for (let z = 17; z <= 23; z++) {
            const isEdge = (x === 17 || x === 23 || z === 17 || z === 23);
            if (isEdge) place(x, 11, z, 'polished_blackstone_bricks');
        }
    }

    // Y = 12 (18..22, 18..22) - Crown / Roof Cap
    for (let x = 18; x <= 22; x++) {
        for (let z = 18; z <= 22; z++) {
            const isEdge = (x === 18 || x === 22 || z === 18 || z === 22);
            if (isEdge) {
                place(x, 12, z, 'nether_brick_stairs[facing=south,half=bottom,shape=straight]');
            } else {
                place(x, 12, z, 'chiseled_nether_bricks');
            }
        }
    }

    // Y = 13..14 Central Spire with Soul Lantern
    place(20, 13, 20, 'nether_brick_wall[up=true]');
    place(20, 14, 20, 'soul_lantern[hanging=false]');

    const blocks = Array.from(grid.values());
    return {
        blocks,
        name: 'Ancient Nether Hub & Fortress',
        description: 'A 41x41 early-game survival Nether Hub featuring a grand Nether Portal rotunda, full 15-bookshelf Enchanting Ritual library, 16 double-chest Storage Vault, and sacred Respawn Anchor shrine.'
    };
}
