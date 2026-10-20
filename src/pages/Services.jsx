import { Link } from 'react-router-dom';
import { officeImage } from '../assets/index';

export default function Services(){
  return( 
    <>
    <section className="page-heading wrap">
      <span className="eyebrow">PROPERTY SOLUTIONS</span>
      <h1>For the way you live.<br />For the way you work.</h1>
      <p>Start with your requirements. Explore residential and commercial property possibilities with First Saoland.</p>
    </section>
    <section className="split wrap" id="residential">
      <img src={officeImage} alt="Residential property exterior" />
      <div>
        <span className="eyebrow">01 / RESIDENTIAL</span>
        <h2>Find your kind of home.</h2>
        <p>A first home, a new neighbourhood, or room for a growing household. Share your needs and discuss residential options with our team.</p>
        <ul className="checklist">
          <li>Homes and apartments</li>
          <li>Buying and rental enquiries</li>
          <li>Location and space preferences</li>
        </ul>
        <Link className="text-link" to="/contact?interest=Residential">Discuss residential needs ↗</Link>
      </div>
    </section>
    <section className="split reverse wrap" id="commercial">
      <img src={officeImage} alt="Modern commercial office space" loading="lazy" />
      <div>
        <span className="eyebrow">02 / COMMERCIAL</span>
        <h2>A space for your ambition.</h2>
        <p>Commercial property starts with how your business works. Tell us about your plans, preferred area and the space you need.</p>
        <ul className="checklist">
          <li>Office and retail space enquiries</li>
          <li>Commercial purchase and lease enquiries</li>
          <li>Access, size and location requirements</li>
        </ul>
        <Link className="text-link" to="/contact?interest=Commercial">Discuss commercial needs ↗</Link>
      </div>
    </section>
    <section className="section muted" id="property">
      <div className="wrap intro">
        <span className="eyebrow">03 / PROPERTY ENQUIRIES</span>
        <div>
          <h2>Let’s discuss<br />the bigger picture.</h2>
          <p>Have a property to sell or let? Considering land or a future investment? Share your plans with First Saoland so we can discuss your requirements and the appropriate next steps.</p>
          <Link className="button" to="/contact?interest=General%20property%20enquiry">Make a property enquiry ↗</Link>
        </div>
      </div>
    </section>
    </>
  );
}
