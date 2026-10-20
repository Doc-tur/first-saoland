import { Link } from 'react-router-dom';
import { heroImage } from '../assets/index';

export default function About(){
  return (
    <>
    <section className="page-heading wrap">
      <span className="eyebrow">ABOUT FIRST SAOLAND</span>
      <h1>Homes. Businesses.<br />New beginnings.</h1>
      <p>Residential and commercial property solutions, rooted in Ketu, Lagos.</p>
    </section>
    <section className="split wrap">
      <img src={heroImage} alt="Contemporary residential interior" />
      <div>
        <span className="eyebrow">WHO WE ARE</span>
        <h2>Real estate with<br />your plans at the centre.</h2>
        <p>First Saoland Homes and Investment Limited is a real estate business dealing in properties, both residential and commercial.</p>
        <p>Our office is located at 16, Oshikomaya Street, Ketu Ikosi CMD Road, Ketu, Lagos. Whether your next move is for your household or your business, speak with us about the space you need.</p>
        <Link className="button" to="/contact">Visit or make an enquiry ↗</Link>
      </div>
    </section>
    <section className="section muted">
      <div className="wrap">
        <span className="eyebrow">LET’S TALK ABOUT YOUR GOALS</span>
        <h2>Different needs. A shared starting point.</h2>
        <div className="three-columns">
          <article>
            <span className="number">01 /</span>
            <h3>A home for you</h3>
            <p>Tell us about your preferred neighbourhood, household needs and budget.</p>
          </article>
          <article>
            <span className="number">02 /</span>
            <h3>A space for business</h3>
            <p>Share the location, access and space requirements for your commercial plans.</p>
          </article>
          <article>
            <span className="number">03 /</span>
            <h3>Your next property move</h3>
            <p>Discuss your buying, renting, selling or general property requirements.</p>
          </article>
        </div>
      </div>
    </section>
    </>
  );
}
