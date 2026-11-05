# Plan de tests — Arcane Chronicles

**Mise à jour** : 03/11/2026
**Documents liés** : [stratégie de tests (cahier des charges §2.10)](../01-contexte/cahier-des-charges.md), [spécifications](../03-conception/specifications.md), [sécurité](../04-securite/securite.md), [résultats](resultats-tests.md)

---

## 1. Objectif

Vérifier en priorité ce qui casserait la fonctionnalité principale : les **droits** (un joueur ne voit jamais les secrets du MJ), les **règles calculées** et le **déroulé d'une partie**.

---

## 2. Niveaux de tests

| Niveau | Outil | Périmètre | Quand |
|---|---|---|---|
| Unitaire | Vitest 5.1 | Fonctions pures et services, sans base ni réseau | À chaque push (CI) |
| Intégration API | Vitest + Supertest 7.3, base PostgreSQL de test (conteneur Docker) | Routes Express avec la vraie base | À chaque push (CI) |
| Temps réel | Vitest + socket.io-client | Événements Socket.io, diffusion par room | À chaque push (CI) |
| End-to-end | Playwright 1.64 (un contexte MJ desktop, deux contextes joueurs mobiles 375 px) | Parcours complet dans de vrais navigateurs | Avant chaque déploiement en production |

**Mise en place actuelle** :

| Élément | État |
|---|---|
| Emplacement | Tests unitaires et d'intégration dans des fichiers `*.test.ts` à côté du code testé (`apps/*/src`, `packages/shared/src`) ; tests end-to-end dans `e2e/` |
| Commandes | `npm test` (Vitest) et `npm run test:e2e` (Playwright, qui lance l'application si elle ne tourne pas) |
| Configuration Playwright | Deux profils sur Chromium : `mj-desktop` et `joueur-mobile` (375 px). Firefox et WebKit (NF-03) seront ajoutés avec les premiers parcours complets |
| Premiers tests | `GET /api/health` (intégration), utilitaire d'appel à l'API `apiFetch` (unitaire), affichage de la page d'accueil (end-to-end, deux profils) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) à chaque pull request : tests unitaires et d'intégration, puis migrations, seeds et tests end-to-end sur une base PostgreSQL 17 neuve (voir [déploiement §4](../06-deploiement/deploiement.md)) |
| Recette manuelle | — | Scénario de recette du MVP, accessibilité, navigateurs | En fin d'itération |

---

## 3. Environnement de test

- `docker compose` lance une base `postgres:17` dédiée aux tests ; elle est remise à zéro (migrations + seed) avant chaque suite d'intégration.
- Les tests end-to-end tournent contre les images Docker `web` et `api`, identiques à celles déployées.
- Les données de test (MJ, campagne courte, héros prétirés) sont créées par un script de seed.

---

## 4. Cas de tests

### 4.1 Règles calculées (unitaires)

| ID | Cas | Résultat attendu | Règle |
|---|---|---|---|
| TU-01 | Modificateur pour 8, 10, 15, 20 | −1, 0, +2, +5 | §5 spécifications |
| TU-02 | CA avec armure portée (CA 14) et DEX 14 | 16 | RG9 |
| TU-03 | CA sans armure, DEX 12 | 11 | RG9 |
| TU-04 | Niveau pour 0, 299, 300, 900 XP | 1, 1, 2, 3 | RG9 |
| TU-05 | Niveau ajusté par le MJ (+1) | Niveau calculé + 1 | RG9 |
| TU-06 | Ordre de tour : initiatives 18, 12, 12 (DEX 14 et 10), 5 | 18, 12 (DEX 14), 12 (DEX 10), 5 | RG6 |
| TU-07 | « Suivant » sur le dernier combattant | Retour au premier | RG6 |
| TU-08 | « Suivant » quand le combattant suivant est mort | Il est sauté | RG5, RG6 |
| TU-09 | PV ramenés à 0 | Personnage mort | RG5 |
| TU-10 | Progression : 2 objectifs validés sur 4 | 50 % | RG7 |
| TU-11 | Filtrage joueur d'une scène avec un coffre fermé et une énigme non résolue | Ni contenu du coffre ni solution dans la sortie | RG2 |

### 4.2 API et droits (intégration)

| ID | Cas | Résultat attendu |
|---|---|---|
| TI-01 | Inscription avec un e-mail déjà utilisé | 409 |
| TI-02 | Connexion valide | 200 et cookie `httpOnly` posé |
| TI-03 | Connexion avec un mauvais mot de passe | 401, même message que pour un e-mail inconnu |
| TI-04 | Trop de tentatives de connexion | 429 |
| TI-05 | Accès à une route MJ sans cookie | 401 |
| TI-06 | Un MJ modifie la campagne d'un autre MJ | 403 |
| TI-07 | Corps de requête invalide (champ manquant, mauvais type) | 422 avec le détail des champs (`errors: [{ field, message }]`) |
| TI-08 | Un joueur demande l'état de la partie | Pas de notes du MJ, pas de solution, pas de PNJ caché |
| TI-09 | Un jeton joueur utilisé sur une autre partie | 403 |
| TI-10 | Requête depuis une origine non autorisée | Refusée par CORS |
| TI-11 | Upload d'un fichier qui n'est pas une image, ou trop lourd | 400 |
| TI-12 | Duplication d'une campagne publique | Copie appartenant au MJ, liée à l'original |
| TI-13 | Suppression du compte MJ | Compte, campagnes et parties supprimés |

### 4.3 Temps réel

| ID | Cas | Résultat attendu |
|---|---|---|
| TR-01 | Le MJ modifie des PV | Les joueurs de la partie reçoivent la mise à jour en moins de 500 ms |
| TR-02 | Deux parties en même temps | Les joueurs de la partie B ne reçoivent rien de la partie A |
| TR-03 | Un joueur envoie un événement réservé au MJ (`hp:update`) | Refusé, état inchangé |
| TR-04 | Connexion sans cookie ni jeton valide | Refusée |
| TR-05 | Un joueur se reconnecte avec son jeton | Il retrouve son héros et l'état à jour |
| TR-06 | Le MJ révèle un coffre | Les joueurs reçoivent son contenu à ce moment-là, pas avant |

### 4.4 End-to-end — scénario de recette du MVP

| ID | Étape | Résultat attendu |
|---|---|---|
| E2E-01 | Un visiteur parcourt le catalogue et duplique une campagne (connexion) | La copie apparaît dans son tableau de bord |
| E2E-02 | Le MJ lance la partie sur un chapitre | Code et lien de partie affichés |
| E2E-03 | Deux joueurs rejoignent par le lien sur mobile | Ils apparaissent dans le lobby |
| E2E-04 | Le MJ attribue un héros à chaque joueur par glisser-déposer | Chaque joueur voit sa fiche |
| E2E-05 | Le MJ commerce avec un marchand pour un héros | L'or et l'inventaire du joueur changent |
| E2E-06 | Combat : initiative, trois « Suivant », un monstre à 0 PV | Ordre correct, mort sautée, joueurs à jour |
| E2E-07 | Le MJ ouvre un coffre et distribue le butin | Inventaires mis à jour |
| E2E-08 | Le MJ valide un objectif | Progression de la quête mise à jour chez les joueurs |
| E2E-09 | Le MJ termine la partie puis la relance | Reprise sur la même scène, PV, morts, stocks et coffres conservés |

### 4.5 Exigences non fonctionnelles

| ID | Cas | Outil |
|---|---|---|
| NF-01 | Interface joueur lisible et utilisable de 350 à 375 px | Playwright (viewport) + vérification manuelle |
| NF-02 | Contrastes, navigation clavier, libellés (WCAG 2.1 AA) | Lighthouse, axe DevTools, test au clavier |
| NF-03 | Chrome, Firefox, Edge, Safari (dont Safari iOS) | Playwright (Chromium, Firefox, WebKit) + appareil réel |
| NF-04 | 1 MJ + 6 joueurs sans dégradation | Test temps réel avec 7 clients simulés |
| NF-05 | Poids et performance des pages | Lighthouse, EcoIndex (voir [écoconception](../07-ecoconception/ecoconception.md)) |

---

## 5. Critères de validation

- Tous les tests unitaires, d'intégration et temps réel passent en CI avant fusion.
- Aucun test de droits (TU-11, TI-05 à TI-10, TR-02 à TR-04) en échec : ils sont bloquants.
- Le scénario E2E-01 à E2E-09 passe avant chaque mise en production.
- Les résultats sont consignés dans [`resultats-tests.md`](resultats-tests.md) ; les rapports (couverture, Playwright, Lighthouse) sont rangés dans [`preuves/rapports/`](../preuves/).
