import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';

const rootPath = fileURLToPath(new URL('..', import.meta.url));

/**
 * Les en-têtes HTTP servis par Cloudflare Pages.
 *
 * `public/_headers` est un fichier de configuration d'hébergeur : aucun test
 * unitaire ne peut l'exécuter, mais on peut vérifier ce qu'il dit. Ce qui
 * compte ici n'est pas tant la règle posée que celle qu'on s'interdit — mettre
 * le HTML en cache long ferait disparaître une publication du Studio derrière
 * une copie gardée par le navigateur, et personne ne comprendrait pourquoi la
 * correction « n'a pas marché ».
 */

/** `_headers` en paires { motif, en-têtes } : un motif en colonne 0, ses en-têtes indentés. */
function parseHeaders(source) {
  const rules = [];

  for (const line of source.split(/\r?\n/)) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;

    if (/^\s/.test(line)) {
      const [name, ...value] = line.trim().split(':');
      rules
        .at(-1)
        ?.headers.set(name.trim().toLowerCase(), value.join(':').trim());
      continue;
    }

    rules.push({ pattern: line.trim(), headers: new Map() });
  }

  return rules;
}

const rules = parseHeaders(readFileSync(`${rootPath}/public/_headers`, 'utf8'));

test('les fichiers versionnés sont gardés un an', () => {
  const rule = rules.find((entry) => entry.pattern === '/_astro/*');

  assert.ok(rule, 'Aucune règle ne couvre /_astro/*.');

  const cacheControl = rule.headers.get('cache-control');
  assert.ok(cacheControl, '/_astro/* ne pose pas de Cache-Control.');
  assert.match(cacheControl, /\bpublic\b/);
  assert.match(cacheControl, /\bmax-age=31536000\b/);
  assert.match(cacheControl, /\bimmutable\b/);
});

/**
 * Le nom de ces fichiers porte une empreinte du contenu : c'est ce qui rend le
 * cache long sûr. Si Astro cessait de les hacher, la règle deviendrait un piège.
 */
test('le cache long ne couvre que des adresses à empreinte', () => {
  for (const rule of rules) {
    const cacheControl = rule.headers.get('cache-control') ?? '';
    if (!/max-age=(\d+)/.test(cacheControl)) continue;

    const seconds = Number(/max-age=(\d+)/.exec(cacheControl)[1]);
    if (seconds < 86400) continue;

    assert.ok(
      rule.pattern.startsWith('/_astro/'),
      `« ${rule.pattern} » est mis en cache ${seconds} s sans être un fichier à empreinte.`,
    );
  }
});

test('aucune règle ne met le HTML en cache', () => {
  const forbidden = ['/', '/*', '/*.html', '/index.html'];

  for (const rule of rules) {
    assert.ok(
      !forbidden.includes(rule.pattern),
      `« ${rule.pattern} » couvre des pages HTML : une publication du Studio resterait invisible.`,
    );
  }
});

/**
 * Le fichier doit atteindre `dist/`, sinon il ne configure rien. Astro copie
 * `public/` tel quel — c'est `scripts/check-built-seo.mjs` qui le vérifie sur la
 * sortie réellement produite, ce test ne garde que la source.
 */
test('le fichier vit dans public/, là où Astro le recopie', () => {
  assert.ok(rules.length > 0, 'public/_headers est vide.');
});
