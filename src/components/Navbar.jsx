import {useAuth} from '../context/Auth';
import {useState,useEffect} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';

export default function Navbar(){
  const {user}=useAuth();
  const [open,setOpen]=useState(false);
  const location=useLocation();
  useEffect(()=>setOpen(false),[location]);
  
  return (
    <header className={open?'menu-open':''}>
      <Link className="brand" to="/"><span className="brand-icon">⌂</span><span>FIRST SAOLAND<small>HOMES & INVESTMENT LIMITED</small></span></Link>
      <button className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>☰</button>
      <nav aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/properties">Properties</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/about">About us</NavLink>
        <NavLink to="/contact-us">Contact us</NavLink>
        <NavLink className="nav-cta" to="/contact">Let’s talk <span>↗</span></NavLink>
        <NavLink to={user?'/account':'/login'}>{user?'My account':'Log in'}</NavLink>
        {!user&&<NavLink to="/signup">Sign up</NavLink>}
      </nav>
    </header>
  );
}
