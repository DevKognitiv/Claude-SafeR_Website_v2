SAFER — SMART HOME SECURITY
Version locale complète du site web

PRÉREQUIS
- Node.js 22.13 ou version plus récente
- Une connexion Internet peut être nécessaire pour les médias distants et les services externes

LANCER LE SITE
1. Ouvrir Windows Terminal ou PowerShell dans ce dossier.
2. Exécuter : npm run dev
3. Ouvrir : http://localhost:3000

CRÉER UNE VERSION DE PRODUCTION LOCALE
1. Exécuter : npm run build
2. Exécuter : npm run start
3. Ouvrir : http://localhost:3000

CONTENU PRINCIPAL
- app : pages et parcours du site
- components : éléments visuels et interactifs
- public : logos, images, vidéos, GIF et autres médias
- data, lib, db, drizzle : catalogue, logique et données du Store/espace partenaire
- scripts : automatisations du projet
- .openai : configuration compatible avec l’hébergement Sites

REMARQUE
Les dépendances sont déjà installées dans cette copie. Si elles sont supprimées,
exécuter « npm install » avant de relancer le site.
