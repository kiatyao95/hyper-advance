import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const DISTRIBUTORS = [
  { id: 'aiphone', label: 'Aiphone' },
  { id: 'ajb', label: 'AJB' },
  { id: 'lutron', label: 'Lutron' },
  { id: 'austco', label: 'Austco' },
  { id: 'amperes', label: 'Amperes' },
  { id: 'fagor', label: 'Fagor' },
  { id: 'bodet', label: 'Bodet' },
  { id: 'esa-grimma', label: 'Esa Grimma' },
];

const SERVICE_LINKS = [
  { id: 'design', label: 'Design' },
  { id: 'supply', label: 'Supply' },
  { id: 'installation', label: 'Installation' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'programming', label: 'Programming' },
  { id: 'testing', label: 'Testing & Commissioning' },
  { id: 'training', label: 'Training' },
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
                  {SERVICE_LINKS.map((s) => (
                    <Link key={s.id} to="/#services" className="dropdown-item">{s.label}</Link>
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
                <div className="dropdown dropdown--right">
                  {DISTRIBUTORS.map((d) => (
                    <Link key={d.id} to={`/distributor/${d.id}`} className="dropdown-item">{d.label}</Link>
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
            {SERVICE_LINKS.map((s) => (
              <Link key={s.id} to="/#services" className="mob-sublink" onClick={() => setMobileOpen(false)}>{s.label}</Link>
            ))}
            <Link to="/#systems-list" className="mob-link" onClick={() => setMobileOpen(false)}>Systems</Link>
            <div className="mob-sublabel">Distributors</div>
            {DISTRIBUTORS.map((d) => (
              <Link key={d.id} to={`/distributor/${d.id}`} className="mob-sublink" onClick={() => setMobileOpen(false)}>{d.label}</Link>
            ))}
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
