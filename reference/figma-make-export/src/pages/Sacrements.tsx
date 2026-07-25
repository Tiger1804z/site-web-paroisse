import { useState } from 'react'
import type { Page } from '../App'
import aerialImg from '../imports/20210319_165026_-_Copy.jpg'
import floralsImg from '../imports/20210331_183200_-_Copy.jpg'

interface Props { navigate: (p: Page) => void }

const processSteps = [
  { num: 1, titre: 'Communiquer avec le secrétariat', texte: 'Contactez-nous par téléphone ou par courriel pour exprimer votre demande.' },
  { num: 2, titre: 'Recevoir les informations', texte: 'Le secrétariat vous fournira toutes les informations nécessaires et les documents requis.' },
  { num: 3, titre: 'Préparer les documents', texte: 'Rassemblez les documents officiels demandés selon le sacrement souhaité.' },
  { num: 4, titre: 'Remettre les documents en personne', texte: 'Les documents sont remis directement au secrétariat lors d\'une rencontre.' },
  { num: 5, titre: 'Confirmer la célébration', texte: 'Une fois tout en ordre, la date de la célébration est confirmée avec vous.' },
]

const faq = [
  { q: 'Combien de temps à l\'avance doit-on planifier un baptême ?', a: '[INFORMATION À CONFIRMER] — Il est recommandé de contacter le secrétariat plusieurs semaines à l\'avance.' },
  { q: 'Quelles sont les conditions pour se marier à l\'église ?', a: '[INFORMATION À CONFIRMER] — Communiquez avec le secrétariat pour obtenir toutes les informations relatives à votre situation particulière.' },
  { q: 'Peut-on célébrer un mariage ou un baptême en dehors des dates habituelles ?', a: '[INFORMATION À CONFIRMER] — La disponibilité dépend du calendrier de la paroisse. Contactez-nous pour en discuter.' },
]

export default function Sacrements({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<'bapteme' | 'mariage' | 'autres'>('bapteme')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[340px] overflow-hidden">
        <img
          src={aerialImg}
          alt="Vue d'ensemble de l'église lors d'une célébration"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-plum/75" />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 pb-14 pt-28">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold/80 block mb-3">Foi et vie</span>
          <h1 className="font-serif text-ivory text-[44px] md:text-[60px] font-semibold leading-tight">
            Les sacrements
          </h1>
          <p className="text-ivory/70 text-lg mt-3 max-w-[560px]">
            Pour une demande de baptême, de mariage ou pour toute autre démarche, communiquez avec le secrétariat de la paroisse.
          </p>
        </div>
      </section>

      {/* Intro */}
      <div className="bg-paper border-b border-gold/20 py-5">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="text-charcoal text-sm max-w-[600px]">
              Aucune réservation en ligne n'est disponible pour les sacrements. Toute demande doit passer par le secrétariat paroissial.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="flex-shrink-0 bg-burgundy text-ivory text-sm font-bold px-6 py-3 hover:bg-burgundy-dark transition-colors min-h-[48px]"
            >
              Communiquer avec le secrétariat
            </button>
          </div>
        </div>
      </div>

      {/* Sacrements tabs */}
      <section className="bg-ivory section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          {/* Tab nav */}
          <div className="flex gap-1 mb-12 border-b border-gold/20 overflow-x-auto">
            {(['bapteme', 'mariage', 'autres'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-burgundy text-burgundy'
                    : 'border-transparent text-warm-gray hover:text-charcoal'
                }`}
              >
                {tab === 'bapteme' ? 'Baptême' : tab === 'mariage' ? 'Mariage' : 'Autres demandes'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'bapteme' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Sacrement</span>
                <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold leading-tight mb-6">
                  Le baptême
                </h2>
                <p className="text-warm-gray text-lg leading-relaxed mb-8">
                  Le baptême est le premier des sacrements. Il accueille un enfant ou un adulte dans la communauté chrétienne. Pour toute demande, contactez le secrétariat paroissial.
                </p>
                <h3 className="font-serif text-charcoal text-xl font-semibold mb-4">Documents officiels requis</h3>
                <ul className="space-y-2 mb-8">
                  {[
                    'Acte de naissance de l\'enfant (copie)',
                    'Preuves de mariage des parents [INFORMATION À CONFIRMER]',
                    '[INFORMATION À CONFIRMER]',
                  ].map((doc, i) => (
                    <li key={i} className="flex items-start gap-3 text-warm-gray text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
                <div className="bg-paper border border-gold/20 p-5">
                  <p className="text-charcoal text-sm font-semibold mb-2">Important</p>
                  <p className="text-warm-gray text-sm leading-relaxed">
                    Les documents doivent être remis en personne au secrétariat. Aucune inscription automatique en ligne n'est disponible.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden">
                <img
                  src={floralsImg}
                  alt="Autel décoré pour une célébration"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            </div>
          )}

          {activeTab === 'mariage' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Sacrement</span>
                <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold leading-tight mb-6">
                  Le mariage
                </h2>
                <p className="text-warm-gray text-lg leading-relaxed mb-8">
                  Le mariage chrétien est un sacrement d'alliance et d'amour. Pour toute demande de célébration de mariage, la démarche commence par un contact avec le secrétariat.
                </p>
                <h3 className="font-serif text-charcoal text-xl font-semibold mb-4">Documents officiels requis</h3>
                <ul className="space-y-2 mb-8">
                  {[
                    'Acte de baptême récent (moins de 6 mois)',
                    'Certificat de confirmation [INFORMATION À CONFIRMER]',
                    'Pièce d\'identité des deux époux',
                    '[INFORMATION À CONFIRMER]',
                  ].map((doc, i) => (
                    <li key={i} className="flex items-start gap-3 text-warm-gray text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
                <div className="bg-paper border border-gold/20 p-5 mb-5">
                  <p className="text-charcoal text-sm font-semibold mb-2">Disponibilité à confirmer</p>
                  <p className="text-warm-gray text-sm leading-relaxed">
                    La date doit être confirmée avec le secrétariat. Aucune réservation automatique n'est possible.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden">
                <img
                  src={aerialImg}
                  alt="Vue de l'église pour une célébration"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            </div>
          )}

          {activeTab === 'autres' && (
            <div className="max-w-[640px]">
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Autres sacrements</span>
              <h2 className="font-serif text-charcoal text-[36px] md:text-[44px] font-semibold leading-tight mb-6">
                Autres demandes
              </h2>
              <p className="text-warm-gray text-lg leading-relaxed mb-8">
                Pour toute autre demande sacramentelle (première communion, confirmation, onction des malades, funérailles, etc.), communiquez avec notre secrétariat qui vous guidera dans les démarches à suivre.
              </p>
              <button
                onClick={() => navigate('contact')}
                className="bg-burgundy text-ivory text-sm font-bold px-8 py-4 hover:bg-burgundy-dark transition-colors min-h-[48px]"
              >
                Communiquer avec le secrétariat
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Processus visuel */}
      <section className="bg-paper section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Démarche</span>
            <h2 className="font-serif text-charcoal text-[32px] md:text-[44px] font-semibold">
              Le processus étape par étape
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line — desktop */}
            <div className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-px bg-gold/20" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {processSteps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-burgundy flex items-center justify-center mb-5 relative z-10 flex-shrink-0">
                    <span className="font-serif text-ivory text-2xl font-semibold">{step.num}</span>
                  </div>
                  <h4 className="font-serif text-charcoal text-base font-semibold mb-2 leading-tight">{step.titre}</h4>
                  <p className="text-warm-gray text-xs leading-relaxed">{step.texte}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <button
              onClick={() => navigate('contact')}
              className="bg-burgundy text-ivory text-sm font-bold px-10 py-4 hover:bg-burgundy-dark transition-colors min-h-[48px]"
            >
              Communiquer avec le secrétariat
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ivory py-20 pb-28">
        <div className="max-w-[800px] mx-auto px-5 md:px-10">
          <h2 className="font-serif text-charcoal text-[32px] md:text-[40px] font-semibold mb-10 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-1">
            {faq.map((item, i) => (
              <div key={i} className="border border-gold/20 bg-paper">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-ivory/50 transition-colors"
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
