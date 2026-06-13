import { useState } from 'react';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import SectionHeader from '../ui/SectionHeader';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      e.target.reset();
    }, 3500);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="07 — Get In Touch"
          title="Contact Us"
          desc="Ready to discuss your next project? Our engineering team responds within one business day."
          light
        />

        <div className="contact-grid">
          <Reveal className="contact-intro">
            <h3>Let&apos;s Discuss Your Project</h3>
            <p>Whether you&apos;re planning a new development or upgrading an existing system, our team is ready to provide expert advice and a tailored quotation.</p>
            <div className="contact-icons">
              <div className="contact-icon-item">
                <div className="cicon"><i className="fa-solid fa-phone" /></div>
                <div className="cicon-text">
                  <div className="label">Call Us</div>
                  <div className="val">
                    <a href="tel:+60374980827">+(603) 7498 0827</a><br />
                    <a href="tel:+60378776537">+(603) 7877 6537</a><br />
                    <a href="tel:+60378770289">+(603) 7877 0289</a>
                  </div>
                </div>
              </div>
              <div className="contact-icon-item">
                <div className="cicon"><i className="fa-solid fa-fax" /></div>
                <div className="cicon-text">
                  <div className="label">Fax</div>
                  <div className="val">+(603) 7877 0216</div>
                </div>
              </div>
              <div className="contact-icon-item">
                <div className="cicon"><i className="fa-solid fa-envelope" /></div>
                <div className="cicon-text">
                  <div className="label">Email</div>
                  <div className="val"><a href="mailto:admin@hyper-advance.com">admin@hyper-advance.com</a></div>
                </div>
              </div>
              <div className="contact-icon-item">
                <div className="cicon"><i className="fa-solid fa-location-dot" /></div>
                <div className="cicon-text">
                  <div className="label">Address</div>
                  <div className="val">Unit 4.03 &amp; 4.04, Level 4, BICMA,<br />Lot 2, Jalan 51A/243,<br />46100 Petaling Jaya, Selangor</div>
                </div>
              </div>
              <div className="contact-icon-item">
                <div className="cicon"><i className="fa-solid fa-clock" /></div>
                <div className="cicon-text">
                  <div className="label">Working Hours</div>
                  <div className="val">Monday – Friday: 9:00am – 5:30pm</div>
                </div>
              </div>
            </div>
            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1992.0082645248697!2d101.62348602034872!3d3.09025816503392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4b8c53292d11%3A0xff22291f768c0928!2sHyper%20Advance%20Sdn.%20Bhd.!5e0!3m2!1sen!2smy!4v1593678167771!5m2!1sen!2smy"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hyper Advance Location"
              />
            </div>
          </Reveal>

          <Reveal delay={0.2} className="contact-form-wrap">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>First Name *</label><input type="text" placeholder="John" required /></div>
                <div className="form-group"><label>Last Name *</label><input type="text" placeholder="Doe" required /></div>
              </div>
              <div className="form-group"><label>Email *</label><input type="email" placeholder="john@company.com" required /></div>
              <div className="form-group"><label>Phone</label><input type="tel" placeholder="+60 12-345 6789" /></div>
              <div className="form-group">
                <label>Service of Interest</label>
                <select defaultValue="">
                  <option value="">Select a service...</option>
                  <option>Public Address System</option>
                  <option>Nurse Call System</option>
                  <option>Intercom System</option>
                  <option>SMATV System</option>
                  <option>Master Clock System</option>
                  <option>Lighting Control</option>
                  <option>CCTV &amp; Access Control</option>
                  <option>Audio Visual System</option>
                  <option>Isolated Power Supply</option>
                  <option>Smart Community</option>
                  <option>Multiple Services</option>
                </select>
              </div>
              <div className="form-group"><label>Message *</label><textarea placeholder="Tell us about your project..." required /></div>
              <Button type="submit" style={{ width: '100%', justifyContent: 'center', ...(sent ? { background: 'var(--teal-dark)' } : {}) }}>
                {sent ? <><i className="fa-solid fa-check" /> Message Sent!</> : <><i className="fa-solid fa-paper-plane" /> Send Message</>}
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
