# Arcane Chronicles — Design system

Mise en œuvre de la [charte graphique](maquettes/brand.md) dans le code du front (`apps/web/src/styles/`) : unités, variables Sass, mixins et classes globales réutilisables.

## Organisation des fichiers

Les fichiers sont rangés **par type** : les variables d'un côté, les fonctions d'un autre, les mixins d'un autre, et les classes globales dans `base/`.

| Dossier ou fichier | Contenu |
|---|---|
| `globals.scss` | Point d'entrée, importé par `app/layout.tsx` : charge les couleurs et toutes les classes globales une fois, et pose `*`, `html` et `body` |
| `variables/` | **Uniquement des variables** : couleurs (variables CSS), breakpoints, espacements, arrondis, typographie, ombres, noms des icônes, réglages des boutons, des boîtes, du conteneur, dégradés des images |
| `functions/` | **Uniquement des fonctions** : `_global-functions.scss` (`with-alpha()`, `fluid()`, `glow()`), `_layout-functions.scss` (`breakpoint()`), `_overlay-functions.scss` (`fade()`, `fade-edges()`) |
| `mixins/` | **Uniquement des mixins** : `_global-mixin.scss` (`visually-hidden`) puis un fichier par élément (`_icons-mixin.scss`, `_effects-mixin.scss`, `_buttons-mixin.scss`, `_form-mixin.scss`, `_box-mixin.scss`, `_layout-mixin.scss`, `_overlay-mixin.scss`) |
| `base/` | **Classes et styles globaux** : `_reset.scss`, `_typography.scss` (balises), `_layout.scss` (`.container`), `_utilities.scss` (`.sr-only`) |
| `base/lib/` | Classes des éléments d'interface : `_icons.scss`, `_buttons.scss`, `_form.scss`, `_box.scss`, `_overlay.scss` (et les éléments à venir) |

Chaque dossier `variables/`, `functions/` et `mixins/` a un `_index.scss` qui regroupe ses fichiers. Les fichiers de `variables/`, `functions/` et `mixins/` ne génèrent aucun CSS : seuls `variables/_colors.scss` et les fichiers de `base/` en produisent, chargés une fois par `globals.scss`.

Dans un `.module.scss`, on importe ce dont on a besoin :

```scss
@use '@/styles/variables' as *;
@use '@/styles/functions' as *;
@use '@/styles/mixins' as *;
```

---

## Polices

Cinzel et Inter sont des **polices variables** (`apps/web/src/assets/fonts/Cinzel-Variable.ttf` et `Inter-Variable.ttf`) : un seul fichier par police couvre toutes les graisses. Crimson Text n'est disponible qu'en Regular (`CrimsonText-Regular.ttf`) : un gras ou un italique serait simulé par le navigateur, il faut ajouter les fichiers correspondants si les maquettes en utilisent. Toutes sont chargées localement avec `next/font/local` (`apps/web/src/lib/fonts.ts`), sans appel à un service externe, et exposées en variables CSS : `--font-cinzel`, `--font-inter`, `--font-crimson-text`. Le fichier Figma définit aussi un style de texte **Body** dans la bibliothèque d'équipe.

## Unités

Toutes les tailles (textes, espacements, dimensions) sont exprimées en **`rem`**, avec **1rem = 10px** : une valeur de Figma se convertit en divisant par 10 (`24px` → `2.4rem`, `16px` → `1.6rem`).

Cette base est posée par `html { font-size: 62.5%; }` dans `apps/web/src/styles/globals.scss` (62,5 % des 16px par défaut du navigateur). Un pourcentage plutôt que `10px` en dur respecte la taille de texte choisie par l'utilisateur dans son navigateur : s'il l'agrandit, toute l'interface suit. Le texte courant (`body`) va de 16px sur mobile à 20px sur desktop (`$text-body-size`, voir « Tailles fluides »).

## Breakpoints

Variables Sass dans `apps/web/src/styles/variables/_breakpoints.scss`.

| Variable | Valeur | Cible |
|---|---|---|
| `$screen-s` | `375px` | Mobile (interface joueur, 350 à 375px) |
| `$screen-m` | `768px` | Tablette en portrait (iPad), valeur `md` de Bootstrap et Tailwind |
| `$screen-lg` | `1024px` | Tablette en paysage, petit portable |
| `$screen-xl` | `1440px` | Ordinateur portable et écran courant (interface MJ) |
| `$screen-xxl` | `1920px` | Écran Full HD |

Les media queries s'écrivent avec les mixins de `apps/web/src/styles/mixins/_layout-mixin.scss` (transmis par `mixins/_index.scss`), avec le nom du breakpoint (`s`, `m`, `lg`, `xl`, `xxl`) ou une valeur en px pour un cas particulier :

| Mixin | Media query générée | Usage |
|---|---|---|
| `@include from(m)` | `(min-width: 768px)` | à partir de cette largeur (le plus courant) |
| `@include until(m)` | `(max-width: 767.98px)` | en dessous de cette largeur |
| `@include between(m, xl)` | `(min-width: 768px) and (max-width: 1439.98px)` | entre deux largeurs |

```scss
@use '@/styles/mixins' as *;

.campaign-grid {
  display: grid;
  grid-template-columns: 1fr;

  @include from(m) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include from(xl) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

`until` et `between` s'arrêtent à 0,02px sous le breakpoint : `until(m)` et `from(m)` ne s'appliquent jamais en même temps, même à exactement 768px. Un nom inconnu fait échouer la compilation avec la liste des noms possibles.

Approche *mobile first* : les styles de base visent le mobile, `from()` ajoute les adaptations pour les écrans plus larges. `until()` reste pour les cas où seul le mobile change.

Les breakpoints restent en **px** et non en rem : dans une media query, `1rem` vaut toujours la taille par défaut du navigateur (16px), et non les 10px posés sur `html`. `48rem` y vaudrait donc 768px, ce qui rendrait la règle « 1rem = 10px » trompeuse.

---

## Variables Sass

Toutes les valeurs de la charte sont dans `apps/web/src/styles/variables/`, en **rem** (1rem = 10px), sauf les breakpoints (en px, voir plus haut).

| Fichier | Contenu |
|---|---|
| `_colors.scss` | Couleurs, en variables CSS (`--primary-color`…) : seul fichier qui génère du CSS, chargé une fois par `globals.scss` |
| `_breakpoints.scss` | `$screen-s` à `$screen-xxl`, et leur table `$breakpoints` (nom → largeur) |
| `_spacing.scss` | `$space-*` |
| `_radius.scss` | `$radius-*` |
| `_typography.scss` | Familles, graisses, tailles (`$font-size-*`), interlignages, espacement des lettres, tailles fluides |
| `_shadows.scss` | Tailles de halo (`$glow-*`), ombres nommées, flous d'arrière-plan |
| `_icons.scss` | Table `$icons-names` (nom → code), générée par `npm run icons` |
| `_buttons.scss` | Couleurs et tailles des boutons (`$button-color-values`, `$button-size-values`), taille par défaut, taille des icônes |
| `_box.scss` | Couleurs de halo et de bordure des boîtes (`$box-glow-values`) |
| `_layout.scss` | Largeur maximale et marges du conteneur de page |
| `_gradients.scss` | Dégradés nommés posés sur les images (`$gradient-*`, `$overlay-gradients`) |
| `_index.scss` | Regroupe tous les fichiers sauf `_colors.scss` |

Dans un `.module.scss`, une seule ligne donne accès à tout (aucun CSS n'est généré par cet import) :

```scss
@use '@/styles/variables' as *;

.campaign-card {
  padding: $space-md;
  border-radius: $radius-md;
  font-size: $font-size-xs;

  @include glow(var(--primary-color), $glow-md);
}
```

La fonction `with-alpha($color, $alpha)` (`apps/web/src/styles/functions/_global-functions.scss`) applique une opacité à n'importe quelle couleur, y compris une variable CSS : `with-alpha(var(--background-color), 0.2)`.

### Espacements

Échelle sur une base de 8px (4px pour le plus petit palier).

| Variable | Valeur |
|---|---|
| `$space-0` | `0` |
| `$space-xs` | `0.4rem` (4px) |
| `$space-sm` | `0.8rem` (8px) |
| `$space-md` | `1.6rem` (16px) |
| `$space-lg` | `2.4rem` (24px) |
| `$space-xl` | `3.2rem` (32px) |
| `$space-2xl` | `4rem` (40px) |

### Arrondis

| Variable | Valeur | Usage |
|---|---|---|
| `$radius-xs` | `0.3rem` (3px) | Cases à cocher, sélecteur d'attitude |
| `$radius-sm` | `0.4rem` (4px) | Barres de progression |
| `$radius-md` | `0.5rem` (5px) | Valeur par défaut : boutons, cartes, coffres |
| `$radius-lg` | `0.8rem` (8px) | Menu de navigation |
| `$radius-xl` | `1rem` (10px) | Blocs, panneaux, statuts |
| `$radius-2xl` | `1.6rem` (16px) | Barre de recherche |
| `$radius-3xl` | `2rem` (20px) | Onglets (Description, Coffres…), vignettes de personnage |
| `$radius-pill` | `100rem` | Pastilles allongées (« À attribuer », « État ») |
| `$radius-circle` | `50%` | Tags ronds avec icône, avatars |

Coins partiels : `border-radius: $radius-xl $radius-xl 0 0;`.

### Typographie

Échelle de tailles :

| Variable | Valeur |
|---|---|
| `$font-size-2xs` | `0.8rem` (8px) : minimum absolu |
| `$font-size-xs` | `1rem` (10px) |
| `$font-size-sm` | `1.2rem` (12px) |
| `$font-size-md` | `1.6rem` (16px) |
| `$font-size-lg` | `2rem` (20px) |
| `$font-size-xl` | `2.4rem` (24px) |
| `$font-size-2xl` | `3.2rem` (32px) |
| `$font-size-3xl` | `4.8rem` (48px) |

| Variable | Valeur | Usage |
|---|---|---|
| `$font-family-title` | Cinzel | Titres `h1` à `h6` |
| `$font-family-body` | Inter | Texte de l'interface |
| `$font-family-crimson` | Crimson Text | Police serif complémentaire |
| `$line-height-tight` | `1.15` | Titres (appliqué à `h1` à `h6`) |
| `$line-height-normal` | `1.4` | Texte de l'interface (appliqué à `body`) |
| `$line-height-relaxed` | `1.7` | Paragraphes longs (narration, biographie) |
| `$letter-spacing-caps` | `0.1rem` | Libellés en majuscules (QUÊTE PRINCIPALE…) |

### Tailles fluides

Chaque taille a une variable `-mobile` et une `-desktop` ; la variable sans suffixe passe progressivement de l'une à l'autre avec `clamp()`, sans media query. Pour changer une taille, on modifie seulement la variable `-mobile` ou `-desktop`.

**Titres**

| Variable fluide | Mobile (≤ 375px) | Desktop (≥ 1440px) | Appliquée à |
|---|---|---|---|
| `$h1-size` | `$font-size-2xl` (32px) | `$font-size-3xl` (48px) | `h1` |
| `$h2-size` | `$font-size-xl` (24px) | `$font-size-2xl` (32px) | `h2` |
| `$h3-size` | `$font-size-lg` (20px) | `$font-size-xl` (24px) | `h3` |
| `$h4-size` | `$font-size-md` (16px) | `$font-size-lg` (20px) | `h4` |

`h5` et `h6`, absents des maquettes, prennent la taille du texte courant avec la police des titres.

**Textes** : quatre tailles, partagées par les balises et les composants.

| Variable fluide | Mobile | Desktop | Balises (`base/_typography.scss`, `body` dans `globals.scss`) | Dans les composants |
|---|---|---|---|---|
| `$text-body-size` | `$font-size-md` (16px) | `$font-size-lg` (20px) | `body`, hérité par `p`, `li`, `dd`, `blockquote`, `td`, `span`, `a`… ; `label`, `legend`, `input`, `textarea`, `select`, `button` | Narration, descriptions, libellés de formulaire |
| `$text-button-size` | `$font-size-sm` (12px) | `$font-size-md` (16px) | — | Texte des boutons `md` |
| `$text-small-size` | `$font-size-xs` (10px) | `$font-size-sm` (12px) | — | Textes de cartes, inventaire, objectifs, caractéristiques (FOR, DEX…) |
| `$text-caption-size` | `$font-size-2xs` (8px) | `$font-size-xs` (10px) | `small`, `figcaption`, `caption` | Mentions, compteurs, statuts (« 32/38 PV », « Actif »), surtitres, valeurs des badges (PV, CA, niveau) |

Règle générale : le desktop reprend la taille des maquettes, le mobile est un cran en dessous. Exception pour le texte courant, où le mobile est au plancher (16px) et c'est le desktop qui monte d'un cran : c'est la taille minimale pour lire un paragraphe sur téléphone, et celle des champs de formulaire, sous laquelle Safari sur iPhone zoome automatiquement au moment de la saisie.

Les styles des balises sont dans `apps/web/src/styles/base/` : `_typography.scss` pour les tailles et polices (titres, libellés, champs…), `_reset.scss` pour neutraliser les styles par défaut du navigateur. `globals.scss` ne garde que `*`, `html` et `body`, et charge les autres fichiers.

Le reset (`base/_reset.scss`) :

- `a` : ni soulignement ni bleu par défaut, le lien prend la couleur du texte autour. Un lien placé au milieu d'un paragraphe doit rester repérable autrement que par la couleur (soulignement, icône, graisse) : c'est un critère d'accessibilité (WCAG 1.4.1), à gérer dans le composant.
- `ul`, `ol` : sans puces ni numéros. Safari (VoiceOver) cesse alors d'annoncer la liste comme une liste, sauf dans un `nav` ; quand le nombre d'éléments compte pour l'utilisateur (inventaire, liste de joueurs), ajouter `role="list"` sur la balise.
- `img`, `picture`, `svg`, `video` : en `display: block` pour supprimer l'espace blanc sous l'image (elle est alignée sur la ligne de texte par défaut), et jamais plus larges que leur conteneur (`max-inline-size: 100%`).

Choix pour les balises globales :

- `span` et `li` n'ont pas de taille propre : `span` sert partout (dans les boutons, les titres, les icônes `.icon`, `.sr-only`) et serait réduit jusque dans un `h1` ; une liste peut se trouver dans un menu comme dans une narration. Ils héritent de la taille du texte autour.
- `input`, `textarea`, `select` et `button` reçoivent `font: inherit` et `color: inherit` : par défaut, les navigateurs leur donnent la police du système (environ 13px) et leur propre couleur au lieu de celles de la page. Ils prennent ainsi `$text-body-size`, donc 16px minimum sur mobile.
- `b` et `strong` sont en `$font-weight-bold`.

La fonction `fluid($min, $max)` (`apps/web/src/styles/functions/_global-functions.scss`) calcule le `clamp()` : taille `$min` jusqu'à `$screen-s` (375px), `$max` à partir de `$screen-xl` (1440px), croissance linéaire entre les deux. Elle accepte deux autres bornes d'écran en 3e et 4e paramètres, et peut servir à toute valeur fluide (espacement, marge…), en rem.

```scss
font-size: fluid($font-size-lg, $font-size-2xl);
padding-inline: fluid($space-md, $space-2xl, $screen-m, $screen-xxl);
```

Le terme du milieu combine rem et vw (`2.637rem + 1.502vw`) : la partie en rem suit l'agrandissement du texte choisi par l'utilisateur dans son navigateur, ce qu'une taille en vw seule ne ferait pas (exigence d'accessibilité).

### Ombres et halos

9 ombres sur 10 dans Figma sont un halo lumineux centré : seuls le flou et la couleur changent.

| Variable | Flou | Usage |
|---|---|---|
| `$glow-xs` | `0.4rem` (4px) | Textes (pourcentages, titres de quête) |
| `$glow-sm` | `0.5rem` (5px) | Tags, petites icônes |
| `$glow-md` | `1rem` (10px) | Valeur par défaut : boutons, cartes, coffres, polygones |
| `$glow-lg` | `2rem` (20px) | Cartes sélectionnées, en-tête |
| `$glow-xl` | `3rem` (30px) | Grandes icônes |

- Fonction `glow($color, $blur, $x, $y)` (`functions/_global-functions.scss`, importée avec `@use '@/styles/functions' as *;`) : renvoie la valeur d'un halo, utilisable dans `box-shadow`, `text-shadow` et `drop-shadow()`. `$blur` prend une variable de l'échelle ou une longueur hors échelle (`0.2rem`). Exemples : `box-shadow: glow();`, `box-shadow: glow(var(--secondary-color), $glow-lg);`, `box-shadow: glow(), inset glow(var(--gold-color), $glow-sm);`.
- Mixin `glow($color, $blur, $on)` (`mixins/_effects-mixin.scss`, importé avec `@use '@/styles/mixins' as *;`) : applique le halo avec la bonne propriété. `$on: box` (par défaut) pour les blocs, `text` pour les textes et les icônes de la police d'icônes, `shape` pour les formes découpées (`clip-path`, SVG, polygones), que `box-shadow` ne suit pas.

| Variable | Usage |
|---|---|
| `$text-shadow-logo` | Logo « Arcane Chronicles » |
| `$text-shadow-title` | Grands titres (Bibliothèque) |
| `$text-shadow-nav` | Libellés du menu actif |
| `$shadow-dropdown` | Menus déroulants (Menu de scènes) |
| `$shadow-separator` | Lignes de séparation |
| `$backdrop-blur-sm` / `$backdrop-blur-md` | Flou derrière les modales et overlays (2px et 5,5px dans Figma) |

---

## Icônes

| Élément | Valeur |
|---|---|
| Fichiers | `apps/web/src/assets/fonts/icons/Arcane-chronicle.woff` (web), `.ttf` et `.otf` |
| Source IcoMoon | `apps/web/src/assets/fonts/icons/arcane-chronicles.icomoon.json` : projet complet, à réimporter dans IcoMoon pour ajouter ou modifier des icônes |
| Nombre d'icônes | 84 glyphes, codes Unicode privés `U+F000` à `U+F053` |
| Chargement | `next/font/local` (`apps/web/src/lib/fonts.ts`), variable CSS `--font-icons` utilisée par le mixin et les classes, `display: block` pour ne jamais afficher de caractère de repli |
| Noms | ceux d'IcoMoon sans le préfixe du jeu d'origine (`game-icons_open-chest` → `open-chest`), sauf en cas de doublon (`icon-park-outline-close`, `material-symbols-light-close`) |
| Taille et couleur | l'icône prend la couleur (`color`) et la taille (`font-size`) du texte, donc les variables de couleur de la charte |
| Accessibilité | le contenu d'un `::before` peut être lu par les lecteurs d'écran : le mixin écrit `content: "…" / ""` (texte alternatif vide) pour que l'icône soit ignorée ; sur une balise dédiée, ajouter aussi `aria-hidden="true"` ; une icône porteuse de sens (bouton sans texte, statut) doit avoir son équivalent textuel : texte dans un `<span class="sr-only">` (classe globale, ou mixin `visually-hidden` dans un `.module.scss`), lu par les lecteurs d'écran mais invisible à l'écran |

### Utilisation dans le code

Fichiers des icônes dans `apps/web/src/styles/` :

| Fichier | Contenu |
|---|---|
| `variables/_icons.scss` | Table `$icons-names` (nom → code), générée par `npm run icons` |
| `mixins/_icons-mixin.scss` | Mixins `add-icon()` et `icon-font` |
| `base/lib/_icons.scss` | Classes `.icon` et `.icon--{nom}`, chargées une fois par `globals.scss` |

Tout se fait en SCSS, sans composant React.

**Dans un fichier `.module.scss`**, avec le mixin `add-icon()` appelé sur l'élément : il crée lui-même le pseudo-élément `::before` (ou `::after`).

```scss
@use '@/styles/mixins' as *;

.quest-title {
  @include add-icon('scroll', 2.4rem, var(--gold-color));
}

.danger-label {
  @include add-icon('skull-outline', 2.4rem, var(--hostile-color), after);
}
```

| Paramètre | Rôle | Par défaut |
|---|---|---|
| `$name` | nom de l'icône (liste dans `apps/web/src/styles/variables/_icons.scss`) | obligatoire |
| `$size` | taille de l'icône | `1em` (taille du texte de l'élément) |
| `$color` | couleur de l'icône | `currentColor` (couleur du texte) |
| `$position` | `before` (devant le texte) ou `after` (derrière) | `before` |

Un nom d'icône inconnu ou une position invalide fait échouer la compilation avec un message explicite.

**Directement dans le HTML**, avec les classes globales (BEM : bloc `icon`, modificateur `icon--{nom}`) :

```tsx
<span className="icon icon--open-chest" aria-hidden="true" />
```

La liste des noms disponibles est dans `apps/web/src/styles/variables/_icons.scss`.

### Mettre à jour les icônes

1. Dans IcoMoon : *Import Project* avec `arcane-chronicles.icomoon.json`, puis ajouter ou modifier les icônes.
2. Exporter la police (`.woff`, `.ttf`, `.otf`) et le projet, et remplacer les fichiers de `apps/web/src/assets/fonts/icons/`.
3. Lancer `npm run icons` : régénère la table SCSS `styles/variables/_icons.scss` (mixin et classes suivent automatiquement).

### Script de génération

`npm run icons` lance `apps/web/scripts/generate-icons.mjs`, à relancer après chaque export IcoMoon.

| | Fichier |
|---|---|
| Entrée | `apps/web/src/assets/fonts/icons/arcane-chronicles.icomoon.json` (projet IcoMoon exporté) |
| Sortie | `apps/web/src/styles/variables/_icons.scss` : table `$icons-names` (nom → code Unicode), utilisée par le mixin `add-icon()` et par les classes `.icon--{nom}` |

Le script lit chaque icône du projet (`glyphs[].extras` : nom et code), calcule son nom court, trie la liste par ordre alphabétique et réécrit entièrement `_icons.scss`. Ce fichier commence par `// Generated by scripts/generate-icons.mjs, do not edit manually.` : toute modification à la main serait écrasée au prochain lancement. Il est exclu de Prettier (`.prettierignore`) pour garder une ligne par icône.

**Noms des icônes** : IcoMoon nomme les icônes d'après leur bibliothèque d'origine (`game-icons_open-chest`). Le script retire ce préfixe (tout ce qui précède le premier `_`) et passe le reste en kebab-case (`open-chest`). Si deux icônes de bibliothèques différentes aboutissent au même nom court (les deux « close »), elles gardent leur nom complet pour ne pas s'écraser : `icon-park-outline-close` et `material-symbols-light-close`.

---

## Boutons

Fichiers des boutons dans `apps/web/src/styles/` :

| Fichier | Contenu |
|---|---|
| `variables/_buttons.scss` | Couleurs et tailles des boutons, taille par défaut (`sm`), taille des icônes |
| `mixins/_buttons-mixin.scss` | Mixins `button()` et `link-as-button()`, et leurs briques (`button-base`, `button-color`, `button-size`, `button-filled`…) |
| `base/lib/_buttons.scss` | Classes `.btn`, `.btn--{modificateur}` et classes préconstruites, chargées une fois par `globals.scss` |

Les deux utilisent les mêmes briques : un bouton fait avec les classes ou avec le mixin a exactement le même rendu.

### Variantes

| Axe | Valeurs | Classe | Paramètre du mixin |
|---|---|---|---|
| Couleur | `primary` (cyan), `secondary` (orange), `hostile` (rouge), `gold` (or), `neutral` (gris, « Outlined » dans Figma) | `.btn--primary`… | `$color` (obligatoire) |
| Remplissage | contour sur fond `--background-color` (par défaut) ou rempli (« hover » dans Figma) | `.btn--filled` | `$filled: true` |
| Taille | `sm` (par défaut), `md` | `.btn--md` | `$size: md` |
| Icône seule | bouton carré | `.btn--icon-only` | `$icon-only: true` |
| Rond | bouton rond (avec icône seule) | `.btn--round` | `$round: true` |
| Icône | nom d'une icône de la police | — | `$icon: play-fill` |
| Position de l'icône | `before` (devant le texte, par défaut) ou `after` | — | `$icon-position: after` |
| Taille de l'icône | `calc(1em + 0.2rem)` par défaut : 2px de plus que le texte du bouton | — | `$icon-size: 2rem` |
| Compteur | petit nombre à droite du texte | `<span class="btn__badge">` | — |

**Au survol et à l'appui, le bouton s'inverse** : un bouton à contour devient rempli, un bouton rempli redevient à contour. Le survol (`:hover`) n'est appliqué que sur les appareils qui en ont un vrai, souris ou trackpad (`@media (hover: hover)`) : sur écran tactile, il resterait collé après le toucher. Sur mobile, l'inversion se fait donc pendant l'appui (`:active`). Les couleurs passent par des variables CSS internes : `--btn-border` (bordure), `--btn-fill` (fond du bouton rempli), `--btn-glow` (halo du bouton rempli), `--btn-text` (texte du bouton à contour) et `--btn-on-fill` (texte du bouton rempli). Chaque couleur ne définit que ces cinq valeurs, et toutes les combinaisons fonctionnent sans être écrites une par une. Ajouter une couleur = une entrée dans la table `$_colors` de `_buttons-mixin.scss`.

**Taille des icônes** : une icône a des marges intégrées et des traits fins, à taille égale elle paraît plus petite que le texte. Dans un bouton, elle fait donc 2px de plus que le texte (`calc(1em + 0.2rem)`) : 14px pour 12px de texte, 18px pour 16px. `1em` suit la taille fluide du texte, l'icône grandit donc avec lui, toujours avec le même écart. La règle s'applique à toutes les façons d'ajouter une icône (mixin, classe `icon--{nom}` sur le bouton, `<span class="icon">` dans le bouton). Valeur dans `$button-icon-size` (`_buttons-mixin.scss`).

Le bouton gère aussi les états absents des maquettes : `:focus-visible` (contour visible pour la navigation au clavier), `:disabled` (semi-transparent, sans effet au survol), et supprime l'animation si l'utilisateur a demandé de réduire les animations dans son système (`prefers-reduced-motion`).

### Classes préconstruites

Pour les cas courants, une seule classe remplace la combinaison : toutes les combinaisons couleur × remplissage × taille existent (20 classes), sans icône.

| Classe | Équivaut à |
|---|---|
| `.btn-{couleur}` | `btn btn--{couleur}` (taille `sm`) |
| `.btn-{couleur}-filled` | `btn btn--{couleur} btn--filled` |
| `.btn-{couleur}-md` | `btn btn--{couleur} btn--md` |
| `.btn-{couleur}-filled-md` | `btn btn--{couleur} btn--filled btn--md` |

`{couleur}` : `primary`, `secondary`, `hostile`, `gold`, `neutral`. La taille par défaut des classes est `sm` (`$button-default-size`), d'où l'absence de suffixe pour elle.

```html
<button class="btn-hostile-filled-md">Attaquer</button>
```

Elles sont générées avec `@extend` : chaque classe préconstruite est ajoutée aux règles existantes (`.btn`, `.btn--hostile`…) au lieu de recopier leur contenu, le CSS reste léger. On peut toujours y ajouter une classe : `btn-primary-filled icon--play-fill`, `btn-gold btn--icon-only`.

### Utilisation

**Sans icône, avec les classes**, combinées dans le HTML :

```tsx
<button type="button" className="btn btn--primary">Valider</button>
<button type="button" className="btn btn--secondary btn--filled">Supprimer</button>
<button type="button" className="btn btn--neutral btn--sm">Annuler</button>
```

**Avec une icône, avec le mixin** dans le `.module.scss` du composant :

```scss
@use '@/styles/mixins' as *;

.launch-button {
  @include button(primary, $filled: true, $icon: play-fill);
}

.next-button {
  @include button(primary, $icon: chevron-right, $icon-position: after);
}

.delete-button {
  @include button(secondary, $icon: bin-line, $icon-only: true);
}
```

Une couleur ou une taille inconnue fait échouer la compilation avec un message explicite.

**Accessibilité d'un bouton sans texte** (`$icon-only`) : l'icône est ignorée par les lecteurs d'écran, il faut donc un libellé dans un `<span className="sr-only">` (voir ci-dessous), sinon le bouton est annoncé « bouton » sans plus.

```tsx
<button type="button" className={styles.deleteButton}>
  <span className="sr-only">Supprimer le personnage</span>
</button>
```

### Liens en forme de bouton

Un lien (`<a>`, `<Link>` de Next.js) peut avoir l'apparence d'un bouton, avec exactement les mêmes variantes.

**Avec les classes**, rien de spécial : elles fonctionnent telles quelles sur un lien.

```tsx
<Link href="/campagnes" className="btn-primary-filled-md">Mes campagnes</Link>
```

**Avec le mixin `link-as-button()`**, qui prend les mêmes paramètres que `button()` et retire en plus le soulignement du lien :

```scss
.cta-link {
  @include link-as-button(gold, $filled: true, $icon: chevron-right, $icon-position: after);
}
```

**Lien désactivé** : `disabled` n'existe pas sur un lien. On met `aria-disabled="true"` (annoncé « désactivé » par les lecteurs d'écran) : le lien devient semi-transparent et ne réagit plus à la souris. Il reste atteignable au clavier, il faut donc aussi retirer son `href` ou bloquer la navigation dans le composant.

**Lien ou bouton ?** L'apparence ne change pas le rôle : un lien mène à une autre page ou adresse (`<a href>`), un bouton déclenche une action sur place (envoyer, ouvrir, supprimer : `<button>`). Les lecteurs d'écran annoncent l'un « lien » et l'autre « bouton », et le clavier ne les active pas de la même façon (Entrée pour un lien, Entrée et Espace pour un bouton). Il faut choisir la balise selon le rôle, puis la classe selon l'apparence.

---

## Champs de formulaire

Fichiers des champs dans `apps/web/src/styles/` :

| Fichier | Contenu |
|---|---|
| `mixins/_form-mixin.scss` | Mixins `form-field`, `form-row`, `form-label`, `form-select`, `form-input`, `form-textarea` |
| `base/lib/_form.scss` | Classes `.form-field`, `.form-row`, `.form-label`, `.form-select`, `.form-input`, `.form-textarea`, chargées une fois par `globals.scss` |

| Élément | Classe | Style |
|---|---|---|
| Conteneur | `.form-field` | label au-dessus du champ, colonne avec un petit espace (`$space-xs`) |
| Ligne de champs | `.form-row` | plusieurs `.form-field` côte à côte, à largeur égale ; passent l'un sous l'autre quand un champ descendrait sous 200px (`$min-size`), sans media query |
| Label | `.form-label` | Cinzel, `$text-body-size`, `--text-color-secondary` |
| Champ texte | `.form-input` | texte saisi en Inter, pas d’encadré, une ligne en bas `--border-color`, fond transparent, texte `--text-color-secondary` en `$text-body-size` |
| Zone de texte | `.form-textarea` | même ligne en bas, fond `--border-color`, hauteur minimale 120px, agrandissable en hauteur, barre de défilement fine grise (`--input-color`) |

Les champs prennent toute la largeur de leur conteneur : c'est le composant ou la mise en page qui fixe la largeur.

États (communs au champ texte et à la zone de texte) :

| État | Rendu |
|---|---|
| Texte indicatif (`placeholder`) | `--secondary-color-light` |
| Focus | ligne `--secondary-color` |
| Erreur (`aria-invalid="true"`) | ligne `--hostile-color` |
| Désactivé (`disabled`) | semi-transparent |

Le texte saisi est en `$text-body-size`, jamais sous 16px : en dessous, Safari sur iPhone zoome sur la page quand on touche le champ.

L'état d'erreur passe par l'attribut `aria-invalid` et non par une classe : il sert aussi aux lecteurs d'écran, qui annoncent le champ comme invalide.

```tsx
<div className="form-field">
  <label className="form-label" htmlFor="email">Email</label>
  <input className="form-input" id="email" type="email" />
</div>

<div className="form-field">
  <label className="form-label" htmlFor="description">Description</label>
  <textarea className="form-textarea" id="description" />
</div>
```

Plusieurs champs sur une ligne (nom et prénom, email et confirmation…) :

```tsx
<div className="form-row">
  <div className="form-field">…Nom…</div>
  <div className="form-field">…Prénom…</div>
</div>
```

Dans un `.module.scss`, le mixin accepte une largeur minimale et un espacement : `@include form-row(30rem, $space-md);` (par défaut `20rem` et `$space-lg`).

Le `htmlFor` du label doit reprendre l'`id` du champ : un clic sur le label place le curseur dans le champ, et les lecteurs d'écran lisent le label en arrivant sur le champ.

### Liste déroulante (select)

Contrairement aux autres champs, le select est **encadré** : bordure `--border-color`, fond `--background-color-secondary`, petit arrondi (`$radius-xs`), texte `--primary-color` en Inter, chevron `chevron-down` de la police d'icônes à droite. Au survol et au focus, il s'entoure d'un halo cyan (10px de flou).

Un `<select>` ne peut pas avoir de pseudo-élément `::after` et sa flèche native ne se stylise pas de la même façon partout. Il est donc placé dans un conteneur `.form-select` qui porte le chevron ; la flèche native est masquée (`appearance: none`).

```tsx
<div className="form-select">
  <select aria-label="Trier">
    <option>Trier A - Z</option>
    <option>Trier Z - A</option>
  </select>
</div>
```

Dans un formulaire, avec un label, le select prend toute la largeur du `.form-field` :

```tsx
<div className="form-field">
  <label className="form-label" htmlFor="class">Classe</label>
  <div className="form-select">
    <select id="class">…</select>
  </div>
</div>
```

Sans label visible (tri, filtre), mettre un `aria-label` sur le `<select>` pour que les lecteurs d'écran sachent à quoi il sert.

| État | Rendu |
|---|---|
| Survol (souris uniquement) et focus | halo `--primary-color` |
| Erreur (`aria-invalid="true"` sur le `<select>`) | bordure `--hostile-color` |
| Désactivé (`disabled` sur le `<select>`) | semi-transparent |

Le conteneur détecte l'état du `<select>` avec `:has()` (par exemple `.form-select:has(select:disabled)`) : pas de classe à ajouter à la main.

La liste ouverte (les `<option>`) est dessinée par le système : fond et couleur sont appliqués sur Windows et Android, mais macOS et iOS affichent leur liste native.

---

## Boîtes

Fichiers des boîtes dans `apps/web/src/styles/` :

| Fichier | Contenu |
|---|---|
| `variables/_box.scss` | Couleurs de halo et de bordure (`$box-glow-values`) |
| `mixins/_box-mixin.scss` | Mixin `box()` et ses briques (`box-glow`, `box-rounded`, `box-no-glow`) |
| `base/lib/_box.scss` | Classes `.box` et `.box--{modificateur}`, chargées une fois par `globals.scss` |

Une boîte (carte, panneau, encart) a par défaut : fond `--background-color-secondary`, bordure 1px `--border-color`, angles droits, halo `--input-color` de 10px de flou. Elle ne fixe ni marge intérieure ni taille : c'est le composant qui les choisit.

| Modificateur | Classe | Paramètre du mixin |
|---|---|---|
| Angles arrondis (5px, `$radius-md`) | `.box--rounded` | `$rounded: true` |
| Couleur du halo et de la bordure : `primary`, `secondary`, `hostile`, `gold` (bordure et halo de cette couleur), `neutral` (par défaut : bordure `--border-color`, halo `--input-color`) | `.box--glow-{couleur}` | `$glow: gold` |
| Couleur libre (bordure et halo) | — | `$glow: var(--third-color)` |
| Flou du halo | — | `$blur: $glow-lg` |
| Sans halo | `.box--no-glow` | `$glow: false` |

```tsx
<article className="box box--rounded box--glow-gold">…</article>
```

```scss
@use '@/styles/mixins' as *;
@use '@/styles/variables' as *;

.quest-card {
  @include box(primary, $rounded: true);
  padding: $space-md;
}

.inventory-panel {
  @include box($glow: false);
}
```

Pour changer seulement la couleur du halo d'une boîte (au survol, selon un état…), le mixin `box-glow` suffit : il change aussi la bordure. Les couleurs et le flou passent par des variables CSS (`--box-glow-color`, `--box-border-color`, `--box-glow-blur`).

```scss
.quest-card:hover {
  @include box-glow(gold);
}
```

---

## Conteneur de page

Classe `.container` (`base/_layout.scss`) et mixin `container()` (`mixins/_layout-mixin.scss`), réglages dans `variables/_layout.scss` : centre le contenu de la page, limite sa largeur et ajoute des marges sur les côtés.

| Propriété | Valeur |
|---|---|
| Largeur maximale | 144rem (1440px, `$screen-xl`) |
| Marges latérales | fluides, de 16px sur mobile (`$space-md`) à 40px sur desktop (`$space-2xl`) |
| Centrage | `margin-inline: auto` |

```tsx
<main className="container">…</main>
```

Une section dont le fond doit couvrir toute la largeur de l'écran garde son fond sur l'élément extérieur et place le `.container` à l'intérieur :

```tsx
<section className={styles.hero}>
  <div className="container">…</div>
</section>
```

Le mixin accepte une autre largeur et d'autres marges, pour une page plus étroite (formulaire de connexion, texte long) : `@include container(60rem);` ou `@include container(80rem, $space-lg);`.

---

## Dégradés sur les images

Les maquettes posent des dégradés sur les images (calques « background-campagne » dans Figma) : ils fondent un ou plusieurs bords de l'image dans la couleur de fond, pour l'intégrer à son environnement et rendre lisible le texte posé dessus. Deux couleurs de fond selon l'endroit :

- `--background-color` (#080808) pour les grandes images de page (accueil, bandeaux) ;
- `--background-color-secondary` (#121414) pour les images dans les cartes et les blocs (couleur par défaut).

Fichiers des dégradés dans `apps/web/src/styles/` :

| Fichier | Contenu |
|---|---|
| `functions/_overlay-functions.scss` | Fonctions `fade()` et `fade-edges()` |
| `variables/_gradients.scss` | Dégradés nommés (`$gradient-*`) et leur table `$overlay-gradients` |
| `mixins/_overlay-mixin.scss` | Mixins `image-overlay()`, `overlay-gradient()`, `overlay-content` |
| `base/lib/_overlay.scss` | Classes `.overlay`, `.overlay--{nom}`, `.overlay__content`, chargées une fois par `globals.scss` |

### Dégradés nommés

Les plus utilisés dans les maquettes, en variable Sass (`$gradient-{nom}`) et en classe (`.overlay--{nom}`) :

| Nom | Usage | Effet |
|---|---|---|
| `campaign-card` | Image des cartes de campagne | bas fondu dans la carte, sur toute la hauteur, 20 % d'opacité à 60 % |
| `thumbnail` | Miniatures (campagne, carte de personnage) | 4 bords fondus : 30 % en haut et en bas, 10 % à gauche et à droite |
| `scene-image` | Image de scène | haut et bas fondus sur 15 % |
| `illustration` | Illustration dans un bloc | léger fondu des 4 bords, 5 % |
| `page-banner` | Bandeau de page (1128 × 200) | haut et bas pleins (`--background-color`), voile léger au centre |
| `hero` | Grande image d'accueil | bas fondu dans la page sur 30 % (`--background-color`) |
| `scene-banner` | Bandeau de scène en partie | moitié basse fondue |
| `banner-right` | Bandeau large avec texte à droite | bord droit fondu sur 10 % (`--background-color`) |

### Image en balise `<img>`

Le dégradé est posé au-dessus de l'image dans un `::after` qui couvre tout le conteneur. Il suit l'arrondi du conteneur et laisse passer les clics. Avec les classes :

```tsx
<div className="overlay overlay--campaign-card">
  <img src="…" alt="" />
  <h3 className="overlay__content">La crypte oubliée</h3>
</div>
```

Avec le mixin, dans un `.module.scss` :

```scss
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.cover {
  @include image-overlay($gradient-campaign-card);
}

.title {
  @include overlay-content;
}
```

**Éléments posés sur l'image** (titre, badge, bouton) : le `::after` se dessine au-dessus de tout le contenu du conteneur. Les éléments qui doivent rester au-dessus du dégradé prennent `.overlay__content` (ou le mixin `overlay-content` : `position: relative; z-index: 1`). Un élément déjà en `position: absolute` n'a besoin que de `z-index: 1`.

### Image en fond CSS

Quand l'image est un `background-image`, pas besoin de pseudo-élément : le dégradé s'empile avant l'image dans la même propriété (la première couche est dessinée au-dessus), et le texte du bloc passe naturellement par-dessus les fonds.

```scss
@use '@/styles/variables' as *;

.scene-card {
  background-image: $gradient-scene-image, url('…');
  background-size: cover;
}
```

### Dégradé sur mesure

`fade($side, $length, $color, $mid-alpha, $mid-at)` crée un fondu depuis un bord : couleur pleine sur le bord `$side` (`top`, `right`, `bottom`, `left`), transparente à `$length` de ce bord.

```scss
fade(bottom, 30%)                                 // net : 2 arrêts
fade(bottom, 30%, $mid-alpha: 0.2)                // doux : 20 % d'opacité à mi-chemin
fade(bottom, 100%, $mid-alpha: 0.2, $mid-at: 60%) // arrêt intermédiaire à 60 % du fondu
fade(right, 10%, var(--background-color))         // autre couleur de fond
```

`fade-edges($color, $top, $right, $bottom, $left)` combine plusieurs fondus, un par bord renseigné (effet vignette) :

```scss
.thumbnail {
  @include image-overlay(fade-edges($top: 30%, $bottom: 30%, $left: 10%, $right: 10%));
}
```

Un dégradé sur mesure peut aussi remplacer celui d'une classe : `@include overlay-gradient(fade(top, 40%));` sur un élément qui a déjà `.overlay`.

---

## Texte réservé aux lecteurs d'écran

Un texte utile aux seuls lecteurs d'écran (libellé d'un bouton qui ne montre qu'une icône, précision sur une information donnée par une icône) est placé dans un `<span class="sr-only">` : il est lu mais invisible à l'écran.

```tsx
<button type="button">
  <span className="icon icon--bin-line" aria-hidden="true" />
  <span className="sr-only">Supprimer le personnage</span>
</button>
```

| Élément | Valeur |
|---|---|
| Classe globale | `.sr-only` (`apps/web/src/styles/base/_utilities.scss`) |
| Mixin | `@include visually-hidden;` dans un `.module.scss` (`@use '@/styles/mixins' as *;`) |
| À ne pas utiliser | `display: none` et `visibility: hidden`, qui cachent aussi l'élément aux lecteurs d'écran |

Choix techniques :

- **1 × 1 pixel et non 0** : certains lecteurs d'écran ignorent un élément de taille nulle, comme s'il n'était pas affiché. `clip-path: inset(50%)` rogne ce pixel pour qu'il soit invisible, `margin: -1px` compense sa taille.
- **`position: absolute` sans coordonnées** : l'élément sort du flux (il ne décale rien) mais reste à sa place naturelle, quel que soit le parent positionné ; le cadre de suivi des lecteurs d'écran s'affiche donc au bon endroit.
- **`white-space: nowrap`** : évite que certains lecteurs lisent le texte mot par mot à cause des retours à la ligne dans une boîte de 1px.

---
