# Sécurité — Arcane Chronicles

**Mise à jour** : 03/11/2026
**Documents liés** : [cahier des charges §2.6.1](../01-contexte/cahier-des-charges.md), [architecture](../03-conception/architecture.md), [plan de tests](../05-tests/plan-tests.md), [déploiement](../06-deploiement/deploiement.md)

---

## 1. Ce qu'il faut protéger

| Bien | Pourquoi c'est sensible |
|---|---|
| Comptes MJ (e-mail, mot de passe) | Données personnelles ; un compte volé donne accès à toutes les campagnes |
| Secrets de jeu (notes du MJ, solutions d'énigmes, contenu des coffres fermés, PNJ cachés) | Cœur de l'expérience : une fuite vers un joueur casse la partie |
| Accès à une partie (code, jeton joueur) | Un intrus pourrait suivre ou perturber une partie |
| Campagnes et bibliothèques des MJ | Travail personnel, modifiable uniquement par son auteur |
| Clés et secrets du serveur (JWT, base, Cloudinary) | Leur fuite compromet toute l'application |

---

## 2. Analyse des risques

| # | Risque | Gravité | Probabilité | Mesures |
|---|---|:-:|:-:|---|
| R1 | Un joueur reçoit une donnée secrète du MJ | Élevée | Moyenne | Filtrage côté serveur selon ce qui est révélé (RG2) ; rooms Socket.io séparées MJ / joueurs ; tests dédiés |
| R2 | Un MJ modifie la campagne d'un autre MJ | Élevée | Moyenne | Contrôle du propriétaire sur chaque route et chaque événement ; tests d'intégration |
| R3 | Vol de session (XSS) | Élevée | Faible | JWT en cookie `httpOnly` ; React échappe le texte affiché ; pas de `dangerouslySetInnerHTML` sur du contenu saisi ; en-têtes helmet (CSP) |
| R4 | Force brute sur la connexion ou devinette d'un code de partie | Moyenne | Moyenne | express-rate-limit ; code de partie aléatoire assez long ; message d'erreur identique pour un e-mail inconnu et un mauvais mot de passe |
| R5 | Injection SQL | Élevée | Faible | Requêtes paramétrées Prisma ; validation Zod de toutes les entrées ; aucun SQL construit par concaténation |
| R6 | Requête forgée depuis un autre site (CSRF) | Moyenne | Faible | Cookie `SameSite` ; CORS limité à l'origine du frontend ; aucune modification par une requête GET |
| R7 | Upload d'un fichier malveillant ou trop lourd | Moyenne | Faible | multer limite la taille et les types MIME (images uniquement) ; fichier envoyé à Cloudinary, jamais servi par l'API |
| R8 | Fuite d'un secret (clé, mot de passe de base) | Élevée | Faible | Variables d'environnement ; `.env` exclu de Git ; aucun secret dans les images Docker ; clé Cloudinary uniquement côté serveur |
| R9 | Dépendance vulnérable | Moyenne | Moyenne | Versions fixées ; `npm audit` en CI ; alertes Dependabot sur GitHub |
| R10 | Erreur serveur qui expose des détails internes | Faible | Moyenne | Middleware d'erreur centralisé : message générique au client, détail dans les logs pino |

---

## 3. Correspondance avec l'OWASP Top 10 (2025)

| Catégorie OWASP | Réponse dans le projet |
|---|---|
| A01 Broken Access Control | Droits vérifiés côté serveur pour chaque requête et chaque événement (R1, R2) |
| A02 Security Misconfiguration | helmet, CORS en liste blanche, variables d'environnement par environnement, conteneurs sans utilisateur root |
| A03 Software Supply Chain Failures | Versions fixées, `package-lock.json` versionné, `npm audit`, Dependabot, images Docker officielles `node:24` et `postgres:17` |
| A04 Cryptographic Failures | Argon2id pour les mots de passe, empreinte du jeton joueur seule en base, HTTPS partout, JWT signé avec un secret fort |
| A05 Injection | Prisma (requêtes paramétrées), Zod, React (échappement à l'affichage) |
| A06 Insecure Design | Serveur d'autorité, révélation contrôlée pensée dès la conception (RG2), pas de compte joueur (moins de données) |
| A07 Authentication Failures | Rate limiting, cookie `httpOnly` `Secure` `SameSite`, expiration du JWT, déconnexion qui supprime le cookie |
| A08 Software or Data Integrity Failures | Pipeline CI qui construit les images depuis le dépôt ; migrations Prisma versionnées |
| A09 Security Logging and Alerting Failures | Journalisation pino des connexions, refus d'accès et erreurs, sans mot de passe ni jeton (option `redact`) |
| A10 Mishandling of Exceptional Conditions | Gestion centralisée des erreurs d'Express 5 (fonctions `async`), refus par défaut si un contrôle échoue |

---

## 4. Mesures mises en place

### 4.1 Authentification

- **MJ** : mot de passe haché avec Argon2id ; à la connexion, JWT dans un cookie `httpOnly`, `Secure`, `SameSite` ; le même cookie authentifie la connexion Socket.io.
- **Joueur** : jeton aléatoire propre à la partie, remis à l'entrée ; seule son empreinte est stockée (`participants.token_hash`).

### 4.2 Autorisations

- Middleware de droits sur chaque route : « est-ce le MJ propriétaire ? » ou « est-ce un participant de cette partie ? ».
- Les données envoyées aux joueurs sont construites par une fonction de filtrage unique, testée, qui ne garde que ce qui est révélé.

### 4.3 Entrées

- Un schéma Zod par corps de requête, paramètre et événement ; toute requête invalide reçoit une erreur 422 avec la liste des champs refusés (`errors: [{ field, message }]`).
- Taille maximale des corps JSON et des fichiers.

### 4.4 Transport et en-têtes

- HTTPS fourni par Vercel et Render ; WebSocket sécurisé (WSS).
- helmet : CSP, HSTS, interdiction des iframes, `X-Content-Type-Options`.
- CORS : seule l'origine du frontend est autorisée, avec `credentials: true` ; même liste blanche pour Socket.io.

### 4.5 Conteneurs

- Images construites en plusieurs étapes : l'image finale ne contient ni le code source TypeScript ni les dépendances de développement.
- Processus lancé avec l'utilisateur `node` (non root).
- Secrets passés par variables d'environnement au démarrage, jamais copiés dans l'image.

---

## 5. Données personnelles (RGPD)

| Donnée | Personne | Finalité | Conservation |
|---|---|---|---|
| E-mail, nom affiché, mot de passe haché | MJ | Compte et connexion | Jusqu'à la suppression du compte |
| Pseudo | Joueur | Affichage dans la partie | Avec la partie (durée **à définir**) |

- Minimisation : aucun compte joueur, aucune donnée de suivi ni outil d'analyse tiers.
- Droit à l'effacement : la suppression du compte supprime ses campagnes et ses parties.
- Hébergement : régions des services (Neon, Render, Vercel, Cloudinary) **à vérifier** pour privilégier l'Union européenne.
- Mentions légales et politique de confidentialité : **à rédiger**.
