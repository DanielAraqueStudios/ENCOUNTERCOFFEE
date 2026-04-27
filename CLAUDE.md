# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**The backend is now pure PHP** — no build step, no dependencies, no installation required on shared hosting.

### Local Development
```bash
php -S localhost:8000        # Start built-in PHP server from project root
# Open: http://localhost:8000/index.html
```

Static pages work standalone; review submission/display and admin features require PHP. See [PHP-SETUP.md](PHP-SETUP.md) for hosting deployment.

### File Structure
```
ENCOUNTERCOFFEE/
├── index.html / index-es.html          (English / Spanish home)
├── shop.html / shop-es.html            (Store pages with embedded iframe)
├── what-we-do.html / what-we-do-es.html (About pages)
├── admin/
│   ├── index.html                      (Login page)
│   └── dashboard.html                  (Admin console)
├── api/                                (PHP backend — pure file-based)
│   ├── reviews.php                     (GET/POST reviews)
│   ├── health.php                      (Health check)
│   ├── auth/                           (Session management)
│   ├── content.php                     (Manage hero/mission text)
│   ├── videos.php                      (Manage video list)
│   └── upload/image.php                (Image upload)
├── data/                               (⚠️ Must be writable: 755 or 777)
│   ├── reviews.json
│   ├── sessions.json
│   ├── admin.json
│   ├── content.json
│   └── videos.json
├── css/
│   ├── templatemo-tiya-golf-club.css  (Base template)
│   ├── encounter-custom.css           (Brand overrides + CSS variables)
│   └── reviews.css                    (Review form/display)
├── js/
│   ├── custom.js                      (Country modal, hero scenes, carousel)
│   ├── reviews.js                     (Review fetch/submit, star UI)
│   └── content-loader.js              (Dynamic content injection)
└── .htaccess                          (CORS headers, rewrites)

## Architecture

### Three-layer structure
- **Static frontend**: Plain HTML/CSS/JS pages, no build step needed. Open directly in browser or via web server.
- **PHP backend APIs**: Pure PHP on same domain, file-based JSON storage, no database needed.
- **Admin panel**: Protected with login, manages reviews, content, videos, uploads.

### API Endpoints by Feature

**Public (no auth required):**
- `GET /api/health.php` — Health check
- `GET /api/reviews.php?page=1&perPage=3` — Fetch reviews with pagination
- `POST /api/reviews.php` — Submit new review
- `GET /api/content.php` — Fetch page content (hero, mission, features)
- `GET /api/videos.php` — Fetch video list

**Admin (requires valid sessionId):**
- `POST /api/auth/login.php` — Login, receive sessionId
- `POST /api/auth/verify.php` — Verify session still valid (24h expiry)
- `POST /api/auth/logout.php` — Destroy session
- `POST /api/content.php` — Update page content
- `POST /api/videos.php` — Update video list
- `POST /api/upload/image.php` — Upload images (JPEG/PNG/GIF/WebP, max 5MB)

**Data persistence — all file-based, stored in `/data/`:**
- `reviews.json` — Customer review list
- `sessions.json` — Active admin sessions (auto-cleaned on verify/login)
- `admin.json` — Admin credentials (password bcrypt-hashed)
- `content.json` — Hero/mission/features text
- `videos.json` — Featured videos metadata

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
- `custom.js` — Country modal (first visit), hero scene transitions (10s cycle, 5s internal slideshow), carousel (`.carousel-card`), magnetic hover on `#clockContainer`. ⚠️ Line 7 has `localStorage.removeItem('encounter_country')` active during dev — comment out before production.
- `reviews.js` — Fetch/display reviews with pagination, submit form, star rating UI, API calls to `/api/reviews.php`
- `content-loader.js` — Dynamically load page content (hero title, mission, features) from `/api/content.php`

## Admin Panel

### Access
- **Login**: `/admin/index.html`
- **Dashboard**: `/admin/dashboard.html` (after login)
- **Default credentials**: username `admin`, password `admin123` (change in production!)

### Features
1. **Reviews Management** — View, delete customer reviews with ratings and statistics
2. **Content Management** — Edit hero, mission, features text
3. **Videos Management** — Manage featured videos list
4. **Image Upload** — Upload images (JPEG, PNG, GIF, WebP, max 5MB)

### Authentication Flow
1. POST `/api/auth/login.php` — User logs in, receives `sessionId`
2. `sessionId` stored in `localStorage` + sent to all admin API calls
3. POST `/api/auth/verify.php` — Verify session is still valid (24-hour expiry)
4. POST `/api/auth/logout.php` — Destroy session

See [ADMIN-SETUP.md](ADMIN-SETUP.md) for complete API and session details.

## Development Notes

### Key Gotchas
1. **Hero section CSS** — All background images in `.hero-bg-slideshow` must be `position: absolute`. If `encounter-custom.css` has orphaned braces or syntax errors, images fall into document flow and render full-size. Validate CSS carefully.
2. **Country modal state** — `custom.js` line 7 has active `localStorage.removeItem('encounter_country')`. Intentionally active during dev so modal always fires. Comment out before production deploy or when testing post-selection flow.
3. **Data directory permissions** — `/data/` must be writable (755 or 777) or file creation fails silently. Check this first if reviews/uploads don't persist.
4. **Session cleanup** — Old sessions auto-cleaned on login/verify, not on a schedule. Monitor `/data/sessions.json` size in production.

### CSS Variables
All brand colors defined in `:root` inside `encounter-custom.css` (e.g., `--encounter-primary`, `--encounter-accent`). Never hardcode hex values — always use variables for consistency.

### Testing Locally
After `php -S localhost:8000`, test in browser console:
```javascript
window.testReviewsAPI()      // Verify API connectivity
window.testReviewsSubmit()   // Verify form submission
```
Both should complete without errors.
