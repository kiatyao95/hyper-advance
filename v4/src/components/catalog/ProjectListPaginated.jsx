import { useMemo, useState } from 'react';

const PAGE_SIZE = 24;

export default function ProjectListPaginated({ projects, renderCard, pageSize = PAGE_SIZE }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const hay = [p.name, p.model, p.location, p.sector, p.tag, p.completionDate]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [projects, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const go = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="proj-list-paginated">
      <div className="proj-list-toolbar">
        <input
          type="search"
          className="proj-search"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <span className="proj-count">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span>
      </div>

      <div className="ref-grid">
        {slice.map((p) => renderCard(p))}
      </div>

      {totalPages > 1 && (
        <div className="proj-pagination">
          <button type="button" className="proj-page-btn" disabled={safePage <= 1} onClick={() => go(safePage - 1)}>
            <i className="fa-solid fa-chevron-left" /> Prev
          </button>
          <span className="proj-page-info">Page {safePage} of {totalPages}</span>
          <button type="button" className="proj-page-btn" disabled={safePage >= totalPages} onClick={() => go(safePage + 1)}>
            Next <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
}
