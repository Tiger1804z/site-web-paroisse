# État actuel du projet

Dernière mise à jour : 27 juillet 2026.

## Pages principales

- `/` : accueil enrichi, hero interactif, vitrail vivant, événements, scène
  « Vivre la paroisse », aperçu des services, interlude spirituel et carrousel
  photographique centré;
- `/notre-paroisse/` : page complète avec timeline immersive; hero inchangé;
- `/horaires/` : structure complète avec données non confirmées;
- `/vie-paroissiale/` : page complète, groupes à confirmer;
- `/nos-services/` : page canonique complète, hero rotatif avec lentille et
  données 2026 révisables;
- `/evenements/` : architecture événementielle locale;
- `/friperie/` : page complète `noindex`, photographies temporaires.

## Compatibilité

- `/sacrements/` redirige statiquement vers `/nos-services/`;
- `/location-de-salle/` redirige statiquement vers
  `/nos-services/#location-de-salle`;
- `/feuillets-paroissiaux/` demeure un placeholder `noindex`, retiré de la
  navigation publique.

## Navigation et header

La source canonique est `src/lib/navigation.ts`. « Sacrements » est remplacé
par « Nos services », « Location de salle » n’est plus promue séparément dans
Informations, et le bouton redondant « Voir les horaires » a été retiré du
header.

Le header reste translucide au sommet et après défilement. Le second état
emploie une teinte charbon-bourgogne, un blur renforcé et un fallback plus
opaque lorsque `backdrop-filter` n’est pas pris en charge.

## Contenus en attente

- Contact est toujours bloqué à la validation SMTP sur la branche séparée
  `feature/s1-t09-contact-page-1to1`;
- aucune modification SMTP, endpoint, secret ou fonction serverless n’est
  incluse;
- Feuillets reste différé jusqu’au 10 août 2026 ou au retour de la secrétaire;
- horaires, coordonnées globales et plusieurs procédures pastorales doivent
  être confirmés;
- les visuels éditoriaux externes conservent leur suivi de licence dans
  `IMAGE_INVENTORY.md`.

## Architecture

Astro demeure statique, TypeScript strict et sans nouvelle dépendance. Les
images passent par `astro:assets`, les mouvements par CSS et le contrôleur
IntersectionObserver partagé. Sanity, les formulaires connectés, la réservation
et les paiements ne sont pas installés.
