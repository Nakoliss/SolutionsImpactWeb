# 🚀 Checklist de Déploiement — Correctif #1

**Version:** 1.0  
**Date de Déploiement:** _____________  
**Responsable:** _____________

---

## 📋 Avant Déploiement (Pre-Deployment)

### Code Quality

- [ ] **Linter:** `npm run lint` ✅ (0 erreurs)
  ```bash
  npm run lint
  # Expected: ✓ No issues found
  ```

- [ ] **TypeScript:** `npx tsc --noEmit` ✅ (0 erreurs)
  ```bash
  npx tsc --noEmit
  # Expected: ✓ No errors
  ```

- [ ] **Tests unitaires:** `npm run test:run` ✅
  ```bash
  npm run test:run
  # Expected: ✓ All tests pass
  # Vérifier spécialement: servicesData.test.ts
  ```

- [ ] **Build production:** `npm run build` ✅
  ```bash
  npm run build
  # Expected: ✓ compiled successfully
  # Watch for: Next.js warnings/errors
  ```

### Manual Testing (Local)

- [ ] **Serveur dev démarre:**
  ```bash
  npm run dev
  # Expected: ✓ Ready in XXXms on http://localhost:3000
  ```

- [ ] **Page d'accueil FR (`/`):**
  - [ ] Services visibles sans "Chargement…"
  - [ ] Au moins 3 cartes affichées
  - [ ] Texte français correct

- [ ] **Page d'accueil EN (`/en`):**
  - [ ] Services visibles sans "Chargement…"
  - [ ] Texte anglais correct

- [ ] **Page `/services` (FR):**
  - [ ] URL: `http://localhost:3000/services`
  - [ ] Hero section affiche
  - [ ] Services dans grille 2 colonnes
  - [ ] Pas de "Chargement…"

- [ ] **Page `/services` (EN):**
  - [ ] URL: `http://localhost:3000/en/services`
  - [ ] Tout en anglais

- [ ] **Sans JavaScript (DevTools):**
  ```
  F12 → Settings → Disable JavaScript → Refresh
  ```
  - [ ] Services toujours visibles sur home
  - [ ] Services toujours visibles sur /services
  - [ ] Pas d'erreurs console

- [ ] **View-Source HTML:**
  ```
  Ctrl+U → Ctrl+F "Nos services"
  ```
  - [ ] Titre présent dans HTML
  - [ ] Au moins 1 service article visible
  - [ ] JSON-LD `@type: ItemList` présent

### SEO Validation (Local)

- [ ] **Schema.org Validator:**
  1. Ouvrir: https://validator.schema.org/
  2. Coller HTML local ou URL (si accessible)
  3. Vérifier: `ItemList` + `Service` types OK

- [ ] **JSON-LD Correctness:**
  - [ ] `@type` = "ItemList" ✅
  - [ ] `numberOfItems` > 0 ✅
  - [ ] Chaque item a `@type: ListItem` ✅
  - [ ] Chaque item.item a `@type: Service` ✅
  - [ ] Prices en CAD ✅
  - [ ] URLs absolutes ✅

### Accessibility Testing

- [ ] **Lighthouse (Chrome DevTools):**
  ```
  F12 → Lighthouse → Accessibility
  ```
  - [ ] Score ≥ 90
  - [ ] 0 violations critiques
  - [ ] Contraste text OK
  - [ ] ARIA labels OK

- [ ] **Keyboard Navigation:**
  - [ ] Tab traverse tous les services
  - [ ] Enter ouvre modal
  - [ ] ESC ferme modal
  - [ ] Focus visible partout

### Performance Baseline

- [ ] **Lighthouse Score:**
  - [ ] Performance ≥ 90
  - [ ] Accessibility ≥ 90
  - [ ] Best Practices ≥ 90
  - [ ] SEO ≥ 90

- [ ] **Core Web Vitals (Local):**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

---

## 📦 Déploiement (Deployment)

### Pre-Deployment Review

- [ ] **Code Review:** ✅ Approuvé par [Nom]
- [ ] **QA Signoff:** ✅ Approuvé par [Nom]
- [ ] **Backup:** ✅ DB backup créé (si applicable)
- [ ] **Rollback Plan:** ✅ Documenté

### Git Workflow

- [ ] **Branch créée:** `correctif/services-ssr`
  ```bash
  git checkout -b correctif/services-ssr
  ```

- [ ] **Commits squashés:** (optionnel, dépend de la policy)
  ```bash
  git rebase -i main
  # Si policy: Squash into 1 commit
  ```

- [ ] **PR créée:**
  ```
  Title: "Correctif #1: SSR/SSG Services avec JSON-LD"
  
  Description:
  - Services rendues côté serveur (SSR)
  - Pas de "Chargement…" sans JS
  - JSON-LD ItemList + Service
  - Page dédiée /services
  - Tests unitaires en place
  
  Closes: [Issue #XXX]
  ```

- [ ] **PR Approuvée:** ✅ [Reviewer]
- [ ] **Merges dans `main`:**
  ```bash
  git merge --squash correctif/services-ssr  # ou rebase
  git push origin main
  ```

### Vercel/Hosting Deployment

- [ ] **Build réussit sur Vercel:** ✅
  - [ ] Pas d'erreurs dans le log de build
  - [ ] Preview URL accessible

- [ ] **Environment variables OK:**
  - [ ] `SERVICES_API_URL` (si applicable) configurée
  - [ ] `SERVICES_API_TOKEN` (si applicable) configurée
  - [ ] Vérifier: `npm run build` local avec les mêmes env

- [ ] **Production URL accessible:**
  - [ ] `https://solutionsimpactweb.com/`
  - [ ] `https://solutionsimpactweb.com/services`
  - [ ] `https://solutionsimpactweb.com/en/services`

---

## ✅ Post-Deployment (24-72 heures après)

### Immediate Checks (1 heure après)

- [ ] **Uptime Monitor:** ✅ Pas de 5xx errors
  ```
  Vérifier dashboard: Sentry, UptimeRobot, etc.
  ```

- [ ] **Page d'accueil:**
  - [ ] Services visibles
  - [ ] Pas de "Chargement…"
  - [ ] Layout correct

- [ ] **Page `/services`:**
  - [ ] Accessible
  - [ ] Services affichés
  - [ ] Modals fonctionnent

- [ ] **Sans JavaScript (test via curl ou HeadlessChrome):**
  ```bash
  curl -s https://solutionsimpactweb.com/ | grep "Nos services"
  # Expected: HTML contient le texte
  ```

- [ ] **Console Errors (F12):** ✅ Aucune erreur rouge

### SEO Verification (24-48 heures)

- [ ] **Google Index Status:**
  1. Aller: https://search.google.com/search-console
  2. Chercher URL: `/services`
  3. Cliquer "Request Indexing"

- [ ] **Rich Results (24-72 heures):**
  1. Aller: https://search.google.com/test/rich-results
  2. Tester URL: `https://solutionsimpactweb.com/services`
  3. Vérifier: ItemList + Service types OK

- [ ] **Sitemap Validation:**
  1. Vérifier: `https://solutionsimpactweb.com/sitemap.xml`
  2. Chercher: `/services` présent
  3. Vérifier: `/fr/services` et `/en/services`

### Analytics Setup

- [ ] **Google Analytics 4:**
  - [ ] `/services` page track correctement
  - [ ] Events capturés (clicks, etc.)

- [ ] **Sentry Error Tracking:**
  - [ ] Aucune error critique liée à services
  - [ ] Fallback API log correct

### Performance Baseline (Production)

- [ ] **PageSpeed Insights:**
  1. Tester: https://pagespeed.web.dev/
  2. URL: `https://solutionsimpactweb.com/`
  3. Vérifier:
     - [ ] Performance ≥ 90
     - [ ] Mobile LCP < 2.5s
     - [ ] Desktop LCP < 2.5s

- [ ] **Google Search Console → Core Web Vitals:**
  - [ ] "Good" metrics dominent
  - [ ] Pas de regressions

### User Feedback (24-72 heures)

- [ ] **Test Utilisateurs:** ✅ Feedback positif
- [ ] **Support Tickets:** ✅ Aucune plainte relative à services
- [ ] **Bug Reports:** ✅ Aucun

---

## 📊 Monitoring (Ongoing)

### Daily (Premier mois)

- [ ] **Uptime:** Vérifier pas de 5xx
- [ ] **Errors:** Vérifier Sentry/logs
- [ ] **Performance:** Vérifier Core Web Vitals
- [ ] **Search Console:** Vérifier indexation `/services`

### Weekly (Premier mois)

- [ ] **SEO Metrics:**
  - [ ] /services impressions dans GSC
  - [ ] /services clicks dans GSC
  - [ ] CTR évolution

- [ ] **Analytics:**
  - [ ] Traffic vers /services
  - [ ] Bounce rate page
  - [ ] Conversion rate

### Monthly (Ongoing)

- [ ] **Core Web Vitals Trend:**
  - [ ] LCP stable < 2.5s
  - [ ] CLS stable < 0.1

- [ ] **Indexation:**
  - [ ] `/services` toujours indexée
  - [ ] Rich results toujours détectés

---

## 🔄 Rollback Plan

### Si problèmes critiques (Immediate):

**Cas: Services ne s'affichent pas**
```bash
# 1. Git revert
git revert <commit-sha>
git push origin main

# 2. Vercel rebuild automatic
# (ou manuellement si needed)

# 3. Monitor
# Vérifier la page revient à l'état précédent
```

**Cas: API Error infinite loop**
```bash
# Même process que ci-dessus
# (Fallback devrait l'empêcher, mais backup plan)
```

**Cas: Performance régression > 20%**
```bash
# 1. Vérifier via Lighthouse:
#    npm run build && npm run start
#    F12 → Lighthouse

# 2. Si confirmé problème:
#    Rollback et investiguer

# 3. Deployer fix:
#    Optimiser images, code split, etc.
```

### Rollback Steps

1. **Confirm Issue:** Vérifier via monitoring/alerts
2. **Git Revert:** 
   ```bash
   git revert -n <commit-sha>
   git commit -m "Revert: Correctif #1 temporary"
   git push origin main
   ```
3. **Monitor:** Vérifier stable dans 15-30 min
4. **Post-Mortem:** Documenter l'issue et la fix

---

## 📝 Sign-Off

### Pre-Deployment

- [ ] QA Lead: _________________ Date: _____
- [ ] Tech Lead: _________________ Date: _____
- [ ] Product Owner: _________________ Date: _____

### Deployment Executed

- [ ] Deployed by: _________________ Date: _____
- [ ] Time: _________________ Duration: _____

### Post-Deployment

- [ ] Verified by: _________________ Date: _____
- [ ] All checks passed: _________________ Date: _____
- [ ] Monitoring setup: _________________ Date: _____

---

## 📞 Emergency Contact

**Incident Response Team:**
- Primary: _________________ Phone: _____________
- Secondary: _________________ Phone: _____________

**Escalation:**
- If issues detected, contact above immediately
- Have rollback command ready
- Document all changes/decisions

---

## 📚 Reference Docs

- **Audit Complet:** `AUDIT_CORRECTIF_1.md`
- **Tests Guide:** `TESTS_CORRECTIF_1.md`
- **Executive Summary:** `CORRECTIF_1_EXECUTIVE_SUMMARY.md`
- **Architecture:** `ARCHITECTURE.md`

---

**Version:** 1.0  
**Status:** Ready for Deployment ✅  
**Last Updated:** 2025-11-18


