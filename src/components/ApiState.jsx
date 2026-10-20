export default function ApiState({loading,error,reload}) {
  if(loading)return <p role="status">Loading…</p>;
  if(error)return <div className="feedback error" role="alert"><p>{error}</p><button className="outline" onClick={reload}>Try again</button></div>;
  
  return null;
}
