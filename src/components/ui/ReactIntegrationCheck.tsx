import { useState } from 'react';

export default function ReactIntegrationCheck() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="rounded-sm border border-gold/35 bg-surface p-6">
      <h2 className="text-3xl font-semibold text-burgundy">
        Vérification de l’intégration React
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Ce composant interactif est volontairement minimal. Les autres éléments
        de cette page sont rendus statiquement par Astro.
      </p>
      <button
        type="button"
        className="mt-5 bg-burgundy px-5 py-3 font-semibold text-ivory transition-colors hover:bg-burgundy-dark"
        aria-pressed={confirmed}
        onClick={() => setConfirmed((value) => !value)}
      >
        {confirmed ? 'React fonctionne' : 'Tester React'}
      </button>
      <p
        className="mt-3 min-h-6 text-sm font-semibold text-plum"
        aria-live="polite"
      >
        {confirmed
          ? 'L’état du composant a été mis à jour dans le navigateur.'
          : ''}
      </p>
    </div>
  );
}
