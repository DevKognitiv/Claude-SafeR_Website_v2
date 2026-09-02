# Brief images — SafeR Website v2 (contexte Côte d’Ivoire)

Objectif : un jeu de photographies **très haute qualité, réalistes, ancrées à Abidjan et en Côte d’Ivoire**, qui donne au visiteur le sentiment d’être chez lui tout en préservant le registre **institutionnel / professionnel** de la marque (intégrateur de sécurité, centre de veille 24/7, partenaire RADIANT ASSISTANCE SECURITY).

Le site est **déjà câblé** : chaque page lit un « slot » (`lib/images.ts`). Il suffit de déposer le fichier `public/media/pages/<slot>.jpg` (ou `.webp`/`.avif`, préférés) puis de lancer `npm run images:manifest` (exécuté automatiquement avant `npm run build`). Sans fichier, un visuel de repli soigné est affiché ; le composant `SmartImage` bascule aussi automatiquement sur le repli si le fichier ne charge pas. Les textes alternatifs existent déjà dans les 5 langues (`d.images.<slot>`).

## Direction artistique commune

- **Réalisme photographique** (pas d’illustration, pas de rendu 3D visible). Optique 35 mm ou 50 mm, faible profondeur de champ modérée, lumière naturelle, couleurs fidèles — pas de saturation excessive.
- **Lumière ivoirienne** : soleil haut et voilé, ciel de saison des pluies par endroits, lumière dorée de fin de journée (17 h 30 – 18 h 15), nuit chaude avec éclairage d’accueil.
- **Décor** : villas et résidences de Cocody / Riviera / Bingerville (murs d’enceinte clairs, portails métalliques, bougainvilliers, palmiers, manguiers), immeubles du Plateau, boutiques et rues de Marcory, gardiens en uniforme sobre, motos et taxis orange en arrière-plan flous si pertinent.
- **Personnes** : Ivoiriennes et Ivoiriens de tous âges, tenues professionnelles ou décontractées-soignées (pagne moderne, chemise, tailleur), expressions naturelles et sereines. Aucun visage d’enfant identifiable en gros plan. Diversité de genre.
- **Équipements** : caméras extérieures blanches ou anthracite, claviers d’alarme, centrales, serrures connectées, tablettes/smartphones affichant une interface **sans marque tierce visible** (écran neutre bleu #4556F5 / cyan #52C6FF, ou logo SafeR). **Aucun logo de fournisseur** (Hikvision, Ezviz, Tuya, etc.) ne doit être lisible.
- **Registre** : institutionnel et chaleureux. Pas de mise en scène anxiogène (pas d’intrus, pas d’arme, pas de scène d’effraction).
- **Palette** : compatible avec le site — noir profond, bleu #4556F5, cyan #52C6FF, vert lime #B8FF3D en touches, blancs chauds.
- **Composition** : sujet à droite ou au centre pour les héros (le texte est à gauche), zones calmes pour la superposition typographique, pas de texte incrusté dans l’image.

## Spécifications techniques

| Usage | Format | Dimensions | Poids cible |
|---|---|---|---|
| Héros pleine largeur (`home`, `solutions`, `solution-*`, `store`, `offers`, `collective`, `partners`, `support`, `about`, `contact`, `catalogue`, `legal`) | JPG q85 ou AVIF | 2400 × 1400 px (16:9,3) | ≤ 350 Ko |
| Cartes / encarts (`showroom`, `maintenance`, `diagnostic`) | JPG q85 ou AVIF | 1600 × 1200 px (4:3) | ≤ 250 Ko |
| Affiches vidéo showroom (`showroom-guard`, `showroom-habitat`, `showroom-vision`, `showroom-door`, `showroom-link`) | JPG q80 | 1280 × 720 px | ≤ 150 Ko |
| Open Graph (généré à partir du slot de la page) | — | l’image du slot est réutilisée (1200 × 630 recadré par les réseaux) | — |

Nommage strict : `public/media/pages/<slot>.jpg` (minuscules, tirets). Profil sRGB, métadonnées EXIF nettoyées.

## Fiches par slot (page → cadrage → prompt de génération)

Les prompts sont rédigés en anglais pour les générateurs d’images (Midjourney v6+, Flux 1.1 Pro, Imagen 3, Ideogram 2, Adobe Firefly). Ajouter systématiquement le suffixe **négatif** : `no visible brand logos, no text, no watermark, no cartoon, no 3D render, no weapons, no intruder, natural skin tones, no oversaturation`.

### `home` — Accueil (héros, affiche de la vidéo)
Villa moderne à Cocody au crépuscule, éclairage d’accueil allumé, caméra discrète sous l’avancée du toit, allée pavée, portail entrouvert, ciel bleu-nuit.
> Photorealistic editorial photo, modern two-storey villa in Cocody Abidjan at dusk, warm porch lights on, small white security camera discreetly mounted under the roof overhang, paved driveway, bougainvillea on the boundary wall, deep blue evening sky, 35mm lens, cinematic but calm, room for text on the left.

### `showroom` — Accueil (galerie « La technologie qui s’efface »)
Famille ivoirienne dans un salon lumineux à Abidjan, tablette à la main affichant un tableau de bord neutre, climatiseur mural, lumière du matin.
> Photorealistic lifestyle photo, Ivorian family of three relaxed in a bright modern living room in Abidjan, father holding a tablet showing a plain blue smart-home dashboard, wall air-conditioner, wooden furniture, morning light through sheer curtains, genuine smiles, 50mm lens.

### `solutions` — Nos solutions (héros)
Technicien SafeR en tenue professionnelle (polo bleu nuit, badge, gants) réglant une caméra sur la façade d’une résidence à Riviera.
> Photorealistic photo, professional Ivorian security technician in a dark-blue polo shirt with lanyard badge adjusting a white bullet camera on the facade of a modern residence in Riviera Abidjan, ladder, toolbox, palm trees, bright overcast sky, respectful and competent posture.

### `solution-video` — Vidéo intelligente
Caméra extérieure fixée sur le mur d’enceinte d’une villa d’Abidjan, palmiers et ciel de saison des pluies en arrière-plan, gros plan légèrement en contre-plongée.
> Photorealistic close-up, anthracite outdoor security camera mounted on the cream boundary wall of an Abidjan villa, palm fronds and dramatic rainy-season sky behind, slight low angle, shallow depth of field.

### `solution-alarme` — Alarmes connectées
Centrale d’alarme et clavier posés dans l’entrée d’une maison ivoirienne moderne, main d’une femme armant le système, sac et clés sur la console.
> Photorealistic interior photo, elegant Ivorian woman’s hand arming a sleek white alarm keypad in the entrance hall of a modern Abidjan home, console table with keys and handbag, terrazzo floor, soft daylight.

### `solution-acces` — Contrôle d’accès
Portail motorisé d’une résidence d’Abidjan s’ouvrant devant une berline, gardien en uniforme sobre à l’entrée, interphone vidéo sur le pilier.
> Photorealistic photo, motorised sliding gate of an Abidjan gated residence opening for a dark sedan, uniformed guard standing calmly by the gatehouse, video intercom on the gate pillar, late afternoon golden light.

### `solution-domotique` — Domotique
Salon climatisé à Abidjan piloté depuis un smartphone, lumière chaude du soir, stores en cours de fermeture.
> Photorealistic photo, cosy air-conditioned living room in Abidjan at evening, Ivorian man adjusting lighting from his smartphone (plain blue app screen), warm lamps, motorised blinds half closed, plants, calm mood.

### `store` — Store (héros)
Équipements de sécurité connectés présentés sur un comptoir de showroom au Plateau, conseiller en arrière-plan flou, vitrine donnant sur la rue.
> Photorealistic photo, curated display of connected security devices (camera, keypad, smart lock, hub) on a light wooden showroom counter in Plateau Abidjan, blurred sales adviser in the background, street visible through the window, premium retail lighting.

### `offers` — Packs & offres
Couple ivoirien consultant un devis sur tablette dans sa véranda, jardin tropical, boissons fraîches.
> Photorealistic photo, Ivorian couple in their thirties reviewing a quote on a tablet on the veranda of their Abidjan home, tropical garden, glasses of bissap, relaxed and confident, soft daylight.

### `collective` — SafeR Collective (héros)
Poste de garde connecté à l’entrée d’une résidence fermée à Abidjan, gardien devant deux écrans, barrière et allée résidentielle.
> Photorealistic photo, modern gatehouse at the entrance of a gated residential estate in Abidjan, uniformed guard monitoring two screens showing plain camera tiles, access barrier, tidy residential street with palms, morning light.

### `partners` — Partenaires (héros)
Installateur partenaire sur une échelle, perceuse en main, façade d’un immeuble de Marcory, casque et gilet.
> Photorealistic photo, Ivorian installer on a ladder with a cordless drill fixing a camera bracket on a Marcory Abidjan apartment building, safety helmet and hi-vis vest, colleague holding the ladder, bright sky.

### `support` — Support (héros)
Conseillère au casque dans un centre de veille moderne à Abidjan, écrans de supervision neutres, ambiance sombre et professionnelle.
> Photorealistic photo, Ivorian monitoring-centre operator wearing a headset in a modern dark control room in Abidjan, wall of screens showing plain camera grids and maps, focused and reassuring expression, blue accent lighting.

### `maintenance` — Maintenance (encart + page)
Technicien vérifiant une caméra extérieure avant la saison des pluies, ciel chargé sur Abidjan, chiffon et tablette de contrôle.
> Photorealistic photo, technician wiping and checking an outdoor camera before the rainy season on an Abidjan rooftop terrace, heavy grey clouds over the city, tablet with a plain checklist, careful hands.

### `about` — À propos (héros)
Équipe RADIANT ASSISTANCE SECURITY × SafeR réunie devant un immeuble de bureaux du Plateau, tenues professionnelles, sourires mesurés.
> Photorealistic corporate photo, diverse team of eight Ivorian professionals (security officers in sober uniforms and office staff in business attire) standing in front of a modern glass office building in Plateau Abidjan, confident measured smiles, overcast bright light.

### `contact` — Contact
Conseiller au téléphone dans un bureau lumineux d’Abidjan, casque, carnet, plante, fenêtre sur la ville.
> Photorealistic photo, friendly Ivorian customer adviser on a headset call in a bright Abidjan office, notebook and laptop, plant, city view through the window, warm natural light.

### `catalogue` — Catalogue digital
Catalogue imprimé SafeR × RADIANT ouvert sur une table de réunion, mains feuilletant, tasse de café, lumière latérale.
> Photorealistic photo, printed product catalogue open on a walnut meeting table, hands turning a page, coffee cup, side window light, shallow depth of field, no legible text.

### `diagnostic` — Diagnostic (encart)
Propriétaire répondant à un questionnaire sur son téléphone, terrasse d’une villa de Bingerville, lagune au loin.
> Photorealistic photo, Ivorian homeowner answering a short questionnaire on his phone on the terrace of a Bingerville villa, lagoon and greenery in the distance, late afternoon light.

### `legal` — Pages légales
Immeubles de bureaux du Plateau au petit matin, lagune Ébrié, ciel clair.
> Photorealistic photo, Plateau Abidjan business district skyline at early morning from across the Ébrié lagoon, calm water, clear sky, architectural and neutral.

### `showroom-guard` / `showroom-habitat` / `showroom-vision` / `showroom-door` / `showroom-link` — Affiches des vidéos du showroom
Cinq gros plans produits « sans marque » dans des intérieurs ivoiriens : centrale d’alarme (guard), box domotique et volets (habitat), caméra sur batterie extérieure (vision), serrure connectée sur porte en bois (door), passerelle posée sur une console avec capteurs (link). Fond sobre, lumière douce, 16:9.

## Livraison

1. Déposer les fichiers dans `public/media/pages/` en respectant les noms de slots.
2. `npm run images:manifest` puis `npm run dev` pour vérifier, ou directement `npm run build`.
3. Commit + push (`Publier-GitHub.cmd`).

Sources de repli actuelles : photographies sous licence Pexels (dont les vues du Plateau par Jean Marc Bonnel) et le visuel `safer-abidjan-showroom-v1.png`.
