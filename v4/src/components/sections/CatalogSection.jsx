import { useCatalog } from '../../context/CatalogContext';
import DistributorCard from '../catalog/DistributorCard';
import SystemCard from '../catalog/SystemCard';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

export default function CatalogSection() {
  const { data, loading } = useCatalog();

  if (loading || !data) return null;

  return (
    <section id="catalog" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="03 — Systems & Brands"
          title="Our Systems & Distributors"
          desc="Eight ELV systems — each with one authorised distributor. Select any card for full specifications, products, and project references."
        />

        <Reveal className="catalog-block" id="systems-list">
          <h3 className="catalog-block-title"><i className="fa-solid fa-layer-group" /> Systems</h3>
          <div className="catalog-grid">
            {data.systems.map((sys, i) => {
              const dist = data.distributors.find((d) => d.id === sys.distributorId);
              const projCount = data.projects.filter((p) => p.systemId === sys.id).length;
              return (
                <SystemCard
                  key={sys.id}
                  system={sys}
                  distributor={dist}
                  projectCount={projCount}
                  delay={i * 0.05}
                />
              );
            })}
          </div>
        </Reveal>

        <Reveal className="catalog-block" delay={0.1} id="distributors-list">
          <h3 className="catalog-block-title"><i className="fa-solid fa-building" /> Distributors</h3>
          <div className="catalog-grid">
            {data.distributors.map((dist, i) => {
              const sys = data.systems.find((s) => s.id === dist.systemId);
              return (
                <DistributorCard
                  key={dist.id}
                  distributor={dist}
                  system={sys}
                  delay={i * 0.05}
                />
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
