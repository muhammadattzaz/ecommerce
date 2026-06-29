# ShopForge Development Pipeline

Invoke with `/pipeline-start <feature or task description>`.

---

## Pipeline Stages

```
1. PLAN       → scope the feature, identify files to change, confirm before building
2. BACKEND    → implement API (schema, service, controller, DTOs)
3. REVIEW-BE  → api-reviewer + db-reviewer gate — fix critical issues before advancing
4. FRONTEND   → implement pages, hooks, components, stores
5. DESIGN     → fe-designer polishes UI (tokens, responsive, dark mode, animation)
6. REVIEW-FE  → code-reviewer gate — fix critical issues before advancing
7. TEST       → write unit + e2e tests for the new feature
8. SECURITY   → security-reviewer checks guards, data exposure, input validation
9. SHIP       → commit with conventional message
```

---

## Stage Details

### Stage 1 — Plan
- Read `CLAUDE.md` for full project context
- Read `backend/src/app.module.ts` for existing modules
- Read `frontend/app/` for existing pages
- Define: which endpoints change, which pages/components are new or modified
- Write a short bullet-list plan and confirm with the user before writing any code

### Stage 2 — Backend
Agent: `be-developer` · Rules: `.claude/rules/backend.md`

- Create or update schema, DTOs, service methods, controller endpoints
- Apply correct guards (public / JwtAuthGuard / admin)
- Add Swagger decorators on every endpoint
- Verify endpoint works before moving to Stage 3

### Stage 3 — Backend Review
Agents: `api-reviewer` + `db-reviewer`

- `api-reviewer`: REST conventions, HTTP status codes, guards, Swagger docs
- `db-reviewer`: indexes, atomic operations, data integrity, no float prices
- Write findings to `.claude/context/review-notes.md`
- **Gate:** fix all Critical findings before advancing to Stage 4

### Stage 4 — Frontend
Agent: `fe-developer` · Rules: `.claude/rules/frontend.md`

- Create or update pages, hooks (`lib/hooks/`), API client (`lib/api/`), Zustand stores
- No direct API calls in components — always via hooks
- Use `ROUTES` constants — no hardcoded strings
- Server components by default — `'use client'` only where needed

### Stage 5 — Design Polish
Agent: `fe-designer`

- Verify semantic Tailwind tokens used (no hardcoded hex)
- Check responsive breakpoints on new pages/components
- Check dark mode renders correctly
- Verify animations respect `prefers-reduced-motion`
- Confirm theme panel and font panel still work

### Stage 6 — Frontend Review
Agent: `code-reviewer`

- Check: hooks used for data, no `any`, RHF+Zod for forms, loading + error states present
- **Gate:** fix all Critical findings before advancing to Stage 7

### Stage 7 — Tests
Agent: `qa-tester` · Rules: `.claude/agents/qa-tester.md`

- Unit tests for new service methods
- E2e test updated if checkout or auth flow changed
- Run `npm run test --prefix backend` — must pass before Stage 8

### Stage 8 — Security
Agent: `security-reviewer`

- Verify new endpoints have correct guards
- Verify no secrets hardcoded in new files
- Verify customer ownership enforced on user-scoped resources
- **Gate:** fix all Critical findings before shipping

### Stage 9 — Ship
Skill: `/ship`

- Stage only relevant files (never .env, never uploads/)
- Commit with conventional message: `feat(<scope>): <description>`
- Confirm with user before pushing

---

## Context Files (ephemeral — not committed)

| File | Written by |
|---|---|
| `.claude/context/current-feature.md` | Stage 1 plan |
| `.claude/context/review-notes.md` | Stages 3, 6, 8 review findings |

---

## Branch Naming Convention
```
feat/<short-description>     feat/recommendations
fix/<short-description>      fix/cart-stock-check
chore/<short-description>    chore/seed-data
test/<short-description>     test/checkout-journey
```

## Commit Message Format
```
feat(products): add text search and price range filter
fix(cart): use atomic findOneAndUpdate for stock decrement
chore(seed): add 20 products across 5 categories
test(orders): add e2e checkout journey
refactor(auth): extract token helpers to auth.utils.ts
```

---

## Error Recovery

| Problem | Action |
|---|---|
| Backend tests fail | Fix before moving to frontend |
| Critical review finding | Fix and re-run that review agent |
| TypeScript build error | Check types in `types/` and API client |
| Seed script fails | Verify `MONGODB_URI` in `backend/.env` |
| Dark mode broken | Check CSS variable names in `globals.css` and Tailwind config |
