import {Link,useParams} from 'react-router-dom';
import {useSavedProperties} from '../context/SavedProperties';
import {useApi} from '../hooks/useApi';
import {imageUrl,priceLabel} from '../lib/api';
import ApiState from '../components/ApiState';

export default function PropertyDetails(){
  const {id}=useParams();
  const result=useApi('properties/'+encodeURIComponent(id));
  const p=result.data?.data;
  const {saved,toggle}=useSavedProperties();
  if(!p)return <section className="wrap detail-section"><ApiState {...result}/><Link className="text-link" to="/properties">← Back to properties</Link></section>;
  
  return (
    <section className="wrap detail-section">
      <Link className="text-link" to="/properties">← Back to properties</Link>
      <div className="detail-title">
        <div>
          <span className="eyebrow">{p.type} / {p.category}</span>
          <h1>{p.title}</h1>
          <p>{p.location}</p>
          <h3>{priceLabel(p)}</h3>
        </div>
        <button className="outline" aria-label={`${saved.includes(id)?'Unsave':'Save'} property`} aria-pressed={saved.includes(id)} onClick={()=>toggle(id)}>{saved.includes(id)?'♥':'♡'}</button>
      </div>
      <img className="detail-image" src={imageUrl(p.image)} alt={p.alt}/>
      <div className="detail-columns">
        <div>
          <span className="eyebrow">PROPERTY OVERVIEW</span>
          <h2>A closer look.</h2>
          <p className="preserve-lines">{p.description}</p>
          <ul className="checklist">
            <li>Status: {p.status}</li>
            {p.bedrooms>0&&<li>{p.bedrooms} bedrooms</li>}
            {p.bathrooms>0&&<li>{p.bathrooms} bathrooms</li>}
            {p.area_sqm&&<li>{p.area_sqm} m²</li>}
            {p.features.map(f=><li key={f}>{f}</li>)}
          </ul>
        </div>
        <aside className="detail-enquiry">
          {p.is_example&&<span className="tag">Illustrative example</span>}
          <h3>Interested in this property?</h3>
          <p>{p.is_example?'This is an illustrative listing. Ask about similar current options.':'Contact us to confirm availability, documentation, terms and inspection arrangements.'}</p>
          <Link className="button" to={`/contact?interest=${p.type}&property=${p.id}`}>Enquire about this property ↗</Link>
        </aside>
      </div>
    </section>
  );
}
