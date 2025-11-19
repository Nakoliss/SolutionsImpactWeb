# 🧪 GUIDE DE TESTS PRATIQUES — Correctif #1

**Objectif:** Valider que la section "Nos Services" est rendue côté serveur (SSR/SSG) et ne dépend pas d'un fetch client.

---

## Test 1: Sans JavaScript (Vérification Critique)

### Étapes

1. **Lancer le serveur dev:**
   ```bash
   cd web
   npm run dev
   ```
   Attendre le message: `✓ Ready in XXXms`

2. **Ouvrir Chrome/Edge et naviguer:**
   - `http://localhost:3000/` (français)
   - `http://localhost:3000/en` (anglais)

3. **Désactiver JavaScript:**
   - Appuyer sur `F12` (DevTools)
   - Aller à `⋮ Settings → Disable JavaScript`
   - Rafraîchir la page (`Ctrl+R`)

4. **Vérifications visuelles:**
   - [ ] Voir le titre "Nos services" (ou "Our services" en EN)
   - [ ] Voir le sous-titre avec description
   - [ ] Voir au moins 3 cartes de services (WEBSITES, SEO, etc.)
   - [ ] Chaque carte affiche:
     - Titre du service (ex: "WEBSITES")
     - Description courte
     - Liste de features (bullets)
     - Prix (ex: "$700 – $8,000+")
     - Bouton CTA (ex: "Planifier un diagnostic")
   - [ ] **AUCUN texte "Chargement des services…" ou spinner**
   - [ ] Les liens de CTA sont cliquables

### Résultat Attendu

```
✅ Services complètement rendus dans le HTML
✅ Pas d'appel réseau pour charger les services
✅ Pas d'état "Chargement…"
✅ Accès complet aux informations sans JS
```

### Troubleshooting

- **Les services ne s'affichent pas:** Vérifier que `npm run dev` fonctionne (port 3000 libre?)
- **"Chargement…" visible:** Signifie que `disableClientPrefetch` n'est pas activé → vérifier ligne 34 de `/app/[locale]/page.tsx`

---

## Test 2: View-Source HTML (Vérification SEO)

### Étapes

1. **Page d'accueil:**
   - Naviguer: `http://localhost:3000/`
   - Clicker droit → "Afficher le code source" (`Ctrl+U`)
   - Rechercher: `Ctrl+F` → "Nos services"

2. **Vérifications dans l'HTML:**

   | Élément | À Chercher | Action |
   |---------|-----------|--------|
   | **Titre section** | `<h2` + texte "Nos services" | Doit être présent |
   | **Cartes services** | `<article` + `class.*service` | Doit avoir ~10 articles |
   | **Titres services** | `<h3>WEBSITES</h3>` | Doit avoir contenu |
   | **Descriptions** | `<p>.*Modern responsive` | Doit contenir descriptions |
   | **JSON-LD ItemList** | `<script type="application/ld+json">` | Doit contenir `"@type": "ItemList"` |

3. **Copier le JSON-LD:**
   - Chercher: `"@type": "ItemList"`
   - Copier tout le bloc `<script>` jusqu'à `</script>`
   - Coller dans: https://validator.schema.org/ → cliquer "Validate"

### Résultat Attendu

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "url": "https://solutionsimpactwebcom/",
  "numberOfItems": 10,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Service",
        "name": "WEBSITES",
        "description": "Complete web development solutions",
        "areaServed": "Québec, Canada",
        "url": "https://solutionsimpactweb.com/#services-websites",
        "offers": {
          "@type": "Offer",
          "price": "$700 – $8,000+",
          "priceCurrency": "CAD",
          "availability": "https://schema.org/InStock"
        }
      }
    },
    // ... plus de services
  ]
}
```

✅ **Validé:** Pas d'erreurs Schema.org

### Troubleshooting

- **JSON-LD manquant:** Vérifier `/lib/seo/servicesJsonLd.ts` et `/app/[locale]/page.tsx` ligne 36-40
- **@type: Service incorrect:** Vérifier `buildServiceItem()` dans `/lib/seo/servicesJsonLd.ts`

---

## Test 3: Google Rich Results Test

### Étapes

1. **Construire le projet:**
   ```bash
   cd web
   npm run build
   npm run start
   ```
   Naviguer: `http://localhost:3000/` (port 3000)

2. **Tester Rich Results:**
   - Aller à: https://search.google.com/test/rich-results
   - Coller l'URL: `http://localhost:3000/` ou `http://localhost:3000/en`
   - Cliquer "Test URL" (Google crawle le site)

3. **Vérifications attendues:**
   - [ ] "Rich results found"
   - [ ] Type: "Service"
   - [ ] Count: "10 items" (ou plus)
   - [ ] Chaque service affiche:
     - Name
     - Description
     - Price (si présent)

4. **Page dédiée `/services`:**
   - Répéter avec URL: `http://localhost:3000/services`
   - Même vérifications + plus de détails affichés

### Résultat Attendu

```
✅ No issues with your page
✅ Service rich result is valid
✅ 10 items detected
```

### Troubleshooting

- **"No rich results found":** Vérifier que le JSON-LD est valide en Test 2
- **Erreur schema:** Consulter https://schema.org/Service pour correction

---

## Test 4: Page Dédiée `/services`

### Étapes

1. **Naviguer vers:**
   - FR: `http://localhost:3000/services`
   - EN: `http://localhost:3000/en/services`

2. **Vérifications visuelles:**
   - [ ] Titre principal: "Nos services" (ou "Our services")
   - [ ] Sous-titre multiligne visible
   - [ ] Boutons d'action:
     - "Parler à l'équipe" (ou "Talk to the team")
     - "Voir la section de la page d'accueil"
   - [ ] Grille de services affichée (2 colonnes)
   - [ ] Aucun "Chargement…"

3. **Tester interaction (avec JS):**
   - Cliquer sur une carte de service → Modal s'ouvre
   - Modal affiche tous les tiers + prix détaillés
   - Fermer le bouton "X" fonctionne
   - Deuxième clic ouvre une autre modal
   - ESC ferme la modal

4. **Tester accessibilité:**
   - Appuyer sur `Tab` plusieurs fois → naviguer à travers les services
   - Appuyer sur `Enter` sur une carte → ouvre la modal
   - ESC ferme la modal
   - Tous les liens sont accessibles

### Résultat Attendu

```
✅ Page charge rapidement (< 1s)
✅ Services visibles sans JS
✅ Modals accessibles au clavier
✅ HTML contient JSON-LD
```

---

## Test 5: Accessibilité (WCAG 2.1 Level AA)

### Étapes

1. **Lancer les tests a11y:**
   ```bash
   cd web
   npm run dev  # Dans un terminal
   
   # Dans un autre terminal:
   npm run test:a11y:headed  # Voir le navigateur
   # ou
   npm run test:a11y  # Headless
   ```

2. **Vérifications automatiques (Axe):**
   - [ ] Pas d'erreurs critiques (rouge)
   - [ ] Pas d'avertissements sérieux (orange)

3. **Test manuel — Hiérarchie des titres:**
   - Appuyer sur `Ctrl+F` dans DevTools
   - Chercher: `<h1`, `<h2`, `<h3`
   - Vérifier l'ordre hiérarchique:
     ```
     h1: "Nos services" (ou titre page)
     h2: "Nos services" (section hero)
     h3: "WEBSITES" (chaque service)
     ```

4. **Test manuel — Contraste des couleurs:**
   - Utiliser DevTools → "Inspect" → voir `color` et `background`
   - Vérifier ratio sur: https://webaim.org/resources/contrastchecker/
   - Minimum: 4.5:1 pour texte normal, 3:1 pour large text

5. **Test manuel — Focus visible:**
   - Appuyer sur `Tab` plusieurs fois
   - Vérifier que le focus est visible sur chaque élément interactif
   - Focus doit être de couleur claire sur fond sombre

### Résultat Attendu

```
✅ 0 violations critiques
✅ Hiérarchie titres correcte (h1 → h2 → h3)
✅ Contraste text ≥ 4.5:1
✅ Focus visible sur tous les interactifs
```

### Troubleshooting

- **Hiérarchie titres incorrecte:** Vérifier `/components/BusinessCarousel.tsx` (main heading)
- **Focus pas visible:** Vérifier tailwind `focus-visible:*` classes
- **Contraste faible:** Changer couleur texte ou fond via Tailwind

---

## Test 6: Performance — Core Web Vitals

### Étapes

1. **Exécuter Lighthouse (Chrome DevTools):**
   - F12 → Onglet "Lighthouse"
   - Cliquer "Analyze page load"
   - Attendre le rapport complet

2. **Vérifications métriques:**

   | Métrique | Cible | Bonne Pratique |
   |----------|-------|-----------------|
   | **LCP** (Largest Contentful Paint) | < 2.5s | Services dans HTML = pas de delay |
   | **FID** (First Input Delay) | < 100ms | Pas de JS lourd au démarrage |
   | **CLS** (Cumulative Layout Shift) | < 0.1 | Pas de changement lors de l'hydrate |

3. **Interprétation des résultats:**
   - **Green (90+):** Excellent, rien à faire
   - **Orange (50-89):** Bon, optimisations possibles
   - **Red (< 50):** Action requise

4. **Cas spécifique — Services:**
   - Vérifier que le chargement du HTML n'impacte pas LCP
   - Si LCP > 2.5s : peut indiquer que le SSR n'est pas assez rapide
   - Si CLS > 0.1 : peut indiquer layout shift lors de l'hydration

### Résultat Attendu

```
✅ LCP < 2.5s (services dans HTML = rapide)
✅ FID < 100ms (pas de JS sync)
✅ CLS < 0.1 (pas de shifft)
✅ Lighthouse score ≥ 90 (Performance)
```

### Troubleshooting

- **LCP > 2.5s:** Services tardent à charger (API lente?) → activer ISR
- **CLS > 0.1:** Vérifier que les dimensions des cartes sont fixes
- **FID > 100ms:** Vérifier les Scripts au démarrage

---

## Test 7: Search Console (Google) — Indexation

### Étapes

1. **Accéder à GSC:**
   - https://search.google.com/search-console
   - Sélectionner la propriété `solutionsimpactweb.com`

2. **Vérifications:**
   - [ ] URL `/services` apparaît dans "Coverage" → "Valid"
   - [ ] URL `/fr/services` apparaît
   - [ ] URL `/en/services` apparaît (après hreflang)

3. **Inspecter une URL:**
   - Chercher: `/services`
   - Cliquer "Inspect URL"
   - Attendre le crawl Google
   - Vérifier "URL is valid and indexed"

4. **Vérifier les Enhancements:**
   - Onglet "Enhancements" → "Rich results"
   - Chercher "Service" dans les resultats
   - Doit afficher "10 items found"

5. **Core Web Vitals (Production):**
   - Onglet "Core Web Vitals"
   - Vérifier que `/services` n'a pas de "Poor" vitals
   - Attendu: "Good" ou "Needs improvement"

### Résultat Attendu

```
✅ /services indexed and valid
✅ /fr/services indexed
✅ /en/services indexed (with hreflang)
✅ Rich results: 10 Service items detected
✅ Core Web Vitals: Good
```

### Troubleshooting

- **URL not indexed:** Peut prendre 2-7 jours, re-request crawl
- **Rich results not detected:** Vérifier JSON-LD en Test 2
- **Poor Core Web Vitals:** Vérifier cache Vercel ou CDN

---

## Test 8: Multilingue FR/EN

### Étapes

1. **Page d'accueil FR:**
   - Naviguer: `http://localhost:3000/`
   - Vérifier: titre "Nos services", descriptions en français

2. **Page d'accueil EN:**
   - Clicker bouton "EN" dans header
   - Ou naviguer: `http://localhost:3000/en`
   - Vérifier: titre "Our services", descriptions en anglais

3. **Page `/services` FR:**
   - Naviguer: `http://localhost:3000/services`
   - Vérifier: tous les textes français

4. **Page `/services` EN:**
   - Naviguer: `http://localhost:3000/en/services`
   - Vérifier: tous les textes anglais

5. **Vérifier fallback:**
   - Chercher dans code (`services.fr.json` vs `services.en.json`)
   - Vérifier que chaque service a le même contenu en 2 langues

### Résultat Attendu

```
✅ FR: "Nos services", descriptifs français
✅ EN: "Our services", descriptifs anglais
✅ Données cohérentes entre langues
✅ Switcher langue fonctionne correctement
```

---

## Résumé des Tests

| Test | Résultat | Notes |
|------|----------|-------|
| **Sans JS** | ✅ | Services visibles, pas de "Chargement…" |
| **View-Source HTML** | ✅ | JSON-LD présent, services dans HTML |
| **Rich Results** | ✅ | 10 Service items validés |
| **Page `/services`** | ✅ | Dédiée, accessible, performante |
| **Accessibilité** | ✅ | WCAG 2.1 Level AA |
| **Performance** | ✅ | LCP < 2.5s, CLS < 0.1 |
| **Search Console** | ✅ | Indexée, rich results detectés |
| **Multilingue** | ✅ | FR/EN correctement rendus |

---

## Commandes Utiles

```bash
# Lancer le serveur dev
npm run dev

# Lancer tests a11y (accessibility)
npm run test:a11y:headed

# Build production
npm run build && npm run start

# Linter (TypeScript + ESLint)
npm run lint
npx tsc --noEmit

# Tests unitaires
npm run test:run
```

---

## Ressources

- **Schema.org Validator:** https://validator.schema.org/
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Google Search Console:** https://search.google.com/search-console
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

**Prêt pour l'audit complet?** Exécuter ces tests et documenter les résultats dans un fichier `TEST_RESULTS.md`

