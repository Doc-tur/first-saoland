import ContactLinks from './ContactLinks';
import { Link } from 'react-router-dom';

export default function Footer(){
  return (
    <>
    <section className="closing">
      <div>
        <span className="eyebrow">YOUR NEXT CHAPTER</span>
        <h2>Let’s find your place<br />in Lagos.</h2>
      </div>
      <Link className="button light" to="/contact">Discuss your property needs ↗</Link>
    </section>
    <footer>
      <div className="footer-main">
        <Link className="brand" to="/"><span className="brand-icon">⌂</span><span>FIRST SAOLAND<small>HOMES & INVESTMENT LIMITED</small></span></Link>
        <div>
          <p>Residential. Commercial. Possibilities.<br />Property solutions with you in mind.</p>
          <ContactLinks />
        </div>
        <div>
          <strong>Visit our office</strong>
          <p>16, Oshikomaya Street, Ketu Ikosi CMD Road,<br />Ketu, Lagos, Nigeria.</p>
          <a href="https://www.google.com/maps/search/?api=1&query=16%20Oshikomaya%20Street%20Ketu%20Ikosi%20CMD%20Road%20Lagos" target="_blank" rel="noopener">Get directions ↗</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© <span>{new Date().getFullYear()}</span> First Saoland Homes and Investment Limited</span>
        <Link to="/contact-us">Contact us</Link>
        <Link to="/contact">Make an enquiry</Link>
        <span>Lagos, Nigeria</span>
      </div>
    </footer></>
  );
}
