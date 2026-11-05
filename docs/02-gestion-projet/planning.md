# Planning — Arcane Chronicles

**Mise à jour** : 03/11/2026
**Documents liés** : [`organisation.md`](organisation.md), [périmètre du MVP](perimetre/perimetre-mvp.md), [Jira KAN](https://simplon-team-kqd1jwhw.atlassian.net/browse/KAN)

> Les dates marquées **à compléter** ne sont pas encore fixées. Le découpage par semaine (§3) est une **proposition à valider**.

---

## 1. Jalons

| Jalon | Date | Statut |
|---|---|---|
| Expression du besoin, personas, cahier des charges v1.1 | 04/09/2026 | Fait |
| Backlog Jira (epics, user stories, versions MVP → V2) | 09/2026 | Fait |
| Maquettes Figma et page de composants | à compléter | Fait |
| Modèle de données v2 (MCD, MLD, MPD, DBML) | 03/11/2026 | Fait |
| Cahier des charges v2 (fonctionnel et technique) | 03/11/2026 | Fait |
| Début du développement | **à compléter** | À venir |
| Rendu du MVP | **fin avril (date exacte à compléter)** | À venir |
| Passage du titre CDA | **à compléter** | À venir |

---

## 2. Versions

| Version | Contenu | Tickets | Échéance |
|---|---|--:|---|
| **MVP** | Découverte, préparation, partie en direct (MJ + joueurs mobiles), combat, quêtes, coffres / énigmes / pièges, commerce | 111 | Fin avril |
| **V1.1** | Bibliothèque communautaire, recherche, confort de session, lanceur de dés, création de personnage par le joueur, équipement, historique | 81 | Après le MVP |
| **V1.2** | Images, liens entre scènes, effets appliqués | 16 | Après la V1.1 |
| **V1.3** | Édition avancée des chapitres et des quêtes, cartes interactives (outil de création, carte en direct chez les joueurs) | 10 + cartes à créer | Après la V1.2 |
| **V2** | Contenus premium avec paiement intégré, assistant IA (conception de campagne et aide en partie) | à créer | Après la V1.3 |

Le détail de chaque version est dans [`perimetre/`](perimetre/) (`perimetre-*.md` et `resume-*.md`).

---

## 3. Découpage du MVP en 5 semaines (proposition)

L'ordre suit les dépendances : rien ne se joue sans le socle et la préparation, et la partie en direct (la fonctionnalité principale) doit être jouable de bout en bout avant d'ajouter les éléments de la liste de coupe.

| Semaine | Objectif | Epics Jira | Livrable vérifiable |
|---|---|---|---|
| **S1 — Socle** | Monorepo, Docker, base, authentification | Authentification, Navigation, Interface | `docker compose up` lance web + api + base ; un MJ s'inscrit et se connecte ; CI verte |
| **S2 — Préparation** | Le MJ prépare une campagne complète | Campagnes, Chapitres, Scènes, Personnages, Objets, Effets, Bibliothèque | Une campagne avec chapitres, scènes, PNJ et héros prétirés ; données D&D de référence chargées (seed) |
| **S3 — Partie en direct** | Lancer une partie et la piloter | Sessions, Temps réel, Permissions et visibilité, Interface de jeu MJ | Deux joueurs rejoignent par lien, reçoivent leur héros, voient les PV changer en temps réel ; aucune donnée secrète ne leur parvient |
| **S4 — Combat, quêtes, joueur** | Ce que vivent les joueurs | Interface de jeu MJ (combat), Quêtes, Quêtes joueur, Interface joueur, Inventaire joueur, Vue scène joueur | Combat complet avec « Suivant » ; objectif validé ; fiche mobile à jour |
| **S5 — Compléments et recette** | Liste de coupe, tests, mise en ligne | Coffres, Énigmes, Pièges, commerce et butin | Scénario de recette du MVP réussi en production ; tests end-to-end verts |

**Liste de coupe** (si le retard dépasse quelques jours, dans cet ordre) : carte, puis coffres / énigmes / pièges, puis commerce.

---

## 4. Suivi

- L'avancement réel se lit dans Jira (tableau et versions).
- Chaque fin de semaine : point sur le livrable de la semaine, mise à jour de ce tableau et de la liste de coupe.
- Les captures du tableau Jira et des livrables sont rangées dans [`preuves/captures/`](../preuves/).

| Semaine | Prévu | Réalisé | Écart et décision |
|---|---|---|---|
| S1 | Socle | à compléter | |
| S2 | Préparation | à compléter | |
| S3 | Partie en direct | à compléter | |
| S4 | Combat, quêtes, joueur | à compléter | |
| S5 | Compléments et recette | à compléter | |
