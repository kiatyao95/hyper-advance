import { motion } from 'motion/react';
import { useCatalog } from '../../context/CatalogContext';
import Card3D from '../21st/Card3D';
import Reveal, { RevealItem } from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

const CATEGORIES = [
  {
    title: 'Extra Low Voltage',
    img: 'https://www.hyper-advance.com/assets/img/background/elv.jpg',
    items: [
      'Public Address System', 'Card Access & Security Control', 'Closed Circuit Television (CCTV)',
      'Satellite Master Antenna Television', 'Nurse Call System', 'Master Clock System',
      'Audio & Video Intercom System', 'Lighting Control System', 'Intercom System',
    ],
  },
  {
    title: 'Audio Visual System',
    img: 'https://www.hyper-advance.com/assets/img/background/audio-system.jpg',
    items: ['Video Conference System', 'Audio Conference System', 'Tele Conference System', 'Digital Signage System'],
  },
  {
    title: 'Isolated Power Supply',
    img: 'https://www.hyper-advance.com/assets/img/background/ipss.jpg',
    items: ['Medical-grade IPS for Operating Theatres', 'Critical Zone Power Distribution', 'IT Room & Hospital Grade Supply'],
  },
];

const CAPABILITIES = [
  { icon: 'fa-truck', label: 'Supply' },
  { icon: 'fa-microchip', label: 'Programming' },
  { icon: 'fa-cogs', label: 'Installation' },
  { icon: 'fa-flask', label: 'Testing & Commissioning' },
  { icon: 'fa-wrench', label: 'Maintenance' },
  { icon: 'fa-graduation-cap', label: 'Training' },
];

export default function Services() {
  const { data } = useCatalog();
  const supporting = data?.company?.supportingBrands || [];

  return (
    <section id="services" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="04 — What We Do"
          title="Our Services"
          desc="End-to-end ELV system design, supply, installation, and lifecycle support for every sector."
          light
        />

        <div className="services-cat-grid">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 0.1}>
              <Card3D>
              <motion.div className="service-cat-card" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
                <div className="service-cat-img">
                  <motion.img src={cat.img} alt={cat.title} whileHover={{ scale: 1.04 }} transition={{ duration: 0.6 }} />
                  <div className="service-cat-img-overlay"><h3>{cat.title}</h3></div>
                </div>
                <div className="service-cat-body">
                  <ol>
                    {cat.items.map((item) => <li key={item}>{item}</li>)}
                  </ol>
                </div>
              </motion.div>
              </Card3D>
            </Reveal>
          ))}
        </div>

        <Reveal className="capabilities-row" stagger>
          {CAPABILITIES.map((cap) => (
            <RevealItem key={cap.label}>
              <motion.div className="cap-item" whileHover={{ y: -3 }}>
                <motion.div
                  className="cap-icon-wrap"
                  whileHover={{ backgroundColor: 'var(--teal)', color: '#fff', scale: 1.06, y: -3 }}
                >
                  <i className={`fa-solid ${cap.icon}`} />
                </motion.div>
                <div className="cap-label">{cap.label}</div>
              </motion.div>
            </RevealItem>
          ))}
        </Reveal>

        {supporting.length > 0 && (
          <Reveal className="supporting-brands" delay={0.15}>
            <h3 className="supporting-brands-title">Supporting Brands &amp; Systems</h3>
            <p className="supporting-brands-desc">Beyond our key distributorships, Hyper Advance integrates complementary ELV brands across access control, CCTV, conferencing, and more.</p>
            <div className="supporting-brands-grid">
              {supporting.map((item) => (
                <div key={item.system} className="supporting-brand-item">
                  <strong>{item.system}</strong>
                  <span>{item.brands}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
