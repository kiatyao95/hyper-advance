import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { projectSlug } from '../../utils/projectSlug';
import { publicPath } from '../../utils/publicPath';
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
      'Nurse Call', 'Intercom', 'Public Address', 'SMATV', 'Card Access', 'CCTV',
      'Audio Visual', 'OT Tie Line', 'Digital Call', 'Master Clock', 'Fireman Intercom',
      'Intruder Alarm', 'Image Speak Through',
    ],
  },
  hospitality: {
    title: 'Hospitality Environments',
    desc: 'From 5-star hotels to convention centres and resorts — we deliver bespoke ELV solutions that enhance the guest experience through intelligent room management, lighting automation, and seamless AV infrastructure.',
    services: [
      'Lighting Control', 'SMATV', 'Public Address', 'Audio Visual', 'CCTV',
    ],
  },
  commercial: {
    title: 'Commercial Environments',
    desc: 'Shopping malls, office towers, universities, and government buildings — we provide comprehensive ELV integration tailored to the operational needs of every commercial environment in Malaysia.',
    services: [
      'Public Address', 'Card Access', 'Lighting Control', 'Audio Visual',
      'Fireman Intercom', 'CCTV', 'Master Clock',
    ],
  },
  residential: {
    title: 'Residential Environments',
    desc: 'From luxury condominiums to gated communities — we deliver seamless communication, security, SMATV, and intercom systems that elevate modern residential living.',
    services: [
      'Intercom', 'SMATV', 'Card Access', 'Lighting Control', 'CCTV',
    ],
  },
};

export default function Industries() {
  const [active, setActive] = useState('healthcare');
  const { getIndustryProjects, getSystem, getDistributor, uniqueProjects } = useCatalog();
  const panel = PANELS[active];
  const projects = getIndustryProjects(active);

  const slugByName = useMemo(() => {
    const map = new Map();
    uniqueProjects.forEach((p) => map.set(p.name, p.slug || projectSlug(p.name)));
    return map;
  }, [uniqueProjects]);

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
              <div className="ind-services ind-services--pills">
                {panel.services.map((s) => (
                  <span key={s} className="ind-service-pill">{s}</span>
                ))}
              </div>
              <div className="ind-projects-title">Notable {TABS.find((t) => t.id === active)?.label} Projects</div>
              <div className="ind-proj-grid">
                {projects.map((item) => {
                  const slug = slugByName.get(item.name) || projectSlug(item.name);
                  return (
                    <div key={item.name} className="ind-proj-item">
                      <Link to={`/project/${slug}`} className="ind-proj-name">
                        {item.name}
                      </Link>
                      <div className="ind-proj-models">
                        {item.links.map((link, i) => {
                          const system = getSystem(link.systemId);
                          const distributor = getDistributor(link.distributorId);
                          if (!system || !distributor) return null;
                          return (
                            <div key={`${link.systemId}-${link.distributorId}-${i}`} className="ind-model-chip">
                              <Link to={`/system/${link.systemId}`} className="ind-model-chip__system">
                                <i className={`fa-solid ${system.icon || 'fa-layer-group'}`} />
                                {system.shortName}
                              </Link>
                              <Link to={`/distributor/${link.distributorId}`} className="ind-model-chip__brand">
                                <img src={publicPath(distributor.logo)} alt="" loading="lazy" />
                                {distributor.name}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
