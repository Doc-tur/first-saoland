import {useState} from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {useApi} from '../hooks/useApi';
import ApiState from '../components/ApiState';
import PropertyCard from '../components/PropertyCard';
import {useSavedProperties} from '../context/SavedProperties';

export default function Properties(){
  const [params,setParams]=useSearchParams();
  const type=params.get('type')||'',query=params.get('q')||'',purpose=params.get('purpose')||'',sort=params.get('sort')||'default';
  const [savedOnly,setSavedOnly]=useState(false);
  const {saved}=useSavedProperties();
  const update=(key,value)=>setParams(old=>{const next=new URLSearchParams(old);value?next.set(key,value):next.delete(key);if(key!=='page')next.delete('page');return next;},{replace:true});
  const page=Math.max(1,Number(params.get('page'))||1);
  const requestParams=new URLSearchParams({type,purpose,q:query,sort,page,limit:12,...(savedOnly?{ids:saved.join(',')}:{})});
  const result=useApi('properties?'+requestParams);
  const list=result.data?.data||[];
  
  return (
    <>
    <section className="page-heading wrap">
      <span className="eyebrow">FIND YOUR NEXT CHAPTER</span>
      <h1>A space that fits<br/>your plans.</h1>
      <p>Explore residential, commercial and land properties, then share your requirements with our team.</p>
    </section>
    <section className="wrap listing-section">
      <div className="listing-toolbar">
        <div className="tabs" aria-label="Property category">{['','Residential','Commercial','Land'].map(t=><button key={t} className={t===type?'active':''} aria-pressed={t===type} onClick={()=>update('type',t)}>{t||'All spaces'}</button>)}</div>
        <button id="saved-toggle" aria-pressed={savedOnly} onClick={()=>{setSavedOnly(!savedOnly);update('page','');}}>♡ Saved properties</button>
      </div>
      <form className="filters" onSubmit={e=>e.preventDefault()}>
        <div>
          <label htmlFor="query">Location or keyword</label>
          <input id="query" placeholder="e.g. Lagos, apartment" value={query} onChange={e=>update('q',e.target.value)}/>
        </div>
        <div>
          <label htmlFor="purpose">Your goal</label>
          <select id="purpose" value={purpose} onChange={e=>update('purpose',e.target.value)}>
            <option value="">Buy or rent</option>
            <option>Buy</option>
            <option>Rent</option>
          </select>
        </div>
        <div>
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={e=>update('sort',e.target.value)}>
            <option value="default">Featured first</option>
            <option value="az">Name: A to Z</option>
            <option value="za">Name: Z to A</option>
          </select>
        </div>
        <button type="button" className="outline" onClick={()=>{setParams({});setSavedOnly(false);}}>Reset filters</button>
      </form>
      <div className="results-line">
        <p role="status">{result.data?.total||0} properties {savedOnly?'saved':'to explore'}</p>
        <span>Property catalogue</span>
      </div>
      <p className="sample-note">Contact us to confirm prices, terms and availability. Any illustrative listings are labelled as examples.</p>
      <ApiState {...result}/>
      <div className="property-grid">{list.map(p=><PropertyCard property={p} key={p.id}/>)}</div>
      {!result.loading&&!result.error&&!list.length&&<div className="empty"><h2>No spaces match yet.</h2><p>Try another search or tell us what you’re looking for.</p><Link className="button" to="/contact">Share your requirements ↗</Link></div>}
      {result.data&&result.data.total>12&&<div className="action-row"><button className="outline" disabled={page<=1} onClick={()=>update('page',String(page-1))}>Previous</button><span>Page {page} of {Math.ceil(result.data.total/12)}</span><button className="outline" disabled={page*12>=result.data.total} onClick={()=>update('page',String(page+1))}>Next</button></div>}
    </section>
    </>
  );
}
