# SafeR — Smart Home Security (site v2)

Site officiel **SafeR**, sous-marque de RADIANT ASSISTANCE SECURITY (Côte d’Ivoire). Application **Next.js 16 (App Router) via vinext**, Tailwind CSS 4, TypeScript, hébergée sur OpenAI Sites (Cloudflare Workers, D1, R2).

Dépôt de référence : https://github.com/DevKognitiv/Claude-SafeR_Website_v2

## Démarrer

```bash
npm install          # dépendances du site
npm run dev          # http://localhost:3000
npm run build && npm run start
```

## Ce que contient le site

| Univers | Niveaux | Routes |
|---|---|---|
| Accueil, diagnostic, showroom, espace client | 1 | `/`, `/diagnostic`, `/produits`, `/espace-client` |
| Solutions | 1 → 4 | `/solutions` → `/solutions/[slug]` → `/…/[detail]` → `/…/[detail]/equipements` |
| Store | 1 → 5 | `/store` → `/store/[univers]` → `/…/[type]` → `/…/[type]/[sku]` → `/…/[sku]/(caracteristiques|installation|compatibilite|garantie)` + `/store/marques/[marque]`, `/store/comparer`, `/store/catalogue` |
| Offres | 1 → 3 | `/offres` → `/offres/[pack]`, `/offres/options/[option]` |
| Quartiers & villes | 1 → 2 | `/quartiers` → `/quartiers/[segment]` |
| Partenaires | 1 → 3 | `/partenaires`, `/partenaires/code-de-conduite`, `/partenaires/niveaux/[statut]`, inscription, tableau de bord |
| Support | 1 → 3 | `/support`, `/support/faq/[theme]`, `/support/guides/[guide]`, `/support/maintenance/[formule]`, `/support/garantie`, `/support/contact` |
| Entreprise & légal | 1 → 2 | `/a-propos/(radiant|engagements|carrieres)`, `/mentions-legales`, `/confidentialite`, `/cgv`, `/cookies`, `/plan-du-site` |

718 URL publiques, `sitemap.xml` et `robots.txt` générés depuis `lib/routes.ts`.

## Langues

Cinq langues complètes : **français (défaut), anglais, espagnol, arabe (RTL), chinois simplifié**.

- Architecture : `lib/i18n/` — la langue est lue côté serveur depuis le cookie `safer-locale` (puis `Accept-Language`), le HTML est rendu directement dans la bonne langue (`<html lang dir>`), sans « flash » ni texte résiduel.
- Dictionnaires : `lib/i18n/dictionaries/<langue>/*.ts` (~2 100 chaînes, structure typée identique au FR).
- Contenu produit : 5 langues dans chaque produit (`i18n`, `install.prerequisites`, valeurs de specs localisées).
- Contrôle : `npm run i18n:check` (clés manquantes/orphelines, texte FR codé en dur).

## Store & catalogue

- Source de vérité : `data/catalog/` (taxonomie, tarification, produits par marque). Voir `data/catalog/README.md`.
- 117 références, 13 marques : SafeR (écosystème Tuya), Ajax, Hikvision, EZVIZ, Dahua, Reolink, eufy, Aqara, SONOFF, Somfy, Yale, Teltonika, EcoFlow.
- **Règle Tuya → SafeR** appliquée automatiquement au build : marque « SafeR », préfixe `sf-` sur la référence, « Tuya » remplacé dans tous les textes (testé dans `scripts/test-catalog.mjs`).
- Prix FCFA = prix public constructeur × taux × coefficient (`data/catalog/pricing.json`), arrondi, affiché « à partir de ». Un `manualXof` par produit prime toujours.
- Filtres combinables synchronisés dans l’URL (marque, connectivité, emplacement, alimentation, compatibilité, résolution, disponibilité, budget), recherche instantanée, tri, comparateur (4 produits), sélection/panier persistants.

```bash
npm run catalog:build   # régénère data/store-catalog.json
npm run catalog:test    # règle Tuya→SafeR, prix, intégrité
```

## Rafraîchissement nocturne (00:00 UTC)

Crawler **Crawlee** (open source) dans `crawler/` — voir `crawler/README.md`.

- GitHub Actions : `.github/workflows/refresh-catalog.yml` (cron `0 0 * * *`) → crawl → build → tests → commit sur `main`.
- Windows : `pwsh -File scripts/windows/register-nightly-task.ps1` crée la tâche planifiée « SafeR Catalog Refresh ».
- Garde-fous : robots.txt, débit limité, prix accepté seulement dans une devise connue et entre 0,3× et 3× l’ancien, repli sur les données précédentes, rapport par marque dans `crawler/reports/`.

## Formulaires & données

`/api/leads` enregistre diagnostics, projets collectifs, demandes de contact, devis, rappels et maintenance dans la table D1 `leads` (`drizzle/0000_safer_partners.sql`). En local sans D1, les demandes sont écrites dans `.data/leads.jsonl`.

## Qualité

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run i18n:check  # traductions
npm run catalog:test
npm run audit:site  # audit navigateur (Playwright) : statuts, liens, images, console, h1, débordement 375px, langue, FR résiduel
```

Rapports d’audit : `docs/`.

## Notes techniques

- `components/Link.tsx` désactive le pré-chargement des liens : vinext 1.0.0-beta.3 lève une erreur console dans son chemin de prefetch. À réactiver quand le framework sera corrigé.
- Les pages `/partenaires/inscription` et `/partenaires/tableau-de-bord` nécessitent la connexion ChatGPT (redirection 307 hors session) et la base D1 : elles ne sont fonctionnelles que sur l’hébergement OpenAI Sites / Cloudflare.
- La police Saira ne couvre ni l’arabe ni le chinois : des piles de polices système sont déclarées dans `app/globals.css`.
