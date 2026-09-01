# Crawler catalogue SafeR

Vérifie chaque nuit (00:00 UTC) les fiches produits officielles des marques du Store — prix public, disponibilité, titre et visuel — puis met à jour les sources `data/catalog/products/*.json` et régénère `data/store-catalog.json`.

Moteur : **[Crawlee](https://crawlee.dev/)** (Apache 2.0, gratuit) — `CheerioCrawler` pour les pages HTML, `PlaywrightCrawler` en option (`CRAWL_BROWSER=1`) pour les sites rendus en JavaScript (Tuya Expo, Hikvision, Dahua).

## Ce que fait le crawler

1. Charge les produits sources et regroupe les URL par marque.
2. Respecte `robots.txt`, limite le débit (2 requêtes simultanées, 30/min), identifie le robot (`SafeRCatalogBot`).
3. Extrait via l'adaptateur de la marque (`adapters/<marque>.mjs`) ou l'extracteur générique : JSON-LD `Product`, Open Graph, microdata, Shopify `.js`.
4. Applique les garde-fous : un prix n'est accepté que s'il est numérique, dans une devise connue et compris entre 0,3× et 3× le prix précédent ; sinon l'ancien prix est conservé et l'écart est signalé.
5. Écrit `crawl` (statut, date, prix source, disponibilité, image) dans le produit source, met à jour `pricing.sourcePrice` et `imageUrl` si absents.
6. Régénère le catalogue (`npm run catalog:build` à la racine) — la règle **Tuya → SafeR / `sf-`** est appliquée à ce moment-là.
7. Produit un rapport `crawler/reports/<date>.json` + résumé console par marque (trouvés / mis à jour / bloqués / en échec).

En cas d'échec total d'une marque, **rien n'est perdu** : les données précédentes restent en place.

## Lancer

```bash
cd crawler && npm install
npm run crawl            # HTML uniquement
npm run crawl:browser    # avec Playwright (npx playwright install chromium)
npm run crawl:dry        # aucun fichier modifié, rapport seulement
```

Options : `--brand reolink,eufy` (limiter), `--limit 20` (nombre max de produits), `--dry-run`.

## Planification

- **GitHub Actions** : `.github/workflows/refresh-catalog.yml` (cron `0 0 * * *`, 00:00 UTC) — commit automatique du catalogue mis à jour sur `main`.
- **Windows** : `scripts/windows/register-nightly-task.ps1` crée une tâche planifiée à 00:00 UTC qui exécute `scripts/windows/refresh-catalog.ps1`.
