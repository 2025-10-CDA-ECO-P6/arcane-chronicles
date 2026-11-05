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

Un fichier `.dockerignore` à la racine exclut du contexte de build les `node_modules`, les résultats de build locaux (`.next`, `dist`), les fichiers `.env`, `.git`, la documentation et les originaux des images : aucun secret ne peut ainsi se retrouver dans une image. `prisma generate` reçoit une `DATABASE_URL` factice, limitée à cette commande (il ne se connecte pas à la base) ; la vraie URL est fournie au conteneur à son démarrage.

**`apps/api/Dockerfile`**

```dockerfile
FROM node:24-slim AS build
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

FROM node:24-slim
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
| `PORT` | api | `4000` |
| `DATABASE_URL` | api | URL Neon **poolée** en production, conteneur `db` en local |
| `JWT_SECRET` | api | Chaîne aléatoire longue, différente par environnement |
| `JWT_EXPIRES_IN` | api | Durée de validité du jeton (valeur **à définir**) |
| `CORS_ORIGIN` | api | Origine exacte du frontend |
| `COOKIE_DOMAIN` | api | Domaine commun au front et à l'API |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | api | Accès Cloudinary, côté serveur uniquement |
| `LOG_LEVEL` | api | `info` en production, `debug` en local |
| `NEXT_PUBLIC_API_URL` | web | URL de l'API (REST et Socket.io), fixée au build |

Les secrets de production sont saisis dans les tableaux de bord Vercel et Render, et dans les secrets GitHub pour la CI.

---

## 4. Intégration et déploiement continus

**Proposition** : GitHub Actions, avec le déploiement automatique de Vercel et de Render branchés sur la branche `main`.

```mermaid
flowchart LR
  P["Push / pull request"] --> L["npm ci<br/>lint + typecheck"]
  L --> U["Tests unitaires"]
  U --> I["Tests d'intégration<br/>+ temps réel<br/>(service postgres:17)"]
  I --> B["docker build web et api"]
  B --> E{"Branche main ?"}
  E -- oui --> E2E["Tests end-to-end<br/>docker compose + Playwright"]
  E2E --> D["Déploiement automatique<br/>Vercel (web) · Render (api)"]
  E -- non --> F["Fin : statut sur la PR"]
```

Une pull request ne peut être fusionnée que si la CI est verte.

---

## 5. Mise en production

| Service | Configuration |
|---|---|
| **Vercel** | Projet relié au dépôt GitHub, dossier racine `apps/web`, variable `NEXT_PUBLIC_API_URL`, déploiement à chaque push sur `main` et prévisualisation pour chaque PR |
| **Render** | Service web de type Docker, Dockerfile `apps/api/Dockerfile`, contexte racine du dépôt, variables d'environnement de l'API, déploiement à chaque push sur `main` |
| **Neon** | Projet PostgreSQL 17, URL de connexion poolée pour l'API |
| **Cloudinary** | Compte et dossier `arcane-chronicles/production` |
| **Domaine** | Frontend et API sous un même domaine (`app.` et `api.`, nom **à définir**), pour que le cookie de session reste un cookie du même site |

### Procédure

1. Fusionner la PR dans `main` (CI verte).
2. Vercel et Render construisent et déploient automatiquement.
3. Au démarrage, l'API applique les migrations (`prisma migrate deploy`).
4. Vérifier la page d'accueil, la connexion et une partie de test ; garder une capture dans [`preuves/`](../preuves/).

### Retour arrière

- Vercel et Render permettent de remettre en ligne le déploiement précédent depuis leur tableau de bord.
- Les migrations ne vont que vers l'avant : une migration fautive est corrigée par une nouvelle migration, testée d'abord en local et en CI.

---

## 6. Surveillance

- Logs JSON pino consultables dans Render.
- Ping régulier (UptimeRobot) avant les démonstrations, car Render met le service gratuit en veille après 15 minutes d'inactivité.
- Suivi des quotas gratuits de Neon et Cloudinary.
