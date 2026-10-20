import {useEffect,useState} from 'react';
import {api} from '../lib/api';

export function useApi(route) {
  const [state,setState]=useState({data:null,loading:true,error:''});
  const [version,setVersion]=useState(0);
  useEffect(()=>{
    let active=true;
    const controller=new AbortController();
    setState({data:null,loading:true,error:''});
    api(route,{signal:controller.signal}).then(data=>{if(active)setState({data,loading:false,error:''});}).catch(e=>{if(active&&e.name!=='AbortError')setState({data:null,loading:false,error:e.message});});
    return()=>{active=false;controller.abort();};
  },[route,version]);
  
  return {...state,reload:()=>setVersion(v=>v+1)};
}
