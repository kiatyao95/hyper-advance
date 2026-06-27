import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { publicPath } from '../../utils/publicPath';

function projectName(projects, slug) {
  return projects.find((p) => (p.slug || p.id) === slug)?.name || slug;
}

export default function CatalogSection() {
  const { data, loading } = useCatalog();

  if (loading || !data) return null;

  const offers = data.systemsWeOffer || [];

  return (
    <section id="catalog" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="03 — Systems & Brands"
          title="Systems We Offer & Brands We Work With"
          desc="ELV systems we integrate, the brands we supply, and selected project references from our portfolio."
        />

        <div className="systems-offer-list">
          {offers.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 0.04} className="systems-offer-card">
              <div className="systems-offer-head">
                <h3>{offer.name}</h3>
                <div className="systems-offer-brands-wrap">
                  {offer.brandLogos?.length > 0 && (
                    <div className="systems-offer-logos">
                      {offer.brandLogos.map((logo) => (
                        <img key={logo} src={publicPath(logo)} alt="" loading="lazy" />
                      ))}
                    </div>
                  )}
                  <p className="systems-offer-brands"><i className="fa-solid fa-tags" /> {offer.brands}</p>
                </div>
              </div>
              <p className="systems-offer-desc">{offer.description}</p>
              {offer.projectSlugs?.length > 0 && (
                <div className="systems-offer-projects">
                  <span className="systems-offer-projects-label">Project references</span>
                  <div className="systems-offer-project-links">
                    {offer.projectSlugs.map((slug) => (
                      <Link key={slug} to={`/project/${slug}`}>
                        {projectName(data.projects, slug)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
