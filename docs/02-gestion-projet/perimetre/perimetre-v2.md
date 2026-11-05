# Périmètre V2 — Arcane Chronicles

**Mise à jour** : 05/11/2026 · résumé : [`resume-v2.md`](resume-v2.md) · version précédente : [V1.3](perimetre-v1.3.md)

Aucun ticket V2 n'est encore créé dans Jira : les fonctionnalités ci-dessous sont à découper en user stories.

## 1. Objectif

Faire d'Arcane Chronicles un service durable : un modèle économique avec des contenus premium, et un assistant intelligent qui aide le MJ à concevoir ses campagnes et à mener ses parties.

## 2. Contenu

### 2.1 Contenus premium et paiement intégré

**Catalogue premium**

- Des contenus payants à côté des contenus gratuits : campagnes complètes, chapitres, packs de personnages, de monstres et d'objets, cartes
- Une fiche de présentation par contenu : description, aperçu, prix, contenu du pack
- Un contenu acheté rejoint la bibliothèque du MJ et s'utilise comme ses propres contenus (dupliquer, personnaliser, lancer en partie)

**Paiement**

- Paiement sans quitter le site (checkout intégré), par carte et moyens de paiement courants, via un prestataire certifié (par exemple Stripe)
- Confirmation d'achat, facture téléchargeable, historique des achats dans le compte
- Remboursement géré depuis l'administration

**Règles**

- Arcane Chronicles ne stocke jamais les données de carte : elles restent chez le prestataire de paiement (conformité PCI DSS)
- L'accès au contenu n'est accordé qu'après la confirmation du paiement envoyée par le prestataire (webhook signé), jamais sur la seule parole du navigateur
- Conditions générales de vente, prix TTC affichés, information sur le droit de rétractation pour les contenus numériques

### 2.2 Assistant IA

**Aide à la conception (préparation)**

- Proposer des idées à partir du contexte de la campagne : PNJ (nom, apparence, personnalité, secret), quêtes et objectifs, descriptions de lieux, énigmes avec leur solution, rebondissements
- Rédiger ou reformuler une narration de chapitre ou de scène dans le ton de la campagne
- Vérifier la cohérence : PNJ cité mais absent, objectif sans cible, quête sans récompense, scène sans sortie

**Assistant de partie (en direct, pour le MJ uniquement)**

- Donner des indices au MJ à transmettre aux joueurs quand le groupe bloque sur une énigme ou un objectif
- Avertir : héros à bas PV, combat déséquilibré pour le niveau du groupe, coffre ou PNJ important pas encore découvert, objectif de quête atteignable dans la scène
- Rappeler les règles D&D 5e utiles à l'action en cours et résumer la session à sa fin

**Règles**

- L'IA propose, le MJ décide : aucune suggestion n'est appliquée sans validation, dans l'« esprit papier » du projet
- Les suggestions ne sont visibles que par le MJ, jamais par les joueurs (RG2)
- Fonction activable ou désactivable par le MJ ; appels limités par un quota par compte

### 2.3 Piste conservée

Ouvrir l'application à un second système de jeu de rôle. Elle suppose que la notion de « système de jeu » soit posée dans le modèle (décision D8 du [périmètre MVP](perimetre-mvp.md)), ce que le modèle v2 ne fait pas encore.

## 3. Impact sur le modèle et l'architecture

**Contenus premium**

- Données : produits (contenu vendu, prix, statut), achats (compte, produit, identifiant de la session de paiement, statut, montant), droits d'accès d'un compte à un contenu
- API : création de la session de paiement, route de webhook dont la signature est vérifiée, accès aux contenus filtré par les droits
- Sécurité : clés du prestataire uniquement côté serveur, en variables d'environnement

**Assistant IA**

- Appels à l'API d'un modèle de langage uniquement depuis l'API d'Arcane Chronicles (clé jamais exposée au navigateur), réponses affichées en flux continu
- Données : journal des appels (compte, usage, coût) pour les quotas ; brouillons de suggestions en attente de validation
- Données personnelles : seuls les contenus de la campagne sont envoyés au fournisseur, jamais les pseudos ou données des joueurs ; mention dans la politique de confidentialité (RGPD)
- Coût : chaque appel est facturé par le fournisseur ; l'assistant peut faire partie de l'offre premium

## 4. Points à trancher

| Point | Options |
|---|---|
| Qui vend les contenus premium | l'éditeur d'Arcane Chronicles seulement, ou aussi les MJ (place de marché avec commission, ce qui implique de reverser des paiements) |
| Modèle économique | achat à l'unité, abonnement, ou les deux (l'abonnement pourrait inclure l'assistant IA) |
| Fournisseur d'IA | fournisseur et modèle à choisir selon le coût, la qualité en français et l'hébergement des données |
| Accès à l'IA | réservée au premium, ou quota gratuit puis premium |
