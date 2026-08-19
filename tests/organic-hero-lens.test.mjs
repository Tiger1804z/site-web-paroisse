import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  approachAngle,
  buildLensPoints,
  buildSmoothPath,
  decay,
  followPointer,
  limitPointerGap,
  maximumPointerGap,
  POINTER_FOLLOW,
  pointerFollowFactor,
} from '../src/scripts/organic-hero-lens-motion.ts';
import { createLensEnvironment } from './helpers/organic-lens-dom.mjs';

const distance = (first, second) =>
  Math.hypot(first.x - second.x, first.y - second.y);

/** Le suivi d’avant : une fraction fixe par image, quel que soit le temps. */
const legacyFollow = (current, target, factor = 0.13) =>
  current + (target - current) * factor;

test('le rattrapage ne dépend que du temps écoulé, pas du nombre d’images', () => {
  const gap = 40;
  const single = pointerFollowFactor(gap, 32);
  const doubled = 1 - (1 - pointerFollowFactor(gap, 16)) ** 2;

  assert.ok(
    Math.abs(single - doubled) < 1e-12,
    `deux images de 16 ms doivent valoir une image de 32 ms (${single} vs ${doubled})`,
  );
  assert.equal(pointerFollowFactor(gap, 0), 0);
});

test('le rattrapage est adaptatif : souple de près, vif de loin', () => {
  const close = pointerFollowFactor(6, 16);
  const middle = pointerFollowFactor(60, 16);
  const far = pointerFollowFactor(POINTER_FOLLOW.rushDistance * 2, 16);

  assert.ok(close < middle, 'un petit écart doit rester souple');
  assert.ok(middle < far, 'un grand écart doit accélérer le rattrapage');
  assert.ok(far < 1, 'le suivi ne colle jamais au pixel près');
  assert.ok(close > 0.13, 'même de près, le suivi dépasse l’ancien 0,13');
});

test('à vitesse soutenue, le retard reste sous l’ancien modèle et sous le garde-fou', () => {
  const speedPerFrame = 25; // 1500 px/s à 60 images par seconde
  const radius = 120;
  let current = { x: 0, y: 0 };
  let legacy = 0;
  let pointer = 0;

  for (let frame = 0; frame < 90; frame += 1) {
    pointer += speedPerFrame;
    current = followPointer(current, { x: pointer, y: 0 }, 16, radius);
    legacy = legacyFollow(legacy, pointer);
  }

  const gap = pointer - current.x;
  const legacyGap = pointer - legacy;

  assert.ok(
    gap <= maximumPointerGap(radius) + 1e-9,
    `le curseur doit rester dans le cœur de la lentille (${gap} px)`,
  );
  assert.ok(
    gap < legacyGap / 3,
    `le retard doit fondre par rapport à l’ancien suivi (${gap} vs ${legacyGap})`,
  );
});

test('le garde-fou borne l’écart sans changer la direction d’arrivée', () => {
  const current = { x: 0, y: 0 };
  const target = { x: 300, y: 400 };
  const limited = limitPointerGap(current, target, 50);

  assert.ok(Math.abs(distance(limited, target) - 50) < 1e-9);
  // Toujours sur le segment : la lentille arrive du même côté.
  const cross =
    (target.x - current.x) * (target.y - limited.y) -
    (target.y - current.y) * (target.x - limited.x);
  assert.ok(Math.abs(cross) < 1e-9, 'la trajectoire n’est pas déviée');
  assert.ok(Math.abs(limited.x - 270) < 1e-9);
  assert.ok(Math.abs(limited.y - 360) < 1e-9);

  const untouched = limitPointerGap({ x: 10, y: 10 }, { x: 12, y: 10 }, 50);
  assert.deepEqual(untouched, { x: 10, y: 10 });
});

test('un écart énorme ne peut pas persister une seule image', () => {
  const radius = 100;
  const teleported = followPointer(
    { x: 0, y: 0 },
    { x: 2000, y: 0 },
    16,
    radius,
  );

  assert.ok(
    Math.abs(2000 - teleported.x - maximumPointerGap(radius)) < 1e-9,
    'après un saut du curseur, l’écart est ramené au maximum admis',
  );
});

test('l’écart maximal suit le rayon, avec un plancher quand la lentille est petite', () => {
  assert.equal(maximumPointerGap(0), POINTER_FOLLOW.minimumGap);
  assert.equal(maximumPointerGap(200), 200 * POINTER_FOLLOW.maximumGapRatio);
  assert.ok(maximumPointerGap(140) < 140, 'le curseur reste dans la forme');
});

test('la direction se rapproche par le plus court chemin', () => {
  const across = approachAngle(Math.PI - 0.1, -Math.PI + 0.1, 1);
  assert.ok(
    Math.abs(
      Math.atan2(Math.sin(across), Math.cos(across)) - (-Math.PI + 0.1),
    ) < 1e-9,
    'un demi-tour passe par le raccourci, pas par un tour complet',
  );

  const partial = approachAngle(0, Math.PI / 2, 0.5);
  assert.ok(Math.abs(partial - Math.PI / 4) < 1e-9);
  assert.equal(approachAngle(0.4, 0.4, 1), 0.4);
});

test('l’énergie du geste décroît en temps, pas en images', () => {
  const single = decay(1, 32, 240);
  const doubled = decay(decay(1, 16, 240), 16, 240);

  assert.ok(Math.abs(single - doubled) < 1e-12);
  assert.ok(decay(1, 240, 240) < 0.4);
});

test('le contour reste centré sur le pointeur, même étiré à pleine vitesse', () => {
  for (const direction of [0, 0.7, Math.PI / 2, 2.6, -1.2]) {
    const points = buildLensPoints({
      centerX: 640,
      centerY: 360,
      radius: 130,
      energy: 1,
      direction,
      shapePhase: 1.4,
      breathPhase: 0.6,
    });

    const center = {
      x: points.reduce((total, point) => total + point.x, 0) / points.length,
      y: points.reduce((total, point) => total + point.y, 0) / points.length,
    };

    assert.ok(
      distance(center, { x: 640, y: 360 }) < 1e-9,
      `la masse ne part ni devant ni derrière le pointeur (${direction})`,
    );
  }
});

test('la forme traîne derrière le pointeur et respire au repos', () => {
  const moving = buildLensPoints({
    centerX: 0,
    centerY: 0,
    radius: 100,
    energy: 1,
    direction: 0,
    shapePhase: 0,
    breathPhase: 0,
  });

  const behind = Math.abs(Math.min(...moving.map((point) => point.x)));
  const ahead = Math.max(...moving.map((point) => point.x));
  assert.ok(behind > ahead, 'la traîne est plus longue que le nez');

  const calm = (breathPhase) =>
    buildLensPoints({
      centerX: 0,
      centerY: 0,
      radius: 100,
      energy: 0,
      direction: 0,
      shapePhase: 0,
      breathPhase,
    });

  const inhaled = Math.max(...calm(Math.PI / 2).map((point) => point.x));
  const exhaled = Math.max(...calm(-Math.PI / 2).map((point) => point.x));
  assert.ok(inhaled > exhaled, 'la forme respire même sans mouvement');
  assert.ok(
    (inhaled - exhaled) / 100 < 0.06,
    'la respiration reste discrète, jamais une pulsation',
  );
});

test('le tracé reste un contour fermé en courbes', () => {
  const path = buildSmoothPath([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
  ]);

  assert.match(path, /^M /);
  assert.ok(path.endsWith('Z'));
  assert.equal(path.match(/Q /g).length, 3);
  assert.equal(buildSmoothPath([]), '');
});

/**
 * Le contrôleur, monté sur le DOM minimal : ce que le pointeur déclenche
 * vraiment, du premier survol jusqu’à la fermeture.
 */
const withLens = async (run, options) => {
  const environment = createLensEnvironment(options);
  const { initializeOrganicHeroLens } =
    await import('../src/scripts/organic-hero-lens.ts');

  try {
    await run(environment, initializeOrganicHeroLens);
  } finally {
    environment.restore();
  }
};

test('la lentille s’initialise une seule fois par héros', async () => {
  await withLens(async (environment, initialize) => {
    const controller = initialize(environment.hero);

    assert.ok(controller, 'le contrôleur est rendu');
    assert.equal(environment.hero.dataset.organicLensInitialized, 'true');
    assert.equal(environment.layers[0].dataset.active, 'true');
    assert.equal(initialize(environment.hero), null, 'pas de second montage');

    controller.setActiveImage(1);
    assert.equal(environment.layers[1].dataset.active, 'true');
    assert.equal(environment.layers[0].dataset.active, 'false');

    controller.destroy();
    assert.equal(environment.resizeObservers[0].disconnected, true);
  });
});

test('un héros sans couche révélée renonce et laisse le marqueur propre', async () => {
  await withLens(async (environment, initialize) => {
    environment.hero.children.set('[data-organic-lens-layer]', []);

    assert.equal(initialize(environment.hero), null);
    assert.equal(
      environment.hero.dataset.organicLensInitialized,
      undefined,
      'le marqueur ne doit pas bloquer une reprise',
    );
  });
});

test('le contour suit le pointeur pendant un geste rapide', async () => {
  await withLens(async (environment, initialize) => {
    initialize(environment.hero);
    environment.dispatchPointer('pointerenter', { x: 300, y: 400 });
    await environment.settle();

    let x = 300;
    for (let frame = 0; frame < 24; frame += 1) {
      x += 25; // 1500 px/s
      environment.dispatchPointer('pointermove', { x, y: 400 });
      environment.advance(16);
    }

    assert.equal(environment.hero.dataset.lensActive, 'true');
    const center = environment.readShapeCenter();
    assert.ok(center, 'un contour est écrit');
    assert.ok(
      distance(center, { x, y: 400 }) <= maximumPointerGap(140) + 1,
      `le curseur reste au cœur de la lentille (${distance(center, { x, y: 400 })} px)`,
    );
    assert.equal(
      environment.clipPath.getAttribute('d'),
      environment.outlinePath.getAttribute('d'),
      'le masque et le liseré partagent le même tracé',
    );
  });
});

test('un défilement pendant le survol ne décale plus la lentille', async () => {
  await withLens(async (environment, initialize) => {
    initialize(environment.hero);
    environment.dispatchPointer('pointerenter', { x: 500, y: 600 });
    await environment.settle();
    environment.dispatchPointer('pointermove', { x: 520, y: 600 });
    environment.advance(16, 3);

    // La page défile de 200 px : le héros monte, le curseur ne bouge pas.
    environment.scrollBy(200);
    environment.dispatchPointer('pointermove', { x: 540, y: 600 });
    environment.advance(16, 3);

    const center = environment.readShapeCenter();
    const expected = { x: 540, y: 600 + 200 };

    assert.ok(center, 'un contour est écrit');
    assert.ok(
      distance(center, expected) <= maximumPointerGap(140) + 1,
      `la lentille suit le héros défilé (${JSON.stringify(center)})`,
    );
  });
});

test('un défilement ne passe pas pour un geste de souris', async () => {
  await withLens(async (environment, initialize) => {
    initialize(environment.hero, {
      cycleOnMovement: true,
      imageChangeDistance: 180,
      imageChangeDelay: 0,
    });
    environment.dispatchPointer('pointerenter', { x: 400, y: 500 });
    await environment.settle();
    environment.dispatchPointer('pointermove', { x: 404, y: 500 });
    environment.advance(16, 2);

    environment.scrollBy(400);
    environment.dispatchPointer('pointermove', { x: 406, y: 500 });
    environment.advance(16, 2);

    assert.equal(
      environment.layers[0].dataset.active,
      'true',
      'la page qui défile ne compte pas comme distance parcourue',
    );
  });
});

test('la lentille se referme quand le pointeur quitte le héros', async () => {
  await withLens(async (environment, initialize) => {
    initialize(environment.hero);
    environment.dispatchPointer('pointerenter', { x: 300, y: 300 });
    await environment.settle();
    environment.dispatchPointer('pointermove', { x: 360, y: 320 });
    environment.advance(16, 4);
    assert.equal(environment.hero.dataset.lensActive, 'true');

    environment.dispatchPointer('pointerleave', { x: 360, y: 320 });
    environment.advance(16, 60);

    assert.equal(environment.hero.dataset.lensActive, 'false');
    assert.equal(environment.clipPath.getAttribute('d'), null);
    assert.equal(environment.outlinePath.getAttribute('d'), null);
  });
});

test('un onglet caché coupe la lentille immédiatement', async () => {
  await withLens(async (environment, initialize) => {
    initialize(environment.hero);
    environment.dispatchPointer('pointerenter', { x: 300, y: 300 });
    await environment.settle();
    environment.dispatchPointer('pointermove', { x: 380, y: 340 });
    environment.advance(16, 4);

    environment.fakeDocument.hidden = true;
    environment.fakeDocument.dispatchEvent(
      new globalThis.Event('visibilitychange'),
    );

    assert.equal(environment.hero.dataset.lensActive, 'false');
    assert.equal(environment.clipPath.getAttribute('d'), null);
  });
});

test('le tactile ne réveille jamais la lentille', async () => {
  await withLens(async (environment, initialize) => {
    initialize(environment.hero);
    environment.dispatchPointer('pointerenter', {
      x: 300,
      y: 300,
      pointerType: 'touch',
    });
    await environment.settle();
    environment.dispatchPointer('pointermove', {
      x: 380,
      y: 340,
      pointerType: 'touch',
    });
    environment.advance(16, 10);

    assert.notEqual(environment.hero.dataset.lensActive, 'true');
    assert.equal(environment.clipPath.getAttribute('d'), null);
  });
});

test('sans survol fin ou avec mouvement réduit, aucun contour n’est écrit', async () => {
  await withLens(
    async (environment, initialize) => {
      initialize(environment.hero);
      environment.dispatchPointer('pointerenter', { x: 300, y: 300 });
      await environment.settle();
      environment.dispatchPointer('pointermove', { x: 400, y: 360 });
      environment.advance(16, 10);

      assert.notEqual(environment.hero.dataset.lensActive, 'true');
      assert.equal(environment.clipPath.getAttribute('d'), null);
    },
    { pointerCapability: false },
  );
});

test('la documentation du mouvement décrit le suivi livré', () => {
  const documentation = readFileSync('docs/MOTION_SYSTEM.md', 'utf8');

  assert.match(documentation, /clamp\(170px, 17vw, 280px\)/);
  assert.match(documentation, /constante de temps/);
  assert.ok(
    !documentation.includes('`0.13`'),
    'l’ancienne interpolation par image ne doit plus être documentée',
  );
});
