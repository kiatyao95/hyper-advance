import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

export default function SystemCard({ system, distributor, projectCount, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
        <Link to={`/system/${system.id}`} className="cat-card">
          <div className="cat-card-icon">
            <i className={`fa-solid ${system.icon}`} />
          </div>
          <div className="cat-card-body">
            <span className="cat-card-eyebrow">{system.category}</span>
            <h3>{system.name}</h3>
            <p>{system.description.slice(0, 120)}…</p>
            <div className="cat-card-meta">
              <span><i className="fa-solid fa-building" /> {distributor?.name || ''}</span>
              <span><i className="fa-solid fa-folder-open" /> {projectCount} refs</span>
            </div>
          </div>
          <span className="cat-card-arrow"><i className="fa-solid fa-arrow-right" /></span>
        </Link>
      </motion.div>
    </Reveal>
  );
}
