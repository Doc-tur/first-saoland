import { contact } from '../data/contact';

export default function ContactLinks(){
  return (
    <div className="contact-links" aria-label="Contact details">
      {contact.phones.map(p=><a key={p.number} href={p.href}><span className="contact-link-label">Call us</span><span>{p.number}</span></a>)}
      {contact.whatsapp.map(p=><a key={p.number} href={p.href} target="_blank" rel="noopener noreferrer"><span className="contact-link-label">WhatsApp</span><span>{p.number} ↗</span></a>)}
      <a href={`mailto:${contact.email}`}><span className="contact-link-label">Email us</span><span>{contact.email}</span></a>
    </div>
  );
}
