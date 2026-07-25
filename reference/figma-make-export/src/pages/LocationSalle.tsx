import { useState } from 'react'
import type { Page } from '../App'

interface Props { navigate?: (p: Page) => void }

type FormState = 'idle' | 'sending' | 'success' | 'error'

const processSteps = [
  { n: 1, titre: 'Envoyer une demande d\'information', texte: 'Remplissez le formulaire ci-dessous ou contactez-nous par téléphone pour vérifier la disponibilité.' },
  { n: 2, titre: 'Le secrétariat vérifie la disponibilité', texte: 'Nous vous répondrons dans les meilleurs délais pour confirmer si la salle est disponible à la date souhaitée.' },
  { n: 3, titre: 'Le prix et les conditions sont confirmés', texte: 'Nous vous communiquerons les tarifs et les conditions applicables à votre situation.' },
  { n: 4, titre: 'Le contrat est remis', texte: 'Un contrat de location vous sera remis pour signature lors d\'une rencontre en personne.' },
  { n: 5, titre: 'Le contrat est signé lors de la réservation', texte: 'La réservation est confirmée uniquement à la signature du contrat et au versement du dépôt requis.' },
]

export default function LocationSalle({ navigate: _navigate }: Props) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({
    nom: '', courriel: '', telephone: '', typeEvenement: '', dateVoulue: '', nbPersonnes: '', message: '', consentement: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nom.trim()) e.nom = 'Veuillez entrer votre nom.'
    if (!form.courriel.trim() || !form.courriel.includes('@')) e.courriel = 'Courriel invalide.'
    if (!form.typeEvenement.trim()) e.typeEvenement = 'Veuillez préciser le type d\'événement.'
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
      <section className="bg-charcoal pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/8 to-transparent" />
        </div>
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Services</span>
          <h1 className="font-serif text-ivory text-[44px] md:text-[60px] font-semibold leading-tight mb-4">
            Location de salle
          </h1>
          <p className="text-ivory/60 text-lg max-w-[500px]">
            Notre salle paroissiale est disponible à la location pour des événements communautaires, familiaux et autres rassemblements.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-ivory section-padding">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          {/* Photo placeholder */}
          <div className="w-full h-[400px] bg-paper border border-gold/20 flex flex-col items-center justify-center text-warm-gray/50 mb-16">
            <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-sm tracking-wide">[PHOTO DE LA SALLE À LOUER]</span>
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="font-serif text-charcoal text-[32px] md:text-[40px] font-semibold leading-tight mb-6">
                La salle paroissiale
              </h2>
              <p className="text-warm-gray text-lg leading-relaxed mb-8">
                Un espace polyvalent et accueillant, idéal pour une grande variété d'événements au sein de notre communauté.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Capacité', value: '[CAPACITÉ]' },
                  { label: 'Tarif', value: '[TARIF]' },
                  { label: 'Équipements', value: '[ÉQUIPEMENTS]' },
                  { label: 'Heures disponibles', value: '[HEURES DISPONIBLES]' },
                  { label: 'Conditions', value: '[CONDITIONS]' },
                  { label: 'Disponibilité', value: 'Sur demande' },
                ].map((item, i) => (
                  <div key={i} className="bg-paper p-4">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gold mb-1">{item.label}</p>
                    <p className="text-charcoal text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Types d'événements */}
            <div>
              <h3 className="font-serif text-charcoal text-xl font-semibold mb-5">Types d'événements acceptés</h3>
              <ul className="space-y-3 mb-8">
                {[
                  'Réunions communautaires',
                  'Repas familiaux',
                  'Activités paroissiales',
                  'Célébrations privées [INFORMATION À CONFIRMER]',
                  'Événements culturels',
                  'Formations et conférences',
                  '[INFORMATION À CONFIRMER]',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-warm-gray text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="bg-gold/10 border border-gold/30 p-5">
                <p className="text-charcoal text-sm leading-relaxed">
                  <span className="font-semibold text-burgundy">Important :</span> L'envoi du formulaire ne constitue pas une réservation. La disponibilité doit être confirmée par le secrétariat et un contrat doit être signé.
                </p>
              </div>
            </div>
          </div>

          {/* Processus */}
          <section className="mb-16 bg-paper p-8 md:p-12">
            <div className="text-center mb-10">
              <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-3">Démarche</span>
              <h2 className="font-serif text-charcoal text-[28px] md:text-[36px] font-semibold">Le processus de location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
              <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gold/20" />
              {processSteps.map((step) => (
                <div key={step.n} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-burgundy text-ivory font-serif text-xl flex items-center justify-center mb-4 flex-shrink-0 relative z-10">
                    {step.n}
                  </div>
                  <h4 className="font-serif text-charcoal text-sm font-semibold mb-2 leading-tight">{step.titre}</h4>
                  <p className="text-warm-gray text-xs leading-relaxed">{step.texte}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Formulaire */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">Formulaire</span>
                <h2 className="font-serif text-charcoal text-[32px] md:text-[40px] font-semibold mb-4">
                  Demande de disponibilité
                </h2>
                <p className="text-warm-gray text-base leading-relaxed mb-6">
                  Remplissez ce formulaire pour vérifier la disponibilité de la salle. Nous vous répondrons dans les meilleurs délais.
                </p>
                <div className="bg-paper border border-gold/20 p-5">
                  <p className="text-charcoal text-sm leading-relaxed font-semibold mb-2">Rappel important</p>
                  <p className="text-warm-gray text-sm leading-relaxed">
                    L'envoi de ce formulaire ne constitue pas une réservation. La disponibilité doit être confirmée par le secrétariat et un contrat doit être signé.
                  </p>
                </div>
              </div>

              <div>
                {formState === 'success' ? (
                  <div className="bg-paper border border-gold/20 p-8 text-center">
                    <div className="w-14 h-14 bg-burgundy/10 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-7 h-7 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-charcoal text-2xl font-semibold mb-3">Demande reçue</h3>
                    <p className="text-warm-gray text-sm leading-relaxed">
                      Merci pour votre demande. Le secrétariat vérifiera la disponibilité et communiquera avec vous dans les meilleurs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {[
                      { id: 'nom', label: 'Nom complet', type: 'text', req: true, placeholder: 'Votre nom et prénom', value: form.nom, onChange: (v: string) => setForm({ ...form, nom: v }) },
                      { id: 'courriel', label: 'Courriel', type: 'email', req: true, placeholder: 'votre@courriel.com', value: form.courriel, onChange: (v: string) => setForm({ ...form, courriel: v }) },
                      { id: 'telephone', label: 'Téléphone', type: 'tel', req: false, placeholder: '(000) 000-0000', value: form.telephone, onChange: (v: string) => setForm({ ...form, telephone: v }) },
                      { id: 'typeEvenement', label: "Type d'événement", type: 'text', req: true, placeholder: 'Ex: repas de famille, réunion...', value: form.typeEvenement, onChange: (v: string) => setForm({ ...form, typeEvenement: v }) },
                      { id: 'dateVoulue', label: 'Date souhaitée', type: 'text', req: false, placeholder: '[DATE]', value: form.dateVoulue, onChange: (v: string) => setForm({ ...form, dateVoulue: v }) },
                      { id: 'nbPersonnes', label: 'Nombre approximatif de personnes', type: 'text', req: false, placeholder: 'Ex: 50', value: form.nbPersonnes, onChange: (v: string) => setForm({ ...form, nbPersonnes: v }) },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="block text-[10px] tracking-[0.15em] uppercase text-warm-gray mb-1.5">
                          {field.label} {field.req && <span className="text-burgundy">*</span>}
                        </label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder={field.placeholder}
                          className={`w-full bg-paper border ${errors[field.id] ? 'border-burgundy' : 'border-gold/30'} px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-burgundy transition-colors min-h-[48px]`}
                        />
                        {errors[field.id] && <p className="text-burgundy text-xs mt-1">{errors[field.id]}</p>}
                      </div>
                    ))}

                    <div>
                      <label className="block text-[10px] tracking-[0.15em] uppercase text-warm-gray mb-1.5">Message</label>
                      <textarea
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Précisions sur votre demande..."
                        className="w-full bg-paper border border-gold/30 px-4 py-3 text-charcoal text-sm focus:outline-none focus:border-burgundy transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.consentement}
                          onChange={(e) => setForm({ ...form, consentement: e.target.checked })}
                          className="mt-1 w-4 h-4 accent-burgundy"
                        />
                        <span className="text-warm-gray text-sm leading-relaxed">
                          Je comprends que cet envoi ne constitue pas une réservation et que la disponibilité doit être confirmée par le secrétariat.
                        </span>
                      </label>
                      {errors.consentement && <p className="text-burgundy text-xs mt-1">{errors.consentement}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={formState === 'sending'}
                      className="w-full bg-burgundy text-ivory text-sm font-bold py-4 hover:bg-burgundy-dark transition-colors min-h-[48px] disabled:opacity-60"
                    >
                      {formState === 'sending' ? 'Envoi en cours...' : 'Envoyer la demande de disponibilité'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
