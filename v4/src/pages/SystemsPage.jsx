import { useCatalog } from '../context/CatalogContext';
import SystemCard from '../components/catalog/SystemCard';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Reveal from '../components/ui/Reveal';

export default function SystemsPage() {
  const { data, loading } = useCatalog();

  if (loading || !data) return <div className="container" style={{ padding: '8rem 0' }}>Loading…</div>;

  return (
    <>
      <Navbar activeKey="systems" />
      <div className="page-hero">
        <Reveal className="container">
          <span className="page-eyebrow">ELV Systems</span>
          <h1>Systems We Integrate</h1>
          <p>Eight precision ELV system categories — each with a dedicated authorised distributor, deployed models, and verified project references across Malaysia.</p>
        </Reveal>
      </div>
      <div className="container">
        <div className="catalog-grid">
          {data.systems.map((sys, i) => {
            const dist = data.distributors.find((d) => d.id === sys.distributorId);
            const projCount = data.projects.filter((p) => p.systemId === sys.id).length;
            return (
              <SystemCard key={sys.id} system={sys} distributor={dist} projectCount={projCount} delay={i * 0.05} />
            );
          })}
        </div>
      </div>
      <Footer minimal />
    </>
  );
}
