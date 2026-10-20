import {imageUrl,priceLabel} from '../lib/api';
import {Link} from 'react-router-dom';
import {useSavedProperties} from '../context/SavedProperties';

export default function PropertyCard({property:p}){
  const {saved,toggle}=useSavedProperties();
  const selected=saved.includes(p.id);
  
  return (
    <article className="property-card">
      <div className="card-photo">
        <Link to={`/properties/${p.id}`}><img loading="lazy" src={imageUrl(p.image)} alt={p.alt}/></Link>
        <span className="tag">{p.purpose==='Rent'?'To rent':'To buy'}{p.is_example?' · Example':''}{p.status!=='available'?` · ${p.status}`:''}</span>
        <button className="save" onClick={()=>toggle(p.id)} aria-label={`${selected?'Unsave':'Save'} ${p.category}`} aria-pressed={selected}>{selected?'♥':'♡'}</button>
      </div>
      <div className="card-body">
        <p className="category">{p.type} / {p.category}</p>
        <Link to={`/properties/${p.id}`}><h3>{p.title}</h3></Link>
        <p className="location">⌖ {p.location}</p>
        <div className="card-bottom">
          <span>{priceLabel(p)}</span>
          <Link to={`/properties/${p.id}`} aria-label={`View ${p.category}`}>↗</Link>
        </div>
      </div>
    </article>
  );
}
