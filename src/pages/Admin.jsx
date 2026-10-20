import {useState} from 'react';
import {Link} from 'react-router-dom';
import {api,priceLabel,imageUrl} from '../lib/api';
import {useApi} from '../hooks/useApi';
import ApiState from '../components/ApiState';
import { homeImage } from '../assets/index';

const empty={
  title:'',
  description:'',
  price:'',
  price_period:'total',
  type:'Residential',
  purpose:'Buy',
  category:'',
  location:'',
  image:{homeImage},
  bedrooms:0,
  bathrooms:0,
  area_sqm:'',
  features:[],
  status:'draft',
  featured:false,
  is_example:false
};

export default function Admin(){
  const [page,setPage]=useState(1),[inquiryPage,setInquiryPage]=useState(1);
  const listings=useApi('admin/properties?limit=20&page='+page),inquiries=useApi('admin/inquiries?page='+inquiryPage);
  const [draft,setDraft]=useState({...empty}),[editing,setEditing]=useState(null),[featureText,setFeatureText]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
  const field=(key,value)=>setDraft(d=>({...d,[key]:value}));
  function reset(){setDraft({...empty});setEditing(null);setFeatureText('');}
  function edit(p){
    setDraft({...p,price:p.price??'',area_sqm:p.area_sqm??''});
    setEditing(p.id);
    setFeatureText(p.features.join('\n'));
    document.getElementById('property-editor').scrollIntoView({behavior:'smooth'});
  }
  async function save(e){
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try{
      const body={...draft,features:featureText.split('\n').map(s=>s.trim()).filter(Boolean)};
      await api('admin/properties'+(editing?'/'+editing:''),{method:editing?'PUT':'POST',body});
      setMessage(editing?'Property updated.':'Property created.');
      reset();
      listings.reload();
    }
    catch(e){setError(e.message);}
    finally{setBusy(false);}
  }
  async function remove(p){
    if(!window.confirm(`Delete “${p.title}”? This permanently removes the property.`))return;setBusy(true);
    setError('');
    try{await api('admin/properties/'+p.id,{method:'DELETE'});if(editing===p.id)reset();listings.reload();setMessage('Property deleted.');}catch(e){setError(e.message);}finally{setBusy(false);}
  }
  async function updateInquiry(id,status){
    setBusy(true);
    setError('');
    try{await api('admin/inquiries/'+id,{method:'PATCH',body:{status}});inquiries.reload();}catch(e){setError(e.message);}
    finally{setBusy(false);}
  }

  return (
    <section className="wrap admin-section">
      <span className="eyebrow">PROPERTY MANAGEMENT</span>
      <h1>Admin dashboard.</h1>
      <div className="action-row">
        <span>{listings.data?.total??'—'} properties · {inquiries.data?.total??'—'} enquiries</span>
        <Link className="outline" to="/account">My account</Link>
      </div>
      {error&&<p className="feedback error" role="alert">{error}</p>}
      {message&&<p className="feedback success" role="status">{message}</p>}
      <section className="form-panel" id="property-editor">
        <h2>{editing?'Edit property':'Add a property'}</h2>
        <p className="form-note">Drafts stay hidden. Set status to Available when a listing is ready for visitors. Prices are in naira.</p>
        <form onSubmit={save}>
          <label htmlFor="property-title">Title *</label>
          <input id="property-title" required maxLength={150} value={draft.title} onChange={e=>field('title',e.target.value)}/>
          <label htmlFor="property-description">Description *</label>
          <textarea id="property-description" required rows={5} maxLength={10000} value={draft.description} onChange={e=>field('description',e.target.value)}/>
          <div className="form-row">
            <div>
              <label htmlFor="property-type">Property type</label>
              <select id="property-type" value={draft.type} onChange={e=>field('type',e.target.value)}>{['Residential','Commercial','Land'].map(v=><option key={v}>{v}</option>)}</select>
            </div>
            <div>
              <label htmlFor="property-purpose">Purpose</label>
              <select id="property-purpose" value={draft.purpose} onChange={e=>field('purpose',e.target.value)}>
                <option>Buy</option>
                <option>Rent</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="property-category">Category *</label>
              <input id="property-category" placeholder="e.g. Apartment, Office, Land" required maxLength={80} value={draft.category} onChange={e=>field('category',e.target.value)}/>
            </div>
            <div>
              <label htmlFor="property-location">Location / address *</label>
              <input id="property-location" required maxLength={200} value={draft.location} onChange={e=>field('location',e.target.value)}/>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="property-price">Price (NGN; blank for price on request)</label>
              <input id="property-price" type="number" min="0" max="99999999999999" step="0.01" value={draft.price} onChange={e=>field('price',e.target.value)}/>
            </div>
            <div>
              <label htmlFor="property-period">Price period</label>
              <select id="property-period" value={draft.price_period} onChange={e=>field('price_period',e.target.value)}>
                <option value="total">Total</option>
                <option value="year">Per year</option>
                <option value="month">Per month</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="property-bedrooms">Bedrooms</label>
              <input id="property-bedrooms" type="number" min="0" max="1000" value={draft.bedrooms} onChange={e=>field('bedrooms',e.target.value)}/>
            </div>
            <div>
              <label htmlFor="property-bathrooms">Bathrooms</label>
              <input id="property-bathrooms" type="number" min="0" max="1000" value={draft.bathrooms} onChange={e=>field('bathrooms',e.target.value)}/>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="property-area">Area (m²; optional)</label>
              <input id="property-area" type="number" min="0" max="9999999999" step="0.01" value={draft.area_sqm} onChange={e=>field('area_sqm',e.target.value)}/>
            </div>
            <div>
              <label htmlFor="property-status">Status</label>
              <select id="property-status" value={draft.status} onChange={e=>field('status',e.target.value)}>{['draft','available','sold','rented'].map(v=><option key={v}>{v}</option>)}</select>
            </div>
          </div>
          <label htmlFor="property-image">Image URL or /assets/ filename</label>
          <input id="property-image" maxLength={2048} placeholder="https://… or /assets/home.jpg" value={draft.image} onChange={e=>field('image',e.target.value)}/>
          <p className="form-note">Use a hosted JPG, PNG or WebP URL, or a bundled image path. File uploads are not included.</p>
          <label htmlFor="property-features">Features (one per line, up to 20)</label>
          <textarea id="property-features" rows={4} value={featureText} onChange={e=>setFeatureText(e.target.value)}/>
          <div className="action-row">
            <label className="checkbox-label"><input type="checkbox" checked={draft.featured} onChange={e=>field('featured',e.target.checked)}/> Featured property</label>
            <label className="checkbox-label"><input type="checkbox" checked={draft.is_example} onChange={e=>field('is_example',e.target.checked)}/> Illustrative example</label>
          </div>
          <div className="action-row">
            <button className="button" disabled={busy}>{busy?'Saving…':editing?'Save changes':'Create property'}</button>
            {editing&&<button type="button" className="outline" onClick={reset}>Cancel editing</button>}
          </div>
        </form>
      </section>
      <h2 className="admin-subheading">Property listings</h2>
      <ApiState {...listings}/>
      {listings.data?.data.length===0&&<p>No properties yet. Add your first property above.</p>}
      <div className="admin-list">
        {listings.data?.data.map(p=><article className="admin-property" key={p.id}><img src={imageUrl(p.image)} alt={p.title}/><div><h3>{p.title}</h3><p>{p.location} · {priceLabel(p)}</p><span className="tag">{p.status}</span></div><div className="action-row"><button className="outline" disabled={busy} onClick={()=>edit(p)}>Edit</button><button className="outline danger" disabled={busy} onClick={()=>remove(p)}>Delete</button></div></article>)}
      </div>
      {listings.data&&listings.data.total>20&&<div className="action-row"><button disabled={page<=1} className="outline" onClick={()=>setPage(p=>p-1)}>Previous</button><span>Page {page}</span><button className="outline" disabled={page*20>=listings.data.total} onClick={()=>setPage(p=>p+1)}>Next</button></div>}
      <h2 className="admin-subheading">Customer enquiries</h2>
      <ApiState {...inquiries}/>
      {inquiries.data?.data.length===0&&<p>No enquiries yet.</p>}
      {inquiries.data?.data.map(i=><article className="inquiry" key={i.id}><h3>{i.name} · {i.interest}</h3><p><a href={`mailto:${i.email}`}>{i.email}</a> · {i.phone}</p><p>{i.location} {i.budget&&`· Budget: ${i.budget}`}</p>{i.property_id&&<p>Property ID: {i.property_id}</p>}<p className="preserve-lines">{i.message}</p><label htmlFor={'inquiry-'+i.id}>Status</label><select id={'inquiry-'+i.id} disabled={busy} value={i.status} onChange={e=>updateInquiry(i.id,e.target.value)}>{['new','contacted','closed'].map(s=><option key={s}>{s}</option>)}</select></article>)}
      {inquiries.data&&inquiries.data.total>20&&<div className="action-row"><button disabled={inquiryPage<=1} className="outline" onClick={()=>setInquiryPage(p=>p-1)}>Previous</button><span>Page {inquiryPage}</span><button className="outline" disabled={inquiryPage*20>=inquiries.data.total} onClick={()=>setInquiryPage(p=>p+1)}>Next</button></div>}
    </section>
  );
}
