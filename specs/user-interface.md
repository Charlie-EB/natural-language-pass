# User Interface

## Job to Be Done

> "I want to quickly configure and generate a passphrase with minimal friction."

## Overview

A single-page interface with a clean, minimal layout. The user adjusts settings, clicks generate, and copies the result. No navigation, no multi-step flows.

## Layout

The page consists of a single centered card/panel containing, from top to bottom:

1. **Title/heading** — App name and brief tagline
2. **Word count slider** — Range input with label showing current value
3. **Separator picker** — Small set of options for the separator character
4. **Capitalize toggle** — Checkbox to capitalize each word
5. **Generate button** — Primary action
5. **Passphrase display** — Large, readable output area
6. **Copy button** — Copies passphrase to clipboard
7. **Entropy indicator** — Shows strength/bits of entropy (see `entropy-and-security.md`)

## Components

### Word Count Slider

- HTML `<input type="range">`
- Range: 5 to 10
- Default: 5
- Displays current value as a label (e.g., "5 words")
- Updates the label reactively as the user drags

### Separator Picker

- A small group of buttons or radio inputs
- Options: `Space`, `Hyphen`, `Period`, `Underscore`, `None`
- Default: Space
- Visual indication of which is selected

### Capitalize Toggle

- A checkbox or toggle switch
- Label: "Capitalize Words"
- Default: off (unchecked)
- When enabled, each word in the passphrase starts with an uppercase letter
- Cosmetic only — does not affect entropy calculation or strength display
- Placed alongside the separator picker as a generation option

### Generate Button

- Prominent, primary-styled button
- Label: "Generate" or "Generate Passphrase"
- Triggers passphrase generation on click
- Should also generate on page load so the user sees a passphrase immediately

### Passphrase Display

- Large, monospace or semi-monospace font for readability
- Sufficient contrast for easy reading
- Selectable text (user can manually select if preferred)
- Displayed in a visually distinct area (card, bordered box, or similar)

### Copy Button

- Adjacent to or below the passphrase display
- Copies the passphrase text to the clipboard using `navigator.clipboard.writeText()`
- Provides brief visual feedback on success (e.g., button text changes to "Copied!" for 1-2 seconds)
- Falls back gracefully if clipboard API is unavailable

## Behavior

### On Page Load

- Generate a passphrase automatically with default settings (5 words, space separator)
- User sees a usable passphrase without any interaction

### On Slider Change

- Update the word count label
- Do NOT auto-regenerate — user must click Generate
- (Rationale: avoids unexpected passphrase changes while user is adjusting settings)

### On Generate Click

- Generate a new passphrase with current slider and separator values
- Display it in the passphrase area
- Update the entropy indicator

### On Copy Click

- Copy passphrase to clipboard
- Show "Copied!" feedback briefly

## Responsive Design

- The layout should be usable on mobile screens (320px+)
- Single-column layout works at all sizes
- Touch-friendly slider and buttons (adequate tap targets)
- No horizontal scrolling

## Accessibility

- Slider has an associated `<label>`
- Generate and Copy buttons have descriptive text (no icon-only buttons)
- Passphrase display uses an `aria-live` region so screen readers announce new passphrases
- Sufficient color contrast (WCAG AA minimum)

## Visual Style

- Clean, minimal aesthetic
- No heavy framework CSS (no Bootstrap, Tailwind, etc.)
- Custom CSS kept simple — a few hundred lines at most
- Light color scheme (dark mode is a non-goal for v1)

## Non-Goals

- No dark mode in v1
- No passphrase history
- No user accounts or saved preferences
- No animations beyond the copy button feedback
