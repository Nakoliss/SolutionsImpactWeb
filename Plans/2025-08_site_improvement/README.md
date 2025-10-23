# Website Improvement Master Plan (August 2025)

Owner: AI Implementation Agent
Status: In Progress
Target Completion: 4 weeks

## Objective
Unify codebase, strengthen i18n & SEO, convert strategic documents into lead-generation content, and establish a foundation for compliance-focused differentiation (Bill 64) while improving developer experience and performance.

## Guiding Principles
- Single source of truth for the app (eliminate duplication)
- Deterministic builds + translation parity
- Compliance & trust as differentiators
- Lead generation integrated into content
- Incremental, production-safe changes (small PRs)

---
## Phase Overview
1. Repository & Architecture Hygiene
2. Internationalization & Content Structure
3. Compliance & Lead Gen Content Conversion
4. SEO & Structured Data Enhancements
5. Performance & Accessibility Baseline
6. Developer Experience & Quality Gates
7. Conversion Features (Assessment, Calculator)
8. Advanced Differentiators (Compliance Heatmap, AI Roadmap Generator)

Each phase has acceptance criteria and a checklist (see `TODO.md`).

---
## Dependencies & Sequencing Rationale
- Phase 1 precedes all to avoid rework (duplicate root vs `web/`).
- Lockfile + Node environment required before adding DX tooling (Phase 6).
- Content conversion (Phase 3) feeds structured data & SEO (Phase 4).
- Conversion features (Phase 7) rely on stable content taxonomy & i18n.

---
## Success Metrics
| Dimension | Baseline | Target |
|-----------|----------|--------|
| Duplicate codebases | 2 | 1 |
| Translation key parity gap | (to measure) | 0 missing keys |
| Lighthouse Performance (mobile) | (baseline) | >85 |
| Lead form CVR from compliance pages | 0% | >3% |
| Bundled JS (initial) | (baseline) | <130KB gzip |
| Time-to-publish new guide | ad hoc | <15 min via MDX |

---
## Risk Register
| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden dependency on deleted root app | Medium | Search & remove references before deletion |
| Missing lockfile causes env drift | High | Regenerate immediately after Node fix |
| i18n regressions | Medium | Add untranslated key detection script & CI check |
| SEO cannibalization between locales | Medium | Unique localized meta + hreflang |
| Scope creep in advanced tools | High | Time-box Phase 8; separate repo if needed |

---
## File / Artifact Deliverables
- `/web` retained as single app root
- Removed: duplicate root app files (app/, package.json) if decommissioned
- `scripts/` utilities: `i18n-lint.ts`, `content-validate.ts`, `bundle-analyze.sh`
- `content/` folder with MDX for compliance + pricing guides
- `components/` for shared UI (CTAs, forms, layout, calculators)
- `lib/seo/` structured data helpers
- `public/schema/` JSON-LD snapshots (optional)
- `tests/` (unit + e2e smoke)
- `README` updated with run + content authoring guide
- `CONTRIBUTING.md` & `ARCHITECTURE.md`

---
## Acceptance Criteria (Global)
- Fresh clone + `npm ci` deterministic build
- `npm run lint` & typecheck pass
- All pages available in EN + FR with no missing keys
- Compliance hub landing page live with lead form test submission stored/logged
- Pricing calculator functional (client-side only MVP)
- Accessibility audit: no critical axe violations on key pages
- Structured data validates (Google Rich Results test) for Organization + Service + FAQ (if added)

---
## Future (Post-Plan) Nice-to-Haves
- CMS integration (Headless for content authors)
- Automated translation suggestion pipeline
- Analytics dashboard for funnel metrics

Refer to `TODO.md` for actionable task breakdown.
