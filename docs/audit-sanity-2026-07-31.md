# Audit indépendant de la migration Sanity

**Date :** 31 juillet 2026
**Branche :** `feature/sanity-content-migration` (arbre propre, `4beb4ae`)
**Méthode :** routes réelles, HTML produit (`pnpm build:public`), dataset `xo2ahvjo/production` en lecture seule, schémas, requêtes GROQ, normalizers, rendu navigateur (dev + Presentation).
Aucun document de projet, ticket ni mémoire n'a servi de liste de contrôle. Aucune donnée Sanity n'a été modifiée, aucun fichier du dépôt n'a été touché.

---

## 0. État des corrections — mis à jour le 3 août 2026

Le corps du rapport ci-dessous est **laissé tel qu'il a été écrit le 31 juillet**, comme constat daté. Ce tableau dit ce qui a changé depuis. La suite du travail est planifiée dans [`plan-reprise-2026-08-04.md`](plan-reprise-2026-08-04.md).

### Corrigé

| #    | Problème                                                                     | Commit    |
| ---- | ---------------------------------------------------------------------------- | --------- |
| P0-1 | `[ADRESSE]` / `[TÉLÉPHONE]` sur 18 pages                                     | `91a692c` |
| P1-1 | `socialLinks` administrable mais jamais rendu, faux liens Header et Footer   | `91a692c` |
| P1-2 | Stega cassait horaires et événements en prévisualisation                     | `91a692c` |
| P1-3 | Galerie `/friperie` : 7 cadres vides non administrables                      | `8bfa7ca` |
| P1-4 | 5 images éditoriales de `/nos-services` sans champ Sanity                    | `8bfa7ca` |
| P1-5 | Photo d'architecture de `/notre-paroisse` sans champ Sanity                  | `8bfa7ca` |
| P2-3 | Champs orphelins `regularSchedule` / `lastReviewedAt`                        | `8bfa7ca` |
| P2-4 | Brouillon vide `drafts.servicesPage`                                         | `8bfa7ca` |
| P2-8 | 4 illustrations de l'accueil non administrables                              | `8bfa7ca` |
| P2-9 | `© 2026Paroisse` — espace manquant                                           | `91a692c` |
| —    | Build de production refuse désormais le drapeau de prévisualisation (exit 1) | `91a692c` |
| —    | Les 6 images de premier écran restantes, hors périmètre de l'audit           | `d6aac9f` |

Deux défauts non listés par l'audit ont été trouvés en corrigeant :

- **`drafts.servicesPage` n'était pas inoffensif.** La prévisualisation lit les brouillons en priorité : ce brouillon figé masquait le document publié et montrait à l'éditrice une page Nos services sans aucune illustration.
- **Une catégorie d'événement était écartée entière** quand son illustration était inexploitable — un visuel manquant emportait le titre et le résumé. Le visuel est devenu facultatif (`d6aac9f`).

### Décidé autrement qu'au rapport

- **§ 5 — les heros restent locaux.** Décision renversée le 3 août : plus aucune image visible du site public n'est un fichier du dépôt. Restent locaux le logo et l'image de `/verification`.
- **§ 4 — crédits visibles sous les images de chapitre.** Les notes de provenance non confirmées (« page source exacte à archiver ») sont passées dans `rightsNote`, qui n'est jamais rendu. Aucun crédit n'est affiché tant qu'il n'est pas confirmé.

### Non corrigé — en attente d'un arbitrage

| #     | Problème                                                                                      | Ce qui manque                                                                            |
| ----- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| P0-2  | 4 annonceurs publiés `active` alors que leur note dit « à confirmer avant toute publication » | Décision de l'utilisatrice. Trois sont des élus réels, avec téléphone et courriel.       |
| P1-7  | Crédits photographiques absents                                                               | Nom de la photographe des vues de l'église.                                              |
| P2-12 | Statut IA de `parish-life-marian-artwork.jpg`                                                 | Non déterminé. Laissé non coché; aucune mention publique automatique (décision validée). |

### Non corrigé — planifié

P0-3 (pages légales) → lot 4. P0-4 (hébergement, webhook, Studio) → lot 6.
P1-8 (`robots.txt`), P2-1 (SEO par page), P2-2 (`noindex` de trois pages), P2-11 (Open Graph, sitemap, JSON-LD) → lot 3.
P1-9 (mention des illustrations IA) → traité par la décision 5 : le champ reste interne, aucune mention n'est ajoutée automatiquement.
P3-1 à P3-6 → lot 7.

---

## 1. Verdict général

**Presque complète — avec deux exceptions structurelles.**

Le texte éditorial est très largement administrable : 13 singletons et 2 collections existent, sont publiés, sont lus par des requêtes typées, passent par un normalizer et alimentent un composant. La frontière est propre et cohérente d'une page à l'autre.

Deux domaines n'ont pas été migrés du tout, et ce ne sont pas des oublis mineurs :

1. **Les images éditoriales de trois pages** (`/nos-services`, `/friperie`, `/notre-paroisse`) n'ont ni champ, ni schéma, ni requête. Elles sont des fichiers du dépôt, avec leurs textes alternatifs, leurs légendes et leurs crédits. Ce ne sont pas des heros.
2. **Les composants partagés** (Header, Footer) contiennent encore des espaces réservés `[ADRESSE]` et `[TÉLÉPHONE]` livrés sur les 18 pages, alors que le pied de page affiche, deux blocs plus bas, les vraies coordonnées venues de Sanity.

S'y ajoute un défaut de prévisualisation sérieux : dans Presentation, l'horaire des messes et la liste des événements **disparaissent**, et les catégories d'événements retombent silencieusement sur le contenu local. L'éditrice verrait un site faux dans l'outil censé lui montrer le vrai.

La qualité de la porte de validation est réelle : `pnpm build:public` force le drapeau de prévisualisation à `false`, et j'ai vérifié que la sortie publique ne contient ni caractère stega ni `noindex` généralisé. `.env` n'est pas suivi par git. La CI génère les types avant de valider.

---

## 2. Inventaire des routes vérifiées

18 pages produites (`dist/`), toutes ouvertes et inspectées.

| Route                           | Rôle                         | Indexable  | Source dominante                                                    |
| ------------------------------- | ---------------------------- | ---------- | ------------------------------------------------------------------- |
| `/`                             | Accueil                      | ✅         | Sanity `homePage` + `massSchedule` + `parishEvent` + `siteSettings` |
| `/notre-paroisse`               | Histoire, architecture       | ✅         | Sanity `aboutPage`                                                  |
| `/horaires`                     | Célébrations                 | ✅         | Sanity `schedulePage` + `massSchedule` + `siteSettings`             |
| `/vie-paroissiale`              | Groupes                      | ✅         | Sanity `parishLifePage`                                             |
| `/nos-services`                 | Sacrements, démarches, salle | ✅         | Sanity `servicesPage` + `siteSettings`                              |
| `/friperie`                     | Friperie                     | ✅         | Sanity `thriftStorePage` + `thriftStore`                            |
| `/premiere-visite`              | Accueil des nouveaux         | ✅         | Sanity `firstVisitPage` + `siteSettings`                            |
| `/contact`                      | Coordonnées, formulaire      | ❌ noindex | Sanity `contactPage` + `siteSettings`                               |
| `/evenements`                   | Activités datées             | ❌ noindex | Sanity `eventsPage` + `parishEvent`                                 |
| `/nos-annonceurs`               | Annonceurs                   | ❌ noindex | Sanity `advertisersPage` + `advertiser`                             |
| `/galerie`                      | Placeholder                  | ❌ noindex | Code (`[slug].astro`)                                               |
| `/politique-de-confidentialite` | Placeholder légal            | ❌ noindex | Code (`[slug].astro`)                                               |
| `/mentions-legales`             | Placeholder légal            | ❌ noindex | Code (`[slug].astro`)                                               |
| `/sacrements`                   | Redirection héritée          | ❌ noindex | Code                                                                |
| `/location-de-salle`            | Redirection héritée          | ❌ noindex | Code                                                                |
| `/merci-a-nos-annonceurs`       | Redirection héritée          | ❌ noindex | Code                                                                |
| `/verification`                 | Démo design system           | ❌ noindex | Code                                                                |
| `/404`                          | Erreur                       | ❌ noindex | Code                                                                |

**À noter :** `/evenements` est dans la navigation principale et `/contact` comme `/nos-annonceurs` dans le menu « Informations », alors que les trois sont `noindex`. Quelqu'un qui cherche « paroisse Saint-René-Goupil contact » ne trouvera pas la page.

---

## 3. Matrice de couverture Sanity (synthèse par page)

Légende source : **S** = Sanity · **L** = fichier local `src/data` · **C** = codé en dur dans un composant · **D** = valeur dérivée · **T** = technique.

### `/` — Accueil

| Section               | Élément                                             | Type        | Source                                                | Sanity ? | Problème                                             |
| --------------------- | --------------------------------------------------- | ----------- | ----------------------------------------------------- | -------- | ---------------------------------------------------- |
| `<head>`              | title, description                                  | texte       | **C** (`index.astro:368-370`)                         | non      | devrait être dans `homePage.seo`                     |
| Hero                  | script, titres, intro, 2 CTA                        | texte       | **S** `homePage.hero`                                 | ✅       | —                                                    |
| Hero                  | 3 photos + libellés + alt                           | image       | **C** (`HomeHero.astro`)                              | non      | hero, hors périmètre assumé                          |
| Hero                  | carte horaires                                      | donnée      | **S** `massSchedule` → **D**                          | ✅       | faux en prévisualisation (§ 12)                      |
| Bienvenue             | textes, citation biblique                           | texte       | **S** `homePage.welcome`                              | ✅       | —                                                    |
| Aperçu messes         | textes                                              | texte       | **S** `homePage.massPreview`                          | ✅       | —                                                    |
| Aperçu messes         | « Dernière mise à jour : »                          | libellé     | **C**                                                 | non      | libellé d'interface                                  |
| Prochaines activités  | titre, réglages                                     | texte       | **S** `homePage.upcomingEvents*`                      | ✅       | —                                                    |
| Prochaines activités  | « Vie communautaire », « Voir tous les événements » | texte       | **C**                                                 | non      | éditorial                                            |
| Prochaines activités  | cartes                                              | donnée      | **S** `parishEvent`                                   | ✅       | —                                                    |
| Vie paroissiale       | textes, teasers, noms de groupes                    | texte       | **S** `homePage.parishLife` + `parishLifePage`        | ✅       | —                                                    |
| Vie paroissiale       | illustration mariale                                | image       | **L** `home/editorial/parish-life-marian-artwork.jpg` | non      | image éditoriale                                     |
| Services pratiques    | textes, 5 liens                                     | texte       | **S** `homePage.services`                             | ✅       | —                                                    |
| Services pratiques    | photo de façade                                     | image       | **L** `church-facade-editorial.jpg`                   | non      | alt : « façade de Santa Maria del Fiore à Florence » |
| Interlude             | textes                                              | texte       | **S** `homePage.interlude`                            | ✅       | —                                                    |
| Interlude             | lampions                                            | image       | **L** `candles-prayer.jpg`                            | non      | image éditoriale                                     |
| Galerie               | eyebrow, titre, 6 photos + titres + alt             | image/texte | **S** `homePage.gallery.photos`                       | ✅       | modèle exemplaire                                    |
| Venez nous rencontrer | textes, 2 CTA                                       | texte       | **S** `homePage.visit`                                | ✅       | —                                                    |
| Venez nous rencontrer | coordonnées                                         | donnée      | **S** `siteSettings`                                  | ✅       | —                                                    |
| Venez nous rencontrer | photo extérieure                                    | image       | **L** `eglise-exterieur-identification-01.webp`       | non      | image éditoriale                                     |

### `/horaires`

| Section                | Élément                          | Source                                 | Sanity ? | Problème                      |
| ---------------------- | -------------------------------- | -------------------------------------- | -------- | ----------------------------- |
| `<head>`               | title, description               | **C** (`horaires.astro:259-260`)       | non      | pas même de `seo` local       |
| Hero                   | eyebrow, titre, intro, alt image | **S** `schedulePage.hero`              | ✅       | —                             |
| Hero                   | photographie                     | **L** `autel-decor-rouge-01.jpg`       | non      | hero, assumé                  |
| Avis                   | titre, message, sévérité, cible  | **S** `schedulePage.notice`            | ✅       | —                             |
| Bandeau                | titre, message                   | **S** `schedulePage.beforeYouVisit`    | ✅       | —                             |
| Horaire régulier       | jours, heures, titres            | **S** `massSchedule`                   | ✅       | **vide en prévisualisation**  |
| Horaires saisonniers   | période, entrées                 | **S** `massSchedule.seasonalSchedules` | ✅       | aucun saisi (section masquée) |
| Célébrations spéciales | entrées + message vide           | **S** / **L**                          | ✅       | —                             |
| FAQ                    | questions, réponses, `active`    | **S** `schedulePage.faq`               | ✅       | —                             |
| Encadré                | eyebrow, message                 | **S** `schedulePage.sidebar`           | ✅       | —                             |
| Encadré                | heures du secrétariat            | **S** `siteSettings.officeHours`       | ✅       | —                             |
| Encadré                | lien de contact                  | **L** (`href`)                         | n/a      | route technique               |

### `/nos-services`

| Section     | Élément                                               | Source                              | Sanity ? | Problème                 |
| ----------- | ----------------------------------------------------- | ----------------------------------- | -------- | ------------------------ |
| `<head>`    | title, description, canonical                         | **L** `data/services.ts`            | non      | —                        |
| Hero        | eyebrow, titre, intro                                 | **S** `servicesPage.hero`           | ✅       | —                        |
| Hero        | **3 images + alt + crédits + libellés**               | **L**                               | **non**  | **aucun champ n'existe** |
| Sommaire    | « À savoir », « Parcourir la page »                   | **C**                               | non      | libellés                 |
| Avis        | titre, message, date de révision                      | **S** `servicesPage.notice`         | ✅       | —                        |
| 4 chapitres | ancres, eyebrows, titres, intros, surfaces            | **S** `servicesPage.chapters`       | ✅       | —                        |
| 2 chapitres | **images + alt + crédits**                            | **L**                               | **non**  | **aucun champ n'existe** |
| 11 services | titres, résumés, détails (tarifs 2026), étapes, notes | **S**                               | ✅       | —                        |
| Services    | « Premiers repères »                                  | **C**                               | non      | libellé                  |
| Paiement    | titre, description, 3 modes                           | **S** `servicesPage.paymentMethods` | ✅       | —                        |
| Clôture     | titre, description                                    | **S** `servicesPage.finalCta`       | ✅       | —                        |
| Clôture     | « Données 2026 — confirmation périodique requise… »   | **C**                               | non      | éditorial                |

### `/friperie`

| Section           | Élément                                                 | Source                       | Sanity ? | Problème                                          |
| ----------------- | ------------------------------------------------------- | ---------------------------- | -------- | ------------------------------------------------- |
| `<head>`          | title, description, canonical, `noIndex:false`          | **L**                        | non      | —                                                 |
| Hero              | eyebrow, titre, intro                                   | **S** `thriftStorePage.hero` | ✅       | —                                                 |
| Hero              | **3 photos Pixabay + alt + crédits + notes de licence** | **L**                        | **non**  | **aucun champ**                                   |
| Présentation      | eyebrow, titre, 3 paragraphes, avis prix                | **S**                        | ✅       | —                                                 |
| Présentation      | **cadre « Vue générale du local »**                     | **L**                        | **non**  | placeholder visible                               |
| Infos pratiques   | heures, emplacement, téléphone                          | **S** `thriftStore`          | ✅       | bien séparé du secrétariat                        |
| Sections réemploi | eyebrow, titre, description, `active`                   | **S**                        | ✅       | —                                                 |
| Galerie           | eyebrow, titre, intro                                   | **S**                        | ✅       | —                                                 |
| Galerie           | **6 cadres vides « Photographie réelle prévue »**       | **L**                        | **non**  | **section « à documenter » publiée et indexable** |
| Clôture           | eyebrow, titre, description, 2 CTA                      | **S**                        | ✅       | —                                                 |

### `/notre-paroisse`

| Section      | Élément                                                                                                       | Source                            | Sanity ? | Problème                       |
| ------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------- | ------------------------------ |
| `<head>`     | title, description                                                                                            | **L**                             | non      | —                              |
| Hero         | eyebrow, titre, intro                                                                                         | **S** `aboutPage.hero`            | ✅       | —                              |
| Hero         | photographie                                                                                                  | **L**                             | non      | hero, assumé                   |
| Introduction | eyebrow, accent, titre, paragraphes                                                                           | **S**                             | ✅       | —                              |
| Chronologie  | 9 repères : période, titre, résumé, corps, **9 illustrations + alt + crédits**, type d'image, source, mention | **S** `aboutPage.history.entries` | ✅       | modèle exemplaire              |
| Chronologie  | « Source éditoriale », « Illustration artistique — non documentaire »                                         | **C**                             | non      | libellés de transparence       |
| Principes    | eyebrow, titre, items                                                                                         | **S**                             | ✅       | —                              |
| Architecture | eyebrow, titre, paragraphes, caractéristiques                                                                 | **S**                             | ✅       | —                              |
| Architecture | **photographie de la nef + alt + légende**                                                                    | **L**                             | **non**  | photo documentaire du bâtiment |
| Architectes  | eyebrow, titre, intro, profils, carte de validation                                                           | **S**                             | ✅       | —                              |
| Architectes  | « Information à confirmer éditorialement »                                                                    | **C**                             | non      | libellé                        |
| Clôture      | accent, titre, texte, 2 CTA                                                                                   | **S**                             | ✅       | —                              |

### `/vie-paroissiale`

| Section       | Élément                                                               | Source                             | Sanity ? | Problème                                                        |
| ------------- | --------------------------------------------------------------------- | ---------------------------------- | -------- | --------------------------------------------------------------- |
| Hero          | eyebrow, titre, intro                                                 | **S**                              | ✅       | —                                                               |
| Hero          | 3 visuels + libellés                                                  | **S** `parishLifePage.hero.slides` | ✅       | **alt écarté (`alt=""`), crédit et mention IA jamais affichés** |
| Introduction  | eyebrow, titre, paragraphes, note                                     | **S**                              | ✅       | —                                                               |
| 4 groupes     | ancre, eyebrow, titre, résumé, points, CTA, `active`, **image + alt** | **S** `parishLifePage.features`    | ✅       | crédit photo non affiché                                        |
| Participation | accent, titre, description, CTA                                       | **S**                              | ✅       | —                                                               |

### `/premiere-visite`

Page la plus complète du site : **seule page dont le `seo` est administrable**. Hero, préparation (4 étapes), attentes, informations pratiques (les lignes nomment leur source dans `siteSettings` au lieu de la recopier), image + alt, FAQ — tout vient de Sanity. Aucun problème détecté.

### `/contact`

| Section               | Élément                                                                | Source                      | Sanity ? | Problème                                          |
| --------------------- | ---------------------------------------------------------------------- | --------------------------- | -------- | ------------------------------------------------- |
| `<head>`              | title, description, `noIndex:true`                                     | **L**                       | non      | —                                                 |
| Hero                  | eyebrow, titre, intro                                                  | **S** `contactPage.hero`    | ✅       | —                                                 |
| Cartes de coordonnées | adresse, téléphone, courriel                                           | **D** depuis `siteSettings` | ✅       | courriel masqué (`showPublicEmail:false`)         |
| Cartes                | libellés « Adresse », « Téléphone », notes                             | **L**                       | non      | libellés                                          |
| Heures secrétariat    | titre, note                                                            | **S**                       | ✅       | horaire depuis `siteSettings`                     |
| Nous trouver          | titre, description, notes d'accès                                      | **S** + `siteSettings`      | ✅       | —                                                 |
| Nous trouver          | carte, titre de la carte, URL itinéraire                               | **L** `siteSettings.map`    | non      | titre de carte = éditorial                        |
| Formulaire            | titre, intro, motifs, avis, libellé du bouton, avis de confidentialité | **S** `contactPage.form`    | ✅       | motifs correctement injectés                      |
| Formulaire            | libellés de champs, messages de validation, texte de consentement      | **L**                       | non      | décision documentée, discutable pour les libellés |

### `/evenements`

| Section    | Élément                                         | Source                      | Sanity ? | Problème                                       |
| ---------- | ----------------------------------------------- | --------------------------- | -------- | ---------------------------------------------- |
| Hero       | eyebrow, titre, intro                           | **S** `eventsPage.hero`     | ✅       | —                                              |
| Hero       | photographie                                    | **L**                       | non      | hero, assumé                                   |
| À venir    | titre de section                                | **S**                       | ✅       | —                                              |
| À venir    | « À l'agenda » + paragraphe complet             | **C**                       | **non**  | **éditorial**                                  |
| À venir    | fiches événements                               | **S** `parishEvent`         | ✅       | **disparaissent en prévisualisation**          |
| À venir    | libellés « Départ », « Destination », « Coût »… | **C**                       | non      | libellés de données                            |
| Catégories | eyebrow, titre, intro, note                     | **S** `eventsPage.overview` | ✅       | —                                              |
| Catégories | 5 catégories : titre, résumé, visuel, CTA       | **S**                       | ✅       | **retombent sur le local en prévisualisation** |
| Catégories | libellés « Culture », « Célébrations »…         | **C**                       | non      | dérivés d'une énumération                      |
| Passés     | titre de section                                | **S**                       | ✅       | —                                              |
| Passés     | « Mémoire communautaire »                       | **C**                       | non      | éditorial                                      |

### `/nos-annonceurs`

| Section       | Élément                                                                                   | Source                       | Sanity ? | Problème                                              |
| ------------- | ----------------------------------------------------------------------------------------- | ---------------------------- | -------- | ----------------------------------------------------- |
| Hero          | eyebrow, titre, intro                                                                     | **S** `advertisersPage.hero` | ✅       | —                                                     |
| Hero          | image + alt                                                                               | **L**                        | non      | hero, assumé                                          |
| Introduction  | eyebrow, titre, paragraphes, mention                                                      | **S**                        | ✅       | —                                                     |
| Liste         | « Avec gratitude », « Les annonceurs de la paroisse », phrase de distinction publicitaire | **C**                        | **non**  | **mention à caractère déontologique, non modifiable** |
| Fiches        | nom, catégorie, description, adresse, téléphone, courriel, site, statut, rang, logo       | **S** `advertiser`           | ✅       | voir § 10                                             |
| Sollicitation | eyebrow, titre, description, détails, libellés                                            | **S**                        | ✅       | —                                                     |

### Composants partagés (toutes les pages)

| Élément                                                       | Source                        | Sanity ? | Problème                              |
| ------------------------------------------------------------- | ----------------------------- | -------- | ------------------------------------- |
| Navigation principale, menu Informations, « Première visite » | **C** `lib/navigation.ts`     | non      | libellés liés aux routes — acceptable |
| Menu mobile — `[ADRESSE]`                                     | **C** `Header.astro:299`      | **non**  | **espace réservé livré sur 18 pages** |
| Menu mobile — `[TÉLÉPHONE]`                                   | **C** `Header.astro:316`      | **non**  | **espace réservé livré sur 18 pages** |
| Menu mobile — « Facebook \| YouTube »                         | **C**                         | **non**  | `<span>` non cliquables               |
| Pied de page — phrase d'identité                              | **C** `Footer.astro:970-973`  | **non**  | **éditorial**                         |
| Pied de page — « Facebook · YouTube »                         | **C** `Footer.astro:975-978`  | **non**  | `title="Lien Facebook à confirmer"`   |
| Pied de page — adresse, téléphone, itinéraire                 | **S** `siteSettings`          | ✅       | —                                     |
| Pied de page — mentions légales, ©                            | **C** / **D**                 | non      | —                                     |
| Actions rapides mobile                                        | **S** `siteSettings` + routes | ✅       | —                                     |

---

## 4. Contenu éditorial encore codé en dur

Classé selon la grille demandée. Seules les catégories **1** et **8** appellent une action.

### 8 — Véritables omissions Sanity

| Texte                                                                                                         | Fichier                                                  | Impact                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------- |
| `[ADRESSE]`                                                                                                   | `Header.astro:299`                                       | 18 pages              |
| `[TÉLÉPHONE]`                                                                                                 | `Header.astro:316`                                       | 18 pages              |
| « Un lieu de foi, de paix et de rencontre ouvert à tous, au cœur de notre communauté québécoise. »            | `Footer.astro:970`                                       | 18 pages              |
| « Facebook » / « YouTube » (non cliquables, `title="… à confirmer"`)                                          | `Footer.astro:975`, `Header.astro:318`                   | 18 pages              |
| « Les présences ci-dessous sont des placements publicitaires distincts du contenu éditorial de la paroisse. » | `AdvertiserList.astro:37`                                | mention déontologique |
| « Retrouvez ici les prochains rendez-vous dont les informations ont été publiées par la paroisse. »           | `UpcomingEventsSection.astro:32`                         | paragraphe complet    |
| « Données 2026 — confirmation périodique requise auprès du secrétariat. »                                     | `ServicesClosing.astro:25`                               | avertissement daté    |
| Titres et descriptions SEO de 12 pages                                                                        | `src/data/*.ts`, `index.astro:368`, `horaires.astro:259` | voir § 7              |

### 1 — Contenu éditorial mineur (eyebrows et libellés de section)

`À l'agenda`, `Mémoire communautaire`, `Vie communautaire`, `Voir tous les événements`, `Avec gratitude`, `Les annonceurs de la paroisse`, `À savoir`, `Parcourir la page`, `Premiers repères`, `Dernière mise à jour`, `Source éditoriale`, `Illustration artistique — non documentaire`, `Information à confirmer éditorialement`, `Photographie réelle prévue`, `Cadre réservé à une photographie réelle de la friperie`, `À noter :`.

### 2 — Textes techniques (rester dans le code)

Pages de redirection `/sacrements`, `/location-de-salle`, `/merci-a-nos-annonceurs`, page `/404`, placeholders `[slug].astro`, page `/verification`, messages de validation du formulaire.

### 3 — Accessibilité fixe (rester)

`Aller au contenu principal`, `Ouvrir/Fermer le menu`, `Afficher l'image N sur 3 : …`, `Agrandir : …`, `Photographie précédente/suivante`, `Appeler au …`.

### 4 — Libellés d'interface (rester)

`Départ`, `Retour prévu`, `Destination`, `Rassemblement`, `Coût`, `Personne responsable`, `Téléphone :`, `Photo : `, `(facultatif)`.

### 5 — Valeurs dérivées (rester)

Jours (`Mardi`, `Jeudi`…), heures (`8 h`, `16 h`), dates longues, prix formatés, `© {année}`, libellés de catégories dérivés d'une énumération.

### 6 — Routes et liens techniques (rester)

`lib/navigation.ts`, `href` internes, `directionsUrl`, `mapEmbedUrl`.

### 7 — Design (rester)

`verification.astro` en entier, illustrations animées SVG, formes décoratives.

---

## 5. Images éditoriales encore locales

Les heros restent locaux volontairement — ils ne sont pas listés ici comme des manques. Les images ci-dessous ne sont **pas** des heros : elles illustrent ou documentent un contenu.

| Image                                              | Page / section                      | Rôle             | Alt / crédit administrables ? |
| -------------------------------------------------- | ----------------------------------- | ---------------- | ----------------------------- |
| `services/baptism-ceremony.jpg`                    | `/nos-services` triptyque           | illustration     | non                           |
| `services/wedding-silhouette.jpg`                  | `/nos-services` triptyque           | illustration     | non                           |
| `services/first-communion-candle.jpg`              | `/nos-services` triptyque           | illustration     | non                           |
| `home/editorial/mother-of-perpetual-help-icon.jpg` | `/nos-services` chapitre Sacrements | illustration     | non                           |
| `home/editorial/candles-prayer.jpg`                | `/nos-services` chapitre Prière     | illustration     | non                           |
| `paroisse/nef-vue-generale-02.webp`                | `/notre-paroisse` Architecture      | **documentaire** | non                           |
| `thrift-store/hoodies-rack-pixabay.jpg`            | `/friperie` hero rotatif            | illustration     | non                           |
| `thrift-store/yarn-ball-pixabay.jpg`               | `/friperie` hero rotatif            | illustration     | non                           |
| `thrift-store/winter-boots-pixabay.jpg`            | `/friperie` hero rotatif            | illustration     | non                           |
| `home/editorial/parish-life-marian-artwork.jpg`    | `/` Vie paroissiale                 | illustration     | non                           |
| `home/editorial/church-facade-editorial.jpg`       | `/` Services pratiques              | illustration     | non                           |
| `home/editorial/candles-prayer.jpg`                | `/` Interlude                       | illustration     | non                           |
| `paroisse/eglise-exterieur-identification-01.webp` | `/` Venez nous rencontrer           | **documentaire** | non                           |

**Cas particulier — `/friperie` :** en plus des 3 visuels de hero, la page publie **7 cadres vides** (1 dans la présentation, 6 dans la galerie « La friperie en images »), tous définis dans `src/data/thriftStore.ts`. Le champ `gallery` du document Sanity ne porte que l'eyebrow, le titre et l'introduction : `placeholders` est projeté depuis le repli local et rien d'autre. La paroisse ne peut donc pas remplacer un seul de ces cadres par une vraie photographie. Cette page est indexable (`noIndex: false`).

**Cas particulier — `/nos-services` :** aucun champ image n'existe dans `servicesPageType.ts`. Les 5 images, leurs textes alternatifs et leurs notes de crédit (« Image : Tobias C. Wahl, provenance Pixabay identifiée par le fichier… ») sont exclusivement dans `src/data/services.ts`.

**Images non utilisées du dépôt.** Ces fichiers ne sont importés nulle part — ils correspondent à des visuels aujourd'hui téléversés dans Sanity : `src/assets/images/history-timeline/*` (8 fichiers), `src/assets/images/events/pilgrimages/*` (5 fichiers), `src/assets/images/events/concert-paroissial-01.png`, `grande-celebration-01.png`, `parish-life/hero/*` (3 fichiers), et une vingtaine de photos dans `src/assets/images/paroisse/`. Ils ne cassent rien, mais entretiennent l'idée qu'ils sont la source. À trancher après la mise en production.

---

## 6. Champs Sanity inutilisés

| Champ                                                          | Document                      | Constat                                                                                                                                                     |
| -------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`socialLinks`** (tableau complet : plateforme + URL validée) | `siteSettings`                | **Jamais projeté, jamais normalisé, jamais rendu.** Pendant ce temps le pied de page et le menu mobile affichent « Facebook » et « YouTube » en texte mort. |
| `shortName`                                                    | `siteSettings`                | Déclaré, jamais lu.                                                                                                                                         |
| `lastReviewedAt`                                               | `siteSettings`                | Renseigné, jamais projeté (note interne — acceptable).                                                                                                      |
| **`rightsNote`**                                               | `eventImage` (8 emplacements) | Jamais projeté. Renseigné pour les illustrations générées par IA. Voir § 12.                                                                                |
| `confirmationNote`                                             | `advertiser`                  | Volontairement non projeté (note interne). Correct et documenté.                                                                                            |
| `credit` sur les visuels de `parishLifePage`                   | `parishLifePage`              | Projeté et normalisé, mais aucun composant ne l'affiche.                                                                                                    |
| `containsRecognizablePeople`, `consentConfirmed`               | `homePage.gallery`            | Utilisés dans le filtre de publication, jamais affichés — comportement voulu.                                                                               |

---

## 7. Contenus visibles non administrables

Au-delà des images (§ 5) et des textes (§ 4), un manque systémique :

**Les métadonnées SEO.** `firstVisitPage` est le **seul** document doté d'un objet `seo` dans le schéma et dans la requête. Les 12 autres pages tirent leur `<title>` et leur `<meta name="description">` soit d'un objet `seo` figé dans `src/data/*.ts`, soit — pour `/` et `/horaires` — d'une chaîne écrite directement dans le fichier `.astro`. Tous les normalizers concernés contiennent littéralement `seo: fallback.seo`.

C'est le contenu le plus fréquemment retouché sur un site paroissial, et c'est celui qui exige aujourd'hui un développeur. Le drapeau `noIndex` est dans le même cas : `/contact`, `/evenements` et `/nos-annonceurs` sont invisibles des moteurs de recherche, et seul un développeur peut les rendre visibles.

---

## 8. Contenus administrables mais non rendus

1. **`siteSettings.socialLinks`** — le champ le plus manifestement câblé à moitié. L'éditrice peut saisir l'adresse de la page Facebook de la paroisse : elle n'apparaîtra nulle part.
2. **`eventImage.rightsNote`** — 8 emplacements, renseignés dans le dataset, jamais lus.
3. **`parishLifePage.hero.slides[].visual.alt`** — saisi dans le Studio, puis explicitement écarté par `ParishLifeHero.astro` qui passe `alt=""` (le conteneur est `aria-hidden`, donc le choix est cohérent — mais le champ demande à l'éditrice un travail sans effet).
4. **`parishLifePage.features[].visual.credit`** — projeté, normalisé, jamais affiché.
5. **`contactPage.location.extraNotes`** — tableau vide dans le dataset ; le mécanisme fonctionne, rien à corriger.

---

## 9. Problèmes de fallback

`src/data/` contient **1 909 lignes** dont la quasi-totalité est une copie complète du contenu éditorial présent dans Sanity.

| Fichier            | Lignes | Classe                                 | Commentaire                                                                         |
| ------------------ | ------ | -------------------------------------- | ----------------------------------------------------------------------------------- |
| `services.ts`      | 299    | **C — duplication éditoriale risquée** | 11 services avec tarifs 2026. Deux vérités à corriger quand un tarif change.        |
| `about.ts`         | 283    | **C**                                  | 9 repères historiques dupliqués.                                                    |
| `contact.ts`       | 223    | **A/C**                                | La structure du formulaire est légitime (A) ; les textes autour sont dupliqués (C). |
| `firstVisit.ts`    | 194    | **C**                                  | —                                                                                   |
| `parishLife.ts`    | 174    | **C**                                  | —                                                                                   |
| `thriftStore.ts`   | 165    | **C + F**                              | Les 7 placeholders devraient être un état vide honnête, pas un repli.               |
| `advertisers.ts`   | 149    | **C**                                  | —                                                                                   |
| `homePage.ts`      | 141    | **C**                                  | —                                                                                   |
| `events.ts`        | 123    | **C**                                  | —                                                                                   |
| `schedules.ts`     | 86     | **A**                                  | Ne contient **aucune heure** — repli honnête, exemplaire.                           |
| `siteSettings.ts`  | 44     | **A/B**                                | `map` et `directionsUrl` ne sont dans aucun schéma (B).                             |
| `parish-events.ts` | 28     | **A**                                  | Réglages seulement, aucun événement inventé. Exemplaire.                            |

**Le vrai défaut n'est pas l'existence des replis, c'est leur déclenchement silencieux.** Le motif `x.length > 0 ? x : fallback.x` est utilisé pour les catégories d'événements, les chapitres de services, les groupes, les repères historiques, les étapes, les paragraphes. Il ne distingue pas « Sanity a répondu, la liste est vide » de « la liste n'a pas pu être normalisée ». J'en ai observé la conséquence en conditions réelles : en prévisualisation, `/evenements` affiche les catégories du fichier local sans qu'aucun signal ne l'indique — le mot « Entraide », qui n'existe que dans `src/data/events.ts`, apparaît à l'écran.

`getMassSchedule` et `getParishEvents` montrent la bonne pratique : pas de repli du tout, état vide assumé.

---

## 10. Documents ou références Sanity incomplets

**Documents.** Les 13 singletons attendus et les 2 collections sont présents et publiés. Aucune référence cassée, aucun document orphelin, aucun doublon, aucun slug manquant, aucune date invalide.

**Brouillons non publiés — 2.**

- `drafts.schedulePage` : supprime deux champs orphelins présents dans la version publiée.
- `drafts.servicesPage` : **identique au contenu publié**, seul `_system` diffère. C'est un brouillon vide qui affichera indéfiniment « modifications non publiées » dans le Studio.

**Champs orphelins dans le dataset.** Le document publié `schedulePage` porte `regularSchedule` (4 entrées complètes) et `lastReviewedAt`. Ces champs **n'existent pas** dans `schedulePageType.ts` et ne sont projetés par aucune requête : ce sont les restes d'un modèle antérieur. Ils ne s'affichent pas et ne sont pas modifiables — mais ils dupliquent l'horaire réel de `massSchedule`, ce qui rendra la prochaine lecture du dataset trompeuse.

**Images sans fichier — 3.** `eventsPage.categories[2]`, `[3]` et `[4]` portent un objet `eventImage` sans `asset` ni `alt`. Sans effet visible (ces catégories utilisent une illustration animée via `visualKind`), mais l'éditrice voit trois champs image vides dont elle ne peut pas deviner qu'ils sont inutiles.

**Annonceurs — question de fond.** Les 4 fiches publiées portent `status: "active"` (donc visibles) alors que leur propre `confirmationNote` dit le contraire :

> « Confirmer l'entente active, les coordonnées, le texte et obtenir un logo officiel après le retour de la secrétaire. »
> « Coordonnées lues dans une image historique. Confirmer le mandat, l'entente, les données et les droits du portrait avant toute publication. »

Trois de ces fiches nomment des personnes réelles (un député provincial, un conseiller municipal, une députée fédérale) avec téléphone et courriel professionnels. Le schéma prévoit exactement le statut adapté — « À confirmer — invisible » — et il n'est pas utilisé. La page est `noindex`, ce qui limite l'exposition, mais elle est publique et liée depuis le menu.

**Hygiène des données.** Espaces parasites en tête de valeur sur `siteSettings.organizationName`, `address.city`, `address.province`, `schedulePage.hero.eyebrow`, `eventsPage.categories[1].summary`, et sur plusieurs champs de `parishEvent`. Les normalizers les suppriment tous — **sauf les doubles espaces internes** : `« Croisières   AML »` est rendu tel quel dans le HTML de `/evenements`.

**Assets.** 29 fichiers `sanity.imageAsset` dans le dataset, tous référencés. Aucun orphelin.

---

## 11. Incohérences entre pages et composants partagés

1. **Pied de page vs menu mobile.** Le même écran mobile affiche `[ADRESSE]` et `[TÉLÉPHONE]` dans le menu, puis « 4251 Rue Parc René-Goupil / Montréal, Québec H1Z 1X8 / 514 722-1161 » dans le pied de page. Deux traitements opposés de la même donnée, dans le même composant partagé.
2. **Réseaux sociaux.** Un schéma complet dans Sanity, un texte mort dans le Header **et** dans le Footer, deux formulations différentes (`|` dans le menu, `·` dans le pied de page).
3. **Transparence sur les images.** `/notre-paroisse` affiche « Illustration artistique — non documentaire » 16 fois et « Source éditoriale » 9 fois. `/evenements` affiche deux illustrations générées par IA (`generatedByAi: true`) sans aucune mention. `/vie-paroissiale` affiche deux visuels de hero générés par IA sans aucune mention. Le standard que le projet s'est donné ne s'applique qu'à une page sur trois.
4. **Mention publicitaire.** `advertisersPage.introduction.disclosure` est administrable, mais `AdvertiserList.astro` réaffiche une seconde mention codée en dur juste en dessous.
5. **Aperçu accueil vs page Vie paroissiale.** Correctement câblés : les noms de groupes de l'accueil viennent de `parishLifePage`, et le filtre `active` s'applique aux deux. Aucune divergence possible — c'est le bon modèle.

---

## 12. Problèmes visuels et fonctionnels détectés

### Sortie publique (`pnpm build:public`)

| Problème                                                                          | Emplacement                             | Gravité    |
| --------------------------------------------------------------------------------- | --------------------------------------- | ---------- |
| `[ADRESSE]` et `[TÉLÉPHONE]` visibles dans le menu mobile                         | 18 pages sur 18                         | **élevée** |
| Section « La friperie en images » : 6 cadres vides « Photographie réelle prévue » | `/friperie`                             | **élevée** |
| Cadre vide « Vue générale du local » dans la présentation                         | `/friperie`                             | moyenne    |
| `© 2026Paroisse Saint-René-Goupil.` — espace manquant                             | `Footer.astro:1027-1029`, 18 pages      | faible     |
| `« Photo : Croisières   AML »` — double espace                                    | `/evenements`                           | faible     |
| `<img>` sans attribut `alt` (au lieu de `alt=""`) sur les visuels décoratifs      | heros de `/`, `/vie-paroissiale`, logos | faible     |

Aucune section vide, aucune carte sans contenu, aucun titre manquant, aucun lien cassé, aucune mise en page rompue par un champ long.

### Prévisualisation (Presentation / `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true`)

C'est ici que se trouve le défaut fonctionnel le plus sérieux de l'audit. Vérifié en comparant, mot à mot, le HTML du serveur de développement et celui de la sortie publique.

| Page          | Ce que voit l'éditrice                                                                                                             | Ce qui est réellement publié                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `/`           | « **Horaires à confirmer.** » dans le hero                                                                                         | Mardi 8 h · Jeudi 8 h · Samedi 16 h · Dimanche 10 h |
| `/horaires`   | Horaire régulier **entièrement absent** (jours, heures, titres, description de période, date de révision)                          | Tableau complet                                     |
| `/evenements` | Sections « À venir » et « Retour sur nos événements » **entièrement absentes** ; catégories remplacées par celles du fichier local | 2 événements et 5 catégories Sanity                 |

**Cause.** Le client de prévisualisation active l'encodage stega, qui glisse des caractères invisibles dans chaque chaîne. Le filtre défini dans `src/lib/sanity/preview.ts:78` n'en exclut que quatre champs :

```ts
const ATTRIBUTE_FIELDS = new Set(['alt', 'imageAlt', 'phone', 'publicEmail']);
```

Tous les autres champs _machine_ sont donc encodés, puis comparés à des valeurs exactes qui n'admettent aucun caractère supplémentaire :

- `time` contre `/^([01]\d|2[0-3]):([0-5]\d)$/` — `schedule-format.ts:26` → toutes les entrées d'horaire rejetées ;
- `weekday` comme clé de `WEEKDAY_INDEXES` / `WEEKDAY_LABELS` → `undefined` ;
- `publicationStatus === 'published'` — `parish-events.ts` → tous les événements filtrés ;
- `visualKind === 'image'` — `normalizeSanityEventsPage.ts:57` → catégories écartées, puis repli local.

`cleanString()` n'aide pas : `String.prototype.trim()` ne considère pas les caractères de largeur nulle comme des espaces.

Les attributs HTML, eux, sont propres — j'ai vérifié `href`, `src`, `id`, `datetime` sur quatre pages en prévisualisation : aucune pollution. La protection existante suffit pour les attributs, pas pour la logique.

**Conséquence pratique :** l'éditrice ouvre Presentation pour vérifier son horaire, voit une page vide, et conclut que sa saisie n'a pas fonctionné.

### Ce qui fonctionne bien

- La sortie de `pnpm build:public` est propre : **0 caractère invisible**, `noindex` uniquement sur les 11 pages voulues. Le garde-fou `scripts/build-public.mjs` fait exactement ce qu'il promet — vérifié en comparant avec un `pnpm build` lancé avec le drapeau actif, qui produit bien 4 064 caractères stega par page et un `noindex` généralisé.
- Le carrousel de l'accueil, la chronologie de `/notre-paroisse`, la lentille de `/vie-paroissiale`, les images Sanity avec point focal, `lqip` et `srcset` : tous corrects.
- Les overlays de Visual Editing fonctionnent : les zones cliquables apparaissent bien sur le contenu Sanity et pas sur le contenu local — ce qui en fait, incidemment, un bon outil de diagnostic.
- 254 tests, `eslint --max-warnings 0`, `astro check` (251 fichiers) : tous verts. Aucun ne détecte les problèmes ci-dessus.

---

## 13. Éléments volontairement différés

| Élément                                                              | Nature du blocage                                                                       | Priorité avant production | Mise en ligne possible sans ?                                        |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------- |
| Formulaire de contact / SMTP                                         | technique + décision                                                                    | P1                        | oui — l'avis « envoi non activé » est honnête                        |
| Courriel public                                                      | information manquante (paroisse)                                                        | P2                        | oui — `showPublicEmail:false`, aucune ligne vide                     |
| Crédits photographiques                                              | information manquante — « Nom de la photographe à inscrire dans le crédit » (4 visuels) | **P1**                    | non — droits d'auteur                                                |
| Pages légales (`/mentions-legales`, `/politique-de-confidentialite`) | rédaction                                                                               | **P0**                    | non — le formulaire y renvoie                                        |
| Feuillets paroissiaux                                                | non commencé                                                                            | P3                        | oui                                                                  |
| Galerie complète (`/galerie`)                                        | décision de modèle                                                                      | P3                        | oui — 6 photos sur l'accueil                                         |
| Confirmation des annonceurs                                          | information manquante (secrétariat)                                                     | **P0**                    | non — voir § 10                                                      |
| Attribution architecturale (Roger D'Astous, Jean-Paul Pothier)       | information à confirmer                                                                 | P2                        | oui — la page dit qu'elle n'est pas confirmée                        |
| SEO administrable par page                                           | travail technique                                                                       | P2                        | oui                                                                  |
| `sitemap.xml`                                                        | technique                                                                               | P1                        | oui                                                                  |
| `robots.txt`                                                         | technique                                                                               | **P1**                    | non — un site sans `robots.txt` est indexé au hasard                 |
| Open Graph + image OG                                                | technique + visuel                                                                      | P1                        | oui                                                                  |
| JSON-LD                                                              | technique                                                                               | P2                        | oui                                                                  |
| Domaine                                                              | externe                                                                                 | **P0**                    | non                                                                  |
| Hébergement / Vercel                                                 | technique                                                                               | **P0**                    | non                                                                  |
| Webhook de reconstruction                                            | technique                                                                               | **P0**                    | non — sans lui, une correction dans le Studio ne change rien au site |
| Déploiement du Studio                                                | technique                                                                               | **P0**                    | non — la paroisse n'a pas d'accès                                    |
| Prévisualisation distante                                            | technique                                                                               | P2                        | oui                                                                  |

---

## 14. Risques avant production

1. **Le site ne se met pas à jour tout seul.** Sortie `static`, aucun webhook. Tant qu'il n'existe pas, chaque correction faite par la paroisse dans le Studio reste invisible jusqu'à une reconstruction manuelle. C'est le risque qui annule le bénéfice de toute la migration.
2. **Des espaces réservés en production.** `[ADRESSE]` et `[TÉLÉPHONE]` sur 18 pages sur 18.
3. **Publication de données personnelles non confirmées.** Trois élus nommés, avec coordonnées, sur une page publique, en contradiction avec les notes de révision de leurs propres fiches.
4. **Prévisualisation trompeuse.** L'éditrice ne peut pas faire confiance à Presentation pour les horaires ni pour les événements.
5. **Crédits photographiques manquants** sur 4 visuels dont l'auteure est connue mais non nommée.
6. **Deux vérités éditoriales.** Corriger un tarif dans le Studio laisse `src/data/services.ts` en désaccord. Le repli ne se déclenche qu'en cas d'échec, mais quand il se déclenchera, il affichera les tarifs d'hier sans le dire.
7. **`src/lib/sanity/sanity.types.ts` est ignoré par git.** La CI lance bien TypeGen avant de valider ; la configuration d'hébergement, qui n'existe pas encore, devra faire la même chose.
8. **Un brouillon vide** (`drafts.servicesPage`) affichera un badge « modifications non publiées » permanent, que l'éditrice apprendra à ignorer.

---

## 15. Liste priorisée

### P0 — bloque la mise en ligne

| #    | Problème                                                                    | Où                       |
| ---- | --------------------------------------------------------------------------- | ------------------------ |
| P0-1 | `[ADRESSE]` / `[TÉLÉPHONE]` livrés sur 18 pages                             | `Header.astro:299,316`   |
| P0-2 | Annonceurs `active` alors que l'entente et les droits ne sont pas confirmés | dataset `advertiser` × 4 |
| P0-3 | Pages légales vides alors que le formulaire y renvoie                       | `[slug].astro`           |
| P0-4 | Aucun webhook de reconstruction, aucun hébergement, Studio non déployé      | infrastructure           |

### P1 — à corriger avant livraison

| #    | Problème                                                                           | Où                                                   |
| ---- | ---------------------------------------------------------------------------------- | ---------------------------------------------------- |
| P1-1 | `socialLinks` administrable mais jamais rendu ; textes morts dans Header et Footer | `queries.ts`, `Footer.astro:975`, `Header.astro:318` |
| P1-2 | Stega casse horaires et événements en prévisualisation                             | `preview.ts:78`                                      |
| P1-3 | Galerie `/friperie` : 7 cadres vides non administrables sur une page indexable     | `data/thriftStore.ts`, `thriftStorePageType.ts`      |
| P1-4 | 5 images éditoriales de `/nos-services` sans aucun champ Sanity                    | `servicesPageType.ts`, `data/services.ts`            |
| P1-5 | Photo d'architecture de `/notre-paroisse` sans champ Sanity                        | `aboutPageType.ts`, `data/about.ts`                  |
| P1-6 | Phrase d'identité du pied de page non administrable                                | `Footer.astro:970`                                   |
| P1-7 | Crédits photographiques manquants (4 visuels)                                      | dataset `parishLifePage`                             |
| P1-8 | Aucun `robots.txt`                                                                 | `public/`                                            |
| P1-9 | Images générées par IA sans mention sur `/evenements` et `/vie-paroissiale`        | `queries.ts` (`rightsNote`), composants              |

### P2 — important, peut suivre

| #     | Problème                                                                         |
| ----- | -------------------------------------------------------------------------------- |
| P2-1  | SEO administrable pour les 12 pages restantes                                    |
| P2-2  | `noIndex` de `/contact`, `/evenements`, `/nos-annonceurs` à réexaminer           |
| P2-3  | Champs orphelins `regularSchedule` / `lastReviewedAt` dans `schedulePage` publié |
| P2-4  | Brouillon vide `drafts.servicesPage`                                             |
| P2-5  | Objets image sans fichier dans `eventsPage.categories[2..4]`                     |
| P2-6  | Eyebrows et paragraphes de section codés en dur (§ 4, catégorie 1)               |
| P2-7  | Mention publicitaire en double, l'une administrable, l'autre non                 |
| P2-8  | Images éditoriales de l'accueil (4) non administrables                           |
| P2-9  | `© 2026Paroisse` — espace manquant                                               |
| P2-10 | Espaces parasites et doubles espaces dans le dataset                             |
| P2-11 | Open Graph, sitemap, JSON-LD                                                     |

### P3 — amélioration future

| #    | Sujet                                                                                       |
| ---- | ------------------------------------------------------------------------------------------- |
| P3-1 | Remplacer les replis de catégorie C par un état vide honnête, une fois la production stable |
| P3-2 | Supprimer les images du dépôt désormais téléversées dans Sanity                             |
| P3-3 | `siteSettings.shortName` : utiliser ou retirer                                              |
| P3-4 | `siteSettings.map` / `directionsUrl` dans Sanity (le titre de la carte est éditorial)       |
| P3-5 | Libellés de catégories (`Culture`, `Pèlerinage`…) alignés sur les titres du Studio          |
| P3-6 | `alt=""` explicite plutôt qu'attribut absent                                                |

---

## 16. Plan de correction minimal

### P0-1 — Espaces réservés du menu mobile

- **Fichier :** `src/components/layout/Header.astro:275-323`
- **Cause :** le composant a été écrit avant `siteSettings` et n'a jamais été rebranché ; il est synchrone alors que `getSiteSettings()` est asynchrone.
- **Impact :** 18 pages sur 18 affichent un espace réservé à un visiteur mobile.
- **Solution :** rendre le frontmatter de `Header.astro` asynchrone et appeler `getSiteSettings()`, exactement comme `Footer.astro:957`. Afficher `address.formatted` et `phone.display`, et rendre le téléphone cliquable via `phone.href`. Le bloc entier disparaît si la donnée manque.
- **Taille :** petite (~20 lignes).
- **Décision requise :** non.

### P0-2 — Statut des annonceurs

- **Documents :** `advertiser-buffet-marina`, `advertiser-frantz-benjamin`, `advertiser-josue-corvil`, `advertiser-patricia-lattanzio`
- **Cause :** les fiches ont été semées avec `status: "active"` alors que leur note de révision demande une confirmation préalable.
- **Impact :** coordonnées professionnelles de trois personnes réelles publiées sans entente confirmée.
- **Solution :** passer les quatre fiches à « À confirmer — invisible » dans le Studio jusqu'au retour du secrétariat. La page se replie proprement : `showAdvertisers` est déjà conjugué au nombre de fiches retenues, la grille vide ne s'affiche jamais.
- **Taille :** aucune ligne de code.
- **Décision requise :** **oui — c'est votre appel.** Si vous jugez ces placements déjà entendus, dites-le et je n'y touche pas.

### P0-3 — Pages légales

- **Fichier :** `src/pages/[slug].astro`
- **Impact :** le formulaire de contact renvoie à une politique de confidentialité qui affiche « Page en préparation ».
- **Solution :** hors périmètre technique — rédaction à fournir. Une fois le texte disponible, deux documents Sanity de type page suffisent.
- **Décision requise :** **oui** — qui rédige, et faut-il un document Sanity ou une page de code ?

### P0-4 — Infrastructure

Hors périmètre de cet audit. À planifier : hébergement, domaine, déploiement du Studio, webhook de reconstruction sur publication.

### P1-1 — Réseaux sociaux

- **Fichiers :** `src/lib/sanity/queries.ts` (`SITE_SETTINGS_QUERY`), `normalizeSanitySiteSettings.ts`, `types/siteSettings.ts`, `Footer.astro:974-978`, `Header.astro:318-322`
- **Cause :** le champ a été créé lors de la fondation `siteSettings` et le câblage frontend n'a jamais suivi.
- **Solution :** projeter `socialLinks[]{platform, url}`, ajouter `socialLinks` au contrat `PublicContactDetails`, rendre de vrais liens dans les deux composants, et ne rien afficher si le tableau est vide.
- **Taille :** moyenne (~60 lignes, 5 fichiers).
- **Décision requise :** non — mais il faudra saisir les URL réelles dans le Studio.

### P1-2 — Stega casse la prévisualisation

- **Fichier :** `src/lib/sanity/preview.ts:78`
- **Cause :** le filtre n'exclut que les champs destinés à des attributs HTML, pas les valeurs machine comparées à des constantes.
- **Impact :** en prévisualisation, l'horaire des messes et la liste des événements disparaissent ; les catégories d'événements retombent silencieusement sur le contenu local.
- **Solution :** élargir `ATTRIBUTE_FIELDS` à toutes les valeurs d'énumération et de format strict — `weekday`, `time`, `recurrenceType`, `publicationStatus`, `category`, `kind`, `visualKind`, `surface`, `severity`, `status`, `ctaTarget`, `target`, `source`, `imageKind`, `website`, `email`, `url`. Renommer la constante (`MACHINE_VALUE_FIELDS`) puisqu'elle ne concerne plus seulement des attributs. Ajouter un test qui vérifie qu'une chaîne polluée par des caractères de largeur nulle traverse `toWeeklyMassEntries` sans perte.
- **Taille :** petite (~15 lignes + un test).
- **Décision requise :** non.

### P1-3 — Galerie de la friperie

- **Fichiers :** `studio/schemaTypes/documents/thriftStorePageType.ts`, `queries.ts`, `normalizeSanityThriftStore.ts`, `ThriftStoreGallery.astro`, `data/thriftStore.ts`
- **Cause :** la migration a couvert l'eyebrow, le titre et l'introduction de la galerie, mais pas son contenu.
- **Impact :** une page indexable publie sept cadres « photographie prévue » que la paroisse ne peut pas remplir.
- **Solution :** ajouter un tableau `photos[]` de type `galleryPhoto` (l'objet existe déjà, il sert l'accueil) au document `thriftStorePage`, le projeter, et faire afficher par le composant les photos réelles quand il y en a. Tant que le tableau est vide, **masquer la section** plutôt que d'afficher des cadres — c'est un état vide honnête plutôt qu'un aveu de chantier sur une page publique. Le cadre de la présentation suit la même règle.
- **Taille :** moyenne (~120 lignes, 5 fichiers).
- **Décision requise :** **oui** — masquer la section, ou garder les cadres visibles en attendant les photos ?

### P1-4 — Images de `/nos-services`

- **Fichiers :** `servicesPageType.ts`, `serviceChapterType.ts`, `queries.ts`, `normalizeSanityServicesPage.ts`, `types/services.ts`, `data/services.ts`
- **Cause :** la migration de `/nos-services` a explicitement laissé les images de côté (« les images, qui restent des fichiers du projet », `normalizeSanityServicesPage.ts:123`).
- **Impact :** cinq illustrations, leurs textes alternatifs et leurs notes de crédit ne sont modifiables que par un développeur — alors que ce sont précisément les visuels qu'une paroisse voudra remplacer par ses propres photographies.
- **Solution :** trois `eventImage` dans `hero`, un `eventImage` facultatif par chapitre. Conserver `frame` et `objectPosition` dans le code (ce sont des choix de mise en page), remplacer `objectPosition` par le point focal du Studio comme ailleurs. Téléverser les cinq fichiers, puis vider les images du repli local.
- **Taille :** grande (~200 lignes, 6 fichiers + téléversements).
- **Décision requise :** non, sauf si vous préférez repousser après la mise en ligne.

### P1-5 — Photo d'architecture de `/notre-paroisse`

- **Fichiers :** `aboutPageType.ts`, `queries.ts`, `normalizeSanityAboutPage.ts:250`, `data/about.ts`
- **Solution :** ajouter un `eventImage` + `caption` au groupe `architecture`, sur le modèle exact de `historyEntry` qui fonctionne déjà bien dans le même document.
- **Taille :** petite (~50 lignes).
- **Décision requise :** non.

### P1-6 — Phrase d'identité du pied de page

- **Fichiers :** `siteSettingsType.ts`, `queries.ts`, `normalizeSanitySiteSettings.ts`, `Footer.astro:970`
- **Solution :** un champ `tagline` (texte, 2 lignes) dans `siteSettings`. Le bloc disparaît si le champ est vide.
- **Taille :** petite (~25 lignes).
- **Décision requise :** non.

### P1-7 — Crédits photographiques

- **Documents :** `parishLifePage.features[0..3].visual.credit`
- **Cause :** les notes de droits disent « Nom de la photographe à inscrire dans le crédit ».
- **Solution :** obtenir le nom, l'inscrire dans le Studio, et faire afficher `credit` par `ParishLifeFeature.astro` (le champ est déjà projeté et normalisé).
- **Taille :** petite côté code (~10 lignes).
- **Décision requise :** **oui** — le nom de la photographe.

### P1-8 — `robots.txt`

- **Fichier :** `public/robots.txt` (à créer)
- **Solution :** autoriser l'exploration, pointer vers le futur `sitemap.xml`. À faire en même temps que le sitemap.
- **Taille :** triviale.

### P1-9 — Mention des illustrations générées par IA

- **Fichiers :** `queries.ts` (projeter `rightsNote` et `generatedByAi`), `EventCategories.astro`, `ParishLifeHero.astro`
- **Cause :** le champ existe et est renseigné, il n'est simplement jamais lu.
- **Impact :** deux pages affichent des images générées sans le dire, alors qu'une troisième le fait seize fois.
- **Solution :** afficher une mention discrète quand `generatedByAi` est vrai, avec la même formulation que `/notre-paroisse` (« Illustration artistique — non documentaire »). Pour le hero de `/vie-paroissiale`, une ligne unique sous les indicateurs suffit.
- **Taille :** moyenne (~60 lignes).
- **Décision requise :** **oui** — voulez-vous la même formulation partout, ou une mention plus légère sur les heros ?

### P2 et P3

Détaillés au § 15. Le plus structurant est **P2-1 (SEO par page)** : un objet `seo` dans les 12 documents restants, sur le modèle déjà en place dans `firstVisitPageType.ts`. Environ 250 lignes réparties sur 12 documents, 12 requêtes et 12 normalizers, mécaniques et sans risque. À faire d'un bloc plutôt que page par page.

---

## Annexe — ce que cet audit n'a pas fait

- Le Studio n'a pas été ouvert dans un navigateur : l'expérience éditrice est évaluée depuis `studio/structure.ts` et les 40 fichiers de schéma, pas depuis l'interface. La structure est correcte (données partagées / collections / pages, singletons verrouillés par `documentId`), mais l'ergonomie réelle des formulaires longs — `servicesPage` et `aboutPage` en particulier — mériterait une vérification à l'écran.
- Le rendu mobile a été vérifié dans le HTML produit et dans le code des composants, pas dans un vrai viewport mobile : l'outil de capture d'écran disponible ne suit pas le redimensionnement de la fenêtre. Les conclusions sur le menu mobile reposent sur le HTML des 18 pages, ce qui est la source faisant foi.
- Aucune mesure de performance, d'accessibilité automatisée ni de compatibilité navigateur.
