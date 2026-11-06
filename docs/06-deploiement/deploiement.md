# Déploiement — Arcane Chronicles

**Mise à jour** : 05/11/2026
**Documents liés** : [cahier des charges §2.2 et §2.8](../01-contexte/cahier-des-charges.md), [architecture](../03-conception/architecture.md), [sécurité](../04-securite/securite.md)

> Les fichiers Docker ci-dessous sont ceux du dépôt. La CI (GitHub Actions) et la configuration de Render, Vercel et Neon restent à mettre en place au premier déploiement.

---

## 1. Environnements

| Environnement | Frontend | Backend | Base | Usage |
|---|---|---|---|---|
| **Local** | `npm run dev` dans le Dev Container (conteneur `web` pour vérifier l'image) | `npm run dev` dans le Dev Container (conteneur `api` pour vérifier l'image) | Conteneur `postgres:17` du Dev Container | Développement |
| **CI** | Image `web` | Image `api` | Conteneur `postgres:17` jetable | Lint, tests, construction des images |
| **Production** | Vercel | Render (image Docker) | Neon (PostgreSQL 17) | Démonstration et jury |

Images : Cloudinary, en local comme en production (un dossier par environnement).

---

## 2. Docker

### 2.1 Une image pour le front, une pour le back

L'application est entièrement dockerisée avec **deux images** et un **docker-compose** :

| Choix | Raison |
|---|---|
| Une image par application | Le front et le back sont deux processus différents ; la bonne pratique Docker est « un conteneur = un processus ». Chacun se reconstruit, redémarre et se déploie seul : modifier une page ne reconstruit pas l'API |
| Pas d'image unique front + back | Il faudrait un gestionnaire de processus dans le conteneur, tout reconstruire à chaque modification, et l'image ne pourrait pas être déployée sur Vercel |
| Un `docker-compose.yml` à la racine | Une seule commande lance la base, ou toute la pile de production (web + api + base) pour la vérifier, identique sur chaque machine et en CI |

En production, l'image `api` est déployée sur Render. Le frontend est déployé sur **Vercel**, qui construit Next.js lui-même à partir du dossier `apps/web` (déploiement le plus simple et le plus rapide pour Next.js) ; l'image `web` sert au développement local, aux tests end-to-end en CI, et permet de basculer le front sur Render (service Docker) sans toucher au code si besoin.

### 2.2 Images en plusieurs étapes

Les deux Dockerfiles utilisent la racine du dépôt comme contexte (pour inclure `packages/shared`) et deux étapes : une étape `build` avec toutes les dépendances, une étape finale qui ne garde que le code compilé et les dépendances de production, lancée avec l'utilisateur `node` (non root).

**Image de départ : `node:24-slim` plutôt que `node:24-alpine`.** Alpine est plus légère, mais elle repose sur la bibliothèque C musl, alors que Debian (`slim`), le Dev Container, la CI GitHub et l'image `postgres:17` utilisent glibc :

| Point | Conséquence avec Alpine |
|---|---|
| Modules natifs | `argon2` (hachage des mots de passe) est fourni compilé pour glibc ; sous musl il faut une version dédiée ou une compilation avec Python, make et gcc dans l'image |
| Prisma | Moteurs musl à déclarer (`binaryTargets`) en plus d'OpenSSL : source classique d'écarts entre local et production |
| Lockfile | Le `package-lock.json` contient des dépendances optionnelles propres à chaque libc (champs `libc`) |
| Cohérence | Même base glibc en local, en CI et en production : on teste ce qui est déployé |

`slim` garde la compatibilité de Debian sans les outils de compilation de l'image `node:24` complète (environ 200 Mo contre plus d'1 Go). La sécurité repose sur une image minimale, des reconstructions régulières pour intégrer les correctifs, l'utilisateur non root et l'absence de secret dans l'image. Point à approfondir pour le dossier projet (comparaison chiffrée des tailles et des vulnérabilités connues).

Un fichier `.dockerignore` à la racine exclut du contexte de build les `node_modules`, les résultats de build locaux (`.next`, `dist`), les fichiers `.env`, `.git`, la documentation et les originaux des images : aucun secret ne peut ainsi se retrouver dans une image. `prisma generate` reçoit une `DATABASE_URL` factice, limitée à cette commande (il ne se connecte pas à la base) ; la vraie URL est fournie au conteneur à son démarrage.

**`apps/api/Dockerfile`**

L'image de l'API part d'une étape `base` commune qui installe OpenSSL : Prisma choisit son moteur selon la version d'OpenSSL présente, elle doit donc être la même au build et à l'exécution, et la connexion à Neon passe en SSL. Le CLI `prisma` est une dépendance de production, car le conteneur applique les migrations à son démarrage.

```dockerfile
FROM node:24-slim AS base
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

FROM base AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN npm ci
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build -w packages/shared \
 && DATABASE_URL=postgresql://build:build@localhost:5432/build npm run prisma:generate -w apps/api \
 && npm run build -w apps/api \
 && npm prune --omit=dev

FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/apps/api ./apps/api
USER node
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["npm", "run", "start:prod"]   # prisma migrate deploy, puis node dist/index.js
```

**`apps/web/Dockerfile`** (Next.js en mode `output: "standalone"`, avec `outputFileTracingRoot` sur la racine du dépôt pour inclure `packages/shared`)

```dockerfile
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN npm ci
COPY packages/shared packages/shared
COPY apps/web apps/web
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build -w packages/shared && npm run build -w apps/web

FROM node:24-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

### 2.3 `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: arcane
      POSTGRES_PASSWORD: arcane
      POSTGRES_DB: arcane
    ports: ["5432:5432"]
    volumes: [db-data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U arcane"]
      interval: 5s
      retries: 10

  api:
    build: { context: ., dockerfile: apps/api/Dockerfile }
    env_file: apps/api/.env
    environment:
      DATABASE_URL: postgresql://arcane:arcane@db:5432/arcane
      CORS_ORIGIN: http://localhost:3000
    ports: ["4000:4000"]
    depends_on:
      db: { condition: service_healthy }

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
      args: { NEXT_PUBLIC_API_URL: "http://localhost:4000" }
    ports: ["3000:3000"]
    depends_on: [api]

volumes:
  db-data:
```

### 2.4 Commandes

| Besoin | Commande |
|---|---|
| Tout lancer comme en production | `docker compose up --build` |
| Développer avec rechargement à chaud | Ouvrir le projet dans le Dev Container (VS Code), puis `npm run dev` dans son terminal |
| Appliquer les migrations et le seed en local | `npm run prisma:migrate -w apps/api` puis `npm run seed -w apps/api` |
| Tout arrêter | `docker compose down` (ajouter `-v` pour effacer la base locale) |

Pour le développement, le projet utilise un **Dev Container** (`.devcontainer/`) : VS Code s'ouvre dans un conteneur qui contient Node 24, les outils du projet et la base PostgreSQL. Tous les développeurs travaillent ainsi avec les mêmes versions, et le code reste partagé avec la machine en temps réel (rechargement à chaud de Next.js et d'Express conservé). `node_modules` et `.next` sont rangés dans des volumes Docker propres au conteneur : ils contiennent des binaires Linux, différents de ceux de macOS ou Windows, et ces volumes évitent la lenteur des fichiers partagés sur macOS. Mise en route : section « Lancer le projet » du README.

Développement et production partent de la même version de Node (24, Debian) ; le Dev Container y ajoute seulement les outils de travail (Git, Playwright et ses dépendances système). La pile complète en conteneurs (`docker compose up --build`) sert à vérifier les images de production avant un déploiement et aux tests end-to-end.

---

## 3. Variables d'environnement

Fichiers `.env` non versionnés ; un `.env.example` versionné liste les clés sans valeur.

| Variable | Application | Exemple / rôle |
|---|---|---|
| `NODE_ENV` | api | `production` |
| `PORT` | api | `4000` en local ; fourni par Render en production |
| `DATABASE_URL` | api | URL Neon **poolée** en production (utilisée par l'application), conteneur `db` en local |
| `DIRECT_URL` | api | URL Neon **directe** en production, utilisée par Prisma pour les migrations ; vide en local (Prisma prend alors `DATABASE_URL`) |
| `JWT_SECRET` | api | Chaîne aléatoire longue, différente par environnement |
| `JWT_EXPIRES_IN` | api | Durée de validité du jeton, `7d` en production |
| `CORS_ORIGIN` | api | Origine(s) exacte(s) du frontend, séparées par des virgules (`https://arcane-chronicles.fr` en production) |
| `COOKIE_DOMAIN` | api | Domaine commun au front et à l'API (`arcane-chronicles.fr` en production) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | api | Accès Cloudinary, côté serveur uniquement |
| `LOG_LEVEL` | api | `info` en production, `debug` en local |
| `NEXT_PUBLIC_API_URL` | web | URL de l'API (REST et Socket.io), fixée au build (`https://api.arcane-chronicles.fr` en production) |

Les secrets de production sont saisis dans les tableaux de bord Vercel et Render ; la CI n'utilise que des valeurs factices propres à son passage.

---

## 4. Intégration et déploiement continus

L'intégration continue est un workflow GitHub Actions, `.github/workflows/ci.yml`. Il se lance à chaque pull request vers `develop`, `main` ou une branche `release/…`, et à chaque push sur `develop`, `main` et les branches `release/…`, c'est-à-dire après chaque fusion. Trois tâches tournent en parallèle ; un nouveau push sur la même branche annule le passage en cours. Chaque tâche tourne sur `ubuntu-24.04`, une version fixée plutôt que `ubuntu-latest`, pour que la CI ne change pas de système sans qu'on le décide (le passage à une version plus récente se fait dans un commit dédié, avant le retrait de l'image par GitHub), et s'arrête au bout de 15 minutes (`timeout-minutes`) si elle reste bloquée.

```mermaid
flowchart LR
  P["Pull request / push"] --> C["checks<br/>format, lint, types,<br/>tests unitaires et d'intégration, build"]
  P --> D["database-e2e<br/>service postgres:17 :<br/>migrations, seeds, Playwright"]
  P --> K["docker<br/>construction des images api et web"]
  C --> S{"Tout est vert ?"}
  D --> S
  K --> S
  S -- oui --> M["Fusion possible"]
  S -- non --> R["Fusion bloquée"]
```

| Tâche | Étapes |
|---|---|
| `checks` | `npm ci` (Node lu dans `.nvmrc`, cache npm), génération du client Prisma, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` |
| `database-e2e` | Base `postgres:17` fournie par GitHub ; fichiers `.env` créés à partir des `.env.example` (secrets propres à la CI) ; `prisma migrate deploy`, `npm run seed`, `npm run seed:demo` (valident la migration et les seeds sur une base neuve) ; Chromium installé, puis `npm run test:e2e`. En cas d'échec, le rapport Playwright est téléchargeable dans les artefacts du passage (7 jours) |
| `docker` | `docker build` des images `api` et `web`, sans publication |

En CI, le script `db:up` ne lance pas `docker compose` (variable `CI`) : la base est le service PostgreSQL de GitHub.

Le ruleset GitHub de `main`, `develop` et `release/**` exige que ces trois tâches réussissent (« Require status checks to pass ») : une pull request ne peut être fusionnée que si la CI est verte.

Le déploiement continu (Vercel pour le front, Render pour l'API, Neon pour la base) est branché sur `main` : chaque release fusionnée dans `main` est déployée automatiquement (voir §5).

---

## 5. Mise en production

Tout est hébergé sur des offres gratuites, sous le domaine **`arcane-chronicles.fr`** (acheté chez OVHcloud) : le front est servi sur le domaine lui-même et l'API sur le sous-domaine `api.` ; ils partagent le même domaine, le cookie de session reste donc un cookie du même site.

| Adresse | Service | Configuration |
|---|---|---|
| `arcane-chronicles.fr` (et `www.`, redirigé vers le domaine) | **Vercel** | Projet relié au dépôt GitHub, dossier racine `apps/web`, réglages dans `apps/web/vercel.json`, variable `NEXT_PUBLIC_API_URL` |
| `api.arcane-chronicles.fr` | **Render** | Service web Docker (offre gratuite, Francfort) décrit dans `render.yaml` à la racine (Blueprint) |
| — | **Neon** | Projet PostgreSQL 17 en Europe (Francfort) : URL poolée pour l'application, URL directe pour les migrations |
| — | **Cloudinary** | Compte et dossier `arcane-chronicles/production` |

**`render.yaml`** : image construite depuis `apps/api/Dockerfile` avec la racine du dépôt comme contexte, contrôle de santé sur `/api/health`, domaine personnalisé, variables non secrètes écrites dans le fichier, `JWT_SECRET` généré par Render, autres secrets (`sync: false`) saisis dans le tableau de bord. `autoDeployTrigger: checksPass` : Render ne déploie un commit de `main` qu'une fois la CI GitHub verte.

**`apps/web/vercel.json`** : installation et build lancés à la racine du monorepo (`npm ci`, build de `packages/shared` puis de `apps/web`) ; `ignoreCommand` annule tout build qui ne vient pas de `main`, car un aperçu de branche appellerait l'API de production, qui le refuserait (CORS).

L'API fait confiance au premier proxy (`trust proxy`) : derrière Render, elle lit ainsi la vraie adresse IP du client (limitation de débit, logs) et sait que la connexion est en HTTPS (cookie `Secure`).

### Première mise en place

1. **Neon** : créer le projet `arcane-chronicles` (PostgreSQL 17, région Francfort), relever l'URL poolée et l'URL directe.
2. **Render** : *New → Blueprint*, choisir le dépôt ; saisir `DATABASE_URL`, `DIRECT_URL` et les clés Cloudinary.
3. **Vercel** : *Add New → Project*, choisir le dépôt, dossier racine `apps/web`, variable `NEXT_PUBLIC_API_URL=https://api.arcane-chronicles.fr`, branche de production `main`.
4. **OVHcloud** (zone DNS) : les enregistrements `A` du domaine (qui pointent vers la page de parking d'OVH) remplacés par l'adresse IP indiquée par Vercel, car un domaine nu ne peut pas avoir de `CNAME` ; un `CNAME` `www` vers l'adresse donnée par Vercel ; un `CNAME` `api` vers l'adresse `….onrender.com` du service. Les enregistrements `MX` (e-mail) ne changent pas. Vercel et Render délivrent ensuite les certificats HTTPS.
5. **Données** : une seule fois, lancer `npm run seed` puis `npm run seed:demo` depuis le Dev Container avec `DATABASE_URL` pointant vers l'URL directe de Neon.
6. **UptimeRobot** : moniteur HTTP sur `https://api.arcane-chronicles.fr/api/health` toutes les 5 minutes (voir §6).

### Procédure

1. Fusionner la release dans `main` (CI verte).
2. Vercel et Render construisent et déploient automatiquement.
3. Au démarrage, l'API applique les migrations (`prisma migrate deploy`, par l'URL directe).
4. Vérifier la page d'accueil, la connexion et une partie de test ; garder une capture dans [`preuves/`](../preuves/).

### Retour arrière

- Vercel et Render permettent de remettre en ligne le déploiement précédent depuis leur tableau de bord.
- Les migrations ne vont que vers l'avant : une migration fautive est corrigée par une nouvelle migration, testée d'abord en local et en CI.

---

## 6. Surveillance

- Logs JSON pino consultables dans Render.
- Ping UptimeRobot sur `/api/health` toutes les 5 minutes : Render met le service gratuit en veille après 15 minutes sans requête (réveil d'environ une minute). Un seul service tourne en continu, soit environ 730 heures par mois, sous les 750 heures gratuites. Le moniteur alerte aussi par e-mail si l'API tombe.
- Suivi des quotas gratuits de Neon et Cloudinary.
