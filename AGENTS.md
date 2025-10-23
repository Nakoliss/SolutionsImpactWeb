# Repository Guidelines

## Project Structure & Module Organization
- `web/` — Next.js 15 app (authoritative source). Key folders: `app/`, `components/`, `lib/`, `messages/`, `content/`, `public/`, `__tests__/`, `tests/`, `scripts/`.
- `Documents/`, `Plans/` — business docs and planning artifacts.
- `.github/workflows/` — CI (lint, TS check, tests, build, a11y).
- Import alias: use `@/` for code under `web/` (see `tsconfig.json`).

## Build, Test, and Development Commands
Run all commands from `web/`:
- `npm run dev` — start dev server.
- `npm run build` / `npm run start` — production build/run.
- `npm run lint` / `npm run lint:fix` — ESLint (Next + import sort).
- `npx tsc --noEmit` — strict type check (CI uses this).
- `npm run i18n:lint` / `npm run content:validate` — translation and content checks.
- `npm run test` / `npm run test:run` — unit tests (Vitest).
- `npm run test:a11y` — Playwright + axe accessibility. Ensure the app is running (or set `BASE_URL`).

## Coding Style & Naming Conventions
- Formatting via `.editorconfig`: LF, UTF‑8, spaces, 2‑space indent, trim trailing whitespace.
- TypeScript strict; prefer `const`, narrow types, and `@/` imports.
- ESLint: Next.js rules, `simple-import-sort`, no duplicate imports.
- Naming: React components `PascalCase.tsx` in `components/`; utilities `camelCase.ts` in `lib/`; tests `*.test.ts`/`*.test.tsx`.

## Testing Guidelines
- Unit tests: Vitest + Testing Library under `web/__tests__/`.
- Accessibility: Playwright tests in `web/tests/`. Run `npm run dev` then `npm run test:a11y` (or set `BASE_URL=http://localhost:3000`).
- Add tests for new logic and maintain a11y assertions where UI changes impact semantics.

## Commit & Pull Request Guidelines
- Commit style: Conventional Commits are preferred (examples from history: `feat:`, `fix:`, `ui(scope):`, `content(scope):`, `chore:`). Use imperative mood and optional scope.
- PRs: include description, linked issues, before/after screenshots for UI, and note any i18n updates. Verify locally: `lint`, `tsc`, `test:run`, `i18n:lint`, `build`, `test:a11y`.

## Security & Configuration Tips
- Do not commit secrets. Configure env via system or platform; see `web/lib/env.ts` for validation. Sentry is supported (`@sentry/nextjs`).

## Architecture
- See `ARCHITECTURE.md` for detailed overview. All app changes live in `web/`.
