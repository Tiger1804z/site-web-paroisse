# Plan de reprise — à partir du lot 3

**Écrit le 2026-08-03, mis à jour le 2026-08-06.** Branche
`feature/sanity-content-migration`, tête `cf72b98`, working tree propre,
**rien poussé**.

Ce document porte les décisions déjà validées : elles ne sont pas à redemander.
Le rapport d'audit (`audit-sanity-2026-07-31.md`) reste la liste des problèmes;
celui-ci dit dans quel ordre les traiter et ce qui a déjà été tranché.

---

## Fait — lots 1 et 2

| Lot   | Commit    | Contenu                                                        |
| ----- | --------- | -------------------------------------------------------------- |
| Audit | `073c3e2` | Le rapport, qui sert de liste de travail                       |
| 1     | `91a692c` | Header mobile, stega, verrou du build, réseaux sociaux retirés |
| 2     | `8bfa7ca` | Images éditoriales de 4 pages + nettoyage du dataset           |
| 2 bis | `d6aac9f` | Les 6 dernières images de premier écran                        |

**Résultat :** plus aucune image visible du site public n'est un fichier du
dépôt, sauf le logo (marque) et l'image de `/verification` (page interne,
`noindex`). `pnpm validate` vert : 273 tests, 0 erreur de lint, 0 erreur de
type, 18 pages construites.

## Fait — lot 3, étapes 1 et 2 sur 4 (2026-08-06)

| Étape | Commit    | Contenu                                                              |
| ----- | --------- | -------------------------------------------------------------------- |
| 1     | `d8daee3` | Studio : objet `seo` partagé sur 10 pages, `siteSettings.shareImage` |
| 2     | `0f2273a` | Contrat : `PageSeo`, projections GROQ, 10 normalizers, 4 getters     |
| —     | `cf72b98` | `/contact`, `/evenements`, `/nos-annonceurs` rendues indexables      |

`pnpm validate` vert : **283 tests**, 0 lint, 0 type, 18 pages.

Le dataset `production` a été muté deux fois : `seed-seo.ts` (les 10 blocs
remplis avec le texte déjà publié) et `shorten-thrift-store-seo.ts` (description
de `/friperie` ramenée de 165 à 158 caractères). Sauvegarde préalable :
`backups/production-2026-08-05-avant-seo.tar.gz` (gitignorée).

---

## Décisions validées — ne pas les rouvrir

**Hébergement** : Cloudflare.

**Formulaire** : destinataire `paroissergoupil@videotron.ca`. À la soumission :
envoi à la paroisse, `Reply-To` = courriel du visiteur, accusé de réception au
visiteur. **Aucune base de données**, **aucune journalisation du message
complet**.

**Images** : tout ce qui est éditorial est dans Sanity. Restent au code les
icônes, textures, formes et illustrations décoratives. Une carte doit pouvoir se
rendre proprement **sans** image. Aucun cadre « photographie prévue » obligatoire.
Aucune image inventée pour remplir un espace.

**Images générées par IA** : le champ interne `generatedByAi` reste; **jamais**
de mention publique ajoutée automatiquement. Ne pas supprimer une légende
historique sans vérifier son rôle — celles de `/notre-paroisse` sont voulues.

**Crédits** : produire la liste exacte d'abord (lot 8). Ne rien inventer. Ne
jamais afficher « Nom de la photographe à inscrire ». Crédit absent → rien
d'affiché.

**Fallbacks** : ne garder que l'essentiel — nom de la paroisse, adresse,
téléphone, navigation, routes, états vides honnêtes, configuration technique.
Pas de copie complète des événements, services, FAQ, annonceurs, textes de pages
ni images éditoriales.

**SEO** : dans le Studio, l'éditrice ne gère que **titre**, **description** et
**image de partage**. Le code garde canonical, sitemap, robots.txt, noindex,
Open Graph technique, JSON-LD, URL absolue, fallbacks, validation.

**Interface du Studio** : tout ce qu'on y ajoute doit être compréhensible sans
aucune notion technique. Pas de jargon dans les intitulés — l'onglet s'appelle
« Google et partages », pas « SEO ». Chaque champ dit où son texte s'affiche,
pour qui, et donne un exemple. Les contraintes de longueur sont des
avertissements, pas des blocages. Un champ obligatoire doit être **rempli à
l'avance** : personne ne doit ouvrir un onglet neuf et y trouver une erreur
rouge qu'il n'a pas causée.

**Indexation** (décidé le 2026-08-06) : `/contact`, `/evenements` et
`/nos-annonceurs` sont **indexables**. Dix pages publiques le sont; huit restent
fermées et c'est voulu — trois redirections d'anciennes adresses, trois routes
encore vides, `/verification` et `/404`.

Réserve consignée pour `/nos-annonceurs` : les quatre fiches publiées portent le
téléphone et le courriel de personnes réelles dont la note de révision dit « à
confirmer avant toute publication ». Ces coordonnées sont désormais indexables.
`settings.showAdvertisers` masque les fiches sans refermer la page.

**Réseaux sociaux** : supprimés partout. La paroisse n'a aucune présence
officielle. À réintroduire plus tard si besoin.

---

## Lot 3 — SEO complet, en 4 étapes

### Étape 1 — Studio ✅ `d8daee3`

Objet `seo` partagé, ajouté aux 10 documents de page indexables, plus
`siteSettings.shareImage`.

**Écart assumé** : les champs s'appellent `seo.title`, `seo.description` et
`seo.image`, et non `seoTitle`… comme annoncé plus haut — `/premiere-visite`
avait déjà des données dans cette forme, renommer aurait coûté une mutation du
dataset pour rien.

`noIndex` n'est **pas** dans le Studio : décision de code.

### Étape 2 — Contrat ✅ `0f2273a`

`src/types/seo.ts` (`PageSeo`, une forme unique remplaçant sept formes inline),
`normalizeSanitySeo.ts`, projections GROQ dans les 10 requêtes, 10 normalizers,
4 getters pour l'image de partage, `tests/sanity-seo.test.mjs`.

`canonicalPath` et `noIndex` restent dans le repli local et traversent le
normalizer intacts. Ils déménagent au registre de routes à l'étape 4.

Trois des dix tests lisent la **source** plutôt qu'un comportement : ils
vérifient que chaque requête projette `seo` et que chaque normalizer l'appelle.
C'est la panne trouvée par l'audit — champ complet au schéma, jamais projeté,
tests verts — et aucun test unitaire ne la voit.

### Étape 3 — Rendu (à faire)

Centraliser le `<head>` dans `BaseLayout` : titre, description, canonique
absolue, Open Graph, `og:image`, type, nom du site, locale, robots.

**Fallbacks** : titre absent → titre de page + nom de la paroisse; description
absente → introduction de la page; image absente → `siteSettings.shareImage`;
absente aussi → aucune image, jamais une image de remplissage.

**Domaine non confirmé.** Ne pas l'inventer. Variable `SITE_URL`. Le build de
production doit échouer bruyamment s'il manque, sans casser le développement
local — sur le modèle du verrou déjà posé sur `pnpm build`. Documenter les
variables et la procédure.

**Reste à basculer** : `/` et `/horaires` gardent leur titre et leur description
en dur dans le `.astro`. Les 8 autres pages lisaient déjà `data.seo.*` et sont
donc branchées sur Sanity depuis l'étape 2.

### Étape 4 — Découvrabilité (à faire)

**Registre de routes** : une liste unique, une entrée par route générée, disant
si elle est indexable. `BaseLayout` y lit la balise `robots`, `sitemap.xml` y
lit qui entre. Aujourd'hui l'information est éparpillée dans neuf fichiers, et
rien n'empêche une page d'être à la fois au sitemap et en `noindex`.

**`sitemap.xml`** : point d'entrée Astro plutôt que `@astrojs/sitemap`, pour
qu'il lise le registre au lieu de deviner. `lastmod` depuis `_updatedAt` de
Sanity; ni `priority` ni `changefreq`, ignorés par Google. Barres obliques
finales identiques à celles des canoniques.

**`robots.txt`** : autorise tout, plus la ligne `Sitemap:` absolue. Pas de
`Disallow` sur les pages fermées — il empêcherait Google de lire leur `noindex`.

**JSON-LD** : `WebSite`, `PlaceOfWorship` (nom, adresse, téléphone depuis
`siteSettings`), et `Event` pour les activités dont les champs suffisent. Les
heures du secrétariat ne sont pas publiées en `openingHours` : le champ est du
texte libre, et un horaire mal formaté vaut moins que pas d'horaire.

**Vérification** : chaque route réellement générée apparaît une fois et une
seule dans le sitemap; aucune page n'est simultanément au sitemap et en
`noindex`; XML valide; JSON-LD passé au validateur.

## Lot 4 — Pages légales

Inspecter d'abord les routes et liens existants pour ne pas créer de pages
concurrentes. Aujourd'hui `/mentions-legales` et `/politique-de-confidentialite`
sont des placeholders servis par `src/pages/[slug].astro`, et le formulaire de
contact pointe vers la seconde.

Politique de confidentialité adaptée au Québec, fondée sur des sources
officielles récentes. **Ne pas la présenter comme un avis juridique.**

Le texte doit décrire le fonctionnement **réel** : données collectées par le
formulaire, finalité, absence de base de données applicative, transmission par
un fournisseur d'envoi, réception dans la boîte de la paroisse, accusé de
réception, mesures anti-spam, hébergement Cloudflare, Sanity pour le contenu,
absence d'outils analytiques et de cookies marketing **si c'est réellement le
cas**, procédure d'accès ou de suppression, contact
`paroissergoupil@videotron.ca`.

**Inconnues à ne pas inventer** : nom du responsable de la protection des
renseignements, durée de conservation. Formulation temporaire acceptée :
« Les messages sont conservés pendant la durée nécessaire au traitement et au
suivi de la demande. »

Rendre les textes administrables dans Sanity si c'est cohérent avec le reste,
en protégeant la structure obligatoire.

## Lot 5 — Formulaire Contact

Vérifier l'approche officielle actuelle compatible avec Astro 7 et Cloudflare
avant d'écrire quoi que ce soit.

Validation client **et** serveur complète. Turnstile. Honeypot. Rate limit.
Tailles de champs limitées. Pas de HTML arbitraire, pas de pièces jointes, pas
de base de données, pas de journalisation du message, pas de secret exposé.

Flux : envoi → validation serveur → Turnstile → courriel à la paroisse →
`Reply-To` visiteur → accusé de réception → JSON propre → message de succès
accessible → erreurs claires.

Abstraction de fournisseur d'envoi, pour ne pas lier le formulaire à un service.
Resend possible si compatible. **`From` doit venir d'un domaine vérifié** — pas
`videotron.ca`, et le domaine final n'existe pas encore.

Variables : `CONTACT_FORM_ENABLED`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`,
`CONTACT_REPLY_TO_EMAIL`, `RESEND_API_KEY`, `TURNSTILE_SITE_KEY`,
`TURNSTILE_SECRET_KEY`, `SITE_URL`. **Ne créer aucun secret réel.**

Formulaire désactivé → comportement propre, autres moyens de contact affichés.
Documenter les étapes manuelles une fois le domaine disponible.

## Lot 6 — Cloudflare et webhooks

Documentation officielle Astro / Cloudflare / Sanity uniquement. Choisir entre
Workers, Pages, Pages Functions ou autre, selon : Astro, pré-rendu public,
Visual Editing, routes serveur du formulaire, mode preview, secrets, domaine
personnalisé, coût nul ou minimal. **Expliquer le choix avant de toucher à
l'adapter.**

Configurer adapter, build public, sorties statiques/dynamiques, variables,
routes Contact, mode preview, cache, headers, `noindex` en preview, CSP.

Webhook Sanity : déclencher sur publication, dépublication, suppression et
changements d'assets réellement utilisés — **pas** à chaque frappe dans un
brouillon. Prévoir secret, filtre, anti-rafale, retries, documentation,
journalisation sans contenu sensible.

Accès Cloudflare et domaine demandent une action externe : **préparer le code,
puis donner les étapes exactes dans l'interface. Ne rien déployer.**

## Lot 7 — Nettoyage du dataset et du code

Avant toute suppression distante : export de sauvegarde, liste exacte des
mutations, vérification des références, des brouillons et des assets
indirectement utilisés.

**Déjà fait le 2026-08-03** : `drafts.servicesPage` et `drafts.schedulePage`
supprimés, champs orphelins `regularSchedule` + `lastReviewedAt` retirés,
`socialLinks` retiré du schéma. Sauvegarde :
`backups/production-2026-08-03-avant-images.tar.gz`.

**Reste** : assets réellement orphelins (à vérifier après le lot 3, qui peut en
ajouter), anciens contenus locaux non utilisés, imports morts, types morts,
normalizers morts. Notamment les ~40 fichiers de `src/assets/images/` qui ne
sont plus importés depuis la migration des images — vérifier un par un.

## Lot 8 — Liste des crédits manquants

Rapport **séparé**, avec pour chaque image : route, section, nom ou description,
source locale ou Sanity, asset Sanity, alt actuel, crédit actuel, placeholder
éventuel, statut IA interne, statut documentaire ou décoratif, recommandation.

Ne pas attendre de réponse pour continuer les autres lots. En attendant :
aucun placeholder de crédit affiché, aucun crédit inventé, aucune image
supprimée pour cause de crédit manquant.

**Point de départ** : toutes les photographies de l'église portent
« Crédit photographique à confirmer auprès de la paroisse » dans `rightsNote`,
jamais rendu. Les images Pixabay de `/nos-services` portent leur note de
provenance d'origine, mot pour mot, également dans `rightsNote`.

## Lot 9 — QA finale

Vérification visuelle réelle : desktop, tablette, mobile 360–390 px, menu
mobile, Header, Footer, Studio, Presentation, click-to-edit, formulaires Sanity,
pages sans image, textes longs, pages légales, formulaire désactivé et activé,
états de succès et d'erreur, build public, preview, noindex, SEO, sitemap,
robots, JSON-LD. Toutes les routes réellement générées.

Commandes minimales : `pnpm sanity:typegen`, `format`, `format:check`, `lint`,
`test`, `check`, `build:public`, `validate`, `git diff --check`, recherche de
secrets, de placeholders, de contenu éditorial local oublié, de stega dans le
build public, de `noindex` accidentel, validation HTML et données structurées.

---

## Ordre de travail révisé (2026-08-06)

L'ordre initial était 3 → 4 → 5 → 6 → 7 → 8 → 9. Les lots 5 et 6 sont ceux qui
butent le plus sur ce qui manque, et ne servent à rien avant le domaine. Le lot
8 et la checklist, eux, ne dépendent de personne et sont exactement la matière
de la rencontre du 11 août : les apporter débloque les lots 4, 5, 6 et 8 d'un
coup.

**Ordre proposé** : étapes 3 et 4 du lot 3 → lot 8 + checklist → lot 7 →
lot 4 (légales) → lot 5 → lot 6 → lot 9.

## Décisions encore ouvertes

Ces points **bloquent** ou demandent un arbitrage.

**Tranché le 2026-08-06** : l'indexation de `/contact`, `/evenements` et
`/nos-annonceurs` — les trois sont ouvertes. Voir la réserve consignée plus
haut pour les annonceurs.

| Sujet                             | Ce qui manque                                                                                                                                                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domaine final                     | Non choisi. Ne pas l'inventer.                                                                                                                                                                                              |
| Adresse `From` vérifiée           | Pas `videotron.ca`. Dépend du domaine.                                                                                                                                                                                      |
| Accès Cloudflare                  | Externe.                                                                                                                                                                                                                    |
| Secrets Resend / Turnstile        | Externes. Ne pas en créer.                                                                                                                                                                                                  |
| Responsable de la confidentialité | Nom définitif, pour la politique.                                                                                                                                                                                           |
| Durée de conservation             | Valeur officielle, pour la politique.                                                                                                                                                                                       |
| Crédits photographiques           | Nom de la photographe des vues de l'église.                                                                                                                                                                                 |
| **Statut des 4 annonceurs**       | Publiés `active` alors que leur note dit « à confirmer avant toute publication ». Trois sont des élus réels, avec téléphone et courriel. **Non corrigé faute d'arbitrage — et la page est indexable depuis le 2026-08-06.** |
| Statut IA d'une illustration      | `parish-life-marian-artwork.jpg` : non déterminé, laissé non coché.                                                                                                                                                         |

## Défaut connu, non corrigé

Le document `parishEvent` du pèlerinage au Sanctuaire Notre-Dame-du-Cap porte un
**espace en trop au début de son titre**. Il part déjà dans le HTML et partira
dans le JSON-LD de l'étape 4. Un `set` d'une ligne suffit : proposé le
2026-08-06, pas tranché.

## Livrable attendu à la fin

Une checklist claire des actions à faire avec la secrétaire **le 11 août**.
Elle n'existe pas encore. Bon candidat pour la rencontre : lui montrer l'onglet
« Google et partages », utilisable seulement une fois l'étape 3 terminée — un
champ modifiable dont le site ne lit rien serait pire que pas de champ.
