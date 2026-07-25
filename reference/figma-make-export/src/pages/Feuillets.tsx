import { useState } from 'react'
import type { Page } from '../App'

interface Props { navigate?: (p: Page) => void }

const feuillets = [
  { semaine: 'Semaine du [DATE]', taille: '[Taille du fichier]', year: '2024' },
  { semaine: 'Semaine du [DATE]', taille: '[Taille du fichier]', year: '2024' },
  { semaine: 'Semaine du [DATE]', taille: '[Taille du fichier]', year: '2024' },
  { semaine: 'Semaine du [DATE]', taille: '[Taille du fichier]', year: '2024' },
  { semaine: 'Semaine du [DATE]', taille: '[Taille du fichier]', year: '2023' },
  { semaine: 'Semaine du [DATE]', taille: '[Taille du fichier]', year: '2023' },
]

export default function Feuillets({ navigate: _navigate }: Props) {
  const [activeYear, setActiveYear] = useState('2024')

  const years = ['2024', '2023']
  const filtered = feuillets.filter((f) => f.year === activeYear)

  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/8 to-transparent" />
        </div>
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Information</span>
          <h1 className="font-serif text-ivory text-[44px] md:text-[60px] font-semibold leading-tight mb-4">
            Feuillets paroissiaux<br />et nouvelles
          </h1>
          <p className="text-ivory/60 text-lg max-w-[540px]">
            Consultez et téléchargez les feuillets hebdomadaires de notre paroisse. Restez informé des annonces et activités.
          </p>
        </div>
      </section>

      {/* Feuillet le plus récent */}
      <section className="bg-ivory section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Dernière parution</span>
              <h2 className="font-serif text-charcoal text-[36px] md:text-[48px] font-semibold leading-tight mb-6">
                Le feuillet de la semaine
              </h2>
              <div className="bg-paper border border-gold/20 p-6 mb-8">
                <div className="flex items-start gap-5">
                  {/* Doc icon */}
                  <div className="w-14 h-18 bg-burgundy/10 border border-burgundy/20 flex flex-col items-center justify-center p-3 flex-shrink-0">
                    <svg className="w-7 h-7 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-burgundy text-[9px] font-bold mt-1">PDF</span>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gold mb-1">Feuillet paroissial</p>
                    <h3 className="font-serif text-charcoal text-xl font-semibold">Semaine du [DATE]</h3>
                    <p className="text-warm-gray text-sm mt-1">PDF · [Taille du fichier]</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="bg-burgundy text-ivory text-sm font-bold px-6 py-3 hover:bg-burgundy-dark transition-colors flex items-center gap-2 min-h-[48px]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger le PDF
                </button>
              </div>
            </div>

            {/* Annonces */}
            <div className="bg-paper border border-gold/20 p-8">
              <h3 className="font-serif text-charcoal text-xl font-semibold mb-6">Annonces importantes</h3>
              <div className="space-y-5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="border-b border-gold/15 pb-5 last:border-0 last:pb-0">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gold mb-1">[DATE]</p>
                    <p className="text-charcoal text-sm font-semibold leading-tight">[INFORMATION À CONFIRMER]</p>
                    <p className="text-warm-gray text-xs mt-1 leading-relaxed">[Description de l'annonce]</p>
                  </div>
                ))}
              </div>
              <a href="#" className="mt-5 text-xs text-gold hover:text-burgundy transition-colors tracking-wide block">
                Voir sur Facebook →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Archives */}
      <section className="bg-paper section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Archives</span>
              <h2 className="font-serif text-charcoal text-[32px] md:text-[44px] font-semibold">Feuillets précédents</h2>
            </div>
            {/* Year filter */}
            <div className="flex gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors min-h-[44px] ${
                    activeYear === y ? 'bg-burgundy text-ivory' : 'bg-ivory text-warm-gray border border-gold/20 hover:text-charcoal'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((f, i) => (
              <div key={i} className="bg-ivory border border-gold/15 p-5 flex items-center gap-4 hover:border-gold/40 transition-colors group">
                <div className="w-10 h-12 bg-burgundy/10 border border-burgundy/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-charcoal text-sm font-semibold truncate">{f.semaine}</p>
                  <p className="text-warm-gray text-xs">PDF · {f.taille}</p>
                </div>
                <button className="flex-shrink-0 text-gold hover:text-burgundy transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Future module */}
          <div className="mt-12 border border-dashed border-gold/30 p-8 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/60 mb-2">Module futur</p>
            <p className="font-serif text-warm-gray text-xl">Messages et homélies</p>
            <p className="text-warm-gray/60 text-sm mt-2">
              Bientôt disponible — Accédez aux homélies de notre prêtre en format audio ou vidéo.
            </p>
          </div>
        </div>
      </section>

      {/* Facebook link */}
      <section className="bg-ivory py-14 border-t border-gold/15">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 text-center">
          <p className="text-warm-gray text-lg mb-6">
            Suivez également nos actualités sur Facebook pour rester informé en temps réel.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-[#1877F2] text-white text-sm font-bold px-8 py-4 hover:bg-[#166FE5] transition-colors min-h-[48px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Voir notre page Facebook
          </a>
        </div>
      </section>
    </>
  )
}
