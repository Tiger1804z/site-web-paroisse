import { useState } from 'react'
import type { Page } from '../App'

interface Props { navigate?: (p: Page) => void }

type FormState = 'idle' | 'sending' | 'success' | 'error'

const motifs = [
  'Question générale',
  'Horaire',
  'Baptême',
  'Mariage',
  'Location de salle',
  'Friperie',
  'Événement',
  'Vie paroissiale',
  'Autre',
]

export default function Contact({ navigate: _navigate }: Props) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({
    nom: '', courriel: '', telephone: '', motif: '', message: '', consentement: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nom.trim()) e.nom = 'Veuillez entrer votre nom.'
    if (!form.courriel.trim() || !form.courriel.includes('@')) e.courriel = 'Veuillez entrer un courriel valide.'
    if (!form.motif) e.motif = 'Veuillez choisir un motif.'
    if (!form.message.trim()) e.message = 'Veuillez écrire votre message.'
    if (!form.consentement) e.consentement = 'Vous devez accepter les conditions.'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setFormState('sending')
    setTimeout(() => setFormState('success'), 1800)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-burgundy pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-b-full border border-ivory/5 pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold/80 block mb-4">Communication</span>
          <h1 className="font-serif text-ivory text-[44px] md:text-[60px] font-semibold leading-tight mb-4">
            Nous joindre
          </h1>
          <p className="text-ivory/60 text-lg max-w-[480px]">
            Nous sommes heureux de répondre à vos questions. N'hésitez pas à nous contacter par téléphone, courriel ou via le formulaire ci-dessous.
          </p>
        </div>
      </section>

      {/* Contact info */}
      <section className="bg-ivory py-16">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                label: 'Adresse', value: '[ADRESSE]',
                icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
                link: 'https://maps.google.com',
              },
              {
                label: 'Téléphone', value: '[TÉLÉPHONE]',
                icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
                link: 'tel:[TÉLÉPHONE]',
              },
              {
                label: 'Courriel', value: '[COURRIEL]',
                icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
                link: 'mailto:[COURRIEL]',
              },
              {
                label: 'Facebook', value: 'Suivez-nous',
                icon: 'M6.75 3h10.5A3.75 3.75 0 0121 6.75v10.5A3.75 3.75 0 0117.25 21H6.75A3.75 3.75 0 013 17.25V6.75A3.75 3.75 0 016.75 3z',
                link: '#',
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                className="bg-paper p-6 hover:bg-paper/70 transition-colors group block"
              >
                <div className="w-10 h-10 bg-burgundy/10 flex items-center justify-center mb-4 group-hover:bg-burgundy/20 transition-colors">
                  <svg className="w-5 h-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-gold mb-2">{item.label}</p>
                <p className="text-charcoal text-sm">{item.value}</p>
              </a>
            ))}
          </div>

          {/* Secrétariat hours */}
          <div className="bg-paper border border-gold/20 p-8 mb-16">
            <h2 className="font-serif text-charcoal text-2xl font-semibold mb-5">Heures du secrétariat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-charcoal text-sm">[HEURES DU SECRÉTARIAT]</p>
              <p className="text-warm-gray text-sm">
                Pour les urgences pastorales en dehors des heures d'ouverture, veuillez consulter le répondeur téléphonique.
                [INFORMATION À CONFIRMER]
              </p>
            </div>
          </div>

          {/* Map + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div>
              <h2 className="font-serif text-charcoal text-[32px] font-semibold mb-6">Nous trouver</h2>
              <div className="h-[360px] bg-paper border border-gold/20 flex items-center justify-center mb-6">
                <div className="text-center text-warm-gray/50">
                  <svg className="w-10 h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                  <p className="text-sm">[CARTE INTERACTIVE]</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-warm-gray">
                <div className="flex gap-2 items-start">
                  <span className="text-gold font-bold">→</span>
                  <span>[Transport en commun — INFORMATION À CONFIRMER]</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-gold font-bold">→</span>
                  <span>[Stationnement — INFORMATION À CONFIRMER]</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-gold font-bold">→</span>
                  <span>[Accessibilité — INFORMATION À CONFIRMER]</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="font-serif text-charcoal text-[32px] font-semibold mb-6">Envoyez-nous un message</h2>

              {formState === 'success' ? (
                <div className="bg-paper border border-gold/20 p-8 text-center">
                  <div className="w-14 h-14 bg-burgundy/10 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-charcoal text-2xl font-semibold mb-3">Message envoyé</h3>
                  <p className="text-warm-gray text-sm leading-relaxed">
                    Merci de nous avoir contactés. Nous répondrons à votre message dans les meilleurs délais, généralement dans les 2 à 3 jours ouvrables.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Motif */}
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-warm-gray mb-2">
                      Motif de contact <span className="text-burgundy">*</span>
                    </label>
                    <select
                      value={form.motif}
                      onChange={(e) => setForm({ ...form, motif: e.target.value })}
                      className={`w-full bg-paper border ${errors.motif ? 'border-burgundy' : 'border-gold/30'} px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-burgundy transition-colors min-h-[48px]`}
                    >
                      <option value="">Choisissez un motif</option>
                      {motifs.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {errors.motif && <p className="text-burgundy text-xs mt-1">{errors.motif}</p>}
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-warm-gray mb-2">
                      Nom complet <span className="text-burgundy">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className={`w-full bg-paper border ${errors.nom ? 'border-burgundy' : 'border-gold/30'} px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-burgundy transition-colors min-h-[48px]`}
                      placeholder="Votre nom et prénom"
                    />
                    {errors.nom && <p className="text-burgundy text-xs mt-1">{errors.nom}</p>}
                  </div>

                  {/* Courriel + Téléphone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-warm-gray mb-2">
                        Courriel <span className="text-burgundy">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.courriel}
                        onChange={(e) => setForm({ ...form, courriel: e.target.value })}
                        className={`w-full bg-paper border ${errors.courriel ? 'border-burgundy' : 'border-gold/30'} px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-burgundy transition-colors min-h-[48px]`}
                        placeholder="votre@courriel.com"
                      />
                      {errors.courriel && <p className="text-burgundy text-xs mt-1">{errors.courriel}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-warm-gray mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={form.telephone}
                        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                        className="w-full bg-paper border border-gold/30 px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-burgundy transition-colors min-h-[48px]"
                        placeholder="(000) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-warm-gray mb-2">
                      Message <span className="text-burgundy">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`w-full bg-paper border ${errors.message ? 'border-burgundy' : 'border-gold/30'} px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-burgundy transition-colors resize-none`}
                      placeholder="Votre message..."
                    />
                    {errors.message && <p className="text-burgundy text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* Consentement */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.consentement}
                        onChange={(e) => setForm({ ...form, consentement: e.target.checked })}
                        className="mt-1 w-4 h-4 accent-burgundy"
                      />
                      <span className="text-warm-gray text-sm leading-relaxed">
                        J'accepte que mes informations soient utilisées pour traiter ma demande et y répondre, conformément à la politique de confidentialité de la paroisse.
                      </span>
                    </label>
                    {errors.consentement && <p className="text-burgundy text-xs mt-1">{errors.consentement}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full bg-burgundy text-ivory text-sm font-bold py-4 hover:bg-burgundy-dark transition-colors min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formState === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
