import { Link } from 'react-router-dom';

export default function Footer({ minimal = false }) {
  if (minimal) {
    return (
      <footer className="site-footer">
        <div className="container">
          <p>
            &copy; 2025 Hyper Advance Sdn Bhd (338032-H) &nbsp;|&nbsp;
            <Link to="/systems">Systems</Link> &nbsp;|&nbsp;
            <Link to="/#contact">Contact</Link>
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img
              src="https://www.hyper-advance.com/assets/img/about/HAT.jpg"
              alt="Hyper Advance"
              className="footer-logo-img"
            />
            <p>
              Leading ELV contractor and authorised distributor in Malaysia since 1995. Delivering
              state-of-the-art ELV solutions across healthcare, hospitality, commercial, and residential sectors.
            </p>
            <p className="footer-tagline">&quot;If it weren&apos;t for you, we wouldn&apos;t be here.&quot;</p>
            <div className="footer-social">
              <a href="https://www.facebook.com/ha.sb.3382" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="mailto:admin@hyper-advance.com" className="social-link" aria-label="Email">
                <i className="fa-solid fa-envelope" />
              </a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/#about"><i className="fa-solid fa-chevron-right" /> About Us</Link></li>
              <li><Link to="/#services"><i className="fa-solid fa-chevron-right" /> Our Services</Link></li>
              <li><Link to="/systems"><i className="fa-solid fa-chevron-right" /> Systems</Link></li>
              <li><Link to="/distributors"><i className="fa-solid fa-chevron-right" /> Distributors</Link></li>
              <li><Link to="/projects"><i className="fa-solid fa-chevron-right" /> Our Projects</Link></li>
              <li><Link to="/#contact"><i className="fa-solid fa-chevron-right" /> Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Information</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <i className="fa-solid fa-location-dot" />
                <span>Unit 4.03 &amp; 4.04, Level 4, BICMA, Lot 2, Jalan 51A/243, 46100 Petaling Jaya, Selangor</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-phone" />
                <span>+(603) 7498 0827<br />+(603) 7877 6537<br />+(603) 7877 0289</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-envelope" />
                <a href="mailto:admin@hyper-advance.com">admin@hyper-advance.com</a>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-clock" />
                <span>Working Hours: 9am – 5:30pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2025 Hyper Advance Sdn Bhd (338032-H). All Rights Reserved. &nbsp;|&nbsp;
          <a href="https://www.hyper-advance.com">www.hyper-advance.com</a> &nbsp;|&nbsp; Profile v4
        </p>
      </div>
    </footer>
  );
}
