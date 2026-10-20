import {Navigate,useLocation} from 'react-router-dom';
import {useAuth} from '../context/Auth';

export default function ProtectedRoute({admin=false,children}) {
  const {user,loading,error}=useAuth();
  const location=useLocation();
  if(loading)return <section className="wrap page-heading"><p role="status">Checking your session…</p></section>;
  if(error)return <section className="wrap page-heading"><h1>Connection unavailable.</h1><p role="alert">{error}</p><button className="button" onClick={()=>window.location.reload()}>Try again</button></section>;
  if(!user)return <Navigate to="/login" state={{from:location.pathname+location.search}} replace/>;
  if(admin&&user.role!=='admin')return <Navigate to="/account" replace/>;
  
  return children;
}
