# Minecraft Architect

An AI-powered Minecraft build generator with an interactive 3D browser preview.
Tell an AI agent what you want to build, and it generates the structure
block-by-block — then renders it in a real-time Three.js viewer with authentic
Minecraft textures.

![Minecraft Architect](https://img.shields.io/badge/Minecraft-Architect-ff6a33?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNGE4NTJhIi8+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjOGI2ZjQ3Ii8+PC9zdmc+)

## Features

- **AI Build Generation** — Describe any Minecraft structure and the agent
  generates it programmatically with correct block IDs, block states, and
  proportions
- **Interactive 3D Viewer** — Real-time Three.js renderer with authentic
  Minecraft block textures, ambient occlusion, and first-person camera controls
- **Litematica Support** — Load and view `.litematic` and `.schem` schematic
  files
- **Game-Tier Awareness** — Materials are constrained to Early/Mid/Late game
  progression so builds are survival-appropriate
- **Reference Image Support** — Attach screenshots, real photos, or concept art
  to guide the build
- **Layer-by-Layer Viewing** — Slice through builds at any Y-level
- **Shape Clarification** — The agent asks for footprint shape (rectangular,
  cylindrical, L-shaped, etc.) instead of filling bounding boxes

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/uddipmayur/minecraft-architect.git
cd minecraft-architect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the viewer

```bash
npx serve@latest .
```

Open `http://localhost:3000` in your browser.

### 4. Start building with your AI agent

Open the project in your editor and ask the agent to build something:

> "Build me a medieval castle with a moat, 30×30 footprint, mid-game materials"

The agent will overwrite `agent_creation.js` with your build. Refresh the
viewer to see it.

## Installation as an AI Skill

This project works as a shareable **AI coding agent skill**. Once installed,
any AI agent (Antigravity, Claude Code, Cursor, Windsurf, etc.) can use the
Minecraft Architect skill to generate builds.

### Option A: Antigravity / Claude Code / Cursor (Recommended)

Add a `skills.json` file to your project's `.agents/` directory (or
`~/.gemini/config/` for global installation):

```json
{
  "entries": [
    {
      "path": "/absolute/path/to/minecraft-architect"
    }
  ]
}
```

Or for global installation (available in all projects):

```json
{
  "entries": [
    {
      "path": "~/minecraft-architect"
    }
  ]
}
```

### Option B: Direct Copy

Copy the `.agents/skills/minecraft-architect/` directory into your project's
`.agents/skills/` folder:

```bash
cp -r /path/to/minecraft-architect/.agents/skills/minecraft-architect \
      ./your-project/.agents/skills/
```

### Option C: Claude Code (`CLAUDE.md`)

If your tool uses `CLAUDE.md`, create one at your project root and point to the
skill:

```markdown
# Minecraft Architect

When asked to build Minecraft structures, read the skill instructions at:
`.agents/skills/minecraft-architect/SKILL.md`

All builds are written to `agent_creation.js` in the project root.
```

## 🎮 Viewer Controls

| Control                | Action                   |
| :--------------------- | :----------------------- |
| **Right-click + drag** | Look around              |
| **WASD**               | Fly forward/back/strafe  |
| **Space / Shift**      | Fly up / down            |
| **Scroll wheel**       | Adjust movement speed    |
| **Layer slider**       | Slice build at Y-level   |
| **AO toggle**          | Ambient occlusion on/off |

## Project Structure

```
minecraft-architect/
├── index.html                    # 3D viewer (Three.js + litematica parser)
├── agent_creation.js             # AI-generated build output (overwritten per build)
├── AGENTS.md                     # Agent rules (auto-discovered by AI tools)
├── package.json                  # Dependencies (nbtify, pako)
│
├── assets/minecraft/             # Minecraft Java Edition assets
│   ├── blockstates/              # Block state definitions (JSON)
│   ├── models/                   # Block model definitions (JSON)
│   └── textures/block/           # Block texture PNGs (16×16)
│
└── .agents/skills/
    └── minecraft-architect/
        ├── SKILL.md              # Full skill instructions (800+ lines)
        ├── references/           # Supplemental docs
        │   ├── palettes.md       # Color palette reference
        │   ├── shape_algorithms.md  # Geometry formulas
        │   └── threejs_template.md  # Viewer template
        └── scripts/              # Dev tools (block data extraction)
            ├── dump.js
            ├── extract_blocks.js
            └── blocks.json
```

## 📸 Tip: Include Reference Images!

For the best results, **attach reference images** with your build request:

- **Minecraft screenshots** of builds you admire
- **Real-world photos** of architecture you want to replicate
- **Sketches or floor plans** — even rough hand-drawn ones help
- **Mood boards** — Pinterest links, color palettes, style references

The agent will analyze the image to extract the shape, block palette, and
architectural details, then confirm its interpretation before building.

## How It Works

1. **You describe a build** to your AI agent (text + optional reference images)
2. **The agent reads the skill** from `SKILL.md` for block palettes, geometry
   algorithms, and quality checklists
3. **The agent generates JavaScript** that places blocks programmatically and
   writes it to `agent_creation.js`
4. **The 3D viewer** loads the build, resolves block models and textures from
   the Minecraft asset pipeline, and renders it in Three.js

## License

This project includes Minecraft block textures and model definitions extracted
from Minecraft Java Edition. These assets are © Mojang Studios / Microsoft and
are included here for educational and preview purposes only. They are not
redistributed as a standalone resource pack.

The viewer code and skill instructions are open source under the MIT License.
