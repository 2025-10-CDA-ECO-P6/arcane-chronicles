# Périmètre MVP — Arcane Chronicles

**Version** : 1.0 — mise à jour du 03/11/2026 (remplace la v0.2 du 03/09/2026)
**Auteur** : Lubin Chauvreau
**Documents liés** : [`resume-mvp.md`](resume-mvp.md), [`use-cases.md`](../../03-conception/use-cases.md), [`03-conception/mcd/`](../../03-conception/mcd/) (MCD, MLD, MPD, `05-database-model-v2.dbml`), périmètres des versions suivantes ([V1.1](perimetre-v1.1.md), [V1.2](perimetre-v1.2.md), [V1.3](perimetre-v1.3.md), [V2](perimetre-v2.md))
**Référence** : le backlog Jira fait foi — [tickets MVP](https://simplon-team-kqd1jwhw.atlassian.net/issues/?jql=project%20%3D%20KAN%20AND%20labels%20%3D%20MVP%20ORDER%20BY%20key%20ASC) (étiquette `MVP`)
**Échéance** : fin avril, environ 5 semaines de développement
**Contexte d'usage de référence** : partie en présentiel, MJ sur ordinateur portable ou tablette, joueurs sur leur téléphone, dés physiques sur la table.

---

## 1. Synthèse

Le MVP d'Arcane Chronicles est un **assistant de préparation et d'animation de campagnes D&D 5e**, pas une table de jeu virtuelle ni un moteur de règles.

Trois promesses :

1. **Un MJ construit une campagne jouable** (chapitres, scènes, personnages, quêtes, objets) en partant de zéro ou d'une campagne du catalogue.
2. **Il anime sa partie depuis un seul écran**, scène par scène, combat compris.
3. **Ses joueurs suivent la partie sur leur téléphone**, sans compte, avec la fiche de leur héros à jour en temps réel.

Le MVP compte **111 tickets** dans Jira (étiquette `MVP`), répartis en 23 epics (§9).

### 1.1 Décisions actées

| # | Décision |
|---|---|
| **D1** | **Dés physiques par défaut.** Les joueurs lancent leurs vrais dés, le MJ applique le résultat. Le lanceur de dés intégré est reporté en V1.1 |
| **D5** | **Personnages prétirés** : le MJ prépare les héros avant la partie et les attribue aux joueurs. Pas de création de personnage par le joueur dans le MVP |
| **D6** | **Pas de compte pour les joueurs.** Ils rejoignent la partie par un lien (code de partie), choisissent un pseudo, et le MJ leur attribue un héros. Seul le MJ a un compte |
| **D11** | **Le MJ saisit l'initiative** de chaque combattant ; l'ordre de tour se trie automatiquement |
| **D12** | **Parcours utilisateur de référence** : page d'accueil visiteur → catalogue → duplication (connexion) → préparation → lancement de la partie → interface MJ desktop / interface joueur mobile → combat |
| **D13** | **Catalogue réduit** : slider de personnages et d'objets sur la page d'accueil, liste des campagnes publiques paginée par 5 |
| **D14** | **Inventaire géré par le MJ** : il ajoute et retire les objets ; le joueur peut seulement utiliser un consommable. Pas de système d'équipement : une seule armure portée |
| **D15** | **Règles simplifiées, esprit « papier »** : effets descriptifs (« 2D4 », « +5 dégâts de poison, 3 fois ») sans calcul automatique ; CA = armure portée (ou 10) + modificateur de DEX ; initiative et perception (« Instinct ») calculées depuis les caractéristiques ; niveau calculé par paliers d'XP mais ajustable par le MJ (+/−) ; PV max tirés avec le dé de vie de la classe à la création puis tous les 5 niveaux ; pas de repos |
| **D16** | **Coffres, énigmes et pièges dans le MVP** (révélés et mis à jour par le MJ pendant la partie) |
| **D17** | **Commerce, partage du butin et récompenses de quête dans le MVP** |
| **D18** | **Carte = simple upload d'image** (chapitre et scène), consultable par le MJ et les joueurs ; un outil de création de carte viendra plus tard |
| **D19** | **PNJ unique ou générique** : un PNJ unique (PNJ de quête, marchand) garde un seul état sur toutes les scènes et tous les chapitres ; un PNJ générique (gardes, monstres) est posé en exemplaires indépendants. L'attitude amical / neutre / hostile persiste |
| **D20** | **Combat simple** : PV ajoutés ou retirés par le MJ (mort = PV à 0), capacités des PNJ consultables, ordre d'initiative, curseur « à qui le tour » et bouton « Suivant ». Pas de rounds |
| **D21** | **Quêtes** : une quête principale de campagne, toujours présente, avec des objectifs différents à chaque chapitre ; des quêtes secondaires propres à un chapitre. Chaque objectif peut viser un élément du jeu et porter une narration ; le MJ valide les objectifs à la main |
| **D22** | **Bibliothèque du MJ** : objets, capacités et effets appartiennent au MJ, pas à une campagne. Publier une campagne publie automatiquement les éléments qu'elle utilise (message à valider) |
| **D23** | **Persistance** : l'état de jeu (PV, morts, objectifs, stocks, coffres) est stocké sur les éléments de la campagne ; une partie reprise des mois plus tard repart de la scène où le groupe s'était arrêté |
| **D24** | **Notes privées du MJ par chapitre**, lisibles pendant toute la session |

---

## 2. Ce que le MVP doit prouver

| # | Hypothèse | Mise à l'épreuve | Indicateur |
|---|---|---|---|
| H1 | Un MJ préfère partir de contenu existant plutôt que de tout créer | Catalogue et duplication de campagne dès la page d'accueil | ≥ 70 % des campagnes créées partent d'une duplication ou importent du contenu |
| H2 | La préparation structurée fait gagner du temps | Campagne → chapitres → scènes → contenus | Un MJ débutant prépare une campagne jouable en < 45 min |
| H3 | Un MJ accepte d'animer sa partie depuis l'application | Interface MJ en un seul écran | ≥ 50 % des campagnes donnent lieu à au moins une partie |
| H4 | Les joueurs utilisent la fiche mobile pendant la partie | Interface joueur mobile synchronisée | ≥ 60 % des joueurs ouvrent leur fiche pendant la partie |
| H5 | L'outil remplace les documents éparpillés | Notes, quêtes, PNJ et combat centralisés | < 30 % des MJ gardent un autre outil ouvert |
| H6 | Le MJ revient | Reprise d'un chapitre là où il s'était arrêté | ≥ 40 % des MJ lancent une 2ᵉ partie dans les 30 jours |

---

## 3. Personas

| Persona | Besoin dominant | Ce que le MVP lui apporte | Couverture |
|---|---|---|---|
| **Rémi** — MJ expérimenté débordé | Préparer vite, réduire la charge mentale en partie | Interface MJ en un écran, combat simple, notes de chapitre | Forte |
| **Emma** — MJ débutante | Être guidée, ne pas partir d'une page blanche | Catalogue, duplication de campagne, règles simplifiées | Forte |
| **Julien** — MJ vétéran créateur | Créer, archiver, publier | Bibliothèque personnelle d'objets, capacités et effets ; publication communautaire en V1.1 | Partielle |

Point d'attention : il n'existe toujours pas de **persona joueur**, alors que l'interface mobile est la moitié de l'expérience en partie.

---

## 4. Positionnement

| Le MVP est | Le MVP n'est pas |
|---|---|
| Un assistant de préparation narrative | Un wiki de worldbuilding |
| Un écran de pilotage de partie | Une table virtuelle avec grille, pions et brouillard de guerre |
| Un compagnon de personnage mobile | Un moteur de règles qui calcule et arbitre |
| Un catalogue de contenu prêt à l'emploi | Une place de marché |

Règle d'arbitrage : **si une fonctionnalité oblige à ouvrir le manuel des règles pour être codée, elle sort du MVP.** Le MJ reste l'arbitre ; l'application est sa mémoire et son tableau de bord.

---

## 5. Périmètre MVP

### 5.1 Bloc A — Découverte et catalogue (sans compte)

- Page d'accueil visiteur : hero, slider de personnages, slider d'objets
- Liste des campagnes publiques (pagination par 5), détail d'une campagne, bouton « Dupliquer » (connexion puis retour à la duplication)
- Consultation et import de personnages, objets, quêtes et contenus du catalogue

Tickets : KAN-528, KAN-526, KAN-130, KAN-131, KAN-136, KAN-140, KAN-143, KAN-144, KAN-147, KAN-160, KAN-163, KAN-187, KAN-174

### 5.2 Bloc B — Préparation de la campagne (MJ)

- **Campagne** : créer, modifier, supprimer, décrire ; dupliquer une campagne du catalogue ; quête principale créée automatiquement
- **Chapitres et scènes** : créer, ordonner, narration du chapitre et de chaque scène, carte uploadée
- **Personnages** : fiche commune héros / PNJ / monstres ; compétences et capacités reprises de la race, de la classe et de l'historique ; PNJ unique ou générique ; association aux scènes et groupes (Commerce, Gardes, Ennemis…)
- **Bibliothèque du MJ** : objets (dont armures et consommables), capacités, effets descriptifs
- **Quêtes** : principale de campagne et secondaires de chapitre, objectifs ciblant un élément du jeu, narration d'objectif, récompenses (XP, or, objets, texte)
- **Coffres, énigmes et pièges** placés dans les scènes ; butin attaché à une scène

Tickets : KAN-36, KAN-40, KAN-48, KAN-52, KAN-56, KAN-57, KAN-61, KAN-73, KAN-77, KAN-78, KAN-81, KAN-83, KAN-84, KAN-86, KAN-88 à KAN-93, KAN-100, KAN-104, KAN-107, KAN-115, KAN-118, KAN-122, KAN-126, KAN-522, KAN-534, KAN-535, KAN-536

### 5.3 Bloc C — Partie en direct (MJ)

- **Lancement** : choisir le chapitre, code et lien de partie, voir les joueurs connectés et prêts, attribuer les héros par glisser-déposer, terminer la partie ; reprendre un chapitre en cours
- **Interface MJ en un seul écran** : narration du chapitre puis de la scène, navigation entre scènes, cartes joueurs ouvrant une modale (PV, armure, inventaire), PNJ et monstres (PV, attitude, tuer), quêtes et validation des objectifs, notes privées, coffres / énigmes / pièges, carte
- **Révélation contrôlée** : le MJ décide ce que voient les joueurs
- **Combat** : notification aux joueurs, initiative, ordre de tour, curseur et bouton « Suivant », PV des héros et des PNJ, capacités des PNJ
- **Commerce, butin, récompenses** : vendre et acheter auprès d'un marchand, distribuer le butin, répartir les récompenses de quête

Tickets : KAN-45, KAN-46, KAN-189 à KAN-195, KAN-197, KAN-517, KAN-198 à KAN-201, KAN-202, KAN-203 à KAN-210, KAN-511, KAN-513, KAN-514, KAN-523, KAN-529, KAN-533, KAN-249 à KAN-254

### 5.4 Bloc D — Interface joueur mobile

- Entrée sans compte par lien, pseudo, attente de l'attribution du héros
- Fiche : profil, inventaire, compétences, quêtes, carte de la scène
- PV en temps réel, utilisation d'un consommable
- Quêtes, objectifs, progression, quête terminée
- Interface de combat : ordre d'initiative, son tour, PV de son héros et de ses alliés

Tickets : KAN-223, KAN-231, KAN-509, KAN-233 à KAN-235, KAN-239, KAN-532, KAN-515, KAN-530, KAN-240, KAN-244 à KAN-248

### 5.5 Bloc E — Temps réel et socle

- Synchronisation MJ ↔ joueurs : scène, PV, ordre de tour, inventaires, quêtes, coffres, énigmes, pièges
- Inscription, connexion, déconnexion du MJ ; tableau de bord ; messages d'erreur et confirmation des suppressions ; rôles et étanchéité MJ / joueurs côté serveur

Tickets : KAN-211, KAN-212, KAN-218 à KAN-220, KAN-512, KAN-516, KAN-531, KAN-25, KAN-26, KAN-27, KAN-33, KAN-34, KAN-176, KAN-177

---

## 6. Le moteur de partie minimal — six briques

| # | Brique | Ce qu'elle fait | Où dans le MVP |
|---|---|---|---|
| B1 | État de partie partagé | Scène active, joueurs connectés, héros attribués | Sessions, `games` / `participants` |
| B2 | Révélation contrôlée | Le MJ décide élément par élément ce que voient les joueurs | Permissions et visibilité |
| B3 | Compteurs vivants | PV des héros et des PNJ, modifiables en un geste, synchronisés | Interface MJ, temps réel |
| B4 | Avancement narratif | Objectifs validés, changement de scène, butin et récompenses | Quêtes, butin, commerce |
| B5 | Ordre de tour | Initiative, curseur et bouton « Suivant » | Combat |
| B6 | Persistance | Tout l'état survit à la partie ; reprise à la scène où l'on s'est arrêté | Modèle de données (D23) |

**Scénario de recette** : créer ou dupliquer une campagne courte, lancer la partie, faire entrer deux joueurs par lien, leur attribuer un héros, jouer une scène avec un PNJ marchand et un combat, ouvrir un coffre, distribuer le butin, valider un objectif, terminer la partie, la reprendre et constater que tout a été conservé. Tant qu'une étape oblige à sortir de l'application, le MVP n'est pas fini.

---

## 7. Modèle de données

Le modèle v2 (38 tables, 14 énumérations, PostgreSQL / Prisma) est dans [`03-conception/mcd/`](../../03-conception/mcd/) : MCD, MLD et MPD global et par fonctionnalité, et le code DBML `05-database-model-v2.dbml`. Les valeurs calculées (modificateurs, CA, initiative, Instinct, progression, ordre de tour, mort) ne sont pas stockées.

---

## 8. Ce qui sort du MVP

| Reporté | Substitut dans le MVP | Version |
|---|---|---|
| Lanceur de dés intégré | Dés physiques | V1.1 |
| Création de personnage par le joueur, équipement, compteurs de ressources, états | Héros prétirés par le MJ, une armure portée, capacités avec utilisations gérées par le MJ | V1.1 |
| Publication communautaire, favoris, recherche dans la bibliothèque | Catalogue en lecture et duplication | V1.1 |
| Verrouiller la session, expulser, QR code, réaffecter un héros | Lien de partie | V1.1 |
| Recherche dans la campagne | Navigation par chapitres et scènes | V1.1 |
| Historique et progression de chapitre | Progression calculée à partir des objectifs | V1.1 |
| Images de campagne / chapitre / scène, liens entre scènes, mise à jour de carte en temps réel | Carte uploadée, ordre des scènes | V1.2 |
| Effets appliqués automatiquement | Effets descriptifs, le MJ applique | V1.2 |
| Édition avancée de chapitres et de quêtes | Gestion de base | V1.3 |
| Cartes interactives (repères, zones, sorties, brouillard de guerre) | Carte uploadée en image | V1.3 |
| Contenus premium et paiement | Catalogue gratuit | V2 |
| Assistant IA (conception et partie) | Le MJ prépare et mène seul | V2 |

---

## 9. Volumétrie

| Epic | Tickets MVP |
|---|--:|
| Authentification | 3 |
| Navigation | 3 |
| Campagnes | 5 |
| Chapitres | 4 |
| Scènes | 14 |
| Personnages | 3 |
| Objets | 1 |
| Effets | 1 |
| Quêtes | 2 |
| Énigmes | 1 |
| Pièges | 1 |
| Coffres | 1 |
| Bibliothèque | 12 |
| Interface | 2 |
| Sessions | 9 |
| Interface de jeu MJ | 19 |
| Temps réel | 8 |
| Interface joueur | 2 |
| Création personnage joueur | 2 |
| Inventaire joueur | 5 |
| Vue scène joueur | 2 |
| Quêtes joueur | 5 |
| Permissions et visibilité | 6 |
| **Total** | **111** |

**Point d'alerte sur la charge.** Le MVP est passé de 86 à 111 tickets avec les décisions D16 à D18 et D22. À raison de 0,5 à 1,5 jour par ticket, cela représente plusieurs mois de travail pour une personne, même avec Claude Code pour accélérer. Pour tenir les 5 semaines, il faudra fusionner des tickets proches (par exemple les CRUD associés / retirés, les vues MJ) et garder une liste de coupe prête : carte, coffres / énigmes / pièges, commerce, dans cet ordre.

---

## 10. Points à trancher

| # | Question |
|---|---|
| **D8** | La v0.2 prévoyait de poser la notion de « système de jeu » dès le MVP. Le modèle v2 est D&D 5e uniquement, sans cette notion : à confirmer |
| P1 | Définir un persona joueur avant de figer l'interface mobile |
| P2 | KAN-45 et KAN-46 (« associer / consulter les joueurs d'une campagne ») datent d'avant la décision D6 : à reformuler (joueurs d'une partie) ou à retirer |
| P3 | KAN-130 parle encore de « ressources créées par la communauté » alors que la publication est en V1.1 : description à corriger |
| P4 | Neuf tickets marqués « [À SUPPRIMER] » (KAN-53, 54, 55, 213 à 217, 221) restent à supprimer dans Jira |
| P5 | Personas des nouveaux use cases à valider (voir `use-cases.md`) |
| P6 | Contenu de départ à produire : campagne courte à dupliquer, héros prétirés, contenu D&D officiel (SRD, licence CC-BY-4.0, attribution obligatoire) |

---

## 11. Après le MVP

| Version | Contenu | Détail |
|---|---|---|
| V1.1 | Bibliothèque communautaire, confort de session, création de personnage par le joueur, lanceur de dés, historique | [`perimetre-v1.1.md`](perimetre-v1.1.md) |
| V1.2 | Images, liens entre scènes, effets appliqués, mise à jour de carte | [`perimetre-v1.2.md`](perimetre-v1.2.md) |
| V1.3 | Édition avancée des chapitres et des quêtes, cartes interactives | [`perimetre-v1.3.md`](perimetre-v1.3.md) |
| V2 | Contenus premium avec paiement intégré, assistant IA | [`perimetre-v2.md`](perimetre-v2.md) |

---

## Sources

- [SRD 5.2.1 — System Reference Document, D&D Beyond](https://www.dndbeyond.com/srd)
- [System Reference Document 5.2.1 — informations légales (PDF)](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.pdf)
