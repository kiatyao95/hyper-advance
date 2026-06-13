import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { publicPath } from '../../utils/publicPath';

export default function OfficeGallery({ images = [], compact = false }) {
  const [current, setCurrent] = useState(0);
  const slides = images.map(publicPath);

  if (!slides.length) return null;

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className={`office-gallery${compact ? ' office-gallery--compact' : ''}`}>
      {!compact && (
        <>
          <h3 className="office-gallery-title">
            <i className="fa-solid fa-building" style={{ marginRight: '.5rem' }} />
            Our Office
          </h3>
          <p className="office-gallery-desc">BICMA, Petaling Jaya — where our engineering, design, and project teams collaborate.</p>
        </>
      )}

      <div className="office-gallery-main">
        <button type="button" className="office-gallery-nav office-gallery-nav--prev" onClick={prev} aria-label="Previous photo">
          <i className="fa-solid fa-chevron-left" />
        </button>

        <div className="office-gallery-viewport">
          <AnimatePresence mode="wait">
            <motion.img
              key={slides[current]}
              src={slides[current]}
              alt={`Hyper Advance office ${current + 1}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>
          <span className="office-gallery-counter">{current + 1} / {slides.length}</span>
        </div>

        <button type="button" className="office-gallery-nav office-gallery-nav--next" onClick={next} aria-label="Next photo">
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>

      {compact ? (
        <div className="office-gallery-dots">
          {slides.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`office-gallery-dot${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`View office photo ${i + 1}`}
            />
          ))}
        </div>
      ) : (
        <div className="office-gallery-thumbs">
          {slides.slice(0, 8).map((src, i) => (
            <button
              key={src}
              type="button"
              className={`office-gallery-thumb${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`View office photo ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
