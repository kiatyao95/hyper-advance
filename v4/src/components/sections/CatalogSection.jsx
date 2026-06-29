import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { projectSlug } from '../../utils/projectSlug';
import { uniqueProjectsBySite } from '../../utils/uniqueProjects';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { publicPath } from '../../utils/publicPath';

const OFFER_TO_SYSTEM_IDS = {
  'nurse-call-system': ['nurse-call'],
  intercom: ['av-intercom', 'building-intercom'],
  'public-address': ['public-address'],
  smatv: ['smatv'],
  'lighting-control': ['lighting-control'],
  'fireman-intercom': ['fireman-intercom'],
  'digital-call': ['digital-call'],
  'master-clock': ['master-clock'],
  'image-speak-through': ['image-speak-through'],
  conference: ['conference'],
  'panic-button': ['panic-button'],
  'intruder-alarm': ['intruder-alarm'],
  'card-access': ['card-access'],
  cctv: ['cctv'],
  'audio-visual-system': ['audio-visual-system'],
  'ot-tie-line': ['ot-tie-line'],
};

function projectMatchesOffer(project, systemIds) {
  const ids = [project.systemId, ...(project.additionalSystems || [])].filter(Boolean);
  return systemIds.some((sid) => ids.includes(sid));
}

function resolveOfferProjectSlugs(offer, allProjects) {
  const curated = offer.projectSlugs || [];
  if (curated.length > 0) return curated;

  const systemIds = OFFER_TO_SYSTEM_IDS[offer.id] || [offer.id];
  const matched = allProjects.filter((project) => projectMatchesOffer(project, systemIds));
  return uniqueProjectsBySite(matched)
    .map((project) => project.slug || projectSlug(project.name))
    .slice(0, 5);
}

export default function CatalogSection() {
  const { data, loading, getProjectBySlug } = useCatalog();

  const allProjects = useMemo(
    () => [...(data?.projects || []), ...(data?.haMeditech?.projects || [])],
    [data],
  );

  const offers = useMemo(() => {
    if (!data?.systemsWeOffer) return [];
    return data.systemsWeOffer.map((offer) => ({
      ...offer,
      resolvedProjectSlugs: resolveOfferProjectSlugs(offer, allProjects),
    }));
  }, [data?.systemsWeOffer, allProjects]);

  if (loading || !data) return null;

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
              {offer.resolvedProjectSlugs.length > 0 && (
                <div className="systems-offer-projects">
                  <span className="systems-offer-projects-label">Project references</span>
                  <div className="systems-offer-project-links">
                    {offer.resolvedProjectSlugs.map((slug) => {
                      const project = getProjectBySlug(slug);
                      return (
                        <Link key={slug} to={`/project/${slug}`}>
                          {project?.name || slug}
                        </Link>
                      );
                    })}
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
