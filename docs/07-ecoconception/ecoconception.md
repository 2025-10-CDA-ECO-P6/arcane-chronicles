# Écoconception — Arcane Chronicles

**Mise à jour** : 03/11/2026
**Documents liés** : [cahier des charges](../01-contexte/cahier-des-charges.md), [architecture](../03-conception/architecture.md), [plan de tests](../05-tests/plan-tests.md)
**Référentiel** : RGESN (Référentiel général d'écoconception de services numériques, Arcom / Arcep / ADEME)

---

## 1. Démarche

L'objectif est de limiter les ressources consommées (données transférées, calcul serveur, énergie des téléphones des joueurs) sans dégrader l'expérience. Trois principes :

1. **Ne construire que l'utile** : le périmètre est réduit volontairement (pas de moteur de règles, pas de grille tactique, pas de chat ni de vidéo, pas d'application native).
2. **Alléger ce qui est envoyé** : polices, images et données réduites au nécessaire, surtout pour les joueurs sur mobile.
3. **Mesurer** : poids des pages et nombre de requêtes contrôlés avant chaque version.

---

## 2. Choix fonctionnels

| Choix | Effet |
|---|---|
| Dés physiques, pas de lanceur intégré (MVP) | Moins de fonctionnalités, moins d'écrans |
| Joueurs sans compte | Moins de données stockées, moins d'écrans d'inscription |
| Catalogue paginé par 5 | Pas de chargement de toute la liste des campagnes |
| Carte = simple image (MVP) | Pas d'éditeur de carte lourd côté navigateur |
| Valeurs dérivées calculées, pas stockées | Moins de données en base, pas de synchronisation à maintenir |

---

## 3. Choix techniques

| Domaine | Mesure |
|---|---|
| **Rendu** | Pages publiques rendues côté serveur (HTML léger, affichage rapide) ; JavaScript client limité aux zones interactives |
| **Temps réel** | WebSocket ouvert uniquement pendant une partie ; le serveur envoie des mises à jour ciblées par room, jamais d'interrogation régulière (polling) |
| **Données** | Réponses de l'API limitées aux champs utiles à l'écran ; pagination ; index sur les clés étrangères |
| **Polices** | Fichiers locaux (aucune requête vers un service tiers), une police variable par famille au lieu d'un fichier par graisse |
| **Icônes** | Une seule police d'icônes de 33 Ko (WOFF) pour 84 icônes, au lieu de dizaines d'images ou d'une bibliothèque d'icônes complète |
| **Images** | WebP en deux tailles (`-desktop` et `-mobile`), chargement différé (`loading="lazy"`) ; images uploadées redimensionnées par Cloudinary au format demandé |
| **Thème sombre** | Fond `#080808` : moins d'énergie consommée sur les écrans OLED des téléphones |
| **Pas de traceurs** | Aucun outil d'analyse ni script publicitaire tiers |
| **Hébergement** | Neon et Render mettent en veille la base et l'API quand elles ne servent pas |
| **Docker** | Images en plusieurs étapes, sans dépendances de développement : images plus légères à construire, stocker et déployer |

---

## 4. Points d'amélioration relevés dans les assets

| Fichier | Poids actuel | Recommandation |
|---|--:|---|
| `apps/web/src/assets/videos/fire.mp4` | 58 Mo | Ne pas l'utiliser dans l'application ; garder la boucle courte |
| `apps/web/src/assets/videos/fire_loop_14s.mp4` | 4,3 Mo | Compresser et réduire la résolution ; vidéo muette, sans lecture automatique sur mobile, désactivée avec `prefers-reduced-motion`, image fixe (`poster`) en attendant. Usage exact **à confirmer** |
| `apps/web/src/assets/fonts/Inter-Variable.ttf` | 854 Ko | Convertir en WOFF2 et ne garder que les caractères latins (environ 10 fois plus léger) |
| `apps/web/src/assets/fonts/Cinzel-Variable.ttf` | 123 Ko | Convertir en WOFF2 |
| `apps/web/src/assets/fonts/icons/Arcane-chronicle.woff` | 33 Ko | Générer aussi un WOFF2 ; retirer de la police les icônes non utilisées |
| `apps/web/src/assets/images_originals_backup/` | 2,3 à 2,9 Mo par PNG | Sources de travail : ne jamais les servir aux utilisateurs |

---

## 5. Objectifs et mesures

| Indicateur | Outil | Objectif (proposition) |
|---|---|---|
| Poids d'une page joueur (premier chargement) | DevTools, EcoIndex | < 1 Mo |
| Nombre de requêtes d'une page joueur | DevTools, EcoIndex | < 40 |
| Score EcoIndex des pages principales | [EcoIndex](https://www.ecoindex.fr/) / GreenIT-Analysis | B ou mieux |
| Performance Lighthouse mobile | Lighthouse | ≥ 90 |

Les mesures sont reportées dans [`resultats-tests.md`](../05-tests/resultats-tests.md) et les rapports rangés dans [`preuves/rapports/`](../preuves/).
