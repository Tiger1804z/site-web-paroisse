import { useState } from 'react'
import type { Page } from '../App'
import heroImg from '../imports/20210326_164625_-_Copy.jpg'

interface Props { navigate: (p: Page) => void }

const faq = [
  {
    q: 'Est-ce que les horaires changent durant le temps des Fêtes ?',
    a: 'Oui, les horaires peuvent être modifiés lors des fêtes liturgiques importantes. Nous vous invitons à consulter cette page régulièrement ou à communiquer avec le secrétariat pour confirmer.',
  },
  {
    q: 'Où puis-je trouver le feuillet paroissial ?',
    a: 'Le feuillet de la semaine est disponible en ligne dans la section « Feuillets paroissiaux » et en format imprimé lors des célébrations.',
  },
  {
    q: 'Comment savoir si une messe est annulée ou déplacée ?',
    a: 'Les changements d\'horaire sont annoncés sur cette page, dans le feuillet paroissial et sur notre page Facebook.',
  },
  {
    q: 'Est-ce que je dois m\'inscrire pour assister à une messe ?',
    a: '[INFORMATION À CONFIRMER] — En temps normal, aucune inscription n\'est requise pour assister aux messes régulières.',
  },
]

export default function Horaires({ navigate }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <img
          src={heroImg}
          alt="Intérieur de l'église avec tapis rouge et autel"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-burgundy/70" />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 pb-14 pt-24">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold mb-3 block">Célébrations</span>
          <h1 className="font-serif text-ivory text-[44px] md:text-[60px] font-semibold leading-tight">
            Horaires et célébrations
          </h1>
          <p className="text-ivory/70 text-lg mt-3 max-w-[540px]">
            Retrouvez ici les horaires réguliers ainsi que les changements liés aux célébrations spéciales.
          </p>
        </div>
      </section>

      {/* Alert module */}
      <div className="bg-paper border-b border-gold/30 py-5">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <div>
                <p className="font-semibold text-charcoal text-sm">Avant de vous déplacer</p>
                <p className="text-warm-gray text-sm leading-relaxed mt-1">
                  Les horaires peuvent être modifiés lors de certaines célébrations. Consultez cette page ou communiquez avec le secrétariat pour confirmer.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('contact')}
              className="sm:ml-auto flex-shrink-0 border border-burgundy/40 text-burgundy text-sm font-semibold px-4 py-2 hover:bg-burgundy hover:text-ivory transition-colors min-h-[44px]"
            >
              Contacter le secrétariat
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Left */}
          <div>
            {/* Horaires réguliers */}
            <section className="mb-14">
              <h2 className="font-serif text-charcoal text-[32px] md:text-[40px] font-semibold mb-8">
                Horaires réguliers des messes
              </h2>

              <div className="border border-gold/20">
                {[
                  { day: 'Samedi', heure: '[HEURE]', note: 'Vigile du dimanche', type: 'regular' },
                  { day: 'Dimanche', heure: '[HEURE]', note: 'Messe dominicale', type: 'regular' },
                  { day: 'Dimanche', heure: '[HEURE]', note: 'Messe dominicale', type: 'regular' },
                  { day: 'Lundi au vendredi', heure: '[HEURE]', note: '[INFORMATION À CONFIRMER]', type: 'weekday' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between px-6 py-5 ${i < 3 ? 'border-b border-gold/15' : ''} ${item.type === 'weekday' ? 'bg-paper' : ''}`}>
                    <div>
                      <p className="font-serif text-charcoal text-xl">{item.day}</p>
                      <p className="text-warm-gray text-xs tracking-wide mt-0.5">{item.note}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-burgundy text-2xl font-medium">{item.heure}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-warm-gray text-xs mt-3 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Dernière mise à jour : [DATE ET HEURE]
              </p>
            </section>

            {/* Célébrations spéciales */}
            <section className="mb-14">
              <h2 className="font-serif text-charcoal text-[28px] md:text-[36px] font-semibold mb-6">
                Célébrations spéciales
              </h2>
              <div className="space-y-3">
                {[
                  { date: '[DATE]', titre: '[INFORMATION À CONFIRMER]', heure: '[HEURE]', note: 'Horaire modifié' },
                  { date: '[DATE]', titre: '[INFORMATION À CONFIRMER]', heure: '[HEURE]', note: '' },
                ].map((item, i) => (
                  <div key={i} className="bg-paper px-6 py-5 border-l-2 border-gold">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <p className="text-[10px] tracking-[0.15em] uppercase text-gold mb-1">{item.date}</p>
                        <p className="font-serif text-charcoal text-lg">{item.titre}</p>
                        {item.note && (
                          <span className="inline-flex items-center gap-1 text-[10px] tracking-wide uppercase text-burgundy bg-burgundy/10 px-2 py-0.5 mt-2">
                            {item.note}
                          </span>
                        )}
                      </div>
                      <span className="font-serif text-burgundy text-xl self-center">{item.heure}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 text-sm text-warm-gray hover:text-burgundy transition-colors">
                Afficher toutes les dates →
              </button>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="font-serif text-charcoal text-[28px] md:text-[36px] font-semibold mb-6">
                Questions fréquentes
              </h2>
              <div className="space-y-1">
                {faq.map((item, i) => (
                  <div key={i} className="border border-gold/20">
                    <button
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-paper transition-colors group"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-serif text-charcoal text-lg pr-4 leading-snug">{item.q}</span>
                      <svg
                        className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5 text-warm-gray text-sm leading-relaxed border-t border-gold/15 pt-4">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Feuillet CTA */}
            <div className="bg-burgundy p-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold/80 mb-3">Cette semaine</p>
              <h3 className="font-serif text-ivory text-2xl mb-2">Feuillet paroissial</h3>
              <p className="text-ivory/60 text-sm mb-5">Semaine du [DATE]</p>
              <button
                onClick={() => navigate('feuillets')}
                className="w-full bg-ivory text-burgundy text-sm font-bold py-3 hover:bg-paper transition-colors"
              >
                Télécharger le PDF
              </button>
            </div>

            {/* Secrétariat */}
            <div className="border border-gold/20 p-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-4">Secrétariat</p>
              <div className="space-y-2 mb-5">
                <p className="text-charcoal text-sm">[HEURES DU SECRÉTARIAT]</p>
                <p className="text-warm-gray text-xs">Des questions sur les horaires ? N'hésitez pas à nous contacter.</p>
              </div>
              <a href="tel:[TÉLÉPHONE]" className="flex items-center gap-2 text-burgundy font-semibold text-sm hover:underline">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                [TÉLÉPHONE]
              </a>
            </div>

            {/* Prochains événements */}
            <div className="bg-paper p-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-4">Prochaines dates</p>
              <div className="space-y-4">
                {['[DATE]', '[DATE]', '[DATE]'].map((date, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-burgundy/10 flex-shrink-0 flex flex-col items-center justify-center">
                      <span className="text-burgundy text-xs font-bold leading-none">—</span>
                    </div>
                    <div>
                      <p className="text-charcoal text-sm font-medium">[INFORMATION À CONFIRMER]</p>
                      <p className="text-warm-gray text-xs">{date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('evenements')}
                className="mt-5 text-xs text-gold hover:text-burgundy transition-colors tracking-wide"
              >
                Voir tous les événements →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
