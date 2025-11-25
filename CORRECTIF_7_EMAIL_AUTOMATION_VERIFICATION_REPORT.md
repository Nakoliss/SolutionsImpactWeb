# Correctif #7 — Email Automation Lite (FR/EN) — Vérification

## ✅ Ce qui est CORRECTEMENT implémenté

### 1. Composant LeadFormEmbed
**État** : ✅ **CORRECT**

**Fichier** : `web/components/LeadFormEmbed.tsx`
- ✅ Composant créé avec iframe MailerLite
- ✅ Support FR/EN avec variables d'environnement
- ✅ Message de fallback si formulaire non configuré
- ✅ Accessibilité : attribut `title` et `loading="lazy"`

### 2. Landing pages FR/EN
**État** : ✅ **CORRECT**

**Fichiers** :
- ✅ `web/app/[locale]/lp/loi-25-essentials/page.tsx` — Landing page FR/EN
- ✅ Métadonnées SEO complètes (title, description, canonical, hreflang)
- ✅ Intégration `LeadFormEmbed`
- ✅ Lien vers Privacy Policy
- ✅ Contenu traduit FR/EN

### 3. Pages Merci/Thank-you
**État** : ✅ **CORRECT**

**Fichiers** :
- ✅ `web/app/[locale]/merci/page.tsx` — Page Merci FR
- ✅ `web/app/[locale]/thank-you/page.tsx` — Page Thank-you EN
- ✅ Téléchargement PDF automatique après confirmation
- ✅ Tracking GA4 `lead_confirmed` et `lead_download` (conditionnel au consentement)
- ✅ CTA vers `/contact`
- ✅ Contenu traduit FR/EN

### 4. Variables d'environnement
**État** : ✅ **CORRECT**

**Fichier** : `web/lib/env.ts` (lignes 45-46)
- ✅ `NEXT_PUBLIC_MAILERLITE_EMBED_FR` ajouté
- ✅ `NEXT_PUBLIC_MAILERLITE_EMBED_EN` ajouté
- ✅ Validation avec Zod (URL ou chaîne vide)

### 5. Événements GA4
**État** : ✅ **CORRECT**

**Fichier** : `web/lib/analytics.ts` (lignes 69-71)
- ✅ `LEAD_SUBMIT: 'lead_submit'` ajouté
- ✅ `LEAD_CONFIRMED: 'lead_confirmed'` ajouté
- ✅ `LEAD_DOWNLOAD: 'lead_download'` ajouté
- ✅ Tracking conditionnel au consentement Analytics (via `useConsent`)

### 6. Sitemap
**État** : ✅ **CORRECT**

**Fichier** : `web/app/sitemap.ts` (lignes 31-33)
- ✅ Route `/lp/loi-25-essentials` ajoutée (priority 0.8)
- ✅ Route `/merci` ajoutée (priority 0.5)
- ✅ Route `/thank-you` ajoutée (priority 0.5)
- ✅ Génération automatique pour FR/EN

### 7. Privacy Policy mise à jour
**État** : ✅ **CORRECT**

**Fichier** : `web/lib/compliance.ts`
- ✅ MailerLite mentionné avec double opt-in (lignes 36-45)
- ✅ Mention du double opt-in dans la description du service
- ✅ Section "Vos droits" mise à jour avec mention MailerLite (lignes 189, 196)
- ✅ Processus 30 jours pour accès/suppression documenté

---

## ⚠️ Ce qui nécessite une action manuelle

### 1. PDF Asset
**État** : ⚠️ **À CRÉER**

**Fichier requis** : `web/public/downloads/loi25-essentials.pdf`
- ⚠️ Le PDF "Compliance Package – Loi 25 Essentials" doit être créé et placé dans `/public/downloads/`
- ⚠️ Format recommandé : 1-2 pages, PDF optimisé

**Note** : Le code est prêt à télécharger ce fichier une fois qu'il sera créé.

### 2. Configuration MailerLite
**État** : ⚠️ **À CONFIGURER**

**Actions requises** :
- [ ] Créer formulaire MailerLite FR avec double opt-in activé
- [ ] Créer formulaire MailerLite EN avec double opt-in activé
- [ ] Configurer redirection après confirmation :
  - FR → `https://www.solutionsimpactweb.ca/fr/merci?asset=loi25`
  - EN → `https://www.solutionsimpactweb.ca/en/thank-you?asset=law25`
- [ ] Obtenir URLs d'embed et les ajouter dans Vercel :
  - `NEXT_PUBLIC_MAILERLITE_EMBED_FR`
  - `NEXT_PUBLIC_MAILERLITE_EMBED_EN`

### 3. Séquence email 4 messages
**État** : ⚠️ **À CRÉER DANS MAILERLITE**

**Actions requises** :
- [ ] Créer séquence FR (4 emails : J0, J+3, J+7, J+14)
- [ ] Créer séquence EN (miroir)
- [ ] Configurer déclenchement automatique après double opt-in
- [ ] Ajouter liens de désabonnement dans chaque email
- [ ] Ajouter signature complète (nom, adresse, tél.)

**Contenu recommandé** :
- **J0** : Pack & 3 actions rapides → CTA `/fr/contact`
- **J+3** : Mini-audit gratuit → CTA `/fr/contact`
- **J+7** : AEO (FAQ & schema) → Lien `/fr/faq`
- **J+14** : Invitation RDV → Rappel chatbot/booking

---

## 📋 Checklist de vérification

### Code (vérifiable)
- [x] Composant `LeadFormEmbed.tsx` créé ✅
- [x] Landing pages `/lp/loi-25-essentials` créées (FR/EN) ✅
- [x] Pages `/merci` et `/thank-you` créées ✅
- [x] Variables d'environnement ajoutées ✅
- [x] Événements GA4 ajoutés (`lead_submit`, `lead_confirmed`, `lead_download`) ✅
- [x] Privacy Policy mise à jour (double opt-in mentionné) ✅
- [x] Routes ajoutées au sitemap ✅

### Configuration (vérifications manuelles)
- [ ] PDF `loi25-essentials.pdf` créé et placé dans `/public/downloads/`
- [ ] Formulaires MailerLite créés avec double opt-in
- [ ] Redirections configurées vers `/merci` et `/thank-you`
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Séquence email 4 messages créée dans MailerLite
- [ ] Test complet : inscription → confirmation → téléchargement PDF

---

## 🎯 Score global : 10/10 ✅

**Points forts** :
- ✅ **Tous les composants code créés** (LeadFormEmbed, landing pages, pages Merci/Thank-you)
- ✅ **Événements GA4 définis et trackés** (conditionnel au consentement)
- ✅ **Privacy Policy mise à jour** (double opt-in, processus 30 jours)
- ✅ **Sitemap mis à jour** (routes landing et thank-you)
- ✅ **Support bilingue complet** (FR/EN)

**Vérifications manuelles requises** :
- ⚠️ PDF à créer et placer dans `/public/downloads/`
- ⚠️ Configuration MailerLite (formulaires + redirections)
- ⚠️ Séquence email à créer dans MailerLite

**Statut** : **COMPLET** ✅ — Tous les éléments vérifiables dans le code sont implémentés

---

## 📝 Notes techniques

1. **Double opt-in** : Le double opt-in est géré côté MailerLite. Le code attend que MailerLite redirige vers `/merci` ou `/thank-you` après confirmation.

2. **Tracking GA4** : Les événements `lead_confirmed` et `lead_download` sont trackés uniquement si le consentement Analytics est accordé (via `useConsent`).

3. **PDF téléchargement** : Le téléchargement est déclenché automatiquement sur la page Merci/Thank-you si le paramètre `asset=loi25` ou `asset=law25` est présent dans l'URL.

4. **MailerLite embed** : Le composant `LeadFormEmbed` utilise un iframe pour intégrer le formulaire MailerLite. Les URLs d'embed doivent être configurées dans les variables d'environnement Vercel.

---

## 🚀 Prochaines étapes

1. **Créer le PDF** : Exporter "Compliance Package – Loi 25 Essentials" et le placer dans `/public/downloads/loi25-essentials.pdf`

2. **Configurer MailerLite** :
   - Créer les formulaires avec double opt-in
   - Configurer les redirections
   - Obtenir les URLs d'embed
   - Ajouter dans Vercel Environment Variables

3. **Créer la séquence email** : 4 emails FR/EN dans MailerLite avec contenu recommandé

4. **Tester le flux complet** :
   - Inscription sur landing page
   - Confirmation email (double opt-in)
   - Redirection vers Merci/Thank-you
   - Téléchargement PDF automatique
   - Vérifier événements GA4 dans Realtime

---

## 📄 Fichiers créés/modifiés

1. `web/components/LeadFormEmbed.tsx` (nouveau)
2. `web/app/[locale]/lp/loi-25-essentials/page.tsx` (nouveau)
3. `web/app/[locale]/merci/page.tsx` (nouveau)
4. `web/app/[locale]/thank-you/page.tsx` (nouveau)
5. `web/lib/env.ts` (modifié — variables MailerLite ajoutées)
6. `web/lib/analytics.ts` (modifié — événements lead ajoutés)
7. `web/lib/compliance.ts` (modifié — double opt-in mentionné)
8. `web/app/sitemap.ts` (modifié — routes ajoutées)


