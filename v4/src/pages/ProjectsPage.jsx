import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import ProjectCard from '../components/catalog/ProjectCard';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Reveal from '../components/ui/Reveal';
import { motion } from 'motion/react';

const PAGE_SIZE = 24;

export default function ProjectsPage() {
  const { data, loading, uniqueProjects, getDistributor, getSystem } = useCatalog();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');

  const filters = useMemo(() => {
    if (!data) return [];
    return [{ id: 'all', label: 'All' }, ...data.systems.map((s) => ({ id: s.id, label: s.shortName }))];
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return uniqueProjects.filter((p) => {
      const matchFilter = filter === 'all' || p.systemId === filter;
      if (!matchFilter) return false;
      if (!q) return true;
      const hay = [p.name, p.model, p.location, p.sector, p.tag].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [uniqueProjects, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading) return <div className="container" style={{ padding: '8rem 0' }}>Loading…</div>;

  return (
    <>
      <Navbar activeKey="projects" />
      <div className="page-hero">
        <Reveal className="container">
          <span className="page-eyebrow">Portfolio</span>
          <h1>ELV Project References Malaysia</h1>
          <p>{uniqueProjects.length} ELV project references across Malaysia — intercom, nurse call, PA system, CCTV, card access, SMATV, lighting control, and audio visual installations.</p>
        </Reveal>
      </div>
      <div className="container">
        <Reveal className="proj-toolbar">
          <div className="proj-toolbar-top">
            <div className="proj-tabs">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`proj-tab${filter === f.id ? ' active' : ''}`}
                  onClick={() => { setFilter(f.id); setPage(1); }}
                  style={{ position: 'relative' }}
                >
                  {filter === f.id && (
                    <motion.span
                      layoutId="proj-tab-indicator"
                      style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'var(--teal)' }}
                    />
                  )}
                  {f.label}
                </button>
              ))}
            </div>
            <div className="proj-view-toggle">
              <button
                type="button"
                className={`proj-view-btn${view === 'grid' ? ' active' : ''}`}
                onClick={() => setView('grid')}
              >
                <i className="fa-solid fa-grip" /> Grid
              </button>
              <button
                type="button"
                className={`proj-view-btn${view === 'table' ? ' active' : ''}`}
                onClick={() => setView('table')}
              >
                <i className="fa-solid fa-table" /> Table
              </button>
            </div>
          </div>
          <div className="proj-toolbar-bottom">
            <input
              type="search"
              className="proj-search"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <span className="proj-count">{filtered.length} {filtered.length === 1 ? 'site' : 'sites'}</span>
          </div>
        </Reveal>

        {view === 'grid' ? (
          <div className="projects-grid">
            {paged.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                distributor={getDistributor(p.distributorId)}
                hero={p.featured && filter === 'all' && safePage === 1 && i < 2}
                delay={i * 0.04}
              />
            ))}
          </div>
        ) : (
          <div className="proj-table-wrap">
            <table className="proj-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Sector</th>
                  <th>Systems</th>
                  <th>Completed</th>
                  <th className="proj-table-right">Contract</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => {
                  const sys = getSystem(p.systemId);
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/project/${p.slug || p.id}`} className="proj-table-link">
                          {p.name}
                        </Link>
                      </td>
                      <td className="proj-table-muted">{p.sector || '—'}</td>
                      <td>
                        <div className="proj-table-tags">
                          {(p.systemsCovered || [sys?.shortName]).filter(Boolean).map((s) => (
                            <span key={s} className="tag tag-brand">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="proj-table-muted">{p.completionDate || '—'}</td>
                      <td className="proj-table-right proj-table-muted">{p.contractAmount || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="proj-pagination">
            <button type="button" className="proj-page-btn" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>
              <i className="fa-solid fa-chevron-left" /> Prev
            </button>
            <span className="proj-page-info">Page {safePage} of {totalPages}</span>
            <button type="button" className="proj-page-btn" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        )}
      </div>
      <Footer minimal />
    </>
  );
}
