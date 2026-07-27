# État actuel du projet

Dernière mise à jour : 27 juillet 2026 — S1-T12.

## Pages principales

- `/` : accueil enrichi, hero interactif, vitrail vivant, événements, scène
  « Vivre la paroisse », services, interlude spirituel, carrousel Galerie et
  coordonnées confirmées;
- `/notre-paroisse/` : page complète avec timeline immersive; hero inchangé;
- `/horaires/` : structure complète avec données non confirmées;
- `/vie-paroissiale/` : page complète, groupes à confirmer;
- `/nos-services/` : page canonique complète, hero rotatif avec lentille et
  données 2026 révisables;
- `/evenements/` : architecture événementielle locale;
- `/friperie/` : page complète `noindex`, photographies temporaires;
- `/contact/` : frontend complet `noindex`, validation locale seulement;
- `/galerie/` : placeholder `noindex`, volontairement absent de la navigation.

## Contact et coordonnées publiques

Le frontend du commit S1-T09 `43c5469` a été réintégré sélectivement sans
ancien header, footer ou mémoire de branche. La vraie route `/contact/`
remplace le placeholder dynamique.

Les données confirmées sont :

- Paroisse Saint-René-Goupil;
- 4251 Rue Parc René-Goupil, Montréal, Québec H1Z 1X8;
- 514 722-1161;
- coordonnées de carte et lien d’itinéraire.

`src/data/siteSettings.ts` est la source unique. Le normalisateur
`getSiteSettings()` masque le courriel tant que `confirmed` est faux. Les
consommateurs actuels sont Contact, la fin de l’accueil, le footer et Nos
services.

Le formulaire Contact demeure une préparation frontend :

- champs, honeypot, validation locale et erreurs accessibles;
- submit bloqué avec `preventDefault()`;
- aucun `fetch`, endpoint, faux succès ou stockage;
- aucun secret, fournisseur SMTP/API ou fonction serverless.

S1-T09 devra donc encore être repris à la porte de validation du système
d’envoi avant livraison.

## Mini-galerie de l’accueil

Une page Galerie autonome n’est pas utile pour l’instant. La route technique
reste réservée comme placeholder `noindex`, mais sa définition est inactive
dans la navigation canonique.

Le carrousel de l’accueil reçoit au plus six éléments `homepageVisible` d’une
source typée. L’image centrale est mise en valeur par un cadre éditorial; son
titre, sa description et son compteur sont synchronisés. La lightbox utilise
`<dialog>` avec fermeture `Escape`, flèches clavier et restauration du focus.
Sans JavaScript, les images restent visibles en bande horizontale et chaque
carte demeure un lien direct.

Les images IA, externes, temporaires ou sans consentement ne sont pas mélangées
à la collection documentaire.

## Compatibilité

- `/sacrements/` redirige statiquement vers `/nos-services/`;
- `/location-de-salle/` redirige statiquement vers
  `/nos-services/#location-de-salle`;
- `/feuillets-paroissiaux/` demeure un placeholder `noindex`, retiré de la
  navigation publique.

## Navigation et header

La source canonique est `src/lib/navigation.ts`. Contact est actif dans le menu
Informations desktop/mobile et le footer. Galerie, Feuillets et Location de
salle y restent inactifs; Location de salle demeure intégrée à Nos services.

Le header reste translucide au sommet et après défilement, avec fallback
lisible lorsque `backdrop-filter` n’est pas pris en charge.

## Contenus en attente

- choix, sécurité et activation du système d’envoi Contact;
- courriel public et heures du secrétariat;
- Feuillets, différé jusqu’au 10 août 2026 ou au retour de la secrétaire;
- horaires, procédures pastorales et données temporelles à réviser;
- décision future sur l’utilité d’une page Galerie complète et enrichissement
  des crédits photographiques;
- remplacement des prototypes Friperie.

## Architecture

Astro demeure statique, TypeScript strict et sans nouvelle dépendance. Les
images passent par `astro:assets`, les mouvements par CSS et les contrôleurs
JavaScript natifs. Sanity, l’envoi Contact, la réservation et les paiements ne
sont pas installés.
