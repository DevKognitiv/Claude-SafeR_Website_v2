# Brief — rédaction des fichiers produits

Vous rédigez un fichier `data/catalog/products/<marque>.json` : un tableau JSON de produits respectant EXACTEMENT le schéma de `data/catalog/README.md` et l'exemple `data/catalog/products/_example.json.txt`. Les valeurs autorisées (catégories, types, attributs, marques, solutions) sont dans `data/catalog/taxonomy.json`. Les clés `specs[].key` autorisées sont celles de `specKeys` dans `lib/i18n/dictionaries/fr/store.ts`.

Exigences :
- Produits **réels et actuellement commercialisés** par la marque, avec le vrai nom de modèle et l'URL de la fiche produit officielle (`sourceUrl`). Pas de produit inventé. Prix public constructeur réaliste (`sourcePrice` en USD ou EUR selon le marché de la marque) — il sera rafraîchi chaque nuit par le crawler, une estimation honnête suffit.
- Couvrir en priorité les besoins d'une clientèle résidentielle et petit tertiaire en Côte d'Ivoire (climat chaud et humide, coupures d'électricité, réseau 4G, portails motorisés, climatisation).
- 5 langues obligatoires dans `i18n` : fr, en, es, ar (arabe standard moderne), zh (chinois simplifié). Textes rédigés, précis, sans marketing creux : `tagline` ≤ 70 caractères, `description` 2–3 phrases (40–80 mots), `highlights` 3–4 puces, `inTheBox` 3–5 éléments. Le `name` reprend « Marque + modèle » (ex. « Reolink Argus 4 Pro »).
- `specs` : 6 à 10 lignes avec des valeurs techniques réelles (unités SI, °C, mAh, IP66…). Les valeurs sont indépendantes de la langue quand c'est possible (chiffres, unités, sigles).
- `attributes` cohérents avec la fiche (protocole, emplacement, alimentation, compatibilité, résolution pour la vidéo).
- `install.level` : `simple` (pose client possible), `standard` (partenaire recommandé), `expert` (câblage, 230 V, motorisation). `install.duration` en minutes ou heures. `prerequisites` en 5 langues (1 phrase).
- `availability` : `sur-commande` par défaut ; `en-stock` pour 2–3 références très courantes ; `sur-devis` pour les kits/NVR et motorisations.
- `solutions` : 1 à 3 chemins `solution/detail` pertinents parmi les clés de `taxonomy.solutionSubcategories`.
- `related` : ids de produits complémentaires (dans votre fichier ou parmi les ids indiqués par le coordinateur).
- `id` unique en minuscules avec tirets, préfixé du nom de la marque (ex. `reolink-argus-4-pro`). `sku` = référence constructeur courte en majuscules sans espaces (ex. `RL-ARGUS4PRO`, `AJ-HUB2-4G`).
- `featured: true` sur 1 à 2 produits phares par marque. `new: true` sur les nouveautés récentes.
- `symbol` : un caractère parmi ◉ ⌂ ⌁ ↗ ✦ ▣ ♨ ◎ ◈ ▦ ▤ ⚡ ☼ ⊕ ✚ ⌇.

Validation obligatoire avant de terminer : `node scripts/validate-products.mjs data/catalog/products/<marque>.json` doit afficher ✔. Ne modifiez aucun autre fichier du projet.
