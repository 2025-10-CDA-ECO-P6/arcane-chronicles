# Organisation du projet — Arcane Chronicles

**Mise à jour** : 03/11/2026
**Documents liés** : [`planning.md`](planning.md), [Jira KAN](https://simplon-team-kqd1jwhw.atlassian.net/browse/KAN)

> Les points marqués **à confirmer** sont des propositions.

---

## 1. Équipe et rôles

| Personne | Rôle |
|---|---|
| Lubin Chauvreau | Porteur du projet : analyse du besoin, conception, développement front et back, tests, déploiement (projet individuel — **à confirmer**) |
| Formateur / jury Simplon | Suivi pédagogique et évaluation du titre CDA (**à compléter**) |
| MJ et joueurs testeurs | Retours sur les maquettes et tests de partie (**à compléter**) |

---

## 2. Méthode

Le projet suit une démarche **agile itérative**, adaptée à un développeur seul :

- **Backlog unique dans Jira** (projet KAN) : epics par domaine fonctionnel, user stories avec critères d'acceptation, une version Jira par livraison (MVP, V1.1, V1.2, V1.3).
- **Itérations d'une semaine** (voir [`planning.md`](planning.md)), chacune terminée par un livrable vérifiable.
- **Priorisation par la valeur** : la fonctionnalité principale (piloter une partie en direct) passe avant tout le reste ; une liste de coupe est tenue à jour.
- **Décisions tracées** : chaque décision de périmètre est numérotée (D1 à D24) dans le [périmètre du MVP](perimetre/perimetre-mvp.md).

### Définition de « terminé »

Une user story est terminée quand :

1. ses critères d'acceptation sont remplis ;
2. ses règles de droits (MJ / joueur) sont couvertes par un test ;
3. le lint et les tests passent en CI ;
4. elle est fusionnée dans `develop` par une pull request, puis livrée avec la prochaine release.

---

## 3. Gestion du code

| Élément | Règle |
|---|---|
| Dépôt | Un dépôt GitHub public et monorepo : [`2025-10-CDA-ECO-P6/arcane-chronicles`](https://github.com/2025-10-CDA-ECO-P6/arcane-chronicles) ; `develop` est la branche par défaut |
| `main` | Branche de production : reflète ce qui est déployé, on n'y commite jamais directement |
| `develop` | Branche de développement : point de départ des tickets, reçoit les fonctionnalités terminées |
| `feature/<clé Jira>` | Une branche par ticket, créée depuis `develop`, par exemple `feature/KAN-514` |
| `release/v<version>` | Une branche par version (`release/v0.3.0`), créée depuis `develop` et testée : elle tient lieu d'environnement de recette, sans staging séparé. Numérotation : voir §3.1 |
| `releasefix/<clé Jira>` | Correction d'un problème trouvé pendant la recette d'une release, fusionnée dans la release |
| `hotfix/<clé Jira>` | Correction urgente d'un bug en production, créée depuis `main` et fusionnée dans `main` ; `main` est ensuite fusionnée dans `develop` et dans la release en recette s'il y en a une |
| Fin de release | La release validée est fusionnée dans `main` (déploiement), un tag `v<version>` est posé sur le commit de fusion et une Release GitHub est publiée avec la liste des tickets livrés ; puis `main` est fusionnée dans `develop` : `develop` récupère les corrections de la release et le commit de fusion, et les deux branches restent alignées |
| Méthodes de fusion | `feature/…` → `develop`, `releasefix/…` → `release/…` et `hotfix/…` → `main` : **squash** (un commit par ticket). `release/…` → `main`, `main` → `develop` et `main` → `release/…` : **merge**, jamais squash, pour que les branches partagent les mêmes commits |
| Protection | Un ruleset GitHub protège `main`, `develop` et les branches `release/**` : suppression et force push interdits, pull request obligatoire et CI verte avant toute fusion. Les branches de release sont conservées comme historique des versions |
| Commits | En anglais, préfixés par la clé Jira : `KAN-514: sort turn order by initiative`. Les commits d'initialisation du projet, sans ticket, utilisent `init(<partie>): …` et `design-system: …` |
| Pull requests | Titre au format `<branche source> into <branche cible>`, par exemple `feature/KAN-514 into develop` ; fusionnée quand la CI est verte |

```
develop ──┬── feature/KAN-514 ──(squash)──► develop
          │
          └──(création)──► release/v0.3.0 ◄──(squash)── releasefix/KAN-530
                                 │
                                 └──(merge)──► main (tag v0.3.0) ──(merge)──► develop

main ──► hotfix/KAN-540 ──(squash)──► main ──┬──(merge)──► develop
                                             └──(merge)──► release en recette (s'il y en a une)
```

### 3.1 Versions

Numérotation [SemVer](https://semver.org/lang/fr/) (`majeure.mineure.correctif`), alignée sur les versions du périmètre dans Jira. La même version nomme la branche de release (`release/v0.3.0`), le tag posé sur `main` (`v0.3.0`), la Release GitHub et le champ `version` des `package.json`.

| Version | Signification |
|---|---|
| `0.x.y` | Livraisons en production **avant que le MVP soit complet** : une version mineure par lot de fonctionnalités livré (`0.3.0`, `0.4.0`…) |
| `1.0.0` | **MVP complet** : tous les tickets `MVP` de Jira sont livrés |
| `1.1.0`, `1.2.0`, `1.3.0` | Versions V1.1, V1.2 et V1.3 de Jira |
| `2.0.0` | Version V2 de Jira (contenus premium, assistant IA) |
| Dernier chiffre (`0.3.1`) | Correctifs sans nouvelle fonctionnalité (`releasefix`, `hotfix`) |

**Premières releases.** Les quatre premières releases ont été préparées avant cette convention, sur des branches nommées `release/v1.x`. Les branches ont ensuite été renommées et taguées avec leur numéro définitif. Les messages de fusion déjà présents sur `main` (« Merge pull request #… from …/release/v1.1.0 »), les pull requests et les tableaux de bord de Render et Vercel gardent les anciens noms, car on ne modifie pas un historique publié : ce tableau fait la correspondance.

| Ancien nom (historique) | Branche et tag | Contenu |
|---|---|---|
| `release/v1.0.0` | `release/v0.1.0`, `v0.1.0` | Initialisation du projet et design system |
| `release/v1.1.0` | `release/v0.2.0`, `v0.2.0` | Intégration et déploiement continus |
| `release/v1.1.1` | `release/v0.2.1`, `v0.2.1` | Front servi sur le domaine `arcane-chronicles.fr` |
| `release/v1.1.3` | `release/v0.2.2`, `v0.2.2` | Node 24 fixé pour Vercel, ping de l'API toutes les 10 minutes |

---

## 4. Outils

| Outil | Usage |
|---|---|
| Jira | Backlog, tableau, versions |
| Figma | Maquettes desktop / mobile et page de composants |
| GitHub | Code, pull requests, CI |
| dbdiagram.io | Modèle de données (DBML) |
| IcoMoon | Police d'icônes |
| Docker | Environnement local identique à la production |
| Claude Code | Assistant de développement |

---

## 5. Communication et suivi

- Point hebdomadaire de fin d'itération (voir [`planning.md`](planning.md) §4).
- Les décisions et points ouverts sont notés dans le [périmètre du MVP](perimetre/perimetre-mvp.md) (§10 « Points à trancher »).
