import {createContext,useContext,useState,useEffect} from 'react';

const Context=createContext();

export function SavedPropertiesProvider({children}){
  const [saved,setSaved]=useState(()=>{try{const value=JSON.parse(localStorage.getItem('saoland-saved')||'[]');
    return Array.isArray(value)?value.filter(v=>typeof v==='string').slice(0,200):[];}catch{return [];}});
    useEffect(()=>{try{localStorage.setItem('saoland-saved',JSON.stringify(saved));}catch{}},[saved]);
    const toggle=id=>setSaved(old=>old.includes(id)?old.filter(x=>x!==id):[...old.slice(-199),id]);
  
  return <Context.Provider value={{saved,toggle}}>{children}</Context.Provider>;
}
export const useSavedProperties=()=>useContext(Context);
