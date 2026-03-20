# Execution Loop — NL Passwords

You are an **orchestrator** working through a pre-built plan, one task per iteration. Spawn subagents to do the heavy lifting — keep your context for decision-making and coordination.

## Context Loading

0a. Study the requirement specs in `specs/` with a subagent to learn the application specification.
0b. Study `@IMPLEMENTATION_PLAN.md` to understand the current plan and pick the most important unchecked `[ ]` item.
0c. For reference, all application source code is in `src/`.

## Loop (ONE task per iteration — hard rule)

**You must complete exactly one `[ ]` item from `IMPLEMENTATION_PLAN.md`, then STOP.** Do not look ahead to the next item. Do not start a second task. One task, one commit, then yield control.

1. **Pick** the most important unchecked `[ ]` item in `IMPLEMENTATION_PLAN.md`. That is your sole focus.
2. **Search before coding** — spawn subagents to verify the item is actually needed (read the relevant code, check if already implemented). Do not assume functionality is missing. If already done, mark `[x]` and STOP.
3. **Implement** — spawn a subagent to make the change. Give it the task description from `IMPLEMENTATION_PLAN.md`, the relevant file names, and any cross-cutting context. The subagent should read the relevant spec file(s) in `specs/` for details.
4. **Validate** — spawn a subagent to open `src/index.html` in a browser-like check:
   - Read the generated HTML/JS/CSS and verify it is syntactically valid.
   - Check that `<script>` and `<link>` tags reference the correct filenames in `src/`.
   - Verify no use of `Math.random()` in generation logic (must use `crypto.getRandomValues()`).
   If issues are found, fix them before proceeding.
5. **Mark done** — change `[ ]` to `[x]` in `IMPLEMENTATION_PLAN.md`.
6. **Commit** — `git add -A && git commit -m "<short description>"`
7. **STOP.** Do not continue to the next task. Your iteration is over.

## Rules

1. **ONE TASK PER ITERATION. This is the most important rule.**
   - Do not batch, combine, or chain multiple items.
   - Do not say "while I'm here" and fix something else.
   - After your commit, STOP.
2. **Do not modify `IMPLEMENTATION_PLAN.md` beyond marking items `[x]`.** If you discover a new issue, note it in a commit message — do not update the plan yourself.
3. **Do not modify files in `specs/`.** They are the spec. If the spec seems wrong, stop and ask.
4. If `IMPLEMENTATION_PLAN.md` has no unchecked items, print "All tasks complete." and stop.
5. Do not refactor or clean up code beyond what the current task requires.
6. Implement fully. No placeholders, stubs, or "for now" shortcuts.
7. Single sources of truth. If the old format is gone, remove all traces of it.
