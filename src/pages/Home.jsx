import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import {useApi} from '../hooks/useApi';
import ApiState from '../components/ApiState';
import { heroImage, homeImage } from '../assets/index';

export default function Home(){
  const result=useApi('properties?limit=3');
  const properties=result.data?.data||[];
  
  return (
    <>
    <section className="hero">
      <img src={heroImage} alt="Light-filled contemporary living room with garden views" fetchPriority="high" />
      <div className="hero-shade"></div>
      <div className="hero-content">
        <span className="eyebrow">ROOTED IN LAGOS. BUILT AROUND YOU.</span>
        <h1>A place to live.<br />A space to grow.</h1>
        <p>Discover possibilities for your home, your business,<br className="desktop" /> and your next property move with First Saoland.</p>
        <Link className="button light" to="/properties">Explore properties <span>↗</span></Link>
      </div>
      <span className="hero-caption">Residential & commercial property solutions</span>
      <span className="hero-location">KETU, LAGOS &nbsp; ◉</span>
    </section>
    <SearchBar />
    <section className="intro wrap">
      <span className="eyebrow">WELCOME TO FIRST SAOLAND</span>
      <div>
        <h2>Property is personal.<br />So is our approach.</h2>
        <p>Whether you’re looking for somewhere to call home or a space for your business, your property journey starts with understanding what matters to you.</p>
        <p>First Saoland Homes and Investment Limited works in residential and commercial real estate, from our base in Ketu, Lagos.</p>
        <Link className="text-link" to="/about">Get to know us ↗</Link>
      </div>
    </section>
    <section className="section muted">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">EXPLORE THE POSSIBILITIES</span>
            <h2>Spaces for every next step.</h2>
          </div>
          <Link className="text-link" to="/properties">Explore all properties ↗</Link>
        </div>
        <p className="sample-note">Contact our team to confirm availability, pricing and inspection arrangements.</p>
        <ApiState {...result}/>
        {!result.loading&&!result.error&&!properties.length&&<p>New listings are coming soon. Contact us for current options.</p>}
        <div className="property-grid">{properties.slice(0,3).map(property => <PropertyCard key={property.id} property={property} />)}</div>
      </div>
    </section>
    <section className="section wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">WHAT WE CAN HELP WITH</span>
          <h2>One partner. More possibilities.</h2>
        </div>
        <Link className="text-link" to="/services">Explore our services ↗</Link>
      </div>
      <div className="service-lines">
        <Link to="/services#residential"><span>01</span><div><h3>Residential properties</h3><p>Find a home that fits your lifestyle and your next chapter.</p></div><b>↗</b></Link>
        <Link to="/services#commercial"><span>02</span><div><h3>Commercial spaces</h3><p>Explore places for your business to establish itself and grow.</p></div><b>↗</b></Link>
        <Link to="/services#property"><span>03</span><div><h3>Property enquiries</h3><p>Talk through buying, renting, selling or your wider property needs.</p></div><b>↗</b></Link>
      </div>
    </section>
    <section className="split wrap">
      <img loading="lazy" src={homeImage} alt="Residential home and landscaped exterior" />
      <div>
        <span className="eyebrow">A THOUGHTFUL WAY FORWARD</span>
        <h2>Start with your vision.<br />We’ll discuss the next step.</h2>
        <ol className="steps">
          <li><strong>Tell us what you need</strong><p>Share your preferred area, property type and budget.</p></li>
          <li><strong>Explore your options</strong><p>Discuss suitable opportunities and arrange an inspection.</p></li>
          <li><strong>Make an informed decision</strong><p>Confirm availability, terms and documentation before proceeding.</p></li>
        </ol>
        <Link className="button" to="/contact">Start a conversation ↗</Link>
      </div>
    </section>
    </>
  );
}
