import {createContext,useContext,useState,useEffect} from 'react';
import {api,session} from '../lib/api';

const Context=createContext(null);

export function AuthProvider({children}) {
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
  useEffect(()=>{let active=true;session().then(d=>{if(active)setUser(d.user);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
  return()=>{active=false;};},[]);
  async function authenticate(route,details){const d=await api(route,{method:'POST',body:details});setUser(d.user);setError('');return d.user;}
  async function logout(){await api('auth/logout',{method:'POST'});setUser(null);}

  return (
    <Context.Provider value={{user,loading,error,login:d=>authenticate('auth/login',d),signup:d=>authenticate('auth/signup',d),logout}}>{children}</Context.Provider>
  );
}
export const useAuth=()=>useContext(Context);
