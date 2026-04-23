# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Start the reviews backend (required for review form to work):**
```bash
node server.js        # or: npm start
# Runs on http://127.0.0.1:3000
# Open pages at http://127.0.0.1:3000/index.html
```

**Install backend dependencies:**
```bash
npm install
```

The static HTML pages work standalone without the server — only the review submission/display requires it.

## Architecture

### Two-layer structure
- **Static frontend**: Plain HTML/CSS/JS pages, no build step needed. Open directly in browser or via the Express server.
- **Node.js backend** (`server.js`): Express API on port 3000, file-based storage in `data/reviews.json`. Endpoints: `GET /api/reviews`, `POST /api/reviews`, `GET /api/health`.

### Page system
Every page exists in two language variants:
- English: `index.html`, `shop.html`, `what-we-do.html`
- Spanish: `index-es.html`, `shop-es.html`, `what-we-do-es.html`

Country selection is stored in `localStorage` (`encounter_country`: `CO` or `CA`). The modal in `custom.js` fires on first visit and redirects Colombia users to the `-es` pages.

`event-listing.html` and `profile.html` are leftover template pages from the base theme — not part of the live site.

### Shop page — dual-region store
`shop.html` embeds the external store in an iframe. The `STORES` map in the inline script selects the URL based on `encounter_country`:
- `CO` → `encountercolombiancoffee.com/tienda/`
- `CA` → `encountercolombiancoffee.ca/store/`

A "domain switcher" button in the navbar lets users toggle regions and re-points the iframe.

### CSS layering
Three CSS files compose the visual layer in order:
1. `templatemo-tiya-golf-club.css` — base template (cards, sections, layout primitives)
2. `encounter-custom.css` — brand overrides, all custom components, CSS variables, responsive rules. All custom classes use the `encounter-*` prefix.
3. `reviews.css` — review form and display only

Brand color tokens are defined as CSS variables in `:root` inside `encounter-custom.css` — always use those variables, never hardcode hex values.

### Hero section pattern
The hero (`#encounter_hero`) uses a two-scene system driven by `custom.js`:
- **Scene 1**: background slideshow of `Frase2.jpg` / `Frase1.JPG` with a colored left-panel strip, cycles every 5s internally
- **Scene 2**: static `Frase 3.jpg` background with an image panel overlay

Scenes transition via `.hero-scene` / `.hero-scene.active` opacity, switching every 10s. All hero background images must be `position: absolute` inside `.hero-bg-slideshow` — if any CSS in `encounter-custom.css` breaks (orphaned braces, malformed blocks), the images fall out of absolute positioning and render full-size in the document flow.

### JS files
- `custom.js` — country modal, hero scene slideshow, carousel (`#heroCarousel` / `.carousel-card`), magnetic hover animation (brand statement clock section `#clockContainer`)
- `reviews.js` — fetches/submits reviews via the Node API, handles star rating UI and pagination

### Known development quirk — country modal
`custom.js` line 7 contains an active `localStorage.removeItem('encounter_country')` call that resets the country selector on every page load. It is intentionally left active during development so the modal always fires. Comment it out before any production deploy or when testing the post-selection flow.

### Future Next.js app
`/encounter-coffee-next/` contains a boilerplate Next.js 16 + React 19 + TypeScript + Tailwind setup. It is not used by the live site yet — do not modify it unless explicitly working on the migration.
