import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import ProjectListPaginated from '../components/catalog/ProjectListPaginated';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import { publicPath } from '../utils/publicPath';

export default function DistributorDetailPage() {
  const { id } = useParams();
  const { data, getDistributor, getSystem, getProjectsForDistributor, loading } = useCatalog();
  const dist = getDistributor(id);
  const sys = dist
    ? getSystem(dist.systemId) || data?.systems.find((s) => s.distributorId === dist.id) || null
    : null;
  const projects = dist ? getProjectsForDistributor(dist.id) : [];
  const refDocs = (data?.referenceDocuments || []).filter((d) => d.distributorId === id);

  if (loading) return <div className="container" style={{ padding: '8rem 0' }}>Loading…</div>;

  if (!dist) {
    return (
      <>
        <Navbar activeKey="distributors" />
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
          <h2>Distributor not found</h2>
          <Button to="/distributors" style={{ marginTop: '1rem' }}>Back to Distributors</Button>
        </div>
        <Footer minimal />
      </>
    );
  }

  return (
    <>
      <Navbar activeKey="distributors" />
      <div className="detail-hero">
        <div className="container">
          <Link to="/distributors" className="breadcrumb"><i className="fa-solid fa-arrow-left" /> All Distributors</Link>
          <Reveal className="detail-hero-grid">
            <div>
              <img src={publicPath(dist.logo)} alt={dist.name} className="detail-dist-logo" />
              <span className="detail-eyebrow">{dist.country} · Since {dist.since}</span>
              <h1>{dist.fullName}</h1>
              <p className="detail-lead">{dist.description}</p>
              {dist.mergerNote && (
                <p className="detail-note"><i className="fa-solid fa-circle-info" /> {dist.mergerNote}</p>
              )}
              {dist.legacyImage && (
                <img src={publicPath(dist.legacyImage)} alt="Ikusi SMATV systems" className="detail-legacy-image" />
              )}
              <div className="detail-actions">
                {sys && (
                  <Button to={`/system/${sys.id}`}>
                    <i className="fa-solid fa-layer-group" /> Related System — {sys.name}
                  </Button>
                )}
                {dist.website && (
                  <Button href={dist.website} variant="ghost">
                    <i className="fa-solid fa-external-link" /> Official Website
                  </Button>
                )}
                {refDocs.map((doc) => (
                  <Button key={doc.url} href={doc.url} variant="ghost">
                    <i className="fa-solid fa-file-pdf" /> {doc.label}
                  </Button>
                ))}
              </div>
            </div>
            {sys && (
              <div className="detail-side-card">
                <div className="detail-side-icon"><i className={`fa-solid ${sys.icon}`} /></div>
                <h4>Linked System</h4>
                <p><strong>{sys.name}</strong></p>
                <p className="detail-side-note">Each distributor maps to exactly one ELV system. Click above to view full system specifications and project references.</p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
      <div className="container detail-content">
        <Reveal className="detail-panel">
          <h2><i className="fa-solid fa-box" /> Product Range</h2>
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
        <Reveal className="detail-panel">
          <h2><i className="fa-solid fa-folder-open" /> Project References ({projects.length})</h2>
          <ProjectListPaginated
            projects={projects}
            renderCard={(p) => (
              <Link key={p.id} to={`/project/${p.slug || p.id}`} className="ref-card ref-card-link">
                <img src={publicPath(p.image)} alt={p.name} loading="lazy" />
                <div className="ref-card-body">
                  <h4>{p.name}</h4>
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
              </Link>
            )}
          />
        </Reveal>
      </div>
      <Footer minimal />
    </>
  );
}
