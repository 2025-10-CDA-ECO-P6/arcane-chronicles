# Spécifications fonctionnelles — Arcane Chronicles

**Mise à jour** : 03/11/2026
**Documents liés** : [cahier des charges fonctionnel](../01-contexte/cahier-des-charges.md#1-cahier-des-charges-fonctionnel), [use cases détaillés](use-cases.md), [maquettes](maquettes/), [modèles de données](mcd/), [Jira KAN](https://simplon-team-kqd1jwhw.atlassian.net/browse/KAN)

---

## 1. Acteurs

| Acteur | Description |
|---|---|
| **Visiteur** | Personne non connectée qui découvre le site et le catalogue |
| **MJ** | Utilisateur avec un compte ; prépare ses campagnes et pilote ses parties |
| **Joueur** | Participant d'une partie, sans compte, identifié par un pseudo et un jeton de reconnexion |

---

## 2. Use cases

Le détail (description, ce que permet le use case, personas, tickets Jira) est dans [`use-cases.md`](use-cases.md).

| # | Use case | Acteur | Version |
|---|---|---|---|
| UC1 | Découvrir le produit et le catalogue sans compte | Visiteur | MVP |
| UC2 | Créer un compte et se connecter | MJ | MVP |
| UC3 | Créer une campagne | MJ | MVP |
| UC4 | Organiser une campagne en chapitres et scènes | MJ | MVP |
| UC5 | Créer et gérer les personnages (héros prétirés, PNJ, monstres) | MJ | MVP |
| UC6 | Gérer sa bibliothèque d'objets, de capacités et d'effets | MJ | MVP |
| UC7 | Préparer et suivre les quêtes | MJ | MVP |
| UC8 | Préparer coffres, énigmes et pièges | MJ | MVP |
| UC9 | Lancer une partie et accueillir les joueurs | MJ, Joueur | MVP |
| UC10 | Piloter la partie depuis l'interface MJ | MJ | MVP |
| UC11 | Gérer les combats | MJ, Joueur | MVP |
| UC12 | Commerce, butin et récompenses de quête | MJ, Joueur | MVP |
| UC13 | Jouer depuis son mobile | Joueur | MVP |
| UC14 | Synchroniser la partie en temps réel | MJ, Joueur | MVP |
| UC15 à UC21 | Partage, recherche, sessions, dés, création de personnage, historique, suivi de scène | — | V1.1 |
| UC22 à UC24 | Images, liens entre scènes, effets appliqués | — | V1.2 |
| UC25 | Faire évoluer chapitres et quêtes | — | V1.3 |
| UC26 | Créer et utiliser une carte interactive | MJ, Joueur | V1.3 |
| UC27 | Acheter des contenus premium | MJ | V2 |
| UC28 | Concevoir une campagne avec l'assistant IA | MJ | V2 |
| UC29 | Être assisté par l'IA pendant la partie | MJ | V2 |

---

## 3. Matrice des droits

| Action | Visiteur | MJ propriétaire | Autre MJ | Joueur de la partie |
|---|:-:|:-:|:-:|:-:|
| Voir l'accueil, le catalogue, une campagne publique | ✓ | ✓ | ✓ | ✓ |
| Dupliquer une campagne publique | après connexion | ✓ | ✓ | — |
| Créer, modifier, supprimer une campagne et son contenu | — | ✓ | — | — |
| Gérer sa bibliothèque (objets, capacités, effets) | — | ✓ | — | — |
| Lancer, piloter, terminer une partie | — | ✓ | — | — |
| Lire les notes du MJ, les solutions, le contenu caché | — | ✓ | — | — |
| Rejoindre une partie par son code | — | — | — | ✓ |
| Voir sa fiche, son inventaire, ses quêtes | — | ✓ | — | ✓ (son héros) |
| Voir les éléments révélés | — | ✓ | — | ✓ |
| Utiliser un consommable | — | ✓ | — | ✓ (son héros) |

Chaque ligne est vérifiée côté serveur, pour les routes REST comme pour les événements temps réel.

---

## 4. Règles de gestion

Les règles RG1 à RG9 de la fonctionnalité principale sont dans le [cahier des charges §1.1.2](../01-contexte/cahier-des-charges.md). Les règles ci-dessous les complètent.

| # | Règle |
|---|---|
| RG10 | Une campagne contient des chapitres (un chapitre = une session de jeu), un chapitre contient des scènes |
| RG11 | Une campagne publique peut être dupliquée par un MJ connecté ; la copie lui appartient et garde un lien vers l'original |
| RG12 | Publier une campagne publie les objets, capacités et effets qu'elle utilise (message de confirmation) |
| RG13 | Les compétences et capacités d'un personnage sont reprises de sa race, de sa classe et de son historique |
| RG14 | Un personnage porte au plus une armure |
| RG15 | L'inventaire est géré par le MJ ; le joueur peut seulement utiliser un consommable |
| RG16 | Un objectif peut viser un personnage, une énigme, un coffre, un objet, un piège ou une scène |
| RG17 | Un code de partie donne accès à une seule partie ; le jeton du joueur n'est valable que pour cette partie |
| RG18 | Les tentatives de connexion et d'entrée dans une partie sont limitées dans le temps |
| RG19 | Le contenu D&D officiel provient du SRD 5.2.1 (CC-BY-4.0) et affiche la mention d'attribution |

---

## 5. Valeurs calculées (non stockées)

| Valeur | Calcul |
|---|---|
| Modificateur de caractéristique | ⌊(valeur − 10) / 2⌋ |
| Classe d'armure | CA de l'armure portée, ou 10 sans armure, + modificateur de DEX |
| Initiative | Modificateur de DEX ; la valeur jouée est saisie par le MJ après le jet de dé |
| Perception (« Instinct ») | Calculée depuis les caractéristiques |
| Niveau | Palier d'XP du SRD (300 XP → niv. 2, 900 → 3, 2 700 → 4, 6 500 → 5…), ajustable par le MJ (+/−) |
| PV max | Tirés avec le dé de vie de la classe à la création, puis tous les 5 niveaux |
| Mort | PV = 0 |
| Ordre de tour | Initiative décroissante, égalité départagée par la DEX ; les morts sont sautés |
| Progression d'une quête / d'un chapitre | Objectifs validés / objectifs totaux |

---

## 6. Parcours de référence

Accueil visiteur → catalogue → duplication (connexion) → préparation → lancement de la partie → interface MJ desktop / interface joueur mobile → combat → récompenses → fin de partie → reprise.
