# Minecraft Architect — Agent Rules

This project is a **Minecraft build generation skill** with an interactive 3D
browser-based viewer. It lets an AI agent design Minecraft structures and
preview them in real-time using Three.js.

## Project Structure

```
├── index.html              # 3D viewer (Three.js, loads blockstates/models/textures)
├── agent_creation.js       # Agent-generated build (overwritten per build request)
├── assets/minecraft/       # Minecraft block textures, models, blockstates
├── package.json            # Dependencies (nbtify, pako — for .litematic parsing)
└── .agents/skills/
    └── minecraft-architect/
        ├── SKILL.md         # Full skill instructions (activate for build requests)
        ├── references/      # Supplemental docs (palettes, algorithms, templates)
        └── scripts/         # Dev tools (block extraction, data generation)
```

## Key Rules

1. **Always read the skill first.** Before generating any Minecraft build, read
   `.agents/skills/minecraft-architect/SKILL.md` — it contains block palettes,
   game-tier constraints, geometry algorithms, and quality checklists.

2. **Output goes to `agent_creation.js`.** Every build must overwrite this file
   completely. The file exports a `generateDefaultBuild()` function that returns
   `{ blocks, name, description }`.

3. **Verify block IDs.** Never invent Minecraft block names. Search the web or
   check the Minecraft Wiki to confirm every `minecraft:*` identifier.

4. **Ask before building.** If the user's request is missing shape, dimensions,
   style, or game stage — ask. Don't assume. See §1.3 and §1.4 of the skill.

5. **Reference images are welcome.** Encourage users to attach screenshots,
   real photos, or concept art. Analyze them to extract shape, palette, and
   architectural details before building.

6. **Preview with `npx serve .`** or any static file server on the project root.
   The viewer auto-loads `agent_creation.js` when no `.litematic` file is
   provided.
