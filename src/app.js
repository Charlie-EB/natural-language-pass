// @ts-check

/**
 * Returns a cryptographically secure random integer in [0, max).
 * @param {number} max - The exclusive upper bound (must be >= 1).
 * @returns {number}
 */
function secureRandomIndex(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return Math.floor((array[0] / 2 ** 32) * max);
}

/**
 * Computes the entropy in bits for a passphrase of the given word count.
 * Uses the alternating adjective-noun pattern: odd positions draw from
 * ADJECTIVES, even positions draw from NOUNS.
 * @param {number} wordCount - Number of words (5–10).
 * @returns {number} Entropy in bits.
 */
function calculateEntropy(wordCount) {
  const adjCount = Math.ceil(wordCount / 2);
  const nounCount = Math.floor(wordCount / 2);
  return adjCount * Math.log2(ADJECTIVES.length) + nounCount * Math.log2(NOUNS.length);
}

/**
 * Generates a passphrase with alternating adjective-noun pattern.
 * Odd positions (1st, 3rd, …) are adjectives; even positions (2nd, 4th, …) are nouns.
 * If wordCount is odd, the trailing word is an adjective.
 * @param {number} wordCount - Number of words (5–10).
 * @param {string} separator - Character(s) inserted between words.
 * @returns {string}
 */
function generatePassphrase(wordCount, separator) {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    if (i % 2 === 0) {
      words.push(ADJECTIVES[secureRandomIndex(ADJECTIVES.length)]);
    } else {
      words.push(NOUNS[secureRandomIndex(NOUNS.length)]);
    }
  }
  return words.join(separator);
}
