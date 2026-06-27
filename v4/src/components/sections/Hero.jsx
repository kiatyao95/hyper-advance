import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { HeroHighlight, Highlight } from '../21st/HeroHighlight';
import Button from '../ui/Button';
import ClientLogos from './ClientLogos';
import { publicPath } from '../../utils/publicPath';

const SLIDES = [
  'https://www.hyper-advance.com/assets/img/slider/Lutron.jpg',
  'https://www.hyper-advance.com/assets/img/slider/Aiphone.jpg',
  'https://www.hyper-advance.com/assets/img/slider/Austco.jpg',
  'https://www.hyper-advance.com/assets/img/slider/Amperes.jpg',
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const { data, getDistributor } = useCatalog();
  const [current, setCurrent] = useState(0);

  const company = data?.company;
  const brandIds = data?.authorizedBrandIds || [];

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero">
      <div className="hero-slides">
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            className="hero-slide active"
            style={{ backgroundImage: `url('${SLIDES[current]}')` }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 2 }, scale: { duration: 10, ease: 'easeOut' } }}
          />
        </AnimatePresence>
      </div>
      <div className="hero-grid-overlay" />

      <div className="hero-content container">
        <HeroHighlight className="hero-main">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div className="hero-eyebrow" variants={item}>
              <motion.span
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }}
                animate={{ boxShadow: ['0 0 8px var(--teal-glow)', '0 0 18px var(--teal-glow)', '0 0 8px var(--teal-glow)'] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
              Authorised ELV Distributor · Est. {company?.founded ?? 1995}
            </motion.div>
            <motion.h1 className="hero-title" variants={item}>
              Malaysia&apos;s Leading<br /><Highlight>ELV Contractor</Highlight> &amp;<br />Authorised Distributor
            </motion.h1>
            <motion.p className="hero-sub" variants={item}>
              Extra low voltage (ELV) specialist since 1995 — CCTV, card access, Aiphone intercom, Austco nurse call, Amperes PA system, Lutron lighting control, Fagor SMATV, AV systems, and ELV maintenance across Malaysia.
            </motion.p>

            {brandIds.length > 0 && (
              <motion.div className="hero-brands" variants={item}>
                <span className="hero-brands-label">Authorised distributor for</span>
                <div className="hero-brands-row">
                  {brandIds.map((id) => {
                    const brand = getDistributor(id);
                    if (!brand) return null;
                    return (
                      <Link key={id} to={`/distributor/${id}`} className="hero-brand-link" title={brand.fullName}>
                        <img src={publicPath(brand.logo)} alt={brand.name} />
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <motion.div variants={item}>
              <ClientLogos compact />
            </motion.div>

            <motion.div className="hero-btns" variants={item}>
              <Button href="#services"><i className="fa-solid fa-layer-group" /> Our Services</Button>
              <Button href="#projects" variant="outline-white"><i className="fa-solid fa-building" /> Our Projects</Button>
            </motion.div>
          </motion.div>
        </HeroHighlight>

        <motion.div className="hero-side" variants={container} initial="hidden" animate="show">
          <motion.div className="hero-stat" variants={item}>
            <div className="hero-stat-num">{company?.staffCount ?? 30}<span>+</span></div>
            <div className="hero-stat-lbl">Team<br />Members</div>
          </motion.div>
          <motion.div className="hero-stat" variants={item}>
            <div className="hero-stat-num">{company?.systemsOffered ?? 10}<span>+</span></div>
            <div className="hero-stat-lbl">ELV<br />Systems</div>
          </motion.div>
          <motion.div className="hero-stat" variants={item}>
            <div className="hero-stat-num">{company?.founded ?? 1995}</div>
            <div className="hero-stat-lbl">Established<br />Since</div>
          </motion.div>
          <motion.div className="hero-stat" variants={item}>
            <div className="hero-stat-num">{company?.authorizedBrandCount ?? 5}<span>+</span></div>
            <div className="hero-stat-lbl">Authorised<br />Brands</div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="hero-scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
        Scroll
      </motion.div>

      <motion.div className="hero-dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
        {SLIDES.map((_, i) => (
          <motion.button
            key={i}
            type="button"
            className={`hero-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            animate={{ height: i === current ? 32 : 20, backgroundColor: i === current ? 'var(--teal)' : 'var(--border-standard)' }}
          />
        ))}
      </motion.div>
    </section>
  );
}
