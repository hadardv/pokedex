# Poké Berries — React + TypeScript + TanStack Query

React project that lists and filters **PokéAPI berries** with a custom **vertical Firmness Slider** (drag with live motion + snap) and **debounced search**. Built to demonstrate solid frontend practices: typed API boundaries (DTO → domain mapping), TanStack Query for fetching, and modular CSS.

---

## Features

- **Data fetching with TanStack Query v5** (no `useEffect`/`useState` for fetching).
- **Firmness Slider** (vertical): smooth live drag, snapping between levels, glow color per firmness.
- **Search with debounce**.
- **Feature-first structure** with **CSS Modules**.
- **DTO → Domain mapping** (decouples UI from raw API).
- **Bounded concurrency** for detail fetches.
- **Slider drag**: powered by `@use-gesture/react` for simpler code.

---

## Stack

- Vite + React + TypeScript  
- @tanstack/react-query (+ Devtools)  
- CSS Modules  
- @use-gesture/react for drag handling  

---

## Project structure

```
src/
  app/                 
  lib/                 # http, hooks, helpers
  utils/               # slider geometry
  features/
    berries/
      api/             # HTTP-only calls
      queries/         # TanStack query hooks
      types/           # DTO + domain types
      components/      # BerryCard, SearchInput, FirmnessSlider, EmptyState
      pages/           # BerriesPage screen
```

---

## 🔌 API & Types

- `GET /berry?limit=...` → **BerryListDTO** (list of links)
- `GET /berry/:id|:name` → **BerryDetailDTO** (firmness, flavors, ...)

**Berry** domain type:
```ts
type Berry = {
  id: number;
  name: string;
  firmness: "very-soft" | "soft" | "hard" | "very-hard" | "super-hard";
  flavors: { name: string; potency: number }[];
};
```
Only flavors with `potency > 0` are kept.

---

## Firmness Slider (how it works)

- **Live drag**: while dragging, the knob & glow follow the pointer continuously.
- **Snap**: selection updates only when the pointer crosses the midpoint of the nearest row.
- **Color**: hue (HSL) changes by firmness (`118°` green → `28°` orange → `6°/355°` red).

---

## Search (Debounce)

A tiny `useDebouncedValue` hook delays filtering (e.g. 300ms) for smoother typing and fewer renders.

---

## Install & Run

```bash
npm i
npm run dev
# open http://localhost:5173
```

