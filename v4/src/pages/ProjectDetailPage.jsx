import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCatalog } from '../context/CatalogContext';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import ProjectMeta from '../components/catalog/ProjectMeta';
import { publicPath } from '../utils/publicPath';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { getProjectBySlug, getSystem, getDistributor, loading } = useCatalog();
  const project = getProjectBySlug(slug);
  const [activeImage, setActiveImage] = useState(0);

  const sys = project ? getSystem(project.systemId) : null;
  const dist = project ? getDistributor(project.distributorId) : null;

  const images = useMemo(() => {
    if (!project) return [];
    if (project.images?.length) return project.images;
    return project.image ? [project.image] : [];
  }, [project]);

  useEffect(() => {
    setActiveImage(0);
  }, [slug]);

  if (loading) return <div className="container" style={{ padding: '8rem 0' }}>Loading…</div>;

  if (!project) {
    return (
      <>
        <Navbar activeKey="projects" />
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
          <h2>Project not found</h2>
          <Button to="/projects" style={{ marginTop: '1rem' }}>Back to Projects</Button>
        </div>
        <Footer minimal />
      </>
    );
  }

  const hasGallery = images.length > 1;

  return (
    <>
      <Navbar activeKey="projects" />
      <div className="detail-hero detail-hero--project">
        <div className="container project-detail">
          <Link to="/projects" className="breadcrumb"><i className="fa-solid fa-arrow-left" /> All Projects</Link>

          <div className="project-detail-head">
            <span className="detail-eyebrow"><i className="fa-solid fa-building" /> {project.sector}</span>
            <h1>{project.name}</h1>
            <p className="detail-lead">
              {sys?.shortName || project.tag}
              {dist ? ` · ${dist.name}` : ''}
            </p>
            {project.systemsCovered?.length > 0 && (
              <p className="project-detail-seo">
                ELV systems at {project.name}: {project.systemsCovered.join(', ')}. Installed and maintained by Hyper Advance, Malaysia&apos;s ELV contractor.
              </p>
            )}
          </div>

          <div className="project-detail-gallery">
            <div className="project-detail-main">
              <motion.img
                key={images[activeImage]}
                src={publicPath(images[activeImage])}
                alt={project.name}
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            {hasGallery && (
              <div className="project-detail-thumbs">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    className={`project-detail-thumb${i === activeImage ? ' active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={publicPath(img)} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="project-detail-foot">
            <ProjectMeta project={project} />
            {project.location && (
              <p className="project-detail-location">
                <i className="fa-solid fa-location-dot" /> {project.location}
              </p>
            )}
            {project.additionalSystems?.length > 0 && (
              <div className="tag-row project-detail-tags">
                {project.additionalSystems.map((s) => (
                  <span key={s} className="tag">{s.replace(/-/g, ' ')}</span>
                ))}
              </div>
            )}
            <div className="detail-actions">
              {sys && (
                <Button to={`/system/${sys.id}`}>
                  <i className={`fa-solid ${sys.icon}`} /> View {sys.shortName}
                </Button>
              )}
              {dist && (
                <Button to={`/distributor/${dist.id}`} variant="ghost">
                  <i className="fa-solid fa-handshake" /> {dist.name}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer minimal />
    </>
  );
}
