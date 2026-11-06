# Preuves — Arcane Chronicles

Éléments qui montrent que ce qui est décrit dans [`docs/`](../docs/) a réellement été fait.

| Dossier | Contenu | Exemples |
|---|---|---|
| [`captures/`](captures/) | Captures d'écran | Écrans de l'application, tableau Jira, CI verte, tableaux de bord Vercel / Render / Neon |
| [`logs/`](logs/) | Extraits de logs | Logs pino d'une partie, refus d'accès, démarrage de l'API |
| [`exports/`](exports/) | Exports d'outils | Export Jira du backlog, export du schéma de base, collection d'appels API |
| [`rapports/`](rapports/) | Rapports générés | Couverture de tests, rapport Playwright, Lighthouse, EcoIndex, `npm audit` |

**Nommage** : `AAAA-MM-JJ-sujet.ext` (par exemple `2027-04-20-ci-verte.webp`), pour retrouver l'ordre chronologique.

**Format** : captures en WebP plutôt qu'en PNG, environ trois fois plus légères à qualité visuelle égale. Tout fichier commité reste dans l'historique Git ; des images légères gardent le dépôt rapide à cloner, y compris en CI. Conversion : `cwebp -q 85 capture.png -o capture.webp`.

**Attention** : aucun secret (mot de passe, clé, jeton, URL de base) ni donnée personnelle réelle dans les captures et les logs.
