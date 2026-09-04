import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import {
  firstVisitNavigation,
  footerSecondaryNavigation,
  primaryNavigation,
} from '../src/lib/navigation.ts';

/**
 * La barre de navigation, verrouillée par sa source.
 *
 * Ce qu'on protège ici n'est pas une préférence de mise en page. La paroisse a
 * demandé neuf onglets visibles, sans menu déroulant, et trois des neuf
 * (Location de salle, Nos annonceurs, Contact) sortaient justement d'un menu
 * que personne n'ouvrait. Une entrée remise derrière un repli les rendrait
 * invisibles à nouveau, et rien dans un test de rendu ne le signalerait.
 */

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const header = read('src/components/layout/Header.astro');
const footer = read('src/components/layout/Footer.astro');
const navigationSource = read('src/lib/navigation.ts');

const labels = primaryNavigation.map(({ label }) => label);
const paths = primaryNavigation.map(({ href }) => href);

/* -------------------------------------------------------------------------
 * Ce que la barre contient
 * ------------------------------------------------------------------------- */

test('les neuf onglets demandés sont là, dans l’ordre demandé', () => {
  assert.deepEqual(labels, [
    'Notre paroisse',
    'Vie paroissiale',
    'Horaires',
    'Événements',
    'Nos services',
    'Friperie',
    'Location de salle',
    'Nos annonceurs',
    'Contact',
  ]);
});

test('les trois pages sorties du menu déroulant sont au premier niveau', () => {
  for (const path of ['/location-de-salle', '/nos-annonceurs', '/contact']) {
    assert.ok(
      paths.includes(path),
      `${path} doit être un onglet, pas une entrée repliée.`,
    );
  }
});

/* -------------------------------------------------------------------------
 * Ce que la barre ne contient plus
 * ------------------------------------------------------------------------- */

/**
 * Le menu « Informations » ne portait plus que deux entrées, et les deux
 * viennent de passer au premier niveau. Un menu déroulant vide serait un geste
 * qui n'ouvre rien.
 */
test('le menu « Informations » n’existe plus nulle part', () => {
  assert.ok(
    !navigationSource.includes('informationNavigation'),
    'la liste doit avoir disparu de navigation.ts.',
  );

  for (const [name, source] of [
    ['Header.astro', header],
    ['Footer.astro', footer],
  ]) {
    assert.ok(
      !source.includes('informationNavigation'),
      `${name} lit encore la liste supprimée.`,
    );
    assert.ok(
      !source.includes('information-menu'),
      `${name} garde le balisage du menu déroulant.`,
    );
  }
});

test('« Accueil » n’est pas un onglet, et le logo mène à l’accueil', () => {
  assert.ok(
    !paths.includes('/'),
    'la place d’un onglet Accueil sert aux pages qu’on n’atteint pas autrement.',
  );
  assert.match(header, /class="site-identity" href="\/"/);
});

/**
 * « Première visite » quitte les onglets sans quitter le site : le pied de page
 * la garde écrite, et la page Horaires porte la carte qui y mène.
 */
test('« Première visite » sort de la barre et reste dans le pied de page', () => {
  assert.ok(!paths.includes(firstVisitNavigation.href));
  assert.ok(
    footerSecondaryNavigation.some(
      ({ href }) => href === firstVisitNavigation.href,
    ),
    'le pied de page doit garder le lien.',
  );
  assert.match(footer, /footerSecondaryNavigation/);
});

test('le pied de page garde un lien écrit vers l’accueil', () => {
  assert.ok(footerSecondaryNavigation.some(({ href }) => href === '/'));
});

/**
 * Le pied de page doit porter les quatre liens nommés par la paroisse, quelle
 * que soit la colonne où ils tombent.
 */
test('le pied de page porte les quatre liens demandés', () => {
  const footerPaths = [...primaryNavigation, ...footerSecondaryNavigation].map(
    ({ href }) => href,
  );

  for (const path of [
    '/premiere-visite',
    '/location-de-salle',
    '/nos-annonceurs',
    '/contact',
  ]) {
    assert.ok(footerPaths.includes(path), `${path} manque au pied de page.`);
  }
});

/* -------------------------------------------------------------------------
 * Le menu mobile
 * ------------------------------------------------------------------------- */

/**
 * Le panneau mobile portait la concaténation de la barre et du menu déroulant.
 * Il lit maintenant la même liste que le bureau — sinon les deux se mettent à
 * diverger, et c'est toujours le mobile qui perd une page.
 */
test('le menu mobile rend la même liste que la barre, plus Première visite', () => {
  const panel = header.slice(header.indexOf('id="site-mobile-menu"'));

  assert.match(panel, /primaryNavigation\.map/);
  assert.match(panel, /firstVisitNavigation\.href/);
  assert.ok(!panel.includes('informationNavigation'));
});

/**
 * Le seuil du menu plein écran est écrit deux fois — une en CSS, une dans le
 * script qui referme le panneau. S'ils divergent, il existe une largeur où le
 * panneau reste ouvert derrière une barre déjà affichée, et le fond de page est
 * inerte : la page devient inutilisable sans qu'aucune erreur ne s'affiche.
 */
test('le seuil du menu plein écran est le même en CSS et en JavaScript', () => {
  const scripted = /matchMedia\('\(min-width: ([\d.]+rem)\)'\)/.exec(
    header,
  )?.[1];
  const styled =
    /@media \(min-width: ([\d.]+rem)\) \{\s*\.site-header__container/.exec(
      header,
    )?.[1];

  assert.ok(scripted, 'le seuil du script est introuvable.');
  assert.equal(styled, scripted);
});

/**
 * Neuf onglets sur une ligne : la tentation est de rétrécir le texte jusqu'à ce
 * que ça rentre. La paroisse l'a explicitement refusé, et un libellé coupé en
 * deux déforme toute la barre.
 */
test('aucun libellé d’onglet ne peut se couper en deux lignes', () => {
  assert.match(header, /\.site-header__nav-link \{[^}]*white-space: nowrap;/s);
});

test('la taille du texte des onglets reste celle du système', () => {
  assert.match(
    header,
    /\.site-header__nav-link \{[^}]*font-size: var\(--font-size-ui\);/s,
  );
});
