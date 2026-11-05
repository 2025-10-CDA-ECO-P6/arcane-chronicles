# Use Cases — Arcane Chronicles

# MVP — Premier rendu (fin avril)

Ces use cases constituent le cœur du produit : préparer une campagne, puis la jouer en direct avec ses joueurs.

---

# 1. Découvrir le produit et le catalogue sans compte

## Version
MVP

## Description
Le visiteur découvre l'application depuis la page d'accueil et parcourt le catalogue avant de créer un compte.

## Ce que permet le use case
- Page d'accueil visiteur (hero, slider de personnages, slider d'objets)
- Liste des campagnes publiques, paginée par 4
- Détail d'une campagne du catalogue
- Bouton « Dupliquer » qui mène à la connexion puis revient à la duplication

## Personas concernés
- Emma → découvrir du contenu existant
- Julien → (à valider)

## Tickets Jira
KAN-528, KAN-526, KAN-130, KAN-131, KAN-136

---

# 2. Créer un compte et se connecter (MJ)

## Version
MVP

## Description
Le MJ crée son compte et accède à son tableau de bord. Les joueurs n'ont pas de compte.

## Ce que permet le use case
- Inscription, connexion, déconnexion
- Tableau de bord avec la liste de ses campagnes

## Personas concernés
- Emma, Rémi, Julien (à valider)

## Tickets Jira
KAN-25, KAN-26, KAN-27, KAN-33, KAN-34

---

# 3. Créer une campagne

## Version
MVP

## Description
Le MJ crée une campagne depuis zéro ou en dupliquant une campagne du catalogue.

## Ce que permet le use case
- Nommer et décrire la campagne
- Dupliquer une campagne publique pour la personnaliser sans modifier l'original
- La quête principale de campagne est créée automatiquement

## Personas concernés
- Emma → commencer facilement
- Rémi → gagner du temps
- Julien → créer et archiver proprement

## Tickets Jira
KAN-36, KAN-40, KAN-174, KAN-48

---

# 4. Organiser une campagne en chapitres et scènes

## Version
MVP

## Description
Le MJ structure sa campagne : chaque chapitre correspond à une session de jeu et se découpe en scènes.

## Ce que permet le use case
- Créer, modifier, supprimer et réordonner les chapitres et les scènes
- Rédiger la narration du chapitre (lue en début de session) et celle de chaque scène
- Ajouter des notes privées MJ, lisibles pendant toute la session
- Uploader une carte (image) pour un chapitre ou une scène

## Personas concernés
- Emma → être guidée
- Rémi → garder une cohérence narrative
- Julien → organiser son storytelling

## Tickets Jira
KAN-52, KAN-56, KAN-57, KAN-61, KAN-73, KAN-77, KAN-78, KAN-81, KAN-83

---

# 5. Créer et gérer les personnages (héros prétirés, PNJ, monstres)

## Version
MVP

## Description
Le MJ prépare tous les personnages de sa campagne sur une fiche commune : héros prétirés attribués aux joueurs, PNJ et monstres.

## Ce que permet le use case
- Fiche D&D 5e simplifiée : race, classe, historique, niveau et XP, six caractéristiques, PV, armure portée, or, biographie, personnalité, quête personnelle, secrets
- Compétences maîtrisées et capacités reprises automatiquement de la race, de la classe (selon le niveau) et de l'historique
- PNJ unique (ex. PNJ de quête) : un seul état suivi sur toutes les scènes et tous les chapitres
- PNJ générique (ex. gardes) : posé en plusieurs exemplaires indépendants dans une scène
- Associer personnages et monstres à une scène, les regrouper (Commerce, Gardes, Ennemis…)
- Importer un personnage de la bibliothèque

## Personas concernés
- Rémi → accès rapide en session, réduire la charge mentale
- Emma → simplifier la préparation, trouver facilement du contenu
- Julien → enrichir son univers

## Tickets Jira
KAN-100, KAN-104, KAN-84, KAN-86, KAN-140, KAN-143

---

# 6. Gérer sa bibliothèque d'objets, de capacités et d'effets

## Version
MVP

## Description
Les objets, capacités et effets appartiennent au MJ (et non à une campagne) : il les réutilise dans toutes ses campagnes.

## Ce que permet le use case
- Créer des objets (arme, armure, consommable…) avec un prix et, pour une armure, sa valeur d'armure
- Relier un ou plusieurs effets à un objet ou une capacité (ex. « 2D4 », « +5 dégâts de poison, appliqué 3 fois ») — effets descriptifs, non calculés
- Utiliser le contenu D&D officiel fourni
- Importer un objet de la bibliothèque
- Publier une campagne rend publics les objets, capacités et effets qu'elle utilise (message informatif à valider) — publication au global prévue plus tard

## Personas concernés
- Rémi
- Emma

## Tickets Jira
KAN-107, KAN-144, KAN-147, KAN-187, KAN-535 (effets), KAN-536 (capacités)

---

# 7. Préparer et suivre les quêtes

## Version
MVP

## Description
Le MJ définit la quête principale de campagne et les quêtes secondaires de chaque chapitre, découpées en objectifs.

## Ce que permet le use case
- Quête principale de campagne, toujours présente, avec des objectifs différents à chaque chapitre
- Quêtes secondaires propres à un chapitre
- Objectifs reliés à un élément du jeu (personnage, énigme, coffre, objet, piège ou scène), avec une narration qui s'ouvre au contact de cet élément
- Récompenses : XP, or, objets, texte
- Le MJ valide les objectifs à la main ; la progression de la quête et du chapitre se calcule
- Importer une quête de la bibliothèque

## Personas concernés
- Rémi → cohérence narrative
- Emma → éviter les oublis
- Julien → suivi long terme des univers

## Tickets Jira
KAN-115, KAN-160, KAN-163, KAN-206, KAN-244 à KAN-248

---

# 8. Préparer coffres, énigmes et pièges

## Version
MVP

## Description
Le MJ place dans ses scènes des coffres, des énigmes et des pièges, qu'il révèle et fait évoluer pendant la partie.

## Ce que permet le use case
- Coffre : nom, verrouillé ou non, contenu en objets
- Énigme : énoncé, solution, résolue ou non
- Piège : description, effets, déclenché ou non
- Révéler l'élément aux joueurs au bon moment

## Personas concernés
- (à valider)

## Tickets Jira
KAN-118, KAN-122, KAN-126, KAN-88 à KAN-93, KAN-207 à KAN-209, KAN-218 à KAN-220

---

# 9. Lancer une partie et accueillir les joueurs

## Version
MVP

## Description
Le MJ lance une partie sur un chapitre ; les joueurs la rejoignent depuis leur mobile avec un lien, sans compte.

## Ce que permet le use case
- Choisir le chapitre et lancer la partie (code de partie et lien d'invitation)
- Les joueurs rejoignent avec un pseudo ; le MJ voit qui est connecté et prêt
- Le MJ attribue un héros prétiré à chaque joueur (glisser-déposer)
- Terminer la partie ; reprendre plus tard un chapitre non terminé à la scène où le groupe s'était arrêté

## Personas concernés
- Rémi → réduire la charge mentale
- Emma → être guidée pendant la session

## Tickets Jira
KAN-189 à KAN-195, KAN-197, KAN-517, KAN-45, KAN-46

---

# 10. Piloter la partie depuis l'interface MJ

## Version
MVP

## Description
Sur un seul écran desktop/tablette, le MJ a toutes les informations de la session, scène par scène.

## Ce que permet le use case
- Lire la narration du chapitre puis celle de chaque scène
- Naviguer entre les scènes
- Voir les joueurs et les héros, ouvrir la fiche d'un héros (modale) pour gérer PV, armure et inventaire
- Gérer PNJ et monstres de la scène : PV, attitude amicale / neutre / hostile, tuer (PV à 0)
- Suivre les quêtes et valider les objectifs
- Consulter ses notes privées
- Révéler les informations aux joueurs au bon moment

## Personas concernés
- Rémi → réduire la fatigue mentale, accès rapide aux PNJ et lieux
- Emma → gagner en confiance

## Tickets Jira
KAN-198 à KAN-202, KAN-203 à KAN-205, KAN-210, KAN-212, KAN-249 à KAN-254

---

# 11. Gérer les combats

## Version
MVP

## Description
Le MJ lance un combat depuis l'interface de partie ; les mobiles des joueurs basculent sur l'interface de combat.

## Ce que permet le use case
- Notification de début de combat chez les joueurs
- Saisir l'initiative de chaque combattant ; ordre de tour trié automatiquement
- Curseur « à qui le tour » et bouton « Suivant » (les morts sont sautés, retour au premier après le dernier)
- Ajouter ou retirer des PV aux héros et aux PNJ
- Consulter les capacités des PNJ et monstres
- Pas de compteur de rounds dans le MVP

## Personas concernés
- Rémi → fluidité
- Emma → aide au déroulement

## Tickets Jira
KAN-529, KAN-530, KAN-531, KAN-511, KAN-513, KAN-514, KAN-515, KAN-516

---

# 12. Commerce, butin et récompenses de quête

## Version
MVP

## Description
Le MJ fait commercer les héros avec les marchands, partage le butin des ennemis et distribue les récompenses de quête.

## Ce que permet le use case
- Commerce avec un PNJ marchand : stock, prix, quantités, paiement en or
- Partage du butin d'une créature vaincue entre les héros
- Récompenses de fin de quête : répartition de l'XP, de l'or et des objets ; le niveau monte selon les paliers d'XP (le MJ peut aussi l'ajuster avec +/−)

## Personas concernés
- (à valider)

## Tickets Jira
KAN-522, KAN-523, KAN-533 (commerce), KAN-534 (récompenses de quête)

---

# 13. Jouer depuis son mobile (joueur)

## Version
MVP

## Description
Le joueur suit la partie sur son téléphone avec la fiche de son héros.

## Ce que permet le use case
- Onglets Profil, Inventaire, Compétences, Quêtes, Carte
- Voir ses PV en temps réel
- Utiliser un objet consommable (la quantité diminue)
- Voir ses quêtes, objectifs et leur progression
- Interface de combat : ordre d'initiative, son tour, ses PV et ceux de ses alliés

## Personas concernés
- Tous les joueurs
- Rémi → automatisation
- Emma → simplification des règles

## Tickets Jira
KAN-223, KAN-231, KAN-509, KAN-233 à KAN-235, KAN-532, KAN-530, KAN-240

---

# 14. Synchroniser la partie en temps réel

## Version
MVP

## Description
Toutes les modifications faites pendant la partie sont diffusées instantanément et enregistrées dans la campagne.

## Ce que permet le use case
- Synchronisation MJ ↔ joueurs (scène, PV, ordre de tour, inventaires, quêtes, révélations)
- L'état est conservé d'une session à l'autre : objectifs validés, personnages tués, stocks des marchands, coffres ouverts…

## Personas concernés
- Rémi
- Julien

## Tickets Jira
KAN-211, KAN-212, KAN-239, KAN-247, KAN-512, KAN-516

---

# V1.1 — Bibliothèque communautaire et confort de jeu

---

# 15. Partager et réutiliser du contenu

## Version
V1.1

## Description
Le MJ publie ses contenus dans la bibliothèque et réutilise ceux de la communauté.

## Ce que permet le use case
- Publier, dépublier et voir le statut de publication (campagnes, personnages, objets, effets, quêtes, coffres, énigmes, pièges)
- Rechercher, filtrer et trier les contenus ; favoris ; « Mes contenus »
- Importer une campagne complète ou un contenu et le dupliquer pour le personnaliser

## Personas concernés
- Julien → partage communautaire
- Emma → découvrir du contenu existant

## Tickets Jira
KAN-132 à KAN-135, KAN-137 à KAN-139, KAN-141, KAN-142, KAN-145, KAN-146, KAN-148 à KAN-159, KAN-161, KAN-162, KAN-164 à KAN-173, KAN-178, KAN-180 à KAN-186, KAN-188, KAN-35

---

# 16. Rechercher rapidement une information

## Version
V1.1

## Description
Le MJ retrouve instantanément un élément de sa campagne pendant une session.

## Ce que permet le use case
- Rechercher une scène, un personnage, un objet ou une note dans toute la campagne

## Personas concernés
- Rémi → navigation rapide en session
- Emma → éviter le stress
- Julien → retrouver facilement ses anciens contenus

## Tickets Jira
KAN-521

---

# 17. Mieux contrôler les sessions

## Version
V1.1

## Description
Le MJ garde la main sur qui participe à la partie.

## Ce que permet le use case
- Verrouiller la session une fois tout le monde arrivé
- Expulser un participant, réaffecter un personnage
- Afficher un code QR pour rejoindre en un scan
- Le joueur peut quitter la session

## Personas concernés
- (à valider)

## Tickets Jira
KAN-196, KAN-518, KAN-524, KAN-525, KAN-527, KAN-47

---

# 18. Lanceur de dés intégré

## Version
V1.1

## Description
Pour les parties à distance, le MJ active un lanceur de dés virtuel ; par défaut, on joue avec des dés physiques.

## Ce que permet le use case
- Activer / désactiver le lanceur au niveau de la session
- Le joueur lance un dé virtuel depuis son mobile

## Personas concernés
- (à valider)

## Tickets Jira
KAN-519, KAN-520

---

# 19. Création de personnage par le joueur et équipement

## Version
V1.1

## Description
Le joueur crée et fait évoluer lui-même son personnage.

## Ce que permet le use case
- Créer son personnage (race, classe, informations personnelles)
- Consulter caractéristiques, compétences et états ; compteurs de ressources (emplacements de sorts…)
- Équiper / déséquiper un objet

## Personas concernés
- Tous les joueurs
- Rémi → éviter les erreurs
- Emma → réduire la complexité

## Tickets Jira
KAN-224 à KAN-230, KAN-232, KAN-510, KAN-237, KAN-238

---

# 20. Suivre l'évolution de la campagne

## Version
V1.1

## Description
Le MJ garde une trace du déroulement de ses sessions.

## Ce que permet le use case
- Notes narratives de chapitre (indices, conseils)
- Progression et statut du chapitre
- Historique des sessions et des modifications faites pendant la partie

## Personas concernés
- Rémi → cohérence narrative
- Emma → éviter les oublis
- Julien → suivi long terme des univers

## Tickets Jira
KAN-63, KAN-69 à KAN-72, KAN-222, KAN-49

---

# 21. Faire suivre la scène aux joueurs

## Version
V1.1

## Description
Les joueurs voient automatiquement la nouvelle scène quand le MJ fait progresser la partie, avec uniquement les éléments révélés.

## Ce que permet le use case
- Changement de scène automatique côté joueur
- Contrôle des éléments visibles

## Personas concernés
- Rémi → fluidité en session
- Emma → simplifier l'animation

## Tickets Jira
KAN-243, KAN-242, KAN-85, KAN-87, KAN-103, KAN-105

---

# V1.2 — Univers visuel et exploration

---

# 22. Illustrer la campagne, les chapitres et les scènes

## Version
V1.2

## Ce que permet le use case
- Images de campagne, de chapitre et de scène
- Modification des cartes et mise à jour en temps réel côté joueur (l'upload et la consultation des cartes sont dans le MVP)
- Publier / dépublier une campagne et voir son statut

## Personas concernés
- (à valider)

## Tickets Jira
KAN-41 à KAN-44, KAN-59, KAN-79, KAN-80, KAN-82, KAN-241

---

# 23. Relier les scènes pour une exploration libre

## Version
V1.2

## Ce que permet le use case
- Relier des scènes entre elles, modifier ou supprimer les liens
- Plusieurs scènes accessibles depuis une scène
- Visualiser les connexions du chapitre

## Personas concernés
- Julien → organiser son storytelling (à valider)

## Tickets Jira
KAN-94 à KAN-98

---

# 24. Effets appliqués aux personnages

## Version
V1.2

## Ce que permet le use case
- Gérer des effets de type état, bonus ou malus et les appliquer aux personnages et objets
- Utiliser un objet pour appliquer son effet

## Personas concernés
- Rémi → réduction de la charge mentale
- Emma → éviter les oublis de règles

## Tickets Jira
KAN-110, KAN-236

---

# V1.3 — Édition avancée et cartes interactives

---

# 25. Faire évoluer chapitres et quêtes

## Version
V1.3

## Ce que permet le use case
- Modifier la narration, l'image, la carte et les notes d'un chapitre
- Associer, modifier et retirer des quêtes au niveau du chapitre et de la campagne

## Personas concernés
- (à valider)

## Tickets Jira
KAN-50, KAN-51, KAN-58, KAN-60, KAN-62, KAN-64 à KAN-68

---

# 26. Créer et utiliser une carte interactive

## Version
V1.3

## Ce que permet le use case
- Créer la carte d'une scène : fond de carte, repères (PNJ, monstres, coffres, pièges, énigmes, objets, points d'intérêt), zones nommées, sorties vers les scènes liées, brouillard de guerre
- En partie, révéler une zone, un repère ou une sortie, déplacer les repères
- Côté joueur, voir sur mobile la carte révélée par le MJ, mise à jour en temps réel, avec zoom et déplacement au doigt
- Ce n'est pas une grille tactique : pas de déplacement case par case ni de règles de mouvement

## Personas concernés
- (à valider)

## Tickets Jira
À créer

---

# V2 — Contenus premium et assistant IA

Aucun ticket V2 n'est encore créé dans Jira.

---

# 27. Acheter des contenus premium

## Version
V2

## Ce que permet le use case
- Parcourir le catalogue premium (campagnes, chapitres, packs de personnages, de monstres, d'objets et de cartes) et consulter la fiche d'un contenu
- Payer sans quitter le site (paiement intégré via un prestataire certifié), recevoir une facture, retrouver ses achats
- Utiliser un contenu acheté comme ses propres contenus (dupliquer, personnaliser, lancer en partie)

## Personas concernés
- (à valider)

## Tickets Jira
À créer

---

# 28. Concevoir une campagne avec l'assistant IA

## Version
V2

## Ce que permet le use case
- Demander des idées à partir du contexte de la campagne : PNJ, quêtes et objectifs, lieux, énigmes, rebondissements
- Faire rédiger ou reformuler une narration dans le ton de la campagne
- Faire vérifier la cohérence de la campagne (PNJ absent, objectif sans cible, quête sans récompense)
- Valider, modifier ou rejeter chaque suggestion : rien n'est appliqué sans le MJ

## Personas concernés
- (à valider)

## Tickets Jira
À créer

---

# 29. Être assisté par l'IA pendant la partie

## Version
V2

## Ce que permet le use case
- Recevoir des indices à transmettre aux joueurs quand le groupe bloque
- Être averti : héros à bas PV, combat déséquilibré, élément important pas encore découvert, objectif atteignable dans la scène
- Obtenir un rappel de règle D&D 5e et un résumé de la session
- Les suggestions ne sont visibles que par le MJ, jamais par les joueurs

## Personas concernés
- (à valider)

## Tickets Jira
À créer

---
