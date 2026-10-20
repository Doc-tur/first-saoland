import AuthPage from './pages/AuthPage';
import Account from './pages/Account';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import {useEffect} from 'react';
import {Routes,Route,Link,useLocation} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import ContactUs from './pages/ContactUs';

function PageEffects(){
  const {pathname,hash}=useLocation();
  useEffect(()=>{
    const titles={
      '/':'Homes, spaces & possibilities',
      '/properties':'Explore properties',
      '/services':'Services',
      '/about':'About us',
      '/contact':'Let’s Talk & enquiries',
      '/contact-us':'Contact us',
      '/login':'Log in',
      '/signup':'Sign up',
      '/account':'My account',
      '/admin':'Admin dashboard'
    };
    document.title=`${titles[pathname]||'Property overview'} | First Saoland`;
    if(hash){requestAnimationFrame(()=>document.getElementById(hash.slice(1))?.scrollIntoView());}else window.scrollTo(0,0);
  },[pathname,hash]);
  return null;
}

export default function App(){
  return (
    <>
    <PageEffects/>
    <a className="skip" href="#main" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus();}}>Skip to content</a>
    <Navbar/>
    <main id="main" tabIndex={-1}>
      <Routes>
        <Route path="/login" element={<AuthPage key="login"/>}/>
        <Route path="/signup" element={<AuthPage key="signup" signup/>}/>
        <Route path="/account" element={<ProtectedRoute><Account/></ProtectedRoute>}/>
        <Route path="/admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/properties" element={<Properties/>}/>
        <Route path="/properties/:id" element={<PropertyDetails/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/contact-us" element={<ContactUs/>}/>
        <Route path="*" element={<section className="wrap page-heading"><h1>Page not found.</h1><Link className="button" to="/">Return home ↗</Link></section>}/>
      </Routes>
    </main>
    <Footer/>
    </>
  );
}
