import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Card3D from '../21st/Card3D';
import Reveal from '../ui/Reveal';
import ProjectMeta from './ProjectMeta';
import { publicPath } from '../../utils/publicPath';

export default function ProjectCard({ project, distributor, hero = false, delay = 0 }) {
  return (
    <Reveal delay={delay} className={`proj-card${hero ? ' proj-card--hero' : ''}`}>
      <Card3D>
        <motion.article layout whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
          <Link to={`/project/${project.slug || project.id}`} className="proj-card-link">
          <div className="proj-card-media">
            <motion.img
              src={publicPath(project.image)}
              alt={project.name}
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="proj-card-tag">{project.tag}</span>
          </div>
          <div className="proj-card-info">
            <h3 className="proj-card-title">{project.name}</h3>
            <p className="proj-card-sys">{distributor?.name || ''}</p>
            <ProjectMeta project={project} />
            <motion.span
              className="proj-card-arrow"
              whileHover={{ backgroundColor: 'var(--teal)', borderColor: 'var(--teal)', color: '#fff' }}
            >
              <i className="fa-solid fa-arrow-right" />
            </motion.span>
          </div>
          </Link>
        </motion.article>
      </Card3D>
    </Reveal>
  );
}
