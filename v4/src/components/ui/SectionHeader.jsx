import Reveal from './Reveal';

export default function SectionHeader({ eyebrow, title, desc, light, center = true }) {
  return (
    <Reveal className={`section-header${center ? ' text-center' : ''}`}>
      <div className="section-eyebrow" style={center ? { justifyContent: 'center' } : undefined}>
        {eyebrow}
      </div>
      <h2 className={`section-title${light ? ' light' : ''}`}>{title}</h2>
      {desc && <p className="section-desc">{desc}</p>}
    </Reveal>
  );
}
