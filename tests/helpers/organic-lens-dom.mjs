/**
 * Un DOM minimal, suffisant pour la lentille organique des héros.
 *
 * Le contrôleur ne demande au navigateur que quelques capacités : des
 * écouteurs, un rectangle, une requête d’image et une horloge d’animation. Les
 * reproduire ici laisse tester le suivi du pointeur, le défilement et la
 * fermeture sans naviguer, donc sans dépendance de test supplémentaire.
 */

const DomEventTarget = globalThis.EventTarget;
const DomEvent = globalThis.Event;

class FakeNode extends DomEventTarget {
  constructor() {
    super();
    this.dataset = {};
    this.attributes = new Map();
    this.rect = { top: 0, left: 0, width: 0, height: 0 };
    this.children = new Map();
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  getBoundingClientRect() {
    return { ...this.rect };
  }

  querySelectorAll(selector) {
    return this.children.get(selector) ?? [];
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}

class FakeImage extends FakeNode {
  constructor() {
    super();
    this.loading = 'lazy';
    this.complete = true;
    this.naturalWidth = 1600;
  }

  async decode() {}
}

/**
 * Installe les globales du navigateur, rend le héros et l’outillage de test,
 * puis laisse `restore()` remettre l’environnement Node en état.
 */
export const createLensEnvironment = ({
  heroRect = { top: 0, left: 0, width: 1440, height: 900 },
  lensSize = 280,
  pointerCapability = true,
  layerCount = 2,
} = {}) => {
  const saved = {
    window: Object.getOwnPropertyDescriptor(globalThis, 'window'),
    document: Object.getOwnPropertyDescriptor(globalThis, 'document'),
    performance: Object.getOwnPropertyDescriptor(globalThis, 'performance'),
    resizeObserver: Object.getOwnPropertyDescriptor(
      globalThis,
      'ResizeObserver',
    ),
  };

  let clock = 1000;
  let nextFrameId = 1;
  const frames = new Map();
  const resizeObservers = [];

  const hero = new FakeNode();
  hero.rect = { ...heroRect };

  const layers = Array.from({ length: layerCount }, () => new FakeNode());
  const images = Array.from({ length: layerCount }, () => new FakeImage());
  const clipPath = new FakeNode();
  const outlinePath = new FakeNode();
  const metric = new FakeNode();
  metric.rect = { top: 0, left: 0, width: lensSize, height: 1 };

  hero.children.set('[data-organic-lens-layer]', layers);
  hero.children.set('[data-organic-lens-image]', images);
  hero.children.set('[data-organic-lens-clip-path]', [clipPath]);
  hero.children.set('[data-organic-lens-outline-path]', [outlinePath]);
  hero.children.set('[data-organic-lens-metric]', [metric]);

  const mediaQuery = new DomEventTarget();
  mediaQuery.matches = pointerCapability;

  const fakeWindow = new DomEventTarget();
  Object.assign(fakeWindow, {
    matchMedia: () => mediaQuery,
    requestAnimationFrame: (callback) => {
      const id = nextFrameId;
      nextFrameId += 1;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => {
      frames.delete(id);
    },
    setTimeout: () => 0,
    clearTimeout: () => {},
  });

  const fakeDocument = new DomEventTarget();
  fakeDocument.hidden = false;

  class FakeResizeObserver {
    constructor(callback) {
      this.callback = callback;
      resizeObservers.push(this);
      this.observed = [];
      this.disconnected = false;
    }

    observe(target) {
      this.observed.push(target);
    }

    disconnect() {
      this.disconnected = true;
    }
  }

  const define = (name, value) => {
    Object.defineProperty(globalThis, name, {
      value,
      configurable: true,
      writable: true,
    });
  };

  define('window', fakeWindow);
  define('document', fakeDocument);
  define('performance', { now: () => clock });
  define('ResizeObserver', FakeResizeObserver);

  /** Fait tourner `count` images de `step` millisecondes chacune. */
  const advance = (step = 16, count = 1) => {
    for (let index = 0; index < count; index += 1) {
      clock += step;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(clock));
    }
  };

  const dispatchPointer = (type, { x, y, pointerType = 'mouse' } = {}) => {
    const event = new DomEvent(type);
    Object.assign(event, { clientX: x, clientY: y, pointerType });
    hero.dispatchEvent(event);
  };

  /** Les douze points du contour, relus dans l’attribut `d`. */
  const readShapePoints = () => {
    const path = clipPath.getAttribute('d');
    if (!path) return [];

    return [...path.matchAll(/Q (-?[\d.]+) (-?[\d.]+)/g)].map((match) => ({
      x: Number(match[1]),
      y: Number(match[2]),
    }));
  };

  /** Le centre de masse du contour : là où l’œil place la lentille. */
  const readShapeCenter = () => {
    const points = readShapePoints();
    if (points.length === 0) return null;

    return {
      x: points.reduce((total, point) => total + point.x, 0) / points.length,
      y: points.reduce((total, point) => total + point.y, 0) / points.length,
    };
  };

  return {
    hero,
    layers,
    images,
    clipPath,
    outlinePath,
    metric,
    mediaQuery,
    fakeWindow,
    fakeDocument,
    resizeObservers,
    advance,
    dispatchPointer,
    readShapePoints,
    readShapeCenter,
    now: () => clock,
    /** Décale le héros comme le ferait un défilement de la page. */
    scrollBy: (distance) => {
      hero.rect = { ...hero.rect, top: hero.rect.top - distance };
      fakeWindow.dispatchEvent(new DomEvent('scroll'));
    },
    /** Laisse les promesses du décodage d’image se résoudre. */
    settle: async () => {
      for (let index = 0; index < 6; index += 1) {
        await Promise.resolve();
      }
    },
    restore: () => {
      frames.clear();
      Object.entries(saved).forEach(([key, descriptor]) => {
        const name = key === 'resizeObserver' ? 'ResizeObserver' : key;
        if (descriptor) {
          Object.defineProperty(globalThis, name, descriptor);
        } else {
          delete globalThis[name];
        }
      });
    },
  };
};
