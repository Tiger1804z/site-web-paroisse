import { useState } from 'react'
import type { Page } from '../App'
import aerialImg from '../imports/20210319_165026_-_Copy.jpg'
import floralsImg from '../imports/20210331_183200_-_Copy.jpg'
import pinkImg1 from '../imports/20210312_181118_-_Copy.jpg'
import pinkImg2 from '../imports/20210319_184417_-_Copy.jpg'
import redImg from '../imports/20210328_125526_-_Copy.jpg'
import heroImg from '../imports/20210326_164625_-_Copy.jpg'

interface Props { navigate: (p: Page) => void }

const categories = ['Tous', 'Célébrations', 'Concerts', 'Activités communautaires', 'Soupers dansants', 'Pèlerinages', 'Groupes']

const evenements = [
  {
    cat: 'Concerts',
    date: '[DATE]',
    heure: '[HEURE]',
    titre: 'Concert à l\'église',
    desc: 'Une soirée musicale inoubliable dans le cadre magnifique de notre église. Des artistes locaux vous feront vivre une expérience unique.',
    lieu: '[NOM DE LA PAROISSE]',
    img: aerialImg,
    featured: true,
    inscription: false,
    responsable: '[NOM DU RESPONSABLE]',
  },
  {
    cat: 'Soupers dansants',
    date: '[DATE]',
    heure: '[HEURE]',
    titre: 'Souper dansant de l\'Âge d\'Or',
    desc: 'Une soirée festive et chaleureuse pour célébrer ensemble et créer de beaux souvenirs.',
    lieu: 'Salle paroissiale',
    img: floralsImg,
    featured: false,
    inscription: true,
    responsable: '[NOM DU RESPONSABLE]',
  },
  {
    cat: 'Pèlerinages',
    date: '[DATE]',
    heure: '[HEURE]',
    titre: 'Pèlerinage annuel',
    desc: 'Un cheminement spirituel en communauté. Un moment de prière, de partage et de découverte.',
    lieu: '[INFORMATION À CONFIRMER]',
    img: pinkImg1,
    featured: false,
    inscription: true,
    responsable: '[NOM DU RESPONSABLE]',
  },
  {
    cat: 'Célébrations',
    date: '[DATE]',
    heure: '[HEURE]',
    titre: 'Célébration pénitentielle',
    desc: 'Un temps de réconciliation et de grâce pour se préparer spirituellement.',
    lieu: '[NOM DE LA PAROISSE]',
    img: redImg,
    featured: false,
    inscription: false,
    responsable: '[NOM DU RESPONSABLE]',
  },
  {
    cat: 'Célébrations',
    date: '[DATE]',
    heure: '[HEURE]',
    titre: 'Célébration spéciale',
    desc: '[INFORMATION À CONFIRMER]',
    lieu: '[NOM DE LA PAROISSE]',
    img: pinkImg2,
    featured: false,
    inscription: false,
    responsable: '[NOM DU RESPONSABLE]',
  },
]

export default function Evenements({ navigate }: Props) {
  const [activeCat, setActiveCat] = useState('Tous')
  const [view, setView] = useState<'grille' | 'liste'>('grille')

  const filtered = evenements.filter((e) => activeCat === 'Tous' || e.cat === activeCat)
  const featured = filtered.find((e) => e.featured)
  const rest = filtered.filter((e) => !e.featured)

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img
          src={heroImg}
          alt="Événement paroissial"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 pb-14 pt-28">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Calendrier</span>
          <h1 className="font-serif text-ivory text-[44px] md:text-[60px] font-semibold leading-tight">
            Événements
          </h1>
        </div>
      </section>

      {/* Filters + view toggle */}
      <div className="bg-paper border-b border-gold/20 sticky top-16 md:top-20 z-20">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
            <div className="flex gap-1 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeCat === cat
                      ? 'bg-burgundy text-ivory'
                      : 'text-warm-gray hover:text-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => setView('grille')}
                className={`p-2 transition-colors ${view === 'grille' ? 'text-burgundy' : 'text-warm-gray hover:text-charcoal'}`}
                title="Vue grille"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h7v7H3zm0 11h7v7H3zm11-11h7v7h-7zm0 11h7v7h-7z" />
                </svg>
              </button>
              <button
                onClick={() => setView('liste')}
                className={`p-2 transition-colors ${view === 'liste' ? 'text-burgundy' : 'text-warm-gray hover:text-charcoal'}`}
                title="Vue liste"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events content */}
      <section className="section-padding bg-ivory">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">

          {view === 'grille' ? (
            <>
              {/* Featured event */}
              {featured && (
                <div className="mb-8 group relative overflow-hidden bg-charcoal cursor-pointer">
                  <img
                    src={featured.img}
                    alt={featured.titre}
                    className="w-full h-[420px] md:h-[520px] object-cover opacity-60 group-hover:opacity-70 group-hover:scale-103 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <div className="max-w-[540px]">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-gold bg-charcoal/60 px-3 py-1 mb-4 inline-block">{featured.cat}</span>
                      <h2 className="font-serif text-ivory text-3xl md:text-4xl font-semibold leading-tight mb-3">
                        {featured.titre}
                      </h2>
                      <p className="text-ivory/60 text-sm mb-4">{featured.desc}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-ivory/50 mb-6">
                        <span>{featured.date}</span>
                        <span>·</span>
                        <span>{featured.heure}</span>
                        <span>·</span>
                        <span>{featured.lieu}</span>
                      </div>
                      <button className="bg-ivory text-burgundy text-sm font-bold px-6 py-3 hover:bg-paper transition-colors min-h-[48px]">
                        Voir les détails
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((ev, i) => (
                  <div key={i} className="group bg-paper hover:bg-paper/70 transition-colors overflow-hidden cursor-pointer border border-gold/10 hover:border-gold/30">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={ev.img}
                        alt={ev.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-gold block mb-2">{ev.cat}</span>
                      <h3 className="font-serif text-charcoal text-xl font-semibold leading-tight mb-2">{ev.titre}</h3>
                      <p className="text-warm-gray text-sm leading-relaxed mb-4 line-clamp-2">{ev.desc}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-warm-gray mb-5">
                        <span>{ev.date}</span>
                        <span>·</span>
                        <span>{ev.heure}</span>
                        <span>·</span>
                        <span>{ev.lieu}</span>
                      </div>
                      <button className="text-burgundy text-sm font-semibold hover:underline underline-offset-2">
                        {ev.inscription ? 'Obtenir de l\'information →' : 'Voir les détails →'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Liste view */
            <div className="space-y-1">
              {filtered.map((ev, i) => (
                <div key={i} className="group flex flex-col sm:flex-row gap-0 bg-paper border border-gold/10 hover:border-gold/30 cursor-pointer transition-colors overflow-hidden">
                  <div className="sm:w-48 aspect-[16/9] sm:aspect-auto overflow-hidden flex-shrink-0">
                    <img
                      src={ev.img}
                      alt={ev.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 flex-1">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-gold block mb-1">{ev.cat}</span>
                      <h3 className="font-serif text-charcoal text-xl font-semibold leading-tight">{ev.titre}</h3>
                      <div className="flex flex-wrap gap-2 text-xs text-warm-gray mt-2">
                        <span>{ev.date}</span>
                        <span>·</span>
                        <span>{ev.heure}</span>
                        <span>·</span>
                        <span>{ev.lieu}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <button className="text-burgundy text-sm font-semibold hover:underline underline-offset-2 whitespace-nowrap min-h-[44px] flex items-center">
                        {ev.inscription ? 'Obtenir de l\'information →' : 'Voir les détails →'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-warm-gray">
              <p className="font-serif text-2xl mb-2">Aucun événement dans cette catégorie</p>
              <p className="text-sm">Consultez la catégorie « Tous » pour voir l'ensemble du calendrier.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-paper py-14">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 text-center">
          <p className="text-warm-gray text-lg mb-6">
            Vous organisez un événement paroissial ou souhaitez en savoir plus?
          </p>
          <button
            onClick={() => navigate('contact')}
            className="border border-burgundy/40 text-burgundy text-sm font-semibold px-8 py-4 hover:bg-burgundy hover:text-ivory transition-colors min-h-[48px]"
          >
            Communiquer avec le secrétariat
          </button>
        </div>
      </section>
    </>
  )
}
