import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { HeroHighlight, Highlight } from '../21st/HeroHighlight';
import RotatingWords from '../21st/RotatingWords';
import Button from '../ui/Button';
import { useCounter } from '../../hooks/useCounter';

const SLIDES = [
  'https://www.hyper-advance.com/assets/img/slider/Lutron.jpg',
  'https://www.hyper-advance.com/assets/img/slider/AJB.png',
  'https://www.hyper-advance.com/assets/img/slider/Aiphone.jpg',
  'https://www.hyper-advance.com/assets/img/slider/Austco.jpg',
  'https://www.hyper-advance.com/assets/img/slider/Ikusi.jpg',
  'https://www.hyper-advance.com/assets/img/slider/Amperes.jpg',
  'https://www.hyper-advance.com/assets/img/slider/NTS.jpg',
];

const SECTORS = ['Healthcare', 'Hospitality', 'Commercial', 'Residential'];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

function StatCounter({ target, suffix, label }) {
  const { ref, display } = useCounter(target, suffix);
  return (
    <motion.div className="hero-stat" variants={item}>
      <div className="hero-stat-num" ref={ref} dangerouslySetInnerHTML={{ __html: display }} />
      <div className="hero-stat-lbl" dangerouslySetInnerHTML={{ __html: label }} />
    </motion.div>
  );
}

export default function Hero() {
  const { data } = useCatalog();
  const [current, setCurrent] = useState(0);

  const years = data?.company?.yearsExperience ?? 31;
  const systemCount = data?.systems?.length ?? 8;
  const brandCount = data?.distributors?.length ?? 8;

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
              Est. 1995 · Petaling Jaya, Malaysia
            </motion.div>
            <motion.p className="hero-sector-line" variants={item}>
              Precision ELV for <RotatingWords words={SECTORS} />
            </motion.p>
            <motion.h1 className="hero-title" variants={item}>
              Precision ELV<br /><Highlight>for Extraordinary</Highlight><br />Environments
            </motion.h1>
            <motion.p className="hero-sub" variants={item}>
              Malaysia&apos;s trusted system integrator — engineering nurse call, intercom, lighting, and building intelligence for the nation&apos;s most demanding developments.
            </motion.p>
            <motion.div className="hero-btns" variants={item}>
              <Button href="#services"><i className="fa-solid fa-layer-group" /> Our Services</Button>
              <Button href="#projects" variant="outline-white"><i className="fa-solid fa-building" /> Our Projects</Button>
            </motion.div>
          </motion.div>
        </HeroHighlight>

        <motion.div className="hero-side" variants={container} initial="hidden" animate="show">
          <StatCounter target={years} suffix="<span>+</span>" label="Years of<br>Experience" />
          <StatCounter target={data?.company?.staffCount ?? 50} suffix="<span>+</span>" label="Team<br>Members" />
          <motion.div className="hero-stat" variants={item}>
            <div className="hero-stat-num">{brandCount}</div>
            <div className="hero-stat-lbl">Authorised<br />Brands</div>
          </motion.div>
          <motion.div className="hero-stat" variants={item}>
            <div className="hero-stat-num">{systemCount}</div>
            <div className="hero-stat-lbl">ELV<br />Systems</div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95 }}
      >
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
