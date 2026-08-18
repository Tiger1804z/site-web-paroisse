const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const initializeHistoryTimeline = (timeline: HTMLElement) => {
  if (timeline.dataset.historyInitialized === 'true') return;

  const chapters = Array.from(
    timeline.querySelectorAll<HTMLElement>('[data-history-chapter]'),
  );
  const triggers = chapters.map((chapter) =>
    chapter.querySelector<HTMLElement>('[data-history-trigger]'),
  );
  const moodVeil =
    timeline.querySelector<HTMLElement>('[data-history-mood-veil]') ??
    (timeline.previousElementSibling?.matches('[data-history-mood-veil]')
      ? (timeline.previousElementSibling as HTMLElement)
      : null);
  const epilogue = timeline.querySelector<HTMLElement>(
    '.history-timeline__epilogue',
  );
  const documentRoot = document.documentElement;
  const moodController = new AbortController();
  let moodFrame: number | undefined;

  const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
  const smoothStep = (value: number) => value * value * (3 - 2 * value);

  const resetHistoryMood = () => {
    if (moodFrame !== undefined) {
      window.cancelAnimationFrame(moodFrame);
      moodFrame = undefined;
    }

    moodVeil?.style.removeProperty('--history-mood-intensity');
    timeline.removeAttribute('data-history-mood-active');
    documentRoot.style.removeProperty('--history-header-brightness');
    documentRoot.removeAttribute('data-history-house-lights');
  };

  const updateHistoryMood = () => {
    moodFrame = undefined;
    if (reducedMotion.matches || !moodVeil) {
      resetHistoryMood();
      return;
    }

    const viewportHeight = window.innerHeight;
    const timelineRect = timeline.getBoundingClientRect();
    const enterProgress = clamp(
      (viewportHeight * 0.92 - timelineRect.top) / (viewportHeight * 0.58),
    );
    const releaseBoundary = epilogue
      ? epilogue.getBoundingClientRect().top
      : timelineRect.bottom;
    const releaseProgress = clamp(
      (releaseBoundary - viewportHeight * 0.22) / (viewportHeight * 0.6),
    );
    const intensity = smoothStep(Math.min(enterProgress, releaseProgress));

    moodVeil.style.setProperty(
      '--history-mood-intensity',
      intensity.toFixed(3),
    );
    const moodIsActive = intensity > 0.01;
    timeline.toggleAttribute('data-history-mood-active', moodIsActive);
    documentRoot.style.setProperty(
      '--history-header-brightness',
      (1 - intensity * 0.44).toFixed(3),
    );
    documentRoot.toggleAttribute('data-history-house-lights', moodIsActive);
  };

  const requestMoodUpdate = () => {
    if (moodFrame === undefined) {
      moodFrame = window.requestAnimationFrame(updateHistoryMood);
    }
  };

  const initializeHistoryMood = () => {
    if (!moodVeil) return;

    window.addEventListener('scroll', requestMoodUpdate, {
      passive: true,
      signal: moodController.signal,
    });
    window.addEventListener('resize', requestMoodUpdate, {
      passive: true,
      signal: moodController.signal,
    });
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          resetHistoryMood();
        } else {
          requestMoodUpdate();
        }
      },
      { passive: true, signal: moodController.signal },
    );
    reducedMotion.addEventListener(
      'change',
      (event) => {
        if (event.matches) {
          resetHistoryMood();
        } else {
          requestMoodUpdate();
        }
      },
      { signal: moodController.signal },
    );

    const cleanupMood = () => {
      moodController.abort();
      resetHistoryMood();
    };

    window.addEventListener('pagehide', cleanupMood, {
      once: true,
      signal: moodController.signal,
    });
    document.addEventListener('astro:before-swap', cleanupMood, {
      once: true,
      signal: moodController.signal,
    });
    requestMoodUpdate();
  };

  const showStaticTimeline = () => {
    moodController.abort();
    resetHistoryMood();
    timeline.removeAttribute('data-history-motion');
    timeline.removeAttribute('data-history-ready');
    chapters.forEach((chapter) => {
      chapter.removeAttribute('data-history-active');
      chapter.removeAttribute('data-history-past');
      chapter.removeAttribute('data-history-rail-target');
      chapter.removeAttribute('data-history-activated');
      chapter.removeAttribute('data-history-revealed');
      chapter.removeAttribute('aria-current');
    });
  };

  if (
    chapters.length === 0 ||
    triggers.some((trigger) => trigger === null) ||
    reducedMotion.matches ||
    typeof window.IntersectionObserver !== 'function' ||
    !timeline.hasAttribute('data-history-motion')
  ) {
    showStaticTimeline();
    return;
  }

  const chapterTriggers = triggers as HTMLElement[];
  const railAnchorRatio = 0.78;
  const activeAnchorRatio = 0.7;
  const revealAnchorRatio = 0.62;

  const getAnchorRootMargin = (anchorRatio: number) => {
    const bottom = (1 - anchorRatio) * 100;
    return `0px 0px -${bottom}% 0px`;
  };

  const findPassedChapterIndex = (anchorRatio: number) => {
    const anchorPosition = window.innerHeight * anchorRatio;

    return chapterTriggers.reduce(
      (latestIndex, trigger, index) =>
        trigger.getBoundingClientRect().top <= anchorPosition + 1
          ? index
          : latestIndex,
      -1,
    );
  };

  let railIndex = -1;
  let activeIndex = -1;
  let revealedThroughIndex = -1;

  const updateRail = (nextIndex: number) => {
    if (nextIndex === railIndex) return;
    railIndex = nextIndex;

    chapters.forEach((chapter, index) => {
      chapter.toggleAttribute('data-history-past', index < nextIndex);
      chapter.toggleAttribute('data-history-rail-target', index === nextIndex);
    });
  };

  const activateChapter = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;

    chapters.forEach((chapter, index) => {
      const isActive = index === nextIndex;
      chapter.toggleAttribute('data-history-active', isActive);

      if (index <= nextIndex) {
        chapter.setAttribute('data-history-activated', '');
      }

      if (isActive) {
        chapter.setAttribute('aria-current', 'step');
      } else {
        chapter.removeAttribute('aria-current');
      }
    });
  };

  const revealChaptersThrough = (nextIndex: number) => {
    if (nextIndex <= revealedThroughIndex) return;
    revealedThroughIndex = nextIndex;

    chapters.forEach((chapter, index) => {
      if (index <= nextIndex) {
        chapter.setAttribute('data-history-revealed', '');
      }
    });
  };

  try {
    const railObserver = new IntersectionObserver(
      () => {
        updateRail(findPassedChapterIndex(railAnchorRatio));
      },
      {
        threshold: 0,
        rootMargin: getAnchorRootMargin(railAnchorRatio),
      },
    );

    const activeObserver = new IntersectionObserver(
      () => {
        activateChapter(findPassedChapterIndex(activeAnchorRatio));
      },
      {
        threshold: 0,
        rootMargin: getAnchorRootMargin(activeAnchorRatio),
      },
    );

    const revealObserver = new IntersectionObserver(
      (_, observer) => {
        revealChaptersThrough(findPassedChapterIndex(revealAnchorRatio));
        chapterTriggers.forEach((trigger, index) => {
          if (index <= revealedThroughIndex) {
            observer.unobserve(trigger);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: getAnchorRootMargin(revealAnchorRatio),
      },
    );

    timeline.dataset.historyInitialized = 'true';
    timeline.setAttribute('data-history-ready', '');
    initializeHistoryMood();

    const startObservers = () => {
      if (reducedMotion.matches) {
        showStaticTimeline();
        return;
      }

      chapterTriggers.forEach((trigger) => {
        railObserver.observe(trigger);
        activeObserver.observe(trigger);
        revealObserver.observe(trigger);
      });

      updateRail(findPassedChapterIndex(railAnchorRatio));
      activateChapter(findPassedChapterIndex(activeAnchorRatio));
      revealChaptersThrough(findPassedChapterIndex(revealAnchorRatio));
      chapterTriggers.forEach((trigger, index) => {
        if (index <= revealedThroughIndex) {
          revealObserver.unobserve(trigger);
        }
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(startObservers);
    });

    reducedMotion.addEventListener(
      'change',
      (event) => {
        if (!event.matches) return;
        railObserver.disconnect();
        revealObserver.disconnect();
        activeObserver.disconnect();
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
