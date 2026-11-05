# Arcane Chronicles

Application web d'aide au Maître du Jeu pour Donjons & Dragons 5e : préparation des campagnes (chapitres, scènes, personnages, quêtes) et pilotage de la partie en direct, les joueurs suivant sur leur téléphone.

Projet de formation Simplon — titre professionnel **Concepteur Développeur d'Applications (CDA)** — Lubin Chauvreau.

## Objectifs

- Un MJ prépare une campagne jouable en moins de 45 minutes.
- Il anime toute sa partie depuis un seul écran, combat compris.
- Les joueurs suivent leur personnage sur mobile, sans compte, en temps réel (< 500 ms).
- Aucune donnée secrète du MJ n'atteint un joueur.
- Une partie interrompue reprend avec tout son état.

## Stack

| Domaine         | Technologies                                               |
| --------------- | ---------------------------------------------------------- |
| Langage         | TypeScript 5.9                                             |
| Frontend        | Next.js 16, React 19, Sass (CSS Modules), socket.io-client |
| Backend         | Node.js 24, Express 5, Socket.io 4, Prisma 7, Zod 4        |
| Base de données | PostgreSQL 17 (Neon)                                       |
| Tests           | Vitest, Supertest, Playwright                              |
| Conteneurs      | Docker (une image web, une image api), Docker Compose      |
| Hébergement     | Vercel (web), Render (api), Cloudinary (images)            |

Détail et justification : [cahier des charges technique](docs/01-contexte/cahier-des-charges.md#2-cahier-des-charges-technique).

## Lancer le projet

Le projet se développe dans un **Dev Container** : un conteneur Docker qui contient tout l'environnement de travail (Node 24, npm, Prisma, Playwright et Chromium, extensions VS Code) et la base PostgreSQL. Tous les développeurs ont ainsi exactement les mêmes versions, sans rien installer d'autre que Docker. Les images de production (`apps/*/Dockerfile`) partent de la même version de Node.

### Prérequis

- **Docker** (Docker Desktop, OrbStack ou Docker Engine sous Linux), démarré
- **VS Code** avec l'extension **Dev Containers** (`ms-vscode-remote.remote-containers`)

En local, la base est un conteneur Docker ; Neon ne sert qu'en production.

### Première installation (une seule fois)

```bash
git clone git@github.com:2025-10-CDA-ECO-P6/arcane-chronicles.git
cd arcane-chronicles

# Variables d'environnement
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
openssl rand -base64 48                          # à coller dans JWT_SECRET de apps/api/.env
                                                 # choisir aussi un DEMO_GM_PASSWORD (compte MJ de démo)
```

Puis ouvrir le dossier dans VS Code et cliquer sur **« Rouvrir dans le conteneur »** (_Reopen in Container_), ou lancer la commande _Dev Containers: Reopen in Container_. La première ouverture prend quelques minutes : construction de l'image, puis installation automatique des dépendances (`npm ci`), génération du client Prisma et téléchargement de Chromium pour Playwright.

Une fois dans le conteneur, dans le terminal de VS Code :

```bash
npm run prisma:migrate                           # crée les tables en appliquant les migrations
npm run seed                                     # insère les données de référence D&D
npm run seed:demo                                # charge la campagne de démonstration (optionnel)
```

### Fonctionnement du conteneur

Configuration dans `.devcontainer/` : `devcontainer.json` (lu par VS Code), `compose.yaml` (conteneur de travail et base) et `Dockerfile` (image de travail).

| Élément                          | Où il se trouve                                                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code source                      | Partagé avec la machine en temps réel : une modification dans le conteneur est visible sur la machine et inversement, Git fonctionne des deux côtés                                                        |
| `node_modules`, `apps/web/.next` | Volumes Docker propres au conteneur : versions Linux, séparées de celles de la machine, plus rapides                                                                                                       |
| Terminal de VS Code              | Dans le conteneur : `npm run dev`, `npm install`, `git`… s'y lancent                                                                                                                                       |
| Base PostgreSQL                  | Conteneur `db` du projet Docker `arcane-chronicles-devcontainer`, avec ses propres données ; joignable en `localhost:5432` depuis le conteneur de travail                                                  |
| Ports 3000, 4000, 5432           | Redirigés par VS Code vers la machine : le front et l'API s'ouvrent dans le navigateur habituel                                                                                                            |
| Extensions VS Code               | ESLint, Prettier, Prisma, Playwright et Claude Code installées automatiquement ; la connexion et les réglages de Claude Code sont conservés dans un volume (`claude-config`), formatage à l'enregistrement |

Après une modification de `.devcontainer/` ou un changement de version de Node, reconstruire le conteneur : _Dev Containers: Rebuild Container_.

### Au quotidien

```bash
npm run dev
```

Compile le paquet partagé `packages/shared`, puis lance l'API et le front. La base tourne déjà avec le conteneur. Tout se recharge automatiquement à chaque sauvegarde, y compris quand tu modifies `shared` :

| Service    | Adresse                                                         |
| ---------- | --------------------------------------------------------------- |
| Front      | http://localhost:3000                                           |
| API        | http://localhost:4000                                           |
| PostgreSQL | `localhost:5432` (utilisateur, mot de passe et base : `arcane`) |

`Ctrl + C` arrête le front, l'API et la recompilation de `shared` ; la base s'arrête avec le conteneur, quand VS Code est fermé.

### Scripts disponibles

À lancer depuis la racine du dépôt.

| Commande                       | Rôle                                                                                                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                  | Lance `shared` (recompilé à chaque sauvegarde), l'API et le front en mode développement ; démarre aussi la base hors Dev Container                                                                                                          |
| `npm run build`                | Compile `shared`, l'API et le front                                                                                                                                                                                                         |
| `npm run lint`                 | Vérifie le code avec ESLint                                                                                                                                                                                                                 |
| `npm run format`               | Formate le code avec Prettier                                                                                                                                                                                                               |
| `npm run typecheck`            | Compile `shared` puis vérifie les types TypeScript des trois projets                                                                                                                                                                        |
| `npm run test`                 | Tests unitaires et d'intégration (Vitest) : les fichiers `*.test.ts` placés à côté du code testé                                                                                                                                            |
| `npm run test:e2e`             | Tests end-to-end (Playwright) dans `e2e/`, en MJ desktop et en joueur mobile (375 px) ; lance l'application si elle ne tourne pas                                                                                                           |
| `npm run prisma:generate`      | Régénère le client Prisma après une modification de `schema.prisma`                                                                                                                                                                         |
| `npm run prisma:migrate`       | Applique les migrations ; après une modification du schéma, en crée une nouvelle : `npm run prisma:migrate -- --name description-du-changement`                                                                                             |
| `npm run seed`                 | Insère les données de référence D&D (races, classes, historiques, compétences, capacités, effets et objets officiels)                                                                                                                       |
| `npm run seed:demo`            | Charge la campagne de démonstration « L’archipel du néant » (chapitre 1) et le compte MJ « Maître Ying » (`maitre.ying@arcane-chronicles.test`, mot de passe : `DEMO_GM_PASSWORD` dans `apps/api/.env`) ; relançable sans créer de doublons |
| `npm run prisma -- <commande>` | Lance n'importe quelle commande Prisma depuis la racine, ex. `npm run prisma -- migrate status`, `npm run prisma -- studio`                                                                                                                 |
| `npm run icons`                | Régénère la liste des icônes (`apps/web/src/styles/variables/_icons.scss`) après un export IcoMoon                                                                                                                                          |
| `npm run db:reset`             | **Efface toute la base locale**, recrée les tables puis relance le seed (demande confirmation)                                                                                                                                              |

Pour consulter ou modifier les données à la main : `npm run prisma -- studio` ouvre une interface web sur la base (http://localhost:5555). L'extension VS Code **PostgreSQL** (installée dans le Dev Container) permet aussi d'explorer les tables et d'écrire des requêtes SQL : hôte `localhost`, port `5432`, utilisateur, mot de passe et base `arcane`.

### Sans Dev Container

Possible, mais sans garantie d'avoir les mêmes versions que les autres : installer **Node.js 24** (`nvm use` lit `.nvmrc`), puis à la racine `npm install`, `npm run prisma:generate` et `npx playwright install chromium`. `npm run dev` et `npm run db:reset` démarrent alors la base eux-mêmes avec `docker compose` (script `db:up`, qui ne fait rien dans le Dev Container, où la base tourne déjà).

### Tout lancer dans Docker

```bash
docker compose up --build
```

Construit et lance les images de production (`web`, `api`) avec la base : sert à vérifier les images avant un déploiement, sans rechargement automatique. Voir [déploiement](docs/06-deploiement/deploiement.md).

## Structure du dépôt

```
├── README.md
├── apps/                  # web (Next.js) et api (Express)
├── packages/shared/       # code partagé
├── e2e/                   # tests end-to-end (Playwright)
└── docs/                  # documentation du dossier CDA
    └── preuves/           # captures, logs, exports, rapports
```

## Documentation

| Dossier                                         | Contenu                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`01-contexte/`](docs/01-contexte/)             | [Expression du besoin](docs/01-contexte/expression-besoin.md) · [Cahier des charges fonctionnel et technique](docs/01-contexte/cahier-des-charges.md)                                                                                                                                                                 |
| [`02-gestion-projet/`](docs/02-gestion-projet/) | [Planning](docs/02-gestion-projet/planning.md) · [Organisation](docs/02-gestion-projet/organisation.md) · [Périmètre et résumé par version](docs/02-gestion-projet/perimetre/)                                                                                                                                        |
| [`03-conception/`](docs/03-conception/)         | [Architecture](docs/03-conception/architecture.md) · [Spécifications](docs/03-conception/specifications.md) · [Use cases](docs/03-conception/use-cases.md) · [Maquettes et charte](docs/03-conception/maquettes/) · [Design system](docs/03-conception/design-system.md) · [MCD / MLD / MPD](docs/03-conception/mcd/) |
| [`04-securite/`](docs/04-securite/)             | [Sécurité](docs/04-securite/securite.md)                                                                                                                                                                                                                                                                              |
| [`05-tests/`](docs/05-tests/)                   | [Plan de tests](docs/05-tests/plan-tests.md) · [Résultats](docs/05-tests/resultats-tests.md)                                                                                                                                                                                                                          |
| [`06-deploiement/`](docs/06-deploiement/)       | [Déploiement](docs/06-deploiement/deploiement.md)                                                                                                                                                                                                                                                                     |
| [`07-ecoconception/`](docs/07-ecoconception/)   | [Écoconception](docs/07-ecoconception/ecoconception.md)                                                                                                                                                                                                                                                               |
| [`archives/`](docs/archives/)                   | Anciennes versions                                                                                                                                                                                                                                                                                                    |
| [`preuves/`](docs/preuves/)                     | Captures, logs, exports, rapports                                                                                                                                                                                                                                                                                     |

## Liens utiles

- Jira : [projet KAN](https://simplon-team-kqd1jwhw.atlassian.net/browse/KAN) — [MVP](https://simplon-team-kqd1jwhw.atlassian.net/issues/?jql=project%20%3D%20KAN%20AND%20fixVersion%20%3D%20MVP%20ORDER%20BY%20key%20ASC) · [V1.1](https://simplon-team-kqd1jwhw.atlassian.net/issues/?jql=project%20%3D%20KAN%20AND%20fixVersion%20%3D%20%22V1.1%22%20ORDER%20BY%20key%20ASC) · [V1.2](https://simplon-team-kqd1jwhw.atlassian.net/issues/?jql=project%20%3D%20KAN%20AND%20fixVersion%20%3D%20%22V1.2%22%20ORDER%20BY%20key%20ASC) · [V1.3](https://simplon-team-kqd1jwhw.atlassian.net/issues/?jql=project%20%3D%20KAN%20AND%20fixVersion%20%3D%20%22V1.3%22%20ORDER%20BY%20key%20ASC)
- Figma : [Arcane Chronicles](https://www.figma.com/design/Yd5FHMefsXsqPmFDeBDMEk)
- Contenu D&D : [SRD 5.2.1](https://www.dndbeyond.com/srd) (CC-BY-4.0)
