import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';

/**
 * Les garde-fous du Studio, verrouillés par leur source.
 *
 * `sanity.config.ts` et `structure.ts` ne peuvent pas être importés ici : ils
 * chargent le runtime du Studio, qui suppose un navigateur. On lit donc leur
 * texte, comme le font déjà les autres contrôles de schéma du projet.
 *
 * Ce que ces tests protègent n'est pas du style : c'est la différence entre une
 * interface qu'une secrétaire peut utiliser seule et une interface où trois
 * clics suppriment une page du site.
 */

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const config = read('studio/sanity.config.ts');
const structure = read('studio/structure.ts');

test('l’interface du Studio est en français', () => {
  assert.match(config, /from '@sanity\/locale-fr-fr'/);
  assert.match(config, /frFRLocale\(\)/);

  const studioPackage = JSON.parse(read('studio/package.json'));
  assert.ok(
    studioPackage.dependencies['@sanity/locale-fr-fr'],
    'le pack français doit être une dépendance déclarée',
  );
});

test('Vision et Releases ne sont pas offerts à l’éditrice', () => {
  // Vision est une console de requêtes GROQ; Releases est une fonctionnalité
  // payante non souscrite, qui menait à un écran « Upgrade to unlock ».
  assert.doesNotMatch(config, /visionTool/);
  assert.doesNotMatch(config, /@sanity\/vision/);
  assert.match(config, /releases:\s*\{enabled:\s*false\}/);
  assert.match(config, /scheduledDrafts:\s*\{enabled:\s*false\}/);

  const studioPackage = JSON.parse(read('studio/package.json'));
  assert.ok(
    !studioPackage.dependencies['@sanity/vision'],
    'la dépendance Vision doit être retirée avec le plugin',
  );
});

test('le bouton « + » ne propose que les deux collections', () => {
  // Un deuxième « Page d'accueil » serait invisible dans la structure comme sur
  // le site, tout en existant dans le jeu de données.
  assert.match(config, /newDocumentOptions:/);
  assert.match(config, /COLLECTION_TYPES\.includes\(option\.templateId\)/);
  assert.match(structure, /COLLECTION_TYPES = \['parishEvent', 'advertiser'\]/);
});

test('les documents uniques perdent Supprimer, Dupliquer et Dépublier', () => {
  assert.match(
    config,
    /REMOVED_SINGLETON_ACTIONS = new Set\(\['delete', 'duplicate', 'unpublish'\]\)/,
  );
  assert.match(config, /SINGLETON_TYPES\.includes\(schemaType\)/);
});

/**
 * Le piège de la liste incomplète : un type ajouté à la structure mais oublié
 * dans `SINGLETON_TYPES` garderait Supprimer, et resterait proposé au « + ».
 * On compare donc les deux listes à ce que la structure affiche réellement.
 */
test('tout document unique de la structure est bien déclaré comme unique', () => {
  const declared = new Set(
    [...structure.matchAll(/schemaType\('(\w+)'\)/g)].map((match) => match[1]),
  );

  const singletonList = structure.match(/SINGLETON_TYPES = \[([^\]]*)\]/)?.[1];
  assert.ok(singletonList, 'SINGLETON_TYPES doit rester une liste littérale');

  const singletons = new Set(
    [...singletonList.matchAll(/'(\w+)'/g)].map((match) => match[1]),
  );

  for (const type of declared) {
    assert.ok(
      singletons.has(type),
      `« ${type} » est ouvert comme document unique dans la structure, mais absent de SINGLETON_TYPES : il garderait Supprimer et apparaîtrait au bouton « + ».`,
    );
  }

  assert.equal(
    singletons.size,
    declared.size,
    'SINGLETON_TYPES déclare un type que la structure n’ouvre pas',
  );
});

test('l’heure se saisit dans un champ qui la met en forme', () => {
  const entry = read('studio/schemaTypes/objects/scheduleEntryType.ts');

  assert.match(entry, /components:\s*\{input:\s*ScheduleTimeInput\}/);
  assert.match(entry, /normalizeScheduleTime\(value\)/);
  // La liste repliée doit montrer « Mardi », pas `tuesday`.
  assert.match(entry, /WEEKDAY_LABELS\[weekday as string\]/);
  assert.match(entry, /formatTimeLabel\(time\)/);
});
