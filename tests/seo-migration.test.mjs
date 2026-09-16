import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { buildDocumentHead } from '../src/lib/seo/documentHead.ts';
import { legacyRedirectRules } from '../src/lib/seo/redirects.ts';
import { findRoute, SITE_ROUTES } from '../src/lib/seo/routes.ts';
import {
  OFFICIAL_SITE_URL,
  resolveSiteOrigin,
} from '../src/lib/seo/siteOrigin.mjs';
import { absoluteUrl, normalizeRoutePath } from '../src/lib/seo/urls.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const rules = legacyRedirectRules(SITE_ROUTES);

test('le build public exige exclusivement le domaine officiel', () => {
  assert.equal(
    resolveSiteOrigin(` ${OFFICIAL_SITE_URL}/ `, { production: true }),
    OFFICIAL_SITE_URL,
  );
  for (const value of [
    undefined,
    '',
    'http://localhost:4321',
    'http://127.0.0.1',
    'https://site.pages.dev',
    'https://www.paroissesaintrenegoupil.com',
    'http://paroissesaintrenegoupil.com',
    'https://exemple.ca',
  ]) {
    assert.throws(() => resolveSiteOrigin(value, { production: true }));
  }
});

test('la résolution conserve le développement et les origines de prévisualisation', () => {
  assert.equal(resolveSiteOrigin(undefined), 'http://localhost:4321');
  const worker = 'https://paroisse-preview.sebastieneugene123600.workers.dev';
  assert.equal(
    resolveSiteOrigin(worker, { production: true, preview: true }),
    worker,
  );
  assert.equal(
    resolveSiteOrigin('http://localhost:4321', {
      production: true,
      preview: true,
    }),
    'http://localhost:4321',
  );
  assert.throws(() =>
    resolveSiteOrigin(undefined, { production: true, preview: true }),
  );
  for (const value of [
    `${OFFICIAL_SITE_URL}/contact`,
    `${OFFICIAL_SITE_URL}?x=1`,
    `${OFFICIAL_SITE_URL}#x`,
    'https://user:password@example.com',
    'ftp://example.com',
    'invalide',
  ]) {
    assert.throws(() => resolveSiteOrigin(value));
  }
});

test('les anciennes URLs confirmées renvoient vers leur équivalent actuel', () => {
  const confirmed = {
    '/accueil': '/',
    '/événements-à-venir': '/evenements/',
    '/évènements-à-venir': '/evenements/',
    '/pèlerinages': '/evenements/',
    '/inscription-à-la-catéchèse': '/nos-services/',
    '/soutien-à-la-communauté': '/friperie/',
    '/merci-à-nos-annonceurs': '/nos-annonceurs/',
    '/sacrements': '/nos-services/',
    '/merci-a-nos-annonceurs': '/nos-annonceurs/',
  };
  for (const [old, destination] of Object.entries(confirmed)) {
    for (const source of new Set([
      old,
      `${old}/`,
      encodeURI(old),
      encodeURI(`${old}/`),
    ])) {
      assert.deepEqual(
        rules.find((rule) => rule.source === encodeURI(decodeURI(source))),
        { source: encodeURI(decodeURI(source)), destination, status: 301 },
      );
      const route = findRoute(source);
      assert.equal(route?.indexable, false);
      assert.equal(route?.canonicalPath, destination);
      const head = buildDocumentHead({
        seo: { title: 'Ancienne adresse', description: 'Adresse mise à jour.' },
        route,
        siteName: 'Paroisse',
        siteUrl: OFFICIAL_SITE_URL,
      });
      assert.equal(
        head.canonicalUrl,
        absoluteUrl(OFFICIAL_SITE_URL, destination),
      );
      assert.equal(head.openGraph.url, head.canonicalUrl);
      assert.equal(head.robots, 'noindex, nofollow');
    }
  }
  assert.equal(findRoute('/location-de-salle/')?.indexable, true);
  assert.equal(findRoute('/location-de-salle/')?.canonicalPath, undefined);
  for (const proposal of [
    '/catechese/',
    '/pelerinages/',
    '/annonceurs/',
    '/soutien-communaute/',
  ]) {
    assert.equal(findRoute(proposal), undefined);
    assert.ok(
      !rules.some((rule) => normalizeRoutePath(rule.source) === proposal),
    );
  }
});

test('une redirection ne peut pas viser une route absente, fermée ou un alias', () => {
  const alias = {
    path: '/ancien/',
    indexable: false,
    canonicalPath: '/nouveau/',
  };
  assert.throws(() => legacyRedirectRules([alias]));
  assert.throws(() =>
    legacyRedirectRules([alias, { path: '/nouveau/', indexable: false }]),
  );
  assert.throws(() =>
    legacyRedirectRules([
      alias,
      { path: '/nouveau/', indexable: true, canonicalPath: '/' },
    ]),
  );
  assert.throws(() =>
    legacyRedirectRules([
      { ...alias, indexable: true },
      { path: '/nouveau/', indexable: true },
    ]),
  );
  assert.equal(new Set(rules.map((rule) => rule.source)).size, rules.length);
});

test('les accents encodés désignent le même alias sans décoder les séparateurs', () => {
  assert.equal(
    findRoute('/%C3%A9v%C3%A9nements-%C3%A0-venir')?.path,
    '/événements-à-venir/',
  );
  assert.equal(
    findRoute('/%c3%a9v%c3%a9nements-%c3%a0-venir/')?.canonicalPath,
    '/evenements/',
  );
  assert.equal(normalizeRoutePath('/foo%2Fbar'), '/foo%2Fbar/');
  assert.equal(findRoute('/%invalide'), undefined);
});

test('le contrôle du build refuse les régressions de domaine, sitemap et 301', async (t) => {
  const fixture = mkdtempSync(join(tmpdir(), 'paroisse-seo-'));
  const write = (path, value) => {
    const file = join(fixture, path);
    mkdirSync(resolve(file, '..'), { recursive: true });
    writeFileSync(file, value);
  };
  const pagePath = (route) =>
    route.path === '/404/' ? '404.html' : `${route.path.slice(1)}index.html`;
  const pageHtml = (route) => {
    const canonical = absoluteUrl(
      OFFICIAL_SITE_URL,
      route.canonicalPath ?? route.path,
    );
    return `<html><head><link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}">${route.indexable ? '' : '<meta name="robots" content="noindex, nofollow">'}${route.canonicalPath ? `<meta http-equiv="refresh" content="0;url=${route.canonicalPath}">` : ''}<meta property="og:image" content="${OFFICIAL_SITE_URL}/image.jpg"><meta property="og:image:alt" content="Église"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"></head></html>`;
  };
  const reset = () => {
    for (const route of SITE_ROUTES) write(pagePath(route), pageHtml(route));
    write(
      'sitemap.xml',
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset>' +
        SITE_ROUTES.filter((route) => route.indexable)
          .map(
            (route) =>
              `<url><loc>${absoluteUrl(OFFICIAL_SITE_URL, route.path)}</loc></url>`,
          )
          .join('') +
        '</urlset>',
    );
    write(
      'robots.txt',
      `User-agent: *\nAllow: /\nSitemap: ${OFFICIAL_SITE_URL}/sitemap.xml\n`,
    );
    write(
      '_redirects',
      rules
        .map(
          ({ source, destination, status }) =>
            `${source} ${destination} ${status}`,
        )
        .join('\n') + '\n',
    );
    write(
      '_headers',
      '/_astro/*\n Cache-Control: public, max-age=31536000, immutable\n',
    );
  };
  const check = () =>
    spawnSync(
      process.execPath,
      ['--experimental-strip-types', 'scripts/check-built-seo.mjs', fixture],
      { cwd: root, encoding: 'utf8' },
    );
  const change = (file, before, after) =>
    write(
      file,
      readFileSync(join(fixture, file), 'utf8').replace(before, after),
    );
  try {
    reset();
    execFileSync(
      process.execPath,
      ['--experimental-strip-types', 'scripts/check-built-seo.mjs', fixture],
      { cwd: root, stdio: 'pipe' },
    );
    const regressions = [
      [
        'canonical pages.dev',
        () => change('index.html', OFFICIAL_SITE_URL, 'https://site.pages.dev'),
        /canonical officiel/,
      ],
      [
        'canonical localhost',
        () => change('index.html', OFFICIAL_SITE_URL, 'http://localhost:4321'),
        /canonical officiel/,
      ],
      [
        'canonical www',
        () =>
          change(
            'index.html',
            OFFICIAL_SITE_URL,
            'https://www.paroissesaintrenegoupil.com',
          ),
        /canonical officiel/,
      ],
      [
        'origine entière incorrecte',
        () => {
          for (const route of SITE_ROUTES)
            write(
              pagePath(route),
              pageHtml(route).replaceAll(
                OFFICIAL_SITE_URL,
                'https://site.pages.dev',
              ),
            );
          for (const file of ['sitemap.xml', 'robots.txt']) {
            write(
              file,
              readFileSync(join(fixture, file), 'utf8').replaceAll(
                OFFICIAL_SITE_URL,
                'https://site.pages.dev',
              ),
            );
          }
        },
        /sitemap doit utiliser/,
      ],
      [
        'alias dans le sitemap',
        () =>
          change(
            'sitemap.xml',
            '</urlset>',
            `<url><loc>${OFFICIAL_SITE_URL}/sacrements/</loc></url></urlset>`,
          ),
        /pas une page publique/,
      ],
      [
        'canonical alias incorrect',
        () =>
          change(
            'sacrements/index.html',
            `${OFFICIAL_SITE_URL}/nos-services/`,
            `${OFFICIAL_SITE_URL}/sacrements/`,
          ),
        /canonical officiel/,
      ],
      [
        'destination 301 incorrecte',
        () =>
          change(
            '_redirects',
            '/sacrements /nos-services/ 301',
            '/sacrements /absente/ 301',
          ),
        /301 du registre/,
      ],
      [
        'statut temporaire',
        () => change('_redirects', '301', '302'),
        /301 du registre/,
      ],
      [
        'fichier de redirections absent',
        () => rmSync(join(fixture, '_redirects')),
        /_redirects est absent/,
      ],
      [
        'redirection HTML incorrecte',
        () =>
          change(
            'sacrements/index.html',
            '0;url=/nos-services/',
            '0;url=/contact/',
          ),
        /repli absente ou incorrecte/,
      ],
      [
        'robots bloque le public',
        () => change('robots.txt', 'Allow: /', 'Disallow: /'),
        /autoriser explicitement/,
      ],
      [
        'URL JSON-LD historique',
        () =>
          change(
            'index.html',
            '</head>',
            '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","url":"https://www.paroissesaintrenegoupil.com/"}]}</script></head>',
          ),
        /URL publique/,
      ],
      [
        'image OG sur pages.dev',
        () =>
          change(
            'index.html',
            `${OFFICIAL_SITE_URL}/image.jpg`,
            'https://site.pages.dev/image.jpg',
          ),
        /URL publique/,
      ],
    ];
    for (const [name, mutate, message] of regressions) {
      await t.test(name, () => {
        reset();
        mutate();
        const result = check();
        assert.equal(result.status, 1, result.stderr);
        assert.match(result.stderr, message);
      });
    }
  } finally {
    assert.ok(
      resolve(fixture).startsWith(`${resolve(tmpdir())}\\`) ||
        resolve(fixture).startsWith(`${resolve(tmpdir())}/`),
    );
    rmSync(fixture, { recursive: true, force: true });
  }
});
