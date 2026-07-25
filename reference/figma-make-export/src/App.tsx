import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Horaires from './pages/Horaires'
import NotreParoisse from './pages/NotreParoisse'
import PremiereVisite from './pages/PremiereVisite'
import Sacrements from './pages/Sacrements'
import VieParoissiale from './pages/VieParoissiale'
import Evenements from './pages/Evenements'
import Galerie from './pages/Galerie'
import Contact from './pages/Contact'
import Feuillets from './pages/Feuillets'
import Friperie from './pages/Friperie'
import LocationSalle from './pages/LocationSalle'

export type Page =
  | 'accueil'
  | 'horaires'
  | 'notre-paroisse'
  | 'premiere-visite'
  | 'sacrements'
  | 'vie-paroissiale'
  | 'evenements'
  | 'galerie'
  | 'contact'
  | 'feuillets'
  | 'friperie'
  | 'location-salle'

const navItems = [
  { label: 'Accueil', page: 'accueil' as Page },
  { label: 'Notre paroisse', page: 'notre-paroisse' as Page },
  { label: 'Horaires', page: 'horaires' as Page },
  { label: 'Vie paroissiale', page: 'vie-paroissiale' as Page },
  { label: 'Sacrements', page: 'sacrements' as Page },
  { label: 'Événements', page: 'evenements' as Page },
]

const infoItems = [
  { label: 'Feuillets paroissiaux', page: 'feuillets' as Page },
  { label: 'Friperie', page: 'friperie' as Page },
  { label: 'Location de salle', page: 'location-salle' as Page },
  { label: 'Galerie', page: 'galerie' as Page },
  { label: 'Nous joindre', page: 'contact' as Page },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('accueil')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMobileOpen(false)
  }, [currentPage])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navigate = (page: Page) => {
    setCurrentPage(page)
    setMobileOpen(false)
    setInfoOpen(false)
  }

  const isHeroPage = currentPage === 'accueil' || currentPage === 'notre-paroisse'

  return (
    <div className="min-h-screen bg-ivory font-sans">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHeroPage
            ? 'bg-ivory/97 backdrop-blur-sm shadow-sm border-b border-gold/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => navigate('accueil')}
              className="flex flex-col items-start group"
            >
              <span
                className={`font-serif text-lg md:text-xl font-semibold tracking-wide leading-tight transition-colors duration-300 ${
                  scrolled || !isHeroPage ? 'text-burgundy' : 'text-ivory'
                }`}
              >
                [NOM DE LA PAROISSE]
              </span>
              <span
                className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  scrolled || !isHeroPage ? 'text-gold' : 'text-ivory/70'
                }`}
              >
                Paroisse catholique
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => navigate(item.page)}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-sm relative group ${
                    currentPage === item.page
                      ? scrolled || !isHeroPage
                        ? 'text-burgundy'
                        : 'text-ivory'
                      : scrolled || !isHeroPage
                      ? 'text-charcoal hover:text-burgundy'
                      : 'text-ivory/85 hover:text-ivory'
                  }`}
                >
                  {item.label}
                  {currentPage === item.page && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-gold" />
                  )}
                </button>
              ))}
              {/* Informations dropdown */}
              <div className="relative">
                <button
                  onClick={() => setInfoOpen(!infoOpen)}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                    scrolled || !isHeroPage
                      ? 'text-charcoal hover:text-burgundy'
                      : 'text-ivory/85 hover:text-ivory'
                  }`}
                >
                  Informations
                  <svg className={`w-3 h-3 transition-transform ${infoOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {infoOpen && (
                  <div className="absolute top-full right-0 mt-1 w-52 bg-ivory border border-gold/20 shadow-lg py-1">
                    {infoItems.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => navigate(item.page)}
                        className="w-full text-left px-4 py-3 text-sm text-charcoal hover:bg-paper hover:text-burgundy transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => navigate('premiere-visite')}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  scrolled || !isHeroPage ? 'text-warm-gray hover:text-burgundy' : 'text-ivory/70 hover:text-ivory'
                }`}
              >
                Première visite
              </button>
              <button
                onClick={() => navigate('horaires')}
                className="bg-burgundy text-ivory text-sm font-semibold tracking-wide px-5 py-2.5 hover:bg-burgundy-dark transition-colors duration-200"
              >
                Voir les horaires
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={() => navigate('horaires')}
                className="bg-burgundy text-ivory text-xs font-semibold tracking-wide px-3 py-2"
              >
                Horaires
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 transition-colors ${
                  scrolled || !isHeroPage ? 'text-charcoal' : 'text-ivory'
                }`}
                aria-label="Menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Info dropdown overlay */}
        {infoOpen && (
          <div className="fixed inset-0 z-[-1]" onClick={() => setInfoOpen(false)} />
        )}
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-burgundy transition-transform duration-400 ease-in-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-8 px-8">
          <nav className="flex flex-col gap-1 mb-10">
            {[...navItems, ...infoItems].map((item) => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`text-left py-4 border-b border-ivory/10 transition-colors ${
                  currentPage === item.page ? 'text-gold font-semibold' : 'text-ivory hover:text-gold'
                }`}
              >
                <span className="font-serif text-2xl">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => navigate('premiere-visite')}
              className="text-left py-4 border-b border-ivory/10 text-ivory hover:text-gold transition-colors"
            >
              <span className="font-serif text-2xl">Première visite</span>
            </button>
          </nav>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3 text-ivory/70">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-sm">[ADRESSE]</span>
            </div>
            <a href="tel:[TÉLÉPHONE]" className="flex items-center gap-3 text-ivory/70 hover:text-ivory transition-colors">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="text-sm">[TÉLÉPHONE]</span>
            </a>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-ivory/60 hover:text-ivory transition-colors text-sm tracking-wide">Facebook</a>
              <span className="text-ivory/20">|</span>
              <a href="#" className="text-ivory/60 hover:text-ivory transition-colors text-sm tracking-wide">YouTube</a>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main>
        {currentPage === 'accueil' && <Home navigate={navigate} />}
        {currentPage === 'horaires' && <Horaires navigate={navigate} />}
        {currentPage === 'notre-paroisse' && <NotreParoisse navigate={navigate} />}
        {currentPage === 'premiere-visite' && <PremiereVisite navigate={navigate} />}
        {currentPage === 'sacrements' && <Sacrements navigate={navigate} />}
        {currentPage === 'vie-paroissiale' && <VieParoissiale navigate={navigate} />}
        {currentPage === 'evenements' && <Evenements navigate={navigate} />}
        {currentPage === 'galerie' && <Galerie navigate={navigate} />}
        {currentPage === 'contact' && <Contact navigate={navigate} />}
        {currentPage === 'feuillets' && <Feuillets navigate={navigate} />}
        {currentPage === 'friperie' && <Friperie navigate={navigate} />}
        {currentPage === 'location-salle' && <LocationSalle navigate={navigate} />}
      </main>

      {/* FOOTER */}
      <footer className="bg-charcoal text-ivory pt-16 pb-8">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-5">
                <p className="font-script text-gold text-3xl mb-1">Bienvenue</p>
                <h3 className="font-serif text-2xl text-ivory">[NOM DE LA PAROISSE]</h3>
                <p className="text-[11px] tracking-[0.2em] uppercase text-gold mt-1">Paroisse catholique</p>
              </div>
              <p className="text-ivory/60 text-sm leading-relaxed max-w-xs">
                Un lieu de foi, de paix et de rencontre ouvert à tous, au cœur de notre communauté québécoise.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-ivory/50 hover:text-gold transition-colors text-sm">Facebook</a>
                <span className="text-ivory/20">·</span>
                <a href="#" className="text-ivory/50 hover:text-gold transition-colors text-sm">YouTube</a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-5">Navigation</h4>
              <ul className="space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.page}>
                    <button
                      onClick={() => navigate(item.page)}
                      className="text-ivory/60 hover:text-ivory text-sm transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-5">Coordonnées</h4>
              <address className="not-italic space-y-3">
                <div className="text-ivory/60 text-sm">[ADRESSE]</div>
                <a href="tel:[TÉLÉPHONE]" className="block text-ivory/60 hover:text-ivory text-sm transition-colors">[TÉLÉPHONE]</a>
                <a href="mailto:[COURRIEL]" className="block text-ivory/60 hover:text-ivory text-sm transition-colors">[COURRIEL]</a>
                <div className="pt-2">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-gold mb-2">Secrétariat</p>
                  <p className="text-ivory/60 text-sm">[HEURES DU SECRÉTARIAT]</p>
                </div>
              </address>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-ivory/30 text-xs">
              © {new Date().getFullYear()} Paroisse [NOM DE LA PAROISSE]. Tous droits réservés.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button className="text-ivory/30 hover:text-ivory/60 text-xs transition-colors">Politique de confidentialité</button>
              <span className="text-ivory/20">·</span>
              <button className="text-ivory/30 hover:text-ivory/60 text-xs transition-colors">Mentions légales</button>
              <span className="text-ivory/20">·</span>
              <span className="text-ivory/20 text-xs">Conception : [NOM DU RESPONSABLE]</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-charcoal/95 backdrop-blur-sm border-t border-ivory/10 z-30 flex">
        <button
          onClick={() => navigate('horaires')}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-ivory hover:text-gold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] tracking-wide">Horaires</span>
        </button>
        <a
          href="tel:[TÉLÉPHONE]"
          className="flex-1 flex flex-col items-center gap-1 py-3 text-ivory hover:text-gold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span className="text-[10px] tracking-wide">Appeler</span>
        </a>
        <a
          href="https://maps.google.com"
          className="flex-1 flex flex-col items-center gap-1 py-3 text-ivory hover:text-gold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="text-[10px] tracking-wide">Itinéraire</span>
        </a>
      </div>
    </div>
  )
}
