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
| **Vidéo de fond** | Une seule boucle courte (14 s) et compressée (2,6 Mo en AV1, 3,5 Mo en H.264 pour les navigateurs qui ne lisent pas l'AV1), muette, dans un composant unique (`BackgroundVideo`) utilisé par les pages de connexion et d'inscription et par la bannière de l'accueil ; jamais téléchargée sur mobile ni quand l'utilisateur demande moins d'animations, où une image fixe de 17 Ko la remplace (détail ci-dessous) |
| **Session** | Le `proxy` de Next ne fait aucun appel réseau : il lit seulement la date d'expiration du jeton. Pour un utilisateur connecté, un seul appel `GET /api/auth/me` par page, partagé entre le layout et la page (`cache` de React), et aucun pour un visiteur sans cookie. Contrepartie assumée : les pages sont rendues à chaque requête (lecture du cookie), pour afficher une session toujours à jour |
| **Thème sombre** | Fond `#080808` : moins d'énergie consommée sur les écrans OLED des téléphones |
| **Pas de traceurs** | Aucun outil d'analyse ni script publicitaire tiers |
| **Hébergement** | Neon met la base en veille quand elle ne sert pas ; l'API Render est maintenue éveillée par un ping toutes les 10 minutes, un compromis assumé entre disponibilité pour les démonstrations et sobriété : intervalle le plus long qui garde une marge avant la mise en veille (15 minutes), soit deux fois moins de requêtes qu'un ping toutes les 5 minutes ; la route pingée ne lit pas la base, qui reste en veille ; une seule petite instance gratuite |
| **Docker** | Images en plusieurs étapes, sans dépendances de développement : images plus légères à construire, stocker et déployer |

### Vidéo de fond : codec, conteneur et version de secours

Un fichier vidéo combine deux choses :

- **le codec** : la façon dont les images sont compressées (H.264, AV1, VP9…). C'est lui qui fixe le rapport entre qualité et poids ;
- **le conteneur** : la « boîte » qui range la vidéo et ses métadonnées (durée, pistes…). C'est lui qui donne l'extension du fichier (`.mp4`, `.webm`…).

`fire-av1.mp4` est donc un conteneur MP4 qui contient une vidéo compressée en AV1, et `fire.mp4` un conteneur MP4 qui contient une vidéo en H.264. Il n'existe pas de fichier `.av1` pour le web : l'AV1 est toujours rangé dans un conteneur. Le MP4 a été choisi plutôt que le WebM parce que Safari lit mieux l'AV1 dans ce conteneur.

L'AV1 compresse beaucoup mieux que le H.264 : pour la même boucle en 1080p, 2,6 Mo au lieu de 3,5 Mo, avec une qualité comparable. Mais tous les navigateurs ne le lisent pas : Chrome, Edge et Firefox oui ; Safari seulement sur les appareils équipés d'un décodeur AV1 matériel (Mac M3 et plus récents, iPhone 15 Pro et plus récents). Le composant propose donc deux `<source>` :

```tsx
<source src="/videos/fire-av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' media={VIDEO_MEDIA} />
<source src="/videos/fire.mp4" type="video/mp4" media={VIDEO_MEDIA} />
```

Le navigateur prend la **première** source qu'il sait lire et ne télécharge qu'elle : la plupart des visiteurs reçoivent la version AV1, les autres la version H.264. Garder les deux ne coûte rien en bande passante, seulement 3,5 Mo de plus dans le dépôt.

L'attribut `type` précise le conteneur (`video/mp4`) **et** le codec (`codecs="av01…"`). Sans la partie `codecs`, un navigateur qui ne lit pas l'AV1 croirait pouvoir lire le fichier, puisqu'il connaît le MP4 : il le téléchargerait pour rien avant d'échouer.

---

## 4. Points d'amélioration relevés dans les assets

| Fichier | Poids actuel | Recommandation |
|---|--:|---|
| `apps/web/src/assets/videos/fire.mp4` | 58 Mo | **Fait** : retiré des assets, seule la boucle courte est gardée |
| `apps/web/src/assets/videos/fire_loop_14s.mp4` | 4,3 Mo | **Fait** : fichier source de travail, jamais servi. La version servie reprend toute la boucle, en 1080p sans piste audio : `apps/web/public/videos/fire-av1.mp4` en AV1 (2,6 Mo, −40 %), proposée en premier, et `apps/web/public/videos/fire.mp4` en H.264 (3,5 Mo) pour les navigateurs qui ne lisent pas l'AV1, avec une image fixe `fire-poster.webp` (17 Ko). Une boucle plus courte (8,3 s) a été testée : plus légère, mais son raccord était moins fluide. Elle sert de fond aux pages de connexion et d'inscription et n'est téléchargée que sur un écran d'au moins 768 px sans `prefers-reduced-motion` (attribut `media` de `<source>`) ; sinon seule l'image fixe s'affiche |
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
