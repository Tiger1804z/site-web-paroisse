import { useState } from 'react'
import type { Page } from '../App'

import heroImg from '../imports/20210320_163052_-_Copy.jpg'
import hero2Img from '../imports/20210326_164625_-_Copy.jpg'
import aerialImg from '../imports/20210319_165026_-_Copy.jpg'
import pinkImg1 from '../imports/20210312_181118_-_Copy.jpg'
import pinkImg2 from '../imports/20210319_184417_-_Copy.jpg'
import redImg from '../imports/20210328_125526_-_Copy.jpg'
import floralsImg from '../imports/20210331_183200_-_Copy.jpg'

interface Props { navigate: (p: Page) => void }

const events = [
  {
    category: 'Concerts',
    date: '[DATE]',
    title: 'Concert à l\'église',
    desc: 'Une soirée musicale en l\'honneur de notre communauté, avec des artistes locaux.',
    lieu: '[NOM DE LA PAROISSE]',
    featured: true,
    img: aerialImg,
  },
  {
    category: 'Activités communautaires',
    date: '[DATE]',
    title: 'Souper dansant de l\'Âge d\'Or',
    desc: 'Une belle soirée pour célébrer ensemble.',
    lieu: 'Salle paroissiale',
    featured: false,
    img: floralsImg,
  },
  {
    category: 'Pèlerinages',
    date: '[DATE]',
    title: 'Pèlerinage annuel',
    desc: 'Cheminement spirituel en communauté.',
    lieu: '[INFORMATION À CONFIRMER]',
    featured: false,
    img: pinkImg1,
  },
  {
    category: 'Célébrations',
    date: '[DATE]',
    title: 'Célébration pénitentielle',
    desc: 'Moment de recueillement et de réconciliation.',
    lieu: '[NOM DE LA PAROISSE]',
    featured: false,
    img: redImg,
  },
]

export default function Home({ navigate }: Props) {
  const [alertVisible, setAlertVisible] = useState(true)

  return (
    <>
      {/* ─── SECTION 1: HERO ─── */}
      <section className="relative min-h-screen overflow-hidden">
        <img
          src={heroImg}
          alt="Intérieur de l'église — nef avec poutres en bois, mur de brique et autel"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/65 via-charcoal/45 to-charcoal/70" />

        {/* Vertical light beams — architectural motif */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ivory/8 to-transparent" />
          <div className="absolute left-[48%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
          <div className="absolute left-[52%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center pt-20 pb-32">
          <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 w-full">
            <div className="max-w-[680px]">
              <span className="font-script text-ivory/70 text-4xl md:text-5xl block mb-3 leading-none">
                Bienvenue
              </span>
              <h1 className="font-serif text-ivory text-[52px] md:text-[72px] lg:text-[88px] leading-[1.05] font-semibold mb-6">
                Un lieu de foi,<br />
                de paix et<br />
                de rencontre.
              </h1>
              <p className="text-ivory/75 text-lg md:text-xl leading-relaxed mb-10 max-w-[520px]">
                Bienvenue à la paroisse [NOM DE LA PAROISSE]. Découvrez nos célébrations, nos activités et la vie de notre communauté.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('horaires')}
                  className="bg-ivory text-burgundy text-sm font-bold tracking-wide px-7 py-4 hover:bg-paper transition-colors duration-200 min-h-[48px]"
                >
                  Voir les horaires
                </button>
                <button
                  onClick={() => navigate('notre-paroisse')}
                  className="border border-ivory/60 text-ivory text-sm font-medium tracking-wide px-7 py-4 hover:bg-ivory/10 transition-colors duration-200 min-h-[48px]"
                >
                  Découvrir la paroisse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating schedule card — desktop */}
        <div className="absolute bottom-12 right-5 md:right-10 lg:right-20 z-10 hidden md:block">
          <div className="bg-ivory/97 backdrop-blur-sm border border-gold/20 p-6 w-[260px] shadow-lg">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-4">Prochaines messes</p>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline border-b border-paper pb-3">
                <span className="font-serif text-charcoal text-lg">Samedi</span>
                <span className="text-burgundy font-semibold text-sm">[HEURE]</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-paper pb-3">
                <span className="font-serif text-charcoal text-lg">Dimanche</span>
                <span className="text-burgundy font-semibold text-sm">[HEURE]</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-charcoal text-lg">Dimanche</span>
                <span className="text-burgundy font-semibold text-sm">[HEURE]</span>
              </div>
            </div>
            <button
              onClick={() => navigate('horaires')}
              className="mt-5 text-xs text-gold hover:text-burgundy transition-colors tracking-wide flex items-center gap-2 group"
            >
              Consulter tous les horaires
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="mt-3 text-[10px] text-warm-gray/80 leading-tight">
              Horaires sujets à changement lors des célébrations spéciales.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-ivory/50 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── SECTION 2: ALERT BANNER ─── */}
      {alertVisible && (
        <div className="bg-paper border-b border-gold/30">
          <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="hidden sm:flex w-2 h-2 rounded-full bg-gold flex-shrink-0" />
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-semibold mr-3">Célébration spéciale</span>
                <span className="text-charcoal text-sm">L'horaire du [DATE] a été modifié.</span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => navigate('horaires')}
                className="text-burgundy text-sm font-semibold hover:underline underline-offset-2 transition-colors"
              >
                Voir les détails →
              </button>
              <button
                onClick={() => setAlertVisible(false)}
                className="text-warm-gray hover:text-charcoal transition-colors p-1"
                aria-label="Fermer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 3: MESSAGE DE BIENVENUE ─── */}
      <section className="section-padding bg-ivory overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <span className="font-script text-gold text-4xl block mb-4 leading-none">Ensemble</span>
              <h2 className="font-serif text-charcoal text-[40px] md:text-[52px] lg:text-[60px] leading-tight font-semibold mb-8">
                Une communauté<br />enracinée dans la foi
              </h2>
              <p className="text-warm-gray text-lg leading-relaxed mb-8 max-w-[580px]">
                Notre paroisse est un lieu de prière, de rencontre et de solidarité ouvert à toutes les personnes qui souhaitent cheminer dans la foi. Que vous soyez de passage ou enraciné dans le quartier, vous êtes les bienvenus parmi nous.
              </p>
              {/* Quote */}
              <blockquote className="border-l-2 border-gold pl-6 mb-10">
                <p className="font-serif text-xl italic text-charcoal/80 leading-relaxed">
                  « Là où deux ou trois sont rassemblés en mon nom, je suis au milieu d'eux. »
                </p>
                <cite className="text-xs tracking-[0.15em] uppercase text-gold not-italic mt-3 block">Matthieu 18,20</cite>
              </blockquote>
              <button
                onClick={() => navigate('notre-paroisse')}
                className="group inline-flex items-center gap-3 text-burgundy font-semibold text-sm tracking-wide hover:gap-5 transition-all duration-200"
              >
                En savoir plus sur notre paroisse
                <span className="w-8 h-px bg-burgundy group-hover:w-12 transition-all duration-200" />
              </button>
            </div>

            {/* Right — editorial photos */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="col-span-2 aspect-[4/3] overflow-hidden">
                <img
                  src={hero2Img}
                  alt="Vue de l'église avec tapis rouge et autel illuminé"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={pinkImg2}
                  alt="Autel avec éclairage rose lors d'une célébration"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={floralsImg}
                  alt="Décorations florales autour de l'autel"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: HORAIRES ─── */}
      <section className="bg-charcoal section-padding relative overflow-hidden">
        {/* Decorative beam */}
        <div className="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-gold/10 via-gold/5 to-transparent pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-start">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Célébrations</span>
              <h2 className="font-serif text-ivory text-[44px] md:text-[56px] leading-tight font-semibold mb-6">
                Célébrer avec nous
              </h2>
              <p className="text-ivory/60 text-lg leading-relaxed mb-10 max-w-[480px]">
                Retrouvez ci-dessous les horaires réguliers de nos célébrations eucharistiques. Ces horaires peuvent être modifiés lors des fêtes et célébrations spéciales.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('horaires')}
                  className="bg-burgundy text-ivory text-sm font-semibold tracking-wide px-6 py-3 hover:bg-burgundy-dark transition-colors min-h-[48px]"
                >
                  Tous les horaires
                </button>
                <button
                  onClick={() => navigate('feuillets')}
                  className="border border-ivory/20 text-ivory text-sm font-medium tracking-wide px-6 py-3 hover:bg-ivory/10 transition-colors min-h-[48px]"
                >
                  Feuillet de la semaine
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {/* Schedule rows */}
              {[
                { day: 'Samedi', note: 'Vigile dominicale', time: '[HEURE]' },
                { day: 'Dimanche', note: 'Messe dominicale', time: '[HEURE]' },
                { day: 'Dimanche', note: 'Messe dominicale', time: '[HEURE]' },
                { day: 'Jours de semaine', note: '[INFORMATION À CONFIRMER]', time: '[HEURE]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-5 border-b border-ivory/10 group hover:bg-ivory/5 px-4 -mx-4 transition-colors">
                  <div>
                    <p className="font-serif text-ivory text-xl">{item.day}</p>
                    <p className="text-ivory/40 text-xs tracking-wide mt-0.5">{item.note}</p>
                  </div>
                  <span className="font-serif text-gold text-2xl font-medium">{item.time}</span>
                </div>
              ))}

              <p className="text-ivory/30 text-xs pt-4 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Dernière mise à jour : [DATE ET HEURE]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: ÉVÉNEMENTS ─── */}
      <section className="section-padding bg-ivory">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Vie communautaire</span>
              <h2 className="font-serif text-charcoal text-[40px] md:text-[52px] leading-tight font-semibold">
                Prochaines activités
              </h2>
            </div>
            <button
              onClick={() => navigate('evenements')}
              className="group inline-flex items-center gap-3 text-burgundy font-semibold text-sm tracking-wide hover:gap-5 transition-all self-start md:self-auto"
            >
              Voir tous les événements
              <span className="w-8 h-px bg-burgundy group-hover:w-12 transition-all duration-200" />
            </button>
          </div>

          {/* Featured event + list */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8">
            {/* Featured */}
            <div className="group relative overflow-hidden bg-charcoal">
              <img
                src={events[0].img}
                alt={events[0].title}
                className="w-full aspect-[16/9] object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2 block">{events[0].category}</span>
                <h3 className="font-serif text-ivory text-3xl md:text-4xl font-semibold mb-2 leading-tight">
                  {events[0].title}
                </h3>
                <p className="text-ivory/60 text-sm mb-4">{events[0].desc}</p>
                <div className="flex items-center gap-4">
                  <span className="text-ivory/50 text-sm">{events[0].date}</span>
                  <span className="text-ivory/30">·</span>
                  <span className="text-ivory/50 text-sm">{events[0].lieu}</span>
                </div>
                <button
                  onClick={() => navigate('evenements')}
                  className="mt-5 text-sm text-ivory/70 hover:text-ivory border border-ivory/30 hover:border-ivory/60 px-5 py-2.5 transition-colors"
                >
                  Voir les détails
                </button>
              </div>
            </div>

            {/* Secondary events */}
            <div className="flex flex-col gap-4">
              {events.slice(1).map((ev, i) => (
                <div key={i} className="group flex gap-4 p-4 bg-paper hover:bg-paper/80 transition-colors cursor-pointer" onClick={() => navigate('evenements')}>
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                    <img
                      src={ev.img}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-gold">{ev.category}</span>
                    <h4 className="font-serif text-charcoal text-lg leading-tight mt-0.5">{ev.title}</h4>
                    <p className="text-warm-gray text-xs mt-1">{ev.date} · {ev.lieu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: VIE PAROISSIALE ─── */}
      <section className="section-padding bg-paper relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Communauté</span>
            <h2 className="font-serif text-charcoal text-[40px] md:text-[52px] leading-tight font-semibold">
              Vivre la paroisse
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Jeunes', desc: 'Activités et rassemblements pour la jeunesse', img: pinkImg1 },
              { name: 'Chorale', desc: 'Chant liturgique et animation des célébrations', img: aerialImg },
              { name: 'Dames et Fils de Notre-Dame', desc: 'Dévotion mariale et entraide communautaire', img: floralsImg },
              { name: 'Marguilliers', desc: 'Conseil de fabrique et gouvernance paroissiale', img: hero2Img },
            ].map((group, i) => (
              <div key={i} className="group relative overflow-hidden cursor-pointer" onClick={() => navigate('vie-paroissiale')}>
                <div className={`${i === 2 ? 'aspect-[3/4]' : 'aspect-[3/4]'} overflow-hidden`}>
                  <img
                    src={group.img}
                    alt={group.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-serif text-ivory text-lg font-semibold leading-tight">{group.name}</h3>
                  <p className="text-ivory/60 text-xs mt-1 leading-tight hidden md:block">{group.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('vie-paroissiale')}
              className="bg-burgundy text-ivory text-sm font-semibold tracking-wide px-8 py-4 hover:bg-burgundy-dark transition-colors min-h-[48px]"
            >
              Découvrir nos groupes
            </button>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: FEUILLET PAROISSIAL ─── */}
      <section className="bg-burgundy section-padding relative overflow-hidden">
        {/* Decorative arch motif */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-b-full border border-ivory/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-b-full border border-ivory/5 pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold/80 block mb-4">Restez informé</span>
              <h2 className="font-serif text-ivory text-[40px] md:text-[52px] leading-tight font-semibold mb-6">
                Le feuillet<br />de la semaine
              </h2>
              <p className="text-ivory/60 text-lg leading-relaxed mb-8">
                Consultez les annonces, les intentions de messe et les actualités de votre paroisse dans le feuillet hebdomadaire.
              </p>
              <div className="bg-ivory/10 border border-ivory/20 p-6 mb-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold/80 mb-3">Feuillet paroissial</p>
                <p className="font-serif text-ivory text-2xl mb-1">Semaine du [DATE]</p>
                <p className="text-ivory/40 text-sm">PDF · [Taille du fichier]</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="bg-gold text-charcoal text-sm font-bold tracking-wide px-6 py-3 hover:bg-gold/90 transition-colors flex items-center gap-2 min-h-[48px]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger le PDF
                </button>
                <button
                  onClick={() => navigate('feuillets')}
                  className="border border-ivory/30 text-ivory text-sm font-medium tracking-wide px-6 py-3 hover:bg-ivory/10 transition-colors min-h-[48px]"
                >
                  Voir les anciens feuillets
                </button>
              </div>
            </div>

            {/* Document illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-[260px] h-[340px] bg-ivory/10 border border-ivory/20 flex flex-col p-6 shadow-2xl">
                  {/* Lines decoration */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gold/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-ivory/40 text-[10px] tracking-wide">Paroisse</p>
                      <p className="text-ivory/70 text-xs font-medium">[NOM DE LA PAROISSE]</p>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full bg-ivory/20 ${i === 0 ? 'w-3/4' : i % 3 === 0 ? 'w-1/2' : 'w-full'}`} />
                    ))}
                  </div>
                  <div className="border-t border-ivory/20 pt-4 flex justify-between items-center">
                    <span className="text-ivory/40 text-[10px]">Semaine du [DATE]</span>
                    <span className="text-gold text-[10px] font-semibold">PDF</span>
                  </div>
                </div>
                {/* Shadow card behind */}
                <div className="absolute -right-3 -bottom-3 w-[260px] h-[340px] bg-ivory/5 border border-ivory/10 -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: DEUX SERVICES ─── */}
      <section className="section-padding bg-ivory">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Services paroissiaux</span>
            <h2 className="font-serif text-charcoal text-[40px] md:text-[48px] leading-tight font-semibold">
              À votre service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Friperie */}
            <div className="group bg-paper p-8 md:p-10 hover:bg-paper/80 transition-colors cursor-pointer relative overflow-hidden" onClick={() => navigate('friperie')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full" />
              <div className="w-12 h-12 bg-gold/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <h3 className="font-serif text-charcoal text-[28px] font-semibold mb-4 leading-tight">La friperie</h3>
              <p className="text-warm-gray text-base leading-relaxed mb-8">
                Donnez une seconde vie aux objets et découvrez nos ventes spéciales tout au long de l'année. Un espace accessible et chaleureux au service de la communauté.
              </p>
              <span className="group-hover:gap-5 inline-flex items-center gap-3 text-burgundy font-semibold text-sm tracking-wide transition-all duration-200">
                Découvrir la friperie
                <span className="w-8 h-px bg-burgundy group-hover:w-12 transition-all duration-200" />
              </span>
            </div>

            {/* Location de salle */}
            <div className="group bg-charcoal p-8 md:p-10 hover:bg-charcoal/90 transition-colors cursor-pointer relative overflow-hidden" onClick={() => navigate('location-salle')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full" />
              <div className="w-12 h-12 bg-gold/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="font-serif text-ivory text-[28px] font-semibold mb-4 leading-tight">Location de salle</h3>
              <p className="text-ivory/60 text-base leading-relaxed mb-8">
                Informez-vous sur la disponibilité et les modalités de location de notre salle paroissiale pour votre événement.
              </p>
              <span className="group-hover:gap-5 inline-flex items-center gap-3 text-gold font-semibold text-sm tracking-wide transition-all duration-200">
                Demander de l'information
                <span className="w-8 h-px bg-gold group-hover:w-12 transition-all duration-200" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: GALERIE IMMERSIVE ─── */}
      <section className="bg-paper py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Photographie</span>
              <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] leading-tight font-semibold">
                La paroisse en images
              </h2>
            </div>
            <button
              onClick={() => navigate('galerie')}
              className="group inline-flex items-center gap-3 text-burgundy font-semibold text-sm tracking-wide hover:gap-5 transition-all self-start"
            >
              Voir toute la galerie
              <span className="w-8 h-px bg-burgundy group-hover:w-12 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling strip */}
        <div className="flex gap-3 pl-5 md:pl-10 lg:pl-20 overflow-x-auto pb-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {[
            { img: heroImg, label: 'La nef', aspect: 'aspect-[4/3]' },
            { img: aerialImg, label: 'Vue d\'ensemble', aspect: 'aspect-[3/4]' },
            { img: pinkImg1, label: 'Célébration', aspect: 'aspect-[3/4]' },
            { img: pinkImg2, label: 'Autel illuminé', aspect: 'aspect-[4/3]' },
            { img: redImg, label: 'Décorations', aspect: 'aspect-[3/4]' },
            { img: floralsImg, label: 'Fleurs et lumière', aspect: 'aspect-[4/3]' },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 ${item.aspect} overflow-hidden cursor-pointer group w-64 md:w-72`}
              onClick={() => navigate('galerie')}
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 10: VISITE & CONTACT ─── */}
      <section className="section-padding bg-ivory">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Accueil</span>
            <h2 className="font-serif text-charcoal text-[40px] md:text-[52px] leading-tight font-semibold">
              Venez nous rencontrer
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Adresse', value: '[ADRESSE]', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
                { label: 'Téléphone', value: '[TÉLÉPHONE]', icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z' },
                { label: 'Courriel', value: '[COURRIEL]', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
                { label: 'Stationnement', value: '[INFORMATION À CONFIRMER]', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-paper">
                  <div className="w-10 h-10 bg-burgundy/10 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2">{item.label}</p>
                  <p className="text-charcoal text-sm leading-relaxed">{item.value}</p>
                </div>
              ))}

              <div className="sm:col-span-2 p-6 bg-paper">
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2">Secrétariat</p>
                <p className="text-charcoal text-sm">[HEURES DU SECRÉTARIAT]</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => navigate('contact')}
                    className="bg-burgundy text-ivory text-sm font-semibold px-5 py-2.5 hover:bg-burgundy-dark transition-colors min-h-[48px]"
                  >
                    Nous joindre
                  </button>
                  <button
                    onClick={() => navigate('premiere-visite')}
                    className="border border-burgundy/30 text-burgundy text-sm font-medium px-5 py-2.5 hover:bg-burgundy/5 transition-colors min-h-[48px]"
                  >
                    Première visite
                  </button>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="h-[420px] bg-paper border border-gold/20 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-10 h-10 text-gold/50 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <p className="text-warm-gray text-sm">[CARTE INTERACTIVE]</p>
                <p className="text-warm-gray/60 text-xs mt-1">[ADRESSE]</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
