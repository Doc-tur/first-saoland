import {useState} from 'react';
import {Link,useLocation,useNavigate,Navigate} from 'react-router-dom';
import {useAuth} from '../context/Auth';

export default function AuthPage({signup=false}) {
  const {user,loading,login,signup:register}=useAuth();
  const navigate=useNavigate(),location=useLocation();
  const [error,setError]=useState(''),[busy,setBusy]=useState(false);
  const from=location.state?.from;
  const next=typeof from==='string'&&from.startsWith('/')&&!from.startsWith('//')?from:null;
  if(!loading&&user)return <Navigate to={next||(user.role==='admin'?'/admin':'/account')} replace/>;
  async function submit(e){
    e.preventDefault();
    const d=Object.fromEntries(new FormData(e.currentTarget));
    if(signup&&d.password!==d.confirm){setError('The passwords do not match.');return;}
    setBusy(true);
    setError('');
    try{const result=await (signup?register:login)(d);navigate(next||(result.role==='admin'?'/admin':'/account'),{replace:true});}catch(e){setError(e.message);}finally{setBusy(false);}
  }

  return (
    <section className="wrap auth-section">
      <div className="form-panel auth-panel">
        <span className="eyebrow">FIRST SAOLAND ACCOUNT</span>
        <h1>{signup?'Create your account.':'Welcome back.'}</h1>
        <p>{signup?'Track your enquiries and connect with our property team.':'Log in to your account to continue.'}</p>
        <form onSubmit={submit}>
          {signup&&<><label htmlFor="auth-name">Full name</label><input id="auth-name" name="name" autoComplete="name" required maxLength={100}/></>}
          <label htmlFor="auth-email">Email address</label>
          <input id="auth-email" name="email" type="email" autoComplete="email" required maxLength={190}/>
          <label htmlFor="auth-password">Password</label>
          <input id="auth-password" name="password" type="password" autoComplete={signup?'new-password':'current-password'} required minLength={10} maxLength={72}/>
          {signup&&<><p className="form-note">Use 10–72 characters. Longer passphrases are welcome.</p><label htmlFor="auth-confirm">Confirm password</label><input id="auth-confirm" name="confirm" type="password" autoComplete="new-password" required minLength={10} maxLength={72}/></>}
          {error&&<p role="alert" className="feedback error">{error}</p>}
          <button disabled={busy||loading} className="button">{busy?'Please wait…':signup?'Create account':'Log in'}</button>
        </form>
        <p className="auth-switch">{signup?'Already have an account?':'New to First Saoland?'} <Link className="text-link" state={location.state} to={signup?'/login':'/signup'}>{signup?'Log in':'Sign up'}</Link></p>
      </div>
    </section>
  );
}
