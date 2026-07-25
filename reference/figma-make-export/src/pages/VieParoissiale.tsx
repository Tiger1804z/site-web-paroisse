import type { Page } from '../App'
import heroImg from '../imports/20210326_164625_-_Copy.jpg'
import pinkImg1 from '../imports/20210312_181118_-_Copy.jpg'
import aerialImg from '../imports/20210319_165026_-_Copy.jpg'
import floralsImg from '../imports/20210331_183200_-_Copy.jpg'
import pinkImg2 from '../imports/20210319_184417_-_Copy.jpg'

interface Props { navigate: (p: Page) => void }

const groupes = [
  {
    nom: 'Jeunes',
    desc: 'Notre groupe de jeunes rassemble les adolescents et jeunes adultes de la paroisse autour d\'activités spirituelles et sociales. Un espace d\'appartenance et de croissance.',
    activites: '[INFORMATION À CONFIRMER]',
    frequence: '[INFORMATION À CONFIRMER]',
    responsable: '[NOM DU RESPONSABLE]',
    contact: '[COURRIEL]',
    img: pinkImg1,
    color: 'bg-plum',
  },
  {
    nom: 'Chorale',
    desc: 'La chorale paroissiale anime les célébrations avec chant et musique liturgique. Ouverte aux personnes de tous niveaux qui souhaitent mettre leur voix au service de la communauté.',
    activites: 'Pratiques régulières, animation des messes',
    frequence: '[INFORMATION À CONFIRMER]',
    responsable: '[NOM DU RESPONSABLE]',
    contact: '[COURRIEL]',
    img: aerialImg,
    color: 'bg-brick',
  },
  {
    nom: 'Dames et Fils de Notre-Dame',
    desc: 'Groupe de dévotion mariale et d\'entraide, les Dames et Fils de Notre-Dame organisent des activités spirituelles et communautaires tout au long de l\'année.',
    activites: 'Chapelet, pèlerinages, activités caritatives',
    frequence: '[INFORMATION À CONFIRMER]',
    responsable: '[NOM DU RESPONSABLE]',
    contact: '[COURRIEL]',
    img: floralsImg,
    color: 'bg-marian',
  },
  {
    nom: 'Marguilliers',
    desc: 'Le conseil de fabrique assure la gestion administrative et financière de la paroisse. Les marguilliers sont élus par la communauté et veillent aux intérêts de la paroisse.',
    activites: 'Réunions mensuelles, gestion paroissiale',
    frequence: '[INFORMATION À CONFIRMER]',
    responsable: '[NOM DU RESPONSABLE]',
    contact: '[COURRIEL]',
    img: pinkImg2,
    color: 'bg-wood',
  },
]

export default function VieParoissiale({ navigate }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[340px] overflow-hidden">
        <img
          src={heroImg}
          alt="L'église lors d'une célébration communautaire"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-charcoal/75" />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 pb-14 pt-28">
          <span className="font-script text-ivory/60 text-4xl block mb-2">Communauté</span>
          <h1 className="font-serif text-ivory text-[44px] md:text-[60px] font-semibold leading-tight">
            Vivre la paroisse
          </h1>
          <p className="text-ivory/70 text-lg mt-3 max-w-[540px]">
            Découvrez les groupes et activités qui font vivre notre communauté au quotidien.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-ivory py-20">
        <div className="max-w-[800px] mx-auto px-5 md:px-10 text-center">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Vie communautaire</span>
          <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold leading-tight mb-6">
            Une paroisse, plusieurs visages
          </h2>
          <p className="text-warm-gray text-lg leading-relaxed">
            La vie paroissiale se tisse dans la diversité de ses membres et de ses groupes. Chacun y trouve une place, un rôle, une appartenance.
          </p>
        </div>
      </section>

      {/* Groupes */}
      <section className="bg-paper section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="space-y-16">
            {groupes.map((groupe, i) => (
              <div
                key={groupe.nom}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
              >
                {/* Image */}
                <div className={`overflow-hidden ${i % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={groupe.img}
                      alt={groupe.nom}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute top-4 left-4 ${groupe.color} text-ivory text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 font-semibold`}>
                      Groupe paroissial
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Groupe</span>
                  <h3 className="font-serif text-charcoal text-[32px] md:text-[40px] font-semibold leading-tight mb-5">
                    {groupe.nom}
                  </h3>
                  <p className="text-warm-gray text-base leading-relaxed mb-8">
                    {groupe.desc}
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      { label: 'Activités', value: groupe.activites },
                      { label: 'Fréquence des rencontres', value: groupe.frequence },
                      { label: 'Responsable', value: groupe.responsable },
                      { label: 'Contact', value: groupe.contact },
                    ].map((item, j) => (
                      <div key={j} className="flex gap-4">
                        <span className="text-[10px] tracking-[0.15em] uppercase text-gold w-36 flex-shrink-0 pt-0.5">{item.label}</span>
                        <span className="text-charcoal text-sm">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('contact')}
                    className="border border-burgundy/40 text-burgundy text-sm font-semibold px-6 py-3 hover:bg-burgundy hover:text-ivory transition-colors min-h-[48px]"
                  >
                    En savoir plus →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Implication */}
      <section className="bg-burgundy py-20">
        <div className="max-w-[800px] mx-auto px-5 md:px-10 text-center">
          <span className="font-script text-gold text-4xl block mb-3">Ensemble</span>
          <h2 className="font-serif text-ivory text-[36px] md:text-[48px] font-semibold leading-tight mb-6">
            Vous souhaitez vous impliquer?
          </h2>
          <p className="text-ivory/60 text-lg leading-relaxed mb-10 max-w-[480px] mx-auto">
            Votre engagement enrichit la communauté. Que ce soit pour la liturgie, l'accueil, les activités ou autre chose, votre contribution est précieuse.
          </p>
          <button
            onClick={() => navigate('contact')}
            className="bg-ivory text-burgundy text-sm font-bold px-10 py-4 hover:bg-paper transition-colors min-h-[48px]"
          >
            Communiquer avec la paroisse
          </button>
        </div>
      </section>
    </>
  )
}
