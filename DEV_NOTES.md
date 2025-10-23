# Working Notes — Daniel SaaS Agency (Ernest)

- Stack: Next.js (App Router) in `web/`, TypeScript, Tailwind, i18n (`fr`/`en`).
- Key UI: `web/components/BusinessCarousel.tsx` contains 10 designs (switchable).
- Services data: `web/content/services.fr.json`, `web/content/services.en.json`.
- Texts/labels: UI strings from `web/messages/{fr,en}.json`.
- Homepage routes: `web/app/[locale]/page.tsx` wraps the carousel.

## Issue addressed
- “Design #10 — Services Domicile Pro” had mismatched service titles/content compared to other designs.
- Cause: The section used hardcoded labels for service blocks instead of the shared `services.*.json` texts. Modals were already wired to `servicesData`, but card names and mappings diverged.

## Changes made
- In `web/components/BusinessCarousel.tsx`, within the Home/Services Domicile Pro section:
  - Main block 1 (Websites): title now from `servicesData.websites.title`, description from `servicesData.websites.description`, and bullets from `servicesData.websites.tiers[0].bullets`.
  - Main block 2 (Marketing Automation): title now from `servicesData.marketingAutomation.title`, description from `servicesData.marketingAutomation.description`, and bullets from `servicesData.marketingAutomation.tiers[0].bullets`.
  - Secondary cards now open the correct services and show dynamic titles/prices: `seoOptimization`, `socialMediaBusiness`, `advancedFeatures`, `maintenance`.
  - Standardized CTAs on Home service cards and buttons to use `m.services.cta`.
  - Header CTA in Home changed to use `{m.packages.contact}` and wired to `scrollToContact`.
- Modals
  - Replaced hardcoded “Demander un devis / Get Quote” with `{m.packages.contact}` in the AI Agency modal.
  - Verified Home modal uses dynamic `service.title`, `service.description`, and tier bullets/prices consistently.

## Next improvements (safe follow-ups)
- Normalize accented characters in `web/content/services.fr.json` and `web/messages/fr.json` to remove garbled glyphs.
- Sweep all modal components to replace any remaining hardcoded CTA copy with `{m.packages.contact}` and audit for any hardcoded strings.
- Add a small unit snapshot test for the Home section to assert it renders texts from `servicesData`.

## File map (quick)
- UI: `web/components/BusinessCarousel.tsx`
- Messages: `web/messages/{fr,en}.json`
- Services: `web/content/services.{fr,en}.json`
- Pages: `web/app/[locale]/*`
- SEO: `web/lib/seo/structuredData.ts`
