# Skill: fe-create-component

Scaffold a new React component for ShopForge.

## Usage
/fe-create-component <ComponentName> [ui|storefront|admin|layout]

Example: /fe-create-component ProductCard storefront

## Steps
1. Read `.claude/rules/frontend.md`
2. Determine placement: `components/ui/`, `components/storefront/`, `components/admin/`, or `components/layout/`
3. Create the component file with explicit TypeScript interface for props
4. Add `'use client'` only if the component needs event handlers, hooks, or browser APIs
5. Use only semantic Tailwind tokens (no hardcoded hex)
6. Export as named export (not default)

## Output
Single component file. Typed props. cn() for conditional classes. Responsive. Accessible (focus states, alt text).
