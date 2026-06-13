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
          <span className="page-eyebrow">Authorised Brands</span>
          <h1>Our Distributors</h1>
          <p>Each distributor has a 1:1 relationship with one ELV system. Click any brand to view its product range and linked system specifications.</p>
        </Reveal>
      </div>
      <div className="container">
        <div className="catalog-grid">
          {data.distributors.map((dist, i) => {
            const sys = data.systems.find((s) => s.id === dist.systemId);
            return <DistributorCard key={dist.id} distributor={dist} system={sys} delay={i * 0.05} />;
          })}
        </div>
      </div>
      <Footer minimal />
    </>
  );
}
