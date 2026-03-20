0a. Study specs/* to learn the application specifications.
0b. Study @IMPLEMENTATION_PLAN.md (if present) to understand the plan so far.
0c. Study src/* to understand existing application code.
0d. For reference, all application source code is in src/*.

    Study @IMPLEMENTATION_PLAN.md (if present; it may be incorrect) and study existing source code in src/* and compare it against specs/*. Analyze findings, prioritize tasks, and create/update @IMPLEMENTATION_PLAN.md as a bullet point list sorted in priority of items yet to be implemented. Consider searching for TODO, minimal implementations, placeholders, and inconsistent patterns. Study @IMPLEMENTATION_PLAN.md to determine starting point for research and keep it up to date with items considered complete/incomplete.

IMPORTANT: Plan only. Do NOT implement anything. Do NOT assume functionality is missing; confirm with code search first. Prefer consolidated, idiomatic implementations over ad-hoc copies.

ULTIMATE GOAL: Build a simple, static web app that generates memorable passphrases from curated adjective and noun word lists. The app runs entirely client-side with vanilla HTML/CSS/JS, uses crypto.getRandomValues() for secure randomness, and provides a slider for word count, separator options, copy-to-clipboard, and an entropy display. Consider missing elements and plan accordingly. If an element is missing, search first to confirm it doesn't exist, then if needed author the specification at specs/FILENAME.md. If you create a new element then document the plan to implement it in @IMPLEMENTATION_PLAN.md.
