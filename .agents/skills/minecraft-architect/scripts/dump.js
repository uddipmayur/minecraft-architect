const blockMap = new Map();
function set(x, y, z, type) { blockMap.set(${x},,, type); }
function get(x, y, z) { return blockMap.get(${x},,); }
function del(x, y, z) { blockMap.delete(${x},,); }
function fill(x1, y1, z1, x2, y2, z2, type) {
const [sx, ex] = [Math.min(x1,x2), Math.max(x1,x2)];
const [sy, ey] = [Math.min(y1,y2), Math.max(y1,y2)];
const [sz, ez] = [Math.min(z1,z2), Math.max(z1,z2)];
for (let x = sx; x <= ex; x++)
for (let y = sy; y <= ey; y++)
for (let z = sz; z <= ez; z++)
set(x, y, z, type);
}
function clearVol(x1, y1, z1, x2, y2, z2) {
const [sx, ex] = [Math.min(x1,x2), Math.max(x1,x2)];
const [sy, ey] = [Math.min(y1,y2), Math.max(y1,y2)];
const [sz, ez] = [Math.min(z1,z2), Math.max(z1,z2)];
for (let x = sx; x <= ex; x++)
for (let y = sy; y <= ey; y++)
for (let z = sz; z <= ez; z++)
del(x, y, z);
}
function col(x, y1, y2, z, type) {
for (let y = y1; y <= y2; y++) set(x, y, z, type);
}
function hash(x, y, z) {
return Math.abs(((x * 73856093) ^ (y * 19349663) ^ (z * 83492791))) % 1000;
}
function tex(x, y, z, primary, mixes, chance) {
return hash(x,y,z) < chance
? mixes[hash(x+3,y+7,z+11) % mixes.length]
: primary;
}
function generateNetherHub() {

        // ─── 1. FOUNDATION (Y=0) ──────────────────────────────
        for (let x = 0; x < 30; x++)
            for (let z = 0; z < 30; z++)
                set(x, 0, z, tex(x,0,z,
                    'polished_blackstone',
                    ['blackstone','polished_blackstone_bricks'], 120));

        // ─── 2. OUTER PERIMETER WALLS (Y=1-8) ─────────────────
        for (let x = 0; x < 30; x++)
            for (let y = 1; y <= 8; y++) {
                set(x,y,0, tex(x,y,0,'nether_bricks',['red_nether_bricks'],100));
                set(x,y,29, tex(x,y,29,'nether_bricks',['red_nether_bricks'],100));
            }
        for (let z = 0; z < 30; z++)
            for (let y = 1; y <= 8; y++) {
                set(0,y,z, tex(0,y,z,'nether_bricks',['red_nether_bricks'],100));
                set(29,y,z, tex(29,y,z,'nether_bricks',['red_nether_bricks'],100));
            }

        // ─── 3. MAIN HALL WALLS & CEILING ──────────────────────
        fill(8,1,2, 8,9,25, 'nether_bricks');   // West wall
        fill(21,1,2, 21,9,25, 'nether_bricks');  // East wall
        fill(8,1,2, 21,9,2, 'nether_bricks');    // North wall
        fill(8,1,25, 21,9,25, 'nether_bricks');  // South wall
        fill(8,10,2, 21,10,25, 'nether_bricks'); // Ceiling

        // ─── 4. WEST WING (Storage) WALLS & CEILING ───────────
        fill(0,1,8, 8,6,8, 'nether_bricks');    // N wall of storage
        fill(0,1,21, 8,6,21, 'nether_bricks');   // S wall of storage
        fill(0,7,8, 8,7,21, 'nether_bricks');    // Storage ceiling

        // ─── 5. FILL UNUSED CORNER MASSES ──────────────────────
        fill(1,1,1, 7,7,7, 'nether_bricks');     // NW corner
        fill(1,1,22, 7,7,28, 'nether_bricks');   // SW corner
        fill(22,1,22, 28,7,28, 'nether_bricks'); // SE corner

        // ─── 6. EAST WING — RESPAWN ROOM WALLS & CEILING ──────
        fill(21,1,2, 28,5,2, 'blackstone');
        fill(28,1,2, 28,5,10, 'blackstone');
        fill(21,1,10, 28,5,10, 'blackstone');
        fill(21,6,2, 28,6,10, 'blackstone');     // Ceiling

        // ─── 7. EAST WING — GAP WALL BETWEEN ROOMS ────────────
        fill(21,1,11, 28,7,12, 'nether_bricks');

        // ─── 8. EAST WING — ENCHANTING ROOM WALLS & CEILING ───
        fill(21,1,13, 28,6,13, 'nether_bricks');
        fill(28,1,13, 28,6,21, 'nether_bricks');
        fill(21,1,21, 28,6,21, 'nether_bricks');
        fill(21,7,13, 28,7,21, 'nether_bricks'); // Ceiling

        // ─── 9. ENTRANCE CORRIDOR MASS ─────────────────────────
        fill(11,1,25, 18,7,29, 'nether_bricks');


        // ═══════════════════════════════════════════════════════
        // CARVE ROOM INTERIORS
        // ═══════════════════════════════════════════════════════

        clearVol(9,1,3, 20,9,24);     // Main hall
        clearVol(1,1,9, 7,6,20);      // Storage room
        clearVol(22,1,14, 27,6,20);   // Enchanting room
        clearVol(22,1,3, 27,5,9);     // Respawn room
        clearVol(12,1,25, 17,6,29);   // Entrance corridor


        // ═══════════════════════════════════════════════════════
        // CARVE DOORWAYS (3 wide × 3 tall)
        // ═══════════════════════════════════════════════════════

        clearVol(8,1,13, 8,3,15);     // Storage  → Main Hall
        clearVol(21,1,16, 21,3,17);   // Enchant  → Main Hall
        clearVol(21,1,6, 21,3,7);     // Respawn  → Main Hall


        // ═══════════════════════════════════════════════════════
        // FLOOR DETAILS
        // ═══════════════════════════════════════════════════════

        // Center carpet (crimson planks runway)
        for (let z = 3; z <= 24; z++) {
            set(14,0,z, 'crimson_planks');
            set(15,0,z, 'crimson_planks');
        }
        // Wider carpet near portal
        for (let z = 3; z <= 5; z++) {
            set(13,0,z, 'crimson_slab');
            set(16,0,z, 'crimson_slab');
        }
        // Wider carpet near entrance
        for (let z = 22; z <= 24; z++) {
            set(13,0,z, 'crimson_slab');
            set(16,0,z, 'crimson_slab');
        }
        // Entrance carpet
        for (let z = 25; z <= 29; z++) {
            set(14,0,z, 'crimson_planks');
            set(15,0,z, 'crimson_planks');
        }

        // Lava channels along main hall sides
        for (let z = 7; z <= 13; z++) { set(9,0,z,'lava'); set(20,0,z,'lava'); }
        for (let z = 17; z <= 23; z++) { set(9,0,z,'lava'); set(20,0,z,'lava'); }

        // Storage floor pattern
        for (let x = 1; x <= 7; x++)
            for (let z = 9; z <= 20; z++)
                if ((x + z) % 5 === 0) set(x,0,z, 'blackstone');

        // Enchanting floor
        for (let x = 23; x <= 27; x++)
            for (let z = 15; z <= 19; z++)
                set(x,0,z, 'crimson_planks');

        // Respawn floor — red cross
        for (let x = 23; x <= 27; x++) set(x,0,6, 'red_nether_bricks');
        for (let z = 4; z <= 8; z++)   set(25,0,z, 'red_nether_bricks');

        // Portal platform
        for (let x = 13; x <= 16; x++)
            for (let z = 4; z <= 6; z++)
                set(x,0,z, 'polished_blackstone_bricks');


        // ═══════════════════════════════════════════════════════
        // STRUCTURAL DETAILS — Pillars, Beams, Towers
        // ═══════════════════════════════════════════════════════

        // Main hall pillars (6 total)
        for (const [px,pz] of [[10,7],[10,14],[10,21],[19,7],[19,14],[19,21]]) {
            col(px, 1, 9, pz, 'polished_blackstone');
            set(px,9,pz, 'chiseled_polished_blackstone');
        }

        // Ceiling crossbeams — X axis (crimson planks)
        for (let x = 9; x <= 20; x++) {
            set(x,9,7, 'crimson_planks');
            set(x,9,14, 'crimson_planks');
            set(x,9,21, 'crimson_planks');
        }
        // Ceiling crossbeams — Z axis (crimson stems)
        for (let z = 3; z <= 24; z++) {
            set(10,9,z, 'crimson_stem');
            set(19,9,z, 'crimson_stem');
        }

        // Corner towers (2×2, taller than walls)
        for (const [cx,cz] of [[0,0],[0,28],[28,0],[28,28]]) {
            fill(cx,1,cz, cx+1,10,cz+1, 'polished_blackstone');
            fill(cx,11,cz, cx+1,11,cz+1, 'nether_brick_slab');
            set(cx,  12, cz+1, 'soul_lantern');
            set(cx+1,12, cz,   'soul_lantern');
        }

        // Battlements (every other block at Y=9)
        for (let x = 2; x < 28; x += 2) {
            set(x,9,0, 'nether_brick_wall');
            set(x,9,29, 'nether_brick_wall');
        }
        for (let z = 2; z < 28; z += 2) {
            set(0,9,z, 'nether_brick_wall');
            set(29,9,z, 'nether_brick_wall');
        }

        // Basalt accent pillars on exterior
        for (const z of [6,14,22]) {
            col(0, 1, 9, z, 'basalt');
            col(29, 1, 9, z, 'basalt');
        }
        for (const x of [6,14,22]) {
            col(x, 1, 9, 0, 'basalt');
            col(x, 1, 9, 29, 'basalt');
        }

        // Nether wart on exterior roof (organic detail)
        for (const [wx,wz] of [[3,2],[26,1],[5,27],[24,28],[1,15],[28,17]]) {
            set(wx, 8, wz, 'nether_wart_block');
        }


        // ═══════════════════════════════════════════════════════
        // NETHER PORTAL
        // ═══════════════════════════════════════════════════════

        // Obsidian frame (4 wide × 6 tall at Z=3)
        for (let x = 13; x <= 16; x++) { set(x,1,3,'obsidian'); set(x,6,3,'obsidian'); }
        for (let y = 1; y <= 6; y++)    { set(13,y,3,'obsidian'); set(16,y,3,'obsidian'); }
        // Portal fill
        for (let x = 14; x <= 15; x++)
            for (let y = 2; y <= 5; y++)
                set(x,y,3, 'nether_portal');

        // Decorative arch around portal
        for (let y = 1; y <= 8; y++) {
            set(12,y,3, 'polished_blackstone');
            set(17,y,3, 'polished_blackstone');
            set(12,y,4, 'polished_blackstone');
            set(17,y,4, 'polished_blackstone');
        }
        for (let x = 12; x <= 17; x++) {
            set(x,8,3, 'red_nether_bricks');
            set(x,8,4, 'red_nether_bricks');
        }
        set(13,7,4, 'nether_brick_stairs');
        set(16,7,4, 'nether_brick_stairs');

        // Chains + soul lanterns flanking portal
        for (let y = 7; y <= 9; y++) { set(12,y,5,'chain'); set(17,y,5,'chain'); }
        set(12,6,5, 'soul_lantern');
        set(17,6,5, 'soul_lantern');

        // Nether wart at portal base
        set(11,1,3, 'nether_wart_block');
        set(18,1,3, 'nether_wart_block');
        set(11,1,4, 'crimson_roots');
        set(18,1,4, 'crimson_roots');
        set(11,2,3, 'crimson_roots');
        set(18,2,3, 'crimson_roots');


        // ═══════════════════════════════════════════════════════
        // ENTRANCE ARCH
        // ═══════════════════════════════════════════════════════

        // Grand pillars flanking entrance
        col(11,1,7, 29, 'polished_blackstone');
        col(18,1,7, 29, 'polished_blackstone');
        col(11,1,7, 25, 'polished_blackstone');
        col(18,1,7, 25, 'polished_blackstone');

        // Arch top (red nether bricks)
        for (let x = 11; x <= 18; x++) set(x,6,29, 'red_nether_bricks');
        set(12,5,29, 'nether_brick_stairs');
        set(17,5,29, 'nether_brick_stairs');

        // Doorway arch inside
        set(8,4,12, 'nether_brick_stairs');
        set(8,4,16, 'nether_brick_stairs');
        set(21,4,15, 'nether_brick_stairs');
        set(21,4,18, 'nether_brick_stairs');
        set(21,4,5, 'nether_brick_stairs');
        set(21,4,8, 'nether_brick_stairs');


        // ═══════════════════════════════════════════════════════
        // FURNITURE — STORAGE ROOM
        // ═══════════════════════════════════════════════════════

        // Chests along west wall (X=1)
        for (const z of [10,11,13,14,16,17,19,20]) set(1,1,z, 'chest');
        // Second row of chests (X=2)
        for (const z of [10,11,13,14,16,17,19,20]) set(2,1,z, 'chest');
        // Barrels along east interior wall (X=7)
        for (const z of [10,12,14,16,18,20]) set(7,1,z, 'barrel');
        for (const z of [10,14,18])          set(7,2,z, 'barrel');
        // Crafting table
        set(4,1,10, 'crafting_table');


        // ═══════════════════════════════════════════════════════
        // FURNITURE — ENCHANTING ROOM
        // ═══════════════════════════════════════════════════════

        // Enchanting table at center
        set(25,1,17, 'enchanting_table');

        // Bookshelves in ring (distance 2 from table)
        for (let dx = -2; dx <= 2; dx++)
            for (let dz = -2; dz <= 2; dz++)
                if (Math.abs(dx) === 2 || Math.abs(dz) === 2) {
                    const bx = 25+dx, bz = 17+dz;
                    if (bx >= 22 && bx <= 27 && bz >= 14 && bz <= 20) {
                        set(bx,1,bz, 'bookshelf');
                        set(bx,2,bz, 'bookshelf');
                    }
                }
        // Clear doorway path through bookshelves
        clearVol(22,1,16, 23,2,17);

        // Anvil & grindstone
        set(22,1,14, 'anvil');
        set(23,1,14, 'grindstone');

        // Candles around enchanting table
        set(24,2,17, 'candle'); set(26,2,17, 'candle');
        set(25,2,16, 'candle'); set(25,2,18, 'candle');


        // ═══════════════════════════════════════════════════════
        // FURNITURE — RESPAWN ANCHOR ROOM
        // ═══════════════════════════════════════════════════════

        // Pedestal + anchor
        set(25,1,6, 'polished_blackstone');
        set(25,2,6, 'respawn_anchor');

        // Glowstone storage
        set(27,1,4, 'chest');
        set(26,1,4, 'glowstone');
        set(27,1,5, 'glowstone');

        // Warning decoration (crying obsidian accents)
        set(24,1,4, 'crying_obsidian');
        set(26,1,8, 'crying_obsidian');
        set(24,1,8, 'crying_obsidian');
        set(22,1,4, 'crying_obsidian');
        set(22,1,9, 'crying_obsidian');


        // ═══════════════════════════════════════════════════════
        // LIGHTING
        // ═══════════════════════════════════════════════════════

        // Main hall — wall-mounted soul lanterns
        for (const lz of [5, 9, 13, 18, 22]) {
            set(9,4,lz, 'soul_lantern');
            set(20,4,lz, 'soul_lantern');
        }

        // Main hall — hanging lanterns (chain → chain → lantern)
        for (const [cx,cz] of [[12,8],[17,8],[12,14],[17,14],[12,20],[17,20]]) {
            set(cx,9,cz, 'chain');
            set(cx,8,cz, 'chain');
            set(cx,7,cz, 'lantern');
        }

        // Main hall — glowstone embedded in ceiling
        for (let x = 12; x <= 17; x += 2)
            for (let z = 5; z <= 23; z += 4)
                set(x,10,z, 'glowstone');

        // Storage room lighting
        set(4,5,11, 'soul_lantern');
        set(4,5,15, 'lantern');
        set(4,5,19, 'soul_lantern');

        // Enchanting room lighting
        set(25,5,17, 'soul_lantern');
        set(22,5,14, 'soul_lantern');
        set(27,5,20, 'soul_lantern');

        // Respawn room lighting
        set(23,4,4, 'soul_lantern');
        set(27,4,8, 'soul_lantern');
        set(25,4,3, 'soul_lantern');

        // Entrance corridor lighting
        set(13,4,27, 'soul_lantern');
        set(16,4,27, 'soul_lantern');
        set(13,4,29, 'soul_lantern');
        set(16,4,29, 'soul_lantern');

        // Exterior soul torches on basalt pillars
        for (const z of [6,14,22]) {
            set(0,7,z, 'soul_torch');
            set(29,7,z, 'soul_torch');
        }
        for (const x of [6,14,22]) {
            set(x,7,0, 'soul_torch');
            set(x,7,29, 'soul_torch');
        }


        // ═══════════════════════════════════════════════════════
        // CONVERT MAP → ARRAY
        // ═══════════════════════════════════════════════════════

        const blocks = [];
        for (const [key, type] of blockMap) {
            const [x,y,z] = key.split(',').map(Number);
            blocks.push({ x, y, z, type });
        }
        return blocks;
    }

    // ═══════════════════════════════════════════════════════════
    // BLOCK COLOR MAP
    // ═══════════════════════════════════════════════════════════

    const BLOCK_COLORS = {
        // ── Blackstone family ──
        'polished_blackstone':          0x353038,
        'blackstone':                   0x2A2230,
        'polished_blackstone_bricks':   0x2B262F,
        'chiseled_polished_blackstone': 0x3A3540,

        // ── Nether bricks family ──
        'nether_bricks':       0x2C1518,
        'red_nether_bricks':   0x470909,
        'nether_brick_wall':   0x2C1518,
        'nether_brick_stairs': 0x301518,
        'nether_brick_slab':   0x2C1518,

        // ── Basalt ──
        'basalt':         0x4E4E52,

        // ── Crimson wood ──
        'crimson_planks': 0x6C3543,
        'crimson_stem':   0x7A3A4D,
        'crimson_slab':   0x6C3543,
        'crimson_roots':  0x8B1A2B,

        // ── Portal & Obsidian ──
        'obsidian':         0x0F0019,
        'nether_portal':    0x7B4EBD,
        'crying_obsidian':  0x32004A,
        'respawn_anchor':   0x3B1A5E,

        // ── Lighting ──
        'soul_lantern': 0x5FC0CF,
        'soul_torch':   0x5FC0CF,
        'lantern':      0xE8A63B,
        'glowstone':    0xFFDD57,
        'lava':         0xCF5413,
        'candle':       0xD8C896,

        // ── Decoration ──
        'chain':             0x3B4556,
        'nether_wart_block': 0x730000,

        // ── Furniture ──
        'chest':            0x8B6D3F,
        'barrel':           0x7A5B29,
        'bookshelf':        0x8B6D3F,
        'enchanting_table': 0x2C4040,
        'anvil':            0x505050,
        'grindstone':       0x808080,
        'crafting_table':   0x9B7D4F,

        'default': 0xAAAAAA,
    };

    function getColor(type) { return BLOCK_COLORS[type] ?? BLOCK_COLORS['default']; }

    const EMISSIVE_TYPES = [
        'lantern','soul_lantern','soul_torch','glowstone',
        'lava','nether_portal','candle','crying_obsidian','respawn_anchor'
    ];

    // ═══════════════════════════════════════════════════════════
    // GENERATE
    // ═══════════════════════════════════════════════════════════

    const BLOCKS = generateNetherHub();
fs.writeFileSync('blocks.json', JSON.stringify(BLOCKS, null, 2));
console.log('Saved blocks.json');