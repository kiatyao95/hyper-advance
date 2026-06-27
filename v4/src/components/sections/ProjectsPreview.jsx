import { useMemo } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import ProjectCard from '../catalog/ProjectCard';
import Button from '../ui/Button';
import Reveal, { RevealItem } from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { useCounter } from '../../hooks/useCounter';

function Stat({ id, target, label }) {
  const { ref, display } = useCounter(target, '');
  return (
    <RevealItem>
      <div className="proj-stat">
        <div className="proj-stat-num" id={id} ref={ref}>{display}</div>
        <div className="proj-stat-lbl">{label}</div>
      </div>
    </RevealItem>
  );
}

export default function ProjectsPreview() {
  const { data, loading, uniqueProjects, getDistributor } = useCatalog();

  const shown = useMemo(() => {
    const featured = uniqueProjects.filter((p) => p.featured).slice(0, 8);
    return featured.length >= 6 ? featured : uniqueProjects.slice(0, 8);
  }, [uniqueProjects]);

  if (loading || !data) return null;

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="06 — Portfolio"
          title="Our Projects"
          desc="Browse selected ELV project references — intercom, nurse call, PA system, CCTV, card access, and more across Malaysia."
        />

        <Reveal className="proj-stats" stagger>
          <Stat id="pstat1" target={uniqueProjects.length} label="Unique Sites" />
          <Stat id="pstat2" target={data.systems.length} label="ELV Systems" />
          <Stat id="pstat3" target={data.distributors.length} label="Distributors" />
          <Stat id="pstat4" target={data.company?.yearsExperience ?? 31} label="Years Track Record" />
        </Reveal>

        <div className="projects-grid">
          {shown.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              distributor={getDistributor(p.distributorId)}
              hero={p.featured}
              delay={Math.min(i, 3) * 0.1}
            />
          ))}
        </div>

        <div className="proj-actions">
          <Button to="/projects"><i className="fa-solid fa-folder-open" /> View Full Portfolio</Button>
        </div>
      </div>
    </section>
  );
}
