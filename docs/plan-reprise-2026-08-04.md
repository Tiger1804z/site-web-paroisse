# Plan de reprise — à partir du lot 3

**Écrit le 2026-08-03.** Branche `feature/sanity-content-migration`, tête
`d6aac9f`, working tree propre, **rien poussé**.

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

**Réseaux sociaux** : supprimés partout. La paroisse n'a aucune présence
officielle. À réintroduire plus tard si besoin.

---

## Lot 3 — SEO complet

Objet Sanity réutilisable, noms français dans le Studio : `seoTitle`,
`seoDescription`, `seoImage`. Ajouté à chaque document de page indexable.

Prévoir limites de longueur, validations utiles, descriptions françaises, image
facultative, aperçu Studio quand c'est raisonnable.

**Fallbacks** : titre absent → titre de page + nom de la paroisse; description
absente → introduction de la page; image absente → image de partage globale
(à ajouter dans `siteSettings`, pas un fichier local).

**Frontend** : centraliser la génération des métadonnées dans `BaseLayout` —
title, description, canonical, Open Graph, image OG, type, nom du site, locale,
robots. Ajouter `sitemap.xml`, `robots.txt`, JSON-LD `WebSite` et
`Organization`/`PlaceOfWorship`, données structurées d'événements quand leurs
champs suffisent.

**Domaine non confirmé.** Ne pas l'inventer. Variable `SITE_URL`. Le build de
production doit dire clairement qu'il manque, sans casser le développement
local. Documenter les variables et la procédure.

**Point de départ concret** : aujourd'hui, **seule `/premiere-visite`** a un
objet `seo` dans Sanity. Les 12 autres pages tirent leur `<title>` d'un objet
figé dans `src/data/*.ts`, ou — pour `/` et `/horaires` — d'une chaîne écrite
dans le fichier `.astro`. Chercher `seo: fallback.seo` dans les normalizers :
c'est la trace exacte à remplacer.

**À réexaminer au passage** : `/contact`, `/evenements` et `/nos-annonceurs`
sont `noindex` alors qu'ils sont dans la navigation. Décision à prendre page par
page.

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

## Décisions encore ouvertes

Ces points **bloquent** ou demandent un arbitrage. Aucun n'a été tranché.

| Sujet                             | Ce qui manque                                                                                                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domaine final                     | Non choisi. Ne pas l'inventer.                                                                                                                                              |
| Adresse `From` vérifiée           | Pas `videotron.ca`. Dépend du domaine.                                                                                                                                      |
| Accès Cloudflare                  | Externe.                                                                                                                                                                    |
| Secrets Resend / Turnstile        | Externes. Ne pas en créer.                                                                                                                                                  |
| Responsable de la confidentialité | Nom définitif, pour la politique.                                                                                                                                           |
| Durée de conservation             | Valeur officielle, pour la politique.                                                                                                                                       |
| Crédits photographiques           | Nom de la photographe des vues de l'église.                                                                                                                                 |
| **Statut des 4 annonceurs**       | Publiés `active` alors que leur note dit « à confirmer avant toute publication ». Trois sont des élus réels, avec téléphone et courriel. **Non corrigé faute d'arbitrage.** |
| Statut IA d'une illustration      | `parish-life-marian-artwork.jpg` : non déterminé, laissé non coché.                                                                                                         |

## Livrable attendu à la fin

Une checklist claire des actions à faire avec la secrétaire **le 11 août**.
