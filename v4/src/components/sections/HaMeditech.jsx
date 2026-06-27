import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { publicPath } from '../../utils/publicPath';

export default function HaMeditech() {
  const { data, getDistributor } = useCatalog();
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
          <>
            <div className="ha-meditech-projects-header">
              <h3>HA Meditech Project References</h3>
              <p>All IPS installations by Esa Grimma</p>
            </div>
            <div className="ha-meditech-projects-grid">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.05} className="ha-meditech-project-card">
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
          </>
        )}
      </div>
    </section>
  );
}
