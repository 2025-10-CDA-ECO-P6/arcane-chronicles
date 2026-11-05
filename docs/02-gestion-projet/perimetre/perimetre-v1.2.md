# Périmètre V1.2 — Arcane Chronicles

**Mise à jour** : 03/11/2026 · **Référence** : [tickets V1.2 dans Jira](https://simplon-team-kqd1jwhw.atlassian.net/issues/?jql=project%20%3D%20KAN%20AND%20labels%20%3D%20%22V1.2%22%20ORDER%20BY%20key%20ASC) (16, étiquette `V1.2`) · résumé : [`resume-v1.2.md`](resume-v1.2.md) · version précédente : [V1.1](perimetre-v1.1.md)

## 1. Objectif

Rendre les campagnes plus visuelles et permettre une exploration non linéaire des scènes.

## 2. Contenu

### 2.1 Images et cartes (8 tickets)

- Image de campagne, de chapitre et de scène, modification ou suppression de l'image de scène
- Modification ou suppression de la carte de scène ; mise à jour de la carte en temps réel côté joueur (l'upload et la consultation des cartes sont déjà dans le MVP)

Tickets : KAN-41, KAN-59, KAN-79, KAN-80, KAN-82, KAN-241

### 2.2 Liens entre scènes (5 tickets)

- Relier des scènes, modifier ou supprimer un lien
- Plusieurs scènes accessibles depuis une scène (exploration libre)
- Visualiser les connexions du chapitre

Tickets : KAN-94 à KAN-98

### 2.3 Effets appliqués (2 tickets)

- Gérer des effets de type état, bonus ou malus appliqués aux personnages et aux objets
- Utiliser un objet pour appliquer son effet

Tickets : KAN-110, KAN-236

### 2.4 Statut de publication de campagne (3 tickets)

Tickets : KAN-42, KAN-43, KAN-44

## 3. Volumétrie

| Epic | Tickets |
|---|--:|
| Scènes | 8 |
| Campagnes | 4 |
| Chapitres | 1 |
| Effets | 1 |
| Inventaire joueur | 1 |
| Vue scène joueur | 1 |
| **Total** | **16** |

## 4. Impact sur le modèle de données

Les colonnes `image_url` et `map_url` existent déjà. À ajouter : une table de liens entre scènes ; et, si les effets sont appliqués automatiquement, une table des effets actifs sur un personnage (retirée du modèle v2 par choix « esprit papier »).

