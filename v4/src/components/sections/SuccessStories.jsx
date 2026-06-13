import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

export default function SuccessStories() {
  const { data } = useCatalog();
  const stories = data?.company?.successStories;

  if (!stories?.length) return null;

  return (
    <section id="success-stories" className="section success-stories-section">
      <div className="container">
        <SectionHeader
          eyebrow="Highlight Projects"
          title="Success Stories"
          desc="Landmark deployments that define our track record."
          light
        />
        <div className="success-stories-grid">
          {stories.map((story, i) => (
            <Reveal key={story.name} delay={i * 0.08} className="success-story-card">
              <h4>{story.name}</h4>
              <p className="success-story-sys">{story.system}</p>
              <p className="success-story-detail">{story.detail}</p>
              <div className="success-story-meta">
                {story.contractAmount && <span><i className="fa-solid fa-file-contract" /> {story.contractAmount}</span>}
                {story.completionDate && <span><i className="fa-solid fa-calendar-check" /> {story.completionDate}</span>}
              </div>
              {story.systemId && (
                <Link to={`/system/${story.systemId}`} className="success-story-link">
                  View system <i className="fa-solid fa-arrow-right" />
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
