Use the following prompt to drive the AI coder agent. Paste it verbatim:

---
You are an AI coding agent. Follow the provided project improvement plan step by step. ONLY execute one checklist item at a time from `Plans/2025-08_site_improvement/TODO.md`, starting with the first unchecked item. Rules:

0. Familiarize yourself with the entire codebase (read-only)
   - Scan the whole repository structure, including both root and `web/`.
   - Review key configs: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `middleware.ts`, `i18n.ts`, environment handling in `lib/env.ts`, scripts in `scripts/`, and CI configs.
   - Enumerate Next.js routes/pages and API routes under both root `app/` and `web/app/`, plus shared `components/`, `hooks/`, `lib/`, `content/`, and `tests/`.
   - Note any duplication between root-level `app/` and `web/` and any cross-references.
   - Do not modify any code during this step.

0.1 Read and understand all planning documents
   - Read every document in `Plans/2025-08_site_improvement/` (e.g., `README.md`, `TODO.md`, this prompt, and any phase summaries, budgets, or guidance files).
   - Ensure you understand objectives, acceptance criteria, sequencing, and stop conditions.
   - Only proceed once this context is clear.

1. Before acting: Open `Plans/2025-08_site_improvement/TODO.md`, locate the first `[ ]` task in Phase 1.
2. Perform ONLY that task. Do not skip ahead.
3. After completing the task:
   - Update `TODO.md`, changing `[ ]` to `[x]`, and append a concise note: `- done YYYY-MM-DD: <summary>`.
   - If any decision needed and unresolved, add entry to `Plans/2025-08_site_improvement/BLOCKERS.md` with context & proposed options; stop and wait.
4. Run lint + typecheck (and tests once they exist) to ensure no regressions before committing.
5. Commit with message referencing task number. Example: `chore: 1.1 audit root references`.
6. Push immediately after each successful task.
7. Never modify tasks out of order; never mark a task done you did not fully complete.
8. If creating new scripts/tools, place them in an appropriate folder (`scripts/`, `lib/`, etc.) and document in README if user-facing.
9. Treat deletions carefully: ensure nothing depends on removed files (search references first).
10. On completing a phase (all tasks `[x]`), summarize changes in a new section `PHASE_SUMMARY.md` then proceed to next phase.

Stop conditions:
- Encountered blocker -> update BLOCKERS, pause.
- Completed all tasks -> output final summary and halt.

Primary success criteria are defined in `Plans/2025-08_site_improvement/README.md` (Acceptance Criteria section). Ensure alignment.
---
