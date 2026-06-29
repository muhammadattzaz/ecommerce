# Skill: ship

Stage, commit, and optionally push the current changes.

## Usage
/ship [commit message]

Example: /ship "feat: add product recommendations endpoint"

## Steps
1. Run `git status` — show what will be committed, confirm with user
2. Run `git diff --staged` and `git diff` — summarise what changed
3. Stage relevant files (never .env, never node_modules, never dist/)
4. Commit with the provided message (or draft one from the diff if none given)
   Format: `<type>(<scope>): <description>`
   Types: feat | fix | chore | refactor | test | docs
5. Ask user: "Push to remote? (y/n)"
6. If yes: run `git push`

## Commit Message Examples
- `feat(products): add search and category filter endpoints`
- `fix(cart): atomic stock check on add-to-cart`
- `chore(seed): add 20 sample products across 5 categories`
- `test(auth): add e2e checkout journey spec`

## Safety Checks
- Never commit .env files
- Never commit files in uploads/ (binary assets)
- Never force push
- Warn if committing directly to main
