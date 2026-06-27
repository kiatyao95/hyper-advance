const ROWS = [
  { icon: 'fa-microchip', label: 'Model', key: 'model', systems: ['nurse-call', 'av-intercom'] },
  { icon: 'fa-calendar-check', label: 'Completed', key: 'completionDate' },
];

export default function ProjectMeta({ project }) {
  return (
    <dl className="proj-meta">
      {ROWS.map((r) => {
        if (r.systems && !r.systems.includes(project.systemId)) return null;
        const val = project[r.key];
        if (!val) return null;
        return (
          <div key={r.key} className="proj-meta-row">
            <dt><i className={`fa-solid ${r.icon}`} /> {r.label}</dt>
            <dd>{val}</dd>
          </div>
        );
      })}
      {project.systemsCovered?.length > 0 && (
        <div className="proj-meta-systems">
          {project.systemsCovered.map((s) => (
            <span key={s} className="proj-meta-system-tag">{s}</span>
          ))}
        </div>
      )}
    </dl>
  );
}
