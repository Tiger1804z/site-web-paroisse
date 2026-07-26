const documentRoot = document.documentElement;

if (documentRoot.dataset.motionInitialized !== 'true') {
  documentRoot.dataset.motionInitialized = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-motion-reveal], [data-motion-stagger], [data-lsg]',
    ),
  );
  const stainedGlassRoots = Array.from(
    document.querySelectorAll<HTMLElement>('[data-lsg]'),
  );

  const revealTarget = (target: HTMLElement) => {
    if (target.hasAttribute('data-lsg')) {
      target.setAttribute('data-lsg-visible', '');
    } else {
      target.setAttribute('data-motion-visible', '');
    }
  };

  const showEverything = () => {
    documentRoot.classList.remove('motion-enabled');
    revealTargets.forEach(revealTarget);
    stainedGlassRoots.forEach((root) => {
      root.removeAttribute('data-lsg-js');
      root.style.setProperty('--lsg-parallax-x', '0px');
      root.style.setProperty('--lsg-parallax-y', '0px');
    });
  };

  const prepareStainedGlassParallax = () => {
    if (
      reducedMotion.matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    stainedGlassRoots.forEach((root) => {
      if (root.dataset.lsgParallaxInitialized === 'true') return;
      const amplitude = Number.parseFloat(
        getComputedStyle(root).getPropertyValue('--lsg-parallax-max').trim(),
      );
      const safeAmplitude = Number.isFinite(amplitude) ? amplitude : 0;
      if (safeAmplitude <= 0) return;

      root.dataset.lsgParallaxInitialized = 'true';
      let rect: DOMRect | null = null;
      let frame = 0;

      root.addEventListener(
        'pointerenter',
        () => {
          if (reducedMotion.matches) return;
          rect = root.getBoundingClientRect();
        },
        { passive: true },
      );

      root.addEventListener(
        'pointermove',
        (event) => {
          if (reducedMotion.matches || !rect || frame) return;
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

          frame = window.requestAnimationFrame(() => {
            root.style.setProperty(
              '--lsg-parallax-x',
              `${(x * safeAmplitude).toFixed(2)}px`,
            );
            root.style.setProperty(
              '--lsg-parallax-y',
              `${(y * safeAmplitude * 0.6).toFixed(2)}px`,
            );
            frame = 0;
          });
        },
        { passive: true },
      );

      root.addEventListener(
        'pointerleave',
        () => {
          rect = null;
          if (frame) {
            window.cancelAnimationFrame(frame);
            frame = 0;
          }
          root.style.setProperty('--lsg-parallax-x', '0px');
          root.style.setProperty('--lsg-parallax-y', '0px');
        },
        { passive: true },
      );
    });
  };

  if (
    reducedMotion.matches ||
    !('IntersectionObserver' in window) ||
    revealTargets.length === 0
  ) {
    showEverything();
  } else {
    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealTarget(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.14,
          rootMargin: '0px 0px -7% 0px',
        },
      );

      revealTargets.forEach((target) => observer.observe(target));
      documentRoot.classList.add('motion-enabled');
      prepareStainedGlassParallax();

      reducedMotion.addEventListener('change', (event) => {
        if (!event.matches) return;
        observer.disconnect();
        showEverything();
      });
    } catch {
      showEverything();
    }
  }
}
