# Brief — traduction des dictionnaires SafeR

Source de vérité : `lib/i18n/dictionaries/fr/` (fichiers `common.ts`, `home.ts`, `solutions.ts`, `store.ts`, `offers.ts`, `collective.ts`, `partners.ts`, `support.ts`, `company.ts`, `index.ts`).

Pour la langue cible `<xx>`, créer `lib/i18n/dictionaries/<xx>/` avec **exactement les mêmes fichiers**, les mêmes exports (`common`, `home`, `solutions`, `store`, `offers`, `collective`, `partners`, `support`, `about`, `client`, `diagnostic`, `legal`) et un `index.ts` :

```ts
import type { Dictionary } from '../fr';
import { common } from './common';
// … mêmes imports que fr/index.ts
export const <xx>: Dictionary = { ...common, home, solutions, store, offers, collective, partners, support, about, client, diagnostic, legal };
```

Règles absolues :
1. **Structure identique** : mêmes clés, même imbrication, mêmes longueurs de tableaux, même ordre. Rien d'ajouté, rien de retiré. `npx tsc --noEmit` et `node scripts/check-i18n.mjs` doivent passer (0 missing, 0 orphan, 0 empty).
2. **Ne pas traduire** : les clés d'objets ; les identifiants techniques (`href`, `solution`, `phoneHref`, `email`, `icon`, `symbol`, valeurs `'yes'` dans `offers.comparison.rows`, `n` comme `'01'`, valeurs numériques/prix comme `'19 900'`, `'< 60 sec'`, `'24/7'`, `'100%'`, `'CI'`) ; les marques et noms propres (SafeR, RADIANT ASSISTANCE SECURITY, KleenR’, Tuya, Ajax, Reolink, eufy, Somfy, Aqara, Hikvision, EZVIZ, Dahua, SONOFF, Yale, Mobile Money, Cocody, Marcory, Bingerville, Abidjan, Plateau, Riviera, Wi-Fi, Zigbee, Z-Wave, Matter, Thread, PoE, ONVIF, io-homecontrol, RTS, Smart Life, Alexa, Google Home, Apple Home, SmartThings) ; les URL ; les placeholders `{name}`, `{count}`, `{date}`, `{price}`, `{total}`, `{months}`, `{label}`, `{step}`, `{total}`, `{pack}`, `{type}`, `{detail}`, `{brand}`, `{year}` (à conserver tels quels, positionnés naturellement dans la phrase).
3. **Traduire tout le reste** avec un registre professionnel, clair et chaleureux (site commercial premium de sécurité intelligente en Côte d'Ivoire). Adapter la ponctuation et la typographie de la langue cible (guillemets, espaces). Conserver les retours `\n` s'il y en a. Garder les textes courts là où le FR est court (boutons, badges, labels de filtres ≤ 3 mots quand le FR l'est).
4. `common.phoneDisplay`, `common.phoneHref`, `common.email` : inchangés. `meta.titleTemplate` : `'%s · SafeR'` inchangé. `common.fcfa` : `'FCFA'` inchangé.
5. `store.attributes`, `store.subcategories`, `store.categories`, `store.specKeys`, `store.filters.priceRanges` : traduire les libellés (valeurs), jamais les clés. Les unités restent (FCFA, MP, GHz…).
6. `legal.*` : traduire fidèlement les textes juridiques ; garder les références légales ivoiriennes (loi n° 2013-450, ARTCI, OHADA le cas échéant) et l'ordre des sections.
7. Arabe : arabe standard moderne, chiffres arabes occidentaux (0-9) conservés pour les valeurs techniques, marques latines conservées. Chinois : simplifié, ponctuation chinoise (，。：), marques latines conservées. Espagnol : neutre international (usted). Anglais : anglais international (UK spelling acceptable, cohérent).
8. Ne modifier aucun autre fichier du projet.

Validation avant de terminer (depuis `/home/claude/safer`) : `npx tsc --noEmit` puis `node scripts/check-i18n.mjs` — le rapport doit afficher ✔ pour la langue avec 0 missing / 0 orphan / 0 empty, et un nombre « identical-to-FR » faible (uniquement les valeurs non traduisibles).
