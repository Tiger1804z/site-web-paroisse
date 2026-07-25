import type { Page } from '../App'
import floralsImg from '../imports/20210331_183200_-_Copy.jpg'
import pinkImg from '../imports/20210312_181118_-_Copy.jpg'

interface Props { navigate: (p: Page) => void }

export default function Friperie({ navigate }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="bg-paper pt-28 pb-20 border-b border-gold/20">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Services paroissiaux</span>
          <h1 className="font-serif text-charcoal text-[44px] md:text-[60px] font-semibold leading-tight mb-5">
            La friperie
          </h1>
          <p className="text-warm-gray text-xl max-w-[560px] leading-relaxed">
            Donnez une seconde vie aux objets et découvrez nos ventes spéciales tout au long de l'année. Un espace accessible et chaleureux au service de la communauté.
          </p>
        </div>
      </section>

      {/* Main photo placeholder */}
      <section className="bg-ivory py-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Photo placeholder */}
            <div className="aspect-[4/3] bg-paper border border-gold/20 flex flex-col items-center justify-center text-warm-gray/50">
              <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm tracking-wide">[PHOTO DE LA FRIPERIE]</span>
            </div>

            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Notre friperie</span>
              <h2 className="font-serif text-charcoal text-[32px] md:text-[44px] font-semibold leading-tight mb-6">
                Présentation
              </h2>
              <p className="text-warm-gray text-lg leading-relaxed mb-6">
                Découvrez notre friperie paroissiale, un espace accessible où les articles et les prix peuvent varier au cours de l'année.
              </p>

              {/* Notice */}
              <div className="bg-gold/10 border border-gold/30 px-5 py-4 mb-8">
                <p className="text-charcoal text-sm leading-relaxed">
                  <span className="font-semibold">À noter :</span> Les prix et les articles disponibles peuvent changer. Des ventes spéciales sont organisées à l'occasion.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Horaires', value: '[HEURES DE LA FRIPERIE — INFORMATION À CONFIRMER]' },
                  { label: 'Emplacement', value: '[ADRESSE DE LA FRIPERIE — INFORMATION À CONFIRMER]' },
                ].map((item, i) => (
                  <div key={i} className="bg-paper p-4">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gold mb-1">{item.label}</p>
                    <p className="text-charcoal text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Types d'articles */}
          <section className="mb-16">
            <h2 className="font-serif text-charcoal text-[28px] md:text-[36px] font-semibold mb-8">Types d'articles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Vêtements', icon: '👔' },
                { label: 'Accessoires', icon: '👜' },
                { label: 'Livres', icon: '📚' },
                { label: 'Objets décoratifs', icon: '🏺' },
                { label: 'Vaisselle', icon: '🫙' },
                { label: 'Jouets', icon: '🧸' },
                { label: 'Articles ménagers', icon: '🏠' },
                { label: 'Autres', icon: '✨' },
              ].map((item, i) => (
                <div key={i} className="bg-paper p-5 text-center border border-gold/10">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <p className="text-charcoal text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Galerie secondaire */}
          <section className="mb-16">
            <h2 className="font-serif text-charcoal text-[28px] md:text-[36px] font-semibold mb-6">Galerie</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="aspect-square bg-paper border border-gold/20 flex flex-col items-center justify-center text-warm-gray/50 text-xs tracking-wide">
                [PHOTO DE LA FRIPERIE]
              </div>
              <div className="aspect-square bg-paper border border-gold/20 flex flex-col items-center justify-center text-warm-gray/50 text-xs tracking-wide">
                [PHOTO DE LA FRIPERIE]
              </div>
              <div className="aspect-square overflow-hidden">
                <img src={floralsImg} alt="Décorations" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square overflow-hidden">
                <img src={pinkImg} alt="Intérieur" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-paper border border-gold/20 flex flex-col items-center justify-center text-warm-gray/50 text-xs tracking-wide">
                [PHOTO DE LA FRIPERIE]
              </div>
              <div className="aspect-square bg-paper border border-gold/20 flex flex-col items-center justify-center text-warm-gray/50 text-xs tracking-wide">
                [PHOTO DE LA FRIPERIE]
              </div>
            </div>
          </section>

          {/* Dons */}
          <section className="bg-charcoal text-ivory p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-serif text-ivory text-[28px] md:text-[36px] font-semibold mb-4">Faire un don d'articles</h2>
                <p className="text-ivory/60 text-base leading-relaxed">
                  Vous avez des articles en bon état à donner ? La friperie paroissiale accepte les dons d'objets, de vêtements et d'articles ménagers.
                </p>
                <div className="mt-6 space-y-2 text-sm text-ivory/60">
                  <p>[CONDITIONS DE DONS — INFORMATION À CONFIRMER]</p>
                  <p>[HEURES DE RÉCEPTION — INFORMATION À CONFIRMER]</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate('contact')}
                  className="bg-gold text-charcoal text-sm font-bold px-8 py-4 hover:bg-gold/90 transition-colors min-h-[48px]"
                >
                  Nous contacter
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className="border border-ivory/30 text-ivory text-sm font-medium px-8 py-4 hover:bg-ivory/10 transition-colors min-h-[48px]"
                >
                  Obtenir de l'information
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
