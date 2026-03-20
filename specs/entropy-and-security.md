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

## Strength Description

### Purpose

Display a plain-language description of passphrase strength alongside the entropy bits, so non-technical users can understand what their passphrase protects against. Based on threat assessments from the [Diceware FAQ](https://theworld.com/~reinhold/dicewarefaq.html#howlong) by Arnold Reinhold (who also documents the NLP word lists used by this app).

### Rationale

Precise crack-time or cost estimates (e.g., "76 days" or "$2,300") give a false sense of precision — they depend heavily on the hash algorithm, attacker hardware, and future advances. Threat tier descriptions are more honest and more useful: they tell the user *who* could realistically break their passphrase, not a specific number that may be wrong.

Our entropy calculation is exact (cryptographic randomness from known list sizes), but translating entropy into real-world breakability requires assumptions. Threat tiers acknowledge this uncertainty while still giving actionable guidance.

### Descriptions by Word Count

| Words | Entropy | Description |
|-------|---------|-------------|
| 5     | ~57 bits | Breakable with a thousand or so PCs equipped with high-end graphics processors. Criminal gangs with botnets of infected PCs can marshal such resources. |
| 6     | ~70 bits | May be breakable by an organization with a very large budget, such as a large country's security agency. |
| 7     | ~80 bits | Unbreakable with any known technology, but may be within the range of large organizations by around 2030. |
| 8     | ~93 bits | Completely secure through 2050. |
| 9     | ~103 bits | Completely secure for the foreseeable future. Exceeds any projected computing capability. |
| 10    | ~116 bits | Completely secure for the foreseeable future. Exceeds any projected computing capability. |

Note: Descriptions for 5–8 words are adapted from the Diceware FAQ. Descriptions for 9–10 words extrapolate conservatively — at 103+ bits, brute-force is infeasible even with speculative future hardware.

### Display Format

Show the description below the entropy line:

```
🔒 57 bits — Good
🛡️ Breakable with ~1,000 PCs with high-end GPUs (e.g., criminal botnets)
```

```
🔒 80 bits — Very Strong
🛡️ Unbreakable with any known technology
```

### Implementation

Map word count directly to a description string — no runtime calculation needed. The descriptions are static per word count.

```js
function getStrengthDescription(wordCount) {
  const descriptions = {
    5: "Breakable with ~1,000 PCs with high-end GPUs (e.g., criminal botnets)",
    6: "May be breakable by a large country's security agency",
    7: "Unbreakable with known technology; may be in range of large organizations by ~2030",
    8: "Completely secure through 2050",
    9: "Completely secure for the foreseeable future",
    10: "Completely secure for the foreseeable future"
  };
  return descriptions[wordCount] || "";
}
```

### Caveats

- These descriptions assume the attacker knows the word lists and generation pattern (Kerckhoffs's principle)
- Actual security also depends on the hash algorithm used by the service storing the password — stronger hashing (bcrypt, Argon2) makes cracking harder
- Projections for far-future security have the most uncertainty

## Non-Goals

- No password strength estimation based on dictionary attacks or pattern matching (we use pure combinatorial entropy)
- No comparison to other password types (e.g., "equivalent to a 12-character random password")
