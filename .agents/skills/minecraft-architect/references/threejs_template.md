# Three.js Voxel Viewer — Starter Template

Use this as the base template when generating 3D browser previews of
Minecraft builds. Copy, modify, and extend as needed.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minecraft Build — 3D Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0d1117;
            color: #e6edf3;
            font-family: 'Segoe UI', system-ui, sans-serif;
            overflow: hidden;
        }
        #info {
            position: absolute;
            top: 16px;
            left: 16px;
            z-index: 10;
            background: rgba(13, 17, 23, 0.85);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 16px 20px;
            font-size: 14px;
            max-width: 280px;
        }
        #info h2 { font-size: 18px; margin-bottom: 8px; }
        #info .stat { color: #8b949e; margin: 4px 0; }
        #info .stat span { color: #58a6ff; font-weight: 600; }
        #legend {
            position: absolute;
            bottom: 16px;
            left: 16px;
            z-index: 10;
            background: rgba(13, 17, 23, 0.85);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 4px 0;
        }
        .legend-swatch {
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: 1px solid rgba(255,255,255,0.2);
            flex-shrink: 0;
        }
        #layer-control {
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 10;
            background: rgba(13, 17, 23, 0.85);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 13px;
        }
        #layer-slider {
            width: 160px;
            margin-top: 8px;
            accent-color: #58a6ff;
        }
        canvas { display: block; }
    </style>
</head>
<body>
    <div id="info">
        <h2 id="build-name">Build Name</h2>
        <div class="stat">Blocks: <span id="block-count">0</span></div>
        <div class="stat">Size: <span id="build-size">0×0×0</span></div>
        <div class="stat">Orbit: drag | Zoom: scroll | Pan: right-click</div>
    </div>
    <div id="legend"></div>
    <div id="layer-control">
        <label>Layer: <span id="layer-value">All</span></label><br>
        <input type="range" id="layer-slider" min="0" max="100" value="100">
    </div>
    <canvas id="viewport"></canvas>

    <script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
        }
    }
    </script>
    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        // ─── BUILD DATA ───────────────────────────────────────────
        // Replace this array with generated block data.
        // Each entry: { x, y, z, type }
        const BLOCKS = [
            // GENERATED_BLOCK_DATA_HERE
        ];

        // ─── BLOCK COLORS ─────────────────────────────────────────
        const BLOCK_COLORS = {
            "oak_planks":           0xBC9862,
            "spruce_planks":        0x6B4F31,
            "birch_planks":         0xD7CB8D,
            "dark_oak_planks":      0x4A3323,
            "cobblestone":          0x7F7F7F,
            "stone_bricks":        0x7D7D7D,
            "mossy_stone_bricks":  0x6B7D5A,
            "deepslate_bricks":    0x4A4A4E,
            "oak_log":              0x6B5131,
            "spruce_log":           0x3B2912,
            "glass":                0xC0E8F0,
            "glass_pane":           0xC0E8F0,
            "white_concrete":       0xCFD5D6,
            "gray_concrete":        0x545B5E,
            "sandstone":            0xD8CC8E,
            "nether_bricks":       0x2C1518,
            "quartz_block":         0xECE5DB,
            "lantern":              0xE8A63B,
            "glowstone":            0xFFDD57,
            "torch":                0xFFC040,
            "default":              0xAAAAAA,
        };

        function getColor(type) {
            const key = type.replace("minecraft:", "");
            // Strip block states for color lookup
            const base = key.split("[")[0];
            return BLOCK_COLORS[base] ?? BLOCK_COLORS["default"];
        }

        // ─── SCENE SETUP ──────────────────────────────────────────
        const canvas = document.getElementById('viewport');
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x1a1a2e);
        renderer.shadowMap.enabled = true;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x1a1a2e, 80, 200);

        const camera = new THREE.PerspectiveCamera(
            60, window.innerWidth / window.innerHeight, 0.1, 1000
        );

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // ─── LIGHTING ─────────────────────────────────────────────
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);

        const directional = new THREE.DirectionalLight(0xfff4e6, 1.0);
        directional.position.set(30, 50, 20);
        directional.castShadow = true;
        scene.add(directional);

        const hemisphere = new THREE.HemisphereLight(0x87ceeb, 0x362d1d, 0.3);
        scene.add(hemisphere);

        // ─── GROUND GRID ──────────────────────────────────────────
        const gridHelper = new THREE.GridHelper(100, 100, 0x333355, 0x222244);
        gridHelper.position.y = -0.01;
        scene.add(gridHelper);

        // ─── BUILD BLOCKS ─────────────────────────────────────────
        const blockGeometry = new THREE.BoxGeometry(1, 1, 1);

        // Group blocks by type for instanced rendering
        const typeGroups = {};
        for (const block of BLOCKS) {
            const key = block.type.replace("minecraft:", "").split("[")[0];
            if (!typeGroups[key]) typeGroups[key] = [];
            typeGroups[key].push(block);
        }

        const meshes = [];
        const dummy = new THREE.Object3D();

        for (const [type, blocks] of Object.entries(typeGroups)) {
            const color = BLOCK_COLORS[type] ?? BLOCK_COLORS["default"];
            const material = new THREE.MeshStandardMaterial({
                color,
                roughness: 0.8,
                metalness: 0.1,
            });
            // Emissive for light blocks
            if (["lantern","glowstone","sea_lantern","shroomlight","torch",
                 "campfire","froglight"].some(l => type.includes(l))) {
                material.emissive = new THREE.Color(color);
                material.emissiveIntensity = 0.5;
            }

            const mesh = new THREE.InstancedMesh(
                blockGeometry, material, blocks.length
            );
            mesh.userData.blocks = blocks;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            blocks.forEach((block, i) => {
                dummy.position.set(block.x, block.y, block.z);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            });
            mesh.instanceMatrix.needsUpdate = true;

            scene.add(mesh);
            meshes.push(mesh);
        }

        // ─── CAMERA POSITION ──────────────────────────────────────
        // Auto-center on the build
        const bounds = { minX: Infinity, maxX: -Infinity,
                         minY: Infinity, maxY: -Infinity,
                         minZ: Infinity, maxZ: -Infinity };
        for (const b of BLOCKS) {
            bounds.minX = Math.min(bounds.minX, b.x);
            bounds.maxX = Math.max(bounds.maxX, b.x);
            bounds.minY = Math.min(bounds.minY, b.y);
            bounds.maxY = Math.max(bounds.maxY, b.y);
            bounds.minZ = Math.min(bounds.minZ, b.z);
            bounds.maxZ = Math.max(bounds.maxZ, b.z);
        }
        const cx = (bounds.minX + bounds.maxX) / 2;
        const cy = (bounds.minY + bounds.maxY) / 2;
        const cz = (bounds.minZ + bounds.maxZ) / 2;
        const maxDim = Math.max(
            bounds.maxX - bounds.minX,
            bounds.maxY - bounds.minY,
            bounds.maxZ - bounds.minZ
        );
        camera.position.set(cx + maxDim, cy + maxDim * 0.7, cz + maxDim);
        controls.target.set(cx, cy, cz);

        // ─── HUD ──────────────────────────────────────────────────
        document.getElementById('block-count').textContent =
            BLOCKS.length.toLocaleString();
        document.getElementById('build-size').textContent =
            `${bounds.maxX-bounds.minX+1}×${bounds.maxY-bounds.minY+1}×${bounds.maxZ-bounds.minZ+1}`;

        // Legend
        const legendEl = document.getElementById('legend');
        for (const [type, blocks] of Object.entries(typeGroups)) {
            const color = BLOCK_COLORS[type] ?? BLOCK_COLORS["default"];
            const hex = '#' + color.toString(16).padStart(6, '0');
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-swatch" style="background:${hex}"></div>
                <span>${type} (${blocks.length})</span>`;
            legendEl.appendChild(item);
        }

        // Layer slider
        const slider = document.getElementById('layer-slider');
        const layerValue = document.getElementById('layer-value');
        slider.max = bounds.maxY;
        slider.value = bounds.maxY;

        slider.addEventListener('input', () => {
            const maxLayer = parseInt(slider.value);
            layerValue.textContent = maxLayer >= bounds.maxY
                ? 'All' : `Y ≤ ${maxLayer}`;
            for (const mesh of meshes) {
                const blocks = mesh.userData.blocks;
                blocks.forEach((block, i) => {
                    dummy.position.set(block.x, block.y, block.z);
                    dummy.scale.set(
                        block.y <= maxLayer ? 1 : 0,
                        block.y <= maxLayer ? 1 : 0,
                        block.y <= maxLayer ? 1 : 0
                    );
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                });
                mesh.instanceMatrix.needsUpdate = true;
            }
        });

        // ─── RESIZE ───────────────────────────────────────────────
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ─── RENDER LOOP ──────────────────────────────────────────
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    </script>
</body>
</html>
```

## Usage Instructions

1. Replace the `BLOCKS` array with the generated build data.
2. Add any new block types to `BLOCK_COLORS`.
3. Set `#build-name` to the build's name.
4. Adjust CDN version if needed.
