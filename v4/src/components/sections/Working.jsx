import Button from '../ui/Button';
import Reveal, { RevealItem } from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

const STEPS = [
  { icon: 'fa-drafting-compass', title: 'Design', desc: 'System planning tailored to your building and sector.' },
  { icon: 'fa-truck', title: 'Supply & Install', desc: 'End-to-end delivery from procurement to on-site integration.' },
  { icon: 'fa-flask', title: 'Testing', desc: 'Rigorous commissioning before handover.' },
  { icon: 'fa-wrench', title: 'Lifecycle Support', desc: 'Maintenance, programming, and training when you need it.' },
];

export default function Working() {
  return (
    <section id="working" className="section working-section">
      <div className="container">
        <SectionHeader
          eyebrow="How We Work"
          title="Working With Us"
          desc="We provide extensive support for residential, commercial, and industrial needs — from design through commissioning and beyond."
          light
        />

        <Reveal className="working-steps" stagger>
          {STEPS.map((step) => (
            <RevealItem key={step.title}>
              <div className="working-step">
                <div className="working-step-icon">
                  <i className={`fa-solid ${step.icon}`} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="working-cta" delay={0.2}>
          <Button href="#contact">Contact Us</Button>
        </Reveal>
      </div>
    </section>
  );
}
