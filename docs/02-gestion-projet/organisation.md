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
| Dépôt | Un dépôt GitHub monorepo (dépôt **à créer**) ; `develop` est la branche par défaut |
| `main` | Branche de production : reflète ce qui est déployé, on n'y commite jamais directement |
| `develop` | Branche de développement : point de départ des tickets, reçoit les fonctionnalités terminées |
| `feature/<clé Jira>` | Une branche par ticket, créée depuis `develop`, par exemple `feature/KAN-514` |
| `release/<version>` | Une branche par version (`release/1.0.0`), créée depuis `develop` et testée : elle tient lieu d'environnement de recette, sans staging séparé |
| `releasefix/<clé Jira>` | Correction d'un problème trouvé pendant la recette d'une release, fusionnée dans la release |
| Fin de release | La release validée est fusionnée dans `main` (déploiement) **et** dans `develop`, pour que les deux restent à jour |
| Commits | En anglais, préfixés par la clé Jira : `KAN-514: sort turn order by initiative`. Les commits d'initialisation du projet, sans ticket, utilisent `init(<partie>): …` et `design-system: …` |
| Pull requests | Titre au format `<branche source> into <branche cible>`, par exemple `feature/KAN-514 into develop` ; fusionnée quand la CI est verte |

```
develop ──┬── feature/KAN-514 ──► PR « feature/KAN-514 into develop »
          │
          └──► release/1.0.0 ──► releasefix/KAN-530 ──┐
                                                       ├──► main (production)
                                                       └──► develop
```

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
