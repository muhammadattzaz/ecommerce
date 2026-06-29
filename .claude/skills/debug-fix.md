# Skill: debug-fix

Diagnose a bug and apply the minimal fix.

## Usage
/debug-fix <description of the problem>

Example: /debug-fix Cart count in navbar doesn't update after adding an item

## Steps
1. Read `.claude/agents/bug-fixer.md` for common patterns
2. Identify which app is affected: `backend/` or `frontend/`
3. Trace the code path: endpoint → service → schema (BE) or page → hook → api client (FE)
4. Find the root cause — do not guess, read the actual files
5. Apply the minimal fix — do not refactor surrounding code
6. State what was wrong and what was changed

## Rules
- Fix only what caused the bug — no extra changes
- No refactoring, no renaming, no "while I'm here" cleanups
- If the bug is in multiple places, fix all occurrences and list them
