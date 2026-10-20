import {useAuth} from '../context/Auth';
import {api} from '../lib/api';
import ContactLinks from '../components/ContactLinks';
import {Link,useSearchParams} from 'react-router-dom';
import {useState,useRef,useEffect} from 'react';

export default function Contact(){
  const {user}=useAuth();
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const [params]=useSearchParams();
  const [enquiry,setEnquiry]=useState('');
  const resultRef=useRef(null);
  const initialInterest=['Residential','Commercial','Land','Sell or let a property','General property enquiry'].includes(params.get('interest'))?params.get('interest'):'';
  const initialMessage=params.get('property')?'I would like more information about this property.':'';
  useEffect(()=>{if(enquiry)resultRef.current?.focus();},[enquiry]);
  async function prepare(event){
    event.preventDefault();
    setError('');
    if(!user){setError('Please log in to submit your enquiry.');return;}
    const v=Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    try{await api('inquiries',{method:'POST',body:{...v,property_id:params.get('property')||null}});setEnquiry(`PROPERTY ENQUIRY
    First Saoland Homes and Investment Limited

    Name: ${v.name}
    Email: ${v.email}
    Phone: ${v.phone||'Not provided'}
    Interest: ${v.interest}
    Preferred location: ${v.location||'To discuss'}
    Budget: ${v.budget||'To discuss'}

    Requirements:
    ${v.message}
    Saved to your First Saoland account.`);}
    catch(e){setError(e.message);}
    finally{setBusy(false);}
  }
  function download(){
    const url=URL.createObjectURL(new Blob([enquiry],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');
    a.href=url;
    a.download='first-saoland-enquiry.txt';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  return (
    <>
    <section className="page-heading wrap">
      <span className="eyebrow">LET’S START A CONVERSATION</span>
      <h1>Your next move<br />starts here.</h1>
      <p>Tell us what you have in mind, or visit our office in Ketu, Lagos.</p>
    </section>
    <section className="contact-grid wrap">
      <aside>
        <span className="eyebrow">COME SAY HELLO</span>
        <h2>Find us in Ketu.</h2>
        <address>First Saoland Homes and Investment Limited<br /><br />16, Oshikomaya Street,<br />Ketu Ikosi CMD Road,<br />Ketu, Lagos, Nigeria.</address>
        <ContactLinks />
        <a className="text-link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=16%20Oshikomaya%20Street%20Ketu%20Ikosi%20CMD%20Road%20Lagos">Open directions in Google Maps ↗</a>
        <div className="contact-note">
          <strong>Plan your visit</strong>
          <p>Bring your property requirements, preferred location and budget so you can discuss them with the team.</p>
        </div>
      </aside>
      <div className="form-panel">
        <h2>Share your requirements.</h2>
        <p className="form-note">Submit your enquiry to our team and keep a copy in your account. You can also download it after submission.</p>
        <form id="enquiry-form" hidden={!!enquiry} onSubmit={prepare}>
          <div className="form-row">
            <div>
              <label htmlFor="fullname">Full name *</label>
              <input id="fullname" name="name" autoComplete="name" defaultValue={user?.name||''} required maxLength="100" />
            </div>
            <div>
              <label htmlFor="email">Email address *</label>
              <input type="email" id="email" name="email" autoComplete="email" defaultValue={user?.email||''} required />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="phone">Phone number</label>
              <input type="tel" id="phone" name="phone" autoComplete="tel" maxLength="40" />
            </div>
            <div>
              <label htmlFor="interest">I’m interested in *</label>
              <select id="interest" name="interest" required defaultValue={initialInterest}>
                <option value="">Select an enquiry type</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Land</option>
                <option>Sell or let a property</option>
                <option>General property enquiry</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="location">Preferred location</label>
              <input id="location" name="location" placeholder="Area or neighbourhood" maxLength="150" />
            </div>
            <div>
              <label htmlFor="budget">Budget (NGN)</label>
              <input id="budget" name="budget" placeholder="e.g. ₦5 million per year" maxLength="100" />
            </div>
          </div>
          <label htmlFor="message">Tell us more *</label>
          <textarea id="message" name="message" rows="5" required minLength="10" maxLength="3000" placeholder="Property type, preferred location, timing and anything else we should know." defaultValue={initialMessage}></textarea>
          <p className="form-note">Your enquiry and contact details will be stored for our team to respond.</p>
          {error&&<p className="feedback error" role="alert">{error}</p>}
          {user?<button className="button" disabled={busy} type="submit">{busy?'Submitting…':'Submit enquiry ↗'}</button>:<Link className="button" to="/login" state={{from:'/contact?'+params.toString()}}>Log in to send an enquiry ↗</Link>}
        </form>
        <div id="enquiry-result" hidden={!enquiry} tabIndex="-1" ref={resultRef}>
          <h3>Your enquiry has been submitted.</h3>
          <p>Our team can now view your enquiry. Download a copy below or check your account for its status.</p>
          <pre id="enquiry-preview">{enquiry}</pre>
          <button id="download-enquiry" className="button" onClick={download}>Download enquiry ↓</button>
          <button id="edit-enquiry" className="outline" onClick={()=>setEnquiry('')}>Write another enquiry</button>
        </div>
      </div>
    </section>
    </>
  );
}