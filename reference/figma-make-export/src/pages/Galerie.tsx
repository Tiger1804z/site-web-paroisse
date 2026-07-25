import { useState } from "react"
import type { Page } from "../App"

import img1 from "../imports/20210312_181118_-_Copy.jpg"
import img2 from "../imports/20210312_181217_-_Copy.jpg"
import img3 from "../imports/20210319_165026_-_Copy.jpg"
import img4 from "../imports/20210319_184417_-_Copy.jpg"
import img5 from "../imports/20210320_163052_-_Copy.jpg"
import img6 from "../imports/20210326_164625_-_Copy.jpg"
import img7 from "../imports/20210326_164659_-_Copy.jpg"
import img8 from "../imports/20210328_125526_-_Copy.jpg"
import img9 from "../imports/20210331_183200_-_Copy.jpg"

interface Props {
  navigate?: (p: Page) => void
}

const photos = [
  {
    src: img5,
    alt: "Intérieur de l'église — nef principale avec poutres et autel",
    cat: "Célébrations",
    date: "[DATE]",
    legende: "Vue d'ensemble de la nef lors d'une célébration",
  },
  {
    src: img6,
    alt: "Autel avec tapis rouge et décorations liturgiques",
    cat: "Célébrations",
    date: "[DATE]",
    legende: "L'autel lors d'une grande fête",
  },
  {
    src: img3,
    alt: "Vue aérienne de l'autel avec décorations violettes",
    cat: "Décorations",
    date: "[DATE]",
    legende: "Décoration violette pour le temps liturgique",
  },
  {
    src: img9,
    alt: "Autel décoré de fleurs blanches et roses",
    cat: "Décorations",
    date: "[DATE]",
    legende: "Décorations florales autour de l'autel",
  },
  {
    src: img1,
    alt: "Autel avec éclairage rose lors d'une célébration",
    cat: "Célébrations",
    date: "[DATE]",
    legende: "Atmosphère lumineuse lors d'une célébration",
  },
  {
    src: img8,
    alt: "Décorations rouges pour une grande fête",
    cat: "Décorations",
    date: "[DATE]",
    legende: "Décorations rouges pour une fête solennelle",
  },
  {
    src: img4,
    alt: "Vue latérale de l'église lors d'une célébration rose",
    cat: "Célébrations",
    date: "[DATE]",
    legende: "Lumières roses pour une célébration spéciale",
  },
  {
    src: img2,
    alt: "Autel avec éclairage rose et croix en or",
    cat: "Notre-Dame",
    date: "[DATE]",
    legende: "Détail de l'autel et de la croix liturgique",
  },
  {
    src: img7,
    alt: "Autel avec décorations rouges et vue architecturale",
    cat: "Décorations",
    date: "[DATE]",
    legende: "Architecture et décorations de l'autel",
  },
]

const categories = [
  "Toutes",
  "Célébrations",
  "Décorations",
  "Notre-Dame",
  "Vie paroissiale",
  "Événements",
]

export default function Galerie({ navigate: _navigate }: Props) {
  const [activeCat, setActiveCat] = useState("Toutes")
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = photos.filter(
    (p) => activeCat === "Toutes" || p.cat === activeCat,
  )

  const prev = () => {
    if (lightbox === null) return
    setLightbox((lightbox - 1 + filtered.length) % filtered.length)
  }
  const next = () => {
    if (lightbox === null) return
    setLightbox((lightbox + 1) % filtered.length)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-gold/8 to-transparent" />
        </div>
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold block mb-4">
            Photographie
          </span>
          <h1 className="font-serif text-ivory text-[44px] md:text-[60px] font-semibold leading-tight mb-4">
            La paroisse en images
          </h1>
          <p className="text-ivory/60 text-lg max-w-[500px]">
            Découvrez la beauté de notre église et la chaleur de notre
            communauté à travers ces photographies.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="bg-paper border-b border-gold/20 sticky top-16 md:top-20 z-20">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20 py-4">
          <div
            className="flex gap-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeCat === cat
                    ? "bg-burgundy text-ivory"
                    : "text-warm-gray hover:text-charcoal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry gallery */}
      <section className="section-padding bg-ivory">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-20">
          {/* Masonry using columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filtered.map((photo, i) => (
              <div
                key={i}
                className="break-inside-avoid mb-4 group overflow-hidden cursor-pointer relative"
                onClick={() => setLightbox(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-gold">
                    {photo.cat}
                  </span>
                  <p className="text-ivory text-sm">{photo.legende}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-warm-gray">
              <p className="font-serif text-2xl">
                Aucune photo dans cette catégorie
              </p>
            </div>
          )}

          <p className="text-center text-warm-gray/60 text-sm mt-8">
            Photos soumises à l'autorisation de publication · [AUTORISATION À
            CONFIRMER]
          </p>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/97 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="absolute top-0 right-0 -translate-y-10 text-ivory/70 hover:text-ivory transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Fermer"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              className="max-h-[70vh] max-w-full object-contain"
            />

            <div className="mt-4 text-center">
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold">
                {filtered[lightbox].cat}
              </span>
              <p className="text-ivory text-sm mt-1">
                {filtered[lightbox].legende}
              </p>
              <p className="text-ivory/40 text-xs mt-1">
                {filtered[lightbox].date}
              </p>
            </div>

            {/* Navigation */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-14">
              <button
                className="w-10 h-10 bg-ivory/10 hover:bg-ivory/20 flex items-center justify-center text-ivory transition-colors"
                onClick={prev}
                aria-label="Précédente"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-14">
              <button
                className="w-10 h-10 bg-ivory/10 hover:bg-ivory/20 flex items-center justify-center text-ivory transition-colors"
                onClick={next}
                aria-label="Suivante"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <p className="absolute -bottom-8 text-ivory/30 text-xs">
              {lightbox + 1} / {filtered.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
