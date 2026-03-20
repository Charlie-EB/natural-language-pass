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
| Logic     | Vanilla JavaScript (JSDoc `@ts-check` for type safety) |
| Randomness| Web Crypto API     |
| Build     | None               |

## File Structure

```
nl-passwords/
├── docs/
│   ├── index.html      # Main (and only) page
│   ├── style.css       # All styles
│   ├── words.js        # ADJECTIVES and NOUNS arrays
│   └── app.js          # Generation logic, UI wiring, entropy calc
├── specs/              # Requirement specs
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

All source files live in `docs/` to keep the project root clean.

## Module Strategy

Scripts are loaded via standard `<script>` tags in order:

```html
<script docs="words.js"></script>
<script docs="app.js"></script>
```

`words.js` exposes `ADJECTIVES` and `NOUNS` as global constants. `app.js` references them directly. No module bundler, no ES modules (to avoid CORS issues when opening from filesystem).

## Type Safety

All `.js` files use JSDoc annotations with `// @ts-check` at the top. This provides editor-time type checking (VS Code, etc.) with zero build step — the browser runs the files as-is.

```js
// @ts-check

/** @type {string[]} */
const ADJECTIVES = ["curly", "faded", ...];

/**
 * @param {number} max
 * @returns {number}
 */
function secureRandomIndex(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return Math.floor((array[0] / 2 ** 32) * max);
}
```

No `tsconfig.json` or TypeScript compiler is required. Type annotations are purely for developer experience.

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

Configure GitHub Pages to serve from the `docs/` folder on the `master` branch. `docs/index.html` is the entry point.

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
- No TypeScript compiler (JSDoc `@ts-check` annotations provide type safety without a build step)
- No testing framework in v1 (manual browser testing is sufficient for this scope)
- No CI/CD pipeline
- No server-side rendering
