import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { publicPath } from '../../utils/publicPath';

export default function HaMeditech() {
  const { data, getDistributor } = useCatalog();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const meditech = data?.haMeditech;

  if (!meditech) return null;

  const projects = meditech.projects || [];
  const ipsSystem = meditech.systems?.[0];
  const dist = ipsSystem?.distributorId ? getDistributor(ipsSystem.distributorId) : null;

  return (
    <section id="ha-meditech" className="section ha-meditech-section">
      <div className="container">
        <SectionHeader
          eyebrow="Healthcare Division"
          title={meditech.title}
          desc={meditech.description}
        />

        <Reveal className="ha-meditech-intro">
          <div className="ha-meditech-card ha-meditech-card--inline">
            <div className="ha-meditech-card-head">
              {dist?.logo && (
                <img src={publicPath(dist.logo)} alt={dist.name} className="ha-meditech-logo" />
              )}
              <div>
                <h3>{ipsSystem?.name || 'Isolated Power Supply (IPS)'}</h3>
                <p className="ha-meditech-brands">{ipsSystem?.brands || 'Esa Grimma'}</p>
              </div>
            </div>
            <p>{ipsSystem?.description}</p>
            {dist && (
              <Link to={`/distributor/${dist.id}`} className="ha-meditech-link">
                View {dist.name} <i className="fa-solid fa-arrow-right" />
              </Link>
            )}
          </div>
        </Reveal>

        {projects.length > 0 && (
          <div className="ha-meditech-projects">
            <button
              type="button"
              className={`ha-meditech-projects-toggle${projectsOpen ? ' is-open' : ''}`}
              onClick={() => setProjectsOpen((open) => !open)}
              aria-expanded={projectsOpen}
            >
              <div className="ha-meditech-projects-header">
                <h3>HA Meditech Project References</h3>
                <p>All IPS installations by Esa Grimma · {projects.length} projects</p>
              </div>
              <i className={`fa-solid fa-chevron-${projectsOpen ? 'up' : 'down'}`} aria-hidden />
            </button>

            <AnimatePresence initial={false}>
              {projectsOpen && (
                <motion.div
                  className="ha-meditech-projects-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="ha-meditech-projects-grid">
                    {projects.map((project, i) => (
                      <Reveal key={project.id} delay={i * 0.03} className="ha-meditech-project-card">
                        <div className="ha-meditech-project-media">
                          <img src={publicPath(project.image)} alt={project.name} loading="lazy" />
                          <span className="ha-meditech-project-tag">IPS System · Esa Grimma</span>
                        </div>
                        <div className="ha-meditech-project-info">
                          <h4>{project.name}</h4>
                          {project.location && (
                            <p className="ha-meditech-project-loc">
                              <i className="fa-solid fa-location-dot" /> {project.location}
                            </p>
                          )}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
