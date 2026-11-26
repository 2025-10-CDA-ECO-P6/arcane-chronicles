# Arcane Chronicles — Design system

Mise en œuvre de la [charte graphique](maquettes/brand.md) dans le code du front (`apps/web/src/styles/`) : unités, variables Sass, mixins et classes globales réutilisables.

## Organisation des fichiers

Les fichiers sont rangés **par type** : les variables d'un côté, les fonctions d'un autre, les mixins d'un autre, et les classes globales dans `base/`.

| Dossier ou fichier | Contenu |
|---|---|
| `globals.scss` | Point d'entrée, importé par `app/layout.tsx` : charge les couleurs et toutes les classes globales une fois, et pose `*`, `html` et `body` |
| `variables/` | **Uniquement des variables** : couleurs (variables CSS), breakpoints, espacements, arrondis, typographie, ombres, noms des icônes, réglages des boutons, des boîtes, du conteneur, dégradés des images |
| `functions/` | **Uniquement des fonctions** : `_global-functions.scss` (`with-alpha()`, `fluid()`, `glow()`), `_layout-functions.scss` (`breakpoint()`), `_overlay-functions.scss` (`fade()`, `fade-edges()`) |
| `mixins/` | **Uniquement des mixins** : `_global-mixin.scss` (`visually-hidden`, `truncate`) puis un fichier par élément (`_icons-mixin.scss`, `_effects-mixin.scss`, `_buttons-mixin.scss`, `_links-mixin.scss`, `_form-mixin.scss`, `_box-mixin.scss`, `_layout-mixin.scss`, `_overlay-mixin.scss`, `_typography-mixin.scss`) |
| `animations/` | **Uniquement des mixins d'animation** : chacun écrit une `@keyframes` (`_glow-animation.scss`, `_slide-animation.scss`, `_smoke-animation.scss`), voir [Animations](#animations) |
| `base/` | **Classes et styles globaux** : `_reset.scss`, `_typography.scss` (balises, `.text-as--h1` à `h6`), `_layout.scss` (`.main-content`), `_utilities.scss` (`.sr-only`, `.truncate`) |
| `base/lib/` | Classes des éléments d'interface : `_icons.scss`, `_buttons.scss`, `_links.scss`, `_form.scss`, `_box.scss`, `_overlay.scss` (et les éléments à venir) |

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

Cette base est posée par `html { font-size: 62.5%; }` dans `apps/web/src/styles/globals.scss` (62,5 % des 16px par défaut du navigateur). Un pourcentage plutôt que `10px` en dur respecte la taille de texte choisie par l'utilisateur dans son navigateur : s'il l'agrandit, toute l'interface suit. Le texte courant (`body`) va de 12px sur mobile à 16px sur desktop (`$text-body-size`, voir « Tailles fluides »).

## Breakpoints

Variables Sass dans `apps/web/src/styles/variables/_breakpoints.scss`.

| Variable | Valeur | Cible |
|---|---|---|
| `$screen-s` | `375px` | Mobile (interface joueur, 350 à 375px) |
| `$screen-sm` | `500px` | Limite entre téléphone et tablette : `until(sm)` vise tous les téléphones en portrait (jusqu'à 430px environ), y compris le 375px de la maquette, que `until(s)` exclut |
| `$screen-m` | `768px` | Tablette en portrait (iPad), valeur `md` de Bootstrap et Tailwind |
| `$screen-lg` | `1024px` | Tablette en paysage, petit portable |
| `$screen-xl` | `1440px` | Ordinateur portable et écran courant (interface MJ) |
| `$screen-xxl` | `1920px` | Écran Full HD |

Les media queries s'écrivent avec les mixins de `apps/web/src/styles/mixins/_layout-mixin.scss` (transmis par `mixins/_index.scss`), avec le nom du breakpoint (`s`, `sm`, `m`, `lg`, `xl`, `xxl`) ou une valeur en px pour un cas particulier :

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
| `$radius-md` | `0.5rem` (5px) | Boutons, cartes, coffres |
| `$radius-lg` | `0.8rem` (8px) | Menu de navigation |
| `$radius-xl` | `1rem` (10px) | Blocs, panneaux, statuts ; boîtes arrondies (`.box--rounded`, mixin `box-rounded`, carte de connexion) |
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
| `$font-weight-regular` | `300` | Graisse du texte courant (appliquée à `body`) et des titres |
| `$font-weight-semibold` | `600` | Mise en avant |
| `$font-weight-bold` | `700` | `b`, `strong` |

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

**Style de titre sans balise de titre** : un texte qui doit ressembler à un titre sans en être un dans la structure de la page (nom du site dans le header, slogan d'une bannière) reste un `<p>` et prend le style d'un niveau de titre. Les lecteurs d'écran naviguent par titres : un `h2` placé avant le `h1` de la page, ou répété sur toutes les pages, brouille ce plan.

- Classe globale : `.text-as--h1` à `.text-as--h6` (`base/_typography.scss`), par exemple `<p class="text-as--h2">`.
- Mixin, dans un `.module.scss` : `@include text-heading-transform(h3);` (`mixins/_typography-mixin.scss`). Il applique la police, la taille, la graisse et l'interlignage du niveau demandé.

Les balises `h1` à `h6` utilisent ce même mixin : un titre et un texte au style de titre ont toujours le même rendu.

**Textes** : quatre tailles, partagées par les balises et les composants.

| Variable fluide | Mobile | Desktop | Balises (`base/_typography.scss`, `body` dans `globals.scss`) | Dans les composants |
|---|---|---|---|---|
| `$text-body-size` | `$font-size-sm` (12px) | `$font-size-md` (16px) | `body`, hérité par `p`, `li`, `dd`, `blockquote`, `td`, `span`, `a`… ; `label`, `legend`, `input`, `textarea`, `select`, `button` | Narration, descriptions, libellés de formulaire |
| `$text-button-size` | `$font-size-sm` (12px) | `$font-size-md` (16px) | — | Texte des boutons `md` |
| `$text-small-size` | `$font-size-xs` (10px) | `$font-size-sm` (12px) | — | Textes de cartes, inventaire, objectifs, caractéristiques (FOR, DEX…) |
| `$text-caption-size` | `$font-size-2xs` (8px) | `$font-size-xs` (10px) | `small`, `figcaption`, `caption` | Mentions, compteurs, statuts (« 32/38 PV », « Actif »), surtitres, valeurs des badges (PV, CA, niveau) |

Règle générale : le desktop reprend la taille des maquettes, le mobile est un cran en dessous, texte courant compris (12px sur mobile, 16px sur desktop).

Point ouvert : les champs de formulaire héritent de ce texte courant, donc 12px sur mobile. Sous 16px, Safari sur iPhone zoome automatiquement sur le champ au moment de la saisie. La taille des champs sur mobile reste à trancher.

Les styles des balises sont dans `apps/web/src/styles/base/` : `_typography.scss` pour les tailles et polices (titres, libellés, champs…), `_reset.scss` pour neutraliser les styles par défaut du navigateur. `globals.scss` ne garde que `*`, `html` et `body`, et charge les autres fichiers.

Le reset (`base/_reset.scss`) :

- `a` : ni soulignement ni bleu par défaut, le lien prend la couleur du texte autour. Un lien placé au milieu d'un paragraphe doit rester repérable autrement que par la couleur (soulignement, icône, graisse) : c'est un critère d'accessibilité (WCAG 1.4.1), à gérer dans le composant.
- `ul`, `ol` : sans puces ni numéros. Safari (VoiceOver) cesse alors d'annoncer la liste comme une liste, sauf dans un `nav` ; quand le nombre d'éléments compte pour l'utilisateur (inventaire, liste de joueurs), ajouter `role="list"` sur la balise.
- `img`, `picture`, `svg`, `video` : en `display: block` pour supprimer l'espace blanc sous l'image (elle est alignée sur la ligne de texte par défaut), et jamais plus larges que leur conteneur (`max-inline-size: 100%`).

Choix pour les balises globales :

- `span` et `li` n'ont pas de taille propre : `span` sert partout (dans les boutons, les titres, les icônes `.icon`, `.sr-only`) et serait réduit jusque dans un `h1` ; une liste peut se trouver dans un menu comme dans une narration. Ils héritent de la taille du texte autour.
- `input`, `textarea`, `select` et `button` reçoivent `font: inherit` et `color: inherit` : par défaut, les navigateurs leur donnent la police du système (environ 13px) et leur propre couleur au lieu de celles de la page. Ils prennent ainsi `$text-body-size`, soit 12px sur mobile : sous 16px, Safari sur iPhone zoome sur la page au toucher d'un champ (point à corriger, voir « Champs de formulaire »).
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

## Animations

Les animations partagées sont dans `apps/web/src/styles/animations/`, importées avec `@use '@/styles/animations' as *;`.

Ce sont des **mixins qui écrivent une `@keyframes`**, et non des `@keyframes` globales. Les CSS Modules renomment les `@keyframes` de chaque fichier (`glow-appear` devient `Header-module__x1y2__glow-appear`) : une animation déclarée dans un fichier n'est donc pas visible depuis un autre. Le module qui veut l'animation appelle le mixin, ce qui crée la `@keyframes` dans son propre fichier, puis l'utilise par son nom dans `animation`.

| Mixin | `@keyframes` créée | Effet | Paramètres |
|---|---|---|---|
| `glow-appear-animation($glow-color, $start-scale)` | `glow-appear` | apparition en fondu, avec un halo et un grossissement | `$glow-color` (`var(--secondary-color)` par défaut, `null` pour ne pas mettre de halo), `$start-scale` (`0.4` par défaut, `null` pour ne pas grossir) |
| `glow-pulse-animation($color)` | `glow-pulse` | halo qui pulse, à jouer en boucle (`infinite alternate`) | `$color` (`var(--secondary-color)` par défaut) |
| `smoke-reveal-animation($size)` | `smoke-reveal` | l'élément apparaît à travers des volutes de fumée (masque CSS animé) | `$size` : `large` (par défaut, éléments larges comme le header) ou `small` (éléments étroits comme un logo) ; une autre valeur fait échouer la compilation |
| `slide-down-animation` | `slide-down` | l'élément glisse depuis le haut | — |

```scss
@use '@/styles/animations' as *;

.banner__logo {
  animation: smoke-reveal 6s linear backwards;
}

@include smoke-reveal-animation($size: small);
```

La fumée utilise un minutage `linear` : avec `ease-out`, le ralentissement s'appliquerait à chaque étape de la `@keyframes` et l'animation marquerait des pauses. Un masque coupe tout ce qui dépasse de l'élément, halo compris : sur un même élément, on ne combine pas `smoke-reveal` et un halo en `drop-shadow` ; on met le halo sur le parent (c'est le cas du logo de la bannière d'accueil).

Chaque module coupe ses animations quand l'utilisateur demande moins d'animations (`prefers-reduced-motion: reduce`).

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
| Transparent | fond transparent au lieu de `--background-color`, pour un bouton posé sur une image ou une vidéo (bouton menu du header de l'accueil) ; sans effet sur un bouton rempli, le survol garde son fond | `.btn--transparent` | `$transparent: true` |
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

## Liens

Fichiers des liens dans `apps/web/src/styles/` :

| Fichier | Contenu |
|---|---|
| `variables/_links.scss` | Table des couleurs (`$link-color-values` : nom → variable CSS), couleur par défaut (`$link-default-color`) et couleur du lien actif (`$link-active-color`) |
| `mixins/_links-mixin.scss` | Mixins `link($color, $underline)`, `link-color($color)`, `link-active` et `link-no-underline` |
| `base/lib/_links.scss` | Classes `.link`, `.link--{couleur}`, `.link--no-underline` et `.link--active`, chargées une fois par `globals.scss` |

Le reset (`base/_reset.scss`) retire tout style aux balises `<a>` : couleur héritée du texte, pas de soulignement. Un lien n'a donc aucune apparence par défaut, ce qui évite qu'un lien en forme de bouton, une carte cliquable ou un élément du menu hérite d'un style de lien texte. Un lien dans un texte prend explicitement la classe `.link` :

| État | Rendu |
|---|---|
| Normal | texte de la couleur du lien (`--secondary-color` par défaut), souligné |
| Survol (souris uniquement, `@media (hover: hover)`) et appui | halo de la même couleur autour des lettres (`$glow-sm`) |
| Focus clavier (`:focus-visible`) | contour de la même couleur, 2px, décalé de 2px |

La couleur passe par une variable CSS interne, `--link-color`, utilisée à la fois par le texte, le halo et le contour : une seule valeur à changer pour tout recolorer. Couleurs possibles : `primary`, `secondary` (par défaut), `third`, `gold`, `hostile`, `text` (`--text-color-primary`) et `text-secondary` (`--text-color-secondary`) ; une couleur inconnue fait échouer la compilation. Ajouter une couleur = une entrée dans `$link-color-values`, avec la variable CSS correspondante.

| Modificateur | Effet |
|---|---|
| `.link--no-underline` | Retire le soulignement (liens de navigation) ; mixin : `@include link($underline: false)` ou `@include link-no-underline` |
| `.link--active` | Lien actif : couleur `--primary-color` et halo permanent ; mixin : `@include link-active` |

Le style actif s'applique aussi automatiquement à un lien qui porte `aria-current="page"`. C'est ce que fait le composant React `NavLink` (`components/lib/NavLink/`) : il compare l'adresse de la page à son `href` (avec `usePathname()`) et pose `aria-current="page"` sur le lien de la page en cours, ce qui l'annonce aussi comme « page actuelle » aux lecteurs d'écran. Il ajoute `link link--no-underline` ; `className` permet d'y ajouter une couleur. Pour `/`, le lien n'est actif que sur l'accueil exact ; pour les autres, il l'est aussi sur les sous-pages (`/campagnes/42` active `/campagnes`), sauf avec `exact`.

```tsx
<nav>
  <NavLink href="/" className="link--text-secondary">Accueil</NavLink>
  <NavLink href="/catalogue" className="link--text-secondary">Catalogue</NavLink>
</nav>
```

L'apparition du halo est animée (0,2 s), sauf si l'utilisateur a demandé de réduire les animations dans son système (`prefers-reduced-motion`).

```tsx
<p>
  Vous n'avez pas encore de compte ? <Link href="/register" className="link">Inscription</Link>
</p>

<Link href="/catalogue" className="link link--gold">Voir le catalogue</Link>
```

Dans un `.module.scss` : `@include link;` (couleur par défaut) ou `@include link(gold);`. Pour changer seulement la couleur d'un élément qui a déjà le style de lien : `@include link-color(primary);`.

---

## Champs de formulaire

Fichiers des champs dans `apps/web/src/styles/` :

| Fichier | Contenu |
|---|---|
| `mixins/_form-mixin.scss` | Mixins `form-field`, `form-row`, `form-label`, `form-error`, `form-select`, `form-input`, `form-textarea` |
| `base/lib/_form.scss` | Classes `.form-field`, `.form-row`, `.form-label`, `.form-error`, `.form-select`, `.form-input`, `.form-textarea`, chargées une fois par `globals.scss` |

| Élément | Classe | Style |
|---|---|---|
| Conteneur | `.form-field` | label au-dessus du champ, colonne avec un petit espace (`$space-xs`) |
| Ligne de champs | `.form-row` | plusieurs `.form-field` côte à côte, à largeur égale ; passent l'un sous l'autre quand un champ descendrait sous 200px (`$min-size`), sans media query |
| Label | `.form-label` | Cinzel, `$text-body-size`, `--text-color-secondary` |
| Champ texte | `.form-input` | texte saisi en Inter, pas d’encadré, une ligne en bas `--border-color`, fond transparent, texte `--text-color-secondary` en `$text-body-size` |
| Message d'erreur | `.form-error` | texte `--hostile-color` en Inter, `$text-small-size`, sous le champ |
| Zone de texte | `.form-textarea` | même ligne en bas, fond `--border-color`, hauteur minimale 120px, agrandissable en hauteur, barre de défilement fine grise (`--input-color`) |

Les champs prennent toute la largeur de leur conteneur : c'est le composant ou la mise en page qui fixe la largeur.

États (communs au champ texte et à la zone de texte) :

| État | Rendu |
|---|---|
| Texte indicatif (`placeholder`) | `--secondary-color-light` |
| Focus | ligne `--secondary-color` |
| Erreur (`aria-invalid="true"`) | ligne `--hostile-color` |
| Désactivé (`disabled`) | semi-transparent |

Le texte saisi est en `$text-body-size`. **Point ouvert** : il fait 12px sur mobile depuis le passage du texte courant en `$font-size-sm` ; sous 16px, Safari sur iPhone zoome sur la page quand on touche le champ. Il faudra donner aux champs une taille d'au moins 16px sur mobile.

L'état d'erreur passe par l'attribut `aria-invalid` et non par une classe : il sert aussi aux lecteurs d'écran, qui annoncent le champ comme invalide. Le message d'erreur (`.form-error`) est relié au champ par `aria-describedby` : il est lu juste après le label quand on arrive sur le champ.

### Composant React `Input`

`apps/web/src/components/lib/form/Input/` assemble le conteneur, le label, le champ et le message d'erreur. Il accepte les attributs d'un `<input>` (`name`, `value`, `required`, `autoComplete`…) en plus de ses props ; `onChange` est remplacé par `handleChange` :

| Prop | Rôle |
|---|---|
| `label` (obligatoire) | Texte du label, relié au champ par un identifiant généré (`useId`) si aucun `id` n'est fourni |
| `srOnly` | Label masqué à l'écran mais lu par les lecteurs d'écran |
| `inputType` | `text` (par défaut), `email`, `password`, `search`, `tel`, `url`, `number` |
| `error` | Message affiché sous le champ ; passe aussi le champ en `aria-invalid` |
| `handleChange` | Fonction appelée à chaque saisie, pour un champ contrôlé (`value` gardée dans un état React) |
| `aria-describedby` | Identifiant d'un texte qui décrit le champ (règles à respecter, aide) ; le composant y ajoute celui du message d'erreur, lu en premier |

```tsx
<Input
  label="Email"
  inputType="email"
  name="email"
  autoComplete="email"
  required
  value={values.email}
  handleChange={handleChange}
  error={errors.email}
/>
```

### Composant React `PasswordStrength`

`apps/web/src/components/lib/form/PasswordStrength/` se place sous le champ mot de passe d'un formulaire de création (inscription, plus tard changement de mot de passe). Il reçoit le mot de passe saisi (`password`) et affiche :

- **une barre de progression** (composant [`ProgressBar`](#barre-de-progression)) : sa longueur suit le nombre de règles respectées sur 5 ; elle est `--hostile-color` tant qu'il en manque une et passe en `--primary-color` quand le mot de passe est valable. Elle n'a pas de `label` : elle est donc masquée aux lecteurs d'écran, qui ont le résumé décrit plus bas ;
- **un bouton rond avec une icône** (`question-light` en attendant une icône « info » dans la police d'icônes) qui ouvre une petite bulle au-dessus du bouton avec les règles : `✓` en `--primary-color` si la règle est respectée, `✗` en `--hostile-color` sinon. L'état est aussi écrit pour les lecteurs d'écran (« respectée », « non respectée ») : la couleur seule ne suffit pas (WCAG 1.4.1). Le bouton porte `aria-expanded` et `aria-controls` ; la bulle se ferme avec Échap ou un clic ailleurs.

Les règles et leurs libellés sont dans `apps/web/src/lib/passwordRules.ts` (`checkPasswordRules(password)` renvoie chaque règle avec `isMet`). Elles s'appuient sur les constantes de `packages/shared` (`PASSWORD_MIN_LENGTH`, `PASSWORD_MAX_LENGTH`, `PASSWORD_PATTERNS`) : ce sont les mêmes que celles du schéma Zod vérifié par l'API, il n'y a qu'un endroit à modifier.

La bulle est un composant [`Toggletip`](#bulle-dinformation-toggletip), ouvert vers le haut (`placement="top"`) pour ne pas recouvrir le bouton d'envoi.

Le composant écrit aussi un **résumé réservé aux lecteurs d'écran** (`.sr-only`), qui porte l'identifiant reçu dans `rulesId` : « Règles à respecter : Une majuscule, Un chiffre. », puis « Toutes les règles du mot de passe sont respectées. ». Le champ mot de passe y est relié par `aria-describedby` : le lecteur d'écran annonce les règles manquantes en arrivant sur le champ, sans devoir ouvrir la bulle. Le résumé est un texte à part, toujours présent, plutôt que la liste de la bulle : quand la bulle est fermée, la liste est cachée (`hidden`), et tous les navigateurs ne lisent pas un contenu caché désigné par `aria-describedby`.

```tsx
const passwordRulesId = useId();

<Input label="Mot de passe" inputType="password" name="password" autoComplete="new-password" aria-describedby={passwordRulesId} … />
<PasswordStrength password={values.password} rulesId={passwordRulesId} />
```

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

## Bulle d'information (`Toggletip`)

Composant React `Toggletip` (`apps/web/src/components/lib/ui/Toggletip/`) : un bouton rond avec une icône qui ouvre, au clic, une petite bulle sous lui ou au-dessus, alignée sur son bord droit. Le contenu de la bulle est passé en `children`.

| Prop | Rôle |
|---|---|
| `label` | texte du bouton, lu par les lecteurs d'écran (le bouton n'affiche que l'icône) |
| `icon` | icône du bouton, `question-light` par défaut |
| `placement` | `bottom` (bulle sous le bouton, par défaut) ou `top` (au-dessus, quand le dessous est occupé, par exemple par le bouton d'envoi d'un formulaire) |
| `children` | contenu de la bulle |
| `className` | classe ajoutée, pour le placer dans son parent |

Le bouton porte `aria-expanded` et `aria-controls` ; la bulle se ferme avec Échap ou un clic ailleurs.

```tsx
<Toggletip label="Règles du mot de passe">
  <ul>…</ul>
</Toggletip>
```

Toute la logique (état ouvert, clic en dehors, Échap, identifiant qui relie le bouton à la bulle) vient du hook `useDisclosure` (`apps/web/src/hooks/`). Un contenu qui s'ouvre avec un autre balisage (menu, filtres…) utilise directement ce hook : il donne `isOpen`, `toggle`, `close`, `closeOnEscape` (à brancher sur `onKeyDown`), une `containerRef` (un clic en dehors de ce conteneur ferme le contenu) et un `panelId` unique pour `aria-controls`. Ni l'un ni l'autre ne gère une modale (piège du focus, reste de la page inerte) : pour cela, utiliser la balise `<dialog>` ouverte avec `showModal()`.

## Barre de progression

Composant React `ProgressBar` (`apps/web/src/components/lib/ui/progress-bar/ProgressBar/`), pour toute progression : règles d'un mot de passe, chapitres joués, points de vie…

| Prop | Rôle |
|---|---|
| `value`, `max` | valeur actuelle et maximum (obligatoires) |
| `min` | minimum, `0` par défaut |
| `color` | `primary` (par défaut), `secondary`, `third`, `gold` ou `hostile` |
| `completeColor` | couleur prise quand la barre est pleine (facultatif) |
| `label` | nom lu par les lecteurs d'écran ; sans `label`, la barre est décorative et masquée (`aria-hidden`) |
| `valueText` | valeur lue à la place du nombre brut, par exemple « 3 chapitres sur 11 » |
| `className` | classe ajoutée, pour la placer dans son parent |

Le composant calcule lui-même le pourcentage à partir de `value`, `min` et `max` (borné entre 0 et 100 %) et le passe au CSS par une variable, `--progress-value`, dans l'attribut `style`. C'est la seule façon de transmettre une longueur quelconque au CSS : un attribut `data-*` ne peut pas devenir une largeur (`attr()` ne marche pas pour les tailles dans tous les navigateurs). L'attribut `style` ne porte que cette donnée ; l'apparence reste dans le SCSS. La barre se remplit avec une transition, coupée si l'utilisateur demande moins d'animations.

Avec un `label`, la barre porte `role="progressbar"` et `aria-valuenow`, `aria-valuemin`, `aria-valuemax` (et `aria-valuetext` si `valueText` est donné).

```tsx
<ProgressBar value={3} max={11} label="Chapitres joués" valueText="3 chapitres sur 11" />
<ProgressBar value={metCount} max={5} color="hostile" completeColor="primary" />
```

Les composants de progression sont regroupés dans `progress-bar/` : `ProgressBar`, `ProgressRing` et `SegmentedProgress`.

### Anneau de progression (`ProgressRing`)

Composant React `ProgressRing` (`apps/web/src/components/lib/ui/progress-bar/ProgressRing/`) : un anneau qui se remplit dans le sens des aiguilles d'une montre à partir de midi, avec le pourcentage au centre. Il sert pour la progression globale d'une campagne.

| Prop | Rôle |
|---|---|
| `value` | pourcentage, de 0 à 100 (borné) |
| `label` | nom lu par les lecteurs d'écran |
| `color` | `primary` (par défaut), `secondary`, `third`, `gold` ou `hostile` |
| `background` | couleur du fond sur lequel il est posé, `primary` (par défaut) ou `secondary` : le disque central prend cette couleur pour former l'anneau |
| `className` | classe ajoutée, pour le placer dans son parent |

L'anneau est un `conic-gradient` (la partie remplie, puis le reste à 20 % d'opacité), recouvert au centre par un `radial-gradient` de la couleur du fond. Comme pour la barre, la valeur passe au CSS par `--progress-value`. Il n'a pas de largeur propre : il est carré (`aspect-ratio: 1`) et prend la hauteur que lui donne son parent (par exemple une cellule de grille `auto 1fr`).

```tsx
<ProgressRing value={42} label="Progression de la campagne" background="secondary" />
```

### Progression par segments (`SegmentedProgress`)

Composant React `SegmentedProgress` (`apps/web/src/components/lib/ui/progress-bar/SegmentedProgress/`) : une barre découpée en segments, un par étape (par exemple un par chapitre).

| Prop | Rôle |
|---|---|
| `segments` | état de chaque segment, dans l'ordre : `done` (rempli), `current` (en cours, avec un halo) ou `todo` (vide) |
| `currentProgress` | pourcentage de remplissage du segment en cours (facultatif) |
| `label` | nom lu par les lecteurs d'écran |
| `valueText` | valeur lue à la place du nombre brut, par exemple « 2 chapitres terminés sur 5, chapitre en cours à 40 % » |
| `color` | `primary` (par défaut), `secondary`, `third`, `gold` ou `hostile` |
| `className` | classe ajoutée |

La barre porte `role="progressbar"` ; `aria-valuenow` est le nombre de segments terminés et `aria-valuemax` le nombre total.

```tsx
<SegmentedProgress
  segments={['done', 'done', 'current', 'todo']}
  currentProgress={40}
  label="Chapitres"
  valueText="2 chapitres terminés sur 4, chapitre en cours à 40 %"
/>
```

## Étiquette (`Tag`)

Composant React `Tag` (`apps/web/src/components/lib/ui/Tag/`) : une courte étiquette, par exemple le statut d'une campagne.

| Prop | Rôle |
|---|---|
| `text` | texte de l'étiquette |
| `color` | `primary` (par défaut), `secondary`, `third`, `gold` ou `hostile` |
| `dot` | ajoute une pastille (`Dot`) de la même couleur devant le texte |
| `className` | classe ajoutée |

```tsx
<Tag text="En cours" color="primary" dot />
```

## Badge de filtre (`FilterBadge`)

Composant React `FilterBadge` (`apps/web/src/components/lib/ui/FilterBadge/`) : une pastille cliquable qui applique un filtre. Changer de filtre change l'adresse de la page (`?status=…`) : c'est donc un **lien** (`Link` de Next), pas un bouton. Le lien garde le clic molette, l'ouverture dans un onglet et le retour arrière, et le composant reste un composant serveur.

| Prop | Rôle |
|---|---|
| `label` | texte du badge |
| `href` | adresse filtrée, construite avec `buildUrl` (`lib/searchParams.ts`) |
| `count` | nombre d'éléments correspondant au filtre, affiché après le texte (facultatif) |
| `isActive` | filtre en cours : badge rempli de `--primary-color`, et `aria-current="true"` pour les lecteurs d'écran |
| `className` | classe ajoutée |

Tous les badges sont en `--primary-color` : bordure et léger halo, rempli au survol et quand le filtre est actif. Le lien ne remonte pas en haut de la page (`scroll={false}`) : la liste filtrée s'affiche sous les badges.

```tsx
<FilterBadge label="En cours" href="/dashboard/campaigns?status=IN_PROGRESS" isActive />
```

### Barre de filtres (`FilterToolbar`)

Composant React `FilterToolbar` (`apps/web/src/components/lib/toolbar/FilterToolbar/`) : un badge « Toutes » puis un badge par option, dans une `<nav>` nommée par `label`, suivie de `children` (la barre de recherche). Sur mobile (en dessous de `m`, 768px), les badges sont remplacés par une liste déroulante (`FilterSelect`) avec les mêmes options ; le CSS affiche l'un ou l'autre. Il ne connaît pas les campagnes : la page lui donne les options et leurs nombres.

| Prop | Rôle |
|---|---|
| `label` | nom de la barre (et du select) lu par les lecteurs d'écran |
| `name` | paramètre de l'adresse modifié, par exemple `status` |
| `options` | liste de `{ value, label, count? }` |
| `pathname`, `params` | adresse de la page et ses paramètres actuels |
| `allLabel` | texte du badge sans filtre, `Toutes` par défaut |
| `allCount` | nombre total, affiché sur « Toutes » (facultatif) |
| `children` | contenu placé à côté des badges, hors de la `<nav>` (par exemple `SearchBar`) |
| `className` | classe ajoutée |

`buildUrl(pathname, params, changes)` garde les autres paramètres de l'adresse et ne change que ceux de `changes` (une valeur `undefined` ou vide retire le paramètre). Un filtre et une recherche se cumulent donc : cliquer « En cours » après avoir cherché « dragon » donne `?search=dragon&status=IN_PROGRESS`. Une valeur inconnue dans l'adresse est ignorée : « Toutes » reste actif.

```tsx
<FilterToolbar
  label="Filtrer les campagnes par statut"
  name="status"
  options={statusOptions}
  pathname="/dashboard/campaigns"
  params={params}
>
  <SearchBar … />
</FilterToolbar>
```

Sur le tableau de bord, les nombres suivent la recherche : avec « dragon » cherché, « En cours » compte les campagnes en cours qui contiennent « dragon », et « Toutes » toutes celles qui le contiennent.

### Filtre en liste déroulante (`FilterSelect`)

Composant React `FilterSelect` (`apps/web/src/components/lib/ui/FilterSelect/`), affiché par `FilterToolbar` sur mobile : un `<select>` dans le conteneur `.form-select` (voir [Liste déroulante](#liste-déroulante-select)), avec `aria-label`. Chaque option affiche son nombre entre parenthèses, par exemple « En cours (2) ». Choisir une option change l'adresse aussitôt, sans bouton à valider : c'est un composant client (`'use client'`) qui appelle `router.push(buildUrl(…), { scroll: false })`. « Toutes » retire le paramètre ; une valeur inconnue dans l'adresse sélectionne « Toutes ». Ses props sont celles de `FilterToolbar`, sans `children`.

## Barre de recherche (`SearchBar`)

Composant React `SearchBar` (`apps/web/src/components/lib/ui/SearchBar/`) : un champ de recherche et un bouton loupe, dans une balise `<search>`, qui signale la zone de recherche aux lecteurs d'écran. Il réutilise les composants `Input` (`type="search"`, libellé masqué avec `srOnly`) et `Button` (icône `search-sharp`, texte « Rechercher » lu par les lecteurs d'écran).

| Prop | Rôle |
|---|---|
| `label` | libellé du champ, lu par les lecteurs d'écran |
| `name` | paramètre de l'adresse rempli par la recherche, par exemple `search` |
| `pathname`, `params` | adresse de la page et ses paramètres actuels |
| `placeholder` | texte indicatif du champ (facultatif) |
| `className` | classe ajoutée |

C'est un formulaire en `GET` envoyé à `pathname` : à la validation, le navigateur construit lui-même `?search=…`. Les autres paramètres de l'adresse (le filtre de statut) sont recopiés dans des champs cachés, pour ne pas être perdus. Le champ affiche la recherche en cours.

Quand la place manque, seul le bouton rond est affiché. Le repliement dépend de la largeur de la toolbar et non de celle de l'écran : `@container (max-width: 66rem)`, `FilterToolbar` étant un conteneur. Il s'applique aussi dans tous les cas sur mobile (`until(m)`, sous 768px), et sur desktop quand la sidebar ouverte réduit la place. Les deux conditions incluent le même mixin local `_collapsed`, pour ne pas recopier le bloc (le CSS ne sait pas écrire « `@container` ou `@media` » en une seule condition). La taille du bouton, elle, dépend de l'écran (variable `--search-button-size`) : 3,2rem sans bordure sur desktop, 3,6rem avec une bordure sur mobile (`until(m)`), plus confortable au doigt. Fermé, le champ a la taille du bouton et se cache derrière lui ; au premier clic, il s'allonge vers la gauche depuis le bouton jusqu'à couvrir toute la largeur de son conteneur (`100cqi` : `FilterToolbar` est un conteneur, `container-type: inline-size`) et reçoit le focus. Pendant qu'il est ouvert, la barre porte `data-open` : `FilterToolbar` s'en sert (`:has([data-open])`) pour cacher le select dès l'ouverture (et ne le réafficher qu'une fois la pilule rétractée) : sinon ses angles dépasseraient autour de l'extrémité arrondie de la pilule pendant qu'elle glisse. Une fois ouvert, un clic sur la loupe ou Entrée lance la recherche. Échap le referme et rend le focus au bouton, tout comme un clic en dehors. Cette logique est dans le hook `useSearchBar` (`apps/web/src/hooks/`), construit sur `useDisclosure`. Le champ reste ouvert tant qu'une recherche est active. Fermé, il est en `visibility: hidden` : on ne peut pas y arriver avec Tab. À partir de 768px, la barre est toujours complète ; le premier clic sur la loupe, champ vide, place le focus dans le champ. Ce comportement demande du JavaScript : le composant est un composant client (`'use client'`).

La page compare la recherche au titre et à la description avec `matchesSearch` (`lib/search.ts`), qui ignore les majuscules, les accents et le style d'apostrophe : « l'ile » trouve « L’Île ».

```tsx
<SearchBar
  label="Rechercher une campagne"
  name="search"
  pathname="/dashboard/campaigns"
  params={params}
  placeholder="Rechercher une campagne"
/>
```

## Bandeau de page (`PageHeader`)

Composant React `PageHeader` (`apps/web/src/components/lib/PageHeader/`) : le bandeau en haut d'une page, sur toute la largeur, avec le titre `h1` et une image de fond fondue dans le fond de la page en haut et en bas.

| Prop | Rôle |
|---|---|
| `title` | titre de la page (`h1`) |
| `image` | image de fond : une image importée (`StaticImageData`) ou une URL (image d'une campagne) ; sans `image`, l'image de titre par défaut (version mobile et desktop) |
| `actions` | boutons placés à droite du titre (facultatif) |
| `children` | contenu ajouté sous le titre (facultatif) |
| `className` | classe ajoutée |

L'image passe au CSS par la variable `--page-header-image` ; les dégradés restent dans le SCSS. Le titre est aligné en bas du bandeau.

Sur mobile (en dessous de `m`, 768px), l'image ne couvre que le bloc du titre (`page-header__top`) : le contenu passé en `children` (par exemple la barre de filtres) s'affiche en dessous, sur le fond de la page. À partir de 768px, l'image couvre tout le bandeau (16rem de haut au minimum), titre et `children` compris.

```tsx
<PageHeader title={campaign.title} image={campaign.imageUrl ?? campaignDefaultImage} />
```

### Bandeau collant

Quand le bandeau a des `children` (une barre d'outils), il reste accessible pendant le défilement : une fois le bandeau entièrement dépassé, il revient en haut de l'écran, sous le header du site, en ne gardant que sa barre d'outils.

| État | Ce qui change |
|---|---|
| Normal | bandeau complet, dans le flux de la page |
| Collant (classe `sticky-header`) | `position: fixed` sous le header (`--header-height`) ; titre masqué (`display: none` sur `page-header__top`) ; plus de hauteur minimale ; même padding du bas que l'état normal, pour que la barre d'outils ne bouge pas au retour ; image gardée, sans dégradé du bas, avec une lueur couleur du fond vers le bas (`box-shadow`) ; arrivée en glissant depuis le haut (`@keyframes slide-down`, 0,5s) |
| Retour (classe `page-header--returned`) | quand on remonte jusqu'à sa place, le bandeau y revient d'un coup à sa taille complète, et seul le titre apparaît en fondu avec un léger glissement depuis le haut (`@keyframes title-return`) |

**Un élément invisible garde la place du bandeau** (`page-header-placeholder`). Le bandeau est dans cette enveloppe. En passant en `fixed`, il sort de la mise en page, et l'enveloppe garde sa hauteur complète (`min-block-size`, mesurée au passage). Le contenu de la page ne bouge donc jamais, quoi que fasse le bandeau. Au retour, l'enveloppe aligne le bandeau en bas (`display: grid; align-items: end`) : il réapparaît là où il était collé et reprend sa taille complète, qui remplit exactement la place réservée. L'enveloppe libère ensuite sa hauteur.

**Aucune hauteur animée** : grâce à l'enveloppe, la taille du bandeau peut changer d'un coup sans rien décaler. Les seules animations portent sur `transform`, `translate` et `opacity` (le glissement à l'arrivée, le fondu du titre au retour), qui ne recalculent pas la mise en page. La classe `page-header--returned` n'est ajoutée qu'une fois le bandeau déjà passé en mode collant (`hasBeenSticky`), pour que le fondu du titre ne se joue pas au premier chargement de la page.

La détection est dans le hook `useStickyHeader` (`apps/web/src/hooks/`). Il ne calcule rien pendant le défilement :

| Outil | Rôle |
|---|---|
| `IntersectionObserver` sur l'enveloppe | passage en mode collant quand elle est entièrement passée sous le header du site (`rootMargin` négatif de `--header-height`) |
| `IntersectionObserver` sur un repère en bas de l'enveloppe (`page-header-placeholder__return-point`, de la hauteur du bandeau collé) | retour quand le repère est entièrement visible : la place du bandeau rejoint alors sa position collée, sans saut |
| `ResizeObserver` | largeur de l'enveloppe (`--page-header-width`, car un élément `fixed` se dimensionne par rapport à l'écran et non à son parent), hauteur du bandeau collé (`--page-header-sticky-height`), libération de la place une fois le bandeau revenu à sa hauteur complète ; quand la hauteur du header du site change (passage du cap des 768px), les deux `IntersectionObserver` sont recréés avec la nouvelle valeur |

Avec `prefers-reduced-motion`, ni glissement ni fondu : le bandeau change d'état directement.

## Sidebar de l'espace MJ

Composants dans `apps/web/src/components/layout/Sidebar/`, affichés par le layout de l'espace MJ (voir [architecture §5](architecture.md)).

| Composant | Contenu |
|---|---|
| `SidebarShell` (client) | La coque `<aside id="gm-sidebar" aria-label="Menu de l’espace MJ">` : position, largeur, animation d'ouverture |
| `Sidebar` | Assemble le profil et les sections |
| `SidebarProfile` | Avatar du MJ (ou son initiale, en Cinzel cyan, avec `getInitial`), nom en Cinzel, « Campagnes : N » et « En cours : N » |
| `SidebarSection` | `<section>` nommée par son titre `h2` (Cinzel, orange, petites capitales), séparée de la précédente par un trait |
| `SidebarLink` (client) | Lien avec icône, libellé et nombre ; actif (`aria-current="page"`, bordure gauche et fond cyan léger, texte lumineux) sur sa page et les pages en dessous (`/dashboard/campaigns` et `/dashboard/campaigns/:id`) |
| `ResumeCampaignLink` (`components/campaign/`) | Encadré orange vers une campagne : vignette (image par défaut sans image), titre, « Chapitre X - Y % » (le chapitre en cours et sa progression), barre de progression de toute la campagne, chevron |

**Sections**

- **Reprendre** : les 3 campagnes en cours les plus récemment jouées, de la session la plus récente à la plus ancienne (`getCampaignsToResume`). Au-delà de 3, un lien « Voir plus » vers la liste filtrée (`?status=IN_PROGRESS`). Sans campagne en cours, un encadré de la même taille : « Aucune campagne en cours ».
- **Mon atelier** : un `<nav>` avec le lien « Campagnes » et leur nombre. Les autres entrées (personnages, bibliothèque) arriveront avec leurs tickets.

**Mise en page**

- La sidebar est collante (`position: sticky`) sous le header (`--header-height`), de la hauteur de l'écran restante (`calc(100dvh - var(--header-height))`). C'est la page qui défile ; le contenu de la sidebar défile à part s'il dépasse.
- Largeur 31rem. Fermée, la coque passe à une largeur de 0 et le panneau glisse vers la gauche (`translate: -100% 0`) en 0,3s, puis devient `visibility: hidden` à la fin du glissement, pour qu'on ne puisse plus y arriver avec Tab. À l'ouverture, il redevient visible tout de suite (délai de la transition de `visibility` à 0 dans un sens, à 0,3s dans l'autre).
- Avec `prefers-reduced-motion`, l'ouverture et la fermeture sont immédiates.
- Sous 768px (`until(m)`), la sidebar n'est pas affichée. Elle deviendra un panneau par-dessus la page, ouvert depuis la navigation mobile.

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
| Angles arrondis (10px, `$radius-xl`) | `.box--rounded` | `$rounded: true` |
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

## Contenu principal de la page

Classe `.main-content` (`base/_layout.scss`), construite sur le mixin `container()` (`mixins/_layout-mixin.scss`), réglages dans `variables/_layout.scss` : centre le contenu principal de la page, limite sa largeur, ajoute des marges sur les quatre côtés et espace ses blocs.

| Propriété | Valeur |
|---|---|
| Largeur maximale | 144rem (1440px, `$screen-xl`) |
| Marges latérales | fluides, de 16px sur mobile (`$space-md`) à 40px sur desktop (`$space-2xl`) |
| Marges haut et bas | fluides, de 24px sur mobile (`$space-lg`) à 40px sur desktop (`$space-2xl`) |
| Centrage | `margin-inline: auto` |
| Mise en page | colonne flex qui occupe la hauteur restante de `<main>`, blocs espacés de `$space-lg` |

Les marges utilisent `fluid()` : elles grandissent progressivement de `$screen-s` à `$screen-xl`, sans media query par breakpoint.

Le bandeau de la page (`PageHeader`) reste en dehors, pour couvrir toute la largeur de l'écran :

```tsx
<>
  <PageHeader title="Mes campagnes" />
  <div className="main-content">…</div>
</>
```

Pour aligner un autre bloc sur la même colonne (contenu d'un header ou d'un footer pleine largeur), on utilise directement le mixin : `@include container;`. Il accepte une autre largeur et d'autres marges, pour un contenu plus étroit (formulaire, texte long) : `@include container(60rem);` ou `@include container(80rem, $space-lg);`.

---

## Classe de page sur `<body>`

Le `<body>` porte une classe qui dépend de la page affichée. Elle sert à donner un style propre à une page à un élément commun à toutes, sans ajouter de prop : le header, par exemple, flotte au-dessus de la bannière sur l'accueil seulement.

| Adresse | Classe |
|---|---|
| `/` | `home-index` |
| `/login` | `login-index` |
| `/campaigns` | `campaigns-index` |
| `/campaigns/42` | `campaigns-details-index` |
| `/campaigns/42/sessions` | `campaigns-details-sessions-index` |

Les segments de l'adresse sont joints par des tirets, puis suivis de `-index`. Un segment qui est un paramètre de la route (un identifiant, un slug) devient `details` : `/campaigns/42` et `/campaigns/7` sont la même page avec d'autres données, elles ont donc la même classe.

La classe est calculée par `getPageClassName(pathname, params)` (`apps/web/src/lib/pageClassName.ts`) et posée par le composant client `PageBody`, qui rend le `<body>` dans `app/layout.tsx`. Il lit l'adresse avec `usePathname()` et `useParams()` : la classe est donc déjà dans le HTML rendu par le serveur (pas de saut à l'affichage) et se met à jour à chaque navigation, alors que le layout racine, lui, n'est pas rendu à nouveau.

Dans un `.module.scss`, la classe se cible avec `:global()`, puisqu'elle n'appartient à aucun module :

```scss
:global(.home-index) .header {
  position: absolute;
  background-color: transparent;
}
```

Sur l'accueil, le header utilise cette classe pour :

- **flotter au-dessus de la bannière**, transparent, et apparaître avec `glow-appear` et `smoke-reveal` (classe `header--intro`, retirée au premier défilement) ;
- **revenir en haut de l'écran une fois la page défilée** (classe `header--scrolled`). Dès que le défilement dépasse sa hauteur plus 32px, il passe en `position: fixed`, reprend son fond et son halo, et glisse depuis le haut (`slide-down`). Il ne redevient transparent qu'en revenant tout en haut de la page. Cet écart entre les deux seuils évite qu'il clignote quand on défile autour de sa hauteur. Sa hauteur est suivie par un `ResizeObserver`, et l'écoute du défilement est passive (`{ passive: true }`) pour ne pas ralentir le défilement.

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

**Plusieurs arrêts, comme dans Figma** : `$stops` reçoit une liste de paires `opacité position`, une par arrêt du dégradé Figma (l'opacité de la couleur entre 0 et 1, puis sa distance au bord `$side`). `$length` est alors inutile : la position du dernier arrêt fait office de longueur.

```scss
fade(right, $stops: (1 0%, 0.8 15%, 0.3 30%, 0 40%))
fade(top, $color: var(--gold-color), $stops: (1 0%, 0.5 20%, 0 50%))
```

Une opacité de `1` donne la couleur pleine, `0` la transparence, et les valeurs intermédiaires passent par `with-alpha()`. Dans Figma, les positions se lisent le long du trait du dégradé : il faut les compter depuis le bord où la couleur est pleine.

`fade-edges($color, $top, $right, $bottom, $left)` combine plusieurs fondus, un par bord renseigné (effet vignette) :

```scss
.thumbnail {
  @include image-overlay(fade-edges($top: 30%, $bottom: 30%, $left: 10%, $right: 10%));
}
```

Un dégradé sur mesure peut aussi remplacer celui d'une classe : `@include overlay-gradient(fade(top, 40%));` sur un élément qui a déjà `.overlay`.

---

## Texte tronqué

Un texte trop long pour sa place (titre de campagne dans une carte, nom de personnage dans une liste) est coupé et terminé par « … ».

| | Une ligne (par défaut) | Plusieurs lignes |
|---|---|---|
| Mixin | `@include truncate;` | `@include truncate(3);` |
| Classe globale | `.truncate` | — (mixin seulement) |
| Technique | `white-space: nowrap` + `text-overflow: ellipsis` | `line-clamp` (avec `display: -webkit-box`, encore nécessaire pour Chrome et Safari) |

Le second paramètre fixe une largeur maximale : `@include truncate(2, 30rem);`. Sans lui, c'est la largeur du conteneur qui décide. Dans les deux cas, l'élément doit avoir une largeur limitée (bloc, ou élément flex avec `min-inline-size: 0`), sinon le texte s'étale et n'est jamais coupé. `$lines` doit être un entier d'au moins 1, sinon la compilation échoue.

Le texte complet reste dans le HTML : il est lu en entier par les lecteurs d'écran. Si l'information coupée est importante, on peut l'afficher au survol avec l'attribut `title`.

Pour annuler la coupure dans un cas précis (une autre taille d'écran, une carte plus large), le mixin `untruncate` remet le texte en entier, qu'il ait été coupé sur une ou plusieurs lignes :

```scss
.character-bio {
  @include truncate(3);

  @include from(lg) {
    @include untruncate;
  }
}
```

### Couper selon la place disponible (`FitText`)

`truncate` coupe à un nombre de lignes fixe. Quand le texte doit plutôt **remplir la place qui reste** dans un bloc de hauteur fixée par ailleurs, et n'être coupé que s'il déborde, on utilise le composant client `FitText` (`apps/web/src/components/lib/ui/FitText/`) : il affiche un `<p>` et, avec le hook `useFitLines` (`apps/web/src/hooks/`), calcule combien de lignes entières tiennent dans sa hauteur (hauteur ÷ hauteur de ligne). Il passe ce nombre au CSS dans la variable `--fit-lines` et le recalcule quand la taille change (`ResizeObserver`).

Côté CSS, le texte prend la place restante sans agrandir son parent (`flex: 1 1 0` et `min-block-size: 0`) et utilise la variable comme nombre de lignes. La hauteur de ligne doit être une valeur fixe (`$line-height-normal`, pas `normal`) pour que le calcul soit juste. Exemple de la carte de campagne : 5 lignes en colonne, et en ligne autant de lignes que la hauteur de la carte en permet.

`line-clamp` place le « … » mais ne cache pas les lignes suivantes : quand la boîte est plus haute que le nombre de lignes, elles restent visibles sous le « … ». Le `clip-path` masque tout ce qui dépasse `--fit-lines` lignes (`1lh` vaut une hauteur de ligne). Il ne change pas la taille de la boîte : le hook continue de mesurer la vraie place disponible. Limiter la hauteur (`max-block-size`) aurait figé la mesure, et le texte n'aurait plus jamais regagné de lignes quand la carte s'agrandit.

```scss
.campaign_card__content__description {
  line-height: $line-height-normal;
  @include truncate(5);
}

@container campaign-card (min-width: 60rem) {
  .campaign_card__content__description {
    flex: 1 1 0;
    min-block-size: 0;
    -webkit-line-clamp: var(--fit-lines, 5);
    line-clamp: var(--fit-lines, 5);
    clip-path: inset(0 0 calc(100% - var(--fit-lines, 5) * 1lh) 0);
  }
}
```

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
