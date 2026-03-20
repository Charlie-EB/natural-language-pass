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
 * Returns a human-readable strength label for the given entropy.
 * @param {number} bits - Entropy in bits.
 * @returns {string}
 */
function getStrengthLabel(bits) {
  if (bits >= 100) return "Excellent";
  if (bits >= 80) return "Very Strong";
  if (bits >= 60) return "Strong";
  return "Good";
}

/**
 * Formats the entropy display string for a given word count.
 * @param {number} wordCount - Number of words (5–10).
 * @returns {string} Formatted string, e.g. "🔒 57 bits — Good"
 */
function formatEntropy(wordCount) {
  const bits = calculateEntropy(wordCount);
  const label = getStrengthLabel(bits);
  return `\u{1F512} ${Math.round(bits)} bits \u2014 ${label}`;
}

/**
 * Returns a word with its first letter uppercased.
 * @param {string} word
 * @returns {string}
 */
function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Generates a passphrase with alternating adjective-noun pattern.
 * Odd positions (1st, 3rd, …) are adjectives; even positions (2nd, 4th, …) are nouns.
 * If wordCount is odd, the trailing word is an adjective.
 * @param {number} wordCount - Number of words (5–10).
 * @param {string} separator - Character(s) inserted between words.
 * @param {boolean} capitalize - Whether to capitalize the first letter of each word.
 * @returns {string}
 */
function generatePassphrase(wordCount, separator, capitalize) {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    var word;
    if (i % 2 === 0) {
      word = ADJECTIVES[secureRandomIndex(ADJECTIVES.length)];
    } else {
      word = NOUNS[secureRandomIndex(NOUNS.length)];
    }
    words.push(capitalize ? capitalizeWord(word) : word);
  }
  return words.join(separator);
}

document.addEventListener("DOMContentLoaded", function () {
  const wordCountSlider = /** @type {HTMLInputElement} */ (document.getElementById("word-count"));
  const wordCountLabel = document.getElementById("word-count-label");
  const generateBtn = document.getElementById("generate-btn");
  const passphraseDisplay = document.getElementById("passphrase-display");
  const copyBtn = document.getElementById("copy-btn");
  const copyFeedback = document.getElementById("copy-feedback");
  const entropyDisplay = document.getElementById("entropy-display");

  /** @type {string} */
  var currentSeparator = " ";
  var checkedRadio = document.querySelector('input[name="separator"]:checked');
  if (checkedRadio) {
    currentSeparator = /** @type {HTMLInputElement} */ (checkedRadio).value;
  }

  // Slider input: update label only (no auto-regenerate)
  wordCountSlider.addEventListener("input", function () {
    wordCountLabel.textContent = wordCountSlider.value + " words";
  });

  // Separator picker: radio buttons change event
  document.querySelectorAll('input[name="separator"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      currentSeparator = /** @type {HTMLInputElement} */ (radio).value;
    });
  });

  var capitalizeCheckbox = /** @type {HTMLInputElement} */ (document.getElementById("capitalize"));

  // Generate button click: generate passphrase and update display + entropy
  generateBtn.addEventListener("click", function () {
    var wordCount = parseInt(wordCountSlider.value, 10);
    passphraseDisplay.textContent = generatePassphrase(wordCount, currentSeparator, capitalizeCheckbox.checked);
    entropyDisplay.textContent = formatEntropy(wordCount);
  });

  // Copy button click: copy passphrase to clipboard with feedback
  copyBtn.addEventListener("click", function () {
    var text = passphraseDisplay.textContent || "";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        copyFeedback.textContent = "Copied!";
        setTimeout(function () {
          copyFeedback.textContent = "";
        }, 1500);
      }).catch(function () {
        copyFeedback.textContent = "Copy failed";
        setTimeout(function () {
          copyFeedback.textContent = "";
        }, 1500);
      });
    } else {
      copyFeedback.textContent = "Clipboard unavailable";
      setTimeout(function () {
        copyFeedback.textContent = "";
      }, 1500);
    }
  });

  // Auto-generate on page load with defaults
  generateBtn.click();
});
