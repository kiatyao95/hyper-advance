import { useCatalog } from '../../context/CatalogContext';
import Reveal, { RevealItem } from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { publicPath } from '../../utils/publicPath';

const CAPABILITIES = [
  { icon: 'fa-drafting-compass', label: 'System Design' },
  { icon: 'fa-truck', label: 'Supply & Installation' },
  { icon: 'fa-flask', label: 'Testing & Commissioning' },
  { icon: 'fa-microchip', label: 'Programming' },
  { icon: 'fa-wrench', label: 'Maintenance' },
  { icon: 'fa-graduation-cap', label: 'Training' },
];

export default function About() {
  const { data } = useCatalog();
  const company = data?.company;
  const years = company?.yearsExperience ?? 31;
  const staff = company?.staffCount ?? 50;
  const brandCount = data?.distributors?.length ?? 8;

  return (
    <section id="about" className="section blueprint-bg">
      <div className="container">
        <SectionHeader
          eyebrow="01 — Who We Are"
          title="About Us"
          desc="Three decades of precision engineering and system integration across Malaysia's most demanding environments."
        />

        <Reveal className="about-intro-bar">
          <div className="about-logo-frame about-logo-frame--compact">
            <img src={publicPath('/assets/brand/hyper-advance-logo.png')} alt="Hyper Advance" />
          </div>
          <div className="about-stats-row">
            <div>
              <div className="about-stat-num">{years}<span>+</span></div>
              <div className="about-stat-lbl">Years</div>
            </div>
            <div>
              <div className="about-stat-num">{staff}<span>+</span></div>
              <div className="about-stat-lbl">Staff</div>
            </div>
            <div>
              <div className="about-stat-num">{brandCount}</div>
              <div className="about-stat-lbl">Brands</div>
            </div>
          </div>
        </Reveal>

        <div className="about-grid about-grid--slim">
          <Reveal variant="left">
            <p>
              <b className="blue">HYPER ADVANCE SDN BHD</b> has grown since 1995 from a one-person operation into a group of more than {staff} professionals — recognised today as a leading ELV integrator for commercial, residential, hospitality, and healthcare developments across Malaysia.
            </p>
            <p className="about-quote">
              <b className="red">&quot;IF IT WEREN&apos;T FOR YOU, WE WOULDN&apos;T BE HERE.&quot;</b>
            </p>
            <p>
              Our mission is to deliver state-of-the-art solutions that create a win-win-win outcome for our principals, partners, and end-users. We are authorised distributors for Aiphone, AJB, Fagor, Amperes, Lutron, Austco, Esa Grimma, and Bodet.
            </p>
          </Reveal>

          <Reveal variant="right" delay={0.15}>
            <Reveal className="capability-pills capability-pills--compact" stagger>
              {CAPABILITIES.map((c) => (
                <RevealItem key={c.label}>
                  <div className="cap-pill">
                    <i className={`fa-solid ${c.icon}`} /> {c.label}
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </Reveal>
        </div>

        <Reveal className="ha-meditech-card ha-meditech-card--inline">
          <h3><i className="fa-solid fa-hospital" /> HA Meditech Sdn Bhd</h3>
          <p>
            Our healthcare specialist division — backed by Hyper Advance resources and 25+ years of clinical ELV experience — delivering nurse call, IPS, and hospital communication systems with precision.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
