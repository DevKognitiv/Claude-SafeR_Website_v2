# Brief — localisation des valeurs de spécifications

Dans `data/catalog/products/<marque>.json`, chaque produit a `specs: [{ key, value }]`. La `value` peut être :
- une **chaîne neutre** (chiffres, unités, sigles, noms propres) — ex. `"IP66"`, `"4K UHD (8 MP)"`, `"Wi-Fi 6 2,4 / 5 GHz"`, `"microSD 256 GB"`, `"-20 °C … 60 °C"`, `"2 × AA"`, `"Zigbee 3.0"` ;
- ou un **objet localisé** `{ "fr": "...", "en": "...", "es": "...", "ar": "...", "zh": "..." }` lorsque la valeur contient des mots de langue (ex. « Personnes, véhicules, animaux », « solaire en option », « Couleur avec spotlight intégré », « selon configuration »).

Mission : pour chaque valeur contenant du texte français (mots, accents, « à », « en option », « oui/non », « couleur », « max », etc.), la convertir en objet 5 langues (traductions fidèles et courtes) OU, si possible, la réécrire en chaîne neutre équivalente (ex. `"-10 °C à 55 °C"` → `"-10 °C … 55 °C"`, `"128 Go max"` → `"microSD ≤ 128 GB"`). Les valeurs déjà neutres restent des chaînes. Ne modifier aucune autre propriété. Conserver l'ordre des specs.

Vérifier également `install.duration` : rendre neutre (`"45 min"`, `"2 h"`, `"1 j"`) — jamais « journée », « heures » écrits en toutes lettres.

Validation : `node scripts/validate-products.mjs data/catalog/products/<marque>.json` → ✔, puis `node -e` de contrôle fourni ci-dessous doit retourner 0 valeur française résiduelle :

```bash
node -e '
const fs=require("fs");const re=/[àâçéèêëîïôûùüÿœ]|\b(et|ou|avec|sans|selon|jusqu|par|pour|de|du|des|la|le|les|en option|oui|non|couleur|nuit|jour|mois|ans|heures|minutes|personnes|véhicules|animaux|intérieur|extérieur|batterie|pile|secteur|détection|portée|zone|zones|max|min|journée)\b/i;
for (const f of process.argv.slice(1)) for (const p of JSON.parse(fs.readFileSync(f,"utf8"))) { for (const s of p.specs) if (typeof s.value==="string" && re.test(s.value)) console.log(p.id, s.key, JSON.stringify(s.value)); if (/[a-zéè]{4,}/i.test(p.install.duration) && !/min|h\b|j\b/.test(p.install.duration)) console.log(p.id,"duration",p.install.duration); }' data/catalog/products/<marque>.json
```
