/**
 * make_litematic.js
 * Packs blocks into standard Minecraft Litematica format (.litematic).
 */

import fs from 'fs';
import * as NBT from 'nbtify';
import { generateDefaultBuild } from './agent_creation.js';

async function generateLitematic() {
    const build = generateDefaultBuild();
    const blocks = build.blocks;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (const b of blocks) {
        if (b.x < minX) minX = b.x;
        if (b.x > maxX) maxX = b.x;
        if (b.y < minY) minY = b.y;
        if (b.y > maxY) maxY = b.y;
        if (b.z < minZ) minZ = b.z;
        if (b.z > maxZ) maxZ = b.z;
    }

    const sizeX = maxX - minX + 1;
    const sizeY = maxY - minY + 1;
    const sizeZ = maxZ - minZ + 1;
    const totalVolume = sizeX * sizeY * sizeZ;

    console.log(`Dimensions: ${sizeX} x ${sizeY} x ${sizeZ} (Vol: ${totalVolume})`);

    // Build block lookup grid
    const blockMap = new Map();
    for (const b of blocks) {
        const lx = b.x - minX;
        const ly = b.y - minY;
        const lz = b.z - minZ;
        blockMap.set(`${lx},${ly},${lz}`, b.type);
    }

    // Build palette (Index 0 = minecraft:air)
    const palette = [{ Name: 'minecraft:air' }];
    const paletteLookup = new Map();
    paletteLookup.set('minecraft:air', 0);

    function parseBlockState(typeStr) {
        let name = typeStr;
        let props = null;
        const bi = typeStr.indexOf('[');
        if (bi !== -1) {
            name = typeStr.substring(0, bi);
            const propStr = typeStr.substring(bi + 1, typeStr.length - 1);
            props = {};
            for (const pair of propStr.split(',')) {
                const eq = pair.indexOf('=');
                if (eq > 0) props[pair.substring(0, eq)] = pair.substring(eq + 1);
            }
        }
        if (!name.startsWith('minecraft:')) name = 'minecraft:' + name;
        const entry = { Name: name };
        if (props) entry.Properties = props;
        return { key: typeStr, entry };
    }

    // Populate palette
    for (const b of blocks) {
        if (!paletteLookup.has(b.type)) {
            const { entry } = parseBlockState(b.type);
            paletteLookup.set(b.type, palette.length);
            palette.push(entry);
        }
    }

    console.log(`Palette size: ${palette.length} entries`);

    // Array of indices in Litematica order: y -> z -> x
    const indices = new Int32Array(totalVolume);
    let idx = 0;
    for (let y = 0; y < sizeY; y++) {
        for (let z = 0; z < sizeZ; z++) {
            for (let x = 0; x < sizeX; x++) {
                const key = `${x},${y},${z}`;
                const bType = blockMap.get(key) || 'minecraft:air';
                indices[idx++] = paletteLookup.get(bType) || 0;
            }
        }
    }

    // Bit-packing
    const bitsPerBlock = Math.max(2, Math.ceil(Math.log2(palette.length)));
    const totalBits = BigInt(totalVolume) * BigInt(bitsPerBlock);
    const longCount = Number((totalBits + 63n) / 64n);
    const blockStates = new BigInt64Array(longCount);

    let longIdx = 0;
    let bitOffset = 0n;

    for (let i = 0; i < totalVolume; i++) {
        const val = BigInt(indices[i]);
        let bitsRemaining = BigInt(bitsPerBlock);
        let valOffset = 0n;

        while (bitsRemaining > 0n && longIdx < longCount) {
            const bitsAvailable = 64n - bitOffset;
            const bitsToWrite = bitsRemaining < bitsAvailable ? bitsRemaining : bitsAvailable;
            const mask = (1n << bitsToWrite) - 1n;
            const chunk = (val >> valOffset) & mask;

            blockStates[longIdx] |= (chunk << bitOffset);

            bitOffset += bitsToWrite;
            if (bitOffset === 64n) {
                bitOffset = 0n;
                longIdx++;
            }
            bitsRemaining -= bitsToWrite;
            valOffset += bitsToWrite;
        }
    }

    const nbtData = {
        Version: new NBT.Int32(6),
        SubVersion: new NBT.Int32(1),
        MinecraftDataVersion: new NBT.Int32(3955),
        Metadata: {
            EnclosingSize: {
                x: new NBT.Int32(sizeX),
                y: new NBT.Int32(sizeY),
                z: new NBT.Int32(sizeZ)
            },
            Author: 'MinecraftArchitect',
            Description: build.description,
            Name: build.name,
            Software: 'MinecraftArchitect_AI',
            RegionCount: new NBT.Int32(1),
            TimeCreated: BigInt(Date.now()),
            TimeModified: BigInt(Date.now()),
            TotalBlocks: new NBT.Int32(blocks.length),
            TotalVolume: new NBT.Int32(totalVolume),
            PreviewImageData: new Int32Array(0)
        },
        Regions: {
            [build.name]: {
                Position: {
                    x: new NBT.Int32(0),
                    y: new NBT.Int32(0),
                    z: new NBT.Int32(0)
                },
                Size: {
                    x: new NBT.Int32(sizeX),
                    y: new NBT.Int32(sizeY),
                    z: new NBT.Int32(sizeZ)
                },
                BlockStatePalette: palette,
                BlockStates: blockStates,
                Entities: [],
                TileEntities: [],
                PendingBlockTicks: [],
                PendingFluidTicks: []
            }
        }
    };

    const compressed = await NBT.write(nbtData, { compression: 'gzip' });
    fs.writeFileSync('./nether_hub.litematic', Buffer.from(compressed));
    console.log(`Successfully generated nether_hub.litematic (${compressed.byteLength} bytes)!`);
}

generateLitematic().catch(console.error);
