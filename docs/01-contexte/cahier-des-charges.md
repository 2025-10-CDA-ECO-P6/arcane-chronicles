# Cahier des charges — Arcane Chronicles

**Projet** : Arcane Chronicles — application web de préparation et de pilotage de parties de Donjons & Dragons 5e
**Version** : 2.1 — 03/11/2026 (l'expression du besoin est désormais dans un fichier séparé)
**Auteur** : Lubin Chauvreau
**Cadre** : projet de formation Simplon — titre professionnel Concepteur Développeur d'Applications (CDA)
**Prérequis** : [`expression-besoin.md`](expression-besoin.md) (problématique, utilisateurs, objectifs O1 à O5)
**Documents liés** : [périmètre du MVP](../02-gestion-projet/perimetre/perimetre-mvp.md), [use cases](../03-conception/use-cases.md), [spécifications](../03-conception/specifications.md), [architecture](../03-conception/architecture.md), [modèles de données](../03-conception/mcd/), [charte graphique](../03-conception/maquettes/brand.md), [sécurité](../04-securite/securite.md), [plan de tests](../05-tests/plan-tests.md), [déploiement](../06-deploiement/deploiement.md), [écoconception](../07-ecoconception/ecoconception.md), [Jira KAN](https://simplon-team-kqd1jwhw.atlassian.net/browse/KAN)

---

# 1. Cahier des charges fonctionnel

## 1.1 La fonctionnalité principale : piloter une partie en direct, synchronisée avec les joueurs

**Énoncé.** *Le MJ lance une partie sur un chapitre de sa campagne, les joueurs la rejoignent depuis leur téléphone, et le MJ la mène de bout en bout depuis un seul écran — narration, scènes, personnages, combat, quêtes, révélations — pendant que chaque joueur voit en temps réel ce qui le concerne.*

C'est elle qui répond directement à la [problématique](expression-besoin.md#1-la-problématique) : elle supprime la recherche d'informations pendant la partie (problème 1), met les joueurs dans la boucle (problème 2) et donne un sens à la préparation (problème 3), puisque tout ce qui est préparé sert pendant la partie. Les autres fonctionnalités existent pour l'alimenter.

### 1.1.1 Ce qu'elle fait, étape par étape

| Étape | Côté MJ (desktop / tablette) | Côté joueur (mobile) |
|---|---|---|
| **1. Lancer** | Choisit le chapitre ; l'application génère un code et un lien de partie | Ouvre le lien, saisit un pseudo |
| **2. Accueillir** | Voit les joueurs connectés et prêts ; attribue un héros prétiré à chacun par glisser-déposer | Reçoit son héros et accède à sa fiche |
| **3. Raconter** | Lit la narration du chapitre puis de chaque scène ; passe d'une scène à l'autre ; consulte ses notes privées | Voit la scène et ce que le MJ a révélé |
| **4. Faire vivre la scène** | Gère les PNJ et monstres de la scène (PV, attitude amical / neutre / hostile), ouvre les coffres, résout énigmes et pièges, révèle les éléments au bon moment | Voit les éléments révélés |
| **5. Combattre** | Lance le combat, saisit l'initiative, fait avancer le tour avec « Suivant », ajoute ou retire des PV, consulte les capacités des PNJ | Bascule sur l'écran de combat : ordre de passage, son tour, ses PV et ceux de ses alliés |
| **6. Récompenser et avancer** | Valide les objectifs de quête, fait commercer les héros avec un marchand, partage le butin, distribue les récompenses (XP, or, objets) | Voit son inventaire, son or et ses quêtes évoluer ; utilise ses consommables |
| **7. Terminer et reprendre** | Termine la partie ; tout l'état est conservé ; la partie suivante reprend à la scène où le groupe s'était arrêté | — |

### 1.1.2 Règles de gestion de la fonctionnalité principale

- **RG1 — État partagé, serveur d'autorité** : le serveur détient l'état de la partie ; chaque modification du MJ est enregistrée en base puis diffusée à tous les participants.
- **RG2 — Révélation contrôlée** : une donnée non révélée (notes du MJ, solution d'énigme, contenu d'un coffre fermé, PNJ caché) n'est **jamais envoyée** au client d'un joueur, même masquée à l'écran.
- **RG3 — Pas de compte joueur** : un joueur est un participant de la partie, identifié par un pseudo et un jeton de reconnexion. Seul le MJ a un compte.
- **RG4 — PNJ unique ou générique** : un PNJ unique (PNJ de quête, marchand) garde un seul état sur toutes les scènes et tous les chapitres ; un PNJ générique (garde, monstre) est posé en exemplaires indépendants, chacun avec ses PV et son attitude.
- **RG5 — Mort** : un personnage est mort quand ses PV sont à 0 ; le bouton « tuer » met les PV à 0.
- **RG6 — Ordre de tour** : tri par initiative décroissante, égalité départagée par la DEX ; « Suivant » passe au combattant vivant suivant et revient au premier après le dernier ; pas de compteur de rounds.
- **RG7 — Quêtes** : une quête principale de campagne, toujours présente, a des objectifs différents à chaque chapitre ; les quêtes secondaires appartiennent à un chapitre ; le MJ valide les objectifs à la main ; la progression d'une quête et d'un chapitre se calcule à partir des objectifs validés.
- **RG8 — Persistance** : l'état de jeu est stocké directement sur les éléments de la campagne ; un chapitre reste « en cours » tant que le MJ ne l'a pas clôturé.
- **RG9 — Esprit papier** : rien n'est calculé à la place du MJ (jets, dégâts, effets) ; seules les valeurs dérivées de la fiche sont calculées : modificateurs, classe d'armure (armure portée ou 10, plus le modificateur de DEX), initiative, perception, niveau selon les paliers d'XP (ajustable par le MJ).

## 1.2 Les fonctionnalités qui alimentent la partie

| Domaine | Ce que l'utilisateur peut faire | Pourquoi c'est nécessaire à la fonctionnalité principale |
|---|---|---|
| **Découverte sans compte** | Voir la page d'accueil, parcourir le catalogue (sliders de personnages et d'objets, campagnes publiques paginées par 5), dupliquer une campagne après connexion | Lever la peur de la page blanche : on part d'une campagne jouable |
| **Compte MJ** | S'inscrire, se connecter, se déconnecter, retrouver ses campagnes sur un tableau de bord | Protéger les campagnes et les secrets du MJ |
| **Préparation de la campagne** | Créer campagnes, chapitres et scènes avec leur narration et leur carte (image) ; placer PNJ et monstres dans les scènes et les regrouper ; préparer quêtes, objectifs (reliés à un personnage, une énigme, un coffre, un objet, un piège ou une scène, avec leur narration) et récompenses ; placer coffres, énigmes et pièges ; écrire ses notes de chapitre | C'est le contenu que la partie fait vivre |
| **Personnages** | Créer la fiche commune héros / PNJ / monstres (race, classe, historique, caractéristiques, PV, armure portée, biographie…) ; compétences et capacités reprises automatiquement de la race, de la classe et de l'historique | Les héros prétirés sont attribués aux joueurs, les PNJ et monstres peuplent les scènes et les combats |
| **Bibliothèque du MJ** | Gérer ses objets (armes, armures, consommables), ses capacités et ses effets descriptifs (« 2D4 », « +5 dégâts de poison, 3 fois »), réutilisables dans toutes ses campagnes ; utiliser le contenu D&D officiel fourni | Ne pas refaire les mêmes éléments à chaque campagne |
| **Interface joueur mobile** | Consulter profil, inventaire, compétences, quêtes et carte ; suivre ses PV ; utiliser un consommable ; suivre le combat | La moitié de l'expérience en partie |

## 1.3 Acteurs et droits

| Acteur | Accès | Droits principaux |
|---|---|---|
| **Visiteur** | Public | Page d'accueil, catalogue, détail d'une campagne publique ; inscription |
| **MJ** (compte) | Ses campagnes, sa bibliothèque, ses parties | Tout créer, modifier, supprimer ; lancer, piloter et terminer ses parties ; révéler les informations |
| **Joueur** (participant sans compte) | Une partie, un héros | Voir sa fiche, son inventaire, ses quêtes et les éléments révélés ; utiliser un consommable |

Les droits sont vérifiés **côté serveur** pour chaque requête HTTP et chaque événement temps réel.

## 1.4 Exigences non fonctionnelles

| Exigence | Cible |
|---|---|
| **Temps réel** | Propagation d'une action du MJ chez les joueurs en moins de 500 ms ; 1 MJ + 6 joueurs par partie sans dégradation |
| **Confidentialité du jeu** | Aucune donnée non révélée ne quitte le serveur vers un joueur (tests dédiés par rôle) |
| **Sécurité** | Mots de passe hachés, jetons en cookie `httpOnly`, protection contre la force brute, validation de toutes les entrées |
| **Données personnelles (RGPD)** | MJ : e-mail, nom affiché, mot de passe haché ; joueurs : pseudo uniquement ; suppression du compte effective |
| **Responsive** | Interface MJ desktop / tablette ; interface joueur mobile conçue pour des écrans de 350 à 375 px de large |
| **Accessibilité** | WCAG 2.1 AA visé sur les parcours principaux : contrastes, navigation clavier, libellés de formulaires, messages d'erreur explicites |
| **Navigateurs** | Deux dernières versions majeures de Chrome, Firefox, Edge et Safari (dont Safari iOS) |
| **Licence du contenu** | Contenu D&D officiel issu du SRD 5.2.1 (licence CC-BY-4.0), avec la mention d'attribution obligatoire |

## 1.5 Périmètre et versions

Le MVP (fin avril) compte **111 tickets** dans Jira ; le détail est dans [`perimetre-mvp.md`](../02-gestion-projet/perimetre/perimetre-mvp.md). Hors MVP : lanceur de dés intégré, création de personnage par le joueur, équipement et bibliothèque communautaire (V1.1) ; images, liens entre scènes et effets appliqués (V1.2) ; édition avancée et cartes interactives (V1.3) ; contenus premium avec paiement intégré et assistant IA (V2). Ne sont pas prévus : chat, audio ou vidéo, application mobile native, grille tactique (les cartes interactives de la V1.3 servent à l'exploration et à la révélation, sans déplacement case par case), moteur de règles, autre jeu que D&D 5e.

---

# 2. Cahier des charges technique

## 2.1 Architecture générale

```
     Navigateur MJ (desktop)            Téléphones des joueurs
              │                                  │
              └──────────────┬───────────────────┘
                             ▼
        ┌────────────────────────────────────────┐
        │  Frontend — Next.js 16 / React 19 (TS)  │  hébergé sur Vercel
        │  rendu de l'interface uniquement        │
        └───────┬─────────────────────┬──────────┘
         REST (HTTPS, JSON)    Socket.io (WSS)
                ▼                     ▼
        ┌────────────────────────────────────────┐
        │  Backend — Node.js 24 / Express 5 +     │  hébergé sur Render
        │  Socket.io 4 (TypeScript)               │  (conteneur Docker)
        │  logique métier, droits, état de partie │
        └───────┬─────────────────────┬──────────┘
            Prisma 7                API Cloudinary
                ▼                     ▼
        ┌──────────────────┐   ┌──────────────────┐
        │ PostgreSQL 17    │   │ Cloudinary       │
        │ (Neon)           │   │ (images, cartes) │
        └──────────────────┘   └──────────────────┘
```

**Pourquoi séparer le frontend et le backend.** La fonctionnalité principale repose sur des connexions WebSocket qui restent ouvertes pendant toute la partie. Les routes API de Next.js s'exécutent sur Vercel comme des fonctions serverless éphémères, incompatibles avec une connexion persistante (durée maximale par fonction, aucune garantie de retomber sur la même instance, ce qui obligerait à externaliser l'état dans un Redis). Le choix retenu : Next.js ne fait que l'interface ; un serveur Express persistant porte toute la logique métier, les droits et le temps réel.

## 2.2 Organisation du code : un monorepo

Le frontend Next.js et le backend Express vivent dans **un seul dépôt Git**, organisé avec les **workspaces npm** (fonction native de npm, sans outil supplémentaire) :

```
arcane-chronicles/
├── package.json          # racine : déclare les workspaces, scripts communs (lint, test)
├── apps/
│   ├── web/              # frontend Next.js (+ Dockerfile) → déployé sur Vercel
│   └── api/              # backend Express + Socket.io + Prisma (+ Dockerfile) → déployé sur Render
├── packages/
│   └── shared/           # code partagé : schémas Zod, types des événements Socket.io, constantes de règles
├── docs/                 # documentation du projet (dossier CDA), dont preuves/ (captures, logs, exports, rapports)
├── .devcontainer/        # environnement de développement commun (Dev Container : Node, outils, PostgreSQL)
└── docker-compose.yml    # PostgreSQL local, et images de production web + api pour les vérifier
```

**Pourquoi un monorepo** : le front et le back partagent les mêmes schémas de validation et les mêmes types d'événements temps réel. Dans un seul dépôt, une modification du contrat (un champ ajouté, un événement renommé) se fait en une fois et TypeScript signale immédiatement les deux côtés à corriger. Une seule configuration ESLint, Prettier et TypeScript, une seule CI, un seul historique.

**Docker** : l'application est entièrement dockerisée, avec **une image par application** (`apps/web/Dockerfile` et `apps/api/Dockerfile`, construits en plusieurs étapes avec la racine du dépôt comme contexte pour inclure `packages/shared`) et un fichier `docker-compose.yml` à la racine qui lance la base `postgres:17` et, pour vérifier la production en local, les images `web` et `api`. Le développement se fait dans un **Dev Container** (`.devcontainer/`) : VS Code s'ouvre dans un conteneur qui contient Node, les outils du projet et sa propre base, pour que tous les développeurs aient exactement le même environnement. Deux images plutôt qu'une, parce que le front et le back sont deux processus différents (un conteneur = un processus), qui se reconstruisent, redémarrent et se déploient indépendamment : modifier une page ne reconstruit pas l'API, et une coupure de l'API ne fait pas tomber l'interface.

**Déploiement** : l'image de `apps/api` est déployée sur Render. Le frontend est déployé sur Vercel, configuré sur le dossier `apps/web`, qui construit Next.js nativement ; son image Docker sert au développement local, aux tests end-to-end en CI, et permet de basculer le front sur Render sans rien changer au code. Le détail est dans [`deploiement.md`](../06-deploiement/deploiement.md).

## 2.3 Langages

| Langage | Version | Où | Justification |
|---|---|---|---|
| **TypeScript** | 5.9.3 | Frontend et backend | Un seul langage typé de bout en bout : types générés par Prisma depuis le schéma de base, schémas de validation et événements Socket.io partagés entre client et serveur. Les erreurs de contrat (un champ renommé, un événement mal typé) sont détectées à la compilation. La version 5.9 est retenue plutôt que la 7.0 (sortie récemment) car c'est la version recommandée par Prisma 7 et la plus largement supportée par l'outillage |
| **SCSS** | Sass 1.107 | Styles | Variables, imbrication et mixins pour décliner la charte ([`brand.md`](../03-conception/maquettes/brand.md)) en design system : variables, mixins et classes globales ([`design-system.md`](../03-conception/design-system.md)) ; support natif dans Next.js |
| **SQL** | PostgreSQL 17 | Migrations | Contraintes que Prisma n'exprime pas (CHECK, index unique partiel), ajoutées dans les migrations SQL |

## 2.4 Environnement d'exécution

**Node.js 24 LTS** (24.22.x), fixé par un fichier `.nvmrc` et le champ `engines` du `package.json`, identique en développement, en CI et dans l'image Docker. Node.js 24 est passé en maintenance LTS le 20/10/2026 et reste corrigé jusqu'au 30/04/2028, bien au-delà de la fin du projet. Node.js 26 est désormais la LTS active : une montée de version n'est envisagée que pour une raison de sécurité, pas pour suivre l'actualité. Les outils retenus sont compatibles (Next.js 16 demande Node ≥ 20.9, Prisma 7 Node ≥ 20.19).

**npm** (fourni avec Node.js) comme gestionnaire de paquets : choix par défaut, le mieux documenté.

## 2.5 Frontend

| Élément | Version | Rôle et justification |
|---|---|---|
| **Next.js** | 16.4 | Framework React : routage par l'App Router, rendu serveur pour les pages publiques (accueil, catalogue) qui doivent s'afficher vite et être indexées, Turbopack comme bundler par défaut, déploiement continu natif sur Vercel |
| **React** | 19.3 | Bibliothèque d'interface ; composants réutilisables qui reprennent ceux de la page « composants » du fichier Figma |
| **Sass** (CSS Modules) | 1.107 | Styles en fichiers `.module.scss`, isolés par composant ; variables de couleur reprises des variables Figma |
| **socket.io-client** | 4.8.4 | Client temps réel, même version que le serveur |
| **Zod** | 4.6 | Validation des formulaires, avec les mêmes schémas que le backend |
| **Police d'icônes « Arcane-chronicle »** | générée avec IcoMoon | Les icônes de l'interface sont regroupées dans une police d'icônes (`apps/web/src/assets/fonts/icons/`, formats WOFF, TTF et OTF), chargée par `@font-face` : un seul fichier léger pour toutes les icônes, qui prennent la couleur et la taille du texte |
| **@dnd-kit/core** | 6.3 | Bibliothèque de **glisser-déposer** pour React. Elle sert dans le lobby, où le MJ fait glisser un héros sur un joueur pour le lui attribuer. Elle gère la souris, le tactile (tablette) et le clavier, ce qui rend ce geste accessible |
| **Polices** | Cinzel, Inter, Crimson Text | Fichiers chargés localement avec `next/font/local` (`apps/web/src/assets/fonts/`) : aucune requête vers un service externe. Cinzel et Inter sont des polices variables (un fichier couvre toutes les graisses), Crimson Text est disponible en Regular |

## 2.6 Backend

| Élément | Version | Rôle et justification |
|---|---|---|
| **Express** | 5.3 | Serveur HTTP de l'API REST. Simple et très documenté ; la version 5 gère nativement les erreurs des fonctions `async`, ce qui évite d'entourer chaque route d'un `try/catch` |
| **Socket.io** | 4.8.4 | Temps réel. Ses *rooms* correspondent exactement à une partie ; il gère la reconnexion automatique (un joueur qui perd le réseau en pleine partie) et un repli en long polling si le WebSocket est bloqué (Wi-Fi restrictif). Un middleware vérifie le jeton à l'ouverture de la connexion |
| **Prisma ORM** | 7.10 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`) | Accès à la base : schéma déclaratif, migrations versionnées, client entièrement typé. Prisma 7 utilise un adaptateur de pilote (`@prisma/adapter-pg`) et un fichier `prisma.config.ts` |
| **Zod** | 4.6 | Validation de chaque corps de requête et de chaque événement Socket.io entrant ; ces schémas servent aussi à générer la documentation de l'API |
| **argon2** | 0.45 | Hachage des mots de passe avec l'algorithme Argon2id, celui recommandé par l'OWASP |
| **jsonwebtoken** | 9.0 | Signature et vérification des jetons de session (JWT) |
| **cookie-parser** | 1.4 | Lecture du cookie qui porte le jeton |
| **helmet** | 8.3 | Middleware Express qui ajoute en une ligne les **en-têtes HTTP de sécurité** recommandés (interdire l'affichage du site dans une iframe, forcer le HTTPS, limiter les sources de scripts…), contre le clickjacking et une partie des attaques XSS |
| **cors** | 2.8 | Middleware Express qui applique la politique **CORS** : seule l'adresse du frontend a le droit d'appeler l'API depuis un navigateur, cookies compris (voir §2.6.1) |
| **express-rate-limit** | 8.7 | Limite les tentatives sur la connexion et sur l'entrée dans une partie (force brute, devinette de code) |
| **multer** + **cloudinary** | 2.5 / 2.11 | Réception des images uploadées puis envoi à Cloudinary depuis le serveur, avec la clé secrète qui ne quitte jamais le backend |
| **pino** | 10.4 | Bibliothèque de **journalisation** (logs) : chaque requête et chaque événement important (connexion, lancement de partie, erreur) est écrit en JSON, lisible et filtrable dans les logs de Render, ce qui aide à comprendre un problème survenu en partie |
| **@asteasolutions/zod-to-openapi** + **swagger-ui-express** | 9.1 / 5.0 | Documentation OpenAPI générée à partir des schémas Zod et consultable en ligne |

### 2.6.1 Authentification et sécurité

- **MJ** : à la connexion, le mot de passe est vérifié (Argon2id) et un JWT est émis dans un cookie `httpOnly`, `Secure` et `SameSite`, inaccessible au JavaScript du navigateur (protection contre le vol de jeton par XSS). Le même cookie est vérifié à l'ouverture de la connexion Socket.io.
- **Joueur** : en rejoignant une partie, il reçoit un jeton aléatoire propre à cette partie, dont seule l'empreinte est stockée en base (`participants.token_hash`). Il permet de se reconnecter sans compte.
- **CORS** : le frontend (Vercel) et l'API (Render) n'ont pas la même adresse. Par défaut, un navigateur interdit à une page d'appeler une API d'une autre origine. Le middleware `cors` autorise **uniquement** l'origine du frontend (liste blanche définie par variable d'environnement), avec `credentials: true` pour que le cookie de session soit envoyé ; toute autre origine est refusée. La même liste blanche est appliquée à Socket.io.
- **Domaines** : le frontend et l'API seront servis sous un même domaine (par exemple `app.` et `api.`), pour que le cookie reste un cookie du même site. Sur deux domaines distincts, les navigateurs comme Safari bloquent les cookies tiers.
- **Entrées** : tout ce qui arrive du client (corps de requête, paramètres, événements Socket.io) est validé par un schéma Zod avant traitement ; Prisma utilise des requêtes paramétrées, ce qui protège des injections SQL.
- **Droits** : chaque route et chaque événement vérifient le rôle (MJ propriétaire ou participant) ; les données envoyées aux joueurs sont filtrées côté serveur selon ce qui a été révélé (RG2).

### 2.6.2 Temps réel

- Une partie = une room Socket.io, avec un canal MJ et un canal joueurs, pour que les informations privées du MJ ne soient diffusées qu'à lui.
- Le serveur fait autorité : un événement du MJ (ex. modifier des PV, passer au tour suivant, révéler un coffre) est validé (Zod), contrôlé (droits), écrit en base (Prisma), puis diffusé.
- Événements typés en TypeScript et partagés entre frontend et backend.

## 2.7 Base de données

| Élément | Choix | Justification |
|---|---|---|
| **SGBD** | PostgreSQL 17 | Le modèle est fortement relationnel (campagne → chapitres → scènes → créatures, quêtes, objets) avec des contraintes d'intégrité (clés étrangères, CHECK, index unique partiel) et des énumérations natives. Neon prend en charge les versions 14 à 18 ; la 17 est une version majeure éprouvée |
| **Hébergement** | Neon (offre gratuite) | PostgreSQL managé, sans date d'expiration, mise en veille automatique et réveil quasi instantané ; URL poolée pour l'application, URL directe pour les migrations |
| **Modèle** | 38 tables, 14 énumérations | Conçu selon la méthode Merise : MCD, MLD et MPD global et par fonctionnalité dans [`03-conception/mcd/`](../03-conception/mcd/) ; code source DBML `05-database-model-v2.dbml` |
| **Migrations et seeds** | Prisma Migrate | Migration initiale `20261105000000_init` (tables et contraintes CHECK / index partiel écrites à la main) ; seed des données de référence D&D (`npm run seed`) et seed de démonstration avec la campagne « L’archipel du néant » (`npm run seed:demo`) |

Choix de modélisation marquants : une fiche unique pour héros, PNJ et monstres ; distinction PNJ unique / générique ; bibliothèque d'objets, de capacités et d'effets appartenant au MJ ; données de référence D&D (races, classes, historiques, compétences) chargées par un script de seed ; valeurs dérivées (CA, modificateurs, initiative, progression, ordre de tour, mort) calculées et non stockées.

## 2.8 Services externes

| Service | Usage | Offre | Point de vigilance |
|---|---|---|---|
| **Vercel** | Hébergement du frontend, déploiement à chaque push | Hobby (gratuite) | — |
| **Render** | Hébergement du backend dans un conteneur Docker, process persistant pour Socket.io | Gratuite | Mise en veille après 15 min d'inactivité, réveil en une minute environ : un ping UptimeRobot toutes les 5 minutes la garde éveillée (dans la limite des 750 heures gratuites par mois) |
| **Neon** | Base PostgreSQL | Gratuite | Quotas de stockage et de calcul suffisants pour le projet |
| **Cloudinary** | Stockage et diffusion des images (cartes, illustrations de personnages, objets, races, classes, historiques) | Gratuite, à crédits mensuels | Redimensionnement et formats optimisés à la volée, utiles pour les vignettes mobiles |

## 2.9 Outils et environnement de développement

| Outil | Version | Usage |
|---|---|---|
| **Git** + **GitHub** | — | Versionnement du code, pull requests et CI : dépôt public [`2025-10-CDA-ECO-P6/arcane-chronicles`](https://github.com/2025-10-CDA-ECO-P6/arcane-chronicles) |
| **Docker** + **Docker Compose** | — | Une image par application (`web`, `api`) construite sur `node:24-slim` en plusieurs étapes ; `docker-compose.yml` pour la base locale (PostgreSQL 17), la vérification des images de production et les tests |
| **Dev Container** (VS Code) | — | Environnement de développement commun dans un conteneur (`.devcontainer/`) : même version de Node, d'npm et des outils pour tous, base PostgreSQL dédiée, extensions de l'éditeur installées automatiquement |
| **ESLint** / **Prettier** | 10.14 / 3.9 | Qualité et formatage du code |
| **Vitest** | 5.1 | Tests unitaires : règles calculées (CA, niveau, ordre de tour) et services métier |
| **Supertest** | 7.3 | Tests d'intégration de l'API Express, en particulier les droits MJ / joueur |
| **Playwright** | 1.64 | Tests end-to-end du parcours de partie complet (MJ + joueurs) |
| **Jira** | — | Backlog (epics, user stories, versions MVP à V2) |
| **Figma** | — | Maquettes et page de composants |
| **IcoMoon** | — | Génération de la police d'icônes à partir des icônes des maquettes |
| **dbdiagram.io** | — | Modèle de données (DBML) |
| **Claude Code** | — | Assistant de développement pour accélérer le développement |

## 2.10 Stratégie de tests

Les tests visent d'abord ce qui casserait la fonctionnalité principale : les droits (un joueur ne doit jamais voir les secrets du MJ), les règles calculées et le déroulé d'une partie.

| Niveau | Outil | Ce qui est testé | Exemples |
|---|---|---|---|
| **Unitaire** | Vitest 5.1 | Fonctions pures et services métier, sans base ni réseau | Calcul de la CA et des modificateurs, niveau selon l'XP, tri de l'ordre de tour et bouton « Suivant » (morts sautés, retour au premier), progression d'une quête |
| **Intégration API** | Supertest 7.3 + Vitest, base PostgreSQL de test | Routes Express de bout en bout, avec la vraie base | Inscription et connexion, un MJ ne peut pas modifier la campagne d'un autre MJ, un joueur ne reçoit pas les notes du MJ ni la solution d'une énigme non révélée, validation des entrées (erreur 422) |
| **Temps réel** | Vitest + socket.io-client | Événements Socket.io | Une modification de PV du MJ est reçue par les joueurs de la partie, et pas par ceux d'une autre partie ; un client non autorisé est refusé |
| **End-to-end** | Playwright 1.64 | Parcours complet dans de vrais navigateurs (un contexte MJ desktop, deux contextes joueurs mobiles) | Scénario de recette : lancer la partie, rejoindre par lien, attribuer les héros, combat, butin, objectif validé, reprise de la partie |

Les tests unitaires et d'intégration tournent à chaque push ; une user story n'est terminée que si ses règles de droits sont couvertes par un test.

## 2.11 Récapitulatif des versions

| Domaine | Technologie | Version |
|---|---|---|
| Langage | TypeScript | 5.9.3 |
| Runtime | Node.js | 24 LTS (24.22.x) |
| Frontend | Next.js / React | 16.4 / 19.3 |
| Styles | Sass | 1.107 |
| Backend | Express | 5.3 |
| Temps réel | Socket.io (serveur et client) | 4.8.4 |
| ORM | Prisma | 7.10 |
| Base de données | PostgreSQL (Neon) | 17 |
| Validation | Zod | 4.6 |
| Tests | Vitest / Supertest / Playwright | 5.1 / 7.3 / 1.64 |

Versions relevées sur le registre npm et les documentations officielles le 03/11/2026, fixées dans les `package.json` au démarrage du développement.

## 2.12 Risques techniques

| Risque | Mitigation |
|---|---|
| Fuite de données secrètes du MJ vers un joueur | Filtrage par rôle côté serveur, canaux Socket.io séparés, tests Supertest et Playwright dédiés |
| Complexité du temps réel (reconnexions, conflits) | Serveur d'autorité, reconnexion native de Socket.io, état toujours relu depuis la base |
| Charge du MVP (111 tickets pour environ 5 semaines) | Fusion de tickets proches, liste de coupe prête (carte, puis coffres / énigmes / pièges, puis commerce), Claude Code pour accélérer ; voir [`planning.md`](../02-gestion-projet/planning.md) |
| Limites des offres gratuites | Ping de réveil avant démonstration ; quotas suivis |
| Cookies entre deux domaines | Frontend et API sous un même domaine |

---

## Sources

- [Node.js — cycle de vie des versions (endoflife.date)](https://endoflife.date/nodejs)
- [Neon — versions de PostgreSQL prises en charge](https://neon.com/docs/postgresql/postgres-version-support)
- [Prisma — passer à Prisma 7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7?via=prisma7)
- [Next.js 16 : nouveautés](https://makerkit.dev/blog/md/tutorials/nextjs-16)
- [SRD 5.2.1 — System Reference Document](https://www.dndbeyond.com/srd)
- Registre npm (versions des paquets), consulté le 03/11/2026
