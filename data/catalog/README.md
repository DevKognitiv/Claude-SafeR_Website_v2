# Catalogue SafeR — données sources

`data/catalog/` est la **source de vérité** du Store. Le fichier `data/store-catalog.json` consommé par le site est **généré** par `npm run catalog:build` (ne pas l'éditer à la main).

```
data/catalog/
├── taxonomy.json          # univers, types, attributs, marques, liens solutions → types
├── pricing.json           # taux de change, coefficient, arrondi, frais de service
├── products/<marque>.json # produits source, un fichier par marque
└── README.md
```

## Règles métier appliquées au build

1. **Tuya → SafeR** : tout produit dont `sourceBrand` est `Tuya` (fichier `products/safer.json`) est publié sous la marque **SafeR**. Le mot « Tuya » est remplacé par « SafeR » dans tous les textes (nom, accroche, description, points forts, contenu de la boîte, spécifications) et la référence devient `sf-<référence d'origine>`. La référence d'origine est conservée dans `sourceSku`.
2. **Prix** : `priceXof = round(sourcePrice × rate[sourceCurrency] × coefficient / roundTo) × roundTo`, avec `coefficient = brandCoefficients[brand] ?? coefficient`. Un `manualXof` remplace toujours le calcul. Les prix sont affichés « à partir de ».
3. **Service mensuel** : `monthlyXof` manuel, sinon `serviceMonthlyBySubcategory[subcategory]`, sinon `serviceMonthlyXof[category]`.
4. **Garantie** : `warrantyMonths` manuel, sinon `warrantyMonths[subcategory]`, sinon `warrantyMonths.default`.
5. **Validation** : catégorie, type, attributs et marque doivent exister dans `taxonomy.json` ; `id` et `sku` sont uniques ; les 5 langues (`fr`, `en`, `es`, `ar`, `zh`) sont obligatoires dans `i18n`.

## Schéma d'un produit

```jsonc
{
  "id": "reolink-argus-4-pro",            // slug unique, minuscules, tirets
  "sku": "RL-ARGUS4PRO",                  // référence affichée (pour Tuya : la référence d'origine, le préfixe sf- est ajouté au build)
  "brand": "reolink",                     // clé de taxonomy.brands
  "sourceBrand": "Reolink",               // nom du constructeur d'origine
  "model": "Argus 4 Pro",                 // nom commercial constructeur
  "category": "video",                    // clé de taxonomy.categories
  "subcategory": "cameras-exterieures",   // valeur autorisée pour cette catégorie
  "i18n": {
    "fr": { "name": "…", "tagline": "…", "description": "…", "highlights": ["…", "…", "…"], "inTheBox": ["…"] },
    "en": { … }, "es": { … }, "ar": { … }, "zh": { … }
  },
  "attributes": {
    "protocol": ["wifi"],                 // ≥ 1 valeur de taxonomy.attributes.protocol
    "placement": "exterieur",             // 1 valeur
    "power": ["batterie", "solaire"],     // ≥ 1 valeur
    "compat": ["alexa", "google", "app-marque", "safer-platform"],
    "resolution": "4k"                    // optionnel, vidéo uniquement
  },
  "specs": [ { "key": "resolution", "value": "4K UHD (8 MP)" }, … ],   // key ∈ store.specKeys du dictionnaire
  "pricing": { "sourcePrice": 169.99, "sourceCurrency": "USD" },      // ou { "manualXof": 149000 }
  "monthlyXof": 6900,                     // optionnel
  "availability": "sur-commande",         // clé de taxonomy.attributes.availability
  "warrantyMonths": 24,                   // optionnel
  "install": { "level": "standard", "duration": "45 min", "prerequisites": { "fr": "…", "en": "…", "es": "…", "ar": "…", "zh": "…" } },
  "sourceUrl": "https://reolink.com/product/argus-4-pro/",
  "imageUrl": "https://…",                // optionnel, rempli par le crawler (og:image)
  "accent": "#52c6ff",
  "symbol": "◉",
  "featured": true,                       // optionnel
  "new": false,                           // optionnel
  "solutions": ["video-intelligente/cameras-exterieures"],  // services SafeR associés
  "related": ["reolink-solar-panel-2"]    // optionnel, ids de produits complémentaires
}
```

## Commandes

- `npm run catalog:build` — valide les sources et régénère `data/store-catalog.json`
- `npm run catalog:test` — tests de la règle Tuya → SafeR, de la tarification et de l'intégrité
- `npm run catalog:crawl` — exécute le crawler (dossier `crawler/`) puis le build
