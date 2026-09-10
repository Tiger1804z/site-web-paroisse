import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

/**
 * Le contrat des textes alternatifs dans les en-têtes animés.
 *
 * L'audit du 5 septembre a trouvé l'inverse d'un défaut d'accessibilité : les
 * images portaient toutes un attribut `alt`, mais trois en-têtes le forçaient à
 * vide et cachaient tout le bloc aux lecteurs d'écran. Résultat, `/friperie/`,
 * `/nos-services/` et `/vie-paroissiale/` n'avaient plus une seule image
 * décrite — pendant que Sophie remplissait consciencieusement le champ « Texte
 * alternatif » du Studio pour chacune d'elles.
 *
 * La règle retenue tient en une phrase : dans un en-tête, la seule image sans
 * description est la copie affichée dans la loupe. Tout le reste est du contenu
 * et porte le texte saisi dans le Studio.
 */

const HEROES = [
  'src/components/sections/home/HomeHero.astro',
  'src/components/sections/services/ServicesHero.astro',
  'src/components/sections/parish-life/ParishLifeHero.astro',
  'src/components/sections/thrift-store/InteractiveThriftHero.astro',
];

const countOf = (source, pattern) => source.match(pattern)?.length ?? 0;

test('la seule image sans description est la copie de la loupe', () => {
  for (const hero of HEROES) {
    const source = read(hero);

    assert.equal(
      countOf(source, /alt=""/g),
      countOf(source, /data-organic-lens-image/g),
      `${hero} : un « alt="" » qui n’est pas un calque de loupe. Une image de contenu doit porter le texte du Studio.`,
    );
  }
});

/**
 * Cacher tout le bloc d'images d'un coup est ce qui avait vidé trois pages. Le
 * masquage se fait donc image par image, et suit celle qui est à l'écran.
 */
test('les en-têtes n’exposent qu’une image à la fois', () => {
  for (const hero of HEROES) {
    const source = read(hero);

    assert.ok(
      source.includes("aria-hidden={index === 0 ? 'false' : 'true'}"),
      `${hero} : aucune image n’est exposée — le masquage est posé sur le bloc entier.`,
    );
  }
});

/**
 * Le masquage initial ne vaut que pour la première image. Sans mise à jour au
 * changement, un lecteur d'écran annoncerait indéfiniment la photographie qui
 * n'est plus à l'écran.
 */
test('le masquage suit la rotation des images', () => {
  const shared = read('src/scripts/hero-slideshow.ts');
  assert.ok(
    shared.includes("setAttribute('aria-hidden'"),
    'Le contrôleur partagé ne déplace plus le masquage.',
  );

  for (const hero of [
    'src/components/sections/services/ServicesHero.astro',
    'src/components/sections/parish-life/ParishLifeHero.astro',
  ]) {
    assert.ok(
      read(hero).includes("setAttribute('aria-hidden'"),
      `${hero} a son propre script de rotation et n’y déplace pas le masquage.`,
    );
  }

  for (const hero of [
    'src/components/sections/home/HomeHero.astro',
    'src/components/sections/thrift-store/InteractiveThriftHero.astro',
  ]) {
    assert.ok(
      read(hero).includes('initializeHeroSlideshow'),
      `${hero} n’utilise plus le contrôleur partagé : vérifier son masquage.`,
    );
  }
});

/**
 * Le champ « Texte alternatif » du Studio ne doit jamais devenir décoratif : le
 * normalizer refuse une image qui n'en a pas, donc une image publiée en a
 * toujours un, et le site doit s'en servir.
 */
test('une image sans texte alternatif ne franchit pas le normalizer', () => {
  const source = read('src/lib/content/normalizeSanityImage.ts');

  assert.ok(
    source.includes('if (!alt || !image?.asset?._id) return undefined;'),
    'Le texte alternatif n’est plus obligatoire : le champ du Studio devient décoratif.',
  );
});
