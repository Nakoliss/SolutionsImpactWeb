# Contributing Guide

Thanks for contributing to AI_Web_Agency! This short guide explains how to set up your environment, how localization works, and the guardrails that keep encoding and i18n healthy.

## Prerequisites

- Node.js 20.14.x and npm 10.x (see web/package.json engines)
- PNPM/Yarn are not used in this repo
- Playwright browsers for a11y tests

Install dependencies and Playwright once:

```
cd web
npm ci
npx playwright install --with-deps
```

## Running the app

```
npm run dev
```

## Tests

- Unit tests: `npm run test:run`
- Accessibility (Playwright + axe): `npm run test:a11y`

## Localization (i18n)

- UI strings live in `web/messages/{en,fr}.json` (ICU-friendly)
- Content lives under `web/content/` (e.g., `*.fr.mdx`, `*.en.mdx`, or `*.fr.json`)
- Keep key parity between `en` and `fr`

Helpful scripts:

- Parity/placeholder lint (non-blocking): `npm run i18n:lint`
- Scan for mojibake/encoding issues (blocking): `npm run i18n:check`
- Heuristic repair (use with care): `npm run i18n:fix-mojibake` and `npm run i18n:fix-fr`

## Encoding & Formatting

- The repository enforces UTF‑8 and LF line endings via `.gitattributes` and `.editorconfig`
- VS Code workspace defaults are set in `.vscode/settings.json`
- Avoid pasting Windows‑1252/Latin‑1 text; if you must import content, normalize to UTF‑8 first

## Git Hooks

We use Husky with a pre‑commit hook that runs:

1. `lint-staged` (format/lint changed files)
2. `npm run i18n:lint` (warn-only)
3. `npm run content:validate` (warn-only)
4. `npm run i18n:check` (must pass; rejects commits with mojibake)

If you haven’t installed hooks yet, run:

```
# from repo root
npm --prefix web run prepare
```

To bypass the hook in emergencies: `git commit -n` (not recommended for regular work).

## CI

GitHub Actions runs on push/PR:

- Install deps
- i18n parity/content validation (non‑blocking)
- Encoding/mojibake check (blocking)
- Unit tests
- Next.js build
- Playwright accessibility tests

To make the a11y checks required for merging:

1. In GitHub, go to Settings → Branches → Branch protection rules
2. Edit your `main` rule (or create one)
3. Under “Require status checks to pass”, enable the workflow job named `ci` (and/or specific steps if you split jobs)

## Adding New Text

- Prefer adding new keys to `messages/en.json` and translating in `messages/fr.json`
- For content pieces, add `*.en.mdx` and `*.fr.mdx` pairs (or JSON) under `content/`
- Avoid hard‑coded strings in components; pull from i18n instead

## Troubleshooting

- Seeing characters like `Ã©`, `├®`, or `Â`? Run `npm run i18n:check` to locate issues and `npm run i18n:fix-fr` or `i18n:fix-mojibake` to attempt repair.
- If the app displays mojibake at runtime, check your source files first; the runtime includes a small safety net, but source should always be UTF‑8 clean.

Happy shipping! 🚀

