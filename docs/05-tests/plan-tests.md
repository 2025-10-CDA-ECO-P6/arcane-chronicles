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
| Composants front | Vitest + React Testing Library 16.3 + user-event 14.6, jsdom 31 | Composants et hooks React, rendus et utilisés comme par un utilisateur (lecture par rôle et par label) | À chaque push (CI) |
| Intégration API | Vitest + Supertest 7.3, base PostgreSQL de test (conteneur Docker) | Routes Express avec la vraie base | À chaque push (CI) |
| Temps réel | Vitest + socket.io-client | Événements Socket.io, diffusion par room | À chaque push (CI) |
| End-to-end | Playwright 1.64 (un contexte MJ desktop, deux contextes joueurs mobiles 375 px) | Parcours complet dans de vrais navigateurs | Avant chaque déploiement en production |

**Mise en place actuelle** :

| Élément | État |
|---|---|
| Emplacement | Tests unitaires et d'intégration dans des fichiers `*.test.ts` à côté du code testé (`apps/*/src`, `packages/shared/src`) ; tests de composants et de hooks React dans des fichiers `*.test.tsx` ; tests end-to-end dans `e2e/` |
| Configuration Vitest | Deux projets dans `vitest.config.ts` : `node` (tous les `*.test.ts` : API, `shared`, logique du front sans DOM) et `web` (les `*.test.tsx` du front, dans jsdom, avec le plugin React et `apps/web/vitest.setup.ts`, qui charge les vérifications de `jest-dom` et nettoie le DOM après chaque test) |
| Commandes | `npm test` (Vitest) et `npm run test:e2e` (Playwright, qui lance l'application si elle ne tourne pas) |
| Configuration Playwright | Deux profils sur Chromium : `mj-desktop` et `joueur-mobile` (375 px). Firefox et WebKit (NF-03) seront ajoutés avec les premiers parcours complets |
| Premiers tests | `GET /api/health` (intégration), utilitaire d'appel à l'API `apiFetch` (unitaire), affichage de la page d'accueil (end-to-end, deux profils) |
| Authentification | Routes `/api/auth` (inscription, connexion, `/me`, déconnexion, limites de tentatives) et 404 JSON, testées avec Supertest. Le modèle `UserModel` est remplacé par un faux (`vi.mock`), car `npm test` tourne en CI sans base de données ; les tests avec la vraie base viendront quand la CI lancera les tests d'intégration dans le job qui a PostgreSQL. Schéma d'inscription de `shared` (règles du mot de passe, un message par règle) testé à part |
| Front (connexion et inscription) | Composants `Button`, `Input` (description fusionnée avec l'erreur), `Dot`, `NavLink`, `MainNav`, `Header` (apparition sur l'accueil, passage en haut de l'écran au défilement), `BackgroundVideo` (sources AV1 puis H.264, version portrait, nouveau choix de la source quand l'écran tourne), `ProgressBar`, `Toggletip`, `LoginForm`, `RegisterForm` (messages en français, confirmation du mot de passe, description du champ mot de passe, données envoyées), `PasswordStrength` (règles respectées ou non, résumé pour les lecteurs d'écran, barre, ouverture et fermeture de la bulle), contexte `ArcaneProvider` ; hooks `useAuth` (validation des formulaires, effacement des erreurs, redirection après connexion ou inscription, refus des adresses de retour externes, messages d'erreur, déconnexion), `useDisclosure` (ouverture, fermeture avec Échap ou un clic à l'extérieur) , `useSearchBar` (ouverture au premier clic sans envoyer, ouverte si une recherche est active, fermeture avec Échap) `useFitLines` (lignes entières qui tiennent dans la hauteur, arrêt de la surveillance au démontage) et `useStickyHeader` (mode collant une fois le bandeau dépassé vers le haut mais pas vers le bas, place gardée, retour quand le repère est entièrement visible, place libérée une fois le bandeau revenu à sa hauteur complète) ; fonctions `checkPasswordRules` et `getPageClassName` ; `proxy` (redirections sans appel à l'API) ; `getCurrentUser` et `requireCurrentUser` côté serveur (session acceptée, absente, refusée, API injoignable) ; route `/session-expired` (suppression du cookie). Le routeur de Next, les cookies et `apiFetch` sont remplacés par des faux (`vi.mock`) |
| Campagnes | API : routes `/api/campaigns` (catalogue public, campagnes du MJ, `scope` invalide, détail d'une campagne : 200, 404, 401, 422, secret JWT manquant) avec Supertest et le modèle remplacé par un faux ; calcul du `CampaignSummary` (statut, progression, chapitre en cours et sa progression, compteurs). Front : composants `Tag`, `PageHeader` (image par défaut, importée ou URL ; `IntersectionObserver` et `ResizeObserver` remplacés par des faux, absents de jsdom), `ProgressRing`, `SegmentedProgress`, `CampaignCounts`, `CampaignProgress`, `CampaignProgressBar` (pourcentage et légende masqués aux lecteurs d'écran, une seule barre annoncée), `FilterBadge` (lien, filtre actif, nombre), `FilterToolbar` (adresses filtrées, « Toutes » actif sans filtre connu, autres paramètres gardés, nombres sur les badges et les options), `FilterSelect` (options avec leur nombre, option active, adresse filtrée au changement, « Toutes » retire le filtre), `SearchBar` (champ de recherche nommé, envoi à l'adresse de la page, recherche en cours affichée, autres paramètres gardés en champs cachés) . Sidebar de l'espace MJ : `SidebarShell` (zone nommée, état fermé lu dans le contexte), `SidebarSection` (section nommée par son titre), `SidebarProfile` (initiale sans avatar, image avec avatar, nombres), `SidebarLink` (page courante sur la liste et le détail, pas sur une adresse qui commence pareil), `ResumeCampaignLink` (lien, chapitre en cours et sa progression, barre de la campagne, sans chapitre), `Sidebar` (3 campagnes au plus, de la session la plus récente, « Voir plus » au-delà, encadré vide, nombres) ; contexte `ArcaneProvider` (sidebar ouverte par défaut, bascule, état initial, cookie écrit) ; fonctions `formatQuantity`, `formatDate`, `getInitial`, `getParam`, `buildUrl`, `normalizeText` et `matchesSearch` (majuscules, accents, apostrophes) ; `serverGet` (cookie transmis, pas de cache), `getMyCampaigns` et `getCampaign` (`null` sur 404 ou 422), `getCampaignsToResume` (campagnes en cours seulement, triées par dernière session, sans date en dernier), `isSidebarOpenFromCookie` et `sidebarCookie` |
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
| TI-01 | Inscription avec un e-mail déjà utilisé | 409, sans hachage ni création ; aussi quand la base refuse le doublon (inscriptions simultanées) |
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
| TI-14 | Inscription valide | 201, cookie posé, mot de passe enregistré haché, seuls les champs attendus enregistrés |
| TI-15 | Trop de tentatives d'inscription (réussies, refusées ou invalides) | 429 |

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
