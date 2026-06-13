import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import ProjectListPaginated from '../components/catalog/ProjectListPaginated';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import { publicPath } from '../utils/publicPath';

export default function SystemDetailPage() {
  const { id } = useParams();
  const { getSystem, getDistributor, getProjectsForSystem, loading } = useCatalog();
  const sys = getSystem(id);
  const dist = sys ? getDistributor(sys.distributorId) : null;
  const projects = sys ? getProjectsForSystem(sys.id) : [];

  useEffect(() => {
    document.title = sys ? `${sys.name} | Hyper Advance` : 'System | Hyper Advance';
  }, [sys]);

  if (loading) return <div className="container" style={{ padding: '8rem 0' }}>Loading…</div>;

  if (!sys) {
    return (
      <>
        <Navbar activeKey="systems" />
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
          <h2>System not found</h2>
          <Button to="/systems" style={{ marginTop: '1rem' }}>Back to Systems</Button>
        </div>
        <Footer minimal />
      </>
    );
  }

  return (
    <>
      <Navbar activeKey="systems" />
      <div className="detail-hero">
        <div className="container">
          <Link to="/systems" className="breadcrumb"><i className="fa-solid fa-arrow-left" /> All Systems</Link>
          <Reveal className="detail-hero-grid">
            <div>
              <span className="detail-eyebrow"><i className={`fa-solid ${sys.icon}`} /> {sys.category}</span>
              <h1>{sys.name}</h1>
              <p className="detail-lead">{sys.description}</p>
              <div className="detail-actions">
                <Button to={`/distributor/${dist.id}`}>
                  <i className="fa-solid fa-building" /> View Distributor — {dist.name}
                </Button>
                {sys.sourceUrl && (
                  <Button href={sys.sourceUrl} variant="ghost">
                    <i className="fa-solid fa-external-link" /> Manufacturer Site
                  </Button>
                )}
              </div>
            </div>
            <div className="detail-side-card">
              <img src={publicPath(dist.logo)} alt={dist.name} />
              <h4>Authorised Distributor</h4>
              <p><strong>{dist.fullName}</strong></p>
              <p className="detail-side-note">1:1 system partnership — Hyper Advance is the sole authorised integrator for this system category in Malaysia.</p>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="container detail-content">
        <div className="detail-grid">
          <Reveal className="detail-panel">
            <h2><i className="fa-solid fa-tag" /> Brands &amp; Models</h2>
            <div className="tag-row">
              {sys.brands.map((b) => <span key={b} className="tag tag-brand">{b}</span>)}
            </div>
            <div className="model-list">
              {sys.models.map((m) => (
                <div key={m} className="model-item"><i className="fa-solid fa-microchip" /> {m}</div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="detail-panel">
            <h2><i className="fa-solid fa-handshake" /> Partners</h2>
            <p className="panel-note">Project partners — not distributors.</p>
            {sys.partners.map((p) => (
              <div key={p.name} className="partner-item">
                <strong>{p.name}</strong>
                <span>{p.role}</span>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal className="detail-panel">
          <h2><i className="fa-solid fa-folder-open" /> Project References ({projects.length})</h2>
          <p className="panel-note">Malaysia deployments with contract value, model, and completion date.</p>
          <ProjectListPaginated
            projects={projects}
            renderCard={(p) => (
              <div key={p.id} className="ref-card">
                <img src={publicPath(p.image)} alt={p.name} loading="lazy" />
                <div className="ref-card-body">
                  <h4>{p.name}</h4>
                  <span className="ref-sector">{p.sector}</span>
                  <dl className="ref-meta">
                    {p.contractAmount && (
                      <div className="ref-meta-row"><dt>Contract</dt><dd>{p.contractAmount}</dd></div>
                    )}
                    <div className="ref-meta-row"><dt>Model</dt><dd>{p.model || '—'}</dd></div>
                    {p.unitCount && (
                      <div className="ref-meta-row"><dt>Units</dt><dd>{p.unitCount}</dd></div>
                    )}
                    <div className="ref-meta-row"><dt>Completed</dt><dd>{p.completionDate || '—'}</dd></div>
                  </dl>
                </div>
              </div>
            )}
          />
        </Reveal>
        <Reveal className="detail-panel">
          <h2><i className="fa-solid fa-box" /> Products by {dist.name}</h2>
          <div className="product-table">
            {dist.products.map((pr) => (
              <div key={pr.name} className="product-row">
                <div className="product-row-name">{pr.name}</div>
                <div className="product-row-type">{pr.type}</div>
                <div className="product-row-desc">{pr.description}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <Footer minimal />
    </>
  );
}
