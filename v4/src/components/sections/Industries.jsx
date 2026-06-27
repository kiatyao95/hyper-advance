import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import Reveal, { RevealItem } from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

const TABS = [
  { id: 'healthcare', icon: 'fa-hospital', label: 'Healthcare' },
  { id: 'hospitality', icon: 'fa-hotel', label: 'Hospitality' },
  { id: 'commercial', icon: 'fa-building', label: 'Commercial' },
  { id: 'residential', icon: 'fa-house-chimney', label: 'Residential' },
];

const PANELS = {
  healthcare: {
    title: 'Healthcare Environments',
    desc: 'Through our specialist division HA Meditech Sdn Bhd for IPS systems, and Hyper Advance for broader hospital ELV — we deliver life-critical infrastructure with the highest standards of safety and reliability.',
    services: [
      'Nurse Call & Clinical Communication', 'Isolated Power Supply (IPS) for OTs',
      'Audio Visual & OT Tie Line for teaching', 'Intercom & Image Speak Through',
      'Digital Call', 'SMATV', 'Intruder Alarm for drug stores',
      'Master Clock for Operation Theatres', 'Public Address & Emergency PA',
      'Fireman Intercom Systems', 'CCTV & Access Control',
    ],
  },
  hospitality: {
    title: 'Hospitality Environments',
    desc: 'From 5-star hotels to convention centres and resorts — we deliver bespoke ELV solutions that enhance the guest experience through intelligent room management, lighting automation, and seamless AV infrastructure.',
    services: [
      'Lighting Control & Scene Management', 'SMATV for In-Room Entertainment',
      'Public Address & Background Music', 'Audio Visual & Conference Systems', 'CCTV & Security Systems',
    ],
  },
  commercial: {
    title: 'Commercial Environments',
    desc: 'Shopping malls, office towers, universities, and government buildings — we provide comprehensive ELV integration tailored to the operational needs of every commercial environment in Malaysia.',
    services: [
      'Public Address & Emergency PA', 'Card Access & Security Systems',
      'Lighting Control & Energy Management', 'Audio Visual & Digital Signage',
      'Fireman Intercom & CCTV', 'Master Clock Systems',
    ],
  },
  residential: {
    title: 'Residential Environments',
    desc: 'From luxury condominiums to gated communities — we deliver seamless communication, security, SMATV, and intercom systems that elevate modern residential living.',
    services: [
      'Audio & Video Intercom Entry', 'SMATV Entertainment Distribution',
      'Card Access & Perimeter Security',
      'Lighting Control & Dimming', 'CCTV & Surveillance',
    ],
  },
};

export default function Industries() {
  const [active, setActive] = useState('healthcare');
  const { getIndustryProjects, getSystem, getDistributor } = useCatalog();
  const panel = PANELS[active];
  const projects = getIndustryProjects(active);

  return (
    <section id="industries" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="05 — Sectors"
          title="Industries We Serve"
          desc="Tailored ELV integration for the environments where precision and reliability matter most."
        />

        <Reveal className="ind-tabs" stagger>
          {TABS.map((tab) => (
            <RevealItem key={tab.id}>
              <button
                type="button"
                className={`ind-tab${active === tab.id ? ' active' : ''}`}
                onClick={() => setActive(tab.id)}
                style={{ position: 'relative' }}
              >
                {active === tab.id && (
                  <motion.span
                    layoutId="ind-tab-indicator"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: 'var(--radius)',
                      border: '2px solid var(--teal)', background: 'var(--teal)', zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <i className={`fa-solid ${tab.icon}`} /> {tab.label}
              </button>
            </RevealItem>
          ))}
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="ind-panel active"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ind-panel-text">
              <h3>{panel.title}</h3>
              <p>{panel.desc}</p>
              <ul className="ind-services">
                {panel.services.map((s) => (
                  <li key={s}><i className="fa-solid fa-check" /> {s}</li>
                ))}
              </ul>
              <div className="ind-projects-title">Notable {TABS.find((t) => t.id === active)?.label} Projects</div>
              <div className="ind-proj-grid">
                {projects.map((item) => (
                  <div key={item.name} className="ind-proj-item">
                    <div className="ind-proj-name">{item.name}</div>
                    <div className="ind-proj-links">
                      {item.links.map((link, i) => (
                        <span key={i}>
                          {i > 0 && <span className="ind-proj-sep">|</span>}
                          <Link to={`/system/${link.systemId}`} className="ind-proj-link">
                            {getSystem(link.systemId)?.shortName || ''}
                          </Link>
                          <span className="ind-proj-sep">·</span>
                          <Link to={`/distributor/${link.distributorId}`} className="ind-proj-link">
                            {getDistributor(link.distributorId)?.name || ''}
                          </Link>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
