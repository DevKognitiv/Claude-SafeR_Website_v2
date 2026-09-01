# SafeR Website v2 — Rapport de livraison (1er septembre 2026)

## Périmètre livré

1. **Architecture multilingue serveur** (FR, EN, ES, AR, ZH) — `lib/i18n/`. La langue est lue dans le cookie `safer-locale`, la page est rendue dans la bonne langue côté serveur (`<html lang dir>`), plus aucun texte ni attribut (`alt`, `aria-label`, `placeholder`, meta SEO, JSON-LD) ne reste en français au changement de langue. 2 119 chaînes par langue, structure typée identique ; contrôle automatique `npm run i18n:check`.
2. **Sous-pages niveaux 2 à 5** — 718 URL publiques : solutions (4 niveaux), store (5 niveaux), offres, quartiers, partenaires, support, entreprise, légal, plan du site, 404, sitemap.xml, robots.txt, fil d’Ariane + JSON-LD (Organization, Product, BreadcrumbList, FAQPage, HowTo).
3. **Store** — 117 références / 13 marques, taxonomie 5 univers × 26 types, attributs normalisés (connectivité, emplacement, alimentation, compatibilité, résolution, disponibilité, budget), filtres combinables synchronisés dans l’URL, recherche instantanée, tri, compteur, état vide, comparateur 4 produits, sélection persistante, fiches produit avec 4 sous-pages, pages marques, catalogue feuilletable 123 pages.
4. **Règle Tuya → SafeR** — appliquée au build (`scripts/catalog-lib.mjs`) : marque SafeR, référence `sf-<réf. d’origine>`, remplacement de « Tuya » dans tous les textes des 5 langues ; 24 produits SafeR ; testée (`npm run catalog:test`).
5. **Tarification** — prix FCFA = prix public constructeur × taux de change × coefficient (1,8 par défaut, coefficients par marque), arrondi à 500, affiché « à partir de » ; `manualXof` prioritaire.
6. **Crawler nocturne** — Crawlee (open source) : robots.txt, débit limité, adaptateurs par marque (JSON-LD, Open Graph, Shopify), garde-fous sur les prix, repli sur les données précédentes, rapport par marque. Planifié à 00:00 UTC par GitHub Actions et par tâche planifiée Windows.
7. **Formulaires opérationnels** — diagnostic (recommandation de pack réelle, demande de devis, créneau), projets collectifs, contact, maintenance : enregistrés via `/api/leads` (table D1 `leads`, repli fichier en local).
8. **UI/UX** — système d’icônes SVG (fin des glyphes/emoji), tokens de couleur/motion/élévation, animations d’entrée et révélation au défilement (respect de `prefers-reduced-motion`), bandeau de réassurance (garantie, installateur vérifié, Mobile Money, 24/7), barre d’achat mobile collante sur les fiches produit, focus visibles, cibles tactiles ≥ 44 px, piles de polices arabe/chinois, RTL.

## Audit final

| Indicateur | Avant | Après |
|---|---|---|
| Routes publiques | 17 pages, 1 langue rendue | 718 routes × 5 langues |
| Statuts HTTP en erreur | — | 0 sur 3 595 requêtes (719 × 5) |
| Pages avec texte français résiduel (EN/ES/AR/ZH) | totalité (≈ 50 clés traduites / ~600) | 0 |
| Erreurs console navigateur | 32 pages (prefetch vinext) | 0 |
| Liens internes cassés | 5 | 0 (les 2 pages partenaires authentifiées redirigent en 307, comportement attendu) |
| Débordement horizontal à 375 px | 0 | 0 |
| Anomalies | 137 (17 bloquantes) | 1 majeure* |

\* L’unique anomalie restante est un artefact d’environnement : les 123 images du catalogue feuilletable ne sont pas dans l’espace de test ; elles sont bien présentes dans le dossier `public/media/catalogue-safer-radiant/pages` livré.

Rapports détaillés : `docs/AUDIT-AVANT-2026-09-01.md`, `docs/AUDIT-FINAL-2026-09-01.md`. Relancer : `npm run audit:site` (serveur local démarré).

## Points d’attention / à valider par vous

- **Hébergement** : le site n’est pas statique (Next.js, API, D1, R2). GitHub Pages ne peut pas l’héberger ; le dépôt GitHub sert de source de vérité et de planificateur du crawler ; le déploiement reste OpenAI Sites (ou Cloudflare Workers).
- **Crawler** : l’accès réseau de mon environnement de travail vers les sites des marques était bloqué ; la logique d’extraction est testée unitairement (`crawler/npm test`), le premier vrai passage se fera lors de la première exécution GitHub Actions (déclenchable manuellement : *Actions → Refresh SafeR catalogue → Run workflow*). Ajax Systems ne publie pas de prix ; Hikvision, Dahua et Tuya Expo nécessitent le mode navigateur (activé dans le workflow).
- **Références SafeR (Tuya)** : les codes OEM Wi-Fi marqués `needsVerification: true` doivent être confirmés avec le fournisseur Tuya Expo retenu.
- **Prix** : le coefficient 1,8 (2,2 pour SafeR) est une hypothèse d’import/marge à ajuster dans `data/catalog/pricing.json`.
- **Témoignages et espace client** restent des contenus de démonstration (mentionnés comme tels sur le site).
- **Dossier ChatGPT** : il a continué d’évoluer en parallèle (autre structure de store, crawler Python, panier). La v2 repose sur la présente implémentation ; le catalogue de 123 pages en a été repris.

## Commandes utiles

```bash
npm install && npm run dev
npm run typecheck && npm run lint && npm run i18n:check && npm run catalog:test
npm run catalog:build
cd crawler && npm install && npm run crawl:dry
pwsh -File scripts/windows/register-nightly-task.ps1
```
