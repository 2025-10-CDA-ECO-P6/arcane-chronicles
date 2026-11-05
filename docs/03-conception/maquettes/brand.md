# Arcane Chronicles — Identité visuelle

Récapitulatif de la charte graphique. La mise en œuvre dans le code (variables Sass, mixins, classes, composants) est décrite dans le [design system](../design-system.md).

> Mise à jour du 03/11/2026 à partir du fichier Figma *Arcane Chronicles* (variables de couleur, polices et icônes réellement utilisées dans les maquettes).

## Description

Arcane Chronicles est un assistant de Maître du Jeu conçu pour créer, organiser et piloter des campagnes de jeu de rôle de manière fluide et centralisée.

Il permet de structurer un univers complet — chapitres, scènes, personnages, objets, événements et narration — dans un seul espace pensé pour le storytelling.

Chaque campagne devient un monde vivant, construit étape par étape, où le MJ garde un contrôle total sur l'histoire, les secrets et la progression des joueurs.

Arcane Chronicles ne remplace pas l'imagination du Maître du Jeu : il la structure, l'accélère et la rend exploitable en temps réel.

---

## Couleurs

Thème sombre unique. Les noms ci-dessous sont ceux des **variables Figma** : à reprendre tels quels en variables CSS / SCSS (`--primary-color`, `$primary-color`…).

### Couleurs principales

| Variable | Valeur | Usage |
|---|---|---|
| `background-color` | `#080808` | Fond de page (noir profond) |
| `background-color-secondary` | `#121414` | Fond des cartes, panneaux et modales |
| `primary-color` | `#00f2ff` | Bleu Arcane : actions principales, éléments actifs, PV, liens |
| `secondary-color` | `#ff8c00` | Orange Feu : contraste chaud, actions secondaires, Commerce |
| `third-color` | `#8069bf` | Violet : couleur d'accent complémentaire (fiche joueur mobile) |
| `gold-color` | `#c9a74d` | Or : quêtes principales, récompenses, pièces d'or, objets précieux |
| `hostile color` | `#eb4034` | Rouge : ennemis, attitude hostile, combat, mort |

### Texte

| Variable | Valeur | Usage |
|---|---|---|
| `text-color-primary` | `#ffffff` | Texte principal |
| `text-color-secondary` | `#ffffffcc` | Texte secondaire (blanc à 80 %) |
| `input-color` | `#ffffff80` | Texte des champs, placeholders, libellés discrets (blanc à 50 %) |

### Bordures et superpositions

| Variable | Valeur | Usage |
|---|---|---|
| `border-color` | `#ffffff1a` | Bordures fines des cartes et champs (blanc à 10 %) |
| `overlay-color` | `#080808cc` | Voile sur image ou fond de modale (noir à 80 %) |
| `overlay-color-secondary` | `#08080880` | Voile léger (noir à 50 %) |
| `overlay-color-third` | `#12141480` | Voile sur fond secondaire (50 %) |

### Variantes transparentes

| Variable | Valeur | Usage |
|---|---|---|
| `primary-color-light` | `#00f2ff26` | Fond d'élément actif ou sélectionné (bleu à 15 %) |
| `primary-color-middle` | `#00f2ff80` | Bordure ou halo bleu (50 %) |
| `secondary-color-light` | `#ff8c0026` | Fond orange léger (15 %) |
| `gold-color-secondary` | `#c9a74d33` | Fond or léger (20 %) |
| `hostile-color-light` | `#eb403426` | Fond rouge léger, ex. bouton Hostile (15 %) |

Deux variables existent aussi dans le fichier mais ne sont utilisées sur aucun écran : `secondary-color-middle` et `color-grey-neutral`. Leurs valeurs sont à reprendre directement dans Figma.

---

## Typographie

| Police | Graisses utilisées | Usage |
|---|---|---|
| **Cinzel** | Regular, Bold | Titres et éléments clés : nom de campagne, titres de scène et de section, noms de personnages et de quêtes (style épique et médiéval) |
| **Inter** | Regular, Semi Bold, Bold, Italic | Tout le reste de l'interface : textes, libellés, boutons, champs, valeurs (PV, CA…) |
| **Crimson Text** | Regular | Police serif complémentaire (usage à préciser selon les maquettes) |

Fichiers, chargement et tailles de texte : voir le [design system](../design-system.md).

---

## Icônes

Les icônes de l'interface sont regroupées dans une **police d'icônes « Arcane-chronicle »**, générée avec **[IcoMoon](https://icomoon.io/app/)** à partir des icônes des maquettes Figma.

Les icônes d'origine viennent de plusieurs jeux d'icônes libres utilisés dans Figma, avec une dominante *Game Icons* pour l'univers fantasy (or, coffres, potions, armes, armures, magie, carte, parchemins, marchand…).

Utilisation dans le code et mise à jour : voir le [design system](../design-system.md#icônes).

---

## Logos

- `logos/logo-desktop.webp` — version desktop (en-tête de l'interface MJ)
- `logos/logo-mobile.webp` — version mobile

---

## Composants Figma

La page **composants** du fichier contient les éléments réutilisables : boutons (primaire, secondaire, contour, avec ou sans icône, survol), champs de saisie et zone de texte, barre de recherche, select, pagination, menu de navigation, tags et statuts, tags ronds avec icône (piégé, verrouillé, amorcé, désamorcé…), barres de progression circulaires, cartes de personnages, d'objets, de quêtes et de campagne, coffres, pièges, cartes d'accès aux scènes, détails d'objet, caractéristiques, champs de quantité, modales, barre d'outils, en-tête et menu latéral.
