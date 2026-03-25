# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal technical blog built with **Astro 5** and a fully custom theme. Apple/Google-inspired minimalist aesthetic. Content written in Markdown with multi-level directory structure. Deployed as static site to free hosting (GitHub Pages / Vercel / Netlify). Chinese language primary (`lang="zh-CN"`).

## Commands

- `npm run dev` — Start dev server (http://localhost:4321)
- `npm run build` — Build static site to `dist/`
- `npm run preview` — Preview production build locally

## Architecture

Astro 5, **static output** mode (pre-rendered HTML, no server runtime). No UI framework (React/Vue) — pure `.astro` components. Zero client JS except for theme toggle and mobile hamburger menu.

### Content System

Single `books` content collection using `glob()` loader. Schema in `src/content.config.ts`.

Content lives in `src/content/books/` with multi-level folder structure:
```
books/java/hashmap/deep-dive.md  →  entry.id = "java/hashmap/deep-dive"
books/mysql/indexing/b-tree.md   →  entry.id = "mysql/indexing/b-tree"
```

`entry.id` is the slash-separated path from `src/content/books/` — this is used directly as the URL slug and for tree generation. Adding new categories requires only creating folders and `.md` files — no schema or config changes needed.

Frontmatter fields: `title` (required), `description`, `pubDate`, `order` (controls sibling sort), `draft`.

### Routing

- `/books/[...slug].astro` — catch-all route handles all content depths via `getStaticPaths()` mapping `entry.id` to `params.slug`
- `/books/index.astro` — category listing, groups entries by first path segment

### Tree Sidebar

`src/utils/tree.ts` exports `buildTree()` — pure function that transforms flat `CollectionEntry[]` into nested `TreeNode[]`. Used by `BooksLayout.astro` to render the left sidebar.

Tree nodes use `<details>/<summary>` HTML for expand/collapse with **zero JavaScript**. Current page highlighting and ancestor auto-expansion are computed at build time via slug string comparison.

### Layout Hierarchy

- `BaseLayout.astro` — HTML shell, dark-mode flash-prevention script, `<Navbar />`
- `BooksLayout.astro` — extends BaseLayout, adds two-column grid (sidebar + content), breadcrumbs, prose styles

### Styling

CSS custom properties in `src/styles/global.css` — all design tokens (colors, spacing, fonts, radii). Dark mode via `[data-theme="dark"]` attribute on `<html>`. Component styles are scoped by default. No CSS framework.

Navbar uses `backdrop-filter: blur(20px)` frosted glass effect. Mobile breakpoint at 768px, sidebar breakpoint at 1024px.

## Design Direction

- Minimalist, clean aesthetic inspired by Apple and Google design language
- Custom-built theme — no third-party theme dependencies
- System font stack with Chinese font support (PingFang SC, Noto Sans SC); Playfair Display serif for signature
- Dark/light mode with OS preference detection + manual toggle
- Glassmorphism throughout: navbar, cards, mobile sidebar, hero card
- Entrance animations with staggered fade-up; `prefers-reduced-motion` respected

## Critical Decisions (do not change without good reason)

- **Single `books` collection** with filesystem-driven routing — entry.id = URL slug = tree source
- **`<details>/<summary>`** for tree expand/collapse — zero JS, build-time state
- **`data-theme` attribute** on `<html>` + inline `<head>` script — prevents dark mode flash
- **Nav links absolute-centered** (`position: absolute; left: 50%; transform: translateX(-50%)`)
- **`buildTree()` in `src/utils/tree.ts`** is the single source of truth for navigation hierarchy

## Version History

See `SUMMARY-v0.1.md` for full v0.1 architecture decisions, design system documentation, and known limitations.
