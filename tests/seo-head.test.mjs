import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import {
  absoluteUrl,
  buildDocumentHead,
  normalizeRoutePath,
} from '../src/lib/seo/documentHead.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const SITE_NAME = 'Paroisse Saint-René-Goupil';
const SITE_URL = 'https://exemple.ca';

const base = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  pathname: '/contact/',
};

const seo = {
  title: 'Contact',
  description: 'Écrire au secrétariat de la paroisse.',
};

const pageImage = {
  src: 'https://cdn.sanity.io/images/page.jpg',
  srcSet: 'https://cdn.sanity.io/images/page.jpg 1200w',
  alt: 'Le parvis de l’église',
};

const siteImage = {
  src: 'https://cdn.sanity.io/images/site.jpg',
  srcSet: 'https://cdn.sanity.io/images/site.jpg 1200w',
  alt: 'La façade de l’église',
};

test('le nom de la paroisse suit le titre de la page', () => {
  const head = buildDocumentHead({ ...base, seo });

  assert.equal(head.title, `Contact | ${SITE_NAME}`);
});

test('sur l’accueil, le nom de la paroisse passe devant', () => {
  const head = buildDocumentHead({ ...base, seo, titleOrder: 'site-first' });

  assert.equal(head.title, `${SITE_NAME} | Contact`);
});

test('une page qui porte le nom de la paroisse ne le répète pas', () => {
  const head = buildDocumentHead({
    ...base,
    seo: { ...seo, title: SITE_NAME },
  });

  assert.equal(head.title, SITE_NAME);
});

test('une description vide ne produit pas une balise vide', () => {
  const head = buildDocumentHead({
    ...base,
    seo: { ...seo, description: '  ' },
  });

  assert.ok(head.description.length > 0);
  assert.equal(head.openGraph.description, head.description);
});

test('la canonique est absolue et décrit l’adresse servie', () => {
  const head = buildDocumentHead({ ...base, seo });

  assert.equal(head.canonicalUrl, 'https://exemple.ca/contact/');
});

test('une canonique déclarée l’emporte sur l’adresse servie', () => {
  const head = buildDocumentHead({
    ...base,
    pathname: '/sacrements/',
    seo: { ...seo, canonicalPath: '/nos-services/' },
  });

  assert.equal(head.canonicalUrl, 'https://exemple.ca/nos-services/');
});

test('og:url dit exactement la même adresse que la canonique', () => {
  const head = buildDocumentHead({ ...base, seo });

  assert.equal(head.openGraph.url, head.canonicalUrl);
});

/**
 * Astro publie des dossiers : l'adresse réellement servie porte une barre
 * finale. Une canonique qui n'en a pas désigne une autre adresse pour Google,
 * et la page se retrouve comptée deux fois.
 */
test('les chemins sont ramenés à une seule forme', () => {
  assert.equal(normalizeRoutePath('/contact'), '/contact/');
  assert.equal(normalizeRoutePath('/contact/'), '/contact/');
  assert.equal(normalizeRoutePath('contact'), '/contact/');
  assert.equal(normalizeRoutePath('/contact/index.html'), '/contact/');
  assert.equal(normalizeRoutePath('/'), '/');
});

test('l’origine ne colle jamais deux barres au chemin', () => {
  assert.equal(
    absoluteUrl('https://exemple.ca/', '/contact/'),
    'https://exemple.ca/contact/',
  );
  assert.equal(
    absoluteUrl('https://exemple.ca', 'contact'),
    'https://exemple.ca/contact/',
  );
});

test('une page fermée à l’indexation le dit', () => {
  const head = buildDocumentHead({ ...base, seo: { ...seo, noIndex: true } });

  assert.equal(head.robots, 'noindex, nofollow');
});

test('une page indexable ne porte aucune balise robots', () => {
  const head = buildDocumentHead({ ...base, seo });

  assert.equal(head.robots, undefined);
});

test('en prévisualisation, même une page indexable est fermée', () => {
  const head = buildDocumentHead({ ...base, seo, previewing: true });

  assert.equal(head.robots, 'noindex, nofollow');
});

test('l’image de la page l’emporte sur celle du site', () => {
  const head = buildDocumentHead({
    ...base,
    seo: { ...seo, shareImage: pageImage },
    siteShareImage: siteImage,
  });

  assert.equal(head.openGraph.image?.url, pageImage.src);
  assert.equal(head.openGraph.image?.alt, pageImage.alt);
});

test('sans image de page, celle du site prend le relais', () => {
  const head = buildDocumentHead({ ...base, seo, siteShareImage: siteImage });

  assert.equal(head.openGraph.image?.url, siteImage.src);
});

test('sans aucune image, rien n’est inventé', () => {
  const head = buildDocumentHead({ ...base, seo });

  assert.equal(head.openGraph.image, undefined);
  assert.equal(head.twitterCard, 'summary');
});

test('une image présente demande la grande vignette', () => {
  const head = buildDocumentHead({ ...base, seo, siteShareImage: siteImage });

  assert.equal(head.twitterCard, 'summary_large_image');
});

test('une adresse d’image relative est rendue absolue', () => {
  const head = buildDocumentHead({
    ...base,
    seo,
    siteShareImage: { ...siteImage, src: '/partage.jpg' },
  });

  assert.equal(head.openGraph.image?.url, 'https://exemple.ca/partage.jpg');
});

/**
 * Les tests suivants lisent la source plutôt qu'un comportement.
 *
 * C'est la panne trouvée par l'audit du 31 juillet : un câblage manquant se lit
 * parfaitement en local et n'apparaît dans aucun test unitaire. Une page qui
 * oublierait de passer son bloc de référencement afficherait un titre correct
 * — celui de son repli — sans jamais lire ce que le Studio montre.
 */

const PAGES_DIRECTORY = `${rootPath}/src/pages`;

function pageFiles(directory = PAGES_DIRECTORY, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return pageFiles(`${directory}/${entry.name}`, `${prefix}${entry.name}/`);
    }

    return entry.name.endsWith('.astro') ? [`${prefix}${entry.name}`] : [];
  });
}

/** Balise ouvrante de `<BaseLayout>`, attributs compris. */
function baseLayoutTag(source) {
  return /<BaseLayout[^>]*>/.exec(source)?.[0];
}

test('chaque page passe son référencement en un seul objet', () => {
  const files = pageFiles();
  assert.ok(files.length >= 16, 'pages introuvables');

  for (const file of files) {
    const tag = baseLayoutTag(read(`src/pages/${file}`));
    assert.ok(tag, `${file} n’utilise pas BaseLayout`);

    assert.match(
      tag,
      /\bseo=/,
      `${file} ne passe pas de bloc \`seo\` : sa page n’a aucun titre à afficher.`,
    );
  }
});

test('aucune page ne contourne l’objet avec ses propres attributs', () => {
  for (const file of pageFiles()) {
    const tag = baseLayoutTag(read(`src/pages/${file}`)) ?? '';

    for (const attribute of ['title=', 'description=', 'canonicalPath=']) {
      assert.ok(
        !tag.includes(attribute),
        `${file} passe encore \`${attribute}\` à BaseLayout : deux façons de dire la même chose finissent par diverger.`,
      );
    }

    assert.ok(
      !/^\s*noIndex\s*$/m.test(tag),
      `${file} passe encore \`noIndex\` à BaseLayout.`,
    );
  }
});

test('les deux dernières pages en dur lisent maintenant Sanity', () => {
  for (const [file, source] of [
    ['index.astro', 'homePage.seo'],
    ['horaires.astro', 'schedulePageData.seo'],
  ]) {
    assert.ok(
      read(`src/pages/${file}`).includes(`seo={${source}}`),
      `${file} n’est pas branchée sur son document Sanity.`,
    );
  }
});

test('le layout compose son en-tête au lieu de l’écrire à la main', () => {
  const source = read('src/layouts/BaseLayout.astro');

  assert.ok(
    source.includes('buildDocumentHead('),
    'BaseLayout n’appelle pas le composeur : les replis ne sont plus testés.',
  );

  for (const tag of [
    'rel="canonical"',
    'og:title',
    'og:description',
    'og:url',
    'og:site_name',
    'og:locale',
    'og:image',
    'twitter:card',
  ]) {
    assert.ok(source.includes(tag), `BaseLayout n’émet pas ${tag}.`);
  }
});

/**
 * Le verrou du domaine. Sans lui, un build de production sans `SITE_URL`
 * publierait des canoniques pointant sur `localhost` — et personne ne le verrait
 * avant que Google ne l'indexe.
 */
test('l’absence de domaine fait échouer le build de production', () => {
  const source = read('src/lib/seo/siteUrl.ts');

  assert.ok(source.includes('import.meta.env.PROD'));
  assert.ok(source.includes('throw new Error'));
  assert.ok(
    read('.env.example').includes('SITE_URL='),
    'SITE_URL n’est pas documentée dans .env.example.',
  );
});
