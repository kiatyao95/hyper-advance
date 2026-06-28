import { useCatalog } from '../context/CatalogContext';
import DistributorCard from '../components/catalog/DistributorCard';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Reveal from '../components/ui/Reveal';

export default function DistributorsPage() {
  const { data, loading } = useCatalog();

  if (loading || !data) return <div className="container" style={{ padding: '8rem 0' }}>Loading…</div>;

  return (
    <>
      <Navbar activeKey="distributors" />
      <div className="page-hero">
        <Reveal className="container">
          <span className="page-eyebrow">Authorised Distributors</span>
          <h1>Brand Partners</h1>
          <p>Hyper Advance holds 1:1 authorised distributorship agreements for core ELV system categories in Malaysia.</p>
        </Reveal>
      </div>
      <div className="container">
        <div className="catalog-grid">
          {data.distributors.map((dist, i) => {
            const sys = data.systems.find((s) => s.distributorId === dist.id);
            const projCount = data.projects.filter((p) => p.distributorId === dist.id).length;
            return (
              <DistributorCard
                key={dist.id}
                distributor={dist}
                systemName={sys?.shortName}
                projectCount={projCount}
                delay={i * 0.05}
              />
            );
          })}
        </div>
      </div>
      <Footer minimal />
    </>
  );
}
