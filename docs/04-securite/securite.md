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
| A03 Software Supply Chain Failures | Versions fixées, `package-lock.json` versionné, `npm audit`, Dependabot, images Docker officielles `node:24-slim` et `postgres:17` |
| A04 Cryptographic Failures | Argon2id pour les mots de passe, empreinte du jeton joueur seule en base, HTTPS partout, JWT signé avec un secret fort |
| A05 Injection | Prisma (requêtes paramétrées), Zod, React (échappement à l'affichage) |
| A06 Insecure Design | Serveur d'autorité, révélation contrôlée pensée dès la conception (RG2), pas de compte joueur (moins de données) |
| A07 Authentication Failures | Rate limiting (adresse IP réelle du client lue derrière le proxy de Render grâce à `trust proxy`), cookie `httpOnly` `Secure` `SameSite`, expiration du JWT, déconnexion qui supprime le cookie |
| A08 Software or Data Integrity Failures | Pipeline CI qui construit les images depuis le dépôt ; migrations Prisma versionnées |
| A09 Security Logging and Alerting Failures | Journalisation pino des connexions, refus d'accès et erreurs, sans mot de passe ni jeton (option `redact`) |
| A10 Mishandling of Exceptional Conditions | Gestion centralisée des erreurs d'Express 5 (fonctions `async`), refus par défaut si un contrôle échoue |

---

## 4. Mesures mises en place

### 4.1 Authentification

- **MJ** : mot de passe haché avec Argon2id (19 Mio de mémoire, 2 itérations) ; à la connexion, JWT dans un cookie ; le même cookie authentifie la connexion Socket.io.
- **Cookie de session** : `httpOnly` (illisible par le JavaScript de la page), `Secure` en production (HTTPS seulement), `SameSite=Lax` (non envoyé par les requêtes venant d'autres sites, mais conservé quand on arrive sur le site depuis un lien externe), domaine `arcane-chronicles.fr` pour être partagé entre le front et `api.`.
- **Expiration** : le JWT porte sa date d'expiration (`JWT_EXPIRES_IN`, 7 jours en production), vérifiée par le serveur à chaque requête ; le cookie expire à la même date. Un jeton copié hors du navigateur n'est donc plus accepté après cette date.
- **Connexion** : message identique pour un e-mail inconnu et un mauvais mot de passe, et même durée de réponse : pour un e-mail inconnu, le mot de passe est quand même vérifié avec Argon2 contre une empreinte factice, sinon la réponse plus rapide révélerait que le compte n'existe pas ; 5 échecs au plus par adresse IP sur 15 minutes (les connexions réussies ne comptent pas), puis 429 avec le temps restant en secondes (`retryAfter`). Le front désactive alors les champs et le bouton et indique dans combien de minutes réessayer ; l'heure de fin est gardée dans le navigateur (`localStorage`) pour rester affichée après un rechargement, mais c'est toujours l'API qui décide du blocage.
- **Retour après connexion** : la page demandée (`?redirect=`) n'est suivie que si elle reste sur le site. Le front construit l'URL complète (`new URL`) et compare son origine à celle du site, au lieu de chercher des motifs (`//`, `/\`) : le navigateur retire les tabulations et retours à la ligne d'une URL, et `/%09/site-pirate.com` deviendrait `//site-pirate.com`. Sinon, retour au tableau de bord (protection contre la redirection ouverte).
- **Déconnexion** : toujours possible, même avec une session expirée ; le cookie est supprimé avec les mêmes options que celles de sa création. Si l'appel à l'API échoue (réseau, serveur), le front n'affiche pas l'utilisateur comme déconnecté, puisque le cookie existe encore : il affiche une erreur et l'utilisateur peut réessayer.
- **Affichage selon la session** : le contexte React (`ArcaneProvider`) ne sert qu'à l'affichage (liens du header). L'accès aux pages MJ est vérifié côté serveur (`requireCurrentUser`) et l'accès aux données par l'API.
- **Journaux** : les en-têtes `Cookie` et `Set-Cookie` sont masqués dans les logs pino, pour qu'aucun jeton n'apparaisse dans les journaux de Render.
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
