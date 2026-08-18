import type { APIRoute } from 'astro';
import { visualEditingEnabled } from '@/lib/sanity/preview';
import { SITE_URL } from '@/lib/seo/siteUrl';
import { absoluteUrl } from '@/lib/seo/urls';

/**
 * `robots.txt` du site public.
 *
 * **Aucun `Disallow` sur les pages fermées.** C'est contre-intuitif, et c'est
 * pourtant l'inverse qui casserait : interdire l'exploration d'une page
 * empêche Google d'y lire son `noindex`. La page reste alors indexable — sans
 * titre ni description, puisqu'il n'a pas eu le droit de la lire. Les huit
 * pages fermées le disent chacune dans son `<head>`, et c'est suffisant.
 *
 * Un environnement de prévisualisation, lui, ferme tout : il sert des
 * brouillons, et rien de ce qu'il montre n'est destiné à être trouvé.
 */
export const GET: APIRoute = () => {
  const body = visualEditingEnabled
    ? ['User-agent: *', 'Disallow: /', '']
    : [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${absoluteUrl(SITE_URL, '/')}sitemap.xml`,
        '',
      ];

  return new Response(body.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
