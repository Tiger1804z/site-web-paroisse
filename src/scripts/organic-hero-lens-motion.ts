/**
 * Mathématique de la lentille organique des héros.
 *
 * Le module ne touche ni au DOM ni au temps : il reçoit un delta de temps et
 * rend des nombres. `organic-hero-lens.ts` s’occupe des écouteurs, des mesures
 * et du tracé; ce fichier s’occupe du mouvement, donc des tests.
 */

export type Point = {
  x: number;
  y: number;
};

export const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

/** Interpolation d’Hermite classique : douce aux deux extrémités. */
const smoothStep = (value: number) => value * value * (3 - 2 * value);

/**
 * Réglages du suivi du pointeur.
 *
 * Les constantes sont des durées, pas des fractions par image : un écran
 * 120 Hz et un écran 60 Hz suivent alors le pointeur à la même vitesse
 * apparente, et une image sautée ne creuse plus le retard.
 */
export const POINTER_FOLLOW = {
  /** Petit écart : la matière reste souple. */
  restTimeConstant: 62,
  /** Grand écart : la lentille rattrape franchement. */
  rushTimeConstant: 20,
  /** Écart, en pixels, à partir duquel le rattrapage est au plus vif. */
  rushDistance: 180,
  /** Écart maximal toléré, en fraction du rayon courant. */
  maximumGapRatio: 0.32,
  /** Plancher de cet écart, tant que la lentille est encore petite. */
  minimumGap: 18,
} as const;

/**
 * Fraction de l’écart absorbée pendant `deltaTime`.
 *
 * `1 - exp(-dt / tau)` est la forme continue du lissage exponentiel : elle ne
 * dépend que du temps écoulé. La constante de temps se resserre avec l’écart,
 * d’où le suivi adaptatif : souple de près, vif de loin.
 */
export const pointerFollowFactor = (gap: number, deltaTime: number) => {
  if (deltaTime <= 0) return 0;

  const urgency = smoothStep(
    clamp(Math.abs(gap) / POINTER_FOLLOW.rushDistance, 0, 1),
  );
  const timeConstant =
    POINTER_FOLLOW.restTimeConstant +
    (POINTER_FOLLOW.rushTimeConstant - POINTER_FOLLOW.restTimeConstant) *
      urgency;

  return clamp(1 - Math.exp(-deltaTime / timeConstant), 0, 1);
};

/** Écart maximal admis entre le pointeur et le centre de la lentille. */
export const maximumPointerGap = (radius: number) =>
  Math.max(POINTER_FOLLOW.minimumGap, radius * POINTER_FOLLOW.maximumGapRatio);

/**
 * Garde-fou : le pointeur ne peut jamais sortir du cœur de la lentille, même
 * après un déplacement instantané (curseur téléporté, retour d’onglet, image
 * très longue). L’écart est ramené sur le segment et la direction d’arrivée est
 * conservée : la lentille vient du même côté, sans saut de trajectoire.
 */
export const limitPointerGap = (
  current: Point,
  target: Point,
  maximumGap: number,
): Point => {
  const deltaX = target.x - current.x;
  const deltaY = target.y - current.y;
  const gap = Math.hypot(deltaX, deltaY);

  if (gap <= maximumGap || gap === 0) return current;

  const ratio = maximumGap / gap;
  return {
    x: target.x - deltaX * ratio,
    y: target.y - deltaY * ratio,
  };
};

/** Un pas de suivi : lissage adaptatif, puis garde-fou. */
export const followPointer = (
  current: Point,
  target: Point,
  deltaTime: number,
  radius: number,
): Point => {
  const gap = Math.hypot(target.x - current.x, target.y - current.y);
  const factor = pointerFollowFactor(gap, deltaTime);
  const eased = {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
  };

  return limitPointerGap(eased, target, maximumPointerGap(radius));
};

/** Décroissance exponentielle continue, indépendante du rafraîchissement. */
export const decay = (value: number, deltaTime: number, timeConstant: number) =>
  value * Math.exp(-Math.max(deltaTime, 0) / timeConstant);

/**
 * Rapprochement d’un angle par le plus court chemin : un demi-tour du pointeur
 * fait pivoter l’étirement au lieu de le retourner d’un coup.
 */
export const approachAngle = (
  current: number,
  target: number,
  factor: number,
) => {
  const raw = (target - current) % (Math.PI * 2);
  const shortest =
    raw > Math.PI
      ? raw - Math.PI * 2
      : raw < -Math.PI
        ? raw + Math.PI * 2
        : raw;

  return current + shortest * clamp(factor, 0, 1);
};

/** Réglages de la forme. */
export const LENS_SHAPE = {
  pointCount: 12,
  /** Allongement devant le pointeur, à pleine énergie. */
  forwardStretch: 0.16,
  /** Traîne derrière le pointeur, à pleine énergie. */
  trailStretch: 0.3,
  /** Pincement latéral, à pleine énergie. */
  lateralSqueeze: 0.09,
  /** Respiration au repos, en fraction du rayon. */
  breathAmplitude: 0.024,
  /** Durée d’un cycle de respiration, en millisecondes. */
  breathPeriod: 5400,
  primaryWave: 0.085,
  secondaryWave: 0.042,
  /** Gain des harmoniques avec la vitesse. */
  waveEnergyGain: 0.42,
} as const;

export type LensShapeInput = {
  centerX: number;
  centerY: number;
  radius: number;
  energy: number;
  direction: number;
  shapePhase: number;
  breathPhase: number;
};

/**
 * Les douze points du contour.
 *
 * La traîne est plus longue que le nez : c’est ce qui donne la matière vivante
 * plutôt que le disque. Le centroïde longitudinal des points est ensuite ramené
 * exactement sur le centre reçu, sinon l’asymétrie déplacerait la masse derrière
 * le pointeur — l’effet « cercle qui court après la souris ».
 */
export const buildLensPoints = ({
  centerX,
  centerY,
  radius,
  energy,
  direction,
  shapePhase,
  breathPhase,
}: LensShapeInput): Point[] => {
  const level = clamp(energy, 0, 1);
  const forwardScale = 1 + level * LENS_SHAPE.forwardStretch;
  const trailScale = 1 + level * LENS_SHAPE.trailStretch;
  const lateralScale = 1 - level * LENS_SHAPE.lateralSqueeze;
  const breath = 1 + Math.sin(breathPhase) * LENS_SHAPE.breathAmplitude;
  const waveGain = 1 + level * LENS_SHAPE.waveEnergyGain;
  const cosine = Math.cos(direction);
  const sine = Math.sin(direction);

  const longitudinals: number[] = [];
  const laterals: number[] = [];
  let longitudinalSum = 0;

  for (let index = 0; index < LENS_SHAPE.pointCount; index += 1) {
    const angle = (index / LENS_SHAPE.pointCount) * Math.PI * 2;
    const organic =
      1 +
      Math.sin(angle * 3 + shapePhase) * LENS_SHAPE.primaryWave * waveGain +
      Math.sin(angle * 5 - shapePhase * 0.72) *
        LENS_SHAPE.secondaryWave *
        waveGain;
    const relativeAngle = angle - direction;
    const forward = Math.cos(relativeAngle);
    const stretch = forward >= 0 ? forwardScale : trailScale;
    const longitudinal = forward * radius * breath * organic * stretch;
    const lateral =
      Math.sin(relativeAngle) * radius * breath * organic * lateralScale;

    longitudinals.push(longitudinal);
    laterals.push(lateral);
    longitudinalSum += longitudinal;
  }

  const recenter = longitudinalSum / LENS_SHAPE.pointCount;

  return longitudinals.map((longitudinal, index) => {
    const centered = longitudinal - recenter;
    const lateral = laterals[index] ?? 0;

    return {
      x: centerX + centered * cosine - lateral * sine,
      y: centerY + centered * sine + lateral * cosine,
    };
  });
};

/** Contour fermé, en courbes quadratiques passant entre les points. */
export const buildSmoothPath = (points: Point[]) => {
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
