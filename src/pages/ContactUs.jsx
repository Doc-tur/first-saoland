import { Link } from 'react-router-dom';
import { contact } from '../data/contact';

const directions = 'https://www.google.com/maps/search/?api=1&query=16%20Oshikomaya%20Street%20Ketu%20Ikosi%20CMD%20Road%20Lagos';

export default function ContactUs() {
  return (
    <>
      <section className="page-heading wrap">
        <span className="eyebrow">CONTACT FIRST SAOLAND</span>
        <h1>Let’s connect.<br />Your next move awaits.</h1>
        <p>Call, send an email, chat on WhatsApp, or visit our office to discuss your residential and commercial property needs.</p>
      </section>
      <section className="wrap contact-us-section">
        <div className="contact-methods">
          <article>
            <span className="eyebrow">01 / CALL</span>
            <h2>Speak with us.</h2>
            <p>Discuss your requirements and the next steps in your property journey.</p>
            {contact.phones.map(p=><div key={p.number}><a className="text-link" href={p.href}>{p.number} ↗</a></div>)}
          </article>
          <article>
            <span className="eyebrow">02 / WHATSAPP</span>
            <h2>Start a chat.</h2>
            <p>Share your preferred location, property type and budget in a message.</p>
            {contact.whatsapp.map(p=><div key={p.number}><a className="text-link" href={p.href} target="_blank" rel="noopener noreferrer">{p.number} ↗</a></div>)}
          </article>
          <article>
            <span className="eyebrow">03 / EMAIL</span>
            <h2>Write to us.</h2>
            <p>Send your property questions or tell us what you’re looking for.</p>
            <a className="text-link" href={`mailto:${contact.email}`}>{contact.email} ↗</a>
          </article>
        </div>
        <div className="office-panel">
          <div>
            <span className="eyebrow">VISIT OUR OFFICE</span>
            <h2>Meet us in Ketu.</h2>
            <address>
              First Saoland Homes and Investment Limited<br /><br />
              16, Oshikomaya Street,<br />
              Ketu Ikosi CMD Road,<br />
              Ketu, Lagos, Nigeria.
            </address>
            <a className="button" href={directions} target="_blank" rel="noopener noreferrer">Get directions ↗</a>
          </div>
          <div className="office-visit">
            <span className="eyebrow">BEFORE YOU VISIT</span>
            <h3>A little preparation goes a long way.</h3>
            <p>Contact us to arrange your visit. Bring your preferred location, budget and property requirements so we can discuss your plans.</p>
            <h3>Have a detailed enquiry?</h3>
            <p>Use our Let’s Talk page to submit a property enquiry and track it in your account.</p>
            <Link className="text-link" to="/contact">Submit an enquiry ↗</Link>
          </div>
        </div>
      </section>
    </>
  );
}
