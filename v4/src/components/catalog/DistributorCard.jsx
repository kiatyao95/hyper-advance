import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { publicPath } from '../../utils/publicPath';

export default function DistributorCard({ distributor, systemName, projectCount, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
        <Link to={`/distributor/${distributor.id}`} className="cat-card">
          <div className="cat-card-logo">
            <img src={publicPath(distributor.logo)} alt={distributor.name} />
          </div>
          <div className="cat-card-body">
            <span className="cat-card-eyebrow">{distributor.country} · Est. {distributor.since}</span>
            <h3>{distributor.fullName || distributor.name}</h3>
            <p>{distributor.description.slice(0, 110)}…</p>
            <div className="cat-card-meta">
              {systemName && <span className="tag tag-brand">{systemName}</span>}
              <span><i className="fa-solid fa-folder-open" /> {projectCount} refs</span>
            </div>
          </div>
          <span className="cat-card-arrow"><i className="fa-solid fa-arrow-right" /></span>
        </Link>
      </motion.div>
    </Reveal>
  );
}
