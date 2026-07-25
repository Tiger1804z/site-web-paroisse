# Préparation Astro et Sanity pour la page Horaires

## Statut

Document pédagogique créé dans `S1-T03`. La page Horaires utilise aujourd’hui
une source TypeScript locale. Sanity n’est ni installé ni configuré dans ce
ticket. Les noms de documents, champs et fichiers Sanity ci-dessous sont des
cibles d’architecture, pas des schémas déjà disponibles.

## 1. Flux actuel

```text
Administrateur développeur
    ↓
modifie src/data/schedules.ts
    ↓
Astro exécute getSchedulePageData()
    ↓
le frontmatter de horaires.astro reçoit SchedulePageData
    ↓
les composants Astro reçoivent des props typées
    ↓
Astro génère le HTML pendant le build
    ↓
le visiteur reçoit une page statique
```

Le fichier `src/pages/horaires.astro` contient :

```astro
---
import { getSchedulePageData } from '@/lib/content/getSchedulePageData';

const schedulePageData = await getSchedulePageData();
---
```

Le code entre `---` est le _component script_, souvent appelé frontmatter. Il
s’exécute dans l’environnement de build, pas dans le navigateur. Il peut
importer des composants et des données, appeler une fonction asynchrone,
attendre une API et préparer les props.

Le template situé sous le second `---` devient du HTML. Les objets importés ne
sont pas automatiquement sérialisés dans la page. Dans S1-T03, aucun état React
et aucun objet global d’horaires n’est envoyé au navigateur.

## 2. Flux futur

```text
Responsable de la paroisse
    ↓
modifie les horaires dans Sanity Studio
    ↓
Sanity enregistre et publie un document
    ↓
un webhook déclenche un rebuild du site
    ↓
Astro exécute une requête GROQ
    ↓
les données Sanity brutes sont normalisées
    ↓
le même type interne SchedulePageData est produit
    ↓
les mêmes composants Astro reçoivent les mêmes props
    ↓
Astro génère le HTML
    ↓
le visiteur reçoit la nouvelle version statique
```

Le design n’a pas besoin de connaître cette transition. Seule l’implémentation
de `getSchedulePageData()` changera.

## 3. Différence entre Astro et Sanity

### Astro

- construit le site;
- contrôle les routes comme `/horaires/`;
- assemble les composants;
- applique les styles et le design system;
- transforme les props en HTML;
- optimise les actifs locaux pendant le build;
- décide si une page est statique ou rendue à la demande.

### Sanity

- stocke du contenu structuré;
- fournit une interface d’administration avec Sanity Studio;
- conserve les horaires, alertes, périodes et célébrations;
- gère brouillons et publications;
- expose les données par API;
- permet de sélectionner les champs avec GROQ.

## 4. Pourquoi Sanity ne remplace pas Astro

Sanity ne construit pas le hero, la grille, la navigation ou le HTML accessible.
Il fournit des données.

Astro construit la page, mais ne fournit pas à lui seul un tableau de bord
éditorial complet pour les responsables de la paroisse.

Les responsabilités restent donc séparées :

```text
Sanity = contenu administrable
Astro  = routes + présentation + génération HTML
```

## 5. Pourquoi les composants ne doivent pas importer Sanity directement

Dans S1-T03, aucun composant sous
`src/components/sections/schedules/` n’importe `schedules.ts` ou
`getSchedulePageData()`. Chacun reçoit des props issues de
`src/types/schedule.ts`.

Cette règle évite :

- une requête différente dans chaque section;
- la répétition de la structure brute du CMS;
- le couplage du design à Sanity;
- des valeurs par défaut dispersées;
- des tests et changements de fournisseur difficiles;
- des incohérences entre le hero, les horaires et la sidebar.

La page orchestre, le composant présente, la couche de contenu récupère.

## 6. Build statique et mise à jour

`astro.config.mjs` déclare `output: 'static'`. Astro génère donc le HTML de
`/horaires/` pendant `pnpm build`.

Une modification publiée dans Sanity ne changera pas spontanément un fichier
HTML déjà déployé. Un nouveau build devra être lancé. Une intégration future
pourra :

1. écouter la publication d’un document Horaire;
2. appeler un webhook de build de l’hébergeur retenu;
3. exécuter `pnpm build`;
4. publier les nouveaux fichiers statiques.

Le futur webhook devra filtrer les documents pertinents, ignorer les brouillons
si nécessaire et vérifier son secret côté récepteur. Ces décisions dépendent de
l’hébergeur et restent hors périmètre.

Cette approche convient au projet parce que :

- les horaires ne changent pas chaque seconde;
- la consultation reste très rapide;
- le site public ne dépend pas d’une API à chaque visite;
- aucune infrastructure serveur permanente n’est requise;
- une panne temporaire du CMS n’empêche pas la lecture de la version publiée.

## 7. Alternative SSR

Avec le rendu serveur à la demande, Astro pourrait interroger Sanity lorsqu’un
visiteur demande `/horaires/`. Le contenu publié serait alors disponible sans
rebuild.

Cette approche ajouterait cependant :

- un adaptateur et un environnement serveur;
- une requête et une dépendance réseau pendant la consultation;
- une stratégie de cache;
- davantage de surveillance et de coûts;
- de nouveaux scénarios de panne.

Le projet reste statique tant qu’une exigence de fraîcheur quasi instantanée ne
justifie pas cette complexité.

## 8. Contrat TypeScript interne

Le contrat vit dans `src/types/schedule.ts`.

| Type                     | Champs                                                                | Obligatoire        | Utilisateur                       | Correspondance Sanity possible                   |
| ------------------------ | --------------------------------------------------------------------- | ------------------ | --------------------------------- | ------------------------------------------------ |
| `ScheduleHero`           | `eyebrow`, `title`, `introduction`, `imageAlt`                        | Oui                | `SchedulesHero.astro`             | chaînes dans un objet `hero`                     |
| `ScheduleTime`           | `label`; `note` facultative                                           | Libellé oui        | horaires réguliers et saisonniers | objet dans un tableau `times`                    |
| `ScheduleEntry`          | `id`, `dayLabel`, `times`; `note` facultative                         | Oui sauf note      | composants d’horaires             | objet de tableau avec `_key` normalisé vers `id` |
| `SchedulePeriod`         | `id`, `title`, `entries`, `active`; description et dates facultatives | Noyau oui          | horaires réguliers et saisonniers | objet ou document avec booléen et dates          |
| `ScheduleNotice`         | `id`, `title`, `message`, `severity`, `active`; action facultative    | Noyau oui          | `ScheduleNotice.astro`            | objet d’alerte et liste de sévérités             |
| `SpecialCelebration`     | `id`, `title`, `dateLabel`; heure et note facultatives                | Noyau oui          | `SpecialCelebrations.astro`       | objet de tableau avec date/heure                 |
| `BeforeYouVisitContent`  | titre, message, liens Contact et Feuillets                            | Oui                | bande sous le hero                | objet éditorial et liens internes                |
| `ScheduleSidebarContent` | panneaux Feuillet et Secrétariat                                      | Oui                | `ScheduleSidebar.astro`           | objets éditoriaux                                |
| `ScheduleFaqItem`        | `id`, `question`, `answer`                                            | Oui                | `ScheduleFaq.astro`               | objet de tableau                                 |
| `SchedulePageData`       | agrégation complète                                                   | Oui, sauf `notice` | page Astro                        | résultat final du normaliseur                    |

Tous les champs sont en lecture seule dans le contrat. Aucun `any` n’est
utilisé.

Les futures dates `startsAt` et `endsAt` de l’alerte restent volontairement
hors de ce contrat de présentation : le normaliseur Sanity les utilisera pour
calculer `active`. Le composant n’a besoin de connaître ni l’heure courante, ni
la règle de publication; il reçoit seulement la décision d’afficher ou non
l’alerte.

## 9. Correspondance TypeScript vers Sanity

| Contrat TypeScript interne | Champ Sanity futur                             | Rôle                          |
| -------------------------- | ---------------------------------------------- | ----------------------------- |
| `hero.title`               | `hero.title` de type `string`                  | Titre de la page              |
| `hero.introduction`        | `hero.introduction` de type `text`             | Introduction                  |
| `regularSchedule`          | `regularSchedule` de type `object`             | Horaire principal             |
| `entries`                  | `entries` de type `array`                      | Jours et groupes d’heures     |
| `times`                    | `times` de type `array`                        | Plusieurs heures pour un jour |
| `validFromLabel`           | dérivé de `validFrom` de type `datetime`       | Début de validité affiché     |
| `validUntilLabel`          | dérivé de `validUntil` de type `datetime`      | Fin de validité affichée      |
| `active`                   | `active` de type `boolean`                     | Activation d’une période      |
| `notice`                   | `notice` de type `object`                      | Changement important          |
| `notice.severity`          | `severity` de type `string` avec liste         | Variante sémantique           |
| `notice.active`            | dérivé de `active`, `startsAt` et `endsAt`     | Visibilité normalisée         |
| `specialCelebrations`      | `specialCelebrations` de type `array`          | Célébrations spéciales        |
| `lastUpdatedLabel`         | dérivé de `lastValidatedAt` de type `datetime` | Dernière validation           |
| `faq`                      | `faq` de type `array`                          | Questions et réponses         |

Les champs `*Label` sont volontairement propres au contrat de présentation. Le
CMS conservera idéalement des dates structurées; le normaliseur les traduira en
français au lieu de demander aux composants de formater des valeurs brutes.

## 10. Requête GROQ future

GROQ permet de filtrer le document voulu puis de projeter uniquement les champs
nécessaires. Exemple conceptuel, non installé et non exécuté :

```ts
const schedulePageQuery = `
  *[_type == "schedulePage" && language == "fr-CA"][0] {
    hero {
      eyebrow,
      title,
      introduction,
      imageAlt
    },
    regularSchedule {
      title,
      description,
      active,
      entries[] {
        _key,
        dayLabel,
        note,
        times[] { label, note }
      }
    },
    seasonalSchedules[] {
      _key,
      title,
      description,
      validFrom,
      validUntil,
      active,
      entries[] {
        _key,
        dayLabel,
        note,
        times[] { label, note }
      }
    },
    notice {
      _key,
      title,
      message,
      severity,
      active,
      startsAt,
      endsAt
    },
    specialCelebrations[] {
      _key,
      title,
      date,
      time,
      note
    },
    lastValidatedAt,
    beforeYouVisit,
    sidebar,
    faq[] {
      _key,
      question,
      answer
    }
  }
`;
```

La projection réduit les données transférées. Elle ne remplace toutefois pas la
normalisation : une valeur absente, un `_key`, une date ou un statut CMS ne
correspond pas automatiquement au contrat interne.

## 11. Normalisation future

Emplacement proposé :

```text
src/lib/content/normalizers/schedule.ts
```

Flux :

```text
Réponse brute Sanity
    ↓
normalizeSchedulePageData(rawData)
    ↓
SchedulePageData
    ↓
composants Astro
```

Le normaliseur pourra :

- convertir `_key` en `id`;
- fournir un tableau vide lorsqu’une collection manque;
- filtrer les périodes inactives;
- trier les entrées;
- convertir les dates en libellés français;
- éliminer une alerte invalide ou expirée;
- fournir un message d’état vide;
- valider ou refuser une valeur de sévérité inconnue;
- garantir que les composants reçoivent le contrat prévu.

Une grande fonction artificielle n’est pas créée avec la source locale, car ses
données sont déjà contrôlées par TypeScript. Elle prendra une valeur réelle
lorsque la forme brute Sanity existera.

## 12. Exemple avant et après

### Aujourd’hui

```astro
---
import { getSchedulePageData } from '@/lib/content/getSchedulePageData';

const schedulePageData = await getSchedulePageData();
---
```

`getSchedulePageData()` retourne `src/data/schedules.ts`.

### Plus tard

```astro
---
import { getSchedulePageData } from '@/lib/content/getSchedulePageData';

const schedulePageData = await getSchedulePageData();
---
```

Le fichier de page reste identique. Seule la couche interne évolue
conceptuellement :

```ts
import { sanityClient } from '@/lib/sanity/client';
import { schedulePageQuery } from '@/lib/sanity/queries';
import { normalizeSchedulePageData } from './normalizers/schedule';

export async function getSchedulePageData(): Promise<SchedulePageData> {
  const rawData = await sanityClient.fetch(schedulePageQuery);
  return normalizeSchedulePageData(rawData);
}
```

Ce code futur n’est pas présent dans le projet. Il illustre la raison concrète
de la fonction d’accès actuelle.

## 13. Build-time et client-side

| Moment           | Exécuté où                                   | S1-T03                                       |
| ---------------- | -------------------------------------------- | -------------------------------------------- |
| Frontmatter      | Node pendant le build                        | lecture des données et préparation des props |
| Composants Astro | moteur de rendu Astro                        | génération du HTML                           |
| `astro:assets`   | pipeline du build                            | variantes responsives du hero                |
| CSS              | compilé au build, appliqué par le navigateur | présentation                                 |
| Script client    | navigateur                                   | aucun script propre à la page Horaires       |
| React hydraté    | navigateur                                   | aucun composant React sur cette page         |

## 14. Sources techniques officielles

- [Composants Astro](https://docs.astro.build/en/basics/astro-components/)
- [Rendu à la demande et mode statique Astro](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Introduction à GROQ](https://www.sanity.io/docs/content-lake/groq-introduction)
- [Client JavaScript Sanity](https://www.sanity.io/docs/apis-and-sdks/js-client-getting-started)
- [Webhooks Sanity](https://www.sanity.io/docs/content-lake/webhooks)
