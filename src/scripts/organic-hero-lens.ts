type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type Point = {
  x: number;
  y: number;
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

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const buildSmoothPath = (points: Point[]) => {
  const pointCount = points.length;
  const firstPoint = points[0];
  const lastPoint = points[pointCount - 1];

  if (!firstPoint || !lastPoint) return '';

  const startX = (lastPoint.x + firstPoint.x) / 2;
  const startY = (lastPoint.y + firstPoint.y) / 2;
  const commands = [`M ${startX.toFixed(2)} ${startY.toFixed(2)}`];

  points.forEach((point, index) => {
    const nextPoint = points[(index + 1) % pointCount];
    if (!nextPoint) return;

    const middleX = (point.x + nextPoint.x) / 2;
    const middleY = (point.y + nextPoint.y) / 2;
    commands.push(
      `Q ${point.x.toFixed(2)} ${point.y.toFixed(2)} ${middleX.toFixed(2)} ${middleY.toFixed(2)}`,
    );
  });

  commands.push('Z');
  return commands.join(' ');
};

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
  let previousPointerX = targetX;
  let previousPointerY = targetY;
  let previousPointerTime = performance.now();
  let lastPointerMove = -Infinity;
  let currentRadius = 0;
  let targetRadius = 0;
  let motionEnergy = 0;
  let motionDirection = 0;
  let shapePhase = 0;
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

  const resizeObserver = new ResizeObserver(() => {
    heroRect = hero.getBoundingClientRect();
    targetX = clamp(targetX, 0, heroRect.width);
    targetY = clamp(targetY, 0, heroRect.height);
    currentX = clamp(currentX, 0, heroRect.width);
    currentY = clamp(currentY, 0, heroRect.height);
  });

  const getLensMaximumRadius = () =>
    lensMetric.getBoundingClientRect().width / 2;

  const writeLensShape = () => {
    if (currentRadius < 0.35) {
      lensClipPath.removeAttribute('d');
      lensOutlinePath.removeAttribute('d');
      return;
    }

    const pointCount = 12;
    const points: Point[] = [];
    const energy = clamp(motionEnergy, 0, 1);
    const longitudinalScale = 1 + energy * 0.26;
    const lateralScale = 1 - energy * 0.08;

    for (let index = 0; index < pointCount; index += 1) {
      const angle = (index / pointCount) * Math.PI * 2;
      const relativeAngle = angle - motionDirection;
      const organicRadius =
        1 +
        Math.sin(angle * 3 + shapePhase) * 0.1 +
        Math.sin(angle * 5 - shapePhase * 0.72) * 0.05;
      const longitudinal =
        Math.cos(relativeAngle) *
        currentRadius *
        organicRadius *
        longitudinalScale;
      const lateral =
        Math.sin(relativeAngle) * currentRadius * organicRadius * lateralScale;
      const cosine = Math.cos(motionDirection);
      const sine = Math.sin(motionDirection);

      points.push({
        x: currentX + longitudinal * cosine - lateral * sine,
        y: currentY + longitudinal * sine + lateral * cosine,
      });
    }

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

    const movementIsFresh = pointerInside && time - lastPointerMove < 105;
    const maximumRadius = getLensMaximumRadius();
    targetRadius =
      movementIsFresh && imagesReady
        ? maximumRadius * (0.52 + motionEnergy * 0.48)
        : 0;

    currentX += (targetX - currentX) * 0.13;
    currentY += (targetY - currentY) * 0.13;
    currentRadius +=
      (targetRadius - currentRadius) *
      (targetRadius > currentRadius ? 0.17 : 0.105);
    motionEnergy *= 0.94;

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

    if (imagesReady && performance.now() - lastPointerMove < 105) {
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
    heroRect = hero.getBoundingClientRect();
    targetX = clamp(event.clientX - heroRect.left, 0, heroRect.width);
    targetY = clamp(event.clientY - heroRect.top, 0, heroRect.height);
    currentX = targetX;
    currentY = targetY;
    previousPointerX = targetX;
    previousPointerY = targetY;
    previousPointerTime = performance.now();
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
    const nextX = clamp(event.clientX - heroRect.left, 0, heroRect.width);
    const nextY = clamp(event.clientY - heroRect.top, 0, heroRect.height);
    const deltaX = nextX - previousPointerX;
    const deltaY = nextY - previousPointerY;
    const distance = Math.hypot(deltaX, deltaY);
    const elapsed = Math.max(now - previousPointerTime, 8);

    targetX = nextX;
    targetY = nextY;
    previousPointerX = nextX;
    previousPointerY = nextY;
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
      motionDirection = Math.atan2(deltaY, deltaX);
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
