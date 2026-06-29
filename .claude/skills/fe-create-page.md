# Skill: fe-create-page

Scaffold a new Next.js App Router page.

## Usage
/fe-create-page <route-path> [storefront|admin]

Example: /fe-create-page products/[slug] storefront

## Steps
1. Read `.claude/rules/frontend.md`
2. Create the page file at `app/(storefront)/<path>/page.tsx` or `app/admin/<path>/page.tsx`
3. Add route constant to `lib/routes.ts`
4. Server component by default — add 'use client' only if needed
5. For admin pages: verify the parent `layout.tsx` has the auth guard
6. Add Next.js `generateMetadata` for SEO (storefront pages)
7. Add loading.tsx skeleton if data fetching is involved

## Output
Page component. Route constant added. Metadata if storefront. Loading skeleton if async.
