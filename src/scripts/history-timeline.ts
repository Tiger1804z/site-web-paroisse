const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const initializeHistoryTimeline = (timeline: HTMLElement) => {
  if (timeline.dataset.historyInitialized === 'true') return;
  timeline.dataset.historyInitialized = 'true';

  const chapters = Array.from(
    timeline.querySelectorAll<HTMLElement>('[data-history-chapter]'),
  );

  const showStaticTimeline = () => {
    timeline.removeAttribute('data-history-ready');
    chapters.forEach((chapter) => {
      chapter.removeAttribute('data-history-active');
      chapter.removeAttribute('data-history-past');
      chapter.removeAttribute('aria-current');
    });
  };

  if (
    chapters.length === 0 ||
    reducedMotion.matches ||
    !('IntersectionObserver' in window)
  ) {
    showStaticTimeline();
    return;
  }

  let activeIndex = -1;

  const activateChapter = (nextIndex: number) => {
    if (nextIndex === activeIndex || nextIndex < 0) return;
    activeIndex = nextIndex;

    chapters.forEach((chapter, index) => {
      const isActive = index === nextIndex;
      chapter.toggleAttribute('data-history-past', index < nextIndex);
      chapter.toggleAttribute('data-history-active', isActive);
      if (isActive) {
        chapter.setAttribute('aria-current', 'step');
      } else {
        chapter.removeAttribute('aria-current');
      }
    });
  };

  const findClosestChapter = () => {
    const viewportCenter = window.innerHeight / 2;
    return chapters.reduce(
      (closest, chapter, index) => {
        const rect = chapter.getBoundingClientRect();
        const chapterCenter = rect.top + rect.height / 2;
        const distance = Math.abs(chapterCenter - viewportCenter);

        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;
  };

  try {
    activateChapter(findClosestChapter());
    timeline.setAttribute('data-history-ready', '');

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        activateChapter(findClosestChapter());
      },
      {
        threshold: 0,
        rootMargin: '-42% 0px -42% 0px',
      },
    );

    chapters.forEach((chapter) => observer.observe(chapter));

    reducedMotion.addEventListener(
      'change',
      (event) => {
        if (!event.matches) return;
        observer.disconnect();
        showStaticTimeline();
      },
      { once: true },
    );
  } catch {
    showStaticTimeline();
  }
};

document
  .querySelectorAll<HTMLElement>('[data-history-timeline]')
  .forEach(initializeHistoryTimeline);
