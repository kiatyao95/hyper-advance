import { motion } from 'motion/react';
import { useCatalog } from '../../context/CatalogContext';
import Reveal, { RevealItem } from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

export default function Services() {
  const { data } = useCatalog();
  const capabilities = data?.serviceCapabilities || [];

  return (
    <section id="services" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="04 — What We Do"
          title="Our Services"
          desc="End-to-end ELV services from initial design through commissioning, maintenance, and user training."
          light
        />

        <Reveal className="service-cap-grid" stagger>
          {capabilities.map((cap) => (
            <RevealItem key={cap.id}>
              <motion.div className="service-cap-card" whileHover={{ y: -4 }}>
                <div className="service-cap-icon">
                  <i className={`fa-solid ${cap.icon}`} />
                </div>
                <h3>{cap.title}</h3>
                <p>{cap.description}</p>
              </motion.div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
