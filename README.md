# Merge Mate

A portal for reviewing AI-generated merge conflict resolutions. Merge Mate runs as a GitHub Action that detects conflicts during rebase and automatically resolves them. This UI lets you review each resolution and approve or deny.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- prism-react-renderer (syntax highlighting)
- lucide-react (icons)

## Features

- **Sidebar** with conflict list, filterable by file or by commit SHA
- **Rebase map** SVG showing before/after commit graph
- **Three-panel diff** (Original | Conflict | AI Resolution) with line-level and word-level change highlighting on the AI Resolution column
- **Synchronized scroll** across all three code panels
- **Per-hunk and bulk approve/deny** with toast notifications and progress tracking
- **Keyboard shortcut**: `Cmd+Enter` to approve all

## Project Structure

```
src/
  data/           # TypeScript types and mock conflict data
  utils/          # Diff computation engine (LCS-based)
  components/
    layout/       # Sidebar, tabs, toolbar
    main/         # Content area, empty state, conflict detail
    rebase-map/   # SVG commit graph
    resolution/   # Three-panel diff, AI explanation
    actions/      # Approve/deny buttons, action bar
    shared/       # Status dots, toast
```

## Build

```bash
npm run build
```

Output goes to `dist/`.
