# Tech Architecture

## Job to Be Done

> "I want a simple, maintainable web app with no build step and no dependencies."

## Overview

The app is a static site built with vanilla HTML, CSS, and JavaScript. No frameworks, no bundlers, no package managers. It can be opened directly from the filesystem or served by any static file host.

## Stack

| Layer     | Technology         |
|-----------|--------------------|
| Markup    | HTML5              |
| Styling   | Plain CSS          |
| Logic     | Vanilla JavaScript |
| Randomness| Web Crypto API     |
| Build     | None               |

## File Structure

```
nl-passwords/
├── index.html          # Main (and only) page
├── css/
│   └── style.css       # All styles
├── js/
│   ├── words.js        # ADJECTIVES and NOUNS arrays
│   └── app.js          # Generation logic, UI wiring, entropy calc
├── specs/              # Requirement specs (this directory)
│   ├── generation-algorithm.md
│   ├── user-interface.md
│   ├── entropy-and-security.md
│   └── tech-architecture.md
├── nlp.html            # Legacy standalone generator (preserved)
├── nlp.py              # Legacy Python CLI (preserved)
├── nlp.sql             # Legacy database dump (preserved)
└── README.md           # Project documentation
```

### Rationale for Separate Files

The existing `nlp.html` is a single 88KB file with everything inlined. The new app separates concerns:

- **`words.js`** — Isolates the large word arrays (~90% of the JS by size). Makes `app.js` easy to read and edit.
- **`app.js`** — All application logic. Small and focused.
- **`style.css`** — Styles separated from markup for maintainability.
- **`index.html`** — Clean markup with `<script>` and `<link>` tags.

## Module Strategy

Scripts are loaded via standard `<script>` tags in order:

```html
<script src="js/words.js"></script>
<script src="js/app.js"></script>
```

`words.js` exposes `ADJECTIVES` and `NOUNS` as global constants. `app.js` references them directly. No module bundler, no ES modules (to avoid CORS issues when opening from filesystem).

## Deployment

### Requirements

- Serve static files over HTTPS (for `crypto.getRandomValues()` — required in secure contexts)
- Any static host works: GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a simple Nginx/Apache server
- No server-side processing

### Local Development

- Open `index.html` in a browser directly, OR
- Use any local HTTP server: `python3 -m http.server 8000`
- No install step, no `npm install`, no build step

### GitHub Pages

The repo can be configured to serve from the root of the `master` branch. `index.html` at the root will be the entry point.

## Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Requires `crypto.getRandomValues()` — supported in all modern browsers
- Requires `navigator.clipboard.writeText()` — supported in modern browsers over HTTPS
- No IE11 support

## Legacy Files

The existing files (`nlp.html`, `nlp.py`, `nlp.sql`, PDFs) are preserved in the repo. They are not linked from the new app and serve as historical reference.

## Non-Goals

- No build step (no Webpack, Vite, Rollup, etc.)
- No package manager (no npm, yarn, etc.)
- No CSS preprocessor (no Sass, Less, etc.)
- No TypeScript
- No testing framework in v1 (manual browser testing is sufficient for this scope)
- No CI/CD pipeline
- No server-side rendering
