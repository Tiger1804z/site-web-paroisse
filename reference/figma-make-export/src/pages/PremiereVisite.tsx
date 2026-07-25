import { useState } from 'react'
import type { Page } from '../App'

interface Props { navigate: (p: Page) => void }

const steps = [
  { num: '01', titre: 'Choisir une célébration', texte: 'Consultez nos horaires de messes régulières pour choisir la célébration qui vous convient. Le dimanche matin est particulièrement animé.' },
  { num: '02', titre: 'Trouver l\'église', texte: 'Notre église est située au [ADRESSE]. Des panneaux de signalisation vous guideront depuis l\'entrée du stationnement.' },
  { num: '03', titre: 'Stationnement et transport', texte: '[INFORMATION À CONFIRMER] — Le stationnement est disponible à proximité. L\'église est également accessible en transport en commun.' },
  { num: '04', titre: 'Entrée et accessibilité', texte: '[INFORMATION À CONFIRMER] — Notre église est accessible aux personnes à mobilité réduite. Un accès adapté est disponible.' },
  { num: '05', titre: 'À quoi s\'attendre', texte: 'Une messe dure environ une heure. Vous serez accueilli dès votre arrivée. Vous pouvez vous asseoir librement dans la nef.' },
  { num: '06', titre: 'Où demander de l\'aide', texte: 'Des accueillants bénévoles sont présents avant et après chaque célébration pour répondre à vos questions.' },
]

const faq = [
  { q: 'Dois-je être catholique pour entrer dans l\'église ?', a: 'Non, notre église est ouverte à toutes les personnes qui souhaitent prier, se recueillir ou simplement découvrir le lieu.' },
  { q: 'Dois-je me présenter à l\'avance ?', a: 'Aucune inscription n\'est requise pour assister à une messe régulière. Arrivez simplement quelques minutes avant le début de la célébration.' },
  { q: 'Est-ce que je dois participer à la communion ?', a: 'Non. La communion est réservée aux catholiques pratiquants. Il est tout à fait normal de rester à sa place lors de ce moment.' },
  { q: 'Puis-je amener des enfants ?', a: '[INFORMATION À CONFIRMER] — Les enfants sont les bienvenus dans notre communauté.' },
]

export default function PremiereVisite({ navigate }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
        </div>
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Bienvenue</span>
          <h1 className="font-serif text-ivory text-[48px] md:text-[64px] lg:text-[76px] font-semibold leading-tight mb-6">
            Votre première visite
          </h1>
          <p className="text-ivory/60 text-xl max-w-[560px] leading-relaxed">
            Tout ce qu'il faut savoir pour venir célébrer avec nous. Vous êtes les bienvenus, exactement comme vous êtes.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-ivory section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Guide pratique</span>
            <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold">Avant votre visite</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="bg-paper p-7 border border-gold/15">
                <span className="font-serif text-gold/50 text-4xl font-semibold block mb-4 leading-none">{step.num}</span>
                <h3 className="font-serif text-charcoal text-xl font-semibold mb-3">{step.titre}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{step.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-paper section-padding">
        <div className="max-w-[900px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">La messe</span>
            <h2 className="font-serif text-charcoal text-[36px] md:text-[44px] font-semibold">
              À quoi s'attendre pendant une célébration
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { moment: 'Rites d\'ouverture', desc: 'La célébration commence par un chant d\'entrée, un signe de croix et un accueil. C\'est le moment de se préparer intérieurement.' },
              { moment: 'Liturgie de la Parole', desc: 'Des lectures bibliques sont proclamées, suivies d\'une homélie du prêtre qui éclaire le message pour notre vie d\'aujourd\'hui.' },
              { moment: 'Liturgie eucharistique', desc: 'Le cœur de la messe. Le pain et le vin sont consacrés. La communion est distribuée aux fidèles catholiques.' },
              { moment: 'Rite de conclusion', desc: 'Un envoi en mission clôt la célébration. C\'est un beau moment pour saluer ses voisins de banc et rencontrer la communauté.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6 bg-ivory border border-gold/15">
                <div className="w-1 flex-shrink-0 bg-gradient-to-b from-gold/60 to-gold/20 self-stretch" />
                <div>
                  <h4 className="font-serif text-charcoal text-lg font-semibold mb-2">{item.moment}</h4>
                  <p className="text-warm-gray text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="bg-ivory section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Nous trouver</span>
              <h2 className="font-serif text-charcoal text-[36px] md:text-[44px] font-semibold mb-8">Coordonnées</h2>
              <div className="space-y-5">
                {[
                  { label: 'Adresse', value: '[ADRESSE]' },
                  { label: 'Téléphone', value: '[TÉLÉPHONE]' },
                  { label: 'Courriel', value: '[COURRIEL]' },
                  { label: 'Secrétariat', value: '[HEURES DU SECRÉTARIAT]' },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{item.label}</p>
                    <p className="text-charcoal text-base">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-10">
                <button
                  onClick={() => navigate('horaires')}
                  className="bg-burgundy text-ivory text-sm font-bold px-6 py-3 hover:bg-burgundy-dark transition-colors min-h-[48px]"
                >
                  Voir les horaires
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className="border border-burgundy/40 text-burgundy text-sm font-medium px-6 py-3 hover:bg-burgundy/5 transition-colors min-h-[48px]"
                >
                  Nous joindre
                </button>
              </div>
            </div>
            {/* Map placeholder */}
            <div className="h-[360px] bg-paper border border-gold/20 flex items-center justify-center">
              <div className="text-center text-warm-gray/50">
                <svg className="w-10 h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <p className="text-sm">[CARTE INTERACTIVE]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-20 pb-28">
        <div className="max-w-[800px] mx-auto px-5 md:px-10">
          <h2 className="font-serif text-charcoal text-[32px] md:text-[40px] font-semibold mb-10 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-1">
            {faq.map((item, i) => (
              <div key={i} className="border border-gold/20 bg-ivory">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-paper transition-colors"
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
                  <div className="px-6 pb-5 pt-3 text-warm-gray text-sm leading-relaxed border-t border-gold/15">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
