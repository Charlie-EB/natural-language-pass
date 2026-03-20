# Implementation Plan

All application source code lives in `src/`. Nothing has been implemented yet. The `src/` directory does not exist and must be created.

## Priority 1: Word Lists — `src/words.js`

- [x] Create `src/` directory
- [ ] Extract the 1,296 adjectives and 7,776 nouns from `nlp.html` into two global `const` arrays: `ADJECTIVES` and `NOUNS`
- [ ] Source data: `nlp.html` line 12 contains `var adjective_words` (1,296 entries) and line 14 contains `var noun_words` (7,776 entries) — extract and rename
- [ ] After extraction, validate array lengths: `ADJECTIVES.length === 1296` and `NOUNS.length === 7776`
- [ ] Arrays are plain JS constants (no ES modules) loaded via `<script>` tag before `app.js`
- [ ] Add `// @ts-check` at top of file and JSDoc `/** @type {string[]} */` annotation on each array
- [ ] Use a script to parse the arrays from `nlp.html` (e.g., Python/Node to extract JSON arrays from the var declarations)
- Spec ref: `generation-algorithm.md` § Word Lists, `tech-architecture.md` § Module Strategy, § Type Safety

## Priority 2: Core Logic — `src/app.js`

- [ ] Add `// @ts-check` at top of file and JSDoc annotations (`@param`, `@returns`) on all functions
- [ ] `secureRandomIndex(max)` — uses `crypto.getRandomValues()` with `Uint32Array(1)`; `Math.random()` is forbidden; returns `Math.floor((array[0] / 2**32) * max)`
- [ ] `generatePassphrase(wordCount, separator)` — alternating adjective-noun pattern: adj at odd positions (1st, 3rd, …), noun at even positions (2nd, 4th, …); if N is odd, trailing word is an adjective
- [ ] `calculateEntropy(wordCount)` — computes `Math.ceil(wordCount/2) * Math.log2(ADJECTIVES.length) + Math.floor(wordCount/2) * Math.log2(NOUNS.length)` bits
- [ ] `getStrengthLabel(bits)` — returns "Good" (bits < 60), "Strong" (60 <= bits < 80), "Very Strong" (80 <= bits < 100), "Excellent" (bits >= 100)
- [ ] Entropy display format: `🔒 {rounded bits} bits — {label}` (per `entropy-and-security.md` § Format)
- [ ] UI wiring on `DOMContentLoaded`:
  - [ ] Slider `input` event updates word-count label text (does NOT auto-regenerate passphrase)
  - [ ] Generate button click calls `generatePassphrase()`, updates display element and entropy indicator
  - [ ] Copy button click copies passphrase to clipboard via `navigator.clipboard.writeText()`, shows "Copied!" feedback for ~1.5s, then reverts; falls back gracefully if clipboard API is unavailable
  - [ ] Separator picker (radio buttons) `change` event updates selected separator value
  - [ ] Auto-generate on page load with defaults (5 words, space separator)
- Spec ref: `generation-algorithm.md`, `entropy-and-security.md`, `user-interface.md` § Behavior, `tech-architecture.md` § Type Safety

## Priority 3: Page Markup — `src/index.html`

- [ ] Single centered card/panel layout containing (top to bottom):
  1. Title/heading with brief tagline
  2. Word count slider (`<input type="range" min="5" max="10" value="5">`) with `<label>` showing current value (e.g., "5 words")
  3. Separator picker (radio buttons): Space (default, checked), Hyphen, Period, Underscore, None — each with `name="separator"` and appropriate `value` attribute
  4. Generate button (prominent, primary-styled) with text "Generate Passphrase"
  5. Passphrase display area (large, monospace, `aria-live="polite"` region)
  6. Copy button with adjacent feedback text span
  7. Entropy indicator (bits + strength label, subdued/secondary style)
- [ ] Script tags at end of body: `<script src="words.js"></script>` then `<script src="app.js"></script>` (no ES modules, no CORS issues)
- [ ] Link `style.css` in `<head>`
- [ ] Accessibility: `<label for="...">` on slider, descriptive button text, `aria-live="polite"` on passphrase output
- Spec ref: `user-interface.md`, `tech-architecture.md` § File Structure

## Priority 4: Styling — `src/style.css`

- [ ] Clean, minimal aesthetic; no framework CSS
- [ ] Single centered card with `max-width` constraint (~500-600px), comfortable padding, slight shadow or border
- [ ] Responsive: usable at 320px+, single-column, no horizontal scroll
- [ ] Touch-friendly slider and buttons (adequate tap targets, min 44px height)
- [ ] Monospace font for passphrase display, sufficient contrast
- [ ] Visual feedback: selected separator state (radio checked styling), copy button "Copied!" state
- [ ] Light color scheme only (dark mode is non-goal for v1)
- [ ] WCAG AA color contrast minimum (4.5:1 for normal text, 3:1 for large text)
- Spec ref: `user-interface.md` § Visual Style, § Responsive Design, § Accessibility

## Completed

_(none yet)_
