# Périmètre V1.3 — Arcane Chronicles

**Mise à jour** : 05/11/2026 · **Référence** : [tickets V1.3 dans Jira](https://simplon-team-kqd1jwhw.atlassian.net/issues/?jql=project%20%3D%20KAN%20AND%20labels%20%3D%20%22V1.3%22%20ORDER%20BY%20key%20ASC) (10, étiquette `V1.3`) · résumé : [`resume-v1.3.md`](resume-v1.3.md) · version précédente : [V1.2](perimetre-v1.2.md)

## 1. Objectif

Faire évoluer facilement une campagne déjà en cours, et rendre l'exploration des lieux interactive pour le MJ comme pour les joueurs.

## 2. Contenu

### 2.1 Édition avancée des chapitres et des quêtes (10 tickets)

- Modifier la narration, l'image, la carte et les notes d'un chapitre — KAN-58, KAN-60, KAN-62, KAN-64
- Associer, consulter, modifier et retirer des quêtes au niveau d'un chapitre — KAN-65 à KAN-68
- Modifier et retirer des quêtes au niveau de la campagne — KAN-50, KAN-51

### 2.2 Cartes interactives (tickets à créer)

Prolonge les cartes de scène (MVP) et les liens entre scènes (V1.2) : la carte devient un support de jeu, et non plus une simple image.

**Outil de création (MJ)**

- Importer un fond de carte (image) ou partir d'un fond uni, régler son échelle
- Poser des repères sur la carte : PNJ et monstres de la scène, coffres, pièges, énigmes, objets, points d'intérêt libres
- Dessiner des zones (pièces, couloirs, zones dangereuses) et les nommer
- Placer des sorties reliées aux scènes connectées (liens de la V1.2) : cliquer une sortie ouvre la scène suivante
- Recouvrir la carte d'un brouillard de guerre, découvert zone par zone pendant la partie
- Associer chaque repère à l'élément de la scène qu'il représente (le repère d'un coffre ouvre le coffre)

**Carte interactive en partie**

- MJ : révéler une zone, un repère ou une sortie d'un geste ; déplacer les repères (position du groupe, d'un PNJ)
- Joueurs : voir sur leur mobile la carte telle que le MJ l'a révélée, mise à jour en temps réel ; zoom et déplacement au doigt ; toucher un repère révélé affiche son nom et sa description publique
- Les éléments non révélés ne sont jamais envoyés aux joueurs (RG2), même cachés sous le brouillard

**Hors périmètre** : la carte n'est pas une grille tactique. Pas de déplacement case par case, de portée, de ligne de vue ni de règles de mouvement en combat, conformément au cahier des charges (« esprit papier »).

## 3. Volumétrie

| Epic | Tickets |
|---|--:|
| Chapitres | 8 |
| Campagnes | 2 |
| Cartes interactives | à créer |
| **Total** | **10 + cartes interactives** |

## 4. Impact sur le modèle et l'architecture

- **Données** : une table des éléments de carte par scène (type, position, taille, forme pour une zone, élément lié — créature posée, coffre, piège, énigme, objet ou scène de destination —, état révélé) ; le réglage de la carte (échelle, brouillard actif) sur la scène. Les sorties s'appuient sur la table des liens entre scènes de la V1.2.
- **Temps réel** : nouveaux événements Socket.io, par exemple `map:reveal` (zone ou repère révélé) et `map:move` (repère déplacé), filtrés côté serveur comme les autres révélations.
- **Front** : rendu de carte en canvas ou SVG (bibliothèque à choisir, par exemple Konva), utilisable au doigt sur mobile 375 px.
- **Dépendances** : cartes de scène (MVP), liens entre scènes (V1.2).
