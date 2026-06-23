import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { publicPath } from '../../utils/publicPath';

export default function HaMeditech() {
  const { data, getDistributor } = useCatalog();
  const meditech = data?.haMeditech;

  if (!meditech) return null;

  return (
    <section id="ha-meditech" className="section ha-meditech-section">
      <div className="container">
        <SectionHeader
          eyebrow="Healthcare Division"
          title={meditech.title}
          desc={meditech.description}
        />

        <div className="ha-meditech-grid">
          {meditech.systems.map((sys, i) => {
            const dist = sys.distributorId ? getDistributor(sys.distributorId) : null;
            return (
              <Reveal key={sys.name} delay={i * 0.08} className="ha-meditech-card">
                <div className="ha-meditech-card-head">
                  {dist?.logo && (
                    <img src={publicPath(dist.logo)} alt={dist.name} className="ha-meditech-logo" />
                  )}
                  <div>
                    <h3>{sys.name}</h3>
                    <p className="ha-meditech-brands">{sys.brands}</p>
                  </div>
                </div>
                <p>{sys.description}</p>
                {dist && (
                  <Link to={`/distributor/${dist.id}`} className="ha-meditech-link">
                    View {dist.name} <i className="fa-solid fa-arrow-right" />
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
