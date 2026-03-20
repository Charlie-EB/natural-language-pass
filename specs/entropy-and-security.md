# Entropy and Security

## Job to Be Done

> "I want to understand how strong my generated passphrase is so I can trust it for my accounts."

## Overview

The app calculates and displays the entropy (in bits) of the generated passphrase, giving users a clear signal of its strength. All generation happens client-side with no data leaving the browser.

## Entropy Calculation

### Formula

Entropy is calculated based on the number of possible passphrases given the word counts and list sizes:

```
entropy_bits = num_adjectives * log2(adjective_list_size) + num_nouns * log2(noun_list_size)
```

Where:
- `adjective_list_size` = 1,296
- `noun_list_size` = 7,776
- `num_adjectives` and `num_nouns` depend on the word count and the alternating pattern

### Per-Word Entropy

| Word Type  | List Size | Bits per Word |
|-----------|-----------|---------------|
| Adjective | 1,296     | ~10.34        |
| Noun      | 7,776     | ~12.93        |

### Total Entropy by Word Count

| Words | Pattern (Adj/Noun) | Entropy (bits) |
|-------|-------------------|----------------|
| 5     | 3 adj + 2 noun    | ~56.88         |
| 6     | 3 adj + 3 noun    | ~69.81         |
| 7     | 4 adj + 3 noun    | ~80.15         |
| 8     | 4 adj + 4 noun    | ~93.08         |
| 9     | 5 adj + 4 noun    | ~103.42        |
| 10    | 5 adj + 5 noun    | ~116.35        |

### Implementation

```js
function calculateEntropy(wordCount) {
  const adjBits = Math.log2(ADJECTIVES.length);
  const nounBits = Math.log2(NOUNS.length);
  const numAdj = Math.ceil(wordCount / 2);
  const numNoun = Math.floor(wordCount / 2);
  return (numAdj * adjBits) + (numNoun * nounBits);
}
```

## Entropy Display

### Format

Display entropy as a rounded whole number with a strength label:

```
🔒 57 bits — Good
```

### Strength Labels

| Bits       | Label      |
|-----------|------------|
| < 60      | Good       |
| 60 – 80   | Strong     |
| 80 – 100  | Very Strong |
| > 100     | Excellent  |

Note: Even the minimum (5 words, ~57 bits) is a strong passphrase for most purposes. The labels are intentionally positive — we don't show "weak" because the minimum word count already provides meaningful security.

### Placement

- Displayed below the passphrase output
- Updates whenever a new passphrase is generated
- Subdued/secondary visual style — informative but not dominant

## Security Guarantees

### Client-Side Only

- **No network requests** during or after generation
- **No telemetry or analytics** that could leak passphrases
- **No server-side component** — the app is static files only
- Word lists are embedded in the JavaScript source

### Cryptographic Randomness

- All word selection uses `crypto.getRandomValues()` (Web Crypto API)
- `Math.random()` is explicitly forbidden in generation logic
- See `generation-algorithm.md` for implementation details

### No Storage

- Passphrases are NOT stored in `localStorage`, `sessionStorage`, cookies, or any persistent storage
- Passphrases exist only in memory and the DOM
- Refreshing the page clears the passphrase

### Clipboard

- The copy function uses `navigator.clipboard.writeText()`
- The app does not read from the clipboard
- Clipboard contents are managed by the user's OS (the app cannot clear them)

## User Guidance

The page may include a brief note (tooltip or footer text) explaining:

- What entropy means in plain language (e.g., "57 bits means an attacker would need to try over 100 quadrillion combinations")
- That physical dice provide the strongest guarantee (no software RNG involved)
- That `crypto.getRandomValues()` is the browser's cryptographic RNG and is suitable for password generation

This guidance is optional for v1 — the entropy display alone is the minimum requirement.

## Non-Goals

- No password strength estimation based on dictionary attacks or pattern matching (we use pure combinatorial entropy)
- No comparison to other password types (e.g., "equivalent to a 12-character random password")
- No time-to-crack estimates (these depend on attacker resources and become outdated)
