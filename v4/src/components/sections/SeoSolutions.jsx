import { Link } from 'react-router-dom';
import { SOLUTION_GROUPS } from '../../seo/seoConfig';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

export default function SeoSolutions() {
  return (
    <section id="elv-solutions" className="section seo-solutions-section" aria-label="ELV systems and services in Malaysia">
      <div className="container">
        <SectionHeader
          eyebrow="Complete ELV Coverage"
          title="Extra Low Voltage Systems We Supply & Maintain"
          desc="Hyper Advance is a full-service ELV contractor in Malaysia — from CCTV and card access to nurse call, intercom, PA system, SMATV, lighting control, AV, and hospital IPS."
        />

        <div className="seo-solutions-grid">
          {SOLUTION_GROUPS.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.04} className="seo-solutions-card">
              <h3>{group.title}</h3>
              <p className="seo-solutions-keywords">{group.keywords.join(' · ')}</p>
              <p className="seo-solutions-brands"><i className="fa-solid fa-tags" /> {group.brands}</p>
              <div className="seo-solutions-links">
                {group.href ? (
                  <Link to={group.href}>Learn more</Link>
                ) : (
                  group.systemIds.map((id) => (
                    <Link key={id} to={`/system/${id}`}>
                      {id.replace(/-/g, ' ')}
                    </Link>
                  ))
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
