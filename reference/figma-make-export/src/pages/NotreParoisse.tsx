import type { Page } from '../App'
import heroImg from '../imports/20210320_163052_-_Copy.jpg'
import aerialImg from '../imports/20210319_165026_-_Copy.jpg'
import floralsImg from '../imports/20210331_183200_-_Copy.jpg'
import redImg from '../imports/20210328_125526_-_Copy.jpg'

interface Props { navigate: (p: Page) => void }

export default function NotreParoisse({ navigate }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <img
          src={heroImg}
          alt="Intérieur de l'église — architecture avec poutres en bois et autel"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/65" />
        {/* Beam motif */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-ivory/8 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end min-h-[70vh] max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 pb-16 pt-28">
          <span className="font-script text-ivory/60 text-4xl block mb-3 leading-none">Notre histoire</span>
          <h1 className="font-serif text-ivory text-[48px] md:text-[68px] lg:text-[80px] font-semibold leading-tight mb-4">
            Une paroisse au<br />cœur de sa communauté
          </h1>
          <p className="text-ivory/70 text-lg max-w-[540px]">
            Enracinée dans la foi et tournée vers l'avenir, notre paroisse unit des générations autour d'une même espérance.
          </p>
        </div>
      </section>

      {/* Bienvenue */}
      <section className="bg-ivory section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="max-w-[680px] mx-auto text-center">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Bienvenue</span>
            <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold leading-tight mb-8">
              Un lieu ouvert à toutes et à tous
            </h2>
            <p className="text-warm-gray text-lg leading-relaxed mb-6">
              Que vous soyez pratiquant de longue date, en retour à la foi ou simplement curieux, notre paroisse vous accueille avec joie. Nous croyons que chaque personne porte une dignité unique et mérite d'être accueillie avec chaleur.
            </p>
            <p className="text-warm-gray text-lg leading-relaxed">
              Ici, la prière côtoie l'entraide, la liturgie s'accomplit dans la beauté et la communauté se retrouve autour de ce qui nous dépasse.
            </p>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="bg-paper section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Fondation</span>
              <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold leading-tight mb-6">
                Histoire de la paroisse
              </h2>
              <div className="space-y-5 text-warm-gray text-base leading-relaxed">
                <p>[TEXTE HISTORIQUE À FOURNIR]</p>
                <p>
                  L'église actuelle, avec son architecture moderne marquée par les grandes poutres de bois, le mur de brique central et le puits de lumière au-dessus de l'autel, incarne l'esprit d'une communauté ancrée dans son temps tout en restant fidèle à sa tradition.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden col-span-2 sm:col-span-1">
                <img src={aerialImg} alt="Vue d'ensemble de l'église" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] overflow-hidden col-span-2 sm:col-span-1 sm:mt-8">
                <img src={floralsImg} alt="Autel décoré de fleurs" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Valeurs */}
      <section className="bg-charcoal section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
        </div>
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Ce qui nous anime</span>
            <h2 className="font-serif text-ivory text-[36px] md:text-[52px] font-semibold leading-tight">
              Mission et valeurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ivory/10">
            {[
              {
                titre: 'Prière',
                texte: 'La célébration de l\'Eucharistie et des sacrements est au cœur de notre vie paroissiale. Nous nous rassemblons pour prier, chanter et contempler.',
                icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
              },
              {
                titre: 'Communauté',
                texte: '[TEXTE DE MISSION À FOURNIR] — Nous valorisons l\'appartenance, la solidarité et la rencontre entre les personnes de tous horizons.',
                icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
              },
              {
                titre: 'Service',
                texte: 'Inspirés par l\'Évangile, nous cherchons à servir les plus vulnérables et à contribuer au mieux-être de notre milieu.',
                icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
              },
            ].map((val, i) => (
              <div key={i} className="bg-charcoal p-8 md:p-10">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={val.icon} />
                  </svg>
                </div>
                <h3 className="font-serif text-ivory text-2xl font-semibold mb-4">{val.titre}</h3>
                <p className="text-ivory/50 text-sm leading-relaxed">{val.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-ivory section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 items-center">
            <div className="overflow-hidden">
              <img
                src={redImg}
                alt="Décorations de l'autel lors d'une grande célébration"
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Le lieu</span>
              <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold leading-tight mb-8">
                L'église et son architecture
              </h2>
              <p className="text-warm-gray text-lg leading-relaxed mb-6">
                Notre église est un exemple remarquable de l'architecture religieuse contemporaine au Québec. Le bois massif des poutres du plafond, le mur de brique central et le puits de lumière au-dessus de l'autel créent une atmosphère de recueillement unique.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Plafond et poutres en bois',
                  'Mur central en brique',
                  'Puits de lumière au-dessus de l\'autel',
                  'Composition architecturale symétrique',
                  'Tapis rouge profond',
                  'Objets liturgiques en laiton et en or',
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
                    <span className="text-charcoal text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="bg-paper section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center mb-14">
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Notre équipe</span>
            <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold leading-tight">
              Le prêtre et l'équipe pastorale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Curé */}
            <div className="bg-ivory p-6 border border-gold/15">
              <div className="w-full aspect-square bg-paper border border-gold/20 flex flex-col items-center justify-center mb-5 text-warm-gray/50">
                <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="text-xs tracking-wide">[PHOTO DU CURÉ]</span>
              </div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gold mb-1">Curé</p>
              <h3 className="font-serif text-charcoal text-xl font-semibold">[NOM]</h3>
              <p className="text-warm-gray text-sm mt-1">[TITRE]</p>
              <p className="text-warm-gray text-sm leading-relaxed mt-3">[COURTE BIOGRAPHIE]</p>
            </div>

            {/* Marguilliers */}
            <div className="bg-ivory p-6 border border-gold/15">
              <div className="w-full aspect-square bg-paper border border-gold/20 flex flex-col items-center justify-center mb-5 text-warm-gray/50">
                <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span className="text-xs tracking-wide">[PHOTO DES MARGUILLIERS]</span>
              </div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gold mb-1">Conseil de fabrique</p>
              <h3 className="font-serif text-charcoal text-xl font-semibold">Les marguilliers</h3>
              <p className="text-warm-gray text-sm leading-relaxed mt-3">
                Le conseil de fabrique veille à la gestion et à la bonne marche de la paroisse. [INFORMATION À CONFIRMER]
              </p>
            </div>

            {/* Bénévoles */}
            <div className="bg-burgundy p-6">
              <div className="w-12 h-12 bg-ivory/10 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gold/80 mb-1">Engagement</p>
              <h3 className="font-serif text-ivory text-xl font-semibold mb-3">Vous souhaitez vous impliquer?</h3>
              <p className="text-ivory/60 text-sm leading-relaxed mb-6">
                Notre paroisse a besoin de bénévoles engagés. Que ce soit pour la liturgie, l'accueil ou les activités communautaires, votre contribution est précieuse.
              </p>
              <button
                onClick={() => navigate('contact')}
                className="w-full bg-ivory text-burgundy text-sm font-bold py-3 hover:bg-paper transition-colors"
              >
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Première visite */}
      <section className="bg-ivory py-20 border-t border-gold/20">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 text-center">
          <span className="font-script text-gold text-4xl block mb-3">Venez</span>
          <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold mb-6">
            Venez nous rendre visite
          </h2>
          <p className="text-warm-gray text-lg max-w-[500px] mx-auto mb-10">
            Tout ce qu'il faut savoir pour votre première visite à notre paroisse.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('premiere-visite')}
              className="bg-burgundy text-ivory text-sm font-bold px-8 py-4 hover:bg-burgundy-dark transition-colors min-h-[48px]"
            >
              Votre première visite
            </button>
            <button
              onClick={() => navigate('horaires')}
              className="border border-burgundy/40 text-burgundy text-sm font-medium px-8 py-4 hover:bg-burgundy/5 transition-colors min-h-[48px]"
            >
              Voir les horaires
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
