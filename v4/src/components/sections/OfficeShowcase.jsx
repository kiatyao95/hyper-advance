import { useCatalog } from '../../context/CatalogContext';
import OfficeGallery from './OfficeGallery';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

export default function OfficeShowcase() {
  const { data } = useCatalog();
  const images = data?.company?.officeGallery || [];

  if (!images.length) return null;

  return (
    <section id="office" className="section office-showcase-section">
      <div className="container">
        <SectionHeader
          eyebrow="Our Workspace"
          title="Hyper Advance Office"
          desc="BICMA, Petaling Jaya — where our engineering, design, and project teams collaborate."
        />
        <Reveal>
          <OfficeGallery images={images} compact />
        </Reveal>
      </div>
    </section>
  );
}
