import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { publicPath } from '../../utils/publicPath';

export default function KeyDistributorship() {
  const { data, loading } = useCatalog();

  if (loading || !data?.keyDistributorship) return null;

  const resolveBrand = (brandId) => data.distributors.find((d) => d.id === brandId);

  return (
    <section id="key-distributorship" className="section key-dist-section">
      <div className="container">
        <SectionHeader
          eyebrow="02 — Authorised Brands"
          title="Key Distributorship"
          desc="Hyper Advance is the authorised distributor for five core ELV system categories in Malaysia."
        />

        <Reveal className="key-dist-grid key-dist-grid--five">
          {data.keyDistributorship.map((card, i) => {
            const brands = card.brandIds.map(resolveBrand).filter(Boolean);
            return (
              <Reveal key={card.id} delay={i * 0.06} className="key-dist-card">
                <div className="key-dist-icon">
                  <i className={`fa-solid ${card.icon}`} />
                </div>
                <h3 className="key-dist-title">{card.title}</h3>
                <div className="key-dist-divider" />
                <div className="key-dist-logos">
                  {brands.map((brand) => (
                    <Link key={brand.id} to={`/distributor/${brand.id}`} className="key-dist-logo-link" title={brand.fullName}>
                      <img src={publicPath(brand.logo)} alt={brand.name} />
                    </Link>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
