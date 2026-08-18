export interface HeroSlideshowOptions {
  /** Durée d'affichage d'une image, en millisecondes. */
  readonly intervalMs?: number;
  /** Appelé à chaque changement, pour synchroniser un effet lié (la loupe). */
  readonly onSelect?: (index: number) => void;
}

/**
 * Rotation d'images de hero, partagée par l'accueil et la friperie.
 *
 * Le HTML rendu par le serveur affiche déjà la première image : ce script ne
 * fait qu'ajouter l'alternance. Sans JavaScript, le hero reste une image fixe
 * parfaitement valable.
 *
 * La rotation s'arrête si le visiteur a demandé moins d'animations, et reprend
 * s'il change d'avis en cours de visite.
 */
export function initializeHeroSlideshow(
  root: HTMLElement,
  options: HeroSlideshowOptions = {},
): void {
  const slides = Array.from(
    root.querySelectorAll<HTMLElement>('[data-hero-slide]'),
  );
  if (slides.length === 0) return;

  const indicators = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-hero-indicator]'),
  );
  const intervalMs = options.intervalMs ?? 7600;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let activeIndex = 0;
  let rotationTimer: number | undefined;

  const stopRotation = () => {
    if (rotationTimer !== undefined) {
      window.clearInterval(rotationTimer);
      rotationTimer = undefined;
    }
  };

  const selectSlide = (index: number) => {
    activeIndex = index;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.dataset.active = String(isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    indicators.forEach((indicator, indicatorIndex) => {
      indicator.setAttribute('aria-pressed', String(indicatorIndex === index));
    });

    options.onSelect?.(index);
  };

  const startRotation = () => {
    stopRotation();
    if (reducedMotion.matches || slides.length < 2) return;

    rotationTimer = window.setInterval(() => {
      selectSlide((activeIndex + 1) % slides.length);
    }, intervalMs);
  };

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      selectSlide(index);
      startRotation();
    });
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      stopRotation();
      selectSlide(0);
    } else {
      startRotation();
    }
  });

  window.addEventListener('pagehide', stopRotation, { once: true });
  startRotation();
}
