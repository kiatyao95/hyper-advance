import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const DISTRIBUTORS = [
  { id: 'aiphone', label: 'Aiphone', group: 'Intercom' },
  { id: 'ajb', label: 'AJB', group: 'Intercom' },
  { id: 'lutron', label: 'Lutron', group: 'Lighting Control' },
  { id: 'austco', label: 'Austco', group: 'Nurse Call' },
  { id: 'amperes', label: 'Amperes', group: 'Public Address' },
  { id: 'fagor', label: 'Fagor', group: 'SMATV' },
  { id: 'bodet', label: 'Bodet', group: 'Master Clock' },
  { id: 'esa-grimma', label: 'Esa Grimma', group: 'Isolated Power Supply' },
];

const SERVICE_LINKS = [
  'Public Address System', 'Nurse Call System', 'Intercom System', 'SMATV',
  'Master Clock System', 'Lighting Control', 'Audio Visual System',
  'CCTV & Access Control', 'Isolated Power Supply',
];

export default function Navbar({ activeKey = '' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/index.html';
  const scrollSpy = useScrollSpy(isHome ? ['hero', 'about', 'services', 'industries', 'projects', 'contact'] : []);
  const { scrollY } = useScroll();
  const padding = useTransform(scrollY, [0, 80], [16, 10]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0.5, 0.82]);
  const background = useTransform(bgOpacity, (v) => `rgba(0,0,0,${v})`);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navClass = (key, hash) => {
    if (activeKey === key) return 'nav-link active';
    if (isHome && scrollSpy === hash?.replace('#', '')) return 'nav-link active';
    return 'nav-link';
  };

  const groups = [...new Set(DISTRIBUTORS.map((d) => d.group))];

  return (
    <>
      <motion.nav
        id="navbar"
        style={{
          paddingTop: padding,
          paddingBottom: padding,
          background,
        }}
      >
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-logo">
              <img src="https://www.hyper-advance.com/assets/img/HA.png" alt="Hyper Advance Logo" />
              <div className="nav-logo-text">
                <strong>Hyper Advance</strong>
                <span>Sdn Bhd</span>
              </div>
            </Link>

            <ul className="nav-links">
              <li className="nav-item">
                <Link to="/#about" className={navClass('about', '#about')}>About</Link>
              </li>
              <li className="nav-item">
                <Link to="/#services" className={navClass('services', '#services')}>
                  Services <i className="fa-solid fa-chevron-down" />
                </Link>
                <div className="dropdown">
                  <div className="dropdown-label">ELV Systems</div>
                  {SERVICE_LINKS.slice(0, 6).map((s) => (
                    <Link key={s} to="/#services" className="dropdown-item">{s}</Link>
                  ))}
                  <div className="dropdown-divider" />
                  <div className="dropdown-label">Other Services</div>
                  {SERVICE_LINKS.slice(6).map((s) => (
                    <Link key={s} to="/#services" className="dropdown-item">{s}</Link>
                  ))}
                </div>
              </li>
              <li className="nav-item">
                <Link to="/#systems-list" className={navClass('systems', '#systems-list')}>Systems</Link>
              </li>
              <li className="nav-item">
                <Link to="/#distributors-list" className={navClass('distributors', '#distributors-list')}>
                  Distributors <i className="fa-solid fa-chevron-down" />
                </Link>
                <div className="dropdown mega-dropdown">
                  {groups.map((group) => (
                    <div key={group} className="mega-col">
                      <div className="mega-col-title">{group}</div>
                      {DISTRIBUTORS.filter((d) => d.group === group).map((d) => (
                        <Link key={d.id} to={`/distributor/${d.id}`} className="dropdown-item">{d.label}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              </li>
              <li className="nav-item">
                <Link to="/#industries" className={navClass('industries', '#industries')}>Industries</Link>
              </li>
              <li className="nav-item">
                <Link to="/projects" className={navClass('projects')}>Projects</Link>
              </li>
              <li className="nav-item">
                <Link to="/#contact" className={navClass('contact', '#contact')}>Contact</Link>
              </li>
            </ul>

            <Button to="/#contact" className="nav-cta-btn" style={{ fontSize: 13, padding: '8px 20px' }}>
              Get a Quote
            </Button>

            <button
              type="button"
              className={`hamburger${mobileOpen ? ' open' : ''}`}
              aria-label="Menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav open"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            <Link to="/#about" className="mob-link" onClick={() => setMobileOpen(false)}>About Us</Link>
            <div className="mob-sublabel">Services</div>
            <Link to="/#services" className="mob-sublink" onClick={() => setMobileOpen(false)}>ELV Systems</Link>
            <Link to="/#services" className="mob-sublink" onClick={() => setMobileOpen(false)}>Audio Visual</Link>
            <Link to="/#services" className="mob-sublink" onClick={() => setMobileOpen(false)}>Isolated Power Supply</Link>
            <Link to="/#systems-list" className="mob-link" onClick={() => setMobileOpen(false)}>Systems</Link>
            <Link to="/#distributors-list" className="mob-link" onClick={() => setMobileOpen(false)}>Distributors</Link>
            <Link to="/#industries" className="mob-link" onClick={() => setMobileOpen(false)}>Industries</Link>
            <Link to="/projects" className="mob-link" onClick={() => setMobileOpen(false)}>Projects</Link>
            <Link to="/#contact" className="mob-link" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Button to="/#contact" style={{ marginTop: '1.5rem', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
              Get a Quote
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
