# Plan de migration Figma

Ce plan suit l’avancement par lots. Une étape n’est marquée complétée que lorsque son périmètre propre est validé; la livraison des fondations globales ne signifie pas qu’une page publique est migrée.

1. ✅ **Design system — complété dans S1-T01** : tokens, typographie, espacements, états, contrastes et composants UI fondamentaux.
2. ✅ **Layout global — complété dans S1-T01** : document, conteneurs, métadonnées minimales, header, navigation responsive et footer partagés.
3. **Header et footer dans les pages** — les fondations globales sont livrées; vérifier leur contexte, leur état actif et leur fidélité pendant chaque migration de page.
4. ✅ **Accueil — complété dans S1-T02** : composition Figma, photographies réelles, contenus temporaires explicites, interactions légères et responsive de la route `/`.
5. ✅ **Audit du contenu et sitemap — complété dans S1-T02.5** : site existant, fiabilité, contradictions, matrice, confirmations et arborescence proposée; aucune nouvelle page publique migrée.
6. ✅ **Horaires — complété dans S1-T03** : composition Figma, données locales typées, avis et périodes en placeholders, FAQ native et couche d’accès prête pour une future source Sanity.
7. ✅ **Notre paroisse — complété dans S1-T04** : composition narrative Figma, photographies locales, source typée `AboutPageData` et couche d’accès prête pour une future source Sanity. Les faits historiques restent à confirmer éditorialement.
8. ✅ **Première visite — complété dans S1-T05** : parcours Figma, informations pratiques en placeholders, FAQ native, source typée `FirstVisitPageData` et séparation préparée entre `firstVisitPage` et `siteSettings`.
9. **Sacrements et services** — structurer les démarches et préparer les pages de détail.
10. **Catéchèse** — créer la page durable et prévoir les campagnes d’inscription comme contenus volatils.
11. **Vie paroissiale** — migrer les groupes et appels à participation.
12. **Soutien à la communauté** — confirmer l’étendue des services et décider entre page autonome ou fusion avec Friperie.
13. **Événements** — préparer liste, filtres, archives et futures pages de détail.
14. **Pèlerinages** — présenter le programme confirmé et traiter chaque sortie comme un contenu daté.
15. **Feuillets** — préparer l’archive et les documents.
16. **Merci à nos annonceurs** — créer la page, le CTA « Devenir annonceur » et la future collection, sans reprendre de logo non autorisé.
17. **Friperie** — migrer la mission, la présentation et les consignes de dons confirmées.
18. **Location de salle** — migrer l’information et le processus de demande sans réservation instantanée.
19. **Galerie** — migrer la grille et définir une lightbox accessible.
20. **Contact** — migrer coordonnées, carte et structure de formulaire.
21. **Responsive** — valider toutes les routes et tous les recadrages.
22. **Accessibilité** — audit clavier, lecteurs d’écran, contrastes et contenus.
23. **CMS** — sélectionner et intégrer la source éditoriale pour horaires, événements, inscriptions, pèlerinages, feuillets et annonceurs.
24. **Formulaires** — concevoir validation, backend, consentement et courriels.
25. **Déploiement** — choisir l’hébergeur, le domaine, la CI/CD et l’observabilité.

Prochain ticket recommandé : `S1-T06 — Migrer la page Sacrements 1:1 depuis l’export Figma`.
