import { useCatalog } from '../../context/CatalogContext';
import Reveal, { RevealItem } from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';
import { publicPath } from '../../utils/publicPath';

const CAPABILITIES = [
  { icon: 'fa-drafting-compass', label: 'Design' },
  { icon: 'fa-truck', label: 'Supply' },
  { icon: 'fa-screwdriver-wrench', label: 'Installation' },
  { icon: 'fa-flask', label: 'Testing & Commissioning' },
  { icon: 'fa-wrench', label: 'Maintenance' },
  { icon: 'fa-graduation-cap', label: 'Training' },
];

export default function About() {
  const { data } = useCatalog();
  const company = data?.company;
  const staff = company?.staffCount ?? 30;
  const systems = company?.systemsOffered ?? 10;
  const brands = company?.authorizedBrandCount ?? 5;

  return (
    <section id="about" className="section blueprint-bg">
      <div className="container">
        <SectionHeader
          eyebrow="01 — Who We Are"
          title="About Us"
          desc="An experienced ELV contractor and authorised distributor serving Malaysia since 1995."
        />

        <Reveal className="about-intro-bar">
          <div className="about-logo-frame about-logo-frame--compact">
            <img src={publicPath('/assets/brand/hyper-advance-logo.png')} alt="Hyper Advance" />
          </div>
          <div className="about-stats-row">
            <div>
              <div className="about-stat-num">{staff}<span>+</span></div>
              <div className="about-stat-lbl">Team Members</div>
            </div>
            <div>
              <div className="about-stat-num">{systems}<span>+</span></div>
              <div className="about-stat-lbl">Systems</div>
            </div>
            <div>
              <div className="about-stat-num">{company?.founded ?? 1995}</div>
              <div className="about-stat-lbl">Since</div>
            </div>
            <div>
              <div className="about-stat-num">{brands}<span>+</span></div>
              <div className="about-stat-lbl">Authorised Brands</div>
            </div>
          </div>
        </Reveal>

        <div className="about-grid about-grid--slim">
          <Reveal variant="left">
            <p>
              <b className="blue">HYPER ADVANCE SDN BHD</b> has grown since 1995 from a one-person operation into a team of more than {staff} professionals — recognised as a leading ELV contractor and authorised distributor for commercial, residential, hospitality, and healthcare developments across Malaysia.
            </p>
            <p className="about-quote">
              <b className="red">&quot;IF IT WEREN&apos;T FOR YOU, WE WOULDN&apos;T BE HERE.&quot;</b>
            </p>
            <p>
              We deliver complete ELV solutions — design, supply, installation, programming, commissioning, maintenance, and training — as the authorised distributor for Aiphone, Austco, Amperes, Lutron, and Fagor, with additional brands across access control, CCTV, conferencing, and more.
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
      </div>
    </section>
  );
}
