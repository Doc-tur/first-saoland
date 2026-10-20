import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../context/Auth';
import {useApi} from '../hooks/useApi';
import ApiState from '../components/ApiState';

export default function Account(){
  const {user,logout}=useAuth();
  const [error,setError]=useState('');
  const [page,setPage]=useState(1);
  const result=useApi('inquiries?page='+page);
  
  return (
    <section className="wrap page-heading account-section">
      <span className="eyebrow">YOUR ACCOUNT</span>
      <h1>Hello, {user.name}.</h1>
      <p>{user.email}</p>
      <div className="action-row">
        <Link className="button" to="/properties">Explore properties ↗</Link>
        <Link className="outline" to="/contact">Make an enquiry</Link>
        {user.role==='admin'&&<Link className="outline" to="/admin">Admin dashboard</Link>}
        <button className="outline" onClick={()=>logout().catch(e=>setError(e.message))}>Log out</button>
      </div>
      {error&&<p role="alert">{error}</p>}
      <h2>Your enquiries</h2>
      <ApiState {...result}/>
      {result.data?.data.length===0&&<p>You haven’t submitted an enquiry yet.</p>}
      {result.data?.data.map(i=><article className="inquiry" key={i.id}><div><strong>{i.interest}</strong> <span className="tag">{i.status}</span></div><p className="preserve-lines">{i.message}</p><small>{i.created_at}</small></article>)}
      {result.data&&result.data.total>20&&<div className="action-row"><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</button><span>Page {page}</span><button disabled={page*20>=result.data.total} onClick={()=>setPage(p=>p+1)}>Next</button></div>}
    </section>
  );
}
