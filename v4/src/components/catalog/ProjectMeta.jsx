const ROWS = [
  { icon: 'fa-file-contract', label: 'Contract', key: 'contractAmount' },
  { icon: 'fa-microchip', label: 'Model', key: 'model' },
  { icon: 'fa-door-open', label: 'Units', key: 'unitCount' },
  { icon: 'fa-calendar-check', label: 'Completed', key: 'completionDate' },
];

export default function ProjectMeta({ project }) {
  return (
    <dl className="proj-meta">
      {ROWS.map((r) => {
        const val = project[r.key];
        if (r.key === 'contractAmount' && !val) return null;
        if (r.key === 'unitCount' && !val) return null;
        return (
          <div key={r.key} className="proj-meta-row">
            <dt><i className={`fa-solid ${r.icon}`} /> {r.label}</dt>
            <dd>{val || '—'}</dd>
          </div>
        );
      })}
    </dl>
  );
}
