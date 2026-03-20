# Passphrase Generation Algorithm

## Job to Be Done

> "When I need a new password, I want to generate a secure, memorable passphrase in seconds."

## Overview

The app generates passphrases by randomly selecting words from curated adjective and noun lists, following an alternating adjective-noun pattern. All randomness is produced client-side using the Web Crypto API.

## Word Lists

### Source

Word lists are derived from the existing `nlp.html` file in this repository:

- **Adjectives**: ~1,296 words (mapped to 4-dice rolls, i.e., 6^4 permutations would be 1,296 but these use 4-sided combinations)
- **Nouns**: ~7,776 words (mapped to 5-dice rolls, i.e., 6^5 = 7,776)

### Embedding

Word lists are embedded directly in the JavaScript source as arrays. No network requests are needed at runtime. This ensures:

- Offline capability
- No server dependency
- No latency on generation
- Deterministic list size for entropy calculation

### Format

```js
const ADJECTIVES = ["curly", "faded", "lush", ...]; // ~1,296 entries
const NOUNS = ["bookmark", "repairs", "south", ...]; // ~7,776 entries
```

## Word Selection Pattern

Passphrases follow an **alternating adjective-noun** pattern:

```
[adjective] [noun] [adjective] [noun] [adjective] [noun] ...
```

For a passphrase of N words:
- If N is even: N/2 adjective-noun pairs
- If N is odd: (N-1)/2 adjective-noun pairs + 1 trailing adjective

Examples:
- 5 words: `adjective noun adjective noun adjective`
- 6 words: `adjective noun adjective noun adjective noun`
- 7 words: `adjective noun adjective noun adjective noun adjective`

This pattern produces phrases that read somewhat naturally (e.g., "sleepy bookmark faded trapeze curly scanner").

## Randomness

### Requirement

All random word selection MUST use `crypto.getRandomValues()` — the Web Crypto API. This provides cryptographically secure pseudorandom numbers suitable for password generation.

### Implementation

```js
function secureRandomIndex(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return Math.floor((array[0] / 2 ** 32) * max);
}
```

### Constraints

- `Math.random()` MUST NOT be used anywhere in the generation logic
- No server-side randomness — everything runs in the browser
- Each word selection is independent (sampling with replacement)

## Word Count

- **Minimum**: 5 words
- **Maximum**: 10 words
- **Default**: 5 words

The user controls word count via a slider (see `user-interface.md`).

## Separator

The user can choose a separator character inserted between words:

- Space ` ` (default)
- Hyphen `-`
- Period `.`
- Underscore `_`
- No separator (concatenated)

## Output

The generation function returns a string: the selected words joined by the chosen separator.

```js
function generatePassphrase(wordCount, separator) {
  // Returns e.g. "sleepy-bookmark-faded-trapeze-curly"
}
```

## Non-Goals

- No uppercase/lowercase transformation options in v1
- No digit or symbol injection
- No custom word list upload
- No server-side generation
