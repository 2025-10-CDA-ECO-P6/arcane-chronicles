# Périmètre V1.1 — Arcane Chronicles

**Mise à jour** : 03/11/2026 · **Référence** : [tickets V1.1 dans Jira](https://simplon-team-kqd1jwhw.atlassian.net/issues/?jql=project%20%3D%20KAN%20AND%20labels%20%3D%20%22V1.1%22%20ORDER%20BY%20key%20ASC) (81, étiquette `V1.1`) · résumé : [`resume-v1.1.md`](resume-v1.1.md) · version précédente : [MVP](perimetre-mvp.md)

## 1. Objectif

Ouvrir la bibliothèque à la communauté, donner plus de contrôle au MJ sur ses sessions et plus d'autonomie aux joueurs. Déclencheur : les MJ jouent et reviennent (hypothèses H3 et H6 du MVP validées).

## 2. Contenu

### 2.1 Bibliothèque communautaire (45 tickets)

- Publier, dépublier, retirer et voir le statut de publication : campagnes, personnages, objets, effets, quêtes, coffres, énigmes, pièges
- Consulter les campagnes publiées et les campagnes complètes, importer une campagne complète
- Importer pièges, coffres, énigmes et effets ; dupliquer un contenu importé pour le personnaliser
- Rechercher, filtrer par catégorie et par type, trier ; favoris ; « Mes contenus »
- Accès à la bibliothèque depuis le menu principal

Tickets : KAN-35, KAN-132 à KAN-135, KAN-137 à KAN-139, KAN-141, KAN-142, KAN-145, KAN-146, KAN-148 à KAN-159, KAN-161, KAN-162, KAN-164 à KAN-173, KAN-178, KAN-180 à KAN-186, KAN-188

### 2.2 Contrôle des sessions (8 tickets)

- Verrouiller la session, expulser un participant, réaffecter un héros, afficher un QR code
- Le joueur peut quitter la session
- Activer le lanceur de dés intégré (et lancer un dé côté joueur)
- Retirer un joueur d'une campagne

Tickets : KAN-196, KAN-518, KAN-519, KAN-524, KAN-525, KAN-527, KAN-520, KAN-47

### 2.3 Personnage du joueur (11 tickets)

- Créer son personnage à la première connexion (race, classe, informations personnelles), le modifier
- Consulter caractéristiques, compétences et états
- Compteurs de ressources nommés (emplacements de sorts, capacités limitées)
- Équiper / déséquiper un objet

Tickets : KAN-224 à KAN-230, KAN-232, KAN-510, KAN-237, KAN-238

### 2.4 Suivi de campagne et confort MJ (17 tickets)

- Notes narratives de chapitre (indices, conseils)
- Progression, statut, historique d'un chapitre ; historique des modifications faites en session
- Consulter les quêtes de la campagne
- Rechercher dans toute la campagne
- Retirer personnages et monstres d'une scène, associer un personnage à une scène, importer un personnage depuis sa bibliothèque
- Contrôler les éléments visibles ; changement de scène automatique côté joueur
- Mot de passe oublié, gestion du profil et suppression du compte, message de confirmation après une action

Tickets : KAN-63, KAN-69 à KAN-72, KAN-222, KAN-49, KAN-521, KAN-85, KAN-87, KAN-103, KAN-105, KAN-242, KAN-243, KAN-28, KAN-30, KAN-175

## 3. Volumétrie

| Epic | Tickets |
|---|--:|
| Bibliothèque | 44 |
| Création personnage joueur | 9 |
| Sessions | 6 |
| Chapitres | 5 |
| Campagnes | 2 |
| Scènes | 2 |
| Personnages | 2 |
| Inventaire joueur | 2 |
| Vue scène joueur | 2 |
| Authentification, Compte utilisateur, Navigation, Interface, Interface de jeu MJ, Temps réel, Interface joueur | 1 chacun (7) |
| **Total** | **81** |

## 4. Impact sur le modèle de données

Le modèle v2 prévoit déjà `is_public` sur campagnes, objets, capacités et effets, et la publication d'une campagne entraîne celle de ses éléments. À ajouter : favoris, historique de session, compteurs de ressources, états d'un personnage, verrouillage de session.

## 5. Points à trancher

- **Doublons de publication** : KAN-138 / KAN-139 / KAN-185 (V1.1) et KAN-42 / KAN-43 / KAN-44 (V1.2) décrivent tous la publication d'une campagne.
- **Création de personnage par le joueur** : suppose un compte joueur ou un personnage lié à la session (décision D6 du MVP à revoir).
- **Équipement** (KAN-237 / KAN-238) : le MVP a remplacé l'équipement par une armure portée ; à garder ou à retirer.
