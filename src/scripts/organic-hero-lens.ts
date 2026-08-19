import {
  approachAngle,
  buildLensPoints,
  buildSmoothPath,
  clamp,
  decay,
  followPointer,
  LENS_SHAPE,
  type Point,
} from './organic-hero-lens-motion.ts';

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type OrganicHeroLensOptions = {
  initialImageIndex?: number;
  cycleOnMovement?: boolean;
  imageChangeDistance?: number;
  imageChangeDelay?: number;
};

export type OrganicHeroLensController = {
  destroy: () => void;
  setActiveImage: (index: number) => void;
};

/** Au-delà de ce silence, en millisecondes, la lentille se referme. */
const MOVEMENT_FRESHNESS = 115;
/** Constante de temps de l’énergie du geste. */
const ENERGY_TIME_CONSTANT = 240;
/** Constante de temps de la direction de l’étirement. */
const DIRECTION_TIME_CONSTANT = 70;
/** Croissance et retrait du rayon, en constantes de temps. */
const RADIUS_GROWTH_TIME_CONSTANT = 90;
const RADIUS_RELEASE_TIME_CONSTANT = 150;
/** Dérive lente de la forme, en radians par milliseconde. */
const IDLE_SHAPE_DRIFT = 0.00085;

export const initializeOrganicHeroLens = (
  hero: HTMLElement,
  options: OrganicHeroLensOptions = {},
): OrganicHeroLensController | null => {
  if (hero.dataset.organicLensInitialized === 'true') return null;
  hero.dataset.organicLensInitialized = 'true';

  const revealLayers = Array.from(
    hero.querySelectorAll<HTMLElement>('[data-organic-lens-layer]'),
  );
  const revealImages = Array.from(
    hero.querySelectorAll<HTMLImageElement>('[data-organic-lens-image]'),
  );
  const lensClipPath = hero.querySelector<SVGPathElement>(
    '[data-organic-lens-clip-path]',
  );
  const lensOutlinePath = hero.querySelector<SVGPathElement>(
    '[data-organic-lens-outline-path]',
  );
  const lensMetric = hero.querySelector<HTMLElement>(
    '[data-organic-lens-metric]',
  );

  if (
    revealLayers.length === 0 ||
    revealImages.length === 0 ||
    !lensClipPath ||
    !lensOutlinePath ||
    !lensMetric
  ) {
    delete hero.dataset.organicLensInitialized;
    return null;
  }

  const controller = new AbortController();
  const pointerCapability = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  const idleWindow = window as IdleWindow;
  const cycleOnMovement = options.cycleOnMovement ?? true;
  const imageChangeDistance = options.imageChangeDistance ?? 180;
  const imageChangeDelay = options.imageChangeDelay ?? 560;

  let heroRect = hero.getBoundingClientRect();
  // Une mesure périmée, jamais une mesure par image : le rectangle n’est relu
  // que lorsque la page a bougé sous le pointeur.
  let geometryStale = false;
  let maximumRadius = lensMetric.getBoundingClientRect().width / 2;
  let pointerInside = false;
  let imagesReady = false;
  let preparingImages = false;
  let destroyed = false;
  let frameId: number | undefined;
  let idleHandle: number | undefined;
  let timeoutHandle: number | undefined;
  let activeImageIndex = 0;
  let targetX = heroRect.width / 2;
  let targetY = heroRect.height / 2;
  let currentX = targetX;
  let currentY = targetY;
  // Dernière position en coordonnées de fenêtre : un défilement change le
  // rectangle du héros sans nouvel événement de pointeur. Le geste se mesure
  // dans ce repère, sinon une page qui défile passerait pour un mouvement de
  // souris — énergie fantôme et image qui saute.
  let clientX = heroRect.left + targetX;
  let clientY = heroRect.top + targetY;
  let previousPointerX = clientX;
  let previousPointerY = clientY;
  let previousPointerTime = performance.now();
  let previousFrameTime = performance.now();
  let lastPointerMove = -Infinity;
  let currentRadius = 0;
  let targetRadius = 0;
  let motionEnergy = 0;
  let motionDirection = 0;
  let targetDirection = 0;
  let shapePhase = 0;
  let breathPhase = 0;
  let travelledDistance = 0;
  let lastImageChange = performance.now();

  const setActiveImage = (index: number) => {
    const normalizedIndex =
      ((index % revealLayers.length) + revealLayers.length) %
      revealLayers.length;
    activeImageIndex = normalizedIndex;
    revealLayers.forEach((layer, layerIndex) => {
      layer.dataset.active = String(layerIndex === activeImageIndex);
    });
  };

  setActiveImage(options.initialImageIndex ?? 0);

  const measureGeometry = () => {
    heroRect = hero.getBoundingClientRect();
    maximumRadius = lensMetric.getBoundingClientRect().width / 2;
    geometryStale = false;
    return heroRect;
  };

  /** Le rectangle courant, relu seulement s’il a pu changer. */
  const readHeroRect = () => (geometryStale ? measureGeometry() : heroRect);

  const markGeometryStale = () => {
    geometryStale = true;
  };

  /** La position du pointeur dans le repère du héros, mesure fraîche comprise. */
  const pointerToHero = () => {
    const rect = readHeroRect();
    return {
      x: clamp(clientX - rect.left, 0, rect.width),
      y: clamp(clientY - rect.top, 0, rect.height),
    };
  };

  const resizeObserver = new ResizeObserver(() => {
    const rect = measureGeometry();
    targetX = clamp(targetX, 0, rect.width);
    targetY = clamp(targetY, 0, rect.height);
    currentX = clamp(currentX, 0, rect.width);
    currentY = clamp(currentY, 0, rect.height);
  });

  const writeLensShape = () => {
    if (currentRadius < 0.35) {
      lensClipPath.removeAttribute('d');
      lensOutlinePath.removeAttribute('d');
      return;
    }

    const points: Point[] = buildLensPoints({
      centerX: currentX,
      centerY: currentY,
      radius: currentRadius,
      energy: motionEnergy,
      direction: motionDirection,
      shapePhase,
      breathPhase,
    });

    const path = buildSmoothPath(points);
    lensClipPath.setAttribute('d', path);
    lensOutlinePath.setAttribute('d', path);
  };

  const stopFrame = () => {
    if (frameId !== undefined) {
      window.cancelAnimationFrame(frameId);
      frameId = undefined;
    }
  };

  const resetLens = () => {
    currentRadius = 0;
    targetRadius = 0;
    motionEnergy = 0;
    hero.dataset.lensActive = 'false';
    lensClipPath.removeAttribute('d');
    lensOutlinePath.removeAttribute('d');
  };

  const animatePointer = (time: number) => {
    frameId = undefined;
    if (destroyed || !pointerCapability.matches) {
      resetLens();
      return;
    }

    // Une image sautée ou un onglet ralenti ne doit ni figer ni catapulter la
    // lentille : le pas de temps est borné.
    const deltaTime = clamp(time - previousFrameTime, 1, 64);
    previousFrameTime = time;

    const movementIsFresh =
      pointerInside && time - lastPointerMove < MOVEMENT_FRESHNESS;

    // Le héros a pu défiler pendant le geste : la cible est recalculée à partir
    // des coordonnées de fenêtre, pas d’un rectangle mesuré à l’entrée.
    if (pointerInside && geometryStale) {
      const pointer = pointerToHero();
      targetX = pointer.x;
      targetY = pointer.y;
    }

    targetRadius =
      movementIsFresh && imagesReady
        ? maximumRadius * (0.58 + motionEnergy * 0.42)
        : 0;

    const eased = followPointer(
      { x: currentX, y: currentY },
      { x: targetX, y: targetY },
      deltaTime,
      currentRadius,
    );
    currentX = eased.x;
    currentY = eased.y;

    const radiusTimeConstant =
      targetRadius > currentRadius
        ? RADIUS_GROWTH_TIME_CONSTANT
        : RADIUS_RELEASE_TIME_CONSTANT;
    currentRadius +=
      (targetRadius - currentRadius) *
      (1 - Math.exp(-deltaTime / radiusTimeConstant));

    motionDirection = approachAngle(
      motionDirection,
      targetDirection,
      1 - Math.exp(-deltaTime / DIRECTION_TIME_CONSTANT),
    );
    motionEnergy = decay(motionEnergy, deltaTime, ENERGY_TIME_CONSTANT);
    // La forme respire et dérive même quand la souris ralentit : la matière
    // reste vivante au lieu de se figer.
    breathPhase =
      (breathPhase + (deltaTime * Math.PI * 2) / LENS_SHAPE.breathPeriod) %
      (Math.PI * 2);
    shapePhase += deltaTime * IDLE_SHAPE_DRIFT;

    if (currentRadius > 0.45 && imagesReady) {
      hero.dataset.lensActive = 'true';
      writeLensShape();
    } else {
      hero.dataset.lensActive = 'false';
      writeLensShape();
    }

    const positionGap = Math.hypot(targetX - currentX, targetY - currentY);
    const radiusGap = Math.abs(targetRadius - currentRadius);
    const shouldContinue =
      currentRadius > 0.45 ||
      targetRadius > 0.45 ||
      positionGap > 0.12 ||
      radiusGap > 0.12 ||
      (pointerInside && movementIsFresh);

    if (shouldContinue) {
      frameId = window.requestAnimationFrame(animatePointer);
    } else {
      resetLens();
    }
  };

  const requestPointerFrame = () => {
    if (frameId === undefined) {
      previousFrameTime = performance.now();
      frameId = window.requestAnimationFrame(animatePointer);
    }
  };

  const prepareRevealImages = async () => {
    if (imagesReady || preparingImages || destroyed) return;
    preparingImages = true;

    await Promise.all(
      revealImages.map(async (image) => {
        image.loading = 'eager';

        try {
          await image.decode();
        } catch {
          // L’image principale demeure visible si une révélation ne se décode pas.
        }
      }),
    );

    if (destroyed) return;
    imagesReady = revealImages.every(
      (image) => image.complete && image.naturalWidth > 0,
    );
    preparingImages = false;

    if (
      imagesReady &&
      performance.now() - lastPointerMove < MOVEMENT_FRESHNESS
    ) {
      requestPointerFrame();
    }
  };

  const maybeChangeImage = (distance: number, time: number) => {
    if (!cycleOnMovement) return;

    travelledDistance += distance;
    const elapsed = time - lastImageChange;
    if (travelledDistance < imageChangeDistance || elapsed < imageChangeDelay) {
      return;
    }

    setActiveImage(activeImageIndex + 1);
    travelledDistance = 0;
    lastImageChange = time;
  };

  const activatePointer = (event: PointerEvent) => {
    if (!pointerCapability.matches || event.pointerType === 'touch') return;

    pointerInside = true;
    clientX = event.clientX;
    clientY = event.clientY;
    measureGeometry();
    const pointer = pointerToHero();
    targetX = pointer.x;
    targetY = pointer.y;
    currentX = targetX;
    currentY = targetY;
    previousPointerX = clientX;
    previousPointerY = clientY;
    previousPointerTime = performance.now();
    previousFrameTime = previousPointerTime;
    lastPointerMove = -Infinity;
    travelledDistance = 0;
    lastImageChange = performance.now();
    resetLens();
    void prepareRevealImages();
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!pointerInside) {
      activatePointer(event);
    }
    if (!pointerInside) return;

    const now = performance.now();
    clientX = event.clientX;
    clientY = event.clientY;
    const pointer = pointerToHero();
    const deltaX = clientX - previousPointerX;
    const deltaY = clientY - previousPointerY;
    const distance = Math.hypot(deltaX, deltaY);
    const elapsed = Math.max(now - previousPointerTime, 8);

    targetX = pointer.x;
    targetY = pointer.y;
    previousPointerX = clientX;
    previousPointerY = clientY;
    previousPointerTime = now;

    if (distance > 0.35) {
      const speed = distance / elapsed;
      motionEnergy = clamp(
        Math.max(
          motionEnergy * 0.78 + distance / 135,
          distance / 95 + speed / 3.2,
        ),
        0.08,
        1,
      );
      targetDirection = Math.atan2(deltaY, deltaX);
      shapePhase += Math.min(distance * 0.006, 0.42);
      lastPointerMove = now;
      maybeChangeImage(distance, now);
    }

    requestPointerFrame();
  };

  const deactivatePointer = (immediate = false) => {
    pointerInside = false;
    travelledDistance = 0;

    if (immediate) {
      stopFrame();
      resetLens();
      return;
    }

    targetRadius = 0;
    requestPointerFrame();
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      deactivatePointer(true);
    }
  };

  const handleCapabilityChange = () => {
    if (!pointerCapability.matches) {
      deactivatePointer(true);
    }
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    deactivatePointer(true);
    controller.abort();
    resizeObserver.disconnect();

    if (idleHandle !== undefined) {
      idleWindow.cancelIdleCallback?.(idleHandle);
    }
    if (timeoutHandle !== undefined) {
      window.clearTimeout(timeoutHandle);
    }
  };

  hero.addEventListener('pointerenter', activatePointer, {
    passive: true,
    signal: controller.signal,
  });
  hero.addEventListener('pointermove', handlePointerMove, {
    passive: true,
    signal: controller.signal,
  });
  hero.addEventListener('pointerleave', () => deactivatePointer(), {
    passive: true,
    signal: controller.signal,
  });
  document.addEventListener('visibilitychange', handleVisibilityChange, {
    passive: true,
    signal: controller.signal,
  });
  // Un défilement déplace le héros sans redimensionner quoi que ce soit : sans
  // ces deux écouteurs, la lentille se décalait de la hauteur défilée. La
  // capture attrape aussi le défilement d’un conteneur interne.
  window.addEventListener('scroll', markGeometryStale, {
    passive: true,
    capture: true,
    signal: controller.signal,
  });
  window.addEventListener('resize', markGeometryStale, {
    passive: true,
    signal: controller.signal,
  });
  pointerCapability.addEventListener('change', handleCapabilityChange, {
    signal: controller.signal,
  });
  window.addEventListener('pagehide', destroy, {
    once: true,
    signal: controller.signal,
  });
  document.addEventListener('astro:before-swap', destroy, {
    once: true,
    signal: controller.signal,
  });
  resizeObserver.observe(hero);

  if (idleWindow.requestIdleCallback) {
    idleHandle = idleWindow.requestIdleCallback(
      () => void prepareRevealImages(),
      { timeout: 1400 },
    );
  } else {
    timeoutHandle = window.setTimeout(() => void prepareRevealImages(), 900);
  }

  return {
    destroy,
    setActiveImage,
  };
};
